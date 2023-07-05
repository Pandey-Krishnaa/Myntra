import React, { useEffect, useState } from "react";
import Loader from "./../Loader";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import ReactStar from "react-stars";
import "./ProductDetails.css";
import { useDispatch, useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";
import { fetchProductThunk, removeProduct } from "../../store/productSlice";
import { addToCart } from "../../store/cartSlice";
import { toast } from "react-hot-toast";
function ProductDetails() {
  const params = useParams();
  const userState = useSelector((state) => state.user);
  const product = useSelector((state) => state.product.product);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const dispatch = useDispatch();
  const showReviewModalHandler = () => {
    setShowReviewModal(!showReviewModal);
  };
  useEffect(() => {
    dispatch(fetchProductThunk(params.id));
    function cleanup() {
      dispatch(removeProduct());
    }
    return cleanup;
  }, [params, dispatch]);

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
            {product?.images?.map((img) => (
              <div
                className="product_carousel_img_wrapper"
                key={img?.public_id}
              >
                <img
                  src={img?.url}
                  alt={product?.name}
                  className="product_carousel_img"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="product_details">
          <div className="product_details_info">
            <p className="product_details_price">₹{product?.price}*</p>
            <h1 className="product_details_name">{product?.name}</h1>
            <p className="product_details_description">
              {product?.description}
            </p>

            <p
              className={
                product?.countInStock === 0
                  ? "out_of_stock product_details_stock"
                  : "in_stock product_details_stock"
              }
            >
              {product?.countInStock === 0
                ? "Out of Stock"
                : `In Stock {${product?.countInStock}}`}
            </p>
          </div>
          <div
            style={{ padding: "10px 0px" }}
            className="product_details_ratings"
          >
            <ReactStar
              count={5}
              value={product?.ratings || 0}
              color1="gray"
              edit={false}
              half={true}
              size={30}
            />
            {product?.reviews?.length > 0 && (
              <span>({product?.reviews?.length} review)</span>
            )}
          </div>
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
                  const item = { ...product, quantity: productQuantity };
                  dispatch(addToCart({ item }));
                  toast.success("added to cart...");
                }}
                className="add_to_cart_btn "
                style={{ marginRight: "5px" }}
              >
                ADD TO CART
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  showReviewModalHandler();
                }}
                className="add_to_cart_btn"
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
        </div>
      </div>
      {product?.reviews?.length > 0 && (
        <>
          <div className="product_review_wrapper">
            <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
              Reviews
            </h3>
            <div className="product_reviews">
              {product?.reviews?.map((review) => {
                return (
                  <ReviewCard
                    review={review}
                    key={review?._id}
                    userId={userState?.user?._id}
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
