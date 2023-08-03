// Importing Thought and User models
const { Thought, User } = require("../models");

// Creating a thought controller object with methods to handle requests
const thoughtController = {
  // Method to retrieve all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err); // Send a 500 error if something goes wrong
      });
  },

  // Method to get a thought by its ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this ID" }); // Send a 404 error if no thought is found
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Method to create a new thought and associate it with a user
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        // Add the thought ID to the user's thoughts array
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this ID" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // Method to update a thought by its ID
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this ID " });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Method to delete a thought by its ID
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(400).json(err));
  },

  // Method to add a reaction to a thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this ID" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // Method to remove a reaction from a thought
  removeReaction({ params }, res) {
    // Log thought and reaction IDs
    console.log(
      `Thought ID: ${params.thoughtId}, Reaction ID: ${params.reactionId}`
    );

    Thought.findOne({ _id: params.thoughtId }).then((thought) => {
      if (!thought) {
        console.log(`No thought found with ID: ${params.thoughtId}`);
        return res
          .status(404)
          .json({ message: "No thought found with this ID" });
      }

      // Check if the reaction exists
      const reactionExists = thought.reactions.some(
        (reaction) => reaction.reactionId.toString() === params.reactionId
      );
      console.log(`Reaction Exists: ${reactionExists}`);

      if (!reactionExists) {
        console.log(`No reaction found with ID: ${params.reactionId}`);
        return res
          .status(404)
          .json({ message: "No reaction found with this ID" });
      }

      // Remove the reaction from the thought
      return Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
        .then((dbThoughtData) => {
          console.log("Reaction Deleted Successfully");
          res.json({ dbThoughtData, message: "Reaction deleted successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    });
  },
};

// Export the thoughtController object
module.exports = thoughtController;
