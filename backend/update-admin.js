const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/users/user.model");

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
    console.error("DB_URL is missing in .env file");
    process.exit(1);
}

const updateAdmin = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB...");

        // Ganti 'admin' di bawah ini dengan username admin saat ini yang ingin Anda ubah
        const currentUsername = "admin"; 

        const admin = await User.findOne({ username: currentUsername });
        if (!admin) {
            console.log(`Admin user with username '${currentUsername}' not found!`);
            process.exit(1);
        }

        // Tentukan username dan password baru di sini
        const newUsername = "newadmin"; 
        const newPassword = "newadminpassword";

        admin.username = newUsername;
        admin.password = newPassword; // Middleware mongoose akan otomatis menghash password baru ini saat disave

        await admin.save();
        
        console.log("Admin account updated successfully!");
        console.log(`New Username: ${newUsername}`);
        console.log(`New Password: ${newPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Failed to update admin:", error);
        process.exit(1);
    }
};

updateAdmin();
