const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const couponRoute = require("./routes/couponRoute");
const orderRoute = require("./routes/orderRoute");
const errorHandler = require("./middleware/errorMiddleware");
const brandRoute = require("./routes/brandRoute");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ urlencoded: true , extended:true }));
app.use;
app.use(
  cors({
    origin: ["http://localhost:3000", "https://amplemart.vercel.app"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

// Error Middleware
app.use(errorHandler);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

//Routes
app.get("/", (req, res) => {
  res.send("Homepage");
});

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);
