function Question({ data, onAnswer, current, total }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Question {current + 1} of {total}
      </h2>
      <p className="text-lg mb-6">{data.question}</p>
      <div className="space-y-3">
        {data.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
