### Welcome
* This repository contains code and data regarding locations of solar installations in the Anchorage Alaska area.  
* The data represents solar installations for years 2017 through 2023. 
* The source data (Anchorage Building Permits) contained only street addresses, which made mapping difficult. Google Geocode API was called to convert these addresses to lat/long coordinates. 

### Workflow
![Diagram of Workflow](/flow.jpg?raw=true "Workflow")

``` mermaid
flowchart TD
    A[  Source: Anchorage Building Permit Data, 
        File: 2017-2023CombinedDETAILED.xlsx] 
    -->
    |Save sheet 'SolarPermits' as new CSV file| B
    
    B[Write file: raw_2017_2023_SolarPermits.csv]
    --> 
    |Script: address_extraction_cleaning.R using address_changes.csv| C

    C(Write file: clean_2017_2023_SolarPermits.csv) 
    --> 
    |Script: address_extraction_cleaning.R| D

    D(Write file: input_addresses.csv) 
    --> 
    |import csv adds new address column| E

    E[File: addreses with added stuff CSV] 
    --> 
    |asdf| G

    G[Script: api_call.js] 
    --> 
    |iterates and calls google geocde and saves to a json file| H

    H[File: JSON cotnaining geocode responses]

```