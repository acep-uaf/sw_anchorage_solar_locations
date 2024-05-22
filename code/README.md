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

## `data/2017-2023CombinedDETAILED.xlsx`
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

Finally, the column `Address` was extracted and written to file as `input_addresses.csv`

<br>

## `api_call.js`
This script: 
* imports addresses from `input_addresses.csv` 
* sends them to Google's Geocode API  
* catches the responses  
* and writes the resulting JSON to file as `api_output.json`. 

<br>

## `output_to_csv.js`
This script imports the JSON API results `api_output.json` and saves them as CSV `output.csv` in order to facilitate wrangling with R. 
 In the future, this script and the two afterwards could be simplified or done differently (*keep in JSON? Maybe use [this package?](https://cran.r-project.org/web/packages/jsonlite/vignettes/json-aaquickstart.html) Or maybe wrangle in Javascript*). 

<br>

## `join_output_source.R`
This is a short script that imports both `output.csv` and the cleaned source data `clean_2017_2023_SolarPermits.csv`, joins them together, and writes the result to file as `permits_lat_long.csv`

<br>

## `csv_to_geojson.js`
In order to map the data, we need it in GeoJSON format. This script imports `permits_lat_long.csv`, converts it to GeoJSON, and saves it as `permits_lat_long.geojson`. This is the source data for `heatmap.js`, the Mapbox heat map.

<br>

## `heatmap.js`
This script builds the Mapbox interactive map, complete with animated `year` slider. Called by `index.html` and rendered full-sized in the window. The rendered map can be embedded with the following code:

```
<iframe 
    width="600" // change for your site
    height="450" // change for your site
    frameborder="0" 
    style="border:0" 
    src="https://acep-uaf.github.io/sw_anchorage_solar_locations/" 
    allowfullscreen>
</iframe>
```