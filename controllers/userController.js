const { User, Thought } = require("../models");

module.exports = {
  
  //gets all users
  getUsers(req, res) {
    User.find({})
      .then((users) => {
        console.log(users);
        res.json(users);
      })
      .catch((err) => res.status(500).json(err));
  },

  //gets one user based on ID
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
        } else {
          console.log(user);
          res.json(user);
        }
      })
      .catch((err) => { 
        console.log(err);
        res.status(500).json(err);
      });
  },

  //adds a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => {
        console.log(user);
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  //updates user by ID
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user with that ID" });
        } else {
          console.log(user);
          res.json(user);
        }
      })
      .catch((err) => res.status(500).json(err));
  },

  //deletes User
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  //adds friend by userIDs of user and friend
  addFriend(req, res) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with that ID" });
        }

        let friend;
        User.findById(req.params.friendId)
          .then((foundFriend) => {
            if (!foundFriend) {
              return res
                .status(404)
                .json({ message: "No friend with that ID" });
            }

            friend = foundFriend;
            user.friends.push(friend._id);
            return user.save();
          })
          .then(() => {
            console.log(`${friend.username} added to ${user.username}'s friend list!`);

            res.json({
              message: `${friend.username} added to ${user.username}'s friend list!`,
            });
          })
          .catch((err) => { 
            console.log(err);
            res.status(500).json(err);
          });
      })
      .catch((err) => { 
        console.log(err);
        res.status(500).json(err);
      });
  },

  //deletes friend by userID and friendID
  deleteFriend(req, res) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with that ID" });
        }

        let friend;
        User.findById(req.params.friendId)
          .then((foundFriend) => {
            if (!foundFriend) {
              return res
                .status(404)
                .json({ message: "No friend with that ID" });
            }

            friend = foundFriend;
            user.friends = user.friends.filter(
              (friendId) => friendId.toString() !== req.params.friendId
            );
            return user.save();
          })
          .then(() => {
            console.log(`${friend.username} has been removed from ${user.username}'s friend list!`);

            res.json({
              message: `${friend.username} has been removed from ${user.username}'s friend list!`,
            })
          })
          .catch((err) => { 
            console.log(err);
            res.status(500).json(err);
          });
      })
      .catch((err) => { 
        console.log(err);
        res.status(500).json(err);
      });
  },
};
