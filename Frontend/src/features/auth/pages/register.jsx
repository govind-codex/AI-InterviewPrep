import React from 'react'
import { useNavigate, Link } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import '../auth.form.scss'


    
const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState('')

    const { loading , handleRegister } = useAuth()
    const validateForm = () => {
        const nextErrors = {}
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!username.trim()) {
            nextErrors.username = 'Username is required.'
        } else if (username.trim().length < 3) {
            nextErrors.username = 'Username must be at least 3 characters.'
        }

        if (!email.trim()) {
            nextErrors.email = 'Email is required.'
        } else if (!emailPattern.test(email.trim())) {
            nextErrors.email = 'Enter a valid email address.'
        }

        if (!password) {
            nextErrors.password = 'Password is required.'
        } else if (password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters.'
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!validateForm()) {
            return
        }

        const success = await handleRegister({ username, email, password })
        if (success) {
            navigate("/login")
        } else {
            setFormError('Registration failed. Please try a different email or username.')
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
                {formError && <p className="auth-alert">{formError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder='Enter your username' 
                            value={username}
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
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrors((current) => ({ ...current, password: '' }))
                            }}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                        />
                        {errors.password && <small className="field-error" id="password-error">{errors.password}</small>}
                    </div>
                    <button className='auth-submit'>Register</button>
                </form>
                <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
            </section>
        </main>
    )
}

export default Register
