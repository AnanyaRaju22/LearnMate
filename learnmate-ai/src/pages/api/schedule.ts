import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { goal, sleepTime, busyHours } = req.body;

  const fullPrompt = `
You are a helpful AI assistant that creates personalized daily learning schedules.

User's Learning Goal: ${goal}

Sleep Time: ${sleepTime}
Busy Hours: ${busyHours}

Create a day-by-day plan with time blocks outside the user's sleep and busy hours. Prioritize core topics first. Use clear time slots like "8AM–9AM: Topic Name".

Make the schedule achievable and structured to complete within the user's timeframe. Return in plain text format.
`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a professional AI study planner." },
          { role: "user", content: fullPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    const data = await groqRes.json();
    const plan = data.choices?.[0]?.message?.content || "AI couldn't generate a plan.";
    res.status(200).json({ plan });
  } catch (err) {
    console.error("Schedule API error:", err);
    res.status(500).json({ plan: "An error occurred while generating the schedule." });
  }
}
