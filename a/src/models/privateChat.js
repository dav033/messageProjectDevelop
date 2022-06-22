const { Schema, model } = require("mongoose");
const User = require("./user");

const privateChatSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
  ],
});

module.exports = model("privateChat", privateChatSchema);
