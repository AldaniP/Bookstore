import { Link, useSearchParams } from "react-router";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import { getImgUrl } from "../utils/getImgUrl";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  coverImage: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("q") || "";

  const {
    data: books,
    isLoading,
    isError,
  } = useFetchAllBooksQuery(undefined);

  const bookList: Book[] = Array.isArray(books) ? books : [];

  const filteredBooks = bookList.filter((book) =>
    book.title?.toLowerCase().includes(keyword.toLowerCase()) ||
    book.author?.toLowerCase().includes(keyword.toLowerCase()) ||
    book.category?.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <p>Loading books...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <p>Error loading books.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{keyword}"
      </h1>

      <p className="text-gray-600 mb-6">
        Found {filteredBooks.length} result(s)
      </p>

      {filteredBooks.length === 0 ? (
        <div className="border rounded-lg p-6 bg-gray-50">
          <p className="text-gray-500">
            No books found matching "{keyword}"
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
                <img
                    src={getImgUrl(book.coverImage)}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded mb-3"
                />
              <h2 className="text-lg font-semibold mb-2">
                {book.title}
              </h2>

              <p className="text-gray-600 mb-1">
                Author: {book.author || "Unknown"}
              </p>

              <p className="text-gray-600 mb-4 capitalize">
                Category: {book.category || "Uncategorized"}
              </p>

              <Link
                to={`/books/${book._id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;