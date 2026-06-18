const express = require("express");

const {
  createReview,
  getReviewsByBook,
} = require("./review.controller");

const router = express.Router();

router.post("/", createReview);

router.get("/:bookId", getReviewsByBook);

module.exports = router;