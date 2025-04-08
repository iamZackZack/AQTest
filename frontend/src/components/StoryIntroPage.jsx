import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/story-intro.css"; // New CSS file

const instructions = [
  {
    id: 1,
    icon: "/images/icon-answers.png",
    text: "Each puzzle states how many answers are expected. All questions have an answer.",
  },
  {
    id: 2,
    icon: "/images/icon-timer.png",
    text: "Time is of the essence, and you will be tracked. Complete the test as fast as possible.",
  },
  {
    id: 3,
    icon: "/images/icon-navigation.png",
    text: "You can use the buttons at the bottom to navigate back to or skip questions.",
  },
];

const profanityList = [
  // General profanity
  "fuck", "shit", "bitch", "asshole", "dick", "piss", "crap", "slut", "bastard", "damn", "bloody", "hell",

  // Offensive slurs (racial, homophobic, ableist, etc.)
  "cunt", "nigger", "nigga", "faggot", "fag", "retard", "tranny", "dyke", "kike", "chink", "spic", "gook", "towelhead", "camel jockey", "cripple", "mongoloid",

  // Sexual/explicit terms
  "whore", "cum", "jizz", "cock", "ballsack", "testicle", "pussy", "penis", "vagina", "clit", "dildo", "anal", "buttplug", "semen", "blowjob", "handjob", "deepthroat", "nude", "porn", "xxx", "tits", "boobs", "nipples", "ejaculate", "fleshlight", "milf", "xl", "xxl", "xxxl",

  // Violent and extreme terms
  "murder", "kill", "die", "rape", "rapist", "hang", "lynch", "molest", "pedophile", "terrorist", "bomb", "explosion", "stab", "torture", "massacre", "decapitate", "suicide", "selfharm", "behead", "abduct", "abduction", "bloodbath",

  // General religion-related terms (could be misused)
  "jesus", "christ", "god", "allah", "yahweh", "lord", "messiah", "prophet", "savior", "holy spirit",

  // Specific religious identities (sometimes misused in slurs or mockery)
  "jew", "muslim", "christian", "buddhist", "hindu", "sikh", "atheist", "agnostic", "islamist",

  // Religious slurs or derogatory uses
  "jesus freak", "bible basher", "muzzie", "raghead", "heathen", "infidel", "kafir", "zionist pig", "christkiller", "jihadist", "terrorist",

  // Offensive modifiers
  "fucking god", "fuck god", "goddamn", "holy shit", "jesus fuck", "damn you god", "kill all muslims", "burn the quran", "burn the bible", "fuck the pope",

  // Hate symbols & ideologies
  "nazi", "hitler", "ss", "holocaust", "swastika", "white power", "kkk", "neo-nazi", "ethnic", "ethnic cleans", "genocide", "ethniccleans", "antisemitic", "zionist", "islamophobe", "jewish scum", "anti", "anti semit",

  // Drug references
  "meth", "heroin", "cocaine", "crack", "lsd", "shrooms", "acid", "weed", "marijuana", "stoned", "high af", "druggy", "overdose",

  // Harassment and bullying
  "kill yourself", "kms", "kys", "die bitch", "ugly", "worthless", "fatass", "loser", "idiot", "moron", "dumbass", "creep", "weirdo"
];

const isClean = (name) => {
  const lower = name.toLowerCase();
  return !profanityList.some((badWord) => lower.includes(badWord));
};

const StoryIntroPage = ({ selections, setSelections, onStartQuiz, pseudonym, setPseudonym, goBackToWelcome }) => {
  const [error, setError] = React.useState("");
  const toggleSelection = (id) => {
    setSelections((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="intro-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h2>Welcome to Jurassic Land!</h2>
        <p>
          As a time traveling paleontologist, you have landed in a land where dinosaurs rule once more.
          You want to take as much notes in your journal as possible from your observations.
        </p>

        <label><strong>But first, please enter your adventurer name:</strong></label>
        <input
          type="text"
          value={pseudonym}
          onChange={(e) => {
            const val = e.target.value;
            setPseudonym(val);
            setError(isClean(val) ? "" : "Please choose a different name. That one isn't allowed.");
          }}
          placeholder="e.g. DinoExplorer42"
        />
        {error && <p className="error-message">{error}</p>}

        <p>
          You must solve the <span className="highlight-orange">unique puzzles</span> to complete your notes. But first, read and highlight the time traveling adventuring rules below:
        </p>

        <div className="instruction-boxes">
          {instructions.map(({ id, icon, text }) => (
            <div
              key={id}
              className={`instruction-box ${selections.includes(id) ? "selected" : ""}`}
              onClick={() => toggleSelection(id)}
            >
              <p dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>

        <div className="button-container">
          <button
            className="prev-button"
            onClick={() => {goBackToWelcome()}}>
            ← Back
          </button>
          <button
            className="next-button"
            onClick={() => {
              if (!pseudonym || !isClean(pseudonym)) {
                setError("Please enter a valid adventurer name.");
                return;
              }
              onStartQuiz();
            }}
            disabled={selections.length < 3}
          >
            Start the Test →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryIntroPage;