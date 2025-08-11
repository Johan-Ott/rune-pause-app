#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "macos")]
use cocoa::appkit::{NSApp, NSApplication, NSApplicationActivationPolicy};

mod state;
mod timer;
mod commands;
mod tray;

use tauri::{Manager, Size, LogicalSize, WindowEvent};
use tauri::tray::TrayIconBuilder;
use state::AppState;

fn main() {
  tauri::Builder::default()
    .manage(AppState::default())
    .on_window_event(|window, event| {
      if let WindowEvent::CloseRequested { api, .. } = event {
        let _ = window.hide();
        api.prevent_close();
      }
    })
    .invoke_handler(tauri::generate_handler![
      commands::start_timer,
      commands::pause_timer,
      commands::resume_timer,
      commands::stop_timer,
      commands::get_status,
      commands::update_tray_timer
    ])
    .setup(|app| {
      #[cfg(target_os = "macos")]
      unsafe {
        let ns_app = NSApp();
        ns_app.setActivationPolicy_(NSApplicationActivationPolicy::NSApplicationActivationPolicyAccessory);
      }
      
            // Create tray icon with menu
      let menu = tray::build_tray_menu(app)?;
      
      let tray_builder = TrayIconBuilder::with_id("main")
        .tooltip("Rune Pause - 00:00")
        .icon_as_template(true) // Better for macOS dark/light mode
        .menu(&menu)
        .on_tray_icon_event(|tray, event| {
          tray::handle_tray_event(tray.app_handle(), &event);
        })
        .on_menu_event(|app, event| {
          tray::handle_menu_event(app, &event);
        });
      
      #[cfg(target_os = "macos")]
      let tray_builder = tray_builder.title("⏹ 00:00");
      
      let _tray = tray_builder.build(app)?;

      if let Some(win) = app.get_webview_window("main") {
        let _ = win.set_skip_taskbar(true);
        let _ = win.hide(); // Hide window by default
        if let (Ok(sf), Ok(size)) = (win.scale_factor(), win.outer_size()) {
          let w = (size.width as f64 / sf).round();
          let h = (size.height as f64 / sf).round();
          let _ = win.set_size(Size::Logical(LogicalSize { width: w, height: h }));
        }
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
