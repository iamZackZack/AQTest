# score_player.R

library(mirt)

# Load the previously saved GRM model
grm_model <- readRDS("model.rds")

# Load new player response from CSV
# It must be a CSV with **one row**, **same columns**, and **same order** as dX.csv
new_data <- read.csv("new_response.csv", header = TRUE)

# Score the player using the GRM model
new_scores <- fscores(grm_model, response.pattern = new_data, method = "EAP")

# Extract logit score
logit_score <- new_scores[1, 1]

# Map logits to percentage
percent_score <- round(((logit_score + 4) / 6.5) * 100)

cat(trimws(percent_score))