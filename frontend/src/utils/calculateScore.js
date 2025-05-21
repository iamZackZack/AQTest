export const buildScoreRow = (questions, userAnswers) => {
  const scores = [];

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

    if (!userAnswer || !correct) {
      scores.push(0); // unanswered or invalid = 0
      continue;
    }

    let score = 0;

    switch (type) {
      case "single-multiple-choice":
      case "grid":
      case "hex-grid":
      case "triangle-grid": {
        const correctAnswer = Array.isArray(correct) ? correct[0] : correct;
        const user = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
        if (user === correctAnswer) score = 1;
        break;
      }

      case "multiple-multiple-choice": {
        const correctSet = new Set(correct);
        const userSet = new Set(userAnswer);
        const intersection = [...userSet].filter((val) =>
          correctSet.has(val)
        );
        score = Math.min(intersection.length, max); // cap at maxPoint
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
  }

  return scores; // array of length == number of questions
};