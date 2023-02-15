const express = require('express');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routers/userRoute")
const errorHandler = require("./middleWare/errorMiddleware")
const cookieParser = require("cookie-parser")

const app = express();

//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 8080;

//Routes Middleware
app.use("/api/users", userRoute);
//Routes
app.get("/", (req,res)=>{
    res.send("Home Page")
})
//Error Middleware
app.use(errorHandler)
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




