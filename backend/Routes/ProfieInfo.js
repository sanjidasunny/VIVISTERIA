const express = require('express')
const router = express.Router()

const user = require('../models/User')


router.post('/profile', async (req, res) => {
    try {
        let data = await user.findById(req.body.id)
        res.json({ profileData: data })


    } catch (e) {
        res.send("Server Error", error.message)
    }

})
module.exports = router;