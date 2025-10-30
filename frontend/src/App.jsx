// React + Libraries
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Styles
import "../global/styles/base.css";

// Components
import RenderQuestion from "./components/RenderQuestion";
import WelcomePage from "./components/WelcomePage";
import StoryIntroPage from "./components/StoryIntroPage";
import EndingPage from "./components/EndingPage";
import LeaderboardPage from "./components/LeaderboardPage";
import DemographicsPage from "./components/DemographicsPage"
import { buildScoreRow } from "./utils/calculateScore";

// Effects
import RainEffect from "./components/effects/rain";
import PterodactylShadow from "./components/effects/shadow";
import LadybugEffect from "./components/effects/insect";
import GustOfLeaves from "./components/effects/wind";

// Utility Functions

// Returns a new array with elements randomly shuffled using Fisher–Yates algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Returns a CSS grid class name based on the number of answer options
const getGridClass = (numOptions) => {
  const layouts = {
    4: "grid-two-columns",
    6: "grid-two-rows-three-columns",
    8: "grid-two-rows-four-columns",
    9: "grid-three-columns",
    12: "grid-three-columns-four-rows",
    16: "grid-four-columns-four-rows",
  };
  return layouts[numOptions] || "grid-default";
};

// Returns a background CSS class based on the index of the puzzle
const getBackgroundClass = (index) => {
  if (index < 8) return "bg-1";
  if (index < 17) return "bg-2";
  if (index < 20) return "bg-3";
  return "bg-4";
};

// Encodes the pseudonym string into base64 for basic obfuscation
const cipherPseudonym = (name) => {
  return btoa(name);
};

// Object containing English and German quiz UI translations for button labels and titles
const quizTranslations = {
  en: {
    puzzle: "Puzzle",
    back: "← Back",
    next: "Next →",
    finish: "Finish"
  },
  de: {
    puzzle: "Rätsel",
    back: "← Zurück",
    next: "Weiter →",
    finish: "Abschließen"
  }
};

