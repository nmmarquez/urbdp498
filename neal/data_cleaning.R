rm(list=ls())
require(sp)
require(rgdal)
require(maps)
library(GISTools)
library(spatialEco)
library(dplyr)

df <- read.csv("~/Documents/urbdp498/data/data.csv")
df$response_id <- 1:nrow(df)
xy <- df[,c("longitude", "latitude")]
setwd("~/Documents/urbdp498/data/Neighborhoods/WGS84/")

neighborhoods <- readOGR(".", "Neighborhoods")
sub_shape <- subset(neighborhoods, !is.na(S_HOOD) & S_HOOD!="OOO")
sub_shape@data$S_HOOD <- as.character(sub_shape@data$S_HOOD)
sub_shape@data$S_HOOD[duplicated(sub_shape@data$S_HOOD)] <- "Industrial District2"

length(unique(sub_shape@data$S_HOOD)) == length(sub_shape@data$S_HOOD)
length(unique(sub_shape@data$HOODS_ID)) == length(sub_shape@data$HOODS_ID)

spdf <- SpatialPointsDataFrame(coords=xy, data=df,
                               proj4string=CRS(proj4string(sub_shape)))
spdf <- point.in.poly(spdf, sub_shape)

neigh_merge_df <- left_join(df, spdf@data[,c("response_id", "HOODS_ID")])
neigh_desc_df <- sub_shape@data[,c("HOODS_ID", "S_HOOD")]
neigh_desc_df$longitude <- gCentroid(sub_shape, byid = TRUE)@coords[,"x"]
neigh_desc_df$latitude <- gCentroid(sub_shape, byid = TRUE)@coords[,"y"]

head(neigh_desc_df)
head(neigh_merge_df)

setwd("~/Documents/urbdp498/data/")

write.csv(neigh_desc_df, "neighborhood_id.csv", row.names=FALSE)
write.csv(neigh_merge_df, "call_data.csv", row.names=FALSE)
write.csv(head(neigh_merge_df, n=2), "call_data_head.csv", row.names=FALSE)
