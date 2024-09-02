const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

// Middleware to make flash messages available in all views
router.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.isLoggedIn = req.isLoggedIn; // Assuming you have this method to check if the user is logged in
    next();
});

// Home route
router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });  // Set loggedin to false on the login page
});


// Shop route - requires user to be logged in
router.get("/shop", isloggedin, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success , loggedin: true });  // Set loggedin to true for logged-in users
});

router.get("/cart", isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');
    let bill = user.cart.reduce((total, product) => total + product.price - product.discount + 20, 0);
    res.render("cart", { user, bill, loggedin: true });
});

// Add to Cart Route
router.get("/addtocart/:id", isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    let product = await productModel.findById(req.params.id);
    user.cart.push(product);
    await user.save();
    req.flash('success', 'Product added to cart');
    res.redirect("/shop");
});

// Remove from Cart Route
router.post("/removefromcart/:id", isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(product => product._id.toString() !== req.params.id);
    await user.save();
    req.flash('success', 'Product removed from cart');
    res.redirect("/cart");
});

// Logout route
router.get("/logout", isloggedin, function (req, res) {
    // Clear the user's session or token here
    res.clearCookie("token"); // Clear the authentication token
    req.flash("success", "Successfully logged out.");
    res.redirect("/"); // Redirect to the homepage or login page
});

module.exports = router;
