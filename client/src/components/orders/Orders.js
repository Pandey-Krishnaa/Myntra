import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyOrdersThunk } from "../../store/orderSlice";
import Moment from "react-moment";
import "./Orders.css";

import Loader from "../Loader";
function Orders() {
  const { isAuthenticated, status } = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyOrdersThunk());
  }, [dispatch]);
  return isAuthenticated && status === "IDLE" ? (
    <div className="orders_wrapper">
      {order.status === "LOADING" ? (
        <Loader />
      ) : (
        <>
          <div className="table_wrapper">
            <h1 className="order_wrapper_title">Your Orders</h1>
            <table className="table order_table">
              <tbody>
                <tr>
                  <td>
                    <h5 className="order_table_head">Order ID</h5>
                  </td>
                  <td>
                    <h5 className="order_table_head">Amount</h5>
                  </td>
                  <td>
                    <h5 className="order_table_head">Date</h5>
                  </td>
                  <td>
                    <h5 className="order_table_head">Order Status</h5>
                  </td>
                  <td>
                    <h5 className="order_table_head">Payment Status</h5>
                  </td>
                </tr>
                {order.orders.map((order) => {
                  return (
                    <tr key={order._id}>
                      <td>
                        <span className="desktop_order_id">
                          <Link to={`/orders/${order._id}`}>{order._id}</Link>
                        </span>
                        <span className="mobile_order_id">
                          <Link to={`/orders/${order._id}`}>
                            ***{order._id.slice(-3)}
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="order_amount">
                          ₹{order.totalAmount}
                        </span>
                      </td>
                      <td>
                        <Moment format="YYYY/MM/DD">{order?.createdAt}</Moment>
                      </td>
                      <td>{order.orderStatus}</td>
                      <td>
                        {order.paymentStatus === "unpaid" ? (
                          <Link
                            className="btn btn-danger"
                            to={`/place-order/payment/${order._id}`}
                          >
                            Pay Now
                          </Link>
                        ) : (
                          "paid"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  ) : (
    <h1>You're not logged in yet....</h1>
  );
}

export default Orders;
