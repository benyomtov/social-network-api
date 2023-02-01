const { Schema, model } = require("mongoose");
const thoughtSchema = require('./Thought');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (email) {
        return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        );
      },
      message: `${this.email} is not a valid email address!`,
    },
  },
  thoughts: [{ type: Schema.Types.ObjectId, ref: "thought" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
},
{
  toJSON: {
    virtuals: true,
}
},
);

userSchema.virtual('friendCount').get( () => {
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;