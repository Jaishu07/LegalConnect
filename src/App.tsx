import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { authService, initializeDemoData, type User } from "@/lib/auth";

// Import pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import LawyerProfile from "@/pages/LawyerProfile";
import BookAppointment from "@/pages/BookAppointment";
import ClientDashboard from "@/pages/ClientDashboard";
import LawyerDashboard from "@/pages/LawyerDashboard";
import Chat from "@/pages/Chat";
import Documents from "@/pages/Documents";
import Appointments from "@/pages/Appointments";
import Cases from "@/pages/Cases";
import Tasks from "@/pages/Tasks";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "client" | "lawyer";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <Navigate
        to={
          currentUser?.role === "client"
            ? "/client-dashboard"
            : "/lawyer-dashboard"
        }
        replace
      />
    );
  }

  return <>{children}</>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (isAuthenticated && currentUser) {
    return (
      <Navigate
        to={
          currentUser.role === "client"
            ? "/client-dashboard"
            : "/lawyer-dashboard"
        }
        replace
      />
    );
  }

  return <>{children}</>;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Initialize demo data if user is logged in
    if (currentUser) {
      initializeDemoData();
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onLogin={setUser} />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup onSignup={setUser} />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Client */}
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment/:lawyerId"
            element={
              <ProtectedRoute requiredRole="client">
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Lawyer */}
          <Route
            path="/lawyer-dashboard"
            element={
              <ProtectedRoute requiredRole="lawyer">
                <LawyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/chat/:caseId?"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <Cases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:caseId?"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
