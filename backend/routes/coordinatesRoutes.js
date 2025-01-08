const express = require("express");
const { getDatabase } = require("../db"); // Assuming you have a helper for DB connection
const { COLLECTION_NAME } = require("../config"); // Collection name for storing coordinates
const { authenticateToken, extractUserFromToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Middleware to get userId from request (assuming it's in req.user from authentication middleware)
const getUserId = (req) => req.userId; // Modify this depending on your authentication setup

// POST: Save a new coordinate
router.post("/addCoordinate", authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);

    // console.log(userId);

    if (!userId) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    const { coordinates, measurementId, distance, area } = req.body;

    // Check if coordinates array is provided and has at least two points
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({ error: "Coordinates array must contain at least two coordinates" });
    }

    const database = getDatabase();
    const coordinatesCollection = database.collection(COLLECTION_NAME);

    const coordinate = {
      measurementId,
      coordinates,
      distance,
      area,
      userId: userId,
      createdAt: new Date(),
    };

    // console.log(coordinate)

    const result = await coordinatesCollection.insertOne(coordinate);
    res.status(201).json({
      success: true,
      message: "Coordinate saved successfully",
      data: {
        coordinates, measurementId, distance, area
      }, // The inserted coordinate data
    });
  } catch (error) {
    console.error("Error saving coordinates:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// GET: Fetch all coordinates for a user
router.get("/getAll", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId query parameter is required",
    });
  }

  try {
    const database = getDatabase();
    const coordinatesCollection = database.collection(COLLECTION_NAME);

    // Convert userId to a number
    const numericUserId = parseInt(userId, 10);

    if (isNaN(numericUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId. Must be a valid number.",
      });
    }

    // Query using the numeric userId
    const coordinates = await coordinatesCollection.find({ userId: numericUserId }).toArray();
    console.log("Query result:", coordinates);

    res.status(200).json({
      success: true,
      message: "Coordinates fetched successfully",
      data: coordinates,
    });
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});



// GET: Fetch a specific coordinate by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const database = getDatabase();
    const coordinatesCollection = database.collection(COLLECTION_NAME);

    const coordinate = await coordinatesCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!coordinate) {
      return res.status(404).json({ success: false, message: "Coordinates not found" });
    }
    res.status(200).json({
      success: true,
      data: coordinate,
    });
  } catch (error) {
    console.error("Error fetching coordinate:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT: Update a coordinate by ID
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    const database = getDatabase();
    const coordinatesCollection = database.collection(COLLECTION_NAME);

    const updatedCoordinate = await coordinatesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...req.body, // Update the coordinate with the new data from the request body
          updatedBy: userId,
          updatedAt: new Date(),
        }
      },
      { returnDocument: "after" }
    );

    if (!updatedCoordinate.value) {
      return res.status(404).json({ success: false, message: "Coordinates not found" });
    }
    res.status(200).json({
      success: true,
      message: "Coordinate updated successfully",
      data: updatedCoordinate.value,
    });
  } catch (error) {
    console.error("Error updating coordinate:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE: Delete a coordinate by ID
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Get the id from req.params
    const userId = getUserId(req);

    if (!userId) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    const database = getDatabase();
    const coordinatesCollection = database.collection(COLLECTION_NAME);

    const result = await coordinatesCollection.deleteOne({ measurementId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Coordinate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Coordinate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting coordinate:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
