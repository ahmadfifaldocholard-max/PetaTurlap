import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
jeepSqlite(window); 

import './styles/main.css'; 
import { initDatabase } from './modules/db/index.js';

async function startApp() {
  console.log("Memulai Peta Turlap...");
  
  try {
    await initDatabase();
    document.getElementById('app').innerText = "Database siap. Menunggu UI...";
  } catch (error) {
    document.getElementById('app').innerText = "Gagal memuat database. Cek Console (F12).";
    console.error(error);
  }
}

startApp();