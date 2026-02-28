import React, { useState } from "react";
import { useLocation } from "wouter";

const options = [
  {
    label: "Virtual Agent",
    path: "/agent",
    description: "Have a real-time voice & video interview with an AI avatar powered by Anam.",
    icon: "🤖",
    badge: "Live Avatar",
    badgeColor: "from-violet-500 to-indigo-500",
    gradient: "from-violet-600/20 to-indigo-600/20",
    border: "border-violet-500/30 hover:border-violet-400",
    glow: "hover:shadow-violet-500/20",
  },
  {
    label: "AI Chatbot",
    path: "/chatbot",
    description: "Chat with an AI interview coach to practice Q&A, get feedback, and sharpen your answers.",
    icon: "💬",
    badge: "Text Chat",
    badgeColor: "from-indigo-500 to-blue-500",
    gradient: "from-indigo-600/20 to-blue-600/20",
    border: "border-indigo-500/30 hover:border-indigo-400",
    glow: "hover:shadow-indigo-500/20",
  },
  {
    label: "Resume Parser",
    path: "/resume-parse",
    description: "Upload your resume and get an AI-powered analysis with strengths, gaps, and ATS keywords.",
    icon: "📄",
    badge: "AI Analysis",
    badgeColor: "from-emerald-500 to-teal-500",
    gradient: "from-emerald-600/20 to-teal-600/20",
    border: "border-emerald-500/30 hover:border-emerald-400",
    glow: "hover:shadow-emerald-500/20",
  },
];

export default function SelectMode() {
  const [, navigate] = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-4">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Interview Prep Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent mb-3">
          Choose Your Mode
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Pick the experience that fits your prep style and get interview-ready.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl relative z-10">
        {options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => navigate(opt.path)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`
              group relative rounded-2xl p-6 flex flex-col items-start text-left
              bg-white/5 backdrop-blur-md border ${opt.border}
              transition-all duration-300 ease-out
              hover:scale-[1.03] hover:shadow-2xl ${opt.glow}
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            `}
          >
            {/* Gradient bg on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${opt.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            {/* Icon */}
            <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${opt.badgeColor} flex items-center justify-center text-2xl shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110`}>
              {opt.icon}
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{opt.label}</h2>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${opt.badgeColor} text-white`}>
                  {opt.badge}
                </span>
              </div>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {opt.description}
              </p>
            </div>

            {/* Arrow */}
            <div className={`relative z-10 mt-5 w-full flex justify-end`}>
              <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${opt.badgeColor} flex items-center justify-center shadow transition-transform duration-300 group-hover:translate-x-1`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <p className="mt-10 text-xs text-gray-500 relative z-10">
        All modes are powered by AI · No sign-up required
      </p>
    </div>
  );
}
