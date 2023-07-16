const express = require("express");
const db = require("./config/connection");
const userRoutes = require("./Routes/userRoutes");
const thoughtRoutes = require("./Routes/thoughtRoutes");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(userRoutes, thoughtRoutes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`That server is running on port ${PORT}!`);
  });
});
