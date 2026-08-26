import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (isSignUp) {
      // Sign Up - Create new account
      handleSignUp()
    } else {
      // Login - Check credentials
      handleLogin()
    }
  }

  const handleSignUp = () => {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('storyly_users') || '[]')

    // Check if user already exists
    const userExists = existingUsers.find((user: any) => user.email === email)
    if (userExists) {
      setError('An account with this email already exists. Please login.')
      return
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: email,
      password: password, // In production, this should be hashed!
      name: email.split('@')[0],
      role: 'admin',
      createdAt: new Date().toISOString()
    }

    // Save to localStorage
    existingUsers.push(newUser)
    localStorage.setItem('storyly_users', JSON.stringify(existingUsers))

    setSuccess('Account created successfully! You can now login.')
    setTimeout(() => {
      setIsSignUp(false)
      setSuccess('')
    }, 2000)
  }

  const handleLogin = () => {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('storyly_users') || '[]')

    // Find user
    const user = existingUsers.find(
      (u: any) => u.email === email && u.password === password
    )

    if (!user) {
      setError('Invalid email or password')
      return
    }

    // Login successful
    login(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      'mock-token-' + user.id
    )

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">Storyly</h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Create your account' : 'Sign in to your dashboard'}
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setSuccess('')
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            ℹ️ How it works:
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Your account is saved locally in your browser</li>
            <li>• Use the same email and password to login</li>
            <li>• Data persists across browser sessions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
