// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod state;
mod bridge;
mod idle;

use tauri::{
    AppHandle, WebviewUrl, WebviewWindowBuilder,
    tray::{TrayIconBuilder, TrayIconEvent},
    menu::{Menu, MenuItem, PredefinedMenuItem, Submenu},
    Manager, Emitter,
};
use std::path::PathBuf;
use core_timer::{Engine, Settings as CoreSettings};
use bridge::AppState;
use serde::{Deserialize, Serialize};

#[cfg(target_os = "macos")] 
fn conf_dir() -> PathBuf { 
    dirs::home_dir().unwrap().join("Library/Application Support/RunePause") 
}

#[cfg(target_os = "windows")] 
fn conf_dir() -> PathBuf { 
    dirs::data_dir().unwrap().join("RunePause") 
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TimerSettings {
    pub focus_minutes: u64,
    pub break_minutes: u64,
    pub micro_every: u64,
    pub micro_minutes: u64,
    pub hard_break: bool,
    pub snooze_sec: u64,
}

#[tauri::command]
async fn show_config_window(app_handle: AppHandle) -> Result<(), String> {
    match app_handle.get_webview_window("config") {
        Some(window) => {
            // Position window near system tray
            if let Ok(monitor) = window.current_monitor() {
                if let Some(monitor) = monitor {
                    let size = monitor.size();
                    let scale = monitor.scale_factor();
                    
                    // Position directly under menu bar, right-aligned
                    let x = (size.width as f64 / scale) - 220.0;
                    let y = 25.0;
                    
                    let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition { x, y }));
                }
            }
            
            let _ = window.show();
            let _ = window.set_focus();
        }
        None => {
            let window = WebviewWindowBuilder::new(
                &app_handle,
                "config",
                WebviewUrl::App("index.html#config".into()),
            )
            .title("Rune Pause")
            .inner_size(180.0, 200.0)
            .decorations(false)
            .resizable(false)
            .always_on_top(true)
            .shadow(false)
            .transparent(true)
            .skip_taskbar(true)
            .build();

            // Position the new window
            if let Ok(window) = window {
                if let Ok(monitor) = window.current_monitor() {
                    if let Some(monitor) = monitor {
                        let size = monitor.size();
                        let scale = monitor.scale_factor();
                        
                        let x = (size.width as f64 / scale) - 220.0;
                        let y = 25.0;
                        
                        let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition { x, y }));
                    }
                }
            }
        }
    }
    Ok(())
}

