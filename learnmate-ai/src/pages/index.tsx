import { useState } from "react";

export default function Home() {
  const [learningStyle, setLearningStyle] = useState("text");
  const [difficulty, setDifficulty] = useState("beginner");
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleAsk = async () => {
    if (!userQuestion.trim()) return;
    setAiResponse("Loading...");

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userQuestion, learningStyle, difficulty }),
    });

    const data = await res.json();
    setAiResponse(data.response || "No answer.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-6">
          LearnMate AI
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Learning Style
            </label>
            <select
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="text">Text</option>
              <option value="visual">Visual</option>
              <option value="quiz">Quiz-Based</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="e.g., What is photosynthesis?"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-4"
        />

        <button
          onClick={handleAsk}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Ask AI
        </button>

        {aiResponse && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
            <h2 className="font-bold text-blue-700 mb-2">AI Response:</h2>
            <p className="text-gray-800 whitespace-pre-line">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
