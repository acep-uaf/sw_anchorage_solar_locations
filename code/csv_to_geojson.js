const fs = require('fs');
const csv = require('csv-parser');
const GeoJSON = require('geojson');

const data = [];

fs.createReadStream('data/permits_lat_long.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Assuming your CSV has 'latitude' and 'longitude' columns
    data.push({
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      properties: row
    });
  })
  .on('end', () => {
    const geoJson = GeoJSON.parse(data, {Point: ['lat', 'lng']});
    fs.writeFileSync('data/permits_lat_long.geojson', JSON.stringify(geoJson, null, 2));
    console.log('CSV file successfully processed');
  });