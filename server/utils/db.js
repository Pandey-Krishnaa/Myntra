import mongoose from "mongoose";

const connectDb = () => {
  const str = process.env.DB_URL.replace("<password>", process.env.DB_PASS);
  mongoose
    .connect(str, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected with db");
    })
    .catch((err) => {
      console.log(err);
      console.log("failed to connect with db");
    });
};

export default connectDb;
