const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transmitter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
});

module.exports = model("Message", MessageSchema);
