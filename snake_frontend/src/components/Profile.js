import React from "react";

/**
 * UserProfile component.
 * Shows currently logged-in user's information and logout.
 * Props:
 *   - username: string
 *   - onLogout: function()
 * PUBLIC_INTERFACE
 */
function Profile({ username, onLogout }) {
  return (
    <div className="profile-panel">
      <h3>Your Profile</h3>
      <div className="profile-info">
        <span className="profile-username">{username}</span>
      </div>
      <button className="btn-link" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
