import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const GuestOnly = ({ children }) => {
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <main className="auth-route-loading">
        <span className="auth-route-spinner" aria-hidden="true" />
        <p>Checking your session...</p>
      </main>
    )
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default GuestOnly
