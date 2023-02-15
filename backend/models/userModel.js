const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
    },
    email: {
      type: String,
      required: [true, "please add a name"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "please add a password"],
      minLength: [6, "password must be up to 6 characters"],
      // maxLength: [23, "password must not be more than 23 characters"],
    },
    photo: {
      type: String,
      required: [true, "please add a photo"],
      default:
        "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg?size=338&ext=jpg&ga=GA1.1.2003853548.1675917338&semt=sph",
    },
    phone: {
      type: String,
      default: "+91",
    },
    bio: {
      type: String,
      maxLength: [250, "bio must not be more than 250 characters"],
      default: "bio",
    },
  },
  {
    timestamps: true,
  }
);
//Encrypt Password before save to DB
userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    return next()
  }
  //Hash password  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password =hashedPassword;
  next()
}) 
const User = mongoose.model("User", userSchema);
module.exports = User;
