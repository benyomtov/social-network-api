const { Thought, User } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {

    //gets all thoughts
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => {
            if (!thoughts) {
            return res.status(404).json({ message: 'No thoughts found' });
            } else {
            console.log(thoughts);
            return res.json(thoughts);
            }
        })
        .catch((err) => {
         console.log(err);
         return res.status(500).json(err);
        });
    },

    //gets one thought by ID
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v')
          .then((thought) => {
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            console.log(thought);
            return res.json(thought);
        })
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //adds thought
    addThought(req, res) {
        Thought.create(req.body)
          .then(thought => {
            User.findOneAndUpdate(
              { username: req.body.username },
              { $push: { thoughts: thought._id }},
              { new: true }
            )
              .then(user => {
                console.log(thought, user);
                res.json({ thought, user });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },

    //updates thought by ID
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
            .then(user => {
                console.log(thought + "was updated!");
                res.json({ thought, user });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },

    //deletes thought by ID
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then(thought => {
        User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: thought._id }},
        { new: true }
        )
        .then(user => {
            console.log(thought + " was deleted!");
            res.json({ message: "Thought deleted!" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },

    //adds reaction by thoughtID
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
              .then(() => {
                console.log(thought + " was added!");
                res.json(thought)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },

    //deletes reaction by thoughtID and reactionID
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
            .then(() => {
                console.log(thought + " was deleted!");
                res.json(thought);
            })
              .catch(err => {
                console.log(err);
                res.status(500).json(err)
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    }

}