const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const interviewRouter = express.Router();
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');


/**
 * @route POST /api/interview/
 * @desc Generate an interview report based on the candidate's resume, self-description, and the job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single('resume'), interviewController.generateInterViewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get the interview report by its ID. Only the candidate who owns the report can access it.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @desc Get all interview reports of the authenticated user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

module.exports = interviewRouter;