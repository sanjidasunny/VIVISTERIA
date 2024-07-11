import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState(""); // State to track error message

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: localStorage.getItem("userID"),
        }),
      });
      const data = await response.json();
      setProfileData(data.profileData);
      setFormData({
        name: data.profileData.name,
        email: data.profileData.email,
        location: data.profileData.location,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: localStorage.getItem("userID"),
          ...formData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(data.profileData);
        setEditMode(false);
        setError("");
      } else {
        setError("Invalid Password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Server Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="profile mt-4">
        {profileData ? (
          <>
            <div className="profile-header">
              <h1>Profile Information</h1>
            </div>
            <div className="profile-info">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Email:
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Old Password:
                      <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      New Password:
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Location:
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                  </button>
                  <p>Enter the current password to edit data</p>{" "}
                  {error && <p className="error-message">{error}</p>}
                </form>
              ) : (
                <>
                  <div>
                    <span>Name:</span> {profileData.name}
                  </div>
                  <div>
                    <span>Email:</span> {profileData.email}
                  </div>
                  <div className="text-muted">
                    <span>Password:</span> Protected
                  </div>
                  <div>
                    <span>Location:</span> {profileData.location}
                  </div>
                </>
              )}
            </div>
            {!editMode && (
              <div className="edit-button">
                <button onClick={handleEdit}>Edit Profile</button>
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
