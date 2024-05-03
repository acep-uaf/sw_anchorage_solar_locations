library(readr)
library(stringr)
library(dplyr)

raw_ad <- read_csv(file = "./data/anchorage_solar_permits.csv")

ad <- raw_ad %>%
  mutate(AddressAnchorage = paste(Address, ", Anchorage, Alaska", sep = ""), .after = Address) 

address_only <- ad %>%
  select(AddressAnchorage)

write_csv(address_only, file = "./data/address_only.csv")


sub_address_only <- address_only[1:65, ]

write_csv(sub_address_only, file = "./data/sub_address_only.csv")