#[tauri::command]
async fn hide_config_window(app_handle: AppHandle) -> Result<(), String> {
    if let Some(window) = app_handle.get_webview_window("config") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn show_pause_window(app_handle: AppHandle, break_type: String) -> Result<(), String> {
    match app_handle.get_webview_window("pause") {
        Some(window) => {
            let _ = window.show();
            let _ = window.set_focus();
        }
        None => {
            let _window = WebviewWindowBuilder::new(
                &app_handle,
                "pause",
                WebviewUrl::App(format!("index.html#pause?type={}", break_type).into()),
            )
            .title("Break Time")
            .fullscreen(true)
            .decorations(false)
            .always_on_top(true)
            .skip_taskbar(true)
            .build();
        }
    }
    Ok(())
}

#[tauri::command]
async fn hide_pause_window(app_handle: AppHandle) -> Result<(), String> {
    if let Some(window) = app_handle.get_webview_window("pause") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn create_tray_menu(app_handle: &AppHandle) -> Result<Menu<tauri::Wry>, Box<dyn std::error::Error>> {
    let open_item = MenuItem::with_id(app_handle, "config", "Öppna Rune Pause", true, None::<&str>)?;
    let break_item = MenuItem::with_id(app_handle, "break", "Vila nu", true, None::<&str>)?;
    
    // Language submenu
    let lang_sv = MenuItem::with_id(app_handle, "lang_sv", "Svenska", true, None::<&str>)?;
    let lang_en = MenuItem::with_id(app_handle, "lang_en", "English", true, None::<&str>)?;
    let lang_pl = MenuItem::with_id(app_handle, "lang_pl", "Polski", true, None::<&str>)?;
    let lang_de = MenuItem::with_id(app_handle, "lang_de", "Deutsch", true, None::<&str>)?;
    let lang_es = MenuItem::with_id(app_handle, "lang_es", "Español", true, None::<&str>)?;
    
    let language_submenu = Submenu::with_items(app_handle, "Språk", true, &[
        &lang_sv, &lang_en, &lang_pl, &lang_de, &lang_es
    ])?;
    
    let separator = PredefinedMenuItem::separator(app_handle)?;
    let quit_item = MenuItem::with_id(app_handle, "quit", "Avsluta", true, None::<&str>)?;
    
    Menu::with_items(app_handle, &[
        &open_item,
        &break_item,
        &separator,
        &language_submenu,
        &separator,
        &quit_item,
    ]).map_err(|e| e.into())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            // Hide dock icon on macOS using private API
            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            }

            // Initialize app state
            let persist = state::Persist::new(conf_dir());
            let ui = persist.load();
            let core = CoreSettings {
                focus_minutes: ui.focusMin,
                break_minutes: ui.breakMin,
                micro_every: ui.microEvery,
                micro_minutes: ui.microMin,
                hard_break: ui.hardBreak,
                snooze_sec: ui.snoozeSec,
            };
            let engine = std::sync::Arc::new(std::sync::Mutex::new(Engine::new(core)));
            let vault = ui.obsidianVault.as_ref().map(|s| PathBuf::from(s));
            app.manage(AppState {
                engine,
                persist,
                obsidian_vault: vault,
            });

            // Create tray menu
            let tray_menu = create_tray_menu(app.handle())?;

            // Build system tray
            let _tray = TrayIconBuilder::with_id("main")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .show_menu_on_left_click(true)
                .on_tray_icon_event(move |tray, event| {
                    let app_handle = tray.app_handle().clone();
                    
                    match event {
                        TrayIconEvent::Click {
                            button: tauri::tray::MouseButton::Left,
                            button_state: tauri::tray::MouseButtonState::Up,
                            ..
                        } => {
                            // Left click shows menu automatically when show_menu_on_left_click is true
                        }
                        TrayIconEvent::Click {
                            button: tauri::tray::MouseButton::Right,
                            button_state: tauri::tray::MouseButtonState::Up,
                            ..
                        } => {
                            tauri::async_runtime::spawn(async move {
                                let _ = show_config_window(app_handle).await;
                            });
                        }
                        _ => {}
                    }
                })
                .on_menu_event(|app, event| {
                    let app_handle = app.clone();
                    
                    tauri::async_runtime::spawn(async move {
                        match event.id.as_ref() {
                            "config" => {
                                let _ = show_config_window(app_handle).await;
                            }
                            "break" => {
                                let _ = show_pause_window(app_handle, "short".to_string()).await;
                            }
                            "lang_sv" | "lang_en" | "lang_pl" | "lang_de" | "lang_es" => {
                                let language = match event.id.as_ref() {
                                    "lang_sv" => "sv",
                                    "lang_en" => "en", 
                                    "lang_pl" => "pl",
                                    "lang_de" => "de",
                                    "lang_es" => "es",
                                    _ => "sv"
                                };
                                
                                // Emit language change event to frontend
                                let _ = app_handle.emit("language_changed", language);
                            }
                            "quit" => {
                                std::process::exit(0);
                            }
                            _ => {}
                        }
                    });
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            bridge::start_timer,
            bridge::stop_timer,
            bridge::cmd_load_settings,
            bridge::cmd_save_settings,
            bridge::cmd_snooze,
            bridge::write_pause_log,
            bridge::cmd_update_hotkeys,
            show_config_window,
            hide_config_window,
            show_pause_window,
            hide_pause_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
