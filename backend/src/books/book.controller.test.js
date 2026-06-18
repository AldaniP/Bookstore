const Book = require("./book.model");
const { getSingleBook, postABook } = require("./book.controller");

jest.mock("./book.model", () => {
  const mockSave = jest.fn();
  const MockBook = jest.fn().mockImplementation((data) => {
    return {
      ...data,
      save: mockSave,
    };
  });

  MockBook.findById = jest.fn();
  MockBook.find = jest.fn();
  MockBook.findByIdAndUpdate = jest.fn();
  MockBook.findByIdAndDelete = jest.fn();
  MockBook.mockSave = mockSave;

  return MockBook;
});

describe("Book Controller Unit Tests", () => {
  let req, res;
  let consoleSpy;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe("getSingleBook", () => {
    it("should return status 200 and the book when found", async () => {
      const mockBookData = { _id: "123", title: "The Great Gatsby", category: "Fiction" };
      Book.findById.mockResolvedValue(mockBookData);
      req.params.id = "123";

      await getSingleBook(req, res);

      expect(Book.findById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockBookData);
    });

    it("should return status 404 when the book is not found", async () => {
      Book.findById.mockResolvedValue(null);
      req.params.id = "456";

      await getSingleBook(req, res);

      expect(Book.findById).toHaveBeenCalledWith("456");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Book not Found!" });
    });

    it("should return status 500 when database error occurs", async () => {
      const dbError = new Error("Database connection lost");
      Book.findById.mockRejectedValue(dbError);
      req.params.id = "123";

      await getSingleBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Failed to fetch book" });
    });
  });

  describe("postABook", () => {
    it("should return status 200 and post the book successfully", async () => {
      const newBookData = { title: "Clean Code", category: "Tech" };
      req.body = newBookData;
      Book.mockSave.mockResolvedValue(true);

      await postABook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toBeCalledWith(
        expect.objectContaining({
          message: "Book posted successfully",
        })
      );
    });

    it("should return status 500 when save fails", async () => {
      req.body = { title: "Clean Code" };
      Book.mockSave.mockRejectedValue(new Error("ValidationError"));

      await postABook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Failed to create book" });
    });
  });
});
