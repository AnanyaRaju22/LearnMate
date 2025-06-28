import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [learningStyle, setLearningStyle] = useState("text");
  const [difficulty, setDifficulty] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[][]>([]);

  const askAI = async () => {
    if (!userInput.trim()) return;

    const updatedMessages: Message[] = [...messages, { role: "user", content: userInput }];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedMessages,
          learningStyle,
          difficulty,
        }),
      });

      const data = await res.json();
      const aiResponse = data.response || "No answer from AI.";

      setMessages([...updatedMessages, { role: "assistant", content: aiResponse }]);
    } catch (err) {
      console.error("Error asking AI:", err);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    if (messages.length > 0) {
      setChatHistory([messages, ...chatHistory]);
    }
    setMessages([]);
    setUserInput("");
  };

  return (
    <div className="min-h-screen bg-[#0b011a] text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-purple-300">💡 LearnMate AI</h1>

      {/* Controls */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <div className="flex gap-2 bg-[#1a0b2e] p-2 rounded-xl">
          {["text", "story", "quiz"].map((style) => (
            <button
              key={style}
              onClick={() => setLearningStyle(style)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                learningStyle === style
                  ? "bg-purple-600 text-white"
                  : "bg-transparent hover:bg-purple-700 text-purple-300"
              }`}
            >
              {style.toUpperCase()}
            </button>
          ))}
        </div>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-[#1a0b2e] text-white px-4 py-2 rounded-lg border border-purple-700"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          onClick={newChat}
          className="bg-purple-200 text-purple-900 hover:bg-purple-300 px-4 py-2 rounded-lg font-semibold"
        >
          🔁 New Chat
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex w-full max-w-6xl gap-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-[#1a0b2e] p-4 rounded-xl overflow-y-auto max-h-[70vh]">
          <h2 className="text-lg font-bold mb-4 text-purple-400">📚 Chat History</h2>
          {chatHistory.map((session, idx) => (
            <div
              key={idx}
              className="mb-4 p-3 bg-[#24113b] rounded-lg border border-purple-700 text-sm cursor-pointer hover:bg-purple-800"
              onClick={() => setMessages(session)}
            >
              {session[0]?.content.slice(0, 40) || "(No content)"}...
            </div>
          ))}
        </div>

        {/* Chat Display + Input */}
        <div className="w-3/4 flex flex-col">
          <div className="space-y-4 overflow-y-auto max-h-[60vh] px-2 mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  msg.role === "user"
                    ? "bg-[#1a0b2e] border-purple-800"
                    : "bg-[#24113b] border-purple-700"
                }`}
              >
                <p className="font-bold text-purple-400 mb-1">
                  {msg.role === "user" ? "You:" : "AI:"}
                </p>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#1a0b2e] border border-purple-800 text-white placeholder-gray-400"
            />
            <button
              onClick={askAI}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
