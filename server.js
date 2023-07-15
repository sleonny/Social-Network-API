const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/Social-NetworkDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

const PORT = process.env.PORT || 27017;

const userRoutes = require("./Routes/userRoutes");
const thoughtRoutes = require("./Routes/thoughtRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes, thoughtRoutes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log("Listening on that port ${PORT}!");
  });
});
