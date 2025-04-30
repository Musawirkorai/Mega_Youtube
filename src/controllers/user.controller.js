import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //     message:"ok tech"
  // })
  //Get user details from the frontend
  // validation of the data - not empty
  // chek the image uploaded
  // upload the image to the cloudinary
  // check if the user already exists in the database
  // create a user object and create the entryt in the db
  // remove token and password for response
  // chek the user created successfully
  // send the response to the frontend
  const { fullname, email, username, password } = req.body;
  console.log("my email", email);
  if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409 , "User already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath || !coverImageLocalPath){
    throw new ApiError(400 , "Please upload the images");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar || !coverImage){
    throw new ApiError(500 , "Image upload failed");
  }

  const user = await User.create({
    fullanem,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),

  })

 const createdUser= await User.findById(user._id).select("-password -refreshToken")
 if(!createdUser){
    throw new ApiError(500 , "User creation failed")
 }

 return res.status(201).json(new ApiResponse(201 , createdUser , "User created successfully"))


});

export { registerUser,};
