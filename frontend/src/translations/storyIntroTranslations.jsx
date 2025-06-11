// translations/storyIntroTranslations.jsx
const storyIntroTranslations = {
  en: {
    heading: <>Welcome to <span className="highlight-title">Jurassic Land</span>!</>,
    intro: <>
      As a time traveling paleontologist, you have landed in a land where dinosaurs rule once more. You want to take as many notes in your journal as possible from your observations.
    </>,
    nameLabel: <>But first, please enter your <strong>adventurer name</strong>:</>,
    errorMessage: "Please choose a different name. That one isn't allowed.",
    selectionIntro: <>
      You must solve the <span className="highlight-orange">unique puzzles</span> to complete your notes. But first, read and highlight the time traveling adventuring rules below:
    </>,
    instructions: [
      <>Each puzzle states how many answers are expected. All questions have an answer.</>,
      <>Time is of the essence, and you will be tracked. Complete the test as fast as possible.</>,
      <>You can use the buttons at the bottom to go back or skip questions.</>
    ],
    back: "← Back",
    start: "Start the Test →",
    emptyNameError: "Please enter a valid adventurer name."
  },

  de: {
    heading: <>Willkommen im <span className="highlight-title">Jurassic Land</span>!</>,
    intro: <>
      Als zeitreisender Paläontologe bist du in einem Land gelandet, in dem die Dinosaurier noch einmal herrschen. Du möchtest in deinem Tagebuch so viele Notizen wie möglich über deine Beobachtungen machen.
    </>,
    nameLabel: <>Aber zuerst gib bitte deinen <strong>Abenteurernamen</strong> ein:</>,
    errorMessage: "Bitte wähle einen anderen Namen. Dieser ist nicht erlaubt.",
    selectionIntro: <>
      Du musst die <span className="highlight-orange">einzigartigen Rätsel</span> lösen, um deine Notizen zu vervollständigen. Lies jedoch zuerst die folgenden Regeln für zeitreisende Abenteurer und bestätige sie:
    </>,
    instructions: [
      <>Bei jedem Rätsel ist angegeben, wie viele Antworten erwartet werden. Auf alle Rätsel gibt es eine Antwort.</>,
      <>Die Zeit ist von entscheidender Bedeutung, und du wirst gemessen. Beende den Test so schnell wie möglich.</>,
      <>Mit den Buttons am unteren Rand kannst du zurückgehen oder Fragen überspringen.</>
    ],
    back: "← Zurück",
    start: "Den Test starten →",
    emptyNameError: "Bitte gib einen gültigen Abenteurernamen ein."
  }
};

export default storyIntroTranslations;