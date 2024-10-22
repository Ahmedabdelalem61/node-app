const express = require("express");
// const mongoose = require("mongoose");
const redis = require("redis"); // Import Redis

const { Client } = require("pg");

// Create a client instance using a connection string
const client = new Client("postgres://root:example@postgres:5432");

// Connect to the database
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL successfully");
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
  });

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection string
// const MONGODB_URI = "mongodb://root:example@mongo:27017";

// Redis client setup
const REDIS_HOST = process.env.REDIS_HOST || "redis"; // Redis container name as host
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

// Connect to Redis
redisClient.on("connect", () => {
  console.log("Connected to Redis successfully!");
});
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});
redisClient.connect(); // Use Redis v4 connect method

// Connect to MongoDB
// mongoose
//   .connect(MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB successfully!"))
//   .catch((error) => console.error("Error connecting to MongoDB:", error));

// Route to set data in Redis
app.get("/", async (req, res) => {
  try {
    await redisClient.set("greeting", "Hello from Redis!"); // Set key-value pair in Redis
    res.send("<h1>Data stored in Redis!</h1>");
  } catch (error) {
    res.status(500).send("Error storing data in Redis.");
  }
});

// Route to get data from Redis
app.get("/data", async (req, res) => {
  try {
    const value = await redisClient.get("greeting"); // Get value by key from Redis
    if (value) {
      res.send(`<h1>${value}</h1>`);
    } else {
      res.send("<h1>No data found in Redis.</h1>");
    }
  } catch (error) {
    res.status(500).send("Error retrieving data from Redis.");
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
