const router = require("express").Router();

const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");


const Post = require("../models/Post.model");
const User = require("../models/User.model");


// Gets the list of posts from the user
router.get("/posts", isLoggedIn, async (req, res) => {
    const currentUser = req.session.user;
    try{
            const userPosts = await User.findById(currentUser._id).populate("posts");
            console.log("USER POSTS:", userPosts);
            res.status(200).json(userPosts);
    } catch(e){
        res.status(500).json({message: e.message});
    }
});


// Create a new post for the user
router.post("/post", isLoggedIn, async (req, res) => {
    const { imageUrl, quote, like } = req.body;
    try {
        const response = await Post.create({user: req.user, imageUrl, quote, like});
        await User.findByIdAndUpdate(req.session.user._id, {
            $push: {
              posts: response,
            },
        });
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});


// Edit the user post you want
router.put("/post/:id", isLoggedIn, async (req, res) => {
    const { imageUrl, quote, like } = req.body;
    const postId = req.params.id;
    try {
        const response = await Post.findById(postId);
        await Post.findByIdAndUpdate(postId, {
            imageUrl,
            quote,
            like
        }, {new: true});
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});


// Delete the user post
router.delete("/post/:id", isLoggedIn, async (req, res) => {
    const postId = req.params.id;
    try {
        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: `Item with id ${postId} was deleted.`});
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

module.exports = router;