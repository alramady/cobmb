import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import CityPage from "./pages/CityPage";
import NeighborhoodPage from "./pages/NeighborhoodPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import ForOwners from "./pages/ForOwners";
import Booking from "./pages/Booking";
import AccountDashboard from "./pages/AccountDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import ClientLogin from "./pages/ClientLogin";
import ClientSignup from "./pages/ClientSignup";
import Careers from "./pages/Careers";
import AppDownload from "./pages/AppDownload";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CoBnBPlus from "./pages/CoBnBPlus";
import WhatsAppButton from "./components/WhatsAppButton";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/services/:sub" component={Services} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/cities/:citySlug" component={CityPage} />
      <Route path="/cities/:citySlug/:neighborhoodSlug" component={NeighborhoodPage} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/contact" component={Contact} />
      <Route path="/owners" component={ForOwners} />
      <Route path="/login" component={ClientLogin} />
      <Route path="/signup" component={ClientSignup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/booking" component={Booking} />
      <Route path="/account" component={AccountDashboard} />
      <Route path="/account/:tab" component={AccountDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin/:section" component={AdminPanel} />
      <Route path="/careers" component={Careers} />
      <Route path="/app-download" component={AppDownload} />
      <Route path="/cobnb-plus" component={CoBnBPlus} />
      <Route path="/list-property" component={ForOwners} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <WhatsAppButton />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
