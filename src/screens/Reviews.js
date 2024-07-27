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
            if (response.status !== 200) throw new Error("Failed to fetch reviews");
            const data = response.data;
            const sortedReviews = data.sort((a, b) => {
                if (a.userId === userID && b.userId !== userID) return -1;
                if (a.userId !== userID && b.userId === userID) return 1;
                return 0;
            });
            setReviews(sortedReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveReview = async (event) => {
        event.preventDefault();
        try {
            const url = editMode
                ? `https://vivisteria-2lrx.vercel.app/api/review/${editReviewId}`
                : "https://vivisteria-2lrx.vercel.app/api/review";
            const method = editMode ? 'put' : 'post';
            const data = editMode
                ? { comment: newReview }
                : {
                    comment: newReview,
                    userId: localStorage.getItem("userID"),
                    email: localStorage.getItem("userEmail")
                };

            const response = await axios({ url, method, data, headers: { "Content-Type": "application/json" } });
            if (response.status !== 200) throw new Error(`Failed to ${editMode ? 'edit' : 'add'} review`);
            const updatedReview = response.data;

            setReviews(prevReviews => {
                if (editMode) {
                    return prevReviews.map(review => review._id === editReviewId ? updatedReview : review);
                }
                return [updatedReview, ...prevReviews];
            });
            setNewReview("");
            setEditMode(false);
            setEditReviewId(null);
        } catch (error) {
            console.error(`Error ${editMode ? 'editing' : 'adding'} review:`, error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await axios.delete(`https://vivisteria-2lrx.vercel.app/api/review/${reviewId}`, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status !== 200) throw new Error("Failed to delete review");
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
                                <button type="submit" className="review-button">
                                    {editMode ? "Save Edit" : "Submit Review"}
                                </button>
                            </form>
                        </div>
                    )}
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div>
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div className="review-card" key={review._id}>
                                        <div className="review-details">
                                            <div className="review-field">
                                                <span className="review-label">Email:</span> {review.email}
                                            </div>
                                            <div className="review-field">
                                                <span className="review-label">Date:</span> {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="review-field">
                                                <span className="review-label">Comment:</span> {review.comment}
                                            </div>
                                        </div>
                                        {(isAdmin || userID === review.userId) && (
                                            <div>
                                                {isAdmin && (
                                                    <button
                                                        className="delete-review-button"
                                                        onClick={() => handleDeleteReview(review._id)}
                                                    >
                                                        Delete Review
                                                    </button>
                                                )}
                                                {userID === review.userId && (
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
