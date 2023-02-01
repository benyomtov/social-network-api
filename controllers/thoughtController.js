const { Thought, User } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => {
            if (!thoughts) {
            return res.status(404).json({ message: 'No thoughts found' });
            } else {
            return res.json(thoughts);
            }
        })
        .catch((err) => {
         console.log(err);
         return res.status(500).json(err);
        });
    },

    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v')
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              : res.json(thought)
          )
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    addThought(req, res) {
        Thought.create(req.body)
          .then(thought => {
            User.findOneAndUpdate(
              { username: req.body.username },
              { $push: { thoughts: thought._id }},
              { new: true }
            )
              .then(user => res.json({ thought, user }))
              .catch(err => res.status(500).json(err))
          })
          .catch(err => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            req.body,
            { new: true }
            )
          .then(thought => {
            User.findOneAndUpdate(
              { username: req.body.username },
              { $push: { thoughts: thought._id }},
              { new: true }
            )
              .then(user => res.json({ thought, user }))
              .catch(err => res.status(500).json(err))
          })
          .catch(err => res.status(500).json(err));
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then(thought => {
        User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: thought._id }},
        { new: true }
        )
        .then(user => res.json({ thought, user }))
        .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err));
    },

    addReaction(req, res) {
        Thought.findById(req.params.thoughtId)
          .then((thought) => {
            if (!thought) {
              return res.status(404).json({ message: "No thought with that ID" });
            }
    
            const newReaction = {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            };
    
            thought.reactions.push(newReaction);
            thought.save()
              .then(() => res.json(thought))
              .catch(err => res.status(500).json({ message: "Error saving reaction" }));
          })
          .catch(err => res.status(500).json({ message: "Error finding thought" }));
    },

    deleteReaction(req, res) {
        Thought.findById(req.params.thoughtId)
          .then((thought) => {
            if (!thought) {
              return res.status(404).json({ message: "No thought with that ID" });
            }
    
            const reactionIndex = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === req.params.reactionId);
            if (reactionIndex === -1) {
              return res.status(404).json({ message: "No reaction with that ID" });
            }
    
            thought.reactions.splice(reactionIndex, 1);
            thought.save()
              .then(() => res.json(thought))
              .catch(err => res.status(500).json({ message: "Error deleting reaction" }));
          })
          .catch(err => res.status(500).json({ message: "Error finding thought" }));
    }

}