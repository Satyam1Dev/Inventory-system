const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, changePassword } = require("../controller/userController");
const protect = require("../middleWare/authmiddleware");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/updateuser",protect,  updateUser);
router.patch("/changepassword",protect,changePassword)






module.exports = router;
