import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../../hook/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'

const sectionCopy = {
  technical: {
    title: 'Technical questions',
    description: 'Practice the core technical areas this role is most likely to cover.'
  },
  behavioral: {
    title: 'Behavioral questions',
    description: 'Shape concise stories that demonstrate your impact, judgment, and collaboration.'
  },
  roadmap: {
    title: 'Preparation roadmap',
    description: 'Follow this focused study plan to close the most important gaps before interview day.'
  }
}

const formatReportDate = (value) => {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return 'Date unavailable'

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const ReportList = ({ reports, currentInterviewId }) => {
  if (reports.length === 0) {
    return (
      <div className="interview-library-empty">
        <span aria-hidden="true">+</span>
        <h2>No interview reports yet</h2>
        <p>Create your first strategy and the saved report will appear here.</p>
        <Link to="/home">Create your first plan</Link>
      </div>
    )
  }

  return (
    <div className="interview-report-list">
      {reports.map((savedReport, index) => {
        const score = Math.min(100, Math.max(0, Number(savedReport.matchScore) || 0))
        const isCurrent = savedReport._id === currentInterviewId

        return (
          <article className={`interview-report-row ${isCurrent ? 'current' : ''}`} key={savedReport._id} style={{ '--delay': `${index * 55}ms` }}>
            <div className="interview-report-score" style={{ '--score': `${score * 3.6}deg` }}>
              <strong>{score}%</strong>
            </div>
            <div className="interview-report-details">
              <span>{formatReportDate(savedReport.createdAt)}{isCurrent ? ' / Open now' : ''}</span>
              <h3>{savedReport.title || 'Interview strategy'}</h3>
              <p>{score >= 75 ? 'Strong role alignment' : score >= 50 ? 'Promising role alignment' : 'Focused preparation recommended'}</p>
            </div>
            <Link to={`/interview/${savedReport._id}`} aria-current={isCurrent ? 'page' : undefined}>
              {isCurrent ? 'Current plan' : 'Open plan'} <span aria-hidden="true">&gt;</span>
            </Link>
          </article>
        )
      })}
    </div>
  )
}

const Interview = () => {
  const { interviewId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const stateReport = location.state?.interviewData
  const { report, reports, getReportById, getReports, loading } = useInterview()
  const { user, handlelogout, loading: authLoading } = useAuth()
  const [activeSection, setActiveSection] = useState('technical')
  const [profileOpen, setProfileOpen] = useState(false)
  const [loadedInterviewId, setLoadedInterviewId] = useState(stateReport ? interviewId : null)
  const [reportListLoaded, setReportListLoaded] = useState(false)

  useEffect(() => {
    if (!interviewId || stateReport) return

    let active = true
    getReportById(interviewId).finally(() => {
      if (active) setLoadedInterviewId(interviewId)
    })

    return () => {
      active = false
    }
  }, [getReportById, interviewId, stateReport])

  useEffect(() => {
    let active = true

    getReports({ silent: Boolean(interviewId) }).finally(() => {
      if (active) setReportListLoaded(true)
    })

    return () => {
      active = false
    }
  }, [getReports, interviewId])

  useEffect(() => {
    if (!profileOpen) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.body.classList.add('profile-drawer-open')

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('profile-drawer-open')
    }
  }, [profileOpen])

  const interviewData = stateReport ?? report
  const requestComplete = !interviewId || Boolean(stateReport) || loadedInterviewId === interviewId
  const recentReports = useMemo(() => (
    [...reports].sort((first, second) => {
      const firstDate = new Date(first.createdAt).getTime() || 0
      const secondDate = new Date(second.createdAt).getTime() || 0
      return secondDate - firstDate
    })
  ), [reports])
  const sections = useMemo(() => ([
    { key: 'technical', label: 'Technical', items: interviewData?.technicalQuestions ?? [] },
    { key: 'behavioral', label: 'Behavioral', items: interviewData?.behavioralQuestions ?? [] },
    {
      key: 'roadmap',
      label: 'Roadmap',
      items: interviewData?.preperationPlan ?? interviewData?.preparationPlan ?? []
    }
  ]), [interviewData])

  if (loading || !requestComplete || !reportListLoaded) {
    return (
      <main className="interview-status-page">
        <div className="interview-loader" aria-hidden="true" />
        <span className="interview-kicker">AI interview strategy</span>
        <h1>Preparing your interview plan</h1>
        <p>Organizing your role match, questions, and preparation roadmap.</p>
      </main>
    )
  }

  if (!interviewId) {
    return (
      <main className="interview-page interview-library-page">
        <header className="interview-topbar">
          <Link className="interview-brand" to="/landing" aria-label="Prepwise landing page">
            <span className="interview-brand-mark">P</span>
            <span>AI InterviewPrep</span>
          </Link>
          <div className="interview-topbar-actions">
            <Link className="interview-primary-action compact" to="/home">New strategy</Link>
          </div>
        </header>

        <section className="interview-library-hero">
          <span className="interview-kicker light">Saved interview reports</span>
          <h1>Your interview plans, all in one place.</h1>
          <p>Open a recent report to continue practicing its questions, skill gaps, and preparation roadmap.</p>
        </section>

        <section className="interview-library-content">
          <div className="interview-library-heading">
            <div>
              <span className="interview-kicker">Report history</span>
              <h2>Recent reports</h2>
            </div>
            <span>{recentReports.length} {recentReports.length === 1 ? 'report' : 'reports'}</span>
          </div>
          <ReportList reports={recentReports} />
        </section>
      </main>
    )
  }

  if (!interviewData) {
    return (
      <main className="interview-status-page">
        <div className="status-mark">!</div>
        <span className="interview-kicker">Report unavailable</span>
        <h1>We could not open this interview plan.</h1>
        <p>The report may no longer exist, or the request could not be completed.</p>
        <Link className="interview-primary-action" to="/home">Create a new plan</Link>
      </main>
    )
  }

  const activeSectionData = sections.find((section) => section.key === activeSection) ?? sections[0]
  const skillGaps = interviewData.skillGaps ?? []
  const totalQuestions = sections[0].items.length + sections[1].items.length
  const matchScore = Math.min(100, Math.max(0, Number(interviewData.matchScore) || 0))
  const username = user?.username?.trim() || 'Candidate'
  const userInitial = username.charAt(0).toUpperCase()

  const logoutUser = async () => {
    const success = await handlelogout()
    if (success) navigate('/landing', { replace: true })
  }

  return (
    <main className="interview-page">
      <header className="interview-topbar">
        <Link className="interview-brand" to="/landing" aria-label="Prepwise landing page">
          <span className="interview-brand-mark">P</span>
          <span>AI-InterviewPrep</span>
        </Link>
        <div className="interview-topbar-actions">
          <Link className="interview-text-action" to="/interview">Reports</Link>
          <Link className="interview-text-action" to="/home">New strategy</Link>
          <Link className="interview-primary-action compact" to="/home">Back to planner</Link>
          <button
            className="profile-trigger"
            type="button"
            onClick={() => setProfileOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={profileOpen}
            aria-controls="interview-profile-drawer"
          >
            <span className="profile-trigger-avatar">{userInitial}</span>
            <span className="profile-trigger-name">{username}</span>
          </button>
        </div>
      </header>

      <button
        className={`profile-backdrop ${profileOpen ? 'visible' : ''}`}
        type="button"
        aria-label="Close profile"
        tabIndex={profileOpen ? 0 : -1}
        onClick={() => setProfileOpen(false)}
      />

      <aside
        className={`profile-drawer ${profileOpen ? 'open' : ''}`}
        id="interview-profile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="User profile"
        aria-hidden={!profileOpen}
      >
        <div className="profile-drawer-header">
          <span className="interview-kicker">Your profile</span>
          <button className="profile-close" type="button" onClick={() => setProfileOpen(false)} aria-label="Close profile">X</button>
        </div>

        <div className="profile-identity">
          <div className="profile-avatar">{userInitial}</div>
          <div>
            <h2>{username}</h2>
            <p>{user?.email || 'Signed-in candidate'}</p>
          </div>
        </div>

        <div className="profile-plan-summary">
          <span>Current plan</span>
          <strong>{matchScore}% role match</strong>
          <div className="profile-progress" aria-hidden="true">
            <span style={{ width: `${matchScore}%` }} />
          </div>
          <div className="profile-mini-stats">
            <div><strong>{totalQuestions}</strong><span>Questions</span></div>
            <div><strong>{skillGaps.length}</strong><span>Skill gaps</span></div>
            <div><strong>{sections[2].items.length}</strong><span>Days</span></div>
          </div>
        </div>

        <nav className="profile-links" aria-label="Profile navigation">
          <Link to="/interview" onClick={() => setProfileOpen(false)}>
            <span><strong>Recent reports</strong><small>Open your saved interviews</small></span>
            <b aria-hidden="true">&gt;</b>
          </Link>
          <Link to="/home" onClick={() => setProfileOpen(false)}>
            <span><strong>Interview planner</strong><small>Create another strategy</small></span>
            <b aria-hidden="true">&gt;</b>
          </Link>
          <Link to="/landing" onClick={() => setProfileOpen(false)}>
            <span><strong>About Prepwise</strong><small>Return to the landing page</small></span>
            <b aria-hidden="true">&gt;</b>
          </Link>
        </nav>

        <button className="profile-logout" type="button" onClick={logoutUser} disabled={authLoading}>
          {authLoading ? 'Signing out...' : 'Sign out'}
        </button>
      </aside>

      <section className="interview-hero">
        <div className="interview-hero-copy">
          <span className="interview-kicker light">Your personalized plan</span>
          <h1>Interview readiness, organized.</h1>
          <p>Move through your likely questions, close priority skill gaps, and follow a focused preparation schedule.</p>
        </div>

        <div className="score-summary" aria-label={`${matchScore}% role match`}>
          <div className="score-ring" style={{ '--score': `${matchScore * 3.6}deg` }}>
            <div>
              <strong>{matchScore}%</strong>
              <span>role match</span>
            </div>
          </div>
          <p>{matchScore >= 75 ? 'Strong foundation' : matchScore >= 50 ? 'Promising match' : 'Room to grow'}</p>
        </div>
      </section>

      <section className="interview-stats" aria-label="Interview plan overview">
        <article><strong>{totalQuestions}</strong><span>practice questions</span></article>
        <article><strong>{skillGaps.length}</strong><span>priority skill gaps</span></article>
        <article><strong>{sections[2].items.length}</strong><span>preparation days</span></article>
      </section>

      <section className="interview-workspace">
        <div className="interview-main-column">
          <div className="interview-section-heading">
            <div>
              <span className="interview-kicker">Practice workspace</span>
              <h2>{sectionCopy[activeSection].title}</h2>
              <p>{sectionCopy[activeSection].description}</p>
            </div>

            <nav className="interview-tabs" aria-label="Interview plan sections">
              {sections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  className={activeSection === section.key ? 'active' : ''}
                  onClick={() => setActiveSection(section.key)}
                >
                  {section.label}<span>{section.items.length}</span>
                </button>
              ))}
            </nav>
          </div>

          {activeSectionData.items.length === 0 ? (
            <div className="interview-empty-state">
              <strong>No items were generated for this section.</strong>
              <p>Create a new strategy with a more detailed role description to get richer guidance.</p>
            </div>
          ) : activeSection !== 'roadmap' ? (
            <div className="question-list">
              {activeSectionData.items.map((item, index) => (
                <article
                  className="question-card"
                  key={`${item.question}-${index}`}
                  style={{ '--delay': `${index * 70}ms` }}
                >
                  <div className="question-topline">
                    <span className="question-index">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <span className="question-type">Question</span>
                      <h3>{item.question}</h3>
                    </div>
                  </div>
                  {item.intention && (
                    <div className="question-intention">
                      <strong>What they are assessing</strong>
                      <p>{item.intention}</p>
                    </div>
                  )}
                  {item.answer && (
                    <div className="answer-box">
                      <strong>Suggested answer direction</strong>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="roadmap-list">
              {activeSectionData.items.map((item, index) => (
                <article className="roadmap-card" key={`${item.day}-${index}`} style={{ '--delay': `${index * 60}ms` }}>
                  <div className="roadmap-day"><span>Day</span><strong>{item.day}</strong></div>
                  <div>
                    <span className="question-type">Preparation focus</span>
                    <p>{item.task}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="skill-rail">
          <span className="interview-kicker">Priority development</span>
          <h2>Skill gaps to close</h2>
          <p className="skill-rail-intro">Start with these areas to make the biggest improvement to your role fit.</p>

          {skillGaps.length > 0 ? (
            <div className="skill-detail-list">
              {skillGaps.map((skill, index) => (
                <article className="skill-detail" key={`${skill.skill}-${index}`}>
                  <div className="skill-number">{String(index + 1).padStart(2, '0')}</div>
                  <div><h3>{skill.skill}</h3><p>{skill.reason}</p></div>
                </article>
              ))}
            </div>
          ) : (
            <p className="skill-empty">No priority gaps were identified.</p>
          )}

          <div className="skill-tip">
            <strong>Practice tip</strong>
            <p>Say your answers aloud and keep one clear example ready for each priority area.</p>
          </div>
        </aside>
      </section>

      <section className="interview-library-content embedded">
        <div className="interview-library-heading">
          <div>
            <span className="interview-kicker">Saved interview reports</span>
            <h2>Recent reports</h2>
          </div>
          <Link className="interview-view-all" to="/interview">View report library</Link>
        </div>
        <ReportList reports={recentReports} currentInterviewId={interviewId} />
      </section>
    </main>
  )
}

export default Interview
