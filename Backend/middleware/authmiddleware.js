const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJWT = async (req, res, next) => {
    try {

        // 1. Get Access Token
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        // 2. Check if Token Exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Request"
            });
        }

        // 3. Verify Token
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // 4. Find User
        const user = await User.findById(decodedToken.id)
            .select("-password -refreshToken");

        // 5. Check if User Exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token"
            });
        }

        // 6. Attach User to Request
        req.user = user;

        // 7. Move to Next Middleware / Controller
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message || "Invalid Access Token"
        });

    }
};

module.exports = verifyJWT;