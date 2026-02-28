import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../config";

const SUGGESTED_PROMPTS = [
  "Start a mock interview for a Software Engineer role",
  "What are common React interview questions?",
  "How do I answer 'Tell me about yourself'?",
  "Give me a system design question",
  "How should I negotiate my salary?",
];

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
    AI
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
    You
  </div>
);

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful AI interview coach. Ask me interview questions and give feedback." },
    { role: "assistant", content: "Hi! I'm your AI Interview Coach 🎯\n\nI can help you practice interviews, answer HR questions, give feedback on your answers, or run a full mock interview. What would you like to do?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const sendMessage = async (e, overrideText) => {
    if (e) e.preventDefault();
    const text = overrideText ?? input;
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingMessage("");
    inputRef.current?.focus();

    try {
      const response = await fetch(`${API_BASE_URL}/api/openai-proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          temperature: 0.7,
          max_tokens: 1000,
          stream: true
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                accumulatedResponse += content;
                setStreamingMessage(accumulatedResponse);
              }
            } catch {}
          }
        }
      }

      setMessages([...newMessages, {
        role: "assistant",
        content: accumulatedResponse || "(No response)"
      }]);
    } catch (err) {
      console.error('Streaming error:', err);
      setMessages([...newMessages, { role: "assistant", content: "Sorry, there was an error connecting to the AI. Please try again." }]);
    } finally {
      setLoading(false);
      setStreamingMessage("");
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "system", content: "You are a helpful AI interview coach. Ask me interview questions and give feedback." },
      { role: "assistant", content: "Chat cleared! Ready to help you prep. What would you like to practice?" }
    ]);
    setInput("");
    setStreamingMessage("");
  };

  const visibleMessages = messages.filter(m => m.role !== "system");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AI Interview Coach</h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-400 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-full transition-all"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Area */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
        {visibleMessages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.role === "user" ? <UserAvatar /> : <BotAvatar />}
            <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                  : "bg-white/10 backdrop-blur-sm border border-white/10 text-gray-100 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming bubble */}
        {streamingMessage && (
          <div className="flex items-end gap-2">
            <BotAvatar />
            <div className="max-w-[78%]">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap bg-white/10 backdrop-blur-sm border border-white/10 text-gray-100 shadow">
                {streamingMessage}
                <span className="ml-1 inline-block w-0.5 h-4 bg-indigo-400 animate-pulse align-middle" />
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {loading && !streamingMessage && (
          <div className="flex items-end gap-2">
            <BotAvatar />
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm shadow">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts — show only at start */}
      {visibleMessages.length <= 1 && !loading && (
        <div className="max-w-3xl w-full mx-auto px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2 ml-1">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(null, p)}
                className="text-xs bg-white/10 hover:bg-indigo-500/30 border border-white/15 hover:border-indigo-400 text-gray-200 px-3 py-1.5 rounded-full transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="sticky bottom-0 bg-black/30 backdrop-blur-md border-t border-white/10 px-4 py-4">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            className="flex-1 bg-white/10 border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question or say 'start interview'…"
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 flex items-center justify-center shadow-lg transition-all shrink-0"
            aria-label="Send"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
