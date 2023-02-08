const express = require('express');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;

//Connect to MongoDB and start server
mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
app.listen(PORT, () => {
console.log(`Server running on Port ${PORT}`);
});
})
.catch((err) => {
console.log(err);
});




