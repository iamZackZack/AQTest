export const calculateScore = (questions, userAnswers) => {
    let totalPoints = 0;
    const maxPossibleScore = 63;

    const arraysMatch = (arr1, arr2) => {
        return [...arr1].sort().join(",") === [...arr2].sort().join(",");
      };
      
    const dragGroupScore = (userAnswer, correctAnswer, maxPoints) => {
    const matchedIndices = new Set();
    let correctCount = 0;
    
    for (const userGroup of userAnswer) {
        for (let i = 0; i < correctAnswer.length; i++) {
        if (!matchedIndices.has(i) && arraysMatch(userGroup, correctAnswer[i])) {
            matchedIndices.add(i);
            correctCount++;
            break;
        }
        }
    }
    
    return (correctCount / correctAnswer.length) * maxPoints;
    };

    questions.forEach((question) => {
      const qId = question._id;
      const userAnswer = userAnswers[qId];
      const correct = question.correctAnswer;
      const max = question.maxPoint || 1;
      const type = question.type;
  
      if (!userAnswer || !correct) {
        console.warn(`Skipping question ${qId}:`, { userAnswer, correct });
        return;
      };
  
      switch (type) {
        case "single-multiple-choice":
        case "multiple-multiple-choice":
        case "grid":
        case "hex-grid":
        case "triangle-grid": {
          const correctSet = new Set(correct);
          const userSet = new Set(userAnswer);
          const intersection = [...userSet].filter((val) => correctSet.has(val));
          const partialScore = (intersection.length / correctSet.size) * max;
          totalPoints += partialScore;
          break;
        }
  
        case "text-entry": {
          const acceptedAnswers = Array.isArray(correct) ? correct : [correct];
          const normalized = userAnswer.toLowerCase().trim();
          if (acceptedAnswers.map(a => a.toLowerCase().trim()).includes(normalized)) {
            totalPoints += max;
          }
          break;
        }
  
        case "drag-order": {
          const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correct);
          if (isCorrect) totalPoints += max;
          break;
        }
  
        case "either-or": {
          const correctSet = new Set(correct.map((x) => x.toLowerCase()));
          const userVals = Object.values(userAnswer || {}).map((x) => x.toLowerCase());
          const matches = userVals.filter((val) => correctSet.has(val));
          const partialScore = (matches.length / correct.length) * max;
          totalPoints += partialScore;
          break;
        }
  
        case "drag-group": {
          const partialScore = dragGroupScore(userAnswer, correct, max);
          totalPoints += partialScore;
          break;
        }

        default:
          break;
      }
    });
  
    let percentage = Math.round((totalPoints / maxPossibleScore) * 100);
    return Math.max(0, percentage - 3); // subtract 3%, no negative score
  };