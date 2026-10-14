import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        {
          email: email,
          password: password,
        },
      );

      // Assuming your backend returns the token directly in response.data or inside a token field
      const token = response.data.token || response.data;

      // Save the 48-hour token securely in the browser's local storage
      localStorage.setItem("token", token);

      // Redirect the user to the Dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login to Ezz Contest</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
