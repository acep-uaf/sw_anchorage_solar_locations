const turf = require('@turf/turf');
const fs = require('fs');

let rawdata = fs.readFileSync('data/permits_lat_long.geojson');
let geojsonData = JSON.parse(rawdata);

let geojsonPoints = {
  type: "FeatureCollection",
  features: geojsonData.features
};

let bbox = turf.bbox(geojsonPoints);
console.log(bbox);

// Define the grid parameters
let cellSize = 0.1;
let gridUnits = 'degrees';

// Create a grid of points
let grid = turf.pointGrid(bbox, cellSize, {units: gridUnits});

// Perform IDW interpolation
let interpolated = turf.interpolate(geojsonPoints, grid, {gridType: 'point', property: 'Valuation', units: gridUnits});

// Convert the GeoJSON object to a string
let data = JSON.stringify(interpolated);

// Write the string to a file
fs.writeFile('data/value_interpolated.geojson', data, 'utf8', function(err) {
  if (err) {
    console.log('An error occurred while writing JSON Object to File.');
    return console.log(err);
  }

  console.log('JSON file has been saved.');
});