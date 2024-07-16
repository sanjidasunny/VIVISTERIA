import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  
  const isAdmin = localStorage.getItem("adminStatus") === 'true';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/displayreviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSaveReview = async (event) => {
    event.preventDefault();
    try {
      if (editMode && editReviewId) {
        // Edit existing review
        const response = await fetch(
          `http://localhost:5000/api/review/${editReviewId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment: newReview }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to edit review");
        }
      } else {
        // Add new review
        const response = await fetch("http://localhost:5000/api/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: newReview, userId: localStorage.getItem("userID"), email: localStorage.getItem("userEmail") }),
        });
        if (!response.ok) {
          throw new Error("Failed to add review");
        }
      }
      setNewReview("");
      setEditMode(false);
      setEditReviewId(null);
      fetchReviews();
    } catch (error) {
      console.error("Error adding/editing review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/review/${reviewId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const toggleEditMode = (reviewId, comment) => {
    setEditMode(true);
    setNewReview(comment);
    setEditReviewId(reviewId);
  };

  return (
    <div className="main-container">
      <Navbar />
      <div className="content-container">
        <div className="reviews-container">
          <h1 className="heading">Feedback</h1>
          {!isAdmin && localStorage.getItem("authToken") && (
            <div className="add-review-container">
              <h3>{editMode ? "Edit Your Review" : "Add Your Review"}</h3>
              <form onSubmit={handleSaveReview}>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="review-input"
                  placeholder="Write your review..."
                  required
                />
                {editMode ? (
                  <button type="submit" className="review-button">Save Edit</button>
                ) : (
                  <button type="submit" className="review-button">Submit Review</button>
                )}
              </form>
            </div>
          )}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div className="review-card" key={review._id}>
                    <div className="review-details">
                      <div className="review-field">
                        <span className="review-label">Email:</span>{" "}
                        {review.email}
                      </div>
                      <div className="review-field">
                        <span className="review-label">Date:</span>{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                      <div className="review-field">
                        <span className="review-label">Comment:</span>{" "}
                        {review.comment}
                      </div>
                      
                    </div>
                    {(localStorage.getItem("adminStatus") === "true" || localStorage.getItem("userID") === review.userId) && (
                      <div>
                        {localStorage.getItem("adminStatus") === "true" && (
                          <button
                            className="delete-review-button"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            Delete Review
                          </button>
                        )}
                        {localStorage.getItem("userID") === review.userId && (
                          <button
                            className="edit-review-button"
                            onClick={() => toggleEditMode(review._id, review.comment)}
                          >
                            Edit Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>No reviews found</div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Reviews;
