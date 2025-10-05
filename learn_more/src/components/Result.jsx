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
        className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default Result;
