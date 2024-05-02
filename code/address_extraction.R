library(rstudioapi)
library(readr)
library(stringr)

# pull path to this file
# note: dirname() moves up one level, do this twice to get to root
script_path <- rstudioapi::getActiveDocumentContext()$path
setwd(dirname(dirname(script_path)))

raw_ad <- read_csv(file = "./data/anchorage_solar_permits.csv")

ad <- raw_ad %>%
  mutate(AddressAnchorage = paste(Address, ", Anchorage, AK", sep = ""), .after = Address) 

address_only <- ad %>%
  select(AddressAnchorage)

write_csv(address_only, file = "./data/address_only.csv")


# sub_address_only <- address_only[1:10, ]
# 
# write_csv(sub_address_only, file = "./data/sub_address_only.csv")
