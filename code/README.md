# /code

<br>

## `main.sh`
This script is the data pipeline to import, clean, and geocode addresses from Anchorage building permits in preparation for mapping. Running `bash main.sh` will run the following scripts in order:

Extract addresses from building permit records
`address_extraction_cleaning.R`

API call to Google (note: need Google Geocode API key, stashed in .env file as `GOOGLE_GEOCODE_API={your_key_here}`)
`api_call.js`

Extract relevant lat/long data from JSON API results, save to CSV
`output_to_csv.js`

Join lat/long to source data
`join_output_source.R`

Convert CSV to GeoJSON
`csv_to_geojson.js`

**The output of this script is `data/permits_lat_long.geojson`, which is the input for the mapping script `heatmap.js`**

<br>

## `2017-2023CombinedDETAILED.xlsx`
* The pipeline starts with source data of Anchorage building permits compiled by ACEP Solar Team [located in Google Docs](https://docs.google.com/spreadsheets/d/192wR684Fh2tu78FlvWTkQMevPNG-0Hkn/edit#gid=1854885205). PDF files of this data can be found on the Municipality of Anchorage website [here](https://www.muni.org/Departments/OCPD/development-services/permits-inspections/pages/permit-activity-reports.aspx).  
* The XLSX file was downloaded to the repo on 6 May 2024 and the sheet `SolarPermits` was saved as `data/raw_2017_2023_SolarPermits.csv`

<br>

## `address_extraction_cleaning.R`
The first script in the pipeline imports `raw_2017_2023_SolarPermits.csv`. A few columns were renamed:

New name | Old name
|--------|----------
IssuedTo | Issued To
Permit   | Permit #

Next, a few special characters were removed from the column `IssuedTo`: `*` `+` `~` `^` `&` `,` `50%`

Then, the character `$` was dropped from the column `Valuation` (`$` forces the column to import as character instead of numeric)

After that, a new column `year` was created by parsing date_time from the column `Date`. 

**Address Cleaning**
With special characters removed and year extracted, the next step was to clean the address strings. The source data did not include common nouns (such as "Street", "Road", "Circle"), which caused a few errors during the geocode API call. Approximately 160 addresses failed to parse, returning only "Anchorage, AK". These problem addresses were fed into maps.google.com, and the results were written into `address_changes.csv` under the column `clean_address`. Pre-cleaned addresses were written under the column `raw_address`. These addresses changes were looped back into the script and the clean addresses written to `clean_2017_2023_SolarPermits.csv`.

Finally, the column `Address` was extracted and written to file as `data/input_addresses.csv`

<br>

## `api_call.js`
