export const buildScoreRow = (questions, userAnswers) => {
  const scores = [];    // Stores per-question scores
  const hardness = [];  // Tracks hardness values per question

  let total_score = 0;     // Sum of weighted scores
  let max_total_score = 0; // Sum of max possible weighted scores

  // Initialize abstraction facet statistics
  const facetStats = {
    RA: { total: 0, correct: 0 },
    PR: { total: 0, correct: 0 },
    G:  { total: 0, correct: 0 },
    R:  { total: 0, correct: 0 },
    LC: { total: 0, correct: 0 },
  };

  // Normalize and clean string for text comparison
  const cleanString = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();

  // Compare two arrays regardless of order
  const arraysMatch = (arr1, arr2) => {
    return [...arr1].sort().join(",") === [...arr2].sort().join(",");
  };

  // Loop through each question to calculate score
  for (const question of questions) {
    const qId = question._id;
    const userAnswer = userAnswers[qId];
    const correct = question.correctAnswer;
    const max = question.maxPoint || 1;
    const type = question.type;
    const h = question.hardness || 1;

    hardness.push(h);
    max_total_score += max * h;

    // Track facets for abstraction-based scoring
    if (question.abstractionAbility) {
      for (const facet of question.abstractionAbility) {
        facetStats[facet].total++;
      }
    }

    // If answer or correct solution is missing, assign score 0
    if (!userAnswer || !correct) {
      scores.push(0);
      continue;
    }

    let score = 0;

    const normalize = (str) => (str || "").toLowerCase().trim();

    // Scoring logic based on question type
    switch (type) {
      case "single-multiple-choice":
      case "grid":
      case "hex-grid":
      case "triangle-grid": {
        const correctAnswer = Array.isArray(correct) ? correct[0] : correct;
        const user = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
        if (normalize(user) === normalize(correctAnswer)) score = max;
        break;
      }

      case "multiple-multiple-choice": {
        const correctSet = new Set(correct);
        const userSet = new Set(userAnswer);
        const intersection = [...userSet].filter((val) =>
          correctSet.has(val)
        );
        score = Math.min(intersection.length, max);
        break;
      }

      case "either-or":
      case "either-or-4": {
        const correctSet = new Set(correct.map((x) => x.toLowerCase()));
        const userVals = Object.values(userAnswer || {}).map((x) =>
          x.toLowerCase()
        );
        const matches = userVals.filter((val) => correctSet.has(val));
        score = Math.min(matches.length, max);
        break;
      }

      case "text-entry": {
        const acceptedAnswers = Array.isArray(correct) ? correct : [correct];
        const normalizedUser = cleanString(userAnswer);
        const isCorrect = acceptedAnswers.some(
          (a) => cleanString(a) === normalizedUser
        );
        score = isCorrect ? 1 : 0;
        break;
      }

      case "drag-order": {
        const isCorrect =
          JSON.stringify(userAnswer) === JSON.stringify(correct);
        score = isCorrect ? 1 : 0;
        break;
      }

      case "drag-group": {
        const matchedIndices = new Set();
        let correctCount = 0;
        for (const userGroup of userAnswer) {
          for (let i = 0; i < correct.length; i++) {
            if (
              !matchedIndices.has(i) &&
              arraysMatch(userGroup, correct[i])
            ) {
              matchedIndices.add(i);
              correctCount++;
              break;
            }
          }
        }
        score = correctCount === correct.length ? 1 : 0;
        break;
      }

      default:
        score = 0;
    }

    scores.push(score);
    total_score += score * h;

    // Update correct facet counts if max score was achieved
    if (score === max && question.abstractionAbility) {
      for (const facet of question.abstractionAbility) {
        facetStats[facet].correct++;
      }
    }
  }

  // Calculate percentage for each abstraction facet
  const facetPercentages = {};
  for (const key in facetStats) {
    const { total, correct } = facetStats[key];
    facetPercentages[key] = total > 0 ? Math.round((correct / total) * 100) : null;
  }

  // Normalize total score to a 0–100 scale and subtract 3 points as penalty
  const normalized_score = max_total_score > 0
    ? Math.max(Math.round((total_score / max_total_score) * 100) - 3, 0)
    : 0;

  // Return detailed score object
  return {
    scores,
    total_score,
    normalized_score,
    hardness,
    facetPercentages,
  };
};