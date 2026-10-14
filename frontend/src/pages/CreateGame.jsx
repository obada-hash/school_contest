import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  // Added score field to initial state
  const [categories, setCategories] = useState([
    { name: "", questions: [{ question: "", answer: "", score: 10 }] },
    { name: "", questions: [{ question: "", answer: "", score: 10 }] },
    { name: "", questions: [{ question: "", answer: "", score: 10 }] },
  ]);

  const handleCategoryNameChange = (catIndex, value) => {
    const updated = [...categories];
    updated[catIndex].name = value;
    setCategories(updated);
  };

  const handleQuestionChange = (catIndex, qIndex, field, value) => {
    const updated = [...categories];
    updated[catIndex].questions[qIndex][field] = value;
    setCategories(updated);
  };

  const addQuestion = (catIndex) => {
    const updated = [...categories];
    // Default new questions to 10 points
    updated[catIndex].questions.push({ question: "", answer: "", score: 10 });
    setCategories(updated);
  };

  const addCategory = () => {
    if (categories.length < 4) {
      setCategories([
        ...categories,
        { name: "", questions: [{ question: "", answer: "", score: 10 }] },
      ]);
    }
  };

  const removeCategory = (catIndex) => {
    if (categories.length > 3) {
      const updated = categories.filter((_, i) => i !== catIndex);
      setCategories(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "/api/v1/game",
        { name, categories },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create game. Check your inputs.",
      );
    }
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Create New Contest</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <label className="form-label fw-bold">Game Name</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {categories.map((cat, catIndex) => (
          <div key={catIndex} className="card shadow-sm mb-4 border-primary">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Category {catIndex + 1}</h5>
              {categories.length > 3 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeCategory(catIndex)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Category Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={cat.name}
                  onChange={(e) =>
                    handleCategoryNameChange(catIndex, e.target.value)
                  }
                  required
                />
              </div>

              <h6 className="mt-4 mb-3 text-muted border-bottom pb-2">
                Questions
              </h6>

              {cat.questions.map((q, qIndex) => (
                <div key={qIndex} className="row mb-2 g-2 align-items-center">
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Question"
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          catIndex,
                          qIndex,
                          "question",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Answer"
                      value={q.answer}
                      onChange={(e) =>
                        handleQuestionChange(
                          catIndex,
                          qIndex,
                          "answer",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Score"
                      value={q.score}
                      onChange={(e) =>
                        handleQuestionChange(
                          catIndex,
                          qIndex,
                          "score",
                          Number(e.target.value),
                        )
                      }
                      required
                      min="1"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => addQuestion(catIndex)}
              >
                + Add Question
              </button>
            </div>
          </div>
        ))}

        {categories.length < 4 && (
          <button
            type="button"
            className="btn btn-outline-dark w-100 mb-4 py-2 fw-bold"
            onClick={addCategory}
          >
            + Add 4th Category
          </button>
        )}

        <button
          type="submit"
          className="btn btn-success btn-lg w-100 fw-bold shadow"
        >
          Save Game
        </button>
      </form>
    </div>
  );
}

export default CreateGame;
