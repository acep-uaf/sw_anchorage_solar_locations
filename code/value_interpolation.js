const turf = require('@turf/turf');
const fs = require('fs');

let rawdata = fs.readFileSync('data/permits_lat_long.geojson');
let geojsonData = JSON.parse(rawdata);

let geojsonPoints = {
  type: "FeatureCollection",
  features: geojsonData.features.map(feature => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        Valuation: feature.properties.properties.Valuation
      }
    };
  })
};

// Debugging: Check if geojsonPoints contains any features
console.log(`Number of features in geojsonPoints: ${geojsonPoints.features.length}`);

// Debugging: Check if the property 'Valuation' exists in the features
let featuresWithValuation = geojsonPoints.features.filter(feature => feature.properties && feature.properties.Valuation);
console.log(`Number of features with 'Valuation' property: ${featuresWithValuation.length}`);

let valuationValues = featuresWithValuation.map(feature => feature.properties.Valuation);
let minValuation = Math.min(...valuationValues);
let maxValuation = Math.max(...valuationValues);
console.log(`Min Valuation: ${minValuation}, Max Valuation: ${maxValuation}`);

let bbox = turf.bbox(geojsonPoints);
console.log(`Bounding box: ${bbox}`);

// Define the grid parameters
let cellSize = 0.01;
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