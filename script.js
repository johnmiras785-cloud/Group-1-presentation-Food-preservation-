
const slides = [...document.querySelectorAll(".slide")];

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const navCounter = document.getElementById("navCounter");
const progressBar = document.getElementById("progressBar");
const fullBtn = document.getElementById("fullBtn");

let currentSlide = 0;
let isChanging = false;

function showSlide(index) {
  if (isChanging) return;

  // The last slide can restart the presentation.
  if (index >= slides.length) {
    index = 0;
  }

  if (index < 0 || index >= slides.length) return;
  if (index === currentSlide) return;

  isChanging = true;

  slides[currentSlide].classList.remove("active");
  currentSlide = index;
  slides[currentSlide].classList.add("active");

  // Start each slide at its top.
  slides[currentSlide].scrollTop = 0;

  updateNavigation();

  window.setTimeout(() => {
    isChanging = false;
  }, 320);
}

function updateNavigation() {
  const number = currentSlide + 1;
  const total = slides.length;

  navCounter.textContent = `${number} / ${total}`;
  progressBar.style.width = `${(number / total) * 100}%`;

  prevBtn.disabled = currentSlide === 0;

  if (currentSlide === total - 1) {
    nextBtn.innerHTML = "<span>RESTART</span> ↻";
    nextBtn.setAttribute("aria-label", "Restart presentation");
  } else {
    nextBtn.innerHTML = "<span>NEXT</span> →";
    nextBtn.setAttribute("aria-label", "Next slide");
  }
}

nextBtn.addEventListener("click", () => {
  if (currentSlide === slides.length - 1) {
    restartPresentation();
  } else {
    showSlide(currentSlide + 1);
  }
});

prevBtn.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

// Keyboard controls
document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();

    if (currentSlide === slides.length - 1) {
      restartPresentation();
    } else {
      showSlide(currentSlide + 1);
    }
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    showSlide(currentSlide - 1);
  }

  if (event.key === "Home") {
    restartPresentation();
  }

  if (event.key.toLowerCase() === "f") {
    toggleFullscreen();
  }
});

// Fullscreen
async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    alert("Fullscreen is not available in this browser.");
  }
}

fullBtn.addEventListener("click", toggleFullscreen);

// ===================================
// INTERACTIVE QUIZ — 3 QUESTIONS
// ===================================

const questions = [
  {
    question: "1. Why does refrigeration slow food spoilage?",
    answers: [
      "It kills every microorganism",
      "It slows the growth of many microorganisms",
      "It makes food completely sterile",
      "It removes all water from food"
    ],
    correct: 1,
    explanation:
      "Correct! Cold temperatures slow the growth of many microorganisms."
  },
  {
    question: "2. What is a refrigerator?",
    answers: [
      "A machine that heats food",
      "A machine that dries food",
      "An appliance that removes heat to keep food cold",
      "A machine that kills all bacteria"
    ],
    correct: 2,
    explanation:
      "Correct! A refrigerator removes heat from its inside to keep food and drinks cold."
  },
  {
    question: "3. What is the recommended maximum refrigerator temperature?",
    answers: [
      "20°C",
      "15°C",
      "10°C",
      "4°C (40°F)"
    ],
    correct: 3,
    explanation:
      "Correct! Keep the refrigerator at 4°C (40°F) or below."
  }
];

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const quizCount = document.getElementById("quizCount");
const feedback = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const quizNext = document.getElementById("quizNext");

let questionIndex = 0;
let score = 0;
let answered = false;
let quizComplete = false;

function renderQuestion() {
  const q = questions[questionIndex];

  answered = false;
  quizComplete = false;

  quizCount.textContent =
    `QUESTION ${questionIndex + 1} OF ${questions.length}`;

  questionElement.textContent = q.question;
  answersElement.innerHTML = "";
  feedback.textContent = "";
  feedback.className = "feedback";

  quizNext.disabled = true;
  quizNext.textContent = "CHOOSE AN ANSWER";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-btn";
    button.textContent =
      `${String.fromCharCode(65 + index)}. ${answer}`;

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    answersElement.appendChild(button);
  });

  scoreElement.textContent = `Score: ${score}`;
}

function selectAnswer(selectedIndex) {
  if (answered || quizComplete) return;

  answered = true;

  const q = questions[questionIndex];
  const buttons = [
    ...answersElement.querySelectorAll(".answer-btn")
  ];

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === q.correct) {
      button.classList.add("correct");
    }
  });

  if (selectedIndex === q.correct) {
    score++;

    feedback.textContent = "✓ " + q.explanation;
    feedback.classList.add("good");
  } else {
    buttons[selectedIndex].classList.add("wrong");

    feedback.textContent = "Not quite. " + q.explanation;
    feedback.classList.add("bad");
  }

  scoreElement.textContent = `Score: ${score}`;

  quizNext.disabled = false;
  quizNext.textContent =
    questionIndex === questions.length - 1
      ? "VIEW FINAL SCORE →"
      : "NEXT QUESTION →";
}

function showQuizResult() {
  quizComplete = true;

  const percent = Math.round(
    (score / questions.length) * 100
  );

  quizCount.textContent = "QUIZ COMPLETED";
  questionElement.textContent = "Your final score!";

  answersElement.innerHTML = "";

  const result = document.createElement("div");
  result.className = "result-panel";

  const resultScore = document.createElement("div");
  resultScore.className = "result-score";
  resultScore.textContent = `${score} / ${questions.length}`;

  const resultPercent = document.createElement("div");
  resultPercent.className = "result-percent";
  resultPercent.textContent = `${percent}% CORRECT`;

  const message = document.createElement("p");

  if (percent === 100) {
    message.textContent =
      "Excellent! You understood the lesson.";
  } else if (percent >= 60) {
    message.textContent =
      "Good job! Review the slides to learn even more.";
  } else {
    message.textContent =
      "Keep learning! Read the lesson again and try once more.";
  }

  const retry = document.createElement("button");
  retry.className = "answer-btn";
  retry.textContent = "↻ TRY AGAIN";
  retry.addEventListener("click", restartQuiz);

  result.append(resultScore, resultPercent, message, retry);
  answersElement.appendChild(result);

  feedback.textContent =
    "Remember: refrigeration slows spoilage, but proper food handling is essential.";

  feedback.className = "feedback good";

  quizNext.disabled = false;
  quizNext.textContent = "CONTINUE →";
}

function restartQuiz() {
  questionIndex = 0;
  score = 0;
  answered = false;
  quizComplete = false;

  renderQuestion();
}

quizNext.addEventListener("click", () => {
  if (!answered && !quizComplete) return;

  if (quizComplete) {
    // Continue from the quiz to the conclusion slide.
    showSlide(7);
    return;
  }

  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    showQuizResult();
  }
});

// Restart all slides from the beginning
function restartPresentation() {
  currentSlide = 0;

  slides.forEach(slide => {
    slide.classList.remove("active");
    slide.scrollTop = 0;
  });

  slides[0].classList.add("active");

  questionIndex = 0;
  score = 0;
  answered = false;
  quizComplete = false;

  renderQuestion();
  updateNavigation();
}

// Initialize
renderQuestion();
updateNavigation();
