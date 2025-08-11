use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use crate::state::TimerState;

pub fn start_timer(timer_state: Arc<Mutex<TimerState>>, duration_ms: u64) {
    let mut state = timer_state.lock().unwrap();
    *state = TimerState {
        duration: Some(Duration::from_millis(duration_ms)),
        start_time: Some(Instant::now()),
        is_running: true,
        is_paused: false,
        paused_time: Duration::new(0, 0),
        elapsed_ms: 0,
    };
}

pub fn pause_timer(timer_state: Arc<Mutex<TimerState>>) {
    let mut state = timer_state.lock().unwrap();
    if state.is_running && !state.is_paused {
        if let Some(start_time) = state.start_time {
            state.paused_time += start_time.elapsed();
            state.elapsed_ms = state.paused_time.as_millis() as u64;
        }
        state.is_paused = true;
    }
}

pub fn resume_timer(timer_state: Arc<Mutex<TimerState>>) {
    let mut state = timer_state.lock().unwrap();
    if state.is_running && state.is_paused {
        state.start_time = Some(Instant::now());
        state.is_paused = false;
    }
}

pub fn stop_timer(timer_state: Arc<Mutex<TimerState>>) {
    let mut state = timer_state.lock().unwrap();
    *state = TimerState::default();
}

pub fn get_status(timer_state: Arc<Mutex<TimerState>>) -> TimerState {
    let mut state = timer_state.lock().unwrap();
    
    // Update elapsed_ms for current status
    if state.is_running && !state.is_paused {
        if let Some(start_time) = state.start_time {
            state.elapsed_ms = (state.paused_time + start_time.elapsed()).as_millis() as u64;
        }
    } else if state.is_paused {
        state.elapsed_ms = state.paused_time.as_millis() as u64;
    }
    
    state.clone()
}