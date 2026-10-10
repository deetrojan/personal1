"use client";

import { useCallback, useEffect, useState } from "react";

const LOVE_MESSAGE =
  "You make my world beautiful. I would choose you in every lifetime. I Love You ❤️";

export default function HomePage() {
  const [date, setDate] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 9) % 100}%`,
        delay: `${(i % 7) * -1.7}s`,
        duration: `${9 + (i % 6)}s`,
        size: `${12 + (i % 4) * 6}px`
      }))
    );
  }, []);

  const loadQuestion = useCallback(async (seenOverride) => {
    setLoading(true);
    setStatus("");
    setSelected("");
    setRevealed(false);
    try {
      let seen = [];
      try {
        seen = JSON.parse(localStorage.getItem("love-quiz-seen") || "[]");
      } catch {
        seen = [];
      }
      if (Array.isArray(seenOverride)) seen = seenOverride;
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seen })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Question load नहीं हो पाया।");
      if (data.resetSeen) {
        localStorage.setItem("love-quiz-seen", "[]");
      }
      setQuestion(data.question);
    } catch (error) {
      setStatus(error.message || "कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }, []);

  async function unlock(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "यह तारीख सही नहीं है।");
      setUnlocked(true);
      await loadQuestion([]);
    } catch (error) {
      setStatus(error.message || "कृपया फिर कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(event) {
    event.preventDefault();
    if (!question || !selected || loading) return;
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, answer: selected })
      });
      const data = await response.json();
      if (response.status === 401) {
        setUnlocked(false);
        setQuestion(null);
        throw new Error("आपका session expire हो गया। Special date फिर से डालें।");
      }
      if (!response.ok) throw new Error(data.error || "उत्तर जाँचा नहीं जा सका।");
      if (data.correct) {
        setRevealed(true);
      } else {
        setStatus("बहुत करीब, मेरी जान! 💗 एक बार फिर कोशिश करो।");
      }
    } catch (error) {
      setStatus(error.message || "कृपया फिर कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  function nextQuestion() {
    loadQuestion([]);
  }

  return (
    <main className="page-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            style={{
              left: heart.left,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              fontSize: heart.size
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <header className="topbar">
        <div className="brand-mark">♥</div>
        <span>OUR LITTLE LOVE STORY</span>
      </header>

      <section className="love-card">
        {!unlocked ? (
          <>
            <div className="eyebrow"><span /> A LITTLE SECRET JUST FOR YOU <span /></div>
            <div className="hero-heart" aria-hidden="true">♡</div>
            <p className="script-line">For my favourite person</p>
            <h1>Hello, <span>Sangeeta</span>!</h1>
            <p className="intro">
              Every love story has its little secrets. Enter our special date to unlock yours. 💌
            </p>
            <form onSubmit={unlock} className="form-stack">
              <label htmlFor="special-date">Our special date</label>
              <input
                id="special-date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                inputMode="numeric"
                autoComplete="off"
                placeholder="DDMMYYYY"
                maxLength={8}
                pattern="[0-9]{8}"
                aria-describedby="date-hint"
                required
              />
              <small id="date-hint">A little date only we know · DDMMYYYY</small>
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Opening our story…" : "Unlock my surprise  ♡"}
              </button>
            </form>
            {status && <p className="status-message" role="alert">{status}</p>}
            <p className="tiny-note">Made with all my love, just for you.</p>
          </>
        ) : revealed ? (
          <div className="reveal-panel">
            <div className="success-sparkle">✦ ♥ ✦</div>
            <p className="script-line">You got it, my love!</p>
            <h1 className="reveal-title">I Love You,<br /><span>Sangeeta!</span> ❤️</h1>
            <div className="love-divider"><span>♥</span></div>
            <p className="personal-message">{LOVE_MESSAGE}</p>
            <p className="forever-line">You are my today, tomorrow & forever.</p>
            <div className="big-heart" aria-hidden="true">♥</div>
            <button className="primary-button" onClick={nextQuestion} disabled={loading}>
              {loading ? "Finding a memory…" : "Try our question again  →"}
            </button>
          </div>
        ) : (
          <>
            <div className="eyebrow"><span /> OUR LITTLE LOVE QUESTION <span /></div>
            <div className="question-number">OUR SPECIAL QUESTION 💕</div>
            <h1 className="question-title">Remember this?</h1>
            <p className="question-copy">{question?.question || (loading ? "हमारी अगली याद ढूँढ रहे हैं…" : "एक पल…")}</p>
            <form onSubmit={submitAnswer} className="form-stack answer-stack">
              <div className="options-list">
                {(question?.options || []).map((option) => (
                  <label key={option} className={`option-card ${selected === option ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selected === option}
                      onChange={() => setSelected(option)}
                      disabled={loading || !question}
                    />
                    <span className="option-heart">{selected === option ? "♥" : "♡"}</span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <button className="primary-button" type="submit" disabled={loading || !selected || !question}>
                {loading ? "Checking your answer…" : "That’s my answer  ♡"}
              </button>
            </form>
            {status && <p className="status-message" role="alert">{status}</p>}
            <p className="tiny-note">No matter the answer, you already have my heart. 💗</p>
          </>
        )}
      </section>

      <footer className="footer">
        <span>ALWAYS & FOREVER</span>
        <span className="footer-heart">♥</span>
        <span>JUST YOU & ME</span>
      </footer>
    </main>
  );
}
