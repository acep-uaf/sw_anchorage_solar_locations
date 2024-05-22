const fs = require('fs');
const csv = require('csv-parser');
const GeoJSON = require('geojson');

const data = [];

fs.createReadStream('data/permits_lat_long.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Convert latitude and longitude to numbers    
      row.lat = parseFloat(row.lat);
      row.lng = parseFloat(row.lng);

    // Add the row directly to the data array
      data.push(row);
  })
  .on('end', () => {
    const geoJson = GeoJSON.parse(data, {Point: ['lat', 'lng']});
    fs.writeFileSync('data/permits_lat_long.geojson', JSON.stringify(geoJson, null, 2));
    console.log('CSV file successfully processed');
  });