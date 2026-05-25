const jwt = require('jsonwebtoken');

const verifyAdminToken =  (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET_KEY;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("verifyAdminToken JWT error:", err.message);
            return res.status(403).json({ message: 'Invalid credientials' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required' });
        }
        req.user = user;
        next();
    })

}

module.exports = verifyAdminToken;