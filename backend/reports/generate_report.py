# Generates the report PDF (concurrency-safe, output path passed via CLI).

import sys
from pathlib import Path
from datetime import datetime
import fitz  # PyMuPDF

# Expected CLI args:
# 1: score (percent)
# 2: level (0..4)
# 3-7: facet scores (RA, PR, G, R, LC) in percent
# 8: out_path (where to save the PDF)

def main():
    if len(sys.argv) < 9:
      sys.stderr.write(
          "Usage: python3 generate_report.py <score> <level> <RA> <PR> <G> <R> <LC> <out_path>\n"
      )
      sys.exit(1)

    try:
        score = float(sys.argv[1])
        level = int(float(sys.argv[2]))
        level = max(0, min(4, level))
        facet_scores = list(map(int, sys.argv[3:8]))  # RA, PR, G, R, LC
        out_path = Path(sys.argv[8])
    except Exception as e:
        sys.stderr.write(f"Argument parsing error: {e}\n")
        sys.exit(1)

    # Resolve template relative to this script
    script_dir = Path(__file__).resolve().parent
    template_pdf = script_dir / "report_template.pdf"
    if not template_pdf.exists():
        sys.stderr.write(f"Template not found: {template_pdf}\n")
        sys.exit(1)

    # Open the template
    doc = fitz.open(str(template_pdf))

    # --- Page 1 ---
    page = doc[0]
    # Date
    page.insert_text((95, 272), datetime.today().strftime("%B %d, %Y"), fontsize=11)
    # Percentile score
    page.insert_text((244, 348), f"{int(round(score))}%", fontsize=11, color=(0, 0, 0))
    # Level marker (red circle)
    y_offsets = {
        0: 443,  # Level 0
        1: 475,  # Level 1
        2: 510,  # Level 2
        3: 547,  # Level 3
        4: 578,  # Level 4
    }
    circle_x = 508
    circle_y = y_offsets[level] + 5
    page.draw_circle(center=(circle_x, circle_y), radius=5, color=(1, 0, 0), fill=(1, 0, 0))

    # --- Page 2 ---
    page2 = doc[1]
    facet_coords = {
        0: (480, 236),  # RA
        1: (480, 327),  # PR
        2: (480, 410),  # G
        3: (480, 498),  # R
        4: (480, 585),  # LC
    }
    for i, s in enumerate(facet_scores):
        x, y = facet_coords[i]
        page2.insert_text((x, y), f"{int(s)}%", fontsize=11, color=(0, 0, 0))

    # Ensure output directory exists and save
    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out_path))
    doc.close()

if __name__ == "__main__":
    main()
