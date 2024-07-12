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
    body('name').optional().isLength({ min: 6 }),
    body('password', 'incorrect password').optional().isLength({ min: 6 }),
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const salt = await bcrypt.genSalt(10);
        const securepassword = await bcrypt.hash(req.body.password, salt);

        try {
            await User.create({
                name: req.body.name,
                password: securepassword,
                email: req.body.email,
                location: req.body.location,
                isAdmin: req.body.isAdmin
            })
            res.json({ success: true });
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

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
        const data = {
            user: {
                id: userData.id,
                isAdmin: userData.isAdmin
            }
        }
        console.log('Creating token with expiration time of 1 minute');
        const authToken = jwt.sign(data, jwtSecret, { expiresIn: "30m" });
        const refreshToken = jwt.sign(data, jwtRefreshSecret, { expiresIn: "10d" });
        console.log('Generated token:', authToken);

        const decodedToken = jwt.decode(authToken);
        console.log('Token expiration time:', new Date(decodedToken.exp * 1000));
        return res.json({ success: true, authToken: authToken, userID: userData.id, adminStatus: userData.isAdmin });

    } catch (error) {
        console.log(error)
        res.json({ success: false });
    }
})



module.exports = router;