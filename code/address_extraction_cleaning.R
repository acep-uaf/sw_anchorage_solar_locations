library(readr)
library(stringr)
library(dplyr)

# load source data
RawSolarPermits <- read_csv(file = "./data/raw_2017_2023_SolarPermits.csv")

#
SolarPermits <- RawSolarPermits %>%
  rename(IssuedTo = `Issued To`,
         Permit = `Permit #`) %>%
  drop_na(Permit)

# remove * + ~ ^ & , 
SolarPermits$`IssuedTo` <- gsub("[\\*\\+\\~\\^\\&\\,\\50%]", "", SolarPermits$`IssuedTo`)

# CSV of addresses to be changed
address_changes <- read_csv(file = "./data/address_changes.csv")

for(i in 1:nrow(address_changes)) {
  SolarPermits$Address <- gsub(address_changes$raw_address[i], address_changes$clean_address[i], SolarPermits$Address)
  rm(i)
}

# add "Anchorage, Alaska" to the end of each address string
SolarPermits <- SolarPermits %>%
  mutate(Address = paste(Address, ", Anchorage, Alaska", sep = ""), .after = Address) 

# isolate address column
address_only <- SolarPermits %>%
  select(Address)

write_csv(SolarPermits, file = "./data/clean_2017_2023_SolarPermits.csv")


write_csv(address_only, file = "./data/input_addresses.csv")

# subset df, useful for API testing
sub_address_only <- address_only[664:701, ]
write_csv(sub_address_only, file = "./data/sub_input_addresses.csv")



