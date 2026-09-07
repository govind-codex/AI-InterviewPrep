// import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../interview/services/interview.api.js"
// import { useContext, useEffect } from "react"
// import { InterviewContext } from "../interview/interview.context.jsx"
// import { useParams } from "react-router"

// // const {context} = useContext(InterviewContext)
// export const useInterview = () => {

//     const context = useContext(InterviewContext)
//     const { interviewId } = useParams()

//     if (!context) {
//         throw new Error("useInterview must be used within an InterviewProvider")
//     }
//     const { loading, setLoading, report, setReport, reports, setReports } = context

//     const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
//         setLoading(true)
//         let response = null
//         try {
//             response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
//             setReport(response.interViewReport)
//         } catch (error) {
//             console.error("Error generating interview report:", error)
//         } finally {
//             setLoading(false)
//         }
//         return response.interViewReport
//     }

//     const getReportById = async (interviewId) => {
//         setLoading(true)
//         let response = null
//         try {
//             response = await getInterviewReportById(interviewId)
//             setReport(response.interViewReport)
//         } catch (error) {
//             console.log(error)
//         } finally {
//             setLoading(false)
//         }
//         return response.interViewReport
//     }

//     const getReports = async () => {
//         setLoading(true)
//         let response = null
//         try {
//             response = await getAllInterviewReports()
//             setReports(response.interViewReports)
//         } catch (error) {
//             console.error("Error fetching interview reports:", error)
//         } finally {
//             setLoading(false)
//         }
//         return response.interViewReports
//     }

//     const Interview = () => {
//         const { report, getReportById } = useInterview()
//         const { interviewId } = useParams()

//         useEffect(() => {
//             if (interviewId) {
//                 getReportById(interviewId)
//             }else {
//                 getReports()
//             }
//         }, [interviewId])

//         return { loading, report, reports, generateReport, getReportById, getReports };
//     }}

import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../interview/services/interview.api.js"
import { useCallback, useContext } from "react"
import { InterviewContext } from "../interview/interview.context.jsx"

export const useInterview = () => {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }
    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const interviewReport = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(interviewReport)
            if (interviewReport?._id) {
                setReports((currentReports) => [
                    interviewReport,
                    ...currentReports.filter((savedReport) => savedReport._id !== interviewReport._id)
                ])
            }
            return interviewReport
        } catch (error) {
            console.error("Error generating interview report:", error)
            return null
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport, setReports])

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        try {
            const interviewReport = await getInterviewReportById(interviewId)
            setReport(interviewReport)
            return interviewReport
        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getReports = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setLoading(true)
        try {
            const interviewReports = await getAllInterviewReports()
            setReports(interviewReports)
            return interviewReports
        } catch (error) {
            console.error("Error fetching interview reports:", error)
            return []
        } finally {
            if (!silent) setLoading(false)
        }
    }, [setLoading, setReports])

    return { loading, report, reports, generateReport, getReportById, getReports }
}
