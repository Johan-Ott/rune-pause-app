use tauri::{AppHandle, Emitter, Manager};
use chrono::Local;
use std::{fs::OpenOptions, io::Write, path::PathBuf};
use core_timer::{Engine, Settings as CoreSettings};
use crate::state::{Persist, UiSettings};
use std::sync::{Arc, Mutex};

pub struct AppState { pub engine: Arc<Mutex<Engine>>, pub persist: Persist, pub obsidian_vault: Option<PathBuf> }

#[tauri::command]
pub fn start_timer(app: AppHandle, state: tauri::State<'_, AppState>) -> Result<(), String> {
  let app2 = app.clone();
  let engine = state.engine.clone();
  
  // Get the receiver outside of the async context
  let rx = {
    let engine_guard = engine.lock().unwrap();
    engine_guard.subscribe()
  };
  
  // Spawn the tick handler
  tauri::async_runtime::spawn({
    let app = app2.clone();
    let mut rx = rx;
    async move {
      while let Ok(tick) = rx.recv().await {
        let _ = app.emit("tick", &tick);
        if let Some(tray) = app.tray_by_id("main") {
          let _ = tray.set_tooltip(Some(format!("{}  {:02}:{:02}", format!("{:?}", tick.phase), tick.seconds_left/60, tick.seconds_left%60)));
          #[cfg(target_os = "macos")] { let _ = tray.set_title(Some(format!("{:02}:{:02}", tick.seconds_left/60, tick.seconds_left%60))); }
        }
        match tick.phase {
          core_timer::Phase::Break | core_timer::Phase::MicroBreak => {
            if let Some(ov) = app.get_webview_window("overlay") { let _ = ov.show(); let _ = ov.set_focus(); let _ = ov.set_always_on_top(true); }
          },
          core_timer::Phase::Focus => {
            if let Some(ov) = app.get_webview_window("overlay") { let _ = ov.hide(); }
          },
          _ => {}
        }
      }
    }
  });
  
  // Spawn the engine runner in a separate task
  std::thread::spawn(move || {
    tauri::async_runtime::block_on(async move {
      let mut engine_guard = engine.lock().unwrap();
      engine_guard.run().await;
    });
  });
  
  Ok(())
}
#[tauri::command] pub fn stop_timer(state: tauri::State<'_, AppState>) { state.engine.lock().unwrap().interrupt(); }
#[tauri::command] pub fn cmd_load_settings(state: tauri::State<'_, AppState>) -> Result<UiSettings, String> { Ok(state.persist.load()) }
#[tauri::command] pub fn cmd_save_settings(state: tauri::State<'_, AppState>, settings: UiSettings) -> Result<(), String> {
  state.persist.save(&settings);
  let mut e = state.engine.lock().unwrap();
  e.settings = CoreSettings{
    focus_minutes: settings.focusMin, break_minutes: settings.breakMin,
    micro_every: settings.microEvery, micro_minutes: settings.microMin,
    hard_break: settings.hardBreak, snooze_sec: settings.snoozeSec,
  }; Ok(())
}
#[tauri::command] pub fn cmd_snooze(state: tauri::State<'_, AppState>) -> Result<(), String> { state.engine.lock().unwrap().interrupt(); Ok(()) }
#[tauri::command]
pub fn cmd_update_hotkeys(app: tauri::AppHandle, settings: UiSettings) -> Result<(), String> {
  use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};
  
  let manager = app.global_shortcut();
  
  // Unregister all existing shortcuts
  if let Err(e) = manager.unregister_all() {
    println!("Warning: Failed to unregister shortcuts: {}", e);
  }
  
  // Register start hotkey
  if let Some(hotkey_str) = settings.hotkeys.get("start") {
    match hotkey_str.parse::<Shortcut>() {
      Ok(shortcut) => {
        let app_clone = app.clone();
        if let Err(e) = manager.on_shortcut(shortcut, move |_app, _shortcut, _event| {
          let _ = app_clone.emit("hk-start", ());
        }) {
          println!("Warning: Failed to register start hotkey: {}", e);
        }
      }
      Err(e) => println!("Warning: Failed to parse start hotkey '{}': {}", hotkey_str, e),
    }
  }
  
  // Register stop hotkey
  if let Some(hotkey_str) = settings.hotkeys.get("stop") {
    match hotkey_str.parse::<Shortcut>() {
      Ok(shortcut) => {
        let app_clone = app.clone();
        if let Err(e) = manager.on_shortcut(shortcut, move |_app, _shortcut, _event| {
          let _ = app_clone.emit("hk-stop", ());
        }) {
          println!("Warning: Failed to register stop hotkey: {}", e);
        }
      }
      Err(e) => println!("Warning: Failed to parse stop hotkey '{}': {}", hotkey_str, e),
    }
  }
  
  // Register snooze hotkey
  if let Some(hotkey_str) = settings.hotkeys.get("snooze") {
    match hotkey_str.parse::<Shortcut>() {
      Ok(shortcut) => {
        let app_clone = app.clone();
        if let Err(e) = manager.on_shortcut(shortcut, move |_app, _shortcut, _event| {
          let _ = app_clone.emit("hk-snooze", ());
        }) {
          println!("Warning: Failed to register snooze hotkey: {}", e);
        }
      }
      Err(e) => println!("Warning: Failed to parse snooze hotkey '{}': {}", hotkey_str, e),
    }
  }
  
  Ok(())
}
#[tauri::command]
pub fn write_pause_log(state: tauri::State<'_, AppState>, summary: String) -> Result<(), String> {
  if let Some(vault) = &state.obsidian_vault {
    let date = Local::now().format("%Y-%m-%d").to_string();
    let path = vault.join(format!("Daily/{}.md", date));
    std::fs::create_dir_all(path.parent().unwrap()).map_err(|e| e.to_string())?;
    let line = format!("
- ⏸ {} — {}
", Local::now().format("%H:%M"), summary);
    let mut f = OpenOptions::new().create(true).append(true).open(&path).map_err(|e| e.to_string())?;
    f.write_all(line.as_bytes()).map_err(|e| e.to_string())?;
  } Ok(()) }
