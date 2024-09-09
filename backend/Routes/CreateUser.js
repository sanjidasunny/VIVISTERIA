const express = require('express')
const router = express.Router()
const User = require('../models/User')
//import { body, matchedData } from 'express-validator';
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require('../models/TokenModel');
const jwtSecret = "Helloworldhowareyoumynameis52_ndSymphonyThankyou";
const jwtRefreshSecret = "HelloworldhowareyouWhatisYourNameThankyou";
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail')

router.post("/createuser",
    body('email', 'Invalid Email address').isEmail(),
    body('name', 'Name must be 4 charecters long').isLength({ min: 4 }),
    body('password', 'Password must contain minimum of 8 letters, including 1 uppuercase, 1 lowercase, 1 number and 1 spacial symbol.').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
    }),
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.json({ errorMessage: result.array() });
        }



        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.json({ error: 'same email' });
            }
            const salt = await bcrypt.genSalt(10);
            const securepassword = await bcrypt.hash(req.body.password, salt);
            user = await new User({
                name: req.body.name,
                password: securepassword,
                email: req.body.email,
                location: req.body.location,
                isAdmin: req.body.isAdmin,
                isApproved: req.body.isApproved,
                profilePic: "",
                isVerified: false
            })

            const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save()
            const url = `https://vivisteria-2lrx.vercel.app/api/${user._id}/verify/${token.token}`
            await sendEmail(user.email, "Verify Email", url)
            user.save()
            res.json({ success: true, message: "An Email has been send to your account. Please verify." });
        } catch (error) {
            console.error(error);
            res.json({ success: false, error: error.message });
        }
    }
)

router.post("/loginuser", async (req, res) => {
    let email = req.body.email;

    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(200).json({ error: "User is not registered" });
        }
        const passwordCheck = await bcrypt.compare(req.body.password, userData.password);
        if (!passwordCheck) {
            return res.status(200).json({ error: "Incorrect Password" });
        }
        if (userData.isAdmin !== userData.isApproved) {
            return res.status(200).json({ error: "Not appreved As an admin. Contact other admins." });
        }

        if (!userData.isVerified) {
            // console.log("user is not verified")
            let token = await Token.findOne({ userId: userData._id })
            if (!token) {
                token = await new Token({
                    userId: userData._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save()
                const url = `https://vivisteria-2lrx.vercel.app/api/${userData._id}/verify/${token.token}`
                await sendEmail(userData.email, "Verify Email", url)


            }
            return res.status(200).json({ message: "An Email has been send to your account. Please verify." })
        }

        const data = {
            user: {
                id: userData.id,
                isAdmin: userData.isAdmin
            }
        }

        const authToken = jwt.sign(data, jwtSecret, { expiresIn: "30m" });
        const refreshToken = jwt.sign(data, jwtRefreshSecret, { expiresIn: "10d" });


        return res.json({ success: true, authToken: authToken, refreshToken: refreshToken, userID: userData.id, adminStatus: userData.isAdmin, profilePic: userData.profilePic });

    } catch (error) {
        console.log(error)
        res.json({ success: false });
    }
})


router.post('/google/login', async (req, res) => {
    const { name, email, profilePic, isAdmin } = req.body
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            user = await new User({
                name: name,
                email: email,
                password: "",
                profilePic: profilePic,
                isVerified: true,
                location: "",
                isAdmin: isAdmin,
                isApproved: false,

            })
        }
        const data = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin
            }
        }
        const authToken = jwt.sign(data, jwtSecret, { expiresIn: "30m" });
        const refreshToken = jwt.sign(data, jwtRefreshSecret, { expiresIn: "10d" });
        user.save()
        if (user.isAdmin !== user.isApproved) {
            if (user.isAdmin) {
                console.log("admin")
            }
            if (user.isApproved) {
                console.log("isApproved")
            } else {
                console.log("not proved")
            }


            return res.json({ error: "Not appreved As an admin. Contact other admins." })
        }
        return res.json({ success: true, authToken: authToken, refreshToken: refreshToken, userID: user.id, adminStatus: user.isAdmin, profilePic: user.profilePic });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: "Server error" });
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



router.post('/user/resend', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ error: "User is not registered" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(200).json({ error: "Incorrect Password" });
        }
        let token = await Token.findOne({ userId: user._id })
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save()



        }
        const url = `https://vivisteria-2lrx.vercel.app/api/${user._id}/verify/${token.token}`
        await sendEmail(user.email, "Verify Email", url)
        res.json({ success: true });



    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
})




router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(400).json({ message: "Invalid Link" })

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        })
        if (!token)
            return res.status(400).json({ message: "Invalid Link" })

        await user.updateOne({ _id: user._id, isVerified: true })
        await Token.deleteOne({ _id: token._id });
        res.redirect(`https://vivisteria.vercel.app/login`)


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Sevrver Error" })
    }
})


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body
    try {
        console.log(email)
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, error: "User does not exist" })
        }
        const secret = jwtSecret + user.password
        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "10m" })

        // const link = `http://localhost:5000/api/reset-password/${user._id}/${token}`
        const link = `https://vivisteria-2lrx.vercel.app/api/reset-password/${user._id}/${token}`
        await sendEmail(user.email, "Forgot password", link)
        res.json({ success: true });

    } catch (error) {
        return res.json({ error: "could not send" })
    }
})

router.get('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params
    const user = await User.findById(id)
    if (!user) {
        return res.json({ success: false, error: "User does not exist" })
    }
    const secret = jwtSecret + user.password
    try {
        const verify = jwt.verify(token, secret)
        if (verify) {
            const email = user.email;
            // return res.redirect(`http://localhost:3000/resetPassword?id=${id}&email=${email}`);
            res.redirect(`https://vivisteria.vercel.app/resetPassword?id=${id}&email=${email}`);
        } else {
            return res.json({ success: false, error: "Invalid token" });
        }
    } catch (error) {
        return res.json({ success: false, error: "User does not exist" })
    }

})


router.put('/password/reset', body('password', 'Password must contain minimum of 8 letters, including 1 uppuercase, 1 lowercase, 1 number and 1 spacial symbol.').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
}), async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json({ errorMessage: result.array() });
    }

    const { id, password } = req.body
    const user = await User.findById(id)
    if (!user) {
        return res.json({ error: "User does not exist" })
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const securepassword = await bcrypt.hash(password, salt);

        user.password = securepassword
        await user.save()
        return res.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
        return res.json({ error: 'An error occurred while updating the password' })
    }

})

module.exports = router;