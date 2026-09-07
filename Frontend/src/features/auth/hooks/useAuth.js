import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setloading } = context

  const handleLogin = async ({ email, password }) => {
    setloading(true)
    try {
      const data = await login({ email, password })
      if (data?.token) {
        localStorage.setItem('token', data.token)
      }
      setUser(data?.user ?? null)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setloading(false)
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    setloading(true)
    try {
      const data = await register({ username, email, password })
      if (data?.token) {
        localStorage.setItem('token', data.token)
      }
      setUser(data?.user ?? null)
      return true
    } catch (error) {
      console.error('Register failed:', error)
      return false
    } finally {
      setloading(false)
    }
  }

  const handlelogout = async () => {
    setloading(true)
    try {
      const data = await logout()
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
