const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json('Auth error');
        }
        const decoded = jwt.verify(token, process.env.SecretKey);
        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).json('Auth error');
    }
}