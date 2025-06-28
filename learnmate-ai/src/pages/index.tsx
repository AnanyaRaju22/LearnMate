import Link from "next/link";

const features = [
  {
    title: "🧠 Let's Chat & Discuss",
    description: "Ask AI with different learning styles",
    link: "/chat",
  },
  {
    title: "📎To-Do List",
    description: "Maintain and keep track of tasks that you have to finish",
    link: "/planner",
  },
  {
    title: "📅 Study Planner",
    description: "Set study goals ",
    link: "/schedule",
  },
  {
    title: "🔊 Language Pronunciation Trainer",
    description: "Practice and perfect your speech (Coming Soon)",
    link: "#",
  },
  {
    title: "📄 Upload PPT & Ask Questions",
    description: "Get answers based on your presentation slides (Coming Soon)",
    link: "/pptchat",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 p-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-12 drop-shadow">
        🚀 LearnMate AI – Personalized Learning Hub
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Link href={feature.link} key={index}>
            <div className="h-48 flex flex-col justify-center items-center text-center px-4 py-6 bg-white shadow-xl rounded-3xl border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <h2 className="text-xl font-bold text-blue-800 mb-2">{feature.title}</h2>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
