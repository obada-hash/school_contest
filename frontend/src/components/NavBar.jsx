import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="site-nav">
      <Link className="nav-brand" to="/">
        <span className="nav-logo" aria-hidden="true">
          🏆
        </span>
        Breath Contest
      </Link>
      <div className="nav-actions">
        {token ? (
          <>
            <Link to="/dashboard" className="btn btn-warning text-white">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
            <Link to="/register" className="btn btn-warning">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
