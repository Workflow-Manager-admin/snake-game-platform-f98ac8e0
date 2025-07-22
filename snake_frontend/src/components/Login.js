import React, { useState } from "react";

/**
 * Login component.
 * Prompts user to login and obtains JWT from backend.
 * Props:
 *   - onLogin: function(token, username) [called on login success]
 *   - onSwitch: function() [called to switch to Register]
 * PUBLIC_INTERFACE
 */
function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data && data.access_token) {
        onLogin(data.access_token, username);
      } else {
        setError("Login failed");
      }
    } catch {
      setError("Server unavailable");
    }
    setLoading(false);
  };

  // UI
  return (
    <div className="auth-panel">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Username:
          <input
            type="text"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="form-error">{error}</div>}
        <div className="form-switch">
          <span>Don't have an account?</span>
          <button
            className="btn-link"
            type="button"
            onClick={onSwitch}
            tabIndex={-1}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
