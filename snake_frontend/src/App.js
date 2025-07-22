import React, { useState, useEffect } from "react";
import "./App.css";
import SnakeGame from "./components/SnakeGame";
import Login from "./components/Login";
import Register from "./components/Register";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";

// Color palette variables
const COLORS = {
  primary: "#43a047",
  accent: "#ffeb3b",
  secondary: "#ffffff",
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // App state
  const [auth, setAuth] = useState(() =>
    // try to load from localStorage
    (() => {
      const token = localStorage.getItem("snaketoken");
      const username = localStorage.getItem("snakeuser");
      return token && username ? { token, username } : null;
    })()
  );
  const [authPage, setAuthPage] = useState("login");
  const [sidePanel, setSidePanel] = useState("leaderboard"); // "leaderboard" | "profile"
  const [liveScore, setLiveScore] = useState(0);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  // On auth, persist to storage
  useEffect(() => {
    if (auth) {
      localStorage.setItem("snaketoken", auth.token);
      localStorage.setItem("snakeuser", auth.username);
    } else {
      localStorage.removeItem("snaketoken");
      localStorage.removeItem("snakeuser");
    }
  }, [auth]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Auth ops
  const handleLogin = (token, username) => {
    setAuth({ token, username });
    setAuthPage("login");
  };
  const handleRegister = (token, username) => {
    setAuth({ token, username });
    setAuthPage("login");
  };
  const handleLogout = () => {
    setAuth(null);
    setAuthPage("login");
    setSidePanel("leaderboard");
  };

  // Responsive, minimal UI layout
  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 0 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 className="app-title" style={{ color: COLORS.primary, fontWeight: 700, letterSpacing: 1, margin: "32px 0 8px 0" }}>
          SNAKE
        </h1>
        <div style={{ color: "#aaa", fontSize: 16, fontWeight: 400, marginBottom: 20 }}>
          <span role="img" aria-label="snake">🐍</span> Play classic snake, track your score, and climb the leaderboard!
        </div>
      </header>
      <div className="main-layout">
        <div className="main-content">
          {!auth ? (
            authPage === "login" ? (
              <Login onLogin={handleLogin} onSwitch={() => setAuthPage("register")} />
            ) : (
              <Register onRegister={handleRegister} onSwitch={() => setAuthPage("login")} />
            )
          ) : (
            <SnakeGame
              token={auth.token}
              onScore={(score) => setLiveScore(score)}
            />
          )}
          <div className="controls-panel" style={{ marginTop: 24 }}>
            {auth ? (
              <>
                <button
                  className={
                    "btn-secondary" +
                    (sidePanel === "leaderboard" ? " active" : "")
                  }
                  style={{
                    borderBottom:
                      sidePanel === "leaderboard"
                        ? `3px solid ${COLORS.primary}`
                        : "none",
                  }}
                  onClick={() => setSidePanel("leaderboard")}
                >
                  Leaderboard
                </button>
                <button
                  className={
                    "btn-secondary" +
                    (sidePanel === "profile" ? " active" : "")
                  }
                  style={{
                    borderBottom:
                      sidePanel === "profile"
                        ? `3px solid ${COLORS.primary}`
                        : "none",
                  }}
                  onClick={() => setSidePanel("profile")}
                >
                  Profile
                </button>
                <div className="score-indicator" style={{
                  display: 'inline-block',
                  background: COLORS.primary,
                  color: COLORS.accent,
                  borderRadius: 8,
                  marginLeft: 16,
                  padding: "6px 14px",
                  fontWeight: 700,
                }}>
                  {auth && <>Score: {liveScore}</>}
                </div>
              </>
            ) : (
              <span style={{ color: "#999" }}>Sign in to save scores!</span>
            )}
          </div>
        </div>
        <aside className="side-panel">
          {auth && sidePanel === "profile" ? (
            <Profile username={auth.username} onLogout={handleLogout} />
          ) : (
            <Leaderboard highlightUsername={auth ? auth.username : ""} />
          )}
        </aside>
      </div>
      <footer className="app-footer">
        <span>
          Built with <span style={{ color: COLORS.primary }}>React</span> •{" "}
          <a
            href="https://github.com/"
            style={{ color: COLORS.primary }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
