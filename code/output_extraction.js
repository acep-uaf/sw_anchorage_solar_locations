const fs = require('fs');
const { Parser } = require('json2csv');

// Read and parse the JSON data
const data = JSON.parse(fs.readFileSync('./data/api_output.json', 'utf8'));

// Define the fields to extract
const fields = ['formatted_address', 'lat', 'lng'];

// Initialize the JSON to CSV parser
const json2csvParser = new Parser({ fields });

// Convert the JSON data to CSV data
let csvData = [];
data.forEach(item => {
    let row = {
        formatted_address: item.formatted_address,
        lat: item.geometry.location.lat,
        lng: item.geometry.location.lng
    };
    csvData.push(row);
});
const csv = json2csvParser.parse(csvData);

// Write the CSV data to file
fs.writeFileSync('./data/address_lat_long.csv', csv);