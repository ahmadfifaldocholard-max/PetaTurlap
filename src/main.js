import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
jeepSqlite(window); 

import './styles/main.css'; 
import { initDatabase } from './modules/db/index.js';
import { initMap } from './modules/map/index.js';

async function startApp() {
  console.log("Memulai Peta Turlap...");
  
  try {
    await initDatabase();
    
    // Sembunyikan teks loading, ganti dengan peta
    document.getElementById('app')?.remove(); 
    
    // Inisialisasi Peta
    initMap();
    
  } catch (error) {
    console.error("Gagal start:", error);
  }
}

startApp();