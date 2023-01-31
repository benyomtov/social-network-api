const { ObjectId } = require("bson");
const { Schema, model } = require("mongoose");

const reactionSchema = new Schema({
    reactionId: {
      type: ObjectId,
      default: new mongoose.Types.ObjectId
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAt => createdAt.toLocaleString()
    }
});

module.exports = reactionSchema;