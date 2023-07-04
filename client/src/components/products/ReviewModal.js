import React, { useState } from "react";
import ReactStars from "react-stars";
import "./ReviewModal.css";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { postReviewThunk } from "../../store/productSlice";
function ReviewModal({ onClickHandler, product_id }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const backdropClickHandler = (e) => {
    if (e.target.className === "review_modal_wrapper") onClickHandler();
  };
  const dispatch = useDispatch();
  const reviewSubmitHandler = async (review, rating, onClickHandler) => {
    const toastId = toast.loading("submitting review");
    console.log(process.env.REACT_APP_REVIEW_ROOT_URL);
    dispatch(
      postReviewThunk({ title: review, rating }, product_id, onClickHandler)
    );

    toast.dismiss(toastId);
  };
  return (
    <div
      className="review_modal_wrapper"
      onClick={(e) => {
        e.preventDefault();
        backdropClickHandler(e);
        // onClickHandler();
      }}
    >
      <div className="review_modal_container">
        <div className="review_modal_close_btn_wrapper">
          <button
            className="review_modal_close_btn"
            onClick={(e) => {
              e.preventDefault();
              onClickHandler();
            }}
          >
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <textarea
          rows={3}
          placeholder="write your comment"
          className="review_modal_input"
          onChange={(e) => {
            setReview(e.target.value);
          }}
        />
        <div style={{ padding: "20px" }}>
          <ReactStars
            count={5}
            size={30}
            value={rating}
            onChange={(newValue) => setRating(newValue)}
          />
        </div>
        <button
          className="btn btn-success"
          onClick={(e) => {
            e.preventDefault();
            reviewSubmitHandler(review, rating, onClickHandler);
          }}
        >
          Submit
        </button>
      </div>
      <Toaster />
    </div>
  );
}

export default ReviewModal;
