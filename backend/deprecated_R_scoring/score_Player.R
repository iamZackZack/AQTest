# Load necessary libraries
library(mirt)
library(jsonlite)

# Load model and new response
grm_model <- readRDS("model_clean.rds")
new_data <- read.csv("new_response.csv", header = TRUE)

# Score
new_scores <- fscores(grm_model, response.pattern = new_data, method = "EAP")

# Get model's logit range
logits <- fscores(grm_model)
logit_min <- min(logits[, 1])
logit_max <- max(logits[, 1])

# Your new logit
logit_score <- new_scores[1, 1]

# Scale to percentage
percent_score <- round(((logit_score - logit_min) / (logit_max - logit_min)) * 100) # nolint

# Output both as JSON
cat(jsonlite::toJSON(list(
  logit = logit_score,
  percent = percent_score
), auto_unbox = TRUE))