// Main Function
function App() {

  // Page States
  const [currentPage, setCurrentPage] = useState("welcome");
  const [language, setLanguage] = useState("en"); // Default language
  const [introSelections, setIntroSelections] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    rankConsent: null,
    pseudonym: "",
    feedback: "",
  });
  const [pseudonym, setPseudonym] = useState("");

  // Question and Answer States
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState({});
  const [textEntryAnswers, setTextEntryAnswers] = useState({});
  const hasImageOptions = questions[currentQuestionIndex]?.options?.some(option => option.type === "image") || false;

  // Visual/Transition States
  const [showBook, setShowBook] = useState(true);
  const [backgroundStep, setBackgroundStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [firstRenderHandled, setFirstRenderHandled] = useState(false);

  // Effects
  const [showRain, setShowRain] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showLadybug, setShowLadybug] = useState(false);
  const [showGust, setShowGust] = useState(false);

  // Time tracking
  const [timeSpentByQ, setTimeSpentByQ] = useState({});
  const [activeTimer, setActiveTimer] = useState({ questionId: null, startedAt: null });

  // Helper functions for question timing
  const startTimerFor = (questionId) => {
    setActiveTimer({ questionId, startedAt: Date.now() });
  };

  const stopTimerFor = () => {
    const { questionId, startedAt } = activeTimer;
    if (!questionId || !startedAt) return;

    const delta = Date.now() - startedAt;
    setTimeSpentByQ((prev) => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + delta,
    }));
    setActiveTimer({ questionId: null, startedAt: null });
  };

  // Fetches questions from the appropriate API endpoint (based on selected language)
  // and sets the initial state with the first question's shuffled options
  useEffect(() => {
    const endpoint =
      language === "de"
        ? `${import.meta.env.VITE_API_URL}/api/questions_de`
        : `${import.meta.env.VITE_API_URL}/api/questions`;

    axios.get(endpoint)
      .then((res) => {
        if (res.data.length > 0 && Array.isArray(res.data[0].options)) {
          setQuestions(res.data);
          setShuffledOptionsMap({ 0: shuffleArray(res.data[0].options) });

          // Start timing for the first question
          const firstId = res.data[0]._id;
          startTimerFor(firstId);
        } else {
          // console.error("No questions returned or missing options field");
        }
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, [language]);

  // Manages background step transitions and "book" animation visibility
  // based on the current question index and whether it's the initial render
  useEffect(() => {
    const calculateStep = (index) => {
      if (index <= 7) return 0;
      if (index <= 16) return 1;
      if (index <= 19) return 2;
      return 3;
    };
  
    const newStep = calculateStep(currentQuestionIndex);
    const stepChanged = newStep !== backgroundStep;
    const isFirstTime = currentQuestionIndex === 0 && !firstRenderHandled;
  
    if (stepChanged || isFirstTime) {
      setShowBook(false);
  
      const timer = setTimeout(() => {
        setShowBook(true);
        if (isFirstTime) setFirstRenderHandled(true);
        setBackgroundStep(newStep);
      }, 2000);
  
      return () => clearTimeout(timer);
    } else {
      setShowBook(true);
    }
    
    // Triggers a short shake animation when reaching the final question
    if (showBook && currentQuestionIndex === 20) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    }
  }, [currentQuestionIndex, firstRenderHandled, backgroundStep]);
  
  // Pause when the tab is hidden; resume when visible:
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        stopTimerFor();
      } else {
        const qId = questions[currentQuestionIndex]?._id;
        if (qId) startTimerFor(qId);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [questions, currentQuestionIndex]);

  // Capture “leave page”
  useEffect(() => {
    const onUnload = () => stopTimerFor();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [activeTimer]);

  // Handles user interaction with answer options for different question types.
  // Updates both the userAnswers state (mapped by question ID) and the selectedAnswers UI state.
  const handleAnswerClick = (option) => {
    const questionId = questions[currentQuestionIndex]._id;
    const questionType = questions[currentQuestionIndex].type;
  
    setUserAnswers((prevAnswers) => {
      let updatedAnswers = { ...prevAnswers };
  
      if (questionType === "single-multiple-choice") {
        updatedAnswers[questionId] = [option];
      } else if (questionType === "multiple-multiple-choice") {
        let selected = updatedAnswers[questionId] || [];
  
        if (selected.includes(option)) {
          selected = selected.filter((ans) => ans !== option);
        } else {
          selected = [...selected, option];
        }
  
        updatedAnswers[questionId] = selected;
      }
  
      return updatedAnswers;
    });
  
    setSelectedAnswers((prevSelected) => {
      if (questionType === "single-multiple-choice") {
        return [option];
      } else {
        return prevSelected.includes(option)
          ? prevSelected.filter((ans) => ans !== option)
          : [...prevSelected, option];
      }
    });
  };

  // Handles answer selection for grid-based questions (e.g., triangle-grid, hex-grid).
  // Updates userAnswers with the selected cell for the current question.
  const handleGridAnswerClick = (cell) => {
    const questionId = questions[currentQuestionIndex]._id;
    
    setUserAnswers((prevAnswers) => {
      let updatedAnswers = { ...prevAnswers };
      updatedAnswers[questionId] = [cell];
      return updatedAnswers;
    });
  
    setSelectedAnswers([cell]);
  };

  // Handles input changes for text-entry questions.
  // Normalizes and stores the text input per question ID.
  const handleTextEntryChange = (questionId, value) => {
    setTextEntryAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value.toLowerCase().trim(), // Normalize input
    }));
  };
  
  // Handles selection for "either-or" questions where users must choose between two options per item.
  // Stores the selected choice per itemText under the corresponding question ID.
  const handleEitherOrSelect = (questionId, itemText, choice) => {
    setUserAnswers((prevAnswers) => {
      let updatedAnswers = { ...prevAnswers };
  
      if (!updatedAnswers[questionId]) {
        updatedAnswers[questionId] = {};
      }
  
      updatedAnswers[questionId][itemText] = choice;
  
      return updatedAnswers;
    });
  };

  // Handles reordering logic for "drag-order" questions using drag-and-drop.
  // Updates the user's answer array to reflect the new item order.
  const handleDragEnd = (result, questionId, options) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
  
    setUserAnswers((prev) => {
      const currentOrder = prev[questionId] || options.map((o) => o.value);
      const updatedOrder = [...currentOrder];
      const [movedItem] = updatedOrder.splice(source.index, 1);
      updatedOrder.splice(destination.index, 0, movedItem);
  
      return {
        ...prev,
        [questionId]: updatedOrder,
      };
    });
  };
  
  // Handles drag-and-drop logic for "drag-group" questions.
  // Manages how items are moved between groups or back to the options pool,
  // and updates userAnswers with the current group configuration.
  const handleGroupDragEnd = (result) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type !== "drag-group") return;
  
    const { source, destination, draggableId } = result;
    if (!destination) return;
  
    const questionId = currentQuestion._id;
    const groupCount = currentQuestion.groupCount || 2;

    // Initialize or deep copy current group structure
    let currentGroups = Array.isArray(userAnswers[questionId]) && userAnswers[questionId].length === groupCount
      ? [...userAnswers[questionId].map((g) => [...g])]
      : Array.from({ length: groupCount }, () => []);
  
    const getIndex = (id) => parseInt(id, 10);
  
    // Case 1: Item dragged from options into a group
    if (source.droppableId === "options" && destination.droppableId !== "options") {
      const destIndex = getIndex(destination.droppableId);
      if (!isNaN(destIndex) && currentGroups[destIndex]) {
        const alreadyGrouped = currentGroups.flat().includes(draggableId);
        if (!alreadyGrouped) {
          currentGroups[destIndex].splice(destination.index, 0, draggableId);
        }
      }
    }
  
    // Case 2: Item moved from one group to another
    else if (source.droppableId !== "options" && destination.droppableId !== "options") {
      const sourceIndex = getIndex(source.droppableId);
      const destIndex = getIndex(destination.droppableId);
      if (!isNaN(sourceIndex) && !isNaN(destIndex)) {
        const sourceGroup = [...currentGroups[sourceIndex]];
        const [movedItem] = sourceGroup.splice(source.index, 1);
        const destGroup = [...currentGroups[destIndex]];
        destGroup.splice(destination.index, 0, movedItem);
  
        currentGroups[sourceIndex] = sourceGroup;
        currentGroups[destIndex] = destGroup;
      }
    }
  
    // Case 3: Item removed from a group and placed back into options
    else if (destination.droppableId === "options" && source.droppableId !== "options") {
      const sourceIndex = getIndex(source.droppableId);
      if (!isNaN(sourceIndex)) {
        const sourceGroup = [...currentGroups[sourceIndex]];
        sourceGroup.splice(source.index, 1);
        currentGroups[sourceIndex] = sourceGroup;
      }
    }

    // Update answer state with new group configuration
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: currentGroups,
    }));
  };
  
  // Handles transition to the next question, including timed visual effects 
  // at specific points (rain after Q1, shadow before Q10, ladybug at Q20, gust at Q24).
  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setDirection(1);

    // Inject rain effect after Q1
    if (currentQuestionIndex === 0) {
      setShowRain(true);
      setTimeout(() => {
        setShowRain(false);
        proceedToNextQuestion(currentQuestion);
      }, 2000);
      return;
    }

    // Inject pterodactyl shadow before Q10
    if (currentQuestionIndex === 8) {
      setShowShadow(true);
      setTimeout(() => {
        setShowShadow(false);
        proceedToNextQuestion(currentQuestion);
      }, 2000);
      return;
    }

    // Show ladybug animation at Question 20
    if (currentQuestionIndex === 20) {
      setShowLadybug(true);
      setTimeout(() => {
        setShowLadybug(false);
        proceedToNextQuestion(currentQuestion);
      }, 4000);
      return;
    }

    // Show gust animation at Question 24
    if (currentQuestionIndex === 24) {
      setShowGust(true);
      setTimeout(() => {
        setShowGust(false);
        proceedToNextQuestion(currentQuestion);
      }, 4000);
      return;
    }

    // Proceed normally if no animation is needed
    proceedToNextQuestion(currentQuestion);
  };

  // Advances the quiz to the next question.
  // Ensures answer states are initialized for special types like text-entry and drag-group.
  // If there are no more questions, navigates to the demographics page.
  const proceedToNextQuestion = (currentQuestion) => {
    stopTimerFor();

    // Save the current text-entry answer into userAnswers
    if (currentQuestion.type === "text-entry") {
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion._id]: textEntryAnswers[currentQuestion._id] || "",
      }));
    }

    // Ensure drag-group questions always have a default group structure
    if (currentQuestion.type === "drag-group") {
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion._id]: userAnswers[currentQuestion._id] || [[], []],
      }));
    }

    // Move to the next question if available
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      const nextQuestionId = nextQuestion._id;

      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswers(userAnswers[nextQuestionId] || []);

      // Initialize text-entry answer state for next question if applicable
      if (nextQuestion.type === "text-entry") {
        setTextEntryAnswers((prevAnswers) => ({
          ...prevAnswers,
          [nextQuestionId]: userAnswers[nextQuestionId] || "",
        }));
      }

      // Shuffle options for certain types if not already shuffled
      if (
        ["single-multiple-choice", "multiple-multiple-choice", "drag-order"].includes(nextQuestion.type) &&
        !shuffledOptionsMap[nextIndex]
      ) {
        setShuffledOptionsMap((prevMap) => ({
          ...prevMap,
          [nextIndex]: shuffleArray(nextQuestion.options),
        }));
      }
      startTimerFor(nextQuestion._id);
    } else {
      // End of quiz: go to demographics page
      setCurrentPage("demographics");
    }
  };

  // Handles navigation to the previous question in the quiz.
  // Updates direction for animation and restores previously selected answers.
  const handlePrevQuestion = () => {
    setDirection(-1); // Set direction for transition animation
    if (currentQuestionIndex > 0) {
      stopTimerFor();
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);

      const prevQuestionId = questions[prevIndex]._id;
      setSelectedAnswers(userAnswers[prevQuestionId] || []);
    
      startTimerFor(prevQuestionId);
    }
  };

  // Handles calculation and submission of final test results.
  // Computes scores, abstraction level, and stores demographic and answer data to the backend.
  const saveTestResults = () => {
    stopTimerFor();

    // align timings both by questionId map and as ordered array (ms)
    const timingArrayMs = questions.map(q => timeSpentByQ[q._id] || 0);

    const cipheredPseudonym = cipherPseudonym(userData.pseudonym || "");
    const { scores, total_score, normalized_score, hardness, facetPercentages } = buildScoreRow(questions, userAnswers);

    // Maps raw total score to a discrete abstraction level category (0–4)
    const mapScoreToAbstractionLevel = (s) => {
      if (s < 1 ) return 0;
      if (s >= 1 && s < 14) return 1;
      if (s >= 14 && s < 42) return 2;
      if (s >= 42 && s < 75) return 3;
      return 4;
    };

    const abstractionLvl = mapScoreToAbstractionLevel(total_score);

    // Prepare complete result object to submit
    const resultData = {
      answers: userAnswers,
      correctedRow: scores.reverse(),
      finalScore: normalized_score,                 
      pseudonym: cipheredPseudonym,
      useName: userData.rankConsent ?? true,
      abstractionLevel: abstractionLvl,
      timestamp: new Date().toISOString(),
      timeByQuestionMs: timeSpentByQ,
      timeByOrderMs: timingArrayMs,
      demographics: {
        university: userData.university,
        degree: userData.degree,
        level: userData.level,
        subjectField: userData.subjectField,
        rating: userData.rating,
        educationYears: userData.educationYears,
        gpa: userData.gpa,
        gender: userData.gender,
        age: userData.age,
        languageSkill: userData.languageSkill
      },
      facetScores: facetPercentages
    };

    setUserData(resultData)
    
    // Send results to backend API
    axios.post(`${import.meta.env.VITE_API_URL}/api/answers`, resultData)
      .catch(err => {
        // Handle error (uncomment to debug)
        // console.error("Error saving result:", err)
      });
  };

  // Resets the application state to initial values, clearing all user data and answers.
  // Navigates to the specified page (e.g. "language", "story", or "quiz").
  const resetApp = (goToWindow) => {
    stopTimerFor();
    setTimeSpentByQ({});
    setActiveTimer({ questionId: null, startedAt: null });
    setUserData({});
    setPseudonym("");
    setUserAnswers({});
    setSelectedAnswers([]);
    setTextEntryAnswers({});
    setShuffledOptionsMap({});
    setCurrentQuestionIndex(0);
    setIntroSelections([]);
    setCurrentPage(goToWindow);
  };  

  // Renders the main app interface including:
  // - background styling
  // - animated overlays (rain, shadow, ladybug, gust)
  // - conditional pages (welcome, story, quiz, demographics, end, leaderboard)
  // - dynamic question rendering with transition effects and progress bar
  return (
    <div
      className={`book-container ${getBackgroundClass(currentQuestionIndex)} ${!showBook ? "background-only" : ""}`}
    >
      {/* Animation overlays */}
      {showRain && <RainEffect duration={8000} />}
      {showShadow && <PterodactylShadow />}
      {showLadybug && <LadybugEffect />}
      {showGust && <GustOfLeaves />}

      {/* Progress Bar only visible during the quiz */}
      {currentPage === "quiz" && (
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-fill"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      )}
  
      {/* Welcome Page */}
      {currentPage === "welcome" && (
        <WelcomePage
          language={language}
          setLanguage={setLanguage}
          toLeaderboard={() => {
            setCurrentPage("leaderboard")
          }}
          onContinue={() => setCurrentPage("story")}
        />
      )}
  
      {/* Story Intro Page */}
      {currentPage === "story" && (
        <StoryIntroPage
          selections={introSelections}
          language={language}
          setSelections={setIntroSelections}
          goBackToWelcome={() => {
            resetApp("welcome")
          }}
          onStartQuiz={() => {
            setUserData((prev) => ({ ...prev, pseudonym }));
            setCurrentPage("quiz");
          }}
          pseudonym={pseudonym}
          setPseudonym={setPseudonym}
        />      
      )}
  
      {/* Main Quiz Interface */}
      {currentPage === "quiz" && showBook && (
        <motion.div 
          className={`book ${isShaking ? "shake" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="page"            
            >
              {questions.length === 0 ? (
                <p>Loading questions...</p>
              ) : (
                <div className="question-container">
                  <h3 className="puzzle-text">
                    {quizTranslations[language].puzzle} {currentQuestionIndex + 1}:
                  </h3>

                  {/* Flavor text, image, and question text rendering */}
                  <div className={`text-image-container ${hasImageOptions ? "with-image" : ""}`}>
                    <div className="text-content">
                      <div className="flavor-text-container">
                        <p
                          className="flavor-text"
                          dangerouslySetInnerHTML={{
                            __html: questions[currentQuestionIndex]?.flavorText,
                          }}
                        ></p>
                        {questions[currentQuestionIndex]?.startImage && (
                          <img
                            src={questions[currentQuestionIndex].startImage}
                            alt="Start"
                            className="start-image-inline"
                          />
                        )}
                      </div>
                      {!hasImageOptions && questions[currentQuestionIndex]?.qImage && (
                      <img
                        src={questions[currentQuestionIndex].qImage}
                        alt="Question"
                        className="question-image"
                        style={{
                          width: questions[currentQuestionIndex]?.qImageWidth || "auto",
                          height: questions[currentQuestionIndex]?.qImageHeight || "auto",
                        }}
                      />
                    )}
                    </div>
                      {hasImageOptions && questions[currentQuestionIndex]?.qImage && (
                        <img
                        src={questions[currentQuestionIndex].qImage}
                        alt="Question"
                        className="question-image-side"
                        style={{
                          width: questions[currentQuestionIndex]?.qImageWidth || "auto",
                          height: questions[currentQuestionIndex]?.qImageHeight || "auto",
                        }}
                      />
                    )}
                  </div>
  
                  <p
                    className="question-text"
                    dangerouslySetInnerHTML={{
                      __html: questions[currentQuestionIndex]?.questionText,
                    }}
                  ></p>
  
                  {/* Question type-specific rendering */}
                  <RenderQuestion
                    question={questions[currentQuestionIndex]}
                    language={language}
                    userAnswers={userAnswers}
                    setUserAnswers={setUserAnswers}
                    selectedAnswers={selectedAnswers}
                    setSelectedAnswers={setSelectedAnswers}
                    textEntryAnswers={textEntryAnswers}
                    setTextEntryAnswers={setTextEntryAnswers}
                    handleGridAnswerClick={handleGridAnswerClick}
                    handleGroupDragEnd={handleGroupDragEnd}
                    handleTextEntryChange={handleTextEntryChange}
                    handleDragEnd={handleDragEnd}
                    handleEitherOrSelect={handleEitherOrSelect}
                    handleAnswerClick={handleAnswerClick}
                    shuffledOptions={shuffledOptionsMap[currentQuestionIndex]}
                    getGridClass={getGridClass}
                  />
  
                  {/* Navigation Buttons */}
                  <div className="button-container">
                    {currentQuestionIndex > 0 && (
                      <button onClick={handlePrevQuestion} className="base-prev-button">
                          {quizTranslations[language].back}
                      </button>
                    )}
                    <button onClick={handleNextQuestion} className="base-next-button">
                      {currentQuestionIndex + 1 < questions.length
                        ? quizTranslations[language].next
                        : quizTranslations[language].finish}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Demographics Page */}
      {currentPage === "demographics" && (
        <DemographicsPage
          userData={userData}
          setUserData={setUserData}
          language={language}
          onNext={() => {
            saveTestResults();
            setCurrentPage("end");
          }}
        />
      )}

      {/* End Page */}
      {currentPage === "end" && (
        <EndingPage
          userData={userData}
          language={language}
          setUserData={setUserData}
          onSubmitFinalForm={() => {
            resetApp("leaderboard");
          }}
          goToWelcome={() => {
            resetApp("welcome");
          }} 
        />
      )}

      {/* Leaderboard Page */}
      {currentPage === "leaderboard" && (
        <LeaderboardPage 
          language={language}
          goToWelcome={() => resetApp("welcome")} 
        />
      )}

    </div>
  );

}

export default App;