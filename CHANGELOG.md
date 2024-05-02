### Source Data

Monday April 29, 2024:  
* sgcrichton@alaska.edu emailed @ianalexmac a file, "2017-2023CombinedDETAILED.xlsx" which contains a list of permitted work in the Anchorage area.  
* The Excel file contains two sheets: 
- "AllPermits", records of permitted work in the Anchorage area from 2017-2023  
- "SolarPermits", records of permitted *solar* work in the Anchorage area from 2017-2023 

* The contents of sheet "SolarPermits" were exported to "anchorage_solar_permits.xlsx"  

* "anchorage_solar_permits.xlsx" was exported to "anchorage_solar_permits.csv", the working dataset


### Cleaning
column `IssuedTo`:
- removed characters: `* + ~ ^ & ,` 
column `Valuation`:
- removed character: `$` 
column `Date`: 
needs formatting work, do later


#### R script "address_extraction.R"
- imports "anchorage_solar_permits.csv"
- creates new column AddressAnchorage 
- adds string ", Anchorage, AK" to the end of each address
- selects column AddressAnchorage
- writes to file as "./data/address_only.csv"




