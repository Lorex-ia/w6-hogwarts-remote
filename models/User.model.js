const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    house: {
      type: String,
      required: false,
    },
    wand: { // updated the model with the wand
      type: String, // we will show just the name of the wand
      required: false,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
