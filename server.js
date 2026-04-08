const express = require('express');
const app = express();
const connectDB = require('./middleware/connectDB');
const certRoutes = require('./routes/certRoutes'); // Import your new routes

// 1. Middlewares & Database
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for form data
connectDB();

// 2. Settings
app.set("view engine", "ejs");
app.use(express.static("public"));

// 3. Use Routes
app.use("/", certRoutes); // This handles /, /editor/:id, and /generate-bulk


// 4. Start Server
app.listen(3000, () => {
    console.log("Server Started on http://localhost:3000");
});