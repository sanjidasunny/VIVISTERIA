import React, { useEffect, useState } from "react";
import axiosInstance from '../components/AxiosInstance';
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.post("/profile", {
          id: localStorage.getItem("userID"),
        });
        setProfileData(response.data.profileData);
        setFormData({
          name: response.data.profileData.name,
          email: response.data.profileData.email,
          location: response.data.profileData.location,
          oldPassword: "",
          newPassword: "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword.length < 6) {
      alert("Password length must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/profile/update", {
        id: localStorage.getItem("userID"),
        ...formData,
      });
      if (response.data.success) {
        setProfileData(response.data.profileData);
        setEditMode(false);
        setError("");
      } else {
        setError(response.data.msg || "Error updating profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Server Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white" style={{ height: "100vh" }}>
      <Navbar />
      <div className="profile" style={{ marginTop: "120px" }}>
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
