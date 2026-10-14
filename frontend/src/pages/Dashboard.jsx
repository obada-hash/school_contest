import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("token");

      // Security check: if no token, kick them to login
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch games using the JWT token
        const response = await axios.get("http://localhost:8080/api/v1/game", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGames(response.data);
      } catch (err) {
        setError("Failed to load games. Your session may have expired.");
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchGames();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Contests</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {games.length === 0 && !error ? (
          <div className="col-12 text-center mt-5">
            <p className="lead text-muted">
              No games found. Let's build your first contest!
            </p>
          </div>
        ) : (
          games.map((game) => (
            <div className="col-md-4 mb-4" key={game.id}>
              <div className="card h-100 shadow-sm border-0 bg-light">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-primary">
                    {game.name}
                  </h5>
                  <p className="card-text text-muted small">
                    Created by: {game.appUser?.name || "Unknown"}
                  </p>

                  <div className="mt-auto d-flex gap-2 pt-3">
                    {/* Placeholder buttons for the next phases */}
                    <Link
                      to={`/game/${game.id}`}
                      className="btn btn-success flex-grow-1 fw-bold"
                    >
                      Play
                    </Link>
                    <Link
                      to={`/edit-game/${game.id}`}
                      className="btn btn-warning flex-grow-1 fw-bold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 text-center">
        <Link to="/create-game" className="btn btn-dark btn-lg px-5 shadow">
          {" "}
          + Create New Game{" "}
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
