import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const [profileData, setProfileData] = useState();

  const fetchProfile = async () => {
    console.log(localStorage.getItem("userID"));
    await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: localStorage.getItem("userID"),
      }),
    }).then(async (res) => {
      let response = await res.json();
      setProfileData(response.profileData);
      console.log(response.profileData);
    });
  };
  const handleEdit = () => {
    console.log("Edit button clicked");
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="profile">
        {profileData ? (
          <>
            <div className="profile-header">
              <h1>Profile Information</h1>
            </div>
            <div className="profile-info">
              <div>
                <span>Name:</span> {profileData.name}
              </div>
              <div>
                <span>Email:</span> {profileData.email}
              </div>
              <div className="text-muted">
                <span>Passwod:</span> Protected
              </div>
              <div>
                <span>Location:</span> {profileData.location}
              </div>
            </div>
            <div className="edit-button">
              <button onClick={handleEdit}>Edit Profile</button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
