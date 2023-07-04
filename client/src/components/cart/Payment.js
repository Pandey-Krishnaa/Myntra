import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import "./Payment.css";
import { toast } from "react-hot-toast";

function Payment() {
  const params = useParams();
  const stripe = useStripe();
  const element = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    try {
      // get the order amount from db
      const orderRes = await fetch(
        `${process.env.REACT_APP_ORDER_URL}/detail/${params.orderId}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || "something went wrong");
      }
      if (orderData.order.paymentStatus === "paid") {
        alert("you have already paid for this order.");
        navigate("/");
        return;
      }

      const paymentIntent = await fetch(
        process.env.REACT_APP_STRIPE_PAYMENT_INTENT_URL,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            amount: orderData.order.totalAmount * 100,
            orderId: orderData.order._id,
          }),
        }
      );
      const paymentIntentData = await paymentIntent.json();
      const client_secret = paymentIntentData.paymentIntent.client_secret;
      const card = element.getElement(CardElement);

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card,
      });
      const confirmedCardPayment = await stripe.confirmCardPayment(
        client_secret,
        { payment_method: paymentMethodReq?.paymentMethod?.id }
      );
      if (confirmedCardPayment.paymentIntent.status !== "succeeded") {
        throw new Error("payment failed... ");
      }

      toast.success("payment successful... redirecting to home");
      navigate("/");
    } catch (err) {
      toast.error("something went wrong ... ");
    }
    setLoading(false);
  };
  return (
    <div className="payment_wrapper">
      <form
        className="payment_form"
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }}
      >
        <CardElement
          className="card_input"
          options={{ hidePostalCode: true }}
        />
        {loading ? (
          <button className="payment_btn_disabled " type="submit" disabled>
            Processing...
          </button>
        ) : (
          <button className="payment_btn" type="submit">
            Pay Now
          </button>
        )}
      </form>
    </div>
  );
}

export default Payment;
