const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { use } = require("../routers/userRoute");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

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
  const token = generateToken(user._id);
  //send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1day
    sameSite: "none",
    secure: true,
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
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("please add email and password");
  }

  //check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("user not found please signup");
  }

  //user exist check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //GenerateToken
  const token = generateToken(user._id);

  //send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
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
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//Logout User
const logout = asyncHandler(async (req, res) => {
  // res.send("Logout User");
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //1day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({message:"Successfully Log Out"})
});

//get user Data
const getUser = asyncHandler(async(req,res) => { 

  const user = await User.findById(req.user._id)
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,      
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }

})

//Get Login Status
const loginStatus = asyncHandler(async (req,res) => {
  const token =req.cookies.token;
  if(!token){
    return res.json(false)
  }
  //Verify Token
  const verified = jwt.verify(token,process.env.JWT_SECRET)
  if(verified){
    return res.json(true)
  }
  return res.json(false)
});

// Update User
const updateUser = asyncHandler(async (req,res) => {
const user = await User.findById(req.user._id)

if(user){
  const { name, email, photo, phone, bio } = user;
  user.email =email,
  user.name = req.body.name ||name,
  user.phone = req.body.phone ||phone,
  user.bio = req.body.bio ||bio,
  user.photo = req.body.photo ||photo;

  const updateUser = await user.save()
  res.status(200).json({
    _id: updateUser.id,
    name:updateUser.name,
    email: updateUser.id,
    photo:updateUser.photo,
    phone:updateUser.phone,
    bio:updateUser.bio,
  })
}else{
  res.status(404)
  throw new Error("user Not found")
}
});

//Change password

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const { oldPassword, password } = req.body;
  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  //Validate
  if ((!oldPassword) || !password) {
    res.status(400);
    throw new Error("Please add Old Password or New Password");
  }

  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successfully");
  } else {
    res.status(400);
    throw new Error("Old Password is Incorrect");
  }
});


module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
};
