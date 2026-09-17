import React from 'react'
import { useNavigate, Link } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { validateRegister } from '../auth.validation'
import '../auth.form.scss'


    
const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const { loading , handleRegister } = useAuth()
    const validateForm = () => {
        const nextErrors = validateRegister({
            username,
            email,
            password,
            confirmPassword,
        })

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
            const result = await handleRegister({
                username: username.trim(),
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
                    <span className="auth-kicker">Start smarter</span>
                    <h1>Create plans that match the role you want.</h1>
                    <p>Save your interview strategies, resume insights, and practice roadmap in your account.</p>
                </div>
                <div className="auth-preview-card">
                    <span>First strategy</span>
                    <strong>Resume review + job match</strong>
                    <small>Register to generate your private preparation plan.</small>
                </div>
            </section>

            <section className='form-container'>
                <span className="auth-kicker">Register</span>
                <h2>Create your account</h2>
                <p className="auth-subtitle">Set up your profile and start preparing with AI Resume.</p>
                {formError && <p className="auth-alert" role="alert" aria-live="polite">{formError}</p>}
                <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder='Enter your username' 
                            value={username}
                            autoComplete="username"
                            disabled={submitting}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setErrors((current) => ({ ...current, username: '' }))
                            }}
                            aria-invalid={Boolean(errors.username)}
                            aria-describedby={errors.username ? 'username-error' : undefined}
                        />
                        {errors.username && <small className="field-error" id="username-error">{errors.username}</small>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder='Enter your email' 
                            value={email}
                            autoComplete="email"
                            disabled={submitting}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setErrors((current) => ({ ...current, email: '' }))
                            }}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && <small className="field-error" id="email-error">{errors.email}</small>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder='Enter your password' 
                            value={password}
                            autoComplete="new-password"
                            disabled={submitting}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrors((current) => ({ ...current, password: '' }))
                            }}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                        />
                        {errors.password && <small className="field-error" id="password-error">{errors.password}</small>}
                        <small className="password-hint">Use 8-72 characters with uppercase, lowercase, and a number.</small>
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirm-password">Confirm password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirmPassword"
                            placeholder="Enter your password again"
                            value={confirmPassword}
                            autoComplete="new-password"
                            disabled={submitting}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setErrors((current) => ({ ...current, confirmPassword: '' }))
                            }}
                            aria-invalid={Boolean(errors.confirmPassword)}
                            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                        />
                        {errors.confirmPassword && (
                            <small className="field-error" id="confirm-password-error">{errors.confirmPassword}</small>
                        )}
                    </div>
                    <button className='auth-submit' type="submit" disabled={submitting}>
                        {submitting ? <><span className="button-spinner" aria-hidden="true" />Creating account...</> : 'Create account'}
                    </button>
                </form>
                <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
            </section>
        </main>
    )
}

export default Register
