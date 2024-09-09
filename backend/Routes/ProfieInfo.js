const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authenticateToken = require('../middleware')
const upload = require('../Middleware/multer')
const { body, validationResult } = require('express-validator');
const cloudinary = require('../utils/cloudinary')

router.post('/profile', async (req, res) => {
    try {
        const data = await User.findById(req.body.id);
        if (!data) {
            return res.status(404).json({ msg: "User not found1" });
        }
        res.json({ success: true, profileData: data });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


router.post('/profile/update', upload.single('image'), // Move the upload middleware first
    [
        body('name', 'Name must be 4 characters long').isLength({ min: 4 }),
        body('newPassword', 'Password must contain a minimum of 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.')
            .if((value, { req }) => req.body.newPassword)
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minNumbers: 1,
                minUppercase: 1,
                minSymbols: 1,
            })
    ], async (req, res) => {
        // onst { userId, name, oldPassword, newPassword } = req.body
        const { id, name, location, oldPassword, newPassword } = req.body;
        if (newPassword && !oldPassword) {
            console.log("password error")
            return res.json({ success: false, msg: "Old password is required to change the password." });
        }
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log(validationErrors.array())
            return res.json({ errorMessage: validationErrors.array() });
        }
        try {
            let user = await User.findById(id);
            if (!user) {
                console.log("User not found")

                return res.status(404).json({ success: false, msg: "User not found" });
            }
            let Picture = null;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                Picture = result.secure_url;
            }


            user.name = name;
            user.location = location;

            // Update password if new password is provided
            if (newPassword) {
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ success: false, msg: "Invalid credentials. Please try again." });
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;
            }
            if (Picture) {
                user.profilePic = Picture;
            }
            await user.save();
            res.json({ success: true, profileData: user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: "Server Error" });
        }
    });



router.post('/displayuser', async (req, res) => {
    try {
        const alluser = await User.find({});
        res.send([alluser])
    } catch (e) {

    }
})
router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: 'Failed to delete user' });
    }
});


module.exports = router;
