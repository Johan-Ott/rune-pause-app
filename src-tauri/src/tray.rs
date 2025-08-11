use tauri::menu::{Menu, MenuItem, Submenu};
use tauri::tray::TrayIconEvent;
use tauri::{App, AppHandle, Manager};

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
        TrayIconEvent::Click { .. } => {
            if let Some(window) = app.get_webview_window("main") {
                if window.is_visible().unwrap_or(false) {
                    let _ = window.hide();
                } else {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        }
        TrayIconEvent::DoubleClick { .. } => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
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

pub fn update_tray_timer(app: &AppHandle, timer_text: &str) -> Result<(), tauri::Error> {
    if let Some(tray) = app.tray_by_id("main") {
        // Update tooltip
        tray.set_tooltip(Some(format!("Rune Pause - {}", timer_text)))?;
        
        // Update tray title (shows text next to icon on macOS)
        #[cfg(target_os = "macos")]
        {
            tray.set_title(Some(timer_text))?;
        }
    }
    Ok(())
}