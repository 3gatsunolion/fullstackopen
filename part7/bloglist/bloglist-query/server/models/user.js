const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true, // this ensures the uniqueness of username
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
    minlength: 3,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId, // ObjectId -> means it refers to another document
      ref: "Blog",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;

    if (returnedObject.blogs) {
      // Not populated
      if (
        returnedObject.blogs.length > 0 &&
        returnedObject.blogs[0] instanceof ObjectId
      ) {
        returnedObject.blogs = returnedObject.blogs.map((b) => b.toString());
      }
    }
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
