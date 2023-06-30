import React, { useState } from "react";
import "./RemoveProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { removeProductThunk } from "../../store/productsSlice";

function RemoveProduct() {
  const dispatch = useDispatch();
  const [productId, setProductId] = useState("");
  const loading = useSelector((state) => state.products.status);
  return (
    <form
      className="remove_product_container"
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(removeProductThunk(productId));
      }}
    >
      <input
        type="text"
        placeholder="product id..."
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        required
      />
      <button className="btn btn-danger" disabled={loading === "LOADING"}>
        Delete Product
      </button>
    </form>
  );
}

export default RemoveProduct;
