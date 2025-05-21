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

// Utility
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

const getBackgroundClass = (index) => {
  if (index < 8) return "bg-1";
  if (index < 17) return "bg-2";
  if (index < 20) return "bg-3";
  return "bg-4";
};

const cipherPseudonym = (name) => {
  return btoa(name);
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
  const [finalScore, setFinalScore] = useState(null);
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

  // Question Fetching Handler
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/questions`)
      .then(res => {
        console.log("Fetched Questions:", res.data);
        if (res.data.length > 0 && Array.isArray(res.data[0].options)) {
          setQuestions(res.data);
          setShuffledOptionsMap({ 0: shuffleArray(res.data[0].options) });
        } else {
          console.error("⚠️ No questions returned or missing options field");
        }
      })
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

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
    if (showBook && currentQuestionIndex === 20) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    }
  }, [currentQuestionIndex, firstRenderHandled, backgroundStep]);
  
  // General Question Handler
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

  const handleGridAnswerClick = (cell) => {
    const questionId = questions[currentQuestionIndex]._id;
    
    setUserAnswers((prevAnswers) => {
      let updatedAnswers = { ...prevAnswers };
      updatedAnswers[questionId] = [cell];
      return updatedAnswers;
    });
  
    setSelectedAnswers([cell]);
  };

  // Text Handler
  const handleTextEntryChange = (questionId, value) => {
    setTextEntryAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value.toLowerCase().trim(), // Normalize input
    }));
  };
  
  // Either-Or Handler
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

  // Drag Order Handler
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
  
  // Drag Group Handler
  const handleGroupDragEnd = (result) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type !== "drag-group") return;
  
    const { source, destination, draggableId } = result;
    if (!destination) return;
  
    const questionId = currentQuestion._id;
    const groupCount = currentQuestion.groupCount || 2;
  
    let currentGroups = Array.isArray(userAnswers[questionId]) && userAnswers[questionId].length === groupCount
      ? [...userAnswers[questionId].map((g) => [...g])] // Deep copy of each group
      : Array.from({ length: groupCount }, () => []);
  
    const getIndex = (id) => parseInt(id, 10);
  
    if (source.droppableId === "options" && destination.droppableId !== "options") {
      const destIndex = getIndex(destination.droppableId);
      if (!isNaN(destIndex) && currentGroups[destIndex]) {
        const alreadyGrouped = currentGroups.flat().includes(draggableId);
        if (!alreadyGrouped) {
          currentGroups[destIndex].splice(destination.index, 0, draggableId);
        }
      }
    }
  
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
  
    else if (destination.droppableId === "options" && source.droppableId !== "options") {
      const sourceIndex = getIndex(source.droppableId);
      if (!isNaN(sourceIndex)) {
        const sourceGroup = [...currentGroups[sourceIndex]];
        sourceGroup.splice(source.index, 1);
        currentGroups[sourceIndex] = sourceGroup;
      }
    }
  
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: currentGroups,
    }));
  };
  
  // Handle Next Question
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

    if (currentQuestionIndex === 20) {
      setShowLadybug(true);
      setTimeout(() => {
        setShowLadybug(false);
        proceedToNextQuestion(currentQuestion);
      }, 4000);
      return;
    }

    if (currentQuestionIndex === 24) {
      setShowGust(true);
      setTimeout(() => {
        setShowGust(false);
        proceedToNextQuestion(currentQuestion);
      }, 4000);
      return;
    }

    proceedToNextQuestion(currentQuestion);
  };

  const proceedToNextQuestion = (currentQuestion) => {
    if (currentQuestion.type === "text-entry") {
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion._id]: textEntryAnswers[currentQuestion._id] || "",
      }));
    }

    if (currentQuestion.type === "drag-group") {
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion._id]: userAnswers[currentQuestion._id] || [[], []],
      }));
    }

    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      const nextQuestionId = nextQuestion._id;

      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswers(userAnswers[nextQuestionId] || []);

      if (nextQuestion.type === "text-entry") {
        setTextEntryAnswers((prevAnswers) => ({
          ...prevAnswers,
          [nextQuestionId]: userAnswers[nextQuestionId] || "",
        }));
      }

      if (
        ["single-multiple-choice", "multiple-multiple-choice", "drag-order"].includes(nextQuestion.type) &&
        !shuffledOptionsMap[nextIndex]
      ) {
        setShuffledOptionsMap((prevMap) => ({
          ...prevMap,
          [nextIndex]: shuffleArray(nextQuestion.options),
        }));
      }
    } else {
      const row = buildScoreRow(questions, userAnswers).reverse();

      console.log("🧠 Original userAnswers:", userAnswers);
      console.log("📊 Converted row for model:", row);

      fetch(`${import.meta.env.VITE_API_URL}/api/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ response: row })
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Player's EAP Score:", data.score);
        setFinalScore(data.score);                // Show this on EndingPage
        saveTestResults(data.score);              // Save EAP-based score
        setCurrentPage("demographics");           // Move forward
      })
      .catch((err) => {
        console.error("Scoring error:", err);
        setCurrentPage("demographics");           // Still proceed even if error
      });    
    }
  };

  // Handle Previous Question
  const handlePrevQuestion = () => {
    setDirection(-1);
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      
      const prevQuestionId = questions[prevIndex]._id;
      setSelectedAnswers(userAnswers[prevQuestionId] || []);
    }
  };

  // Handle Test Results
  const saveTestResults = (score) => {
    const cipheredPseudonym = cipherPseudonym(userData.pseudonym || "");
    const resultData = {
      answers: userAnswers,
      finalScore: score,
      pseudonym: cipheredPseudonym,
      useName: userData.rankConsent ?? true,
      timestamp: new Date().toISOString()
    };
      
    axios.post(`${import.meta.env.VITE_API_URL}/api/answers`, resultData)
    .catch(err => console.error("Error saving result:", err));
  };

  const resetApp = (goToWindow) => {
    setUserData({
      email: "",
      rankConsent: null,
      pseudonym: "",
      feedback: "",
    });
    setFinalScore(null);
    setPseudonym("");
    setUserAnswers({});
    setSelectedAnswers([]);
    setTextEntryAnswers({});
    setShuffledOptionsMap({});
    setCurrentQuestionIndex(0);
    setIntroSelections([]);
    setCurrentPage(goToWindow); // or "story" if you want to skip the language page
  };  

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
                  <h3 className="puzzle-text">Puzzle {currentQuestionIndex + 1}:</h3>
  
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
  
                  <RenderQuestion
                    question={questions[currentQuestionIndex]}
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
  
                  <div className="button-container">
                    {currentQuestionIndex > 0 && (
                      <button onClick={handlePrevQuestion} className="base-prev-button">
                        ← Back
                      </button>
                    )}
                    <button onClick={handleNextQuestion} className="base-next-button">
                      {currentQuestionIndex + 1 < questions.length ? "Next →" : "Finish"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
      {currentPage === "demographics" && (
        <DemographicsPage
          userData={userData}
          setUserData={setUserData}
          onNext={() => setCurrentPage("end")}
        />
      )}
      {currentPage === "end" && (
        <EndingPage
          result={finalScore}
          userData={userData}
          setUserData={setUserData}
          onSubmitFinalForm={() => {
            resetApp("leaderboard");
          }}
          goToWelcome={() => {
            resetApp("welcome");
          }} 
        />
      )}
      {currentPage === "leaderboard" && (
        <LeaderboardPage goToWelcome={() => resetApp("welcome")} />
      )}
    </div>
  );
}

export default App;