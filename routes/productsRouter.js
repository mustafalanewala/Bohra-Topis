const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function (req, res) {
    try {
        let {
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor, } = req.body;

        if (!req.file) {
            throw new Error("File upload failed. Please ensure an image is uploaded.");
        }

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });

        req.flash("success", "Product created succesfully.");
        res.redirect("/owners/admin");
    }
    catch (err) {
        res.send(err.message);
    }
});

module.exports = router;