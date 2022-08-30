// require mongoose
const mongoose = require("mongoose");
// set up schema
const ReviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "You must provide a comment."],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
		// here is our new user connection
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// use schema in model
const User_post = mongoose.model("User_post", ReviewSchema);
// export out model
module.exports = User_post;