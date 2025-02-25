const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

/*
*  GET / or /home
*/
router.get(["/","home"], asyncHandler( async (req, res) => {
	const locals = { title: "Home" };
	const data = await Post.find();
	// res.send("Hello, World Blog !");
	res.render("index", {locals, data, layout: mainLayout});
}));

/*
*  GET /about
*/
router.get("/about", asyncHandler( async (req, res) => {
	res.render("about", {layout: mainLayout});
}));

/*
*  블로그 상세보기
*  GET /post/:id 
*/
router.get("/post/:id", asyncHandler( async (req, res) => {
	console.log(`>> post/${req.params.id} ---`);
	const data = await Post.findOne({ _id: req.params.id });
	res.render("post", { data, layout: mainLayout });
}));


module.exports = router;


// Post.insertMany([
// 	{ title: "First Post", content: "1 This is the first post" },
//   { title: "Second Post", content: "2	Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis eum delectus laboriosam consectetur illo nostrum veniam? Consequatur nihil inventore ratione, velit, veritatis est nisi cum earum, obcaecati non totam. Culpa. second post " },
//   { title: "Third Post", content: "3 This is the third post Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis eum delectus laboriosam consectetur illo nostrum veniam? Consequatur nihil inventore ratione, velit, veritatis est nisi cum earum," }
// ]);