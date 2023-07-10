import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./../Loader";
import { ORDER_STATUS } from "./../../constant";
import "./OrderDetail.css";
import { updateOrderStatusThunk } from "../../store/orderSlice";
function OrderDetail() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const { user } = useSelector((state) => state.user);
  const orderStateStatus = useSelector((state) => state.order.status);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_ORDER_URL}/detail/${params.orderId}`,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrderStatus(data.order.orderStatus);
        const itemsPromises = data.order.items.map((item) =>
          fetch(
            `${process.env.REACT_APP_ROOT_PRODUCT_URL}/${item.product_id}`,
            { method: "get" }
          )
        );
        const obj = {};
        data.order.items.forEach((item) => {
          if (item?.product_id) obj[item?.product_id] = item?.quantity;
        });

        const itemsResPromise = await Promise.all(itemsPromises);
        const itemsJsonResponce = await Promise.all(itemsResPromise);
        const items = await Promise.all(itemsJsonResponce.map((t) => t.json()));
        items.forEach((item) => (item.quantity = obj[item?.product?._id]));
        setData(data.order);
        setItems(items);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [params.orderId]);

  if (loading) return <Loader />;
  if (!data) return <h1>No details found</h1>;
  return (
    <div className="order_details_wrapper">
      <div className="order_details_container">
        <div className="order_details_info">
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <h6>Order Id</h6>
                </td>
                <td>
                  <p>{data?._id}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Total Amount</h6>
                </td>
                <td>
                  <p>{data?.totalAmount}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Ordered On</h6>
                </td>
                <td>
                  <Moment format="YYYY/MM/DD">{data?.createdAt}</Moment>
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Order Status</h6>
                </td>
                <td>
                  <p>{data?.orderStatus}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h6>Payment Status</h6>
                </td>
                <td>
                  <p>
                    {data?.paymentStatus === "paid" ? (
                      "paid"
                    ) : (
                      <Link to={`place-order/payment/${data?._id}`}>
                        Pay now
                      </Link>
                    )}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          {user?.role === "admin" && (
            <div className="update_order_section">
              <select
                class="form-select"
                aria-label="Default select example"
                onChange={(e) => {
                  setOrderStatus(e.target.value);
                }}
              >
                {ORDER_STATUS.map((orderstatus) => (
                  <option
                    value={orderstatus}
                    selected={orderstatus === orderStatus}
                  >
                    {orderstatus}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-danger my-3"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(updateOrderStatusThunk(params.orderId, orderStatus));
                }}
                disabled={orderStateStatus === "LOADING"}
              >
                {orderStateStatus === "LOADING"
                  ? "Updating..."
                  : "Update Status"}
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <h1>No item found</h1>
        ) : (
          <div className="items">
            {items.map((item) => (
              <div className="item_card" key={item?.product?._id}>
                <div className="item_card_image">
                  <Link to={`/products/${item?.product?._id}`}>
                    <img
                      src={item?.product?.images[0]?.url}
                      className="order_product_img"
                      alt={item?.product?.images[0]?.public_id}
                    />
                  </Link>
                </div>
                <div className="item_detail">
                  <h6>{item?.product?.name}</h6>
                  <h6>x{item?.quantity}</h6>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;
