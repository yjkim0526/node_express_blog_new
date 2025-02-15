require("dotenv").config();
const express = require('express');
const router = express.Router();
const adminLayout = "../views/layouts/admin.ejs";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;


/**
 *  Admin page
 *  GET /admin
*/
 router.get('/admin', asyncHandler( async (req, res) => {
	const locals = { title: "관리자" };
	const adminRole = await User.findOne( { role: "admin" } );
	if (!adminRole) {
    const locals = { title: "사용자" };
  } else {
		const locals = { title: "관리자" };
	}
	res.render('admin/index', {locals, layout: adminLayout});
 }));

 /**
 *  Admin page
 *  POST /admin
*/
 router.post('/admin', asyncHandler( async (req, res) => {
	const { username, password, role } = req.body;
	const user = await User.findOne( { username });
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
  
	res.send(" passport math ... ");
	// res.redirect("/allPosts");
 }));


/*
 *  Register Admin
 *  POST /register
*/
router.post('/register', asyncHandler( async (req, res) => {
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

}));




module.exports = router;
