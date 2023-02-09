const express = require('express');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//Middleware

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())


const PORT = process.env.PORT || 8080;

//Routes
app.get("/", (req,res)=>{
    res.send("Home Page")
})

//Connect to MongoDB and start server
mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
app.listen(PORT, () => {
console.log(`Server running on Port ${PORT} http://localhost:8080/`);
});
})
.catch((err) => {
console.log(err);
});




