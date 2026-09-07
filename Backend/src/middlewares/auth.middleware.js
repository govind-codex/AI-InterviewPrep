const jwt = require('jsonwebtoken');
const blackListModel = require('../models/blacklist.model');
const tokenBlackListModel = require('../models/blacklist.model');

function getJwtSecret() {
    return process.env.JWT_SECRET || process.env.JwT_SECRET;
}

async function authUser(req, res, next) {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null;
    const token = req.cookies.token || bearerToken;
    if (!token) {
        return res.status(401).json({ message: 'token not provided' });
    }

    const isTokenBlackListed =  await tokenBlackListModel.findOne({token})
    if(isTokenBlackListed){
        return res.status(401).json({ message: 'token is invalid' });
    }

    try {
        const jwtSecret = getJwtSecret();
        if (!jwtSecret) {
            return res.status(500).json({ message: 'server misconfigured: JWT secret is missing' });
        }
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded
        next();
    }catch(err){
        return res.status(401).json({ message: 'invalid token' });
    }
}

module.exports = {authUser};
