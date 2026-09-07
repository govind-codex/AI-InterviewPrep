const pdfParse = require('pdf-parse');
const { generateInterViewReport } = require('../services/ai.services.js');
const interViewReportModel = require('../models/interviewReport.model.js');

/**
 * @desc Generate an interview report based on the candidate's resume, self-description, and the job description.
 *  */
async function generateInterViewReportController(req, res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body;
    const interViewReportByAi = await generateInterViewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    });
    // console.log(interViewReportByAi);
    const interViewReport = await interViewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        title: interViewReportByAi.title || "Unknown Position",
        ...interViewReportByAi
    })
    res.status(201).json({
        message: "Interview report generated successfully",
        interViewReport
    })

}


/**
 * @desc Get the interview report by its ID. Only the candidate who owns the report can access it.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    const interViewReport = await interViewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })
    if (!interViewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    res.status(200).json({
        message: "Interview report fetched successfully",
        interViewReport
    })
}


/**
 * @desc Get all interview reports of the authenticated user.
 */
async function getAllInterviewReportsController(req, res) {
    const interViewReports = await (await interViewReportModel.find({ user: req.user.id })).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan") 
    res.status(200).json({
        message: "Interview reports fetched successfully",
        interViewReports
    })
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController };