const express = require('express')
const router = express.Router()
const User = require('../models/User')
//import { body, matchedData } from 'express-validator';
const { body, validationResult } = require('express-validator');

router.post("/createuser",
    body('email').isEmail(),
    body('name').optional().isLength({ min: 6 }),
    body('password', 'incorrect password').optional().isLength({ min: 6 }),
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }


        try {
            await User.create({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                location: req.body.location
            })
            res.json({ success: true });
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

router.post("/loginuser", async (req, res) => {

    let email = req.body.email;

    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "email address doesn't exist" });
        }
        if (req.body.password !== userData.password) {
            return res.status(400).json({ errors: "wrong password" });
        }
        return res.json({ success: true });

    } catch (error) {
        console.log(error)
        res.json({ success: false });
    }
})



module.exports = router;