import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Players from "./pages/Players";
import Staff from "./pages/Staff"; 
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Manage from "./pages/Manage";
import NotFound from "./pages/NotFound";
import UserManagement from "./components/manage/UserManagement";
import PlayerManagement from "./components/manage/PlayerManagement";
import PlayerForm from "./components/manage/PlayerForm";
import StaffManagement from "./components/manage/StaffManagement";
import StaffForm from "./components/manage/StaffForm";
import NewsManagement from "./components/manage/NewsManagement";
import NewsForm from "./components/manage/NewsForm";
import GalleryManagement from "./components/manage/GalleryManagement";
import GalleryUpload from "./components/manage/GalleryUpload";
import ApplicationsManagement from "./components/manage/ApplicationsManagement";
import PersonalSettings from "./components/manage/PersonalSettings";
import SystemSettings from "./components/manage/SystemSettings";

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
            <Route path="/players" element={<Players />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/news" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/manage" 
              element={
                <ProtectedRoute>
                  <Manage />
                </ProtectedRoute>
              } 
            />
            
            {/* User Management Routes */}
            <Route path="/manage/users" element={
              <ProtectedRoute requiredRoles={['admin', 'co-admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            
            {/* Player Management Routes */}
            <Route path="/manage/players" element={
              <ProtectedRoute requiredRoles={['admin', 'co-admin']}>
                <PlayerManagement />
              </ProtectedRoute>
            } />
            <Route path="/manage/players/add" element={
              <ProtectedRoute requiredRoles={['admin', 'co-admin']}>
                <PlayerForm />
              </ProtectedRoute>
            } />
            
            {/* Staff Management Routes */}
            <Route path="/manage/staff" element={
              <ProtectedRoute requiredRoles={['admin', 'co-admin']}>
                <StaffManagement />
              </ProtectedRoute>
            } />
            <Route path="/manage/staff/add" element={
              <ProtectedRoute requiredRoles={['admin', 'co-admin']}>
                <StaffForm />
              </ProtectedRoute>
            } />
            
            {/* News Management Routes */}
            <Route path="/manage/news" element={
              <ProtectedRoute>
                <NewsManagement />
              </ProtectedRoute>
            } />
            <Route path="/manage/news/add" element={
              <ProtectedRoute>
                <NewsForm />
              </ProtectedRoute>
            } />
            
            {/* Gallery Management Routes */}
            <Route path="/manage/gallery" element={
              <ProtectedRoute>
                <GalleryManagement />
              </ProtectedRoute>
            } />
            <Route path="/manage/gallery/upload" element={
              <ProtectedRoute>
                <GalleryUpload />
              </ProtectedRoute>
            } />
            
            {/* Applications Management Route */}
            <Route path="/manage/applications" element={
              <ProtectedRoute requiredRoles={['admin', 'co-admin']}>
                <ApplicationsManagement />
              </ProtectedRoute>
            } />
            
            {/* Personal Settings Route */}
            <Route path="/manage/personal-settings" element={
              <ProtectedRoute>
                <PersonalSettings />
              </ProtectedRoute>
            } />
            
            {/* System Settings Route */}
            <Route path="/manage/settings" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <SystemSettings />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
