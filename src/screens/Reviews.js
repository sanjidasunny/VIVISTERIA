import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const userID = localStorage.getItem("userID");
  const isAdmin = localStorage.getItem("adminStatus") === 'true';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.post("https://vivisteria-2lrx.vercel.app/api/displayreviews", {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch reviews");
      }
      const data = response.data;
      const sortedReviews = data.sort((a, b) => {
        if (a.userId === userID && b.userId !== userID) return -1;
        if (a.userId !== userID && b.userId === userID) return 1;
        return 0;
      });
      setReviews(sortedReviews);
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
        const response = await axios.put(
          `https://vivisteria-2lrx.vercel.app/api/review/${editReviewId}`,
          { comment: newReview },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        if (response.status !== 200) {
          throw new Error("Failed to edit review");
        }
        const updatedReview = response.data;
        // Optimistically update the state
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === editReviewId ? updatedReview : review
          )
        );
      } else {
        // Add new review
        const response = await axios.post("https://vivisteria-2lrx.vercel.app/api/review", {
          comment: newReview,
          userId: localStorage.getItem("userID"),
          email: localStorage.getItem("userEmail")
        }, {
          headers: {
            "Content-Type": "application/json",
          }
        });
        if (response.status !== 200) {
          throw new Error("Failed to add review");
        }
        const newReviewData = response.data;
        // Optimistically update the state
        setReviews(prevReviews => [newReviewData, ...prevReviews]);
      }
      setNewReview("");
      setEditMode(false);
      setEditReviewId(null);
      window.location.reload();
    } catch (error) {
      console.error("Error adding/editing review:", error);
    }
  };


  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `https://vivisteria-2lrx.vercel.app/api/review/${reviewId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
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
    <div className="main-container bg-white">
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
                  className="review-input bg-white"
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
