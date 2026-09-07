const express = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

/**
* @route POST /api/auth/register
* @desc Register a new user
* @access Public
*/

authRouter.post('/register',authController.registerUserController);


/**
 * @route POST /api/auth/login
 * @description login a user with email and password
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description clear token from user cookie and add token in blacklist
 * @access Puclic
 */
authRouter.get('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController);
 

module.exports = authRouter;