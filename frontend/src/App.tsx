import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import { Layout } from './layouts/Layout'
import { Dashboard } from './pages/Dashboard'
import { MaterialMaster } from './pages/MaterialMaster'
import { AIMatching } from './pages/AIMatching'
import { Validation } from './pages/Validation'
import { NationalCode } from './pages/NationalCode'
import { CodeMapping } from './pages/CodeMapping'
import { Analytics } from './pages/Analytics'
import { AuditTrail } from './pages/AuditTrail'
import { ToastContainer } from './components/Toast'

function AppContent() {
  const { toast, hideToast } = useAppContext()
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/material-master"
            element={
              <Layout>
                <MaterialMaster />
              </Layout>
            }
          />
          <Route
            path="/ai-matching"
            element={
              <Layout>
                <AIMatching />
              </Layout>
            }
          />
          <Route
            path="/validation"
            element={
              <Layout>
                <Validation />
              </Layout>
            }
          />
          <Route
            path="/national-code"
            element={
              <Layout>
                <NationalCode />
              </Layout>
            }
          />
          <Route
            path="/code-mapping"
            element={
              <Layout>
                <CodeMapping />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <Analytics />
              </Layout>
            }
          />
          <Route
            path="/audit-trail"
            element={
              <Layout>
                <AuditTrail />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
      {toast && (
        <ToastContainer
          toasts={[toast]}
          onClose={() => hideToast()}
        />
      )}
    </>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
