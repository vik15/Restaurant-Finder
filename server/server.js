require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const restaurants = await db.any("select * from restaurants");

    res.status(200).json({
      data: {
        results: restaurants.length,
        restaurants,
      },
    });
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a Restaurant by ID
app.get("/api/v1/restaurants/:id", async (req, res) => {
  const restaurantId = parseInt(req.params.id);
  try {
    const restaurant = await db.oneOrNone(
      "select * from restaurants where id = $1",
      restaurantId
    );

    if (restaurant) {
      res.status(200).json({
        status: "success",
        data: { restaurant },
      });
      console.log(restaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a Restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  const { name, location, price_range } = req.body;
  try {
    const restaurant = await db.any(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [name, location, price_range]
    );

    res.status(201).json({
      status: "success",
      data: { restaurant: restaurant[0] },
    });
    console.log(restaurant[0]);
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a Restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const { name, location, price_range } = req.body;
  try {
    const restaurant = await db.oneOrNone(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [name, location, price_range, restaurantId]
    );

    if (restaurant) {
      res.status(200).json({
        status: "success",
        data: { restaurant: restaurant[0] },
      });
      console.log(restaurant[0]);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a Restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  const restaurantId = parseInt(req.params.id);
  try {
    await db.none("DELETE FROM restaurants where id = $1", restaurantId);
    res.status(204).json({ status: "success" });
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
