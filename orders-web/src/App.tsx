import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Orders } from './pages/Orders'
import { PrivateRoute } from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
