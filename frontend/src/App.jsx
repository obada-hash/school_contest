import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateGame from "./pages/CreateGame";
import EditGame from "./pages/EditGame";
import PlayGame from "./pages/PlayGame";

function App() {
  const location = useLocation();
  const baseAudio = useRef(new Audio("/sounds/base.mp3"));

  // Hide Navbar when playing the game
  const isPlaying = location.pathname.startsWith("/game");

  useEffect(() => {
    baseAudio.current.loop = true;
    baseAudio.current.volume = 0.3;

    const playAudio = () => {
      if (!isPlaying) baseAudio.current.play().catch(() => {});
    };
    window.addEventListener("click", playAudio, { once: true });

    if (isPlaying) {
      baseAudio.current.pause();
    } else {
      baseAudio.current.play().catch(() => {});
    }

    return () => window.removeEventListener("click", playAudio);
  }, [isPlaying]);

  return (
    <>
      {!isPlaying && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/edit-game/:id" element={<EditGame />} />
        <Route path="/game/:id" element={<PlayGame />} />
      </Routes>
    </>
  );
}

export default App;
