import React from "react";
import ReactStars from "react-stars";
import "./ReviewCard.css";
import { toast } from "react-hot-toast";

function ReviewCard({ review, userId }) {
  const deleteReviewHandler = async () => {
    const res = window.confirm("Do you want to delete your review ?");
    if (!res) return;
    console.log();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_REVIEW_ROOT_URL}/${review._id}`,
        {
          method: "delete",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw Error("something went wrong");
      console.log(res);

      toast.success("review deleted");
      window.location.reload();
    } catch (err) {
      toast.error("something went wrong");
    }
  };
  return (
    <div className="review_card">
      <header className="revier_card_header">
        <img
          alt="Silhouette of a person's head"
          src="https://ionicframework.com/docs/img/demos/avatar.svg"
          className="review_card_author_avatar"
        />
        <h6>{review?.author.name}</h6>
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
      {review.author._id === userId && (
        <div className="review_operations">
          <button
            className="delete_review_btn btn btn-danger"
            onClick={(e) => {
              e.preventDefault();
              deleteReviewHandler();
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
