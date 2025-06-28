import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { history, learningStyle, difficulty } = req.body;

  let styleInstruction = "";
  if (learningStyle === "text") {
    styleInstruction = `Explain in clear text suitable for a ${difficulty} learner.`;
  } else if (learningStyle === "story") {
    styleInstruction = `Explain the concept by writing a short, simple story or narrative that makes the topic easy to understand for a ${difficulty} learner.`;
  } else if (learningStyle === "quiz") {
    styleInstruction = `Create a short 10-question quiz with answers, aimed at a ${difficulty} learner.`;
  }

  const systemMessage = {
    role: "system",
    content: `You are a helpful educational AI assistant. Respond based on the user's learning style and level. Style: ${learningStyle}, Level: ${difficulty}. ${styleInstruction}`,
  };

  const messages = [systemMessage, ...(history || [])];

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await groqRes.json();
    const answer = data.choices?.[0]?.message?.content || "No response from AI.";
    res.status(200).json({ response: answer });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ response: "AI failed to respond." });
  }
}
