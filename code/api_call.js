const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const dotenv = require('dotenv').config();

const API_KEY = process.env.API_KEY; // replace with your Google API key
const csvFilePath = path.join(__dirname, '..', 'data', 'address_only.csv');
const outputFilePath = path.join(__dirname, '..', 'data', 'geocoded_output.json');

let data = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const address = row.AddressAnchorage; // replace 'address' with your CSV column name
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
    console.log(`Fetching geocode for address: ${address}`);
    console.log(`Request URL: ${url}`);
  
    data.push(
      axios.get(url)
        .then(response => {
          if (response.data.status === 'ZERO_RESULTS') {
            console.log(`No results for address: ${address}`);
          }
          return response.data;
        })
        .catch(error => {
          console.error(`Error occurred while fetching geocode for address: ${address}. Error: ${error.message}`);
          return null;
        })
    );
  })
  .on('end', () => {
    Promise.all(data)
      .then(results => {
        results = results.filter(item => item); // remove nulls
        return writeFile(outputFilePath, JSON.stringify(results, null, 2));
      })
      .then(() => console.log('All data saved to output.json'))
      .catch(error => console.error('Error occurred while saving data to file', error));
  });