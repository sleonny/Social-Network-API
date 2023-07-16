const express = require("express");
const mongoose = require("mongoose");

const app = express();

const db = mongoose.connection;

const PORT = process.env.PORT || 3000;

const userRoutes = require("./Routes/userRoutes");
const thoughtRoutes = require("./Routes/thoughtRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes, thoughtRoutes);

const User = require("./models/User"); // assuming you have a User model defined

const sampleUser = new User({
  username: "Sample User",
  email: "sampleuser@test.com",
  // other fields according to your schema
});

sampleUser
  .save()
  .then((doc) => {
    console.log("User saved successfully", doc);
  })
  .catch((err) => {
    console.log("Error occurred while saving user", err);
  });

db.once("open", () => {
  app.listen(PORT, () => {
    console.log("Listening on that port ${PORT}!");
  });
});
