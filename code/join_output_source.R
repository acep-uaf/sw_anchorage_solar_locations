library(readr)
library(stringr)
library(dplyr)
library(lubridate)

clean_SolarPermits <- read_csv(file = "./data/clean_2017_2023_SolarPermits.csv")

output <- read_csv(file = "./data/output.csv")

input_addresses <- read_csv(file = "./data/input_addresses.csv")

permits_lat_long <- cbind(clean_SolarPermits, output)

write_csv(permits_lat_long, file = "./data/permits_lat_long.csv")
