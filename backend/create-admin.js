const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/users/user.model");

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
    console.error("DB_URL is missing in .env file");
    process.exit(1);
}

const createAdmin = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB...");

        const adminExists = await User.findOne({ username: "admin" });
        if (adminExists) {
            console.log("Admin user already exists!");
            process.exit(0);
        }

        const admin = new User({
            username: "admin",
            password: "admin", // Ubah password ini sesuai keinginan
            role: "admin"
        });

        await admin.save();
        console.log("Admin account created successfully!");
        console.log("Username: admin");
        console.log("Password: admin");

        process.exit(0);
    } catch (error) {
        console.error("Failed to create admin:", error);
        process.exit(1);
    }
};

createAdmin();
