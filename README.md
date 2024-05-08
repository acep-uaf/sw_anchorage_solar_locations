### Welcome
This repository contains code and data regarding locations of solar installations in the Anchorage Alaska area between 2017 and 2023. The maps and visuals generated by this repo are intended for public display, either in publications or presentations, and represent a general portrait of the residential solar sector in Anchorage. 

<br>

### Getting Started  
You are welcome to interact with this repo on several levels:  
* Download the static maps and visuals for use in publications or presentations
* Embed the dynamic Mapbox maps in your website
* Run new/updated data through the geocoding scripts

<br>

### Overview
This repository can be divided into roughly two parts:
1. Convert partial string addresses (ex: "2439 DOUGLAS") into lat/long coordinates
2. Build a heat map interpolation from the lat/long coordinates

<br>

### Part 1: Convert Addresses to Coordinates

#### Address Cleaning Loop
The source data comes from the City of Anchorage Building Permits. The address strings in this source data did not include common nouns (ex: "Street", "Road", "Circle"), which caused a few errors during the geocode conversion to coordinates. Approximately 160 addresses failed to parse, returning only "Anchorage, AK". These problem addresses were fed into maps.google.com, and the results were written into `address_changes.csv` as `clean_address`. Pre-cleaned addresses were written as `raw_address`. These addresses changes were iterated through in the script `address_extraction_cleaning.R` and the cleaned permit data was written to `clean_2017_2023_SolarPermits.csv`. Addresses only were written to `input_addresses.csv`.

#### API Call
Clean addresses from `input_addresses.csv` were read by the script `api_call.js`, which iterated through each address, pinged Google's Geocode API, caught the response, and wrote the collected responses to a JSON file `api_output.json`. 

#### Output Trimming and CSV Conversion
In order to get the JSON results pared down and converted to CSV, the script `output_to_csv.js` imported `api_output.json`, selected the fields `formatted_address, lat, lng`, then wrote to file `output.csv`. 

#### Joining API output and Permit Data
The flow came full circle via the script `join_output_source.R`, where the output data was loaded from `output.csv` and combined with `clean_2017_2023_SolarPermits.csv`. The combined dataset was written to file as `permits_lat_long.csv`.

<br>
<br>

### Workflow Diagram
![Diagram of Workflow](/flow.jpg?raw=true "Workflow")

<br>
<br>

### Part 2: Heat Map of Solar Installs

#### Heat Map
With the source data combined with location coordinates, we were able to place points on a map and interpolate a heat map of solar installations from 2017 to 2023. 







