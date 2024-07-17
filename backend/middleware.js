const jwt = require('jsonwebtoken');
const jwtSecret = 'Helloworldhowareyoumynameis52_ndSymphonyThankyou';

const authenticateToken = (req, res, next) => {
    const token = req.header('authToken');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, jwtSecret);
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
