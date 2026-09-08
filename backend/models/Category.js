const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: [{
    url: { type: String },
    publicId: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
