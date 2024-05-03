library(readr)
library(stringr)

raw_ad <- read_csv(file = "./data/anchorage_solar_permits.csv")

extracted_output <- read_csv(file = "./data/address_lat_long.csv")

address_only <- read_csv(file = "./data/address_only.csv")

permits_lat_long <- cbind(raw_ad, extracted_output)

write_csv(permits_lat_long, file = "./data/permits_lat_long.csv")
