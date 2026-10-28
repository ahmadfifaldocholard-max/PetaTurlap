import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function initMap() {
  // Peta dasar kosong (warna hijau gelap kehutanan)
  const map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {},
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: { 'background-color': '#1a221b' }
        }
      ]
    },
    center: [119.5, -5.0], // Default Maros/Sulawesi
    zoom: 11
  });

  // Tambahkan kontrol zoom +/- di kanan atas
  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  console.log("✅ Peta MapLibre berhasil dimuat");
  return map;
}