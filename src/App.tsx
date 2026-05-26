import { Switch, Route, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { RendererPage } from "@/pages/RendererPage";
import { FormsPage } from "@/pages/FormsPage";
import { TablePage } from "@/pages/TablePage";
import { ConfigsPage } from "@/pages/ConfigsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/"         component={DashboardPage} />
      <Route path="/renderer" component={RendererPage} />
      <Route path="/forms"    component={FormsPage} />
      <Route path="/table"    component={TablePage} />
      <Route path="/configs"  component={ConfigsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AppLayout>
          <Router />
        </AppLayout>
      </WouterRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
