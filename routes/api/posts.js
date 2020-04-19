const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route    Post api/posts
//@desc     Create a post
//@access   Private because you have to be logged in to create a post
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text, //come from the body
        name: user.name, //come from user
        avatar: user.avatar, //come from user
        user: req.user.id // //come from user we need the ObjectID
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    Get api/posts
//@desc     Get all posts
//@access   Private //its private but if we want we can change a post to a public
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //the most recent first if we want the old first so {date: 1}
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    Get api/posts/:id
//@desc     Get post by ID
//@access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" }); //404-not found
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" }); //404-not found
    }

    res.status(500).send("Server Error");
  }
});

//@route    Delete api/posts/:id
//@desc     Delete post by ID
//@access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //the most recent first if we want the old first so {date: 1}
    //if post doesnt exsist
    if (!post) {
      return res.status(404).json({ msg: "Post not found" }); //404-not found
    }

    //Check if the user own the post - just he can delete the post
    //post.user is objectid and req.user.id is a string so  will do .toString for mathing
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" }); // 401-not authorized
    }
    //if authorized
    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" }); //404-not found
    }

    res.status(500).send("Server Error");
  }
});

module.exports = router;

//Get - all posts
//http://localhost:5000/api/posts
//need token for take all posts ..so we take the dori token we could take anyoune that have token login
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ

//Get - get post by id
//http://localhost:5000/api/posts/${id}
//http://localhost:5000/api/posts/5e9c22f3f78ef0551006bb164  dori post
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ

//Add post
//http://localhost:5000/api/posts
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4NzI5MDU0NSwiZXhwIjoxNTg3NjUwNTQ1fQ.gBJqnFZjYTlOFzww6pv1af3lQx4SpWFJ97KViFxXvms
//Content-Type - application/json
//body
// {
// 	"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
// }

//Delete post by id
//http://localhost:5000/api/posts/${id}
//http://localhost:5000/api/posts/5e9c30bfb64a2350843701ce
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ
