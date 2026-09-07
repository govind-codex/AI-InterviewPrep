const userModel = require('../models/user.model');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blacklist.model');

function getJwtSecret() {
    return process.env.JWT_SECRET || process.env.JwT_SECRET;
}

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
    };
}

/**
 * @name registerUserController
 * @description register a new user, expecting username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'please provide username, email and password' });
    }
    const isUserAlreadyExists = await userModel.findOne({ $or: [{ username }, { email }] });
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'user already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hash });
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
        return res.status(500).json({ message: 'server misconfigured: JWT secret is missing' });
    }
    const token = jwt.sign(
        { id: user._id, username: user.username },
        jwtSecret,
        { expiresIn: '1h' }
    );
    res.cookie('token', token, getCookieOptions())

    res.status(201).json({ 
        message: 'user registered successfully', 
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name loginUserController
 * @description login a user, expecting email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({email});
    if (!user) {
        return res.status(400).json({ message: 'invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'invalid email or password' });
    }
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
        return res.status(500).json({ message: 'server misconfigured: JWT secret is missing' });
    }
    const token = jwt.sign(
        { id: user._id, username: user.username },
        jwtSecret,
        { expiresIn: '1d' }
    );
    res.cookie('token', token, getCookieOptions())
    res.status(200).json({ 
        message: 'user logged in successfully', 
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

}

/**
 * @name logoutUserController
 * @description logout a user, clearing the token from cookies and adding it to the blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;
    console.log(token);
    if (token) {
        await tokenBlackListModel.create({ token });
    } 
    res.clearCookie('token', getCookieOptions());
    res.status(200).json({ message: 'user logged out successfully' });
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message: 'user details fetched successfully',
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
};
