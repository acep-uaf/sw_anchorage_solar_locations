function convertToGeoJSON(data) {
  return {
    type: 'FeatureCollection',
    features: data.map(item => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          item.geometry.location.lng,
          item.geometry.location.lat
        ]
      },
      properties: item
    }))
  };
}


mapboxgl.accessToken = 'MAPBOX_API';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-149.75, 61.22], // starting position [lng, lat]
    zoom: 9 // starting zoom
});


fetch('data/api_output.json')
  .then(response => response.json())
  .then(data => {
    const geojsonData = convertToGeoJSON(data);

    map.on('load', function () {
      map.addSource('heatmap-source', {
        'type': 'geojson',
        'data': geojsonData
      });

      map.addLayer({
        'id': 'heatmap-layer',
        'type': 'heatmap',
        'source': 'heatmap-source',
        'paint': {
          // Add custom heatmap layer properties here
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'magnitude'], 0, 0, 6, 1],
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
    });
  });
});

