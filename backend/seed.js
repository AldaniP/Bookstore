const mongoose = require("mongoose");
require("dotenv").config();
const Book = require("./src/books/book.model");
const fs = require("fs");
const path = require("path");

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
    console.error("DB_URL is missing in .env file");
    process.exit(1);
}

const seedDatabase = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB for seeding...");

        // Delete existing books to avoid duplication
        await Book.deleteMany();
        console.log("Cleared existing books.");

        // Read books.json from frontend/public
        const booksDataPath = path.join(__dirname, "../frontend/public/books.json");
        const booksData = JSON.parse(fs.readFileSync(booksDataPath, "utf-8"));

        // Remove the hardcoded _id so MongoDB can generate ObjectId automatically
        const formattedBooks = booksData.map(book => {
            const { _id, ...rest } = book;
            return rest;
        });

        // Insert new books
        await Book.insertMany(formattedBooks);
        console.log("Seeding complete! Added", formattedBooks.length, "books.");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
