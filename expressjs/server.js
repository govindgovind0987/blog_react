// ---------------------- Imports ----------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------------- App Setup ----------------------
const app = express();
app.use(express.json());
app.use(cors());

// ---------------------- MongoDB Connection ----------------------
mongoose.connect("mongodb://127.0.0.1:27017/personalBlog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Error:", err));

// ---------------------- Models ----------------------

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  age: Number,
  region: String,
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: String,
  category: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [
    {
      body: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// ---------------------- Middleware ----------------------
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No Token Provided" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

// ---------------------- Routes ----------------------

/**
 * @route POST /api/register
 * @desc Register a new user
 */
app.post("/api/register", async (req, res) => {
  const { name, email, phone, age, region, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone,
      age,
      region,
      password: hashedPassword,
    });

    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route POST /api/login
 * @desc User login
 */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1d" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route POST /api/posts
 * @desc Create new post
 */
app.post("/api/posts", authMiddleware, async (req, res) => {
  try {
    const { title, description, imageUrl, category } = req.body;
    const newPost = await Post.create({
      title,
      description,
      imageUrl,
      category,
      author: req.user.id,
    });
    res.json(newPost);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

/**
 * @route GET /api/posts
 * @desc Get all posts
 */
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get All Posts Error:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

/**
 * @route GET /api/posts/:id
 * @desc Get single post by ID (with comments populated)
 */
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.author", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Get Post Error:", err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

/**
 * @route POST /api/posts/:id/comments
 * @desc Add a comment to a post (authenticated)
 */
app.post("/api/posts/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({ message: 'Comment body is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(req.user.id).select('name');

    const comment = {
      body: body.trim(),
      author: req.user.id,
      name: user?.name || 'Anonymous',
    };

    post.comments.push(comment);
    await post.save();

    // Populate the last comment's author name for response
    const latestComment = post.comments[post.comments.length - 1];

    res.status(201).json({ message: 'Comment added', comment: latestComment });
  } catch (err) {
    console.error('Add Comment Error:', err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

/**
 * @route GET /api/posts/user/:userId
 * @desc Get posts by specific user
 */
app.get("/api/posts/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get User Posts Error:", err);
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
});

/**
 * @route PUT /api/posts/:id
 * @desc Update post by ID (only author can update)
 */
app.put("/api/posts/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, imageUrl, category } = req.body;
    post.title = title;
    post.description = description;
    post.imageUrl = imageUrl;
    post.category = category;

    await post.save();
    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
});

/**
 * @route DELETE /api/posts/:id
 * @desc Delete post by ID (only author can delete)
 */
app.delete("/api/posts/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// ---------------------- Default Route ----------------------
app.get("/", (req, res) => {
  res.send("Welcome to Personal Blog API 🚀");
});

// ---------------------- Server Start ----------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
