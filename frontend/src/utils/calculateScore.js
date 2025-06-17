export const buildScoreRow = (questions, userAnswers) => {
  const scores = [];
  const hardness = [];

  let total_score = 0;
  let max_total_score = 0;

  const facetStats = {
    RA: { total: 0, correct: 0 },
    PR: { total: 0, correct: 0 },
    G:  { total: 0, correct: 0 },
    R:  { total: 0, correct: 0 },
    LC: { total: 0, correct: 0 },
  };

  const cleanString = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();

  const arraysMatch = (arr1, arr2) => {
    return [...arr1].sort().join(",") === [...arr2].sort().join(",");
  };

  for (const question of questions) {
    const qId = question._id;
    const userAnswer = userAnswers[qId];
    const correct = question.correctAnswer;
    const max = question.maxPoint || 1;
    const type = question.type;
    const h = question.hardness || 1;

    hardness.push(h);
    max_total_score += max * h;

    if (question.abstractionAbility) {
      for (const facet of question.abstractionAbility) {
        facetStats[facet].total++;
      }
    }

    if (!userAnswer || !correct) {
      scores.push(0);
      continue;
    }

    let score = 0;

    const normalize = (str) => (str || "").toLowerCase().trim();

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

      case "either-or": {
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

    if (score === max && question.abstractionAbility) {
      for (const facet of question.abstractionAbility) {
        facetStats[facet].correct++;
      }
    }
  }

  const facetPercentages = {};
  for (const key in facetStats) {
    const { total, correct } = facetStats[key];
    facetPercentages[key] = total > 0 ? Math.round((correct / total) * 100) : null;
    // console.log(key, total, correct);
  }

  const normalized_score = max_total_score > 0
    ? Math.max(Math.round((total_score / max_total_score) * 100) - 3, 0)
    : 0;

  return {
    scores,
    total_score,
    normalized_score,
    hardness,
    facetPercentages,
  };
};