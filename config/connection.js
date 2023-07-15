const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.127017/Social-NetworkDB"
);

module.exports = mongoose.connection;
