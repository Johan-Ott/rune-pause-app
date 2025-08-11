use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use serde::{Serialize, Deserialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TimerState {
    pub duration: Option<Duration>,
    #[serde(skip)]
    pub start_time: Option<Instant>,
    pub is_running: bool,
    pub is_paused: bool,
    pub paused_time: Duration,
    pub elapsed_ms: u64, // For serialization instead of Instant
}

impl Default for TimerState {
    fn default() -> Self {
        Self {
            duration: None,
            start_time: None,
            is_running: false,
            is_paused: false,
            paused_time: Duration::new(0, 0),
            elapsed_ms: 0,
        }
    }
}

#[derive(Default)]
pub struct AppState {
    pub timer_state: Arc<Mutex<TimerState>>,
}