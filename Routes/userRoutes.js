const router = require("express").Router();
const {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../controllers/userController");
