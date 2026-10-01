require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const historyRoutes = require("./routes/historyRoutes");
const strategyRoutes = require("./routes/strategyRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 XAU Strategy Backend Running");
});

// Strategy API
app.use("/api/strategy", strategyRoutes);
app.use("/api/history", historyRoutes);
const PORT = 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});