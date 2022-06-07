const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],  
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
