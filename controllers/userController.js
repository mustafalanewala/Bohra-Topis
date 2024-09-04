const User = require('../models/user-model'); // Import the user model
const path = require('path');
const fs = require('fs');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming req.user contains the logged-in user's details
        const { fullname, contact } = req.body;

        // Handle file upload
        let picture = req.user.picture; // Default to existing picture
        if (req.file) {
            // Save new picture
            const file = req.file;
            const ext = path.extname(file.originalname);
            const newFilename = `${userId}-${Date.now()}${ext}`;
            const uploadPath = path.join(__dirname, '../public/images', newFilename);

            // Move the file to the upload directory
            fs.renameSync(file.path, uploadPath);
            picture = `/images/${newFilename}`;
        }

        // Update user details
        await User.findByIdAndUpdate(userId, { fullname, contact, picture }, { new: true });

        // Redirect or respond with success
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/myaccount');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while updating your profile.');
        res.redirect('/myaccount');
    }
};
