const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  img: { type: String },
  date: { type: Date, default: Date.now },
  tags: [{ type: String }],
});
module.exports = mongoose.model("Blog", BlogSchema);
