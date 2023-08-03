// Importing User and Thought models
const { User, Thought } = require("../models");

// Creating a user controller object with methods to handle user-related requests
const userController = {
  // Method to get all users, including their thoughts and friends
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v", // Exclude the __v field
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err); // Send a 500 error if something goes wrong
      });
  },

  // Method to get a user by their ID, including their thoughts and friends
  getUserByID({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
      });
  },

  // Method to create a new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err)); // Send a 400 error if the request is malformed
  },

  // Method to update a user by their ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true, // Validate the new data according to the schema
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user exists w/ this ID" }); // Send a 404 error if no user is found
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Method to delete a user by their ID
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user exists w/ this ID" }); // Send a 404 error if no user is found
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Method to add a friend to a user's friends list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } }, // Add the friend's ID to the friends array
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user exists w/ this ID" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // Method to remove a friend from a user's friends list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } }, // Remove the friend's ID from the friends array
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

// Export the userController object
module.exports = userController;
