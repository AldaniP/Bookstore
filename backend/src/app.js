'use strict'

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ['http://localhost:5173', 'http://localhost:5000', '[::1]:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.run.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

const bookRoutes = require('./books/book.route');
const orderRoutes = require("./orders/order.route");
const userRoutes = require("./users/user.route");
const adminRoutes = require("./stats/admin.stats");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

app.use("/", (req, res) => {
  res.send("Book Store Server is running!");
});

module.exports = app;
