import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProductThunk } from "../../store/productsSlice";
import { PRODUCT_CATEGORIES, FOR_WHOM } from "../../constant";
import { toast } from "react-hot-toast";
import "./UpdateProduct.css";
function UpdateProduct() {
  const params = useParams();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    brand: "",
    forWhom: FOR_WHOM[0],
    category: PRODUCT_CATEGORIES[0],
  });
  const productState = useSelector((state) => state.products);
  const diabledClass = productState.status === "LOADING" ? "disabled" : "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    async function initProduct() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_ROOT_PRODUCT_URL}/${params.productId}`
        );
        const productData = await res.json();
        if (!res.ok) throw new Error(productData.message);
        const {
          name,
          description,
          price,
          countInStock,
          brand,
          forWhom,
          category,
        } = productData.product;

        setProduct({
          name,
          description,
          price,
          countInStock,
          brand,
          forWhom,
          category,
        });
        console.log(product);
      } catch (err) {
        toast.error(err.message);
        navigate("/admin/products/update");
      }
    }
    initProduct();
  }, [params.productId]);

  return (
    <form
      className="update_product_container product_form"
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(updateProductThunk(params.productId, product));
      }}
    >
      <div className="update_product_name update_product_input_wrapper">
        <h5>Product Name</h5>
        <input
          value={product?.name}
          type="text"
          className="product_form_input"
          placeholder="Product Name"
          required
          onChange={(e) => {
            setProduct({ ...product, name: e.target.value });
          }}
        />
      </div>
      <div className="update_product_desctiption update_product_input_wrapper">
        <h5>Product Description</h5>
        <input
          value={product?.description}
          type="text"
          className="product_form_input"
          placeholder="Product Description"
          onChange={(e) => {
            setProduct({ ...product, description: e.target.value });
          }}
          required
        />
      </div>
      <div className="update_product_price update_product_input_wrapper">
        <h5>Product Price</h5>
        <input
          value={product?.price}
          type="number"
          className="product_form_input"
          placeholder="Product Price"
          onChange={(e) => {
            setProduct({ ...product, price: e.target.value });
          }}
          required
        />
      </div>
      <div className="update_product_brand update_product_input_wrapper">
        <h5>Product Brand</h5>
        <input
          value={product?.brand}
          type="text"
          className="product_form_input"
          placeholder="Product Brand"
          onChange={(e) => {
            setProduct({ ...product, brand: e.target.value });
          }}
          required
        />
      </div>

      <div className="update_product_stock update_product_input_wrapper">
        <h5>Product Stock</h5>
        <input
          value={product?.countInStock}
          type="number"
          className="product_form_input"
          placeholder="Stock Count"
          onChange={(e) => {
            setProduct({ ...product, countInStock: e.target.value });
          }}
          required
        />
      </div>
      <div className="product_form_dropdown">
        <label>Category</label>
        <select
          className="form-select"
          value={product?.category}
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
          value={product?.forWhom}
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

      <button
        type="submit"
        className={`product_form_submit_btn ${diabledClass}`}
        disabled={productState?.status === "LOADING" ? true : false}
      >
        Update Product
      </button>
    </form>
  );
}

export default UpdateProduct;
