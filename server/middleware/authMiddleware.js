const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
}

module.exports = authMiddleware;