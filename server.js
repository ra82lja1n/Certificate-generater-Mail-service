const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const app = express();
const connectDB = require('./middleware/connectDB');
const certRoutes = require('./routes/certRoutes'); 

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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});
