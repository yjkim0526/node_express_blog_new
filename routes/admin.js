require("dotenv").config();
const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin.ejs";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

/**
 *  Admin page
 *  GET /admin
 */
router.get(
  "/admin",
  asyncHandler(async (req, res) => {
    const locals = { title: "관리자" };
    const adminRole = await User.findOne({ role: "admin" });
    if (!adminRole) {
      const locals = { title: "사용자" };
    } else {
      const locals = { title: "관리자" };
    }
    res.render("admin/index", { locals, layout: adminLayout });
  })
);

/**
 *  Admin page
 *  POST /admin
 */
router.post(
  "/admin",
  asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "일치하는 사용자가 없습니다. " });
    }

    // Compare hashed password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // Generate a JSON Web Token
    const token = jwt.sign({ id: user._id }, jwtSecret);

    // Set the token as a cookie and redirect to the admin page
    res.cookie("token", token, { httpOnly: true });

    // res.send(" passport math ... ");
    res.redirect("/list");
  })
);

/*
 *  Register Admin
 *  POST /register
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 ID입니다." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    // res.status(201).json({ message: "관리자 등록 성공!" });
    res.json(`user created: ${user}`);
  })
);

/*
 *  All post list
 *  GET /list
 */
router.get(
  "/list",
  asyncHandler(async (req, res) => {
    const locals = { title: "admin list" };
    const data = await Post.find();

    res.render("admin/list", { locals, data, layout: adminLayout });
  })
);

/*
 *  블로그 추가하기
 *  GET /new
 */
router.get(
  "/new",
  asyncHandler(async (req, res) => {
    console.log(`>> new ---`);
    const locals = { title: "new" };

    res.render("admin/new", { locals, layout: adminLayout });
    // res.send(`edit/${req.params.id} ---`);
  })
);

/*
 *  블로그 추가하기
 *  POST /new
 */
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    console.log(`>> new ---`);
    const locals = { title: "new" };
    console.log(req.body);
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용을 입력하세요." });
    }
    const post = await Post.create({ title, content });
    res.redirect("/list");
  })
);

/*
 *  블로그 수정하기
 *  GET /edit/:id
 */
router.get(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    console.log(`>> edit/${req.params.id} ---`);
    const locals = { title: "edit" };
    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit", { locals, data, layout: adminLayout });
    // res.send(`edit/${req.params.id} ---`);
  })
);

/*
 * admin 게시물 수정 / 게시물 삭제
 * POST /edit/:id
 */

router.post(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    const mode = req.body.mode;
    console.log(">> mode:", mode);
    const sel_id = req.body.id;
    console.log(">>sel_id:", sel_id);

    if (mode === "del") {
      console.log("del mode");
      await Post.findByIdAndDelete(sel_id);
      // res.send("success delete");
    } else {
      console.log("edit mode");
      const { title, content } = req.body;
      const post = await Post.findById(sel_id);
      if (!post) {
        throw new Error("Post not found.");
      }
      post.title = title;
      post.content = content;
      post.save();
      // res.send("success Edit");
    }
    res.redirect("/list");
  })
);

/*
 *  Admin logout
 *  GET /logout
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
