import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/story-intro.css"; // New CSS file
import storyIntroTranslations from "../translations/storyIntroTranslations";

const instructions = [
  {
    id: 1,
    icon: "/images/story/story1.png",
    text: "Each puzzle states how many answers are expected. All questions have an answer.",
  },
  {
    id: 2,
    icon: "/images/story/story3.png",
    text: "Time is of the essence, and you will be tracked. Complete the test as fast as possible.",
  },
  {
    id: 3,
    icon: "/images/story/story2.png",
    text: "You can use the buttons at the bottom to go back or skip questions.",
  },
];

// List of disallowed words used for input validation
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
  "kill yourself", "kms", "kys", "die bitch", "ugly", "worthless", "fatass", "loser", "idiot", "moron", "dumbass", "creep", "weirdo",

  // German general profanity
  "scheiße", "scheiss", "arsch", "fick", "hurensohn", "hure", "wichser", "pimmel", "schlampe", "miststück", "verdammt", "fuck you", "leck mich", "fresse", "halt die fresse",

  // German racial/religious/identity slurs
  "kanake", "judensau", "islamist", "köterrasse", "türkenpack", "zionistenschwein", "nazischwein", "kuffar", "kafir", "moslemfeind", "antisemit", "islamhasser", "jüdischenschwein", "zigeuner", "neger", "schwuchtel", "behindert", "krüppel",

  // German violent/extreme language
  "vergasen", "verbrennen", "abschlachten", "ermorden", "erschießen", "erstechen", "töten", "vergewaltigen", "terroranschlag", "sprengstoff", "massaker", "blutbad", "gaskammer", "bomben",

  // German sexual/offensive expressions
  "muschi", "votze", "dildo", "blasen", "lecken", "anal", "porno", "nackt", "bumsen", "titten", "nippel", "ejakulieren", "sperma", "schwanz", "ficken", "onanieren", "wichsen", "hoden", "sex", "handjob", "klitoris",

  // German religious blasphemy/misuse
  "gottverdammt", "scheiß jesus", "gott ist tot", "allah ist...", "gott hasst...", "fuck die bibel", "koran verbrennen", "jesus hurensohn", "heilige scheiße", "verfluchter gott",

  // German hate ideologies/symbols
  "nazis", "hitler", "ss", "reich", "holocaust", "juden raus", "ausländer raus", "ethnische säuberung", "weißmacht", "arisch", "drittes reich", "gas die juden", "heil hitler", "88", "sieg heil",

  // German bullying/harassment
  "töte dich", "selbstmord", "du bist hässlich", "wertlos", "fette sau", "idiot", "spast", "opfer", "psycho", "creep", "perversling"
];

// Checks if a given name contains any word from the profanity list
const isClean = (name) => {
  const lower = name.toLowerCase();
  return !profanityList.some((badWord) => lower.includes(badWord));
};

// The intro screen shown before starting the quiz.
// Shows instructions, collects pseudonym, and tracks user readiness.
const StoryIntroPage = ({ selections, setSelections, onStartQuiz, pseudonym, setPseudonym, goBackToWelcome, language }) => {
  const [error, setError] = React.useState("");
  const t = storyIntroTranslations[language];

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
        <h2>{t.heading}</h2>
        <p>{t.intro}</p>

        {/* Pseudonym input with profanity validation */}
        <label>{t.nameLabel}</label>
        <input
          type="text"
          value={pseudonym}
          onChange={(e) => {
            const val = e.target.value;
            setPseudonym(val);
            setError(isClean(val) ? "" : t.errorMessage);
          }}
          placeholder="e.g. DinoExplorer42"
        />
        {error && <p className="error-message">{error}</p>}

        {/* Instruction cards */}
        <p>{t.selectionIntro}</p>
        <div className="instruction-boxes">
          {t.instructions.map((text, i) => (
            <div
              key={i}
              className={`instruction-box ${selections.includes(i + 1) ? "selected" : ""}`}
              onClick={() => toggleSelection(i + 1)}
            >
              <img
                src={`/images/story/story${i + 1}.png`}
                alt="icon"
                className="instruction-icon"
              />
              <p>{text}</p>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="button-container">
          <button className="story-prev-button" onClick={goBackToWelcome}>
            {t.back}
          </button>
          <button
            className="story-next-button"
            onClick={() => {
              if (!pseudonym || !isClean(pseudonym)) {
                setError(t.emptyNameError);
                return;
              }
              onStartQuiz();
            }}
            disabled={selections.length < 3}
          >
            {t.start}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryIntroPage;