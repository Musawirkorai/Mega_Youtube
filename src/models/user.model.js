import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  bio: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
}, 
{
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) re;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAcessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {};

export const User = mongoose.model("User", userSchema);
