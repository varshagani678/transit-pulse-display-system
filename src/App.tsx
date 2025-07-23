
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import Index from "./pages/Index";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import AdminAuthPage from "./components/auth/AdminAuthPage";
import UserAuthPage from "./components/auth/UserAuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin-auth" element={<AdminAuthPage />} />
            <Route path="/user-auth" element={<UserAuthPage />} />
            <Route 
              path="/admin" 
              element={
                <RoleProtectedRoute requiredRole="admin">
                  <AdminPage />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <RoleProtectedRoute requiredRole="user">
                  <UserPage />
                </RoleProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
