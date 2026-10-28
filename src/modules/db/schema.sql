-- Mengaktifkan fitur Foreign Key (relasi antar tabel)
PRAGMA foreign_keys = ON;

-- 1. Tabel Versi Skema (Untuk melacak pembaruan database nanti)
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
);

-- 2. Tabel Proyek
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    utm_zone TEXT NOT NULL,
    pmtiles_path TEXT,
    pmtiles_bbox TEXT,
    pmtiles_minzoom INTEGER,
    pmtiles_maxzoom INTEGER,
    notes TEXT
);

-- 3. Tabel Waypoint (Titik)
CREATE TABLE IF NOT EXISTS points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    elevation_m REAL,
    accuracy_m REAL,
    recorded_at TEXT NOT NULL,
    notes TEXT,
    utm_zone TEXT,
    utm_x REAL,
    utm_y REAL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 4. Tabel Garis (LineString)
CREATE TABLE IF NOT EXISTS lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT,
    geojson TEXT NOT NULL,
    length_m REAL,
    recorded_at TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 5. Tabel Area (Polygon)
CREATE TABLE IF NOT EXISTS polygons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT,
    geojson TEXT NOT NULL,
    area_ha REAL,
    perimeter_m REAL,
    recorded_at TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 6. Tabel Jalur Rekaman (Tracks)
CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    length_m REAL,
    point_count INTEGER,
    interval_sec INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 7. Tabel Titik Mentah Jalur (Track Points)
CREATE TABLE IF NOT EXISTS track_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    track_id INTEGER NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    elevation_m REAL,
    accuracy_m REAL,
    recorded_at TEXT NOT NULL,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

-- 8. Tabel Foto
CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_type TEXT NOT NULL, -- 'point', 'line', 'polygon', 'track'
    owner_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    taken_at TEXT NOT NULL,
    lat REAL,
    lon REAL
);

-- 9. Tabel Pengaturan
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- MEMBUAT INDEX UNTUK PERFORMA (Agar baca data ribuan titik tidak lemot)
CREATE INDEX IF NOT EXISTS idx_points_project ON points(project_id);
CREATE INDEX IF NOT EXISTS idx_lines_project ON lines(project_id);
CREATE INDEX IF NOT EXISTS idx_polygons_project ON polygons(project_id);
CREATE INDEX IF NOT EXISTS idx_tracks_project ON tracks(project_id);
CREATE INDEX IF NOT EXISTS idx_track_points_track ON track_points(track_id);

-- Insert versi awal database
INSERT INTO schema_version (version) VALUES (1);