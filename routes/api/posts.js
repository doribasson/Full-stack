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

//@route    Put api/posts/like/:id  //because we updateing a post
//@desc     Like a post
//@access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id }); //that user that like that

    await post.save();

    res.json(post.likes); //the _id: is the actully like  user:the user that liked that
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    Put api/posts/unlike/:id  //because we updateing a post
//@desc     Unlike a post
//@access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yes been liked" });
    }

    //Get remove index for delete the like //currect like to remove
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes); //the _id: is the actully like  user:the user that liked that
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    Post api/posts/comment/:id
//@desc     Comment om a post
//@access   Private
router.post(
  "/comment/:id",
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
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text, //come from the body
        name: user.name, //come from user
        avatar: user.avatar, //come from user
        user: req.user.id // //come from user we need the ObjectID
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    Delete api/posts/comment/:id/:comment_id   //:id -because we need to find the post by id , :comment_id  - and we need to know witch comment to delete
//@desc     Delete comment om
//@access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    //Check user
    if (comment.user.toString() !== req.user.id) {
      //req.user.id - the login user ,  comment.user - the ObjectId user and we want be string for check !==
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Get remove index for delete the like //currect comment to remove
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments); //the _id: is the actully like  user:the user that liked that
  } catch (err) {
    console.error(err.message);
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

//Put - Give a like  - because we change the post.. the like inside the post
//http://localhost:5000/api/posts/like/${id-for-want-to-liked}
//http://localhost:5000/api/posts/like/5e9c24baf78ef0551006bb17
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ

//Put -Unlike a post  - because we change the post.. the like inside the post
//http://localhost:5000/api/posts/unlike/${id-for-want-to-liked}
//http://localhost:5000/api/posts/unlike/5e9c24baf78ef0551006bb17
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ

//Post - add Comment
//http://localhost:5000/api/posts/comment/5e9c22f3f78ef0551006bb16
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ
//Content-Type - application/json
//body
// {
// 	"text": "Ty, great post!"
// }

//Delete comment from Comment-array in posts
//http://localhost:5000/api/posts/comment/5e9c22f3f78ef0551006bb16/5e9c65961d2f6947d4f42375
//http://localhost:5000/api/posts/comment/${id-post}/{id-comment-delete}
//x-auth-token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU5NzZmMWRhMzY1MjYxNzA4MjQwZDllIn0sImlhdCI6MTU4Njk4Nzc4MSwiZXhwIjoxNTg3MzQ3NzgxfQ.KAbfHndcNUbb6j-O9TLyYChQUhBCdD-dal-NtO9s_qQ
