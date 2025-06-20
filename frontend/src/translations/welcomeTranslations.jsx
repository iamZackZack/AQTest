// Constains the english and german text for the Welcome page.

const welcomeTranslations = {
  en: {
    title: <>Welcome to the <span className="highlight-title">Abstraction Test</span>!</>,
    languagePrompt: <>Please select the <span className="highlight">language</span> you are most proficient at below.</>,
    intro: <>
      The following set of puzzles were designed to measure your{" "}
      <span className="highlight-purple">Abstraction Quotient</span> (AQ). To achieve the best measurement possible, please take the test under ideal conditions:
    </>,
    guidelines: [
      <>The test takes approx. <strong>30min</strong> to complete. Ensure enough time to finish the full test.</>,
      <>The test is best displayed on a <strong><u>larger screen</u></strong>. Avoid mobile if possible.</>,
      <>We recommend taking the test in an <strong><u>undisrupted</u></strong> environment.</>,
    ],
    storyline: <>The test follows a storyline to make the experience more engaging. On the next page, you’ll be introduced to the story and the test instructions.</>,
    devNote: <>Developer's Note: Not optimized for mobile!</>,
    issues: <>Issues? Contact <a href="mailto:abstraction@cdtm.com">abstraction@cdtm.com</a></>,
    continue: "Continue →",
    leaderboard: "Go to Leaderboard",
  },

  de: {
    title: <>Willkommen zum <span className="highlight-title">Abstraktionstest</span>!</>,
    languagePrompt: <>Bitte wähle unten die <span className="highlight">Sprache</span> aus, die du am besten beherrschst.</>,
    intro: <>
      Die folgenden Rätsel wurden entwickelt, um deinen{" "}
      <span className="highlight-purple">Abstraktionsquotienten</span> (AQ) zu messen. Um ein möglichst genaues Ergebnis zu erzielen, führe den Test bitte unter idealen Bedingungen durch:
    </>,
    guidelines: [
      <>Der Test dauert ca. <strong>30 Minuten</strong>. Bitte stelle sicher, dass du genug Zeit hast, um den gesamten Test zu absolvieren.</>,
      <>Der Test lässt sich am besten auf einem <strong><u>größeren Bildschirm</u></strong> ausführen. Vermeide nach Möglichkeit die Verwendung eines Mobilgeräts.</>,
      <>Wir empfehlen, den Test in einer <strong><u>Umgebung ohne Störungen</u></strong> durchzuführen.</>,
    ],
    storyline: <>Der Test folgt einer Handlung, um das Erlebnis interessanter zu gestalten. Auf der nächsten Seite wirst du in die Geschichte und die Testanweisungen eingeführt.</>,
    devNote: <>Hinweis: Nicht für Mobilgeräte optimiert!</>,
    issues: <>Probleme? Kontakt: <a href="mailto:abstraction@cdtm.com">abstraction@cdtm.com</a></>,
    continue: "Weiter →",
    leaderboard: "Zum Leaderboard",
  }
};

export default welcomeTranslations;