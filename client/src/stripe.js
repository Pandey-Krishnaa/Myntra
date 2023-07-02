import { loadStripe } from "@stripe/stripe-js";
async function initStripe() {
  const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  const elements = stripe.elements();
  const appearance = {
    theme: "flat",
    variables: { colorPrimaryText: "#262626" },
  };
  const card = elements.create("card");
  card.mount("#checkout_card_input");
  stripe.createToken(card);
}
export default initStripe;
