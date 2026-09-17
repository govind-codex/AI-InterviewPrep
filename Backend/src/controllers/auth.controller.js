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
        sameSite: 'lax',
        secure: isProduction,
        path: '/',
    };
}

function getPublicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
    };
}

function createToken(user, jwtSecret) {
    return jwt.sign(
        { id: user._id, username: user.username },
        jwtSecret,
        { expiresIn: '1d' }
    );
}

/**
 * @name registerUserController
 * @description register a new user, expecting username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
        return res.status(500).json({ message: 'Authentication is temporarily unavailable.' });
    }

    const isUserAlreadyExists = await userModel
        .findOne({ $or: [{ username }, { email }] })
        .collation({ locale: 'en', strength: 2 });
    if (isUserAlreadyExists) {
        const emailExists = isUserAlreadyExists.email.toLowerCase() === email;
        return res.status(409).json({
            message: emailExists
                ? 'An account with this email already exists.'
                : 'This username is already taken.',
            errors: emailExists
                ? { email: 'An account with this email already exists.' }
                : { username: 'This username is already taken.' },
        });
    }

    const hash = await bcrypt.hash(password, 10);
    let user;
    try {
        user = await userModel.create({ username, email, password: hash });
    } catch (error) {
        if (error?.code === 11000) {
            const field = error.keyPattern?.email ? 'email' : 'username';
            const message = field === 'email'
                ? 'An account with this email already exists.'
                : 'This username is already taken.';
            return res.status(409).json({ message, errors: { [field]: message } });
        }
        throw error;
    }

    const token = createToken(user, jwtSecret);
    res.cookie('token', token, getCookieOptions());

    res.status(201).json({ 
        message: 'Account created successfully.',
        token,
        user: getPublicUser(user),
    });
}

/**
 * @name loginUserController
 * @description login a user, expecting email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
        return res.status(500).json({ message: 'Authentication is temporarily unavailable.' });
    }

    const user = await userModel
        .findOne({ email })
        .collation({ locale: 'en', strength: 2 });
    if (!user) {
        return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    const token = createToken(user, jwtSecret);
    res.cookie('token', token, getCookieOptions());
    res.status(200).json({ 
        message: 'Signed in successfully.',
        token,
        user: getPublicUser(user),
    });

}

/**
 * @name logoutUserController
 * @description logout a user, clearing the token from cookies and adding it to the blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null;
    const token = req.cookies.token || bearerToken;
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
    if (!user) {
        return res.status(401).json({ message: 'Account not found.' });
    }
    res.status(200).json({
        message: 'Account loaded successfully.',
        user: getPublicUser(user),
    });
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
};
