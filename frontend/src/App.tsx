import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuthStore } from './stores/useAuthStore';
import { validateEnv, logEndpoints, ENV } from './config/env';

import MarketingLayout from './layout/MarketingLayout';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './router/ProtectedRoute';

import Landing from './pages/Landing';
import PricingPage from './pages/PricingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteEditor from './pages/NoteEditor';
import Entities from './pages/Entities';
import EntityDetails from './pages/EntityDetails';
import SettingsPage from './pages/SettingsPage';
import Billing from './pages/Billing';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();
  
  useEffect(() => {
    // Validate environment on app startup
    validateEnv();
    
    // Log available endpoints in development
    logEndpoints();
    
    // Initialize authentication
    initialize();
  }, []);
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppInitializer>
          <Routes>
            {/* Marketing */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* App (protected) */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<NoteEditor />} />
              <Route path="/entities" element={<Entities />} />
              <Route path="/entities/:id" element={<EntityDetails />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/billing" element={<Billing />} />
            </Route>

            {/* Subscription callbacks */}
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
