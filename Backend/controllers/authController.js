const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
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

const logoutUser = async (req,res) => {
  try {
      await User.findOneAndUpdate(
        req.user.id,
        {
           $unset: {
                    refreshToken: 1
                }
        },
        {
            new: true
        }
      );
      
       const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "User logged out successfully"
            });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const refreshAccessToken = async (req, res) => {
  try {
     const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Request"
            });
        }
        // 2. Verify Refresh Token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // 3. Find User
        const user = await User.findById(decodedToken.id);
         if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Refresh Token"
            });
        }
        // 4. Compare Refresh Token with Database
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh Token is Expired or Used"
            });
        }

        // 5. Generate New Tokens
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        // 6. Cookie Options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

         return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Access Token Refreshed Successfully",
                accessToken
            });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message || "Invalid Refresh Token"
        });

    }
};
module.exports = {
    
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}