import React, { useState } from "react";
import { PRODUCT_CATEGORIES, FOR_WHOM } from "../../constant";
import "./ProductForm.css";
import { useDispatch, useSelector } from "react-redux";
import { addProductThunk } from "../../store/productsSlice";
function ProductForm() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    brand: "",
    forWhom: FOR_WHOM[0],
    category: PRODUCT_CATEGORIES[0],
    images: null,
  });
  const productState = useSelector((state) => state.product);
  const diabledClass = productState.status === "LOADING" ? "disabled" : "";
  const dispatch = useDispatch();
  return (
    <div className="product_form_wrapper">
      <h3 className="product_form_heading">Fill the Product Details</h3>
      <form
        className="product_form"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(product);
          dispatch(addProductThunk(product));
        }}
      >
        <input
          type="text"
          className="product_form_input"
          placeholder="Product Name"
          required
          onChange={(e) => {
            setProduct({ ...product, name: e.target.value });
          }}
        />
        <input
          type="text"
          className="product_form_input"
          placeholder="Product Description"
          onChange={(e) => {
            setProduct({ ...product, description: e.target.value });
          }}
          required
        />
        <input
          type="number"
          className="product_form_input"
          placeholder="Product Price"
          onChange={(e) => {
            setProduct({ ...product, price: e.target.value });
          }}
          required
        />
        <input
          type="text"
          className="product_form_input"
          placeholder="Product Brand"
          onChange={(e) => {
            setProduct({ ...product, brand: e.target.value });
          }}
          required
        />

        <input
          type="number"
          className="product_form_input"
          placeholder="Stock Count"
          onChange={(e) => {
            setProduct({ ...product, countInStock: e.target.value });
          }}
          required
        />
        <div className="product_form_dropdown">
          <label>Category</label>
          <select
            className="form-select"
            onChange={(e) => {
              setProduct({
                ...product,
                category: e.target.options[e.target.selectedIndex].value,
              });
            }}
            required
          >
            {PRODUCT_CATEGORIES.map((category, i) => (
              <option key={i}>{category}</option>
            ))}
          </select>
        </div>
        <div className="product_form_dropdown">
          <label>For</label>
          <select
            className="form-select"
            onChange={(e) => {
              setProduct({
                ...product,
                forWhom: e.target.options[e.target.selectedIndex].value,
              });
            }}
            required
          >
            {FOR_WHOM.map((item, i) => (
              <option key={i}>{item}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Select Image</label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            multiple
            accept="image/*"
            required
            onChange={(e) => {
              setProduct({ ...product, images: e.target.files });
            }}
          />
        </div>

        <button
          type="submit"
          className={`product_form_submit_btn ${diabledClass}`}
          disabled={productState?.status === "LOADING" ? true : false}
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
