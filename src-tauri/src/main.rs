#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod ffmpeg;

use tauri::command;
use uuid::Uuid;

#[command]
fn import_audio(path: String) -> Clip {
    let duration = ffmpeg::get_duration(&path);
    
    Clip {
        id: Uuid::new_v4().to_string(),
        track_id: "track_4".to_string(),
        file_path: path,
        start: 0.0,
        duration,
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct Clip {
    id: String,
    track_id: String,
    file_path: String,
    start: f64,
    duration: f64,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![import_audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
