import { useContext } from "react";
import { AuthContext } from "../auth-context";
import { login, register, logout } from "../services/auth.api";

const getAuthFailure = (error, fallbackMessage) => {
  if (!error?.response) {
    return {
      ok: false,
      message: 'Could not reach the authentication service. Please try again.',
      errors: {},
    }
  }

  return {
    ok: false,
    message: error.response.data?.message || fallbackMessage,
    errors: error.response.data?.errors || {},
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setloading } = context

  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login({ email, password })
      if (!data?.token || !data?.user) {
        return {
          ok: false,
          message: 'The server returned an incomplete sign-in response.',
          errors: {},
        }
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (error) {
      return getAuthFailure(error, 'Unable to sign in. Please try again.')
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    try {
      const data = await register({ username, email, password })
      if (!data?.token || !data?.user) {
        return {
          ok: false,
          message: 'The server returned an incomplete registration response.',
          errors: {},
        }
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)
      return { ok: true, user: data.user }
    } catch (error) {
      return getAuthFailure(error, 'Unable to create your account. Please try again.')
    }
  }

  const handlelogout = async () => {
    setloading(true)
    try {
      await logout()
      localStorage.removeItem('token')
      setUser(null)
      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    } finally {
      setloading(false)
    }
  }

  return { user, loading, handleLogin, handleRegister, handlelogout }
}
