import React from "react";
import ReactStars from "react-stars";
import "./ReviewCard.css";

import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/productSlice";

function ReviewCard({ review, userId }) {
  const dispatch = useDispatch();
  return (
    <div className="review_card">
      <header className="revier_card_header">
        <img
          alt="Silhouette of a person's head"
          src="https://ionicframework.com/docs/img/demos/avatar.svg"
          className="review_card_author_avatar"
        />
        <h6>{review?.author?.name}</h6>
      </header>
      <main>
        <ReactStars
          count={5}
          value={review?.rating}
          edit={false}
          color1="gray"
          color2="yellow"
          size={30}
        />
        <p>{review?.title}</p>
      </main>
      {review?.author?._id === userId && userId !== undefined && (
        <div className="review_operations">
          <button
            className="delete_review_btn btn btn-danger"
            onClick={(e) => {
              e.preventDefault();
              dispatch(deleteReviewThunk(review?.product, review?._id));
            }}
          >
            Delete Review
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
