document.addEventListener('DOMContentLoaded', (event) => {
mapboxgl.accessToken = 'MAPBOX_API';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-149.75, 61.22], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const years = [
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023'
];

function filterBy(year) {
  // Set a filter on the heatmap layer to only show data for the selected year
  map.setFilter('heatmap-layer', ['==', ['get', 'year'], year]);
  // Update the year display
  document.getElementById('year-display').textContent = year;
}

map.on('load', function () {
  fetch('data/permits_lat_long.geojson')
    .then(response => {
      console.log('Response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Data:', data);
      jsonCallback(null, data);
    })
    .catch(error => console.error('Error:', error));
});

function jsonCallback(err, data) {
  if (err) {
    throw err;
  }

  data.features = data.features.map((d) => {
    d.properties.year = Number(d.properties.properties.year);
    return d;
  });

  map.addSource('heatmap-source', {
    'type': 'geojson',
    'data': data
  });

  map.addLayer({
    'id': 'heatmap-layer',
    'type': 'heatmap',
    'source': 'heatmap-source',
    'paint': {
      // Add custom heatmap layer properties here
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'Valuation'], 0, 0, 6, 1],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.1,
        'rgb(103,169,207)',
        0.2,
        'rgb(209,229,240)',
        0.5,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)'
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 14, 0]
    }
  });

  filterBy(2017);
}

document.getElementById('year-slider').addEventListener('input', function(e) {
  console.log('Slider input event:', e);  // Log the event
  const year = parseInt(e.target.value, 10);
  console.log('Slider year:', year);  // Log the year
  filterBy(year);
});

});




