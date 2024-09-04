const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owners-model");

// Render the owner login form
router.get("/owner-login", function (req, res) {
    res.render("owner-login");
});

// Handle owner login form submission
router.post("/owner-login", async function (req, res) {
    const { email, password } = req.body;

    // Find the owner/admin by email
    const owner = await ownerModel.findOne({ email });

    if (!owner || owner.password !== password) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/owner-login");
    }

    // If credentials are correct, redirect to /createproducts
    req.flash("success", "Welcome Admin");
    return res.redirect("/admin");
});

// Route to create a new owner/admin
router.post("/create", async function (req, res) {
    // Check if an owner/admin already exists
    let owners = await ownerModel.find();
    if (owners.length > 0) {
        return res.status(503).send("You don't have permission to create a new owner");
    }

    // Extract details from request body
    let { fullname, email, password } = req.body;

    // Create a new owner/admin
    let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
    });

    // Send response
    res.status(201).send(createdOwner);
});

module.exports = router;
