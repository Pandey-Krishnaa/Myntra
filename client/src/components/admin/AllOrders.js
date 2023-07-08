import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./../Loader";
import { getAllOrderAdminThunk } from "../../store/orderSlice";
import { Link } from "react-router-dom";
function AllOrders() {
  const dispatch = useDispatch();
  const { status, allOrders } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(getAllOrderAdminThunk());
  }, []);
  if (status === "LOADING") return <Loader />;
  if (allOrders.length === 0) return <h1>No Orders...</h1>;
  return (
    <table className="table" width="100%">
      <tbody>
        <tr>
          <td>
            <h6>Order ID</h6>
          </td>
          <td>
            <h6>Customer ID</h6>
          </td>
          <td>
            <h6>Payment Status</h6>
          </td>
          <td>
            <h6>Order Status</h6>
          </td>
        </tr>
        {allOrders.map((order) => (
          <tr>
            <td>
              <Link to={`/admin/all-orders/order/${order._id}`}>
                {order._id}
              </Link>
            </td>
            <td>{order.customer}</td>
            <td>{order.paymentStatus}</td>
            <td>{order.orderStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AllOrders;
