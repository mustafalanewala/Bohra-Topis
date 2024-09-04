const express = require('express');
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const { registerUser, loginUser, logout } = require("../controllers/authController");
const { updateProfile } = require('../controllers/userController');
const upload = require('../config/multer-config'); // Adjust the path as needed


router.get("/", function (req, res) {
    res.send("hey");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logout);

router.post('/update-profile', isloggedin, upload.single('picture'), updateProfile);


module.exports = router; 