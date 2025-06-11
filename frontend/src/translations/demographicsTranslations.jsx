const demographicsTranslations = {
  en: {
    loading: "We are calculating your Abstraction Quotient. Meanwhile, please fill in some details about yourself for demographics purposes.",
    university: "University:",
    otherUniversity: "Enter University Name",
    degree: "Current Degree Name (for example B.Sc. Applied Mathematics):",
    level: "Level:",
    subject: "Subject Field:",
    rating: "Rate the test (1–10):",
    years: "Total Years in Higher Education (for example: bachelors (3.5 years) + masters (1 year) = 4.5 years):",
    gpa: "Current GPA. If not available, your high school final grade (for example: 1.3 or 87%):",
    gender: "Gender:",
    age: "Age:",
    language: "Language Proficiency (A1–C2):",
    continue: "Continue →",
    errors: {
      educationYears: "Must be between 1–10",
      gpa: "Must be between 1–100",
      age: "Must be between 10–99",
    },
    genders: ["Male", "Female", "Other"],
    levels: ["Bachelor", "Master"],
    subjects: [
      "Biology", "Chemistry", "Physics", "Mathematics", "Engineering",
      "Computer Science", "Social Sciences", "Humanities", "Other"
    ]
  },

  de: {
    loading: "Wir berechnen gerade deinen Abstraktionsquotienten. In der Zwischenzeit füll bitte ein paar demographische Daten aus.",
    university: "Universität:",
    otherUniversity: "Name der Universität eingeben",
    degree: "Name des Studiengangs (Zum Beispiel B. Sc. Applied Mathematics):",
    level: "Stufe:",
    subject: "Fachbereich:",
    rating: "Wie ansprechend war deiner Meinung nach der Test (1–10)?",
    years: "Jahre in der Hochschulausbildung (Zum Beispiel: Bachelor (3.5 Jahre) + Master (1 Jahr) = 4.5 Jahre):",
    gpa: "Notendurchschnitt. Alternativ Abiturnote (Zum Beispiel 1.3 oder 87%):",
    gender: "Geschlecht:",
    age: "Alter:",
    language: "Sprachkenntnisse (A1–C2):",
    continue: "Weiter →",
    errors: {
      educationYears: "Muss zwischen 1–10 liegen",
      gpa: "Muss zwischen 1–100 liegen",
      age: "Muss zwischen 10–99 liegen",
    },
    genders: ["Männlich", "Weiblich", "Andere"],
    levels: ["Bachelor", "Master"],
    subjects: [
      "Biologie", "Chemie", "Physik", "Mathematik", "Ingenieurwesen",
      "Informatik", "Sozialwissenschaften", "Geisteswissenschaften", "Andere"
    ]
  }
};

export default demographicsTranslations;