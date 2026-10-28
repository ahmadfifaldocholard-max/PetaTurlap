import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import schemaSql from './schema.sql?raw';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

export async function initDatabase() {
  try {
    console.log("Log 1: Mulai inisialisasi");
    const platform = Capacitor.getPlatform(); 
    const dbName = "peta_turlap_db";

    if (platform === 'web') {
      console.log("Log 2: Menunggu jeep-sqlite...");
      await customElements.whenDefined('jeep-sqlite');
      console.log("Log 3: jeep-sqlite siap, init WebStore...");
      await sqlite.initWebStore();
    }

    console.log("Log 4: Cek koneksi...");
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(dbName, false)).result;

    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection(dbName, false);
    } else {
      db = await sqlite.createConnection(dbName, false, "no-encryption", 1, false);
    }

    console.log("Log 5: Membuka database...");
    await db.open();
    console.log("Log 6: Database terbuka!");

    let isTableExist = true;
    try {
      const res = await db.query("SELECT version FROM schema_version;");
      if (!res.values || res.values.length === 0) {
        isTableExist = false;
      }
    } catch (e) {
      isTableExist = false; 
    }

    if (!isTableExist) {
      console.log("Log 7: Membuat tabel database dari schema.sql...");
      await db.execute(schemaSql);
      
      if (platform === 'web') {
        await sqlite.saveToStore(dbName);
      }
      console.log("✅ Database berhasil dibuat!");
    } else {
      console.log("✅ Database sudah ada, siap digunakan.");
    }

    return db;
  } catch (error) {
    console.error("❌ Gagal inisialisasi database:", error);
    throw error;
  }
}

export function getDb() {
  if (!db) throw new Error("Database belum diinisialisasi!");
  return db;
}