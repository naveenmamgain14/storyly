import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Stories } from './pages/Stories'
import { Media } from './pages/Media'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Layout } from './components/Layout'
import { useAuthStore } from './store/authStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        {/* Without this, a successful login leaves the user sitting on /login,
            because this route matches regardless of auth state. */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="stories" element={<Stories />} />
            <Route path="media" element={<Media />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
