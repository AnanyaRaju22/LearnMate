import { useState } from "react";

export default function SchedulePlanner() {
  const [goal, setGoal] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [busyHoursList, setBusyHoursList] = useState<string[]>([""]);
  const [plan, setPlan] = useState("");
  const [savedPlans, setSavedPlans] = useState<{ title: string; content: string }[]>([]);
  const [planTitle, setPlanTitle] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [waitingForFeedback, setWaitingForFeedback] = useState(false);
  const [showModificationBox, setShowModificationBox] = useState(false);
  const [modificationText, setModificationText] = useState("");

  const handleGeneratePlan = async () => {
    if (!goal.trim() || !sleepTime.trim()) return;

    setLoading(true);
    setPlan("");
    setWaitingForFeedback(true);
    setShowModificationBox(false);

    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, sleepTime, busyHours: busyHoursList.filter(Boolean).join(", ") }),
    });

    const data = await res.json();
    setPlan(data.plan || "Failed to generate schedule.");
    setLoading(false);
  };

  const handleSavePlan = () => {
    if (!planTitle.trim()) return;

    setSavedPlans([{ title: planTitle, content: plan }, ...savedPlans]);
    setPlan("");
    setPlanTitle("");
    setGoal("");
    setSleepTime("");
    setBusyHoursList([""]);
    setWaitingForFeedback(false);
  };

  const handleModifyPlan = () => {
    setShowModificationBox(true);
  };

  const handleSubmitModification = async () => {
    if (!modificationText.trim()) return;
    setLoading(true);
    setPlan("Regenerating with your changes...");

    const fullPrompt = `
Original Goal: ${goal}
Sleep Time: ${sleepTime}
Busy Hours: ${busyHoursList.join(", ")}
Feedback: ${modificationText}
Please regenerate the schedule accordingly.
`;

    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: fullPrompt, sleepTime: "", busyHours: [] }),
    });

    const data = await res.json();
    setPlan(data.plan || "Failed to regenerate.");
    setLoading(false);
    setShowModificationBox(false);
    setModificationText("");
  };

  const updateBusyHour = (index: number, value: string) => {
    const updated = [...busyHoursList];
    updated[index] = value;
    setBusyHoursList(updated);
  };

  const addBusyHour = () => {
    setBusyHoursList([...busyHoursList, ""]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-10">
      <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8 drop-shadow">
        🤖 AI Study Schedule Planner
      </h1>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg">
          <label className="block text-lg font-semibold mb-2 text-purple-700">
            What do you want to learn and by when?
          </label>
          <input
            type="text"
            placeholder="e.g. Learn Python in 7 days"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border border-purple-300 rounded-lg px-4 py-3 mb-4 text-black"
          />

          <label className="block text-lg font-semibold mb-2 text-purple-700">
            Sleep Time (e.g. 10PM–6AM)
          </label>
          <input
            type="text"
            placeholder="e.g. 10PM–6AM"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            className="w-full border border-purple-300 rounded-lg px-4 py-3 mb-4 text-black"
          />

          <label className="block text-lg font-semibold mb-2 text-purple-700">
            Busy Hours (e.g. 9AM–1PM college)
          </label>
          {busyHoursList.map((hour, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Busy Hour ${index + 1}`}
              value={hour}
              onChange={(e) => updateBusyHour(index, e.target.value)}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 mb-2 text-black"
            />
          ))}
          <button
            onClick={addBusyHour}
            className="text-purple-700 hover:text-purple-900 text-sm font-medium mb-4"
          >
            ➕ Add More
          </button>

          <button
            onClick={handleGeneratePlan}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg"
          >
            ✨ Generate Plan
          </button>

          {loading && <p className="mt-4 text-purple-600 font-semibold">Generating...</p>}

          {plan && (
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6 text-gray-800 leading-relaxed">
              <label className="block text-sm font-semibold text-purple-600 mb-2">Plan Title:</label>
              <input
                type="text"
                placeholder="e.g. Python Plan"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full border border-purple-300 rounded-md px-3 py-2 mb-4 text-black"
              />
              <pre className="whitespace-pre-wrap text-sm">{plan}</pre>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleSavePlan}
                  className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg"
                >
                  ✅ Yes, Save This Plan
                </button>
                <button
                  onClick={handleModifyPlan}
                  className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg"
                >
                  ❌ No, I Want Changes
                </button>
              </div>

              {showModificationBox && (
                <div className="mt-4">
                  <textarea
                    placeholder="Please specify the changes you want."
                    value={modificationText}
                    onChange={(e) => setModificationText(e.target.value)}
                    className="w-full border border-purple-300 rounded-lg p-3 text-black mb-2"
                    rows={4}
                  />
                  <button
                    onClick={handleSubmitModification}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-lg"
                  >
                    🔄 Submit Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-purple-700 mb-4">🗂️ Your Saved Plans
          </h2>
          <div className="space-y-2">
            {savedPlans.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPlan(item.content)}
                className="block text-left w-full text-purple-800 font-medium hover:underline px-3 py-2 rounded-lg bg-purple-100"
              >
                📌 {item.title}
              </button>
            ))}
          </div>

          {selectedPlan && (
            <div className="bg-white border border-purple-300 p-4 rounded-lg mt-4 shadow-md">
              <h3 className="text-lg font-bold text-purple-700 mb-2">📄 Plan Details:
              </h3>
              <div className="text-gray-800 whitespace-pre-line text-sm">{selectedPlan}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
