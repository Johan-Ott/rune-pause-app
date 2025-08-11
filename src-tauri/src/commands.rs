use tauri::{State, Manager};
use crate::state::AppState;
use crate::timer;

#[tauri::command]
pub fn start_timer(state: State<AppState>, ms: u64) {
    timer::start_timer(state.timer_state.clone(), ms);
}

#[tauri::command]
pub fn pause_timer(state: State<AppState>) {
    timer::pause_timer(state.timer_state.clone());
}

#[tauri::command]
pub fn resume_timer(state: State<AppState>) {
    timer::resume_timer(state.timer_state.clone());
}

#[tauri::command]
pub fn stop_timer(state: State<AppState>) {
    timer::stop_timer(state.timer_state.clone());
}

#[tauri::command]
pub fn get_status(state: State<AppState>) -> crate::state::TimerState {
    timer::get_status(state.timer_state.clone())
}

#[tauri::command]
pub fn send_notification(app: tauri::AppHandle, title: String, body: String) -> Result<(), String> {
    use tauri_plugin_notification::NotificationExt;
    
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_tray_timer(_app: tauri::AppHandle, _timer_text: String) -> Result<(), String> {
    // Remove timer from tray - we use notifications instead
    Ok(())
}

#[tauri::command]
pub fn show_fullscreen_pause(app: tauri::AppHandle, pause_type: String, duration: u32, sound_enabled: bool, sound_type: String) -> Result<(), String> {
    if let Some(main_window) = app.get_webview_window("main") {
        // Switch to fullscreen mode
        main_window.set_fullscreen(true).map_err(|e| e.to_string())?;
        main_window.set_always_on_top(true).map_err(|e| e.to_string())?;
        main_window.show().map_err(|e| e.to_string())?;
        main_window.set_focus().map_err(|e| e.to_string())?;
        
        // Send pause config to frontend via JavaScript evaluation
        let script = format!(r#"
            window.startFullscreenPause({{
                type: "{}",
                duration: {},
                soundEnabled: {},
                soundType: "{}"
            }});
        "#, pause_type, duration, sound_enabled, sound_type);
        
        main_window.eval(&script).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
pub fn close_fullscreen_pause(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(main_window) = app.get_webview_window("main") {
        // Exit fullscreen and hide window
        main_window.set_fullscreen(false).map_err(|e| e.to_string())?;
        main_window.set_always_on_top(true).map_err(|e| e.to_string())?; // Keep always on top for tray
        main_window.hide().map_err(|e| e.to_string())?;
        
        // Tell frontend to exit pause mode
        let script = "window.exitFullscreenPause && window.exitFullscreenPause();";
        let _ = main_window.eval(script);
    }
    
    Ok(())
}
