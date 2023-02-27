#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use serde_json::to_string;
use sysinfo::{CpuExt, System, SystemExt};
use tauri::Manager;
use window_shadows::set_shadow;

static APP: Mutex<App> = Mutex::new(App {
    cpu_usages: Vec::new(),
});

#[derive(Serialize, Deserialize)]
pub struct App {
    cpu_usages: Vec<String>,
}

#[tauri::command]
fn get_sys() -> String {
    let app = APP.lock().unwrap();
    to_string(&*app).unwrap()
}

fn main() {
    std::thread::spawn(|| {
        let mut sys = System::new();
        loop {
            sys.refresh_cpu();

            let mut app = APP.lock().unwrap();

            app.cpu_usages.clear();

            for cpu in sys.cpus() {
                app.cpu_usages.push(format!("{:.2}", cpu.cpu_usage()));
            }

            drop(app);

            std::thread::sleep(std::time::Duration::from_millis(500));
        }
    });

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            set_shadow(window, true).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_sys])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
