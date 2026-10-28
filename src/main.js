import { registerPlugin } from '@capacitor/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';
import layers from 'protomaps-themes-base';
import './style.css';

const logEl = () => document.getElementById('log');
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

let map = new maplibregl.Map({
    container: 'map',
    style: { version: 8, sources: {}, layers: [] },
    center: [119.43, -5.14],
    zoom: 10
});

// Tangkap error MapLibre secara spesifik
map.on('error', e => {
    logEl().innerHTML = `<span style="color:red">Peta error: ${e.error?.message || e.error || 'Tile gagal dimuat'}</span><br>` + logEl().innerHTML;
});

let watcherId = null;
let pointCount = 0; 

// --- Logika 1: PMTiles Lokal ---
document.getElementById('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        logEl().innerHTML = `Membaca: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)<br>` + logEl().innerHTML;

        const p = new pmtiles.PMTiles(new pmtiles.FileSource(file));
        protocol.add(p); 

        // Pindahkan kamera secara dinamis berdasarkan data PMTiles
        const h = await p.getHeader();
        map.jumpTo({ center: [h.centerLon, h.centerLat], zoom: h.centerZoom });

        const loadOfflineMap = () => {
            const themeLayers = layers("peta-offline", "light");
            map.setStyle({
                version: 8,
                glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
                sources: {
                    "peta-offline": {
                        type: "vector",
                        url: "pmtiles://" + p.source.getKey() 
                    }
                },
                layers: themeLayers
            });
        };

        loadOfflineMap();

        // Indikator peta benar-benar selesai di-render
        map.once('idle', () => {
            logEl().innerHTML = `Peta selesai dimuat.<br>` + logEl().innerHTML;
        });

    } catch (err) {
        logEl().innerHTML = `<span style="color:red">Error Peta: ${err.message}</span><br>` + logEl().innerHTML;
    }
});

// --- Logika 2: Background Geolocation ---
document.getElementById('btnMulaiRekam').addEventListener('click', async () => {
    try {
        logEl().innerHTML = `Meminta izin GPS...<br>` + logEl().innerHTML;
        pointCount = 0; 
        
        watcherId = await BackgroundGeolocation.addWatcher(
            {
                backgroundMessage: "Aplikasi sedang merekam jalur turlap Anda.",
                backgroundTitle: "Merekam Jalur",
                requestPermissions: true,
                stale: false,
                distanceFilter: 5
            },
            function callback(location, error) {
                if (error) {
                    logEl().innerHTML = `<span style="color:red">Error GPS: ${error.message || error}</span><br>` + logEl().innerHTML;
                    return;
                }
                pointCount++;
                const now = new Date().toLocaleTimeString('id-ID');
                const msg = `[#${pointCount} - ${now}] Akurasi: ${location.accuracy}m<br>`;
                
                logEl().innerHTML = msg + logEl().innerHTML;
            }
        );

        document.getElementById('btnMulaiRekam').style.display = 'none';
        document.getElementById('btnHentiRekam').style.display = 'block';
        logEl().innerHTML = `<b>Merekam dimulai! Matikan layar HP sekarang.</b><br>` + logEl().innerHTML;

    } catch (err) {
        logEl().innerHTML = `<span style="color:red">Gagal Mulai: ${err.message}</span><br>` + logEl().innerHTML;
    }
});

document.getElementById('btnHentiRekam').addEventListener('click', () => {
    if (watcherId) {
        BackgroundGeolocation.removeWatcher({ id: watcherId });
        logEl().innerHTML = `<b>Rekaman dihentikan. Total titik: ${pointCount}</b><br>` + logEl().innerHTML;
        document.getElementById('btnMulaiRekam').style.display = 'block';
        document.getElementById('btnHentiRekam').style.display = 'none';
    }
});