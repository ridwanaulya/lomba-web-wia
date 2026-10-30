import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ExploreReports from "./pages/ExploreReports";
import CreateReport from "./pages/CreateReport";
import StatisticsPage from "./pages/StatisticsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { authService } from "./services/authService";

function ProtectedRoute({ children }) {
  return authService.isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function AdminLayout({ children }) {
  return <>{children}</>;
}

function PublicLayout({ children }) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="w-full flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/laporan"
          element={
            <PublicLayout>
              <ExploreReports />
            </PublicLayout>
          }
        />
        <Route
          path="/lapor"
          element={
            <PublicLayout>
              <CreateReport />
            </PublicLayout>
          }
        />
        <Route
          path="/statistik"
          element={
            <PublicLayout>
              <StatisticsPage />
            </PublicLayout>
          }
        />

        {/* Auth Route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
