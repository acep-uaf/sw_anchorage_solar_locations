library(readr)
library(stringr)

raw_ad <- read_csv(file = "./data/anchorage_solar_permits.csv")

extracted_output <- read_csv(file = "./data/address_lat_long.csv")

address_only <- read_csv(file = "./data/address_only.csv")
