use std::process::Command;

pub fn get_duration(path: &str) -> f64 {
    let output = Command::new("ffprobe")
        .args([
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            path,
        ])
        .output();

    match output {
        Ok(out) => {
            let result = String::from_utf8_lossy(&out.stdout);
            result.trim().parse::<f64>().unwrap_or(0.0)
        }
        Err(_) => 0.0,
    }
}