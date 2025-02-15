const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const connectDB = asyncHandler( async () => {
	const connect = await mongoose.connect(process.env.MONGDB_URI);
	console.log(`MongoDB Connected: ${connect.connection.host}`);
});

module.exports = connectDB;
