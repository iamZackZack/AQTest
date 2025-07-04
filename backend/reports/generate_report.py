# Generates the report at the end of a completion of a test.

# Imports
import sys
import pandas as pd
import matplotlib.pyplot as plt
import fitz
from datetime import datetime

# Parse CLI arguments
score = float(sys.argv[1])
level = float(sys.argv[2])
facet_scores = list(map(int, sys.argv[3:]))

# Abstraction level
level_names = {
    0: "Pre-abstraction",
    1: "Recognize patterns and categorize representations",
    2: "Transfer and identify context",
    3: "Adapt patterns and group attributes",
    4: "Freely navigate abstract concepts"
}
level_text = level_names[level]

# Load the empty PDF template
doc = fitz.open("reports/report_template.pdf")
page = doc[0]

# Insert date into the PDF
page.insert_text((95, 272), datetime.today().strftime("%B %d, %Y"), fontsize=11)

# Insert percentile score into the PDF
page.insert_text((244, 348), f"{score}%", fontsize=11, color=(0, 0, 0))

# Insert marker level table into the PDF
y_offsets = {
    0: 443,   # Row for Level 0
    1: 475,   # Row for Level 1
    2: 510,   # Row for Level 2
    3: 547,   # Row for Level 3
    4: 578    # Row for Level 4
}
circle_x = 508
circle_y = y_offsets[level] + 5
radius = 5

page.draw_circle(
    center=(circle_x, circle_y),
    radius=radius,
    color=(1, 0, 0),
    fill=(1, 0, 0)
)

# Insert Facet Scores into the PDF
page2 = doc[1]
facet_coords = {
    0: (480, 236),  # Reflective Abstraction
    1: (480, 327),  # Pattern Recognition
    2: (480, 410),  # Generalisation
    3: (480, 498),  # Reduction
    4: (480, 585)   # Levels and Context
}
for i, s in enumerate(facet_scores):
    x, y = facet_coords[i]
    page2.insert_text((x, y), f"{s}%", fontsize=11, color=(0, 0, 0))

# Save report
doc.save("reports/final_report.pdf")