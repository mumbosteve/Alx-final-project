function Result({ score, total }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Finished!</h2>
      <p className="text-lg">
        You scored <span className="font-bold">{score}</span> out of{" "}
        <span className="font-bold">{total}</span>
      </p>
      <button
        onClick={() => window.location.reload()}
        className="restart-btn"
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default Result;
