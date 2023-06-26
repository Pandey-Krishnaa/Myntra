import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    async function fetchProduct() {
      const toastId = toast.loading("loading...");
      try {
        const res = await fetch(
          `${process.env.REACT_APP_GET_ALL_PRODUCTS_URL}/${params.id}`
        );
        const data = await res.json();
        console.log(data);
        if (!res.ok) throw new Error(data.message);
        setProduct(data.product);
        console.log(data.product);
      } catch (err) {
        setErr(err);
      }
      toast.dismiss(toastId);
    }
    fetchProduct();
  }, [params]);
  if (err) return <h1>{err.message}</h1>;
  return <h1>Hello</h1>;
}

export default ProductDetails;
