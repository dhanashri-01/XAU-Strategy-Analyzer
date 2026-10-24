require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const historyRoutes = require("./routes/historyRoutes");
const strategyRoutes = require("./routes/strategyRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 XAU Strategy Backend Running");
});

// API Routes
app.use("/api/strategy", strategyRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
