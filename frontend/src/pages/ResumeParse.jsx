import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function ResumeParse() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [parseStage, setParseStage] = useState(""); // "extracting", "analyzing", "done"
  const [streamingResult, setStreamingResult] = useState("");
  const resultRef = useRef(null);

  // Auto-scroll to results
  useEffect(() => {
    if (resultRef.current && (result || streamingResult)) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result, streamingResult]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setResult(null);
    setStreamingResult("");
    setParseStage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF or DOCX file.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setStreamingResult("");
    
    // Step 1: Upload file and extract text
    setParseStage("extracting");
    const formData = new FormData();
    formData.append("resume", file);
    
    try {
      // First upload and extract text from the file
      const res = await fetch(`${API_BASE_URL}/api/parse-resume`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to parse resume.");
      
      // The backend now returns a structured `feedback` JSON per schema when extraction succeeded.
      if (data.feedback) {
        const fb = data.feedback;
        setResult({
          name: fb.name || null,
          email: fb.email || null,
          phone: fb.phone || null,
          score: fb.score ?? null,
          career_level: fb.career_level || null,
          overall: fb.overall_feedback || '',
          strengths: fb.strengths || [],
          weaknesses: fb.weaknesses || [],
          suggestions: fb.suggestions || [],
          skills: fb.skills || [],
          education: fb.education || [],
          experience: fb.experience || [],
          projects: fb.projects || [],
          ats_keywords: fb.ats_keywords || [],
          recommended_roles: fb.recommended_roles || [],
          fallback: data.fallback || false,
          raw: null
        });
        setParseStage('done');
      } else if (data.text) {
        setResult({ raw: data.text });
        setParseStage('done');
      } else {
        throw new Error('Unexpected backend response');
      }
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError(err.message);
      setParseStage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 pt-8">
      <h1 className="text-3xl font-bold mb-6">Resume Parser</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-lg">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading ? `${parseStage === "extracting" ? "Extracting Text..." : parseStage === "analyzing" ? "Analyzing..." : "Processing..."}` : "Upload & Parse"}
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
      
      {/* Show streaming result while analyzing */}
      {streamingResult && (
        <div ref={resultRef} className="mt-8 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resume Analysis</h2>
          <div className="whitespace-pre-wrap">
            {streamingResult}
            <span className="ml-1 animate-pulse">▌</span>
          </div>
        </div>
      )}
      
      {/* Show final structured result */}
      {result && !streamingResult && (
        <div ref={resultRef} className="mt-8 w-full max-w-3xl bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-6">
          {result.raw ? (
            <pre className="whitespace-pre-wrap text-sm">{result.raw}</pre>
          ) : (
            <>
              {result.fallback && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 rounded-lg p-3 text-yellow-800 dark:text-yellow-300 text-sm">
                  ⚠️ AI analysis unavailable — showing local heuristic results.
                </div>
              )}

              {/* Header: Name + Score */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  {result.name && <h2 className="text-2xl font-bold">{result.name}</h2>}
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex gap-4 flex-wrap">
                    {result.email && <span>📧 {result.email}</span>}
                    {result.phone && <span>📞 {result.phone}</span>}
                    {result.career_level && (
                      <span className="capitalize bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {result.career_level} level
                      </span>
                    )}
                  </div>
                </div>
                {result.score !== null && (
                  <div className="flex flex-col items-center">
                    <div className={`text-4xl font-extrabold ${result.score >= 75 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {result.score}<span className="text-lg font-normal text-gray-400">/100</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Resume Score</span>
                  </div>
                )}
              </div>

              {/* Overall Assessment */}
              {result.overall && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-1 text-indigo-700 dark:text-indigo-300">Overall Assessment</h3>
                  <p className="text-gray-700 dark:text-gray-300">{result.overall}</p>
                </div>
              )}

              {/* Strengths + Weaknesses side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 text-green-700 dark:text-green-400">✅ Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {result.strengths.length ? result.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>None identified.</li>}
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">⚠️ Weaknesses</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {result.weaknesses.length ? result.weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>None identified.</li>}
                  </ul>
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-400">💡 Suggestions</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              )}

              {/* Recommended Roles */}
              {result.recommended_roles.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-2">🎯 Recommended Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.recommended_roles.map((r, i) => (
                      <span key={i} className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {result.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-2">🛠️ Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((s, i) => (
                      <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ATS Keywords */}
              {result.ats_keywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-2">🔍 ATS Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.ats_keywords.map((k, i) => (
                      <span key={i} className="bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-3 py-1 rounded-full text-xs font-medium">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {result.experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3">💼 Experience</h3>
                  <div className="space-y-3">
                    {result.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 border-indigo-300 pl-4">
                        <div className="font-semibold">{exp.title} <span className="text-gray-500 dark:text-gray-400 font-normal">@ {exp.company}</span></div>
                        {(exp.start || exp.end) && <div className="text-xs text-gray-400">{exp.start} – {exp.end || 'Present'}</div>}
                        {exp.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {result.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3">🎓 Education</h3>
                  <div className="space-y-2">
                    {result.education.map((edu, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-semibold">{edu.degree}</span>
                        <span className="text-gray-500 dark:text-gray-400">— {edu.institution}{edu.year ? `, ${edu.year}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {result.projects.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3">🚀 Projects</h3>
                  <div className="space-y-3">
                    {result.projects.map((p, i) => (
                      <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="font-semibold">{p.name}</div>
                        {p.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{p.description}</p>}
                        {p.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.technologies.map((t, j) => (
                              <span key={j} className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-0.5 rounded">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
