const User = require("../models/userModel");
const registerUser= async(req,res)=>{
    res.send("Register user")
}
module.exports = {
    registerUser,
}