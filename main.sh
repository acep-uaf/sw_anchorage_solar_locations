#!/bin/bash

# Extract addresses from building permit records
Rscript ./code/address_extraction.R

# API call to Google 
node ./code/api_call.js

# Extract relevant lat/long data from JSON API results, save to CSV
node ./code/output_extraction.js

# Join lat/long to source data
Rscript ./code/join_output_to_source.R
