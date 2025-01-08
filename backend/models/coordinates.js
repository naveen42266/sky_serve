const mongoose = require('mongoose');

const CoordinatesSchema = new mongoose.Schema({
  measurementId: { type: String, required: true },
  coordinates: { type: [[Number]], required: true }, // Array of [longitude, latitude]
  isClosedShape: { type: Boolean, required: true },
  distance: { type: Number, required: true }, // in kilometers
  area: { type: Number, required: false }, // in square kilometers (optional)
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('coordinates', CoordinatesSchema);
