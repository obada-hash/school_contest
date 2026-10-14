import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PlayGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");

  // Game Stages: 'setup', 'playing', 'finished'
  const [stage, setStage] = useState("setup");
  const [team1, setTeam1] = useState("Team A");
  const [team2, setTeam2] = useState("Team B");
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [timerConfig, setTimerConfig] = useState(40);

  // Live Game State
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // Animation Trigger State
  const [addingTime, setAddingTime] = useState(false);

  // Audio References
  const thinkingAudio = useRef(new Audio("/sounds/thinking.mp3"));
  const finishingAudio = useRef(new Audio("/sounds/finishing.mp3"));

  useEffect(() => {
    thinkingAudio.current.loop = true;
    const fetchGame = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/game/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const fetchedGame = response.data;
        // Sort questions in each category increasingly by score
        fetchedGame.categories.forEach((cat) => {
          cat.questions.sort((a, b) => (a.score || 0) - (b.score || 0));
        });

        setGame(fetchedGame);
      } catch (err) {
        setError("Failed to load the game.");
      }
    };
    fetchGame();
  }, [id, navigate]);

  // Countdown Timer Logic
  useEffect(() => {
    let timer;
    if (activeQuestion && !showAnswer && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && activeQuestion && !showAnswer) {
      thinkingAudio.current.pause(); // Stop thinking sound when time is up
    }
    return () => clearInterval(timer);
  }, [activeQuestion, showAnswer, timeLeft]);

  const startGame = (e) => {
    e.preventDefault();
    setStage("playing");
  };

  const handleQuestionClick = (q) => {
    if (answeredQuestions.includes(q.id)) return;
    setActiveQuestion(q);
    setShowAnswer(false);
    setTimeLeft(timerConfig);
    thinkingAudio.current.currentTime = 0;
    thinkingAudio.current.play().catch(() => {});
  };

  const handleReveal = () => {
    setShowAnswer(true);
    thinkingAudio.current.pause();
  };

  // Adds lifeline pulse trigger for 30 second click
  const handleAdd30Sec = () => {
    setAddingTime(true);
    setTimeLeft((prev) => prev + 30);
    setTimeout(() => {
      setAddingTime(false);
    }, 1000);
  };

  // Determines who gets the points and locks the question
  const awardPointsAndClose = (winningTeam) => {
    const points = activeQuestion.score || 0;

    if (winningTeam === 1) {
      setTeam1Score((prev) => prev + points);
    } else if (winningTeam === 2) {
      setTeam2Score((prev) => prev + points);
    }

    const newAnswered = [...answeredQuestions, activeQuestion.id];
    setAnsweredQuestions(newAnswered);
    setActiveQuestion(null);
    setShowAnswer(false);
    thinkingAudio.current.pause();

    const totalQuestions = game.categories.reduce(
      (sum, cat) => sum + cat.questions.length,
      0,
    );
    if (newAnswered.length === totalQuestions) {
      setStage("finished");
      finishingAudio.current.play().catch(() => {});
    }
  };

  const quitGame = () => {
    thinkingAudio.current.pause();
    finishingAudio.current.pause();
    navigate("/dashboard");
  };

  if (error)
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!game)
    return <div className="container mt-5 text-center">Loading game...</div>;

  // --- STAGE 1: SETUP SCREEN ---
  if (stage === "setup") {
    return (
      <div className="container mt-5" style={{ maxWidth: "600px" }}>
        <div className="card shadow-lg p-5 border-warning bg-dark text-white">
          <h2
            className="text-center mb-4 fw-bold text-warning"
            style={{ textShadow: "2px 2px #000" }}
          >
            🏆 Setup Your Game show
          </h2>
          <form onSubmit={startGame}>
            <div className="mb-3">
              <label className="form-label fw-bold text-light">
                Team 1 Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg bg-dark text-white border-warning border-2"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-light">
                Team 2 Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg bg-dark text-white border-warning border-2"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-light">
                Countdown Timer (Seconds)
              </label>
              <input
                type="number"
                className="form-control form-control-lg bg-dark text-white border-warning border-2"
                value={timerConfig}
                onChange={(e) => setTimerConfig(Number(e.target.value))}
                min="5"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-warning btn-lg w-100 py-3 text-uppercase fw-extrabold shadow"
              style={{
                background: "linear-gradient(180deg, #ffd700 0%, #cc8500 100%)",
                border: "2px solid #fff",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
              }}
            >
              🚀 Start Breath Contest
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- STAGE 3: FINISHED SCREEN ---
  if (stage === "finished") {
    return (
      <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white">
        <h1
          className="display-1 text-warning fw-bold mb-4 animate-bounce"
          style={{ textShadow: "0px 0px 20px #ffd700" }}
        >
          🎉 THE GAME IS ENDED!
        </h1>
        <h2 className="display-4 mb-3">
          {team1}: <span className="text-info fw-black">{team1Score}</span>{" "}
          Points
        </h2>
        <h2 className="display-4 mb-5">
          {team2}: <span className="text-danger fw-black">{team2Score}</span>{" "}
          Points
        </h2>

        <h1
          className="display-3 fw-bold text-success mb-5"
          style={{ textShadow: "4px 4px 0px #1c0640" }}
        >
          {team1Score > team2Score
            ? `👑 ${team1} Wins!`
            : team2Score > team1Score
              ? `👑 ${team2} Wins!`
              : "🤜 It's a Tie! 🤛"}
        </h1>

        <button
          className="btn btn-light btn-lg px-5 shadow-lg"
          onClick={quitGame}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // --- STAGE 2: LIVE PLAYING BOARD ---
  return (
    <div className="container-fluid millionaire-bg">
      {/* Visual Millionaire Orbit Star ornaments */}
      <div className="mstar mstar-1">★</div>
      <div className="mstar mstar-2">★</div>
      <div className="mstar mstar-3">★</div>
      <div className="mstar mstar-4">★</div>

      <div className="board-container">
        {/* Ornate Gold Banner with Scores */}
        <div className="d-flex justify-content-between align-items-center millionaire-header text-white">
          <h1
            className="mb-0 text-info fw-bold d-flex align-items-center gap-3"
            style={{
              fontSize: "clamp(1.8rem, 3.8vh, 3.2rem)",
              textShadow: "3px 3px 0px #030c24",
            }}
          >
            🔵 {team1}:{" "}
            <span
              className="text-white px-3 py-1 rounded"
              style={{
                background: "linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%)",
                boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                border: "1px solid #3b82f6",
              }}
            >
              {team1Score}
            </span>
          </h1>
          <h1
            className="mb-0 text-center fw-extrabold text-uppercase text-warning px-4 py-2"
            style={{
              fontSize: "clamp(1.6rem, 3.2vh, 2.6rem)",
              letterSpacing: "2px",
              textShadow: "0 2px 4px #000, 0 0 15px #ffd700",
            }}
          >
            Breath Contest
          </h1>
          <h1
            className="mb-0 text-danger fw-bold d-flex align-items-center gap-3"
            style={{
              fontSize: "clamp(1.8rem, 3.8vh, 3.2rem)",
              textShadow: "3px 3px 0px #030c24",
            }}
          >
            🔴 {team2}:{" "}
            <span
              className="text-white px-3 py-1 rounded"
              style={{
                background: "linear-gradient(180deg, #b91c1c 0%, #991b1b 100%)",
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
                border: "1px solid #ef4444",
              }}
            >
              {team2Score}
            </span>
          </h1>
        </div>

        {/* Dynamic Point Grid */}
        <div className="board-columns">
          {game.categories.map((cat) => (
            <div key={cat.id} className="category-col">
              {/* Point Card Stage Header */}
              <div className="category-card text-center py-2">
                <h3
                  className="mb-0 fw-bold"
                  style={{ fontSize: "clamp(1.1rem, 2.8vh, 2rem)" }}
                >
                  {cat.name}
                </h3>
              </div>

              {/* Viewport Stretched Point Value Brackets */}
              {cat.questions.map((q) => {
                const isAnswered = answeredQuestions.includes(q.id);
                return (
                  <button
                    key={q.id}
                    className="btn question-btn"
                    onClick={() => handleQuestionClick(q)}
                    disabled={isAnswered}
                  >
                    {isAnswered ? "✕" : `${q.score} PTS`}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Movie overlay Modal */}
      {activeQuestion && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center millionaire-overlay"
          style={{ zIndex: 1050 }}
        >
          {addingTime && <div className="floating-plus-30">+30s</div>}

          <div className="text-center text-white p-5 w-100">
            {!showAnswer && (
              <div className="mb-5">
                <div
                  className={`fw-bold mb-3 ${addingTime ? "time-pulse-active" : ""} ${
                    timeLeft <= 5 ? "text-danger animate-pulse" : "text-warning"
                  }`}
                  style={{
                    fontSize: "8rem",
                    textShadow: "0 4px 15px rgba(255, 157, 0, 0.6)",
                  }}
                >
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                {/* Golden Lifesaver helper Option */}
                <button
                  className="btn rounded-pill px-5 fw-black fs-3 shadow"
                  onClick={handleAdd30Sec}
                  style={{
                    background:
                      "linear-gradient(180deg, #ffd700 0%, #cc8500 100%)",
                    border: "3px solid #fff",
                    boxShadow: "0 0 20px #ffd700",
                  }}
                >
                  ⏳ وسائل مساعدة: +30 ثانية
                </button>
              </div>
            )}

            {/* Cinematic Question Board Design */}
            <div
              className="card mx-auto p-4 border-warning"
              style={{
                background: "linear-gradient(180deg, #0d1e3d 0%, #030c24 100%)",
                maxWidth: "80%",
                border: "2px solid #ffd700",
                boxShadow: "0 0 30px rgba(0, 210, 255, 0.2)",
                borderRadius: "30px",
              }}
            >
              <h1
                className="fw-bold px-4 py-2"
                style={{
                  fontSize: "clamp(2rem, 5.5vh, 4rem)",
                  lineHeight: "1.3",
                  color: "#ffffff",
                  textShadow: "2px 2px 4px #000",
                }}
              >
                {activeQuestion.question}
              </h1>
            </div>

            {showAnswer ? (
              <>
                {/* Revealed correct response */}
                <h1
                  className="fw-extrabold mt-5 text-success animate-bounce"
                  style={{
                    fontSize: "clamp(3.2rem, 7.5vh, 6rem)",
                    textShadow: "0px 0px 15px rgba(40, 167, 69, 0.6)",
                    color: "#22c55e",
                  }}
                >
                  {activeQuestion.answer}
                </h1>

                {/* Cyber scoring confirmation */}
                <div className="mt-5 pt-4 d-flex justify-content-center gap-4">
                  <button
                    className="btn btn-info btn-lg px-5 py-4 fw-black fs-2 border-3 text-black shadow"
                    style={{
                      borderRadius: "20px",
                      background:
                        "linear-gradient(180deg, #ffd700 0%, #d4af37 100%)",
                      color: "#000",
                      border: "2px solid #fff",
                    }}
                    onClick={() => awardPointsAndClose(1)}
                  >
                    🏆 {team1} (+{activeQuestion.score})
                  </button>
                  <button
                    className="btn btn-secondary btn-lg px-5 py-4 fw-extrabold fs-3 shadow"
                    style={{
                      borderRadius: "20px",
                      background:
                        "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
                    }}
                    onClick={() => awardPointsAndClose(0)}
                  >
                    No One
                  </button>
                  <button
                    className="btn btn-danger btn-lg px-5 py-4 fw-black fs-2 border-3 text-white shadow"
                    style={{
                      borderRadius: "20px",
                      background:
                        "linear-gradient(180deg, #ffd700 0%, #d4af37 100%)",
                      color: "#000",
                      border: "2px solid #fff",
                    }}
                    onClick={() => awardPointsAndClose(2)}
                  >
                    🏆 {team2} (+{activeQuestion.score})
                  </button>
                </div>
              </>
            ) : (
              <button
                className="btn btn-warning btn-lg py-4 px-5 fw-black mt-5 shadow-lg"
                style={{
                  fontSize: "2.5rem",
                  borderRadius: "40px",
                  background:
                    "linear-gradient(180deg, #ffd700 0%, #cc8500 100%)",
                  border: "4px solid #fff",
                  boxShadow: "0px 0px 20px #ffd700",
                }}
                onClick={handleReveal}
              >
                👁 REVEAL ANSWER
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayGame;
