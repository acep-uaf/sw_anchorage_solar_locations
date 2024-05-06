var map = L.map('map').setView([61.22, -149.75], 9);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
}).addTo(map);

fetch('../data/api_output.json')
  .then(response => response.json())
  .then(data => {
    data.forEach( item => {
      L.marker([item.geometry.location.lat, item.geometry.location.lng]).addTo(map);
    });
  })
  .catch(error => console.error('Error:', error));