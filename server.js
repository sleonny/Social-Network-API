const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 27017;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
