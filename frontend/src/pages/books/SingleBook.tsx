import { FiShoppingCart } from "react-icons/fi";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";

import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { useAuth } from "../../context/AuthContext";

import {
  useGetReviewsByBookQuery,
  useCreateReviewMutation,
} from "../../redux/features/reviews/reviewsApi";

interface Book {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  category: string;
  description: string;
  coverImage: string;
}

interface Review {
  _id?: string;
  username: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const SingleBook = () => {
  const { id } = useParams();

  const { data: book, isLoading, isError } =
    useFetchBookByIdQuery(id);

  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================
  // REVIEW STATE
  // =========================

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const {
    data: reviews = [],
  } = useGetReviewsByBookQuery(id) as {
    data: Review[];
  };

  const [createReview] =
    useCreateReviewMutation();

  const handleSubmitReview = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const result = await createReview({
        bookId: id,
        userName:
          currentUser.displayName ||
          currentUser.email,
        userEmail: currentUser.email,
        rating,
        comment,
      });

      console.log("Review Result:", result);

      setComment("");
      setRating(5);

    } catch (error) {
      console.error("Review Error:", error);
    }
  };

  const handleAddToCart = (product: Book) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    dispatch(addToCart(product));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error happening to load book info</div>;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum: number, r: Review) => sum + r.rating,
            0
          ) /
          reviews.length
        ).toFixed(1)
      : "0";

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="shadow-md rounded-lg p-5 bg-white">
        <h1 className="text-3xl font-bold mb-6">
          {book.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="rounded-lg shadow"
            />
          </div>

          <div>
            <p className="text-gray-700 mb-2">
              <strong>Author:</strong>{" "}
              {book.author || "Admin"}
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Published:</strong>{" "}
              {new Date(book.createdAt).toLocaleDateString()}
            </p>

            <p className="text-gray-700 mb-2 capitalize">
              <strong>Category:</strong>{" "}
              {book.category}
            </p>

            <p className="text-gray-700 mb-6">
              <strong>Description:</strong>{" "}
              {book.description}
            </p>

            <div className="mb-6">
              <span className="font-semibold">
                Rating:
              </span>{" "}
              ⭐ {averageRating}/5 ({reviews.length} reviews)
            </div>

            <button
              onClick={() => handleAddToCart(book)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md flex items-center gap-2 transition-all duration-200"
            >
              <FiShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* REVIEW SECTION */}

      <div className="mt-10 bg-white shadow-md rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-5">
          Customer Reviews
        </h2>

        {/* FORM REVIEW */}

        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">
            Write a Review
          </h3>

          <div className="mb-3">
            <label className="block mb-2">
              Rating
            </label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              className="border rounded-md p-2"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>
          </div>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write your review..."
            className="w-full border rounded-md p-3 mb-3"
            rows={4}
          />

          <button
            onClick={handleSubmitReview}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md flex items-center gap-2 transition-all duration-200"
          >
            Submit Review
          </button>
        </div>

        {/* REVIEW LIST */}

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map(
              (review: Review, index: number) => (
              <div
                key={index}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">
                    {review.username}
                  </h4>

                  <span>
                    {"⭐".repeat(review.rating)}
                  </span>
                </div>

                <p className="text-gray-700">
                  {review.comment}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;