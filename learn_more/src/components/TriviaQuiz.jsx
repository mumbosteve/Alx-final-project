import { useEffect, useState } from "react";
import "../index.css";

function TriviaQuiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Fetch questions with better error handling and retry logic
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add timeout and retry logic
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch("https://opentdb.com/api.php?amount=3&type=multiple", {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we actually got questions
        if (data.response_code !== 0) {
          throw new Error("API returned no questions. Response code: " + data.response_code);
        }
        
        if (!data.results || data.results.length === 0) {
          throw new Error("No questions received from API");
        }
        
        setQuestions(data.results);
        
      } catch (err) {
        console.error("Fetch error:", err);
        
        if (err.name === 'AbortError') {
          setError("Request timeout - please check your internet connection and try again.");
        } else if (err.message.includes('Failed to fetch')) {
          setError("Network error - please check your internet connection and try again.");
        } else {
          setError(err.message || "Failed to load questions. Please try again.");
        }
        
        // Set some fallback questions in case of error
        setQuestions(getFallbackQuestions());
      } finally {
        setLoading(false);
      }
    };

    // Fallback questions in case API fails
    const getFallbackQuestions = () => [
      {
        question: "What is the capital of Kenya?",
        correct_answer: "Nairobi",
        incorrect_answers: ["Mombasa", "Kisumu", "Kisii"],
        category: "Geography",
        difficulty: "easy",
        type: "multiple"
      },
      {
        question: "Which planet is the largest?",
        correct_answer: "Jupiter",
        incorrect_answers: ["Venus", "Mars", "Saturn"],
        category: "Science",
        difficulty: "easy",
        type: "multiple"
      },
      {
        question: "What is 2 + 2?",
        correct_answer: "4",
        incorrect_answers: ["3", "5", "6"],
        category: "Math",
        difficulty: "easy",
        type: "multiple"
      }
    ];

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setError(null);
    setLoading(true);
    
    // Re-fetch questions
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=3&type=multiple&timestamp=" + Date.now());
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data.results);
      } catch (err) {
        setError("Using fallback questions - " + err.message);
        // Use fallback questions
        setQuestions([
          {
            question: "What is the capital of Japan?",
            correct_answer: "Tokyo",
            incorrect_answers: ["Seoul", "Beijing", "Bangkok"],
            category: "Geography",
            difficulty: "easy"
          },
          {
            question: "How many continents are there?",
            correct_answer: "7",
            incorrect_answers: ["5", "6", "8"],
            category: "Geography",
            difficulty: "easy"
          },
          {
            question: "What is the largest mammal?",
            correct_answer: "Blue Whale",
            incorrect_answers: ["Elephant", "Giraffe", "Polar Bear"],
            category: "Science",
            difficulty: "easy"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  };

  // Show loading only if we have no questions and no error
  if (loading && questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="loading">
          <h2>Loading trivia questions...</h2>
          <p>This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Show error only if we have no questions at all
  if (error && questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={resetQuiz}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  // Safely get options
  const options = currentQuestion ? 
    [...(currentQuestion.incorrect_answers || []), currentQuestion.correct_answer]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3) 
    : [];

  if (quizCompleted) {
    return (
      <div className="quiz-container">
      
        <div className="results">
          <h2>Your Final Score is:</h2>
          <p className="score">{score} out of {questions.length}</p>
          <p className="percentage">
            {Math.round((score / questions.length) * 100)}%
          </p>
          <button className="restart-btn" onClick={resetQuiz}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Additional safety check
  if (!currentQuestion) {
    return (
      <div className="quiz-container">
        <div className="error">
          <h2>No question available</h2>
          <button className="retry-btn" onClick={resetQuiz}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>LearnMore</h1>
        {error && (
          <div className="warning">
             Using fallback questions: {error}
          </div>
        )}
        <div className="progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="score-tracker">
          Current Score: {score}
        </div>
      </div>

      <div className="question-block">
        <h2 className="question-text" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
        
        <div className="category">
          Category: {currentQuestion.category}
        </div>
        
        <div className="difficulty">
          Difficulty: {currentQuestion.difficulty}
        </div>

        <div className="options">
          {options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedAnswer === option ? 'selected' : ''
              } ${
                showResult && option === currentQuestion.correct_answer ? 'correct' : ''
              } ${
                showResult && selectedAnswer === option && selectedAnswer !== currentQuestion.correct_answer ? 'incorrect' : ''
              }`}
              onClick={() => !showResult && handleAnswerSelect(option)}
              disabled={showResult}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>

        {showResult && (
          <div className="result-feedback">
            <p className={`feedback ${selectedAnswer === currentQuestion.correct_answer ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.correct_answer 
                ? " Correct! Well done!" 
                : " Incorrect!"}
            </p>
            {selectedAnswer !== currentQuestion.correct_answer && (
              <p className="correct-answer">
                The correct answer is: <span dangerouslySetInnerHTML={{ __html: currentQuestion.correct_answer }} />
              </p>
            )}
            <button className="next-btn" onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TriviaQuiz;