import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Footer from "../components/Footer";
import ToggleSwitch from "../components/ToggleSwitch";
import Loader from "../components/loader";

export default function AdminPanel() {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      let response = await fetch(
        // "http://localhost:5000/api/displayuser",
        "https://vivisteria-2lrx.vercel.app/api/displayuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      response = await response.json();
      const flattenedUsers = response.flat();
      setAllUsers(flattenedUsers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  const deleteUser = async (userId) => {
    try {
      console.log(userId);
      let response = await fetch(
        // `http://localhost:5000/api/deleteuser/${userId}`,
        `https://vivisteria-2lrx.vercel.app/api/deleteuser/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      await response.json();
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleApproval = async (userId, isApproved) => {
    try {
      let response = await fetch(
        // `http://localhost:5000/api/toggleapproval/${userId}`,
        `https://vivisteria-2lrx.vercel.app/api/toggleapproval/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: !isApproved }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle approval");
      }
      await response.json();
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentUserId = localStorage.getItem("userID");
  const filteredUsers = allUsers.filter(
    (user) => user.name.toLowerCase().includes(search.toLowerCase()) && user._id !== currentUserId
  );

  if (loading) {
    return <Loader />; // Display the Loader component when loading
  }

  return (
    <div className="main-container bg-white">
      <Navbar />
      <div className="content-container">
        <div className="user-container">
          <h1 className="heading">All Users</h1>
          <div>
            <Search setSearch={setSearch} />
          </div>
          {filteredUsers && filteredUsers.length > 0 ? (
            <div>
              <h4>Currently Signed in users: {filteredUsers.length + 1}</h4>
            </div>
          ) : (
            ""
          )}
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers
              .sort((a, b) => b.isAdmin - a.isAdmin)
              .map((data) => (
                <div className="user-card" key={data._id}>
                  <div className="user-details">
                    <div className="user-field">
                      <span className="user-label">Name:</span> {data.name}
                    </div>
                    <div className="user-field">
                      <span className="user-label">Email:</span> {data.email}
                    </div>
                    <div className="user-field">
                      <span className="user-label">Address:</span> {data.location}
                    </div>
                    {data.isAdmin && (
                      <div className="user-field">
                        <span className="user-label">Approved as Admin:</span>
                        <ToggleSwitch
                          checked={data.isApproved}
                          onChange={() => toggleApproval(data._id, data.isApproved)}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteUser(data._id)}
                  >
                    <i className="fa-solid fa-trash text-white"></i>
                  </button>
                </div>
              ))
          ) : (
            <div className="no-users">No users found</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
