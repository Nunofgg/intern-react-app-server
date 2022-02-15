const router = require("express").Router();

const mongoose = require("mongoose");

const Post = require("../models/Post.model");
const User = require("../models/User.model");

router.get("/posts", async (req, res) => {
    const userPosts = await User.findById(req.user._id).populate("posts");
    res.json(userPosts);
});


router.post("/post", async (req, res) => {
    const { imageUrl, quote, like } = req.body;
    try {
        const response = await Post.create({user: req.user, imageUrl, quote, like});
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
              posts: response,
            },
        });
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
})

module.exports = router;