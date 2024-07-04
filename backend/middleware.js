const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret'; // Replace with your actual secret

const authenticateToken = (req, res, next) => {
    const token = req.header('auth-token');
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
