const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  times: {
    type: [String],
    default: [],
  },

  role: {
    type: String,
    default: "patient",
  },
});

module.exports = mongoose.model("User", userSchema);
