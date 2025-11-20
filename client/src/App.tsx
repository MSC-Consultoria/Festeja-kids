import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Festas from "./pages/Festas";
import NovaFesta from "./pages/NovaFesta";
import Clientes from "./pages/Clientes";
import Calendario from "./pages/Calendario";
import Custos from "./pages/Custos";
import Agenda from "./pages/Agenda";
import Financeiro from "./pages/Financeiro";
import RegistrarPagamento from "./pages/RegistrarPagamento";
import Relatorios from "./pages/Relatorios";
import AcompanhamentoPagamentos from "./pages/AcompanhamentoPagamentos";
import ProjecaoFinanceira from "./pages/ProjecaoFinanceira";
import LandingPage from "./pages/LandingPage";
import Agendamento from "./pages/Agendamento";
import AdminAgendamentos from "./pages/AdminAgendamentos";
import CRM from "./pages/CRM";

function Router() {
  return (
    <Switch>
      {/* Rotas Públicas */}
      <Route path="/" component={LandingPage} />
      <Route path="/agendamento" component={Agendamento} />

      {/* Área Administrativa */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin/agendamentos" component={AdminAgendamentos} />
      <Route path="/festas" component={Festas} />
      <Route path="/festas/nova" component={NovaFesta} />
      <Route path="/clientes" component={Clientes} />
      <Route path="/crm" component={CRM} />
      <Route path="/calendario" component={Calendario} />
      <Route path="/custos" component={Custos} />
      <Route path="/agenda" component={Agenda} />
      <Route path="/financeiro" component={Financeiro} />
      <Route path="/financeiro/registrar" component={RegistrarPagamento} />
      <Route path="/relatorios" component={Relatorios} />
      <Route path="/acompanhamento" component={AcompanhamentoPagamentos} />
      <Route path="/projecao" component={ProjecaoFinanceira} />

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
