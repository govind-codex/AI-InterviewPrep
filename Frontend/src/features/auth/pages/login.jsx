import React from 'react'
import { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { validateLogin } from '../auth.validation'

const Login = () => {

    const { loading , handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const validateForm = () => {
        const nextErrors = validateLogin({ email, password })

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!validateForm()) {
            return
        }

        setSubmitting(true)
        try {
            const result = await handleLogin({
                email: email.trim().toLowerCase(),
                password,
            })
            if (result.ok) {
                navigate("/home", { replace: true })
                return
            }

            setErrors(result.errors)
            setFormError(result.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-loading">Loading...</div>
            </main>
        )
    }

  return (
    <main className="auth-page">
        <section className="auth-visual">
            <Link className="auth-brand" to="/landing">
                <span>AI</span>
                <strong>AI Resume</strong>
            </Link>
            <div>
                <span className="auth-kicker">Welcome back</span>
                <h1>Continue building your interview strategy.</h1>
                <p>Access your resume insights, role-fit plans, and practice questions in one focused workspace.</p>
            </div>
            <div className="auth-preview-card">
                <span>Next plan</span>
                <strong>Frontend Engineer Interview</strong>
                <small>Resume match and question practice ready after login.</small>
            </div>
        </section>

        <section className='form-container'>
            <span className="auth-kicker">Login</span>
            <h2>Sign in to your account</h2>
            <p className="auth-subtitle">Use your email and password to open your planner.</p>
            {formError && <p className="auth-alert" role="alert" aria-live="polite">{formError}</p>}
            <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setErrors((current) => ({ ...current, email: '' }))
                        }}
                        value={email}
                        autoComplete="email"
                        disabled={submitting}
                        type="email"
                        id="email"
                        name="email"
                        placeholder='Enter your email'
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <small className="field-error" id="email-error">{errors.email}</small>}
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setErrors((current) => ({ ...current, password: '' }))
                        }}
                        value={password}
                        autoComplete="current-password"
                        disabled={submitting}
                        type="password"
                        id="password"
                        name="password"
                        placeholder='Enter your password'
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    {errors.password && <small className="field-error" id="password-error">{errors.password}</small>}
                </div>
                <button className='auth-submit' type="submit" disabled={submitting}>
                    {submitting ? <><span className="button-spinner" aria-hidden="true" />Signing in...</> : 'Sign in'}
                </button>
            </form>
            <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
        </section>
    </main>
  )
}

export default Login
