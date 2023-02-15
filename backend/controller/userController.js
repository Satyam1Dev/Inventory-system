const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const generateToken=(id) => { 

  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
 }
// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please Fill in all required Field");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("password must be upto 6 character");
  }
  // check if user email already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("Email has already been registered");
  }
 
  //Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

 //GenerateToken
 const token = generateToken(user._id)
 //send HTTP-only cookie
 res.cookie("token",token,{
  path:"/",
  httpOnly:true,
  expires:new Date(Date.now()+1000*86400),//1day
  sameSite:"none",
  secure:true
 });
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

// Login User
const loginUser = asyncHandler(async(req,res) => { 

  const {email,password} = req.body
//validate Request
if(!email||!password){
  res.status(400);
  throw new Error("please add email and password")
}

//check if user exists
const user = await User.findOne({email})
if(!user){
  res.status(400);
  throw new Error("user not found please signup")
}



//user exist check if password is correct
const passwordIsCorrect = await bcrypt.compare(password,user.password)

//GenerateToken
const token = generateToken(user._id)
//send HTTP-only cookie
res.cookie("token",token,{
 path:"/",
 httpOnly:true,
 expires:new Date(Date.now()+1000*86400),//1day
 sameSite:"none",
 secure:true
});

if(user && passwordIsCorrect ){
  const { _id, name, email, photo, phone, bio } = user;
  res.status(200).json({
    _id,
    name,
    email,
    photo,
    phone,
    bio,
    token,
  });
}else{
  res.status(400);
  throw new Error("Invalid email or password")
}

})
module.exports = {
  registerUser,
  loginUser
};


