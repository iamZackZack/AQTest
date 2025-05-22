# Load necessary libraries
library(mirt)
library(jsonlite)

# Load model and new response
grm_model <- readRDS("model.rds")
new_data <- read.csv("new_response.csv", header = TRUE)

# Score
new_scores <- fscores(grm_model, response.pattern = new_data, method = "EAP")

# Extract values
logit_score <- new_scores[1, 1]
percent_score <- round(((logit_score + 4) / 6.5) * 100)

# Output both as JSON
cat(jsonlite::toJSON(list(
  logit = logit_score,
  percent = percent_score
), auto_unbox = TRUE))
