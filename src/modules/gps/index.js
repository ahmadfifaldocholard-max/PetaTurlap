import { Geolocation } from '@capacitor/geolocation';
import maplibregl from 'maplibre-gl'; // Pindahkan ke atas agar tidak error

export let userMarker = null;

export async function initGPS(map) {
  console.log("Meminta izin GPS...");
  const gpsBadge = document.getElementById('gps-status');

  // Buat elemen titik biru
  const el = document.createElement('div');
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.backgroundColor = '#2196F3';
  el.style.border = '3px solid white';
  el.style.borderRadius = '50%';
  el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

  try {
    // 1. Minta Izin
    const permission = await Geolocation.requestPermissions();
    console.log("Status Izin:", permission);

    // 2. Pantau Lokasi
    await Geolocation.watchPosition(
      { enableHighAccuracy: true, timeout: 10000 },
      (position, err) => {
        if (err) {
          console.error("GPS Error:", err);
          gpsBadge.innerText = "GPS: Error";
          return;
        }
        
        if (position) {
          const lon = position.coords.longitude;
          const lat = position.coords.latitude;
          const acc = position.coords.accuracy;

          // Update text header
          gpsBadge.innerText = `GPS: ±${Math.round(acc)}m`;
          console.log("Lokasi ditemukan:", lat, lon);

          // Update Marker
          if (!userMarker) {
            userMarker = new maplibregl.Marker(el).setLngLat([lon, lat]).addTo(map);
            map.flyTo({ center: [lon, lat], zoom: 15 });
          } else {
            userMarker.setLngLat([lon, lat]);
          }
        }
      }
    );
  } catch (error) {
    console.warn("Capacitor GPS gagal, mencoba GPS Browser biasa...", error);
    
    // FALLBACK: Jika Capacitor gagal (misal karena masalah browser), pakai GPS bawaan web
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const lon = pos.coords.longitude;
          const lat = pos.coords.latitude;
          gpsBadge.innerText = `GPS: ±${Math.round(pos.coords.accuracy)}m`;
          
          if (!userMarker) {
            userMarker = new maplibregl.Marker(el).setLngLat([lon, lat]).addTo(map);
            map.flyTo({ center: [lon, lat], zoom: 15 });
          } else {
            userMarker.setLngLat([lon, lat]);
          }
        },
        (err) => {
          console.error("Web GPS Error:", err);
          gpsBadge.innerText = "GPS: Ditolak";
        },
        { enableHighAccuracy: true }
      );
    }
  }
}