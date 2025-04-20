import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TransferMoney from "@/pages/TransferMoney";
import TransferConfirmation from "@/pages/TransferConfirmation";
import TransferSuccess from "@/pages/TransferSuccess";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/transfer" component={TransferMoney} />
      <Route path="/confirm" component={TransferConfirmation} />
      <Route path="/success" component={TransferSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  );
}

export default App;
