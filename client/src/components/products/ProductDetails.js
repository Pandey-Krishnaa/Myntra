import React, { useEffect, useState } from "react";
import Loader from "./../Loader";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import ReactStar from "react-stars";
import "./ProductDetails.css";
import { useDispatch, useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";
import { addToCart, loadCart } from "../../store/cartSlice";
import ReviewModal from "./ReviewModal";
import { fetchProductThunk, loop } from "../../store/productSlice";
function ProductDetails() {
  const params = useParams();

  const [err, setErr] = useState(null);
  const userState = useSelector((state) => state.user);
  const product = useSelector((state) => state.product.product);
  const [isValidToWriteReview, setIsValidToWriteReview] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const dispatch = useDispatch();
  const showReviewModalHandler = () => {
    setShowReviewModal(!showReviewModal);
  };
  useEffect(() => {
    dispatch(fetchProductThunk(params.id));
  }, [params]);

  if (err) return <h1>{err.message}</h1>;
  if (!product) return <Loader />;
  return (
    <>
      <div className="product_detail_wrapper">
        <div className="product_carousel">
          <Carousel
            autoPlay={true}
            interval={3000}
            infiniteLoop={true}
            showThumbs={false}
          >
            {product?.images.map((img) => (
              <div
                className="product_carousel_img_wrapper"
                key={img?.public_id}
              >
                <img
                  src={img.url}
                  alt={product?.name}
                  className="product_carousel_img"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="product_details">
          <p>₹{product?.price}*</p>
          <h1>{product?.name}</h1>
          <p>{product?.description}</p>

          <p
            className={
              product?.countInStock === 0 ? "out_of_stock" : "in_stock"
            }
          >
            {product?.countInStock === 0
              ? "Out of Stock"
              : `In Stock {${product?.countInStock}}`}
          </p>
          <ReactStar
            count={5}
            value={product?.ratings || 0}
            color1="gray"
            edit={false}
            half={true}
            size={30}
          />
          {userState?.user?.role === "naive" && (
            <>
              <div className="product_quatity_wrapper">
                <button
                  className="product_quantity_btn"
                  onClick={(e) => {
                    e.preventDefault();
                    if (productQuantity > 1)
                      setProductQuantity((pre) => pre - 1);
                  }}
                >
                  -
                </button>
                <input
                  value={productQuantity}
                  min={1}
                  max={product?.countInStock}
                  disabled
                  className="product_quantity_input"
                />
                <button
                  className="product_quantity_btn"
                  onClick={(e) => {
                    e.preventDefault();
                    if (productQuantity < product?.countInStock)
                      setProductQuantity((pre) => pre + 1);
                  }}
                >
                  +
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    addToCart({
                      quantity: productQuantity,
                      product,
                    })
                  );
                  dispatch(loadCart());
                }}
                className="add_to_cart_btn"
              >
                ADD TO CART
              </button>
              {isValidToWriteReview && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      showReviewModalHandler();
                    }}
                    className="add_to_cart_btn"
                    style={{ marginLeft: "10px" }}
                  >
                    Write Review
                  </button>
                  {showReviewModal && (
                    <ReviewModal
                      onClickHandler={showReviewModalHandler}
                      product_id={product?._id}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {product?.reviews.length > 0 && (
        <>
          <div className="product_review_wrapper">
            <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
              Reviews
            </h3>
            <div className="product_reviews">
              {product.reviews.map((review) => {
                return (
                  <ReviewCard
                    review={review}
                    key={review._id}
                    userId={userState.user._id}
                    product_id={product?._id}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductDetails;
