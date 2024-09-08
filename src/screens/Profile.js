import React, { useEffect, useState, useRef } from "react";
import axiosInstance from '../components/AxiosInstance';
import Navbar from "../components/Navbar";
import Loader from "../components/loader";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
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

    setLoading(true);
    const formDataObj = new FormData();
    formDataObj.append("id", localStorage.getItem("userID"));
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);  // Though the email is readonly
    formDataObj.append("location", formData.location);
    formDataObj.append("oldPassword", formData.oldPassword);
    formDataObj.append("newPassword", formData.newPassword);

    if (fileInputRef.current.files[0]) {
      formDataObj.append("image", fileInputRef.current.files[0]);  // Append image file
    }
    try {
      const response = await axiosInstance.post("/profile/update", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",  // Important for file uploads
        },
      });
      if (response.data.success) {
        setProfileData(response.data.profileData);
        console.log(response.data.profileData.profilePic)
        localStorage.setItem('profilePic', response.data.profileData.profilePic)
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
          <><div className="profile-image-container">

            {profileData.profilePic ? <img className="profile-image" src={profileData.profilePic} alt="Profile image" /> :
              <img className="profile-image" src="/profile.jpg" alt="Profile image" />
            }
          </div>
            <div className="profile-header">
              <h1>Profile Information</h1>
            </div>
            <div className="profile-info">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>
                      Profile Picture:
                      <input
                        type="file"
                        ref={fileInputRef}  // Use ref to access the file
                        accept="image/*"
                      />
                    </label>
                  </div>
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
                        readOnly
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
                    {loading ? <Loader /> : "Submit"}
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
          <Loader />
        )}
      </div>
    </div>
  );
}

export default Profile;
