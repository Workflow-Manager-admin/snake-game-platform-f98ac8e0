import React, { useEffect, useState } from "react";

/**
 * Leaderboard component.
 * Shows global leaderboard from backend.
 * Props:
 *   - highlightUsername: string (optionally highlight this user's entry)
 *   - showTitle: bool (optional, default true)
 * PUBLIC_INTERFACE
 */
function Leaderboard({ highlightUsername, showTitle = true }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch("/leaderboard/");
        if (!res.ok) {
          setEntries([]);
        } else {
          const data = await res.json();
          setEntries((data && data.leaderboard) || []);
        }
      } catch {
        setEntries([]);
      }
      setLoading(false);
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="leaderboard-panel">
      {showTitle && <h3>Leaderboard</h3>}
      {loading ? (
        <div className="leaderboard-loading">Loading...</div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No scores yet.
                </td>
              </tr>
            )}
            {entries.map((entry, idx) => (
              <tr
                key={entry.username}
                className={
                  highlightUsername === entry.username
                    ? "leaderboard-row highlight"
                    : "leaderboard-row"
                }
              >
                <td>{idx + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
