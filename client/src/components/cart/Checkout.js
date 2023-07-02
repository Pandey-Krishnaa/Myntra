import React, { useEffect } from "react";
import initStripe from "../../stripe";
function Checkout() {
  useEffect(() => {
    initStripe();
  }, []);
  return (
    <div className="checkout_form">
      <div id="checkout_card_input"></div>
    </div>
  );
}

export default Checkout;
