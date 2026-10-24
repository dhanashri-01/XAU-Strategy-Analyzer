const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set. Strategy runs will work, but history will not be saved.");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed. Strategy runs can continue without saved history.");
    console.error(error.message);
    return false;
  }
};

module.exports = connectDB;
