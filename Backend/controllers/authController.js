const User = require("../models/user.model.js");
// const User = require("../models/user.model");

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();

  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      username,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id,
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User Registered Successfully",
        user: loggedInUser,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
    try{
        const {email ,password } = req.body;

    if ( !email || !password ){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }

    const user = await User.findOne({email});

    if (!user){
        return res.status(404).json({
            success : false,
            message : "User does not exist"
        })  
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect){
        return res.status(401).json({
            success : false,
            message : "Password is incorrect"
        })
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict"
    };

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({

        success:true,
        user:loggedInUser,
        message:"Login Successful"
    });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


module.exports = {
    
    registerUser,
    loginUser

}