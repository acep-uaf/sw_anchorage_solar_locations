const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

const dotenv = require('dotenv').config({ path: path.join('.env') });

const API_KEY = process.env.API_KEY; 
const csvFilePath = path.join('data', 'input_addresses.csv');
const outputFilePath = path.join('data', 'api_output.json');

let data = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const address = row.Address; // replace 'address' with your CSV column name
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
    console.log(`Fetching geocode for address: ${address}`);
    console.log(`Request URL: ${url}`);
  
    data.push(
      axios.get(url)
        .then(response => {
          if (response.data.status === 'ZERO_RESULTS') {
            console.log(`No results for address: ${address}`);
            return null;
          }
          // Return only the first result
          return response.data.results[0];
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
      .then(() => console.log('All data saved file'))
      .catch(error => console.error('Error occurred while saving data to file', error));
  });

  console.log(process.env)