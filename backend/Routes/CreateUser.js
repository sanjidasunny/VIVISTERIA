const express = require('express')
const router = express.Router()
const User = require('../models/User')
//import { body, matchedData } from 'express-validator';
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = "Helloworldhowareyoumynameis52_ndSymphonyThankyou";
const jwtRefreshSecret = "HelloworldhowareyouWhatisYourNameThankyou";


router.post("/createuser",
    body('email').isEmail(),
    body('name').optional().isLength({ min: 5 }),
    body('password', 'incorrect password').optional().isLength({ min: 6 }),
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }



        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ errors: 'same email' });
            }
            const salt = await bcrypt.genSalt(10);
            const securepassword = await bcrypt.hash(req.body.password, salt);
            await User.create({
                name: req.body.name,
                password: securepassword,
                email: req.body.email,
                location: req.body.location,
                isAdmin: req.body.isAdmin,
                isApproved: req.body.isApproved
            })
            res.json({ success: true });
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    }
)

router.post("/loginuser", async (req, res) => {
    console.log('Login route hit');
    let email = req.body.email;

    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "email address doesn't exist" });
        }
        const passwordCheck = await bcrypt.compare(req.body.password, userData.password);
        if (!passwordCheck) {
            return res.status(400).json({ errors: "wrong password" });
        }
        if (userData.isAdmin !== userData.isApproved) {
            return res.status(400).json({ errors: "not approved" });
        }
        const data = {
            user: {
                id: userData.id,
                isAdmin: userData.isAdmin
            }
        }

        const authToken = jwt.sign(data, jwtSecret, { expiresIn: "30m" });
        const refreshToken = jwt.sign(data, jwtRefreshSecret, { expiresIn: "10d" });


        return res.json({ success: true, authToken: authToken, refreshToken: refreshToken, userID: userData.id, adminStatus: userData.isAdmin });

    } catch (error) {
        console.log(error)
        res.json({ success: false });
    }
})


router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(refreshToken, jwtRefreshSecret);
        const newToken = jwt.sign({ user: verified.user }, jwtSecret, { expiresIn: '30m' });
        res.json({ token: newToken });
    } catch (err) {
        console.error('Invalid or expired refresh token:', err);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});
router.put('/toggleapproval/:id', async (req, res) => {
    try {
        const { isApproved } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;