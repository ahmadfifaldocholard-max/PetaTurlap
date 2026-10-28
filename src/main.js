import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
jeepSqlite(window); 

import './styles/main.css'; 
import { initDatabase } from './modules/db/index.js';
import { initMap } from './modules/map/index.js';
import { initGPS } from './modules/gps/index.js'; // <-- TAMBAHKAN INI

async function startApp() {
  console.log("Memulai Peta Turlap...");
  
  try {
    await initDatabase();
    document.getElementById('app')?.remove(); 
    
    // Inisialisasi Peta dan simpan ke variabel
    const map = initMap();
    
    // Inisialisasi GPS setelah peta siap
    await initGPS(map); // <-- TAMBAHKAN INI
    
  } catch (error) {
    console.error("Gagal start:", error);
  }
}

startApp();