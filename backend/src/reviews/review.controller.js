const Review = require("./review.model");

const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);

    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create review",
    });
  }
};

const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({
      bookId,
    }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

module.exports = {
  createReview,
  getReviewsByBook,
};