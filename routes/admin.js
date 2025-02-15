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
	res.render('admin/index', {locals, layout: adminLayout});
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
