const express = require("express");
const {getCurrentUser} = require("../controllers/userController");
const verifyJWT = require("../middleware/authmiddleware");

const router = express.Router();
router.get("/current", verifyJWT , getCurrentUser);

module.exports = router;