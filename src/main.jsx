import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import "@appwrite.io/pink-icons";
import App from './App.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Profile from './pages/Profile.jsx'
import MyDrive from './projects/myDrive/MyDrive.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--gray-200)',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: 'var(--accent-pink)',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--accent-pink)',
                secondary: 'white',
              },
            },
          }}
        />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<App />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/mydrive"
            element={
              <ProtectedRoute>
                <MyDrive />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
