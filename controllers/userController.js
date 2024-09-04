const User = require('../models/user-model');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullname, contact } = req.body;

        // Handle file upload
        let picture = req.user.picture;
        if (req.file) {
            const file = req.file;
            const base64Image = file.buffer.toString('base64');
            picture = `data:${file.mimetype};base64,${base64Image}`;
        }

        await User.findByIdAndUpdate(userId, { fullname, contact, picture }, { new: true });

        req.flash('success', 'Profile updated successfully!');
        res.redirect('/myaccount');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while updating your profile.');
        res.redirect('/myaccount');
    }
};
