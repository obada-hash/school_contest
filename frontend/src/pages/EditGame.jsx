import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`/api/v1/game/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setCategories(response.data.categories);
        setLoading(false);
      } catch (err) {
        setError("Failed to load game details.");
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

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
    updated[catIndex].questions.push({ question: "", answer: "", score: 10 });
    setCategories(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `/api/v1/game/${id}`,
        { name, categories },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update game.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h3>Loading Contest...</h3>
      </div>
    );

  return (
    <div className="container mb-5" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">✏️ Edit Contest</h2>
        <button
          className="btn btn-light"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </div>

      {error && <div className="alert alert-danger fw-bold">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4 bg-white">
          <div className="card-body p-4">
            <label className="form-label fw-bold fs-5">Game Name</label>
            <input
              type="text"
              className="form-control form-control-lg bg-light"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {categories.map((cat, catIndex) => (
          <div key={catIndex} className="card mb-4 bg-white">
            <div className="card-header bg-primary text-white p-3">
              <h4 className="mb-0 fw-bold">Category {catIndex + 1}</h4>
            </div>

            <div className="card-body p-4">
              <div className="mb-4">
                <label className="form-label fw-bold">Category Title</label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light"
                  value={cat.name}
                  onChange={(e) =>
                    handleCategoryNameChange(catIndex, e.target.value)
                  }
                  required
                />
              </div>

              {cat.questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="row mb-3 g-2 align-items-center bg-light p-2 rounded border"
                >
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
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
                      className="form-control"
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
                      className="form-control"
                      placeholder="Pts"
                      value={q.score}
                      onChange={(e) =>
                        handleQuestionChange(
                          catIndex,
                          qIndex,
                          "score",
                          Number(e.target.value),
                        )
                      }
                      min="1"
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-warning mt-2 w-100"
                onClick={() => addQuestion(catIndex)}
              >
                + Add Question to {cat.name}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="btn btn-success btn-lg w-100 py-3 mt-3"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditGame;
