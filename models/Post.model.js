const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    imageUrl: String,
    quote: String,
    like: false,
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
