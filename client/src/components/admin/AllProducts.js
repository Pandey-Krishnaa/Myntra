import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductThunk } from "../../store/productsSlice";
import { Link } from "react-router-dom";
import "./AllProducts.css";
function AllProducts() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductThunk());
  }, [dispatch]);
  const product = useSelector((state) => state.product);
  return (
    <div className="all_products_wrapper">
      <table className="table table-striped product_record_table">
        <thead>
          <tr>
            <th>SN.</th>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Ratings</th>
          </tr>
        </thead>
        {product?.products.map((product, i) => (
          <tr key={product._id}>
            <td className="product_cells">{i + 1}</td>
            <td>
              <Link to={`/products/${product._id}`}>{product._id}</Link>
            </td>
            <td>{product.name}</td>
            <td className="product_cells">{product.price}</td>
            <td className="product_cells">{product.countInStock}</td>
            <td className="product_cells">{product.ratings}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default AllProducts;
