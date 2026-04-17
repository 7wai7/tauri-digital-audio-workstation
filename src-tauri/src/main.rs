#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod ffmpeg;

use std::process::Command;
use tauri::command;
use uuid::Uuid;

#[command]
fn import_audio(path: String) -> Clip {
    let duration = ffmpeg::get_duration(&path);

    Clip {
        id: Uuid::new_v4().to_string(),
        track_id: "track_4".to_string(),
        file_path: path,
        start: -10.0,
        duration,
    }
}

// #[command]
// fn render_timeline(clips: Vec<Clip>) -> String {
//     let mut cmd = Command::new("ffmpeg");

//     // inputs
//     for clip in &clips {
//         cmd.arg("-i").arg(&clip.file_path);
//     }

//     // filter_complex
//     let mut filters = Vec::new();

//     for (i, clip) in clips.iter().enumerate() {
//         let delay_ms = (clip.start * 1000.0) as i64;

//         filters.push(format!("[{}:a]adelay={}|{}[a{}]", i, delay_ms, delay_ms, i));
//     }

//     let inputs: Vec<String> = (0..clips.len()).map(|i| format!("[a{}]", i)).collect();

//     let filter_complex = format!(
//         "{};{}amix=inputs={}",
//         filters.join(";"),
//         inputs.join(""),
//         clips.len()
//     );

//     let output = "output.wav";

//     cmd.args(["-filter_complex", &filter_complex, output]);

//     cmd.output().expect("ffmpeg failed");

//     output.to_string()
// }

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
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![import_audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
