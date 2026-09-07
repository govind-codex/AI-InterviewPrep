import React, { useState } from 'react'
import { Link } from 'react-router'
import "../style/home.scss"

const features = [
  {
    title: 'Resume Analysis',
    text: 'Scan your profile for role fit, missing keywords, and stronger bullet points.',
    metric: '92%',
  },
  {
    title: 'Job Match Strategy',
    text: 'Compare your resume with a target job description before you prepare.',
    metric: '4x',
  },
  {
    title: 'Interview Questions',
    text: 'Generate focused technical and behavioral questions for the role.',
    metric: '50+',
  },
]

const steps = [
  'Upload your resume or describe your background',
  'Paste the job description you want to target',
  'Receive a practical interview preparation plan',
]

const faqs = [
  {
    question: 'Do I need to log in first?',
    answer: 'Yes. The landing page is public, and the resume planner opens after login so your generated plans stay in your account.',
  },
  {
    question: 'Can I create a plan without a resume?',
    answer: 'Yes. You can write a self-description with your experience, skills, projects, and target role.',
  },
  {
    question: 'What does the app generate?',
    answer: 'It creates a custom interview strategy with profile insights, skill gaps, likely questions, and preparation guidance.',
  },
]

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Primary navigation">
        <a className="landing-brand" href="#top" aria-label="AI Resume landing page">
          <span>AI</span>
          <strong>AI Resume</strong>
        </a>

        <div className="landing-links">
          <a href="#features">Features</a>
          <a href="#process">Process</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="landing-auth">
          <Link className="login-link" to="/login">Login</Link>
          <Link className="register-link" to="/register">Register</Link>
        </div>
      </nav>

      <section className="landing-hero" id="top">
        <div className="landing-copy">
          <span className="landing-kicker">AI interview strategy planner</span>
          <h1>Prepare for the right role with a sharper resume and interview plan.</h1>
          <p>
            AI Resume turns your resume and a job description into a focused preparation
            roadmap, so you know what to improve, practice, and say with confidence.
          </p>

          <div className="landing-actions">
            <Link className="register-link large" to="/register">Get started</Link>
            <Link className="login-link large" to="/login">Login</Link>
          </div>

          <div className="landing-stats" aria-label="Product highlights">
            <article>
              <strong>10+</strong>
              <span>prep modules</span>
            </article>
            <article>
              <strong>500+</strong>
              <span>question patterns</span>
            </article>
            <article>
              <strong>99%</strong>
              <span>focused guidance</span>
            </article>
          </div>
        </div>

        <div className="landing-preview" aria-label="Interview planner preview">
          <div className="preview-photo">
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80"
              alt="Candidate preparing for an interview"
            />
          </div>
          <div className="preview-panel main-panel">
            <span>Role Match</span>
            <strong>Frontend Engineer</strong>
            <div className="progress-track">
              <i />
            </div>
            <small>Resume keywords aligned: 92%</small>
          </div>
          <div className="preview-panel question-panel">
            <span>Practice next</span>
            <strong>Explain your strongest React project</strong>
          </div>
          <div className="preview-panel skills-panel">
            <span>Skill focus</span>
            <strong>System design, testing, API integration</strong>
          </div>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="section-heading">
          <span className="landing-kicker">What you get</span>
          <h2>Everything arranged around one goal: interview readiness.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-tile" key={feature.title}>
              <span>{feature.metric}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="process-card">
          <span className="landing-kicker">How it works</span>
          <h2>From profile to plan in three simple steps.</h2>
          <div className="step-list">
            {steps.map((step, index) => (
              <article key={step}>
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="candidate-card">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80"
            alt="Career planning session"
          />
          <div>
            <span>Personalized plan</span>
            <strong>Skill gaps, talking points, and question practice</strong>
          </div>
        </div>
      </section>

      <section className="faq-cta-section" id="faq">
        <div className="faq-column">
          <span className="landing-kicker">FAQ</span>
          <h2>Questions before you start?</h2>
          {faqs.map((faq, index) => (
            <article className={`landing-faq ${openFaq === index ? 'open' : ''}`} key={faq.question}>
              <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                <span>{faq.question}</span>
                <strong>{openFaq === index ? '-' : '+'}</strong>
              </button>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>

        <div className="final-cta">
          <span className="landing-kicker">Start now</span>
          <h2>Login or register to create your first interview strategy.</h2>
          <p>Your planner is private and opens after authentication.</p>
          <div className="landing-actions">
            <Link className="register-link large" to="/register">Register</Link>
            <Link className="login-link large" to="/login">Login</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <strong>AI Resume</strong>
        <span>Built for smarter resume alignment and interview preparation.</span>
      </footer>
    </main>
  )
}

export default Landing
