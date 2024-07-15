const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/profile', async (req, res) => {
    try {
        const data = await User.findById(req.body.id);
        if (!data) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json({ profileData: data });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.post('/profile/update', async (req, res) => {
    const { id, name, email, location, oldPassword, newPassword } = req.body;
    try {
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if old password matches


        // Update profile information
        user.name = name;
        user.email = email;
        user.location = location;

        // Update password if new password is provided
        if (newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid credentials. Please try again." });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ profileData: user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
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