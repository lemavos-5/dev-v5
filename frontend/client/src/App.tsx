import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Notes from "@/pages/Notes";
import NoteEditor from "@/pages/NoteEditor";
import KnowledgeGraph from "@/pages/KnowledgeGraph";
import Settings from "@/pages/Settings";
import SubscriptionSuccess from "@/pages/Subscription/Success";
import SubscriptionCancel from "@/pages/Subscription/Cancel";

function Router() {
  return (
    <Switch>
      {/* Root - Redireciona para login */}
      <Route path={"/"}>
        <Redirect to="/login" />
      </Route>

      {/* Auth Routes */}
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/forgot-password"} component={ForgotPassword} />

      {/* Protected Routes */}
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/notes"} component={Notes} />
      <Route path={"/notes/new"} component={NoteEditor} />
      <Route path={"/notes/:id"} component={NoteEditor} />
      <Route path={"/graph"} component={KnowledgeGraph} />
      <Route path={"/settings"} component={Settings} />

      {/* Subscription Routes */}
      <Route path={"/subscription/success"} component={SubscriptionSuccess} />
      <Route path={"/subscription/cancel"} component={SubscriptionCancel} />

      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
