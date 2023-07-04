import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Moment from "react-moment";
import "./OrderDetail.css";
function OrderDetail() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, [params.orderId]);

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
        </div>

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
      </div>
    </div>
  );
}

export default OrderDetail;
