import { useState } from "react";
import Question from "./Question";
import Result from "./Result";
import "./Quiz.css";

const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Paris", "Rome", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    id: 2,
    question: "Which programming language runs in the browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: "JavaScript",
  },
  {
    id: 3,
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Creative Style System",
      "Colorful Style Syntax",
      "Computer Style Sheet",
    ],
    answer: "Cascading Style Sheets",
  },
];

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

return (
  <div className="quiz-container">
    {!finished ? (
      <Question
        data={questions[current]}
        onAnswer={handleAnswer}
        current={current}
        total={questions.length}
      />
    ) : (
      <Result score={score} total={questions.length} />
    )}
  </div>
);
}

export default Quiz;
