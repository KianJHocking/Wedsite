import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Story } from './pages/Story';
import { Rsvp } from './pages/Rsvp';
import { Faqs } from './pages/Faqs';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        {children}
      </main>
      <footer style={{ 
        textAlign: 'center', 
        padding: '3rem 0', 
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-light)',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.05em'
      }}>
        MADE WITH 💖 FOR OUR SPECIAL DAY • 2027
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/story" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Story />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/rsvp" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Rsvp />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/faqs" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Faqs />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
