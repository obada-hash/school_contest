import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
      });
      const token = response.data.token || response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Email might be in use.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <form onSubmit={handleRegister} className="card p-5 bg-white">
        <h2 className="text-center mb-4 fw-bold text-primary">
          Join Breath Contest
        </h2>
        {error && <div className="alert alert-danger fw-bold">{error}</div>}

        <div className="mb-3">
          <label className="form-label fw-bold">Full Name</label>
          <input
            type="text"
            className="form-control form-control-lg bg-light"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Email address</label>
          <input
            type="email"
            className="form-control form-control-lg bg-light"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label fw-bold">Password</label>
          <input
            type="password"
            className="form-control form-control-lg bg-light"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100 py-3">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;
