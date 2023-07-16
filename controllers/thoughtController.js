const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this ID" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
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
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(400).json(err));
  },
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
  removeReaction({ params }, res) {
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

module.exports = thoughtController;
