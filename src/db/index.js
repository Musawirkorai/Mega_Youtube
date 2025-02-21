import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config({
  path: "../env",
});

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\nConnected to MongoDB !! DB HOST: `);
  } catch (error) {
    console.log("MongoDB Connection ich issue hai", error);
    process.exit(1);
  }
};

export default connectDB;
