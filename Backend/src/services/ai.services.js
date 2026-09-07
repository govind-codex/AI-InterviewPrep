const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// async function invokeGeminiAI(){
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: [{
//             role: "user",
//             parts: [{"text": "Hello gemini, explain what is interview?"}],
//         },],
//     })
//     console.log(response.text)
// }
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview."),
        intention: z.string().describe("The intention of interviewer behind asking the question."),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them!"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview."),
        intention: z.string().describe("The intention of interviewer behind asking the question."),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them!"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("the skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("the severity of the skill gap"),
    })).describe("List of skill gaps in the candidates profile along with their severity!"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("the day number in the preparation plan, starting from 1"),
        focus: z.string().describe("the main focus of this day in the preparation plan, e.g. 'Data Structures and Algorithms', 'System Design', 'mock interview' etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation  e.g. 'solve 3 problems on LeetCode', 'read chapter 4 of System Design book', 'schedule and attend a mock interview' etc."),
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively!"),
    title: z.string().describe("The title of the job for which the interview report is generated!"),

})

async function generateInterViewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}`

    //     const prompt = `
    // You are an AI that ONLY returns valid JSON.

    // Follow the schema EXACTLY.
    // - Do not add extra fields
    // - Do not skip fields
    // - Do not return null
    // - Do not return text outside JSON
    // - Ensure all arrays and objects match the schema

    // Return ONLY JSON.

    // Candidate Details:
    // Resume: ${resume}
    // Self Description: ${selfDescription}
    // Job Description: ${jobDescription}
    // `

    const responseSchema = {
        type: "object",
        properties: {
            title: {type: "string"},
            matchScore: { type: "number" },

            technicalQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" },
                    },
                    required: ["question", "intention", "answer"],
                },
            },

            behavioralQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" },
                    },
                    required: ["question", "intention", "answer"],
                },
            },

            skillGaps: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string" },
                        severity: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                        },
                    },
                    required: ["skill", "severity"],
                },
            },

            preparationPlan: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        day: { type: "number" },
                        focus: { type: "string" },
                        tasks: {
                            type: "array",
                            items: { type: "string" },
                        },
                    },
                    required: ["day", "focus", "tasks"],
                },
            },
        },
        required: [
            "title",
            "matchScore",
            "technicalQuestions",
            "behavioralQuestions",
            "skillGaps",
            "preparationPlan",
        ],
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
            role: "user",
            parts: [{ "text": prompt }],
        }],
        config: {
            responseMimeType: "application/json",
            responseSchema,
        }
    })

    return JSON.parse(response.text);
    // console.log(JSON.parse(response.text))
    // console.log("RAW RESPONSE:\n", response.text)
}

module.exports = { generateInterViewReport };