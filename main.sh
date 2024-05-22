#!/bin/bash

Extract addresses from building permit records
Rscript ./code/address_extraction_cleaning.R

# API call to Google 
node ./code/api_call.js

# Extract relevant lat/long data from JSON API results, save to CSV
node ./code/output_to_csv.js

# Join lat/long to source data
Rscript ./code/join_output_source.R

# Convert CSV to GeoJSON
node ./code/csv_to_geojson.js
