import React, { useState } from "react";

/**
 * Register component.
 * Allows user to create an account and immediately login.
 * Props:
 *   - onRegister: function(token, username) [called on register+login success]
 *   - onSwitch: function() [called to switch back to Login]
 * PUBLIC_INTERFACE
 */
function Register({ onRegister, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Registration failed");
        setLoading(false);
        return;
      }
      // On success, attempt login automatically
      const loginRes = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!loginRes.ok) {
        setError("Error logging in after registration.");
        setLoading(false);
        return;
      }
      const data = await loginRes.json();
      onRegister(data.access_token, username);
    } catch {
      setError("Server unavailable");
    }
    setLoading(false);
  };

  return (
    <div className="auth-panel">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
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
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <div className="form-error">{error}</div>}
        <div className="form-switch">
          <span>Already have an account?</span>
          <button
            className="btn-link"
            type="button"
            onClick={onSwitch}
            tabIndex={-1}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
