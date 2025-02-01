import mongoose from "mongoose";

const flagSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const commentSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userPicturePath: String,
  location: String,
  comment: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [commentSchema],
    flags: [flagSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;