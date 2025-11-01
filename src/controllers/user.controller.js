import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async(userId) =>{
    try{
        const user= User.findById(userId)
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};

    }catch(error){
        throw new ApiError(500,"Unable to generate tokens")
    }

}

const registerUser=asyncHandler(async(req,res)=>{
     const {fullname,email,username,password}=req.body;
     
     if ([fullname,email,username,password].some((field)=>field?.trim()=="")){
        throw new ApiError(400,"All fields are required");
     };

     const existedUser= await User.findOne({
        $or:[{username}, {email}]
     })
     if(existedUser){
        throw new ApiError(409,"User with username or email already exists")
     }

    const avatarLocalPath= req.files?.avatar[0]?.path
    const coverImageLocalPath= req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) throw new ApiError(500,"Unable to upload avatar image")

    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url||"",
        email,
        username:username.toLowerCase(),
        password
    })
    const createdUser= await User.findById(user._id).select(
        "-password -refreshTokens" 
    )
    if(!createdUser){
        throw new ApiError(500,"Unable to create user")
    }

    return res.status(201).json(
         new ApiResponse(200,createdUser,"User registered successfully")
    )

});


//req body=>data
//username or email login?
//find the user
//password match?
//access and refresh token
//send cookies and response

const loginUser= asyncHandler(async(req,res)=>{
        const{email,username,password}=req.body;
        if(!username || !email) throw new ApiError(400,"Username or email is required")
        
        const user= await User.findOne({
            $or:[{username:username?.toLowerCase()},{email}]})
        
        if(!user) throw new ApiError(404,"User not found")
        
       const isPasswordValid= await user.isPasswordCorrect(password)
       if(!isPasswordValid) throw new ApiError(401,"Invalid password")
       const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

       const loggedInUser=User.findById(user._id).select(" -password -refreshTokens")

       const options={
        httpOnly:true,
        secure:true
       }

       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
        new ApiResponse(200,
            {user: loggedInUser,accessToken},
            "User logged in successfully",
             )
       )
})
     const logoutUser=asyncHandler(async(req,res)=>{
            await User.findByIdAndUpdate(
                req.user._id,
                {
                   $set:{refreshToken:undefined} 
                },
                {
                    new:true
                }
            )
            const options={
            httpOnly:true,
            secure:true
       }
       return res.status(200).clearCookie("accessToken",options)
         .clearCookie("refreshToken",options)
         .json(
            new ApiResponse(200,{},"User logged out successfully")
         )
     })   
     
export {registerUser,
        loginUser,
        logoutUser
};