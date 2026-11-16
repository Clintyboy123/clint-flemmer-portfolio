import { MotionConfig } from 'motion/react';
import { Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Works from './pages/Works';
import Pricing from './pages/Pricing';
import Services from './pages/Services';
import PageText from './pages/PageText';
import Settings from './pages/Settings';
import Enquiries from './pages/Enquiries';
import EnquiryDetail from './pages/EnquiryDetail';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <RequireAuth>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="works" element={<Works />} />
                      <Route path="pricing" element={<Pricing />} />
                      <Route path="services" element={<Services />} />
                      <Route path="pages" element={<PageText />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="enquiries" element={<Enquiries />} />
                      <Route path="enquiries/:id" element={<EnquiryDetail />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AdminLayout>
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
