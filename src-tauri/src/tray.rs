use tauri::menu::{Menu, MenuItem, Submenu};
use tauri::tray::TrayIconEvent;
use tauri::{App, AppHandle, Manager, Position, PhysicalPosition};

pub fn build_tray_menu(app: &mut App) -> Result<Menu<tauri::Wry>, tauri::Error> {
    // Language submenu
    let english_item = MenuItem::with_id(app, "lang_en", "English", true, None::<&str>)?;
    let swedish_item = MenuItem::with_id(app, "lang_sv", "Svenska", true, None::<&str>)?;
    let german_item = MenuItem::with_id(app, "lang_de", "Deutsch", true, None::<&str>)?;
    
    let language_menu = Submenu::with_id_and_items(
        app, 
        "language", 
        "Language", 
        true, 
        &[&english_item, &swedish_item, &german_item]
    )?;
    
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    
    Menu::with_items(app, &[&language_menu, &quit_item])
}

pub fn handle_tray_event(app: &AppHandle, event: &TrayIconEvent) {
    match event {
        TrayIconEvent::Click {
            button: tauri::tray::MouseButton::Left,
            ..
        } => {
            if let Some(window) = app.get_webview_window("main") {
                if window.is_visible().unwrap_or(false) {
                    let _ = window.hide();
                } else {
                    // Position window under tray icon
                    if let Ok(monitor) = window.current_monitor() {
                        if let Some(monitor) = monitor {
                            let size = monitor.size();
                            let scale_factor = monitor.scale_factor();
                            let window_width = 400;
                            
                            let logical_width = size.width as f64 / scale_factor;
                            let tray_area_from_right = 180.0;
                            let desired_window_center = logical_width - tray_area_from_right;
                            let logical_x = desired_window_center - (window_width as f64 / 2.0);
                            let logical_y = 24.0;
                            
                            let x = (logical_x * scale_factor) as i32;
                            let y = (logical_y * scale_factor) as i32;
                            
                            let _ = window.set_position(Position::Physical(PhysicalPosition { x, y }));
                        }
                    }
                    
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        }
        _ => {}
    }
}

pub fn handle_menu_event(app: &AppHandle, event: &tauri::menu::MenuEvent) {
    match event.id().as_ref() {
        "lang_en" => {
            println!("Language changed to English");
            // TODO: Implement language change logic
        }
        "lang_sv" => {
            println!("Language changed to Swedish");
            // TODO: Implement language change logic
        }
        "lang_de" => {
            println!("Language changed to German");
            // TODO: Implement language change logic
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}

// Timer updates are now handled via system notifications instead of tray display
// The update_tray_timer function is kept for compatibility but does nothing