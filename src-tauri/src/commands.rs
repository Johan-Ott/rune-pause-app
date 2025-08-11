use tauri::State;
use crate::state::AppState;
use crate::timer;
use crate::tray;

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
pub fn update_tray_timer(app: tauri::AppHandle, timer_text: String) -> Result<(), String> {
    tray::update_tray_timer(&app, &timer_text).map_err(|e| e.to_string())
}
