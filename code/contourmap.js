document.addEventListener('DOMContentLoaded', (event) => {
mapboxgl.accessToken = 'MAPBOX_API';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-149.75, 61.22], // starting position [lng, lat]
    zoom: 9, // starting zoom
    maxZoom: 12
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
  map.setFilter('contour-layer', ['==', ['get', 'year'], year]);
  // Update the year display
  document.getElementById('year-display').textContent = year;
}

map.on('load', function () {
  fetch('data/permits_lat_long.geojson')
    .then(response => {
      return response.json();
    })
    .then(data => {
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

  map.addSource('contour-source', {
    'type': 'geojson',
    'data': data
  });

  map.addLayer({
    'id': 'contour-layer',
    'type': 'contour',
    'source': 'contour-source',
    'paint': {
      'contour-color': [
        'step',
        ['get', 'Valuation'],
        '#f1f075',
        20,
        '#eb4d5c'
      ]
    }
  });

  filterBy(2017);
}

document.getElementById('year-slider').addEventListener('input', function(e) {
  const year = parseInt(e.target.value, 10);
  filterBy(year);
});

});




