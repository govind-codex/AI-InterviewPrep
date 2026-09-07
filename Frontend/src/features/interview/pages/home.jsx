import React, { useRef, useState } from 'react'
import "../style/home.scss"
import { useInterview } from '../../hook/useInterview.js'
import { Link, useNavigate } from 'react-router'

const Home = () => {
  const { loading, generateReport } = useInterview()
  const resumeInputRef = useRef()
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')

  const navigate = useNavigate()
  const isFormValid = resume || selfDescription.trim()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0] ?? resume
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })

    if (data?._id) {
      navigate(`/interview/${data._id}`)
    } else {
      console.error("Interview report was not created successfully.")
    }
  }

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setResume(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setResume(file)
    }
  }

  if (loading) {
    return (
      <main className='loading-screen'>
        <div className="loading-orbit" />
        <h1>Building your interview plan...</h1>
      </main>
    )
  }

  return (
    <main className='planner-home'>
      <section className="planner-shell">
        <div className="planner-heading-row">
          <div className="planner-intro">
            <span className="section-kicker">AI interview planner</span>
            <h1>Create your custom interview strategy.</h1>
            <p>
              Paste a role, upload your resume or describe your background, and generate
              a focused plan for the interview ahead.
            </p>
          </div>

          <Link className="planner-dashboard-link" to="/interview">
            <span className="dashboard-grid-icon" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            <span>
              <strong>My interviews</strong>
              <small>View recent reports</small>
            </span>
          </Link>
        </div>

        <div className="planner-grid">
          <section className="planner-panel">
            <h2>Target job description</h2>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder='Paste the full job description here...'
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="planner-count">{jobDescription.length} / 5000 chars</div>
          </section>

          <section className="planner-panel">
            <h2>Your profile</h2>
            <label>Upload resume</label>
            <div
              className="planner-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => resumeInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  resumeInputRef.current?.click()
                }
              }}
            >
              <span>+</span>
              <p>{resume ? resume.name : 'Click to upload or drag and drop'}</p>
              <small>PDF or DOCX, max 5MB</small>
            </div>
            <input
              ref={resumeInputRef}
              hidden
              type="file"
              name="resume"
              id="resume"
              accept='.pdf,.docx'
              onChange={handleResumeChange}
            />

            <div className="planner-divider">OR</div>

            <label htmlFor="selfDescription">Quick self description</label>
            <textarea
              name="selfDescription"
              id="selfDescription"
              placeholder="Summarize your experience, skills, projects, and target role..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />

            <p className="planner-note">
              Either a resume or a self description is required to generate a personalized plan.
            </p>

            <button
              onClick={handleGenerateReport}
              className={`planner-submit ${!isFormValid ? 'disabled' : ''}`}
              disabled={!isFormValid}
            >
              Generate Interview Strategy
            </button>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Home
