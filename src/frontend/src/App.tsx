import { useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  Flag,
  HelpCircle,
  Languages,
  MapPin,
  Newspaper,
  Scale,
  ShoppingBag,
  UserCircle,
} from "lucide-react";
import React, { useState } from "react";
import ArabicLessonsScreen from "./components/ArabicLessonsScreen";
import FeedScreen from "./components/FeedScreen";
import GetPremiumModal from "./components/GetPremiumModal";
import IntroScreen from "./components/IntroScreen";
import LegalAssistanceScreen from "./components/LegalAssistanceScreen";
import PaymentFailure from "./components/PaymentFailure";
import PaymentSuccess from "./components/PaymentSuccess";
import PremiumProductsScreen from "./components/PremiumProductsScreen";
import PremiumShopScreen from "./components/PremiumShopScreen";
import ProductsScreen from "./components/ProductsScreen";
import ProfileDrawer from "./components/ProfileDrawer";
import ProfileScreen from "./components/ProfileScreen";
import QuizScreen from "./components/QuizScreen";
import ReclamationsScreen from "./components/ReclamationsScreen";
import ScamStoriesScreen from "./components/ScamStoriesScreen";
import TipsScreen from "./components/TipsScreen";
import TouristSitesScreen from "./components/TouristSitesScreen";
import TransportScreen from "./components/TransportScreen";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

function Layout() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        console.error("Login error:", error);
        if (
          error instanceof Error &&
          error.message === "User is already authenticated"
        ) {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  // 7 nav items in the top bar (Conseils merged into Arnaques & Conseils)
  const topNavItems = [
    { label: "Feed", path: "/feed", icon: Newspaper },
    { label: "Produits", path: "/products", icon: ShoppingBag },
    { label: "Quiz", path: "/quiz", icon: HelpCircle },
    { label: "Sites", path: "/tourist-sites", icon: MapPin },
    { label: "Apprendre l'arabe", path: "/arabic-lessons", icon: Languages },
    {
      label: "Arnaques & Conseils",
      path: "/scam-stories",
      icon: AlertTriangle,
    },
    { label: "Réclamations", path: "/reclamations", icon: Flag },
    {
      label: "Assistance Juridique",
      path: "/assistance-juridique",
      icon: Scale,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Main header ── */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-3">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.logo"
          >
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent whitespace-nowrap">
              No More Scam
            </span>
          </button>

          {/* Desktop tab links — hidden on mobile, shown md+ */}
          <nav
            className="hidden md:flex items-center gap-1 flex-1 mx-2 overflow-x-auto"
            data-ocid="nav.topbar"
          >
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  type="button"
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  data-ocid={`nav.tab.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right side: profile icon + auth */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Profile icon — opens drawer */}
            <button
              type="button"
              onClick={() => setProfileDrawerOpen(true)}
              data-ocid="nav.profile_button"
              className="p-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Profil"
            >
              <UserCircle className="h-5 w-5" />
            </button>

            {/* Login / Logout */}
            <Button
              onClick={handleAuth}
              disabled={loginStatus === "logging-in"}
              variant={isAuthenticated ? "outline" : "default"}
              size="sm"
              data-ocid="nav.auth_button"
            >
              {loginStatus === "logging-in"
                ? "Connexion..."
                : isAuthenticated
                  ? "Déconnexion"
                  : "Connexion"}
            </Button>
          </div>
        </div>

        {/* Mobile tab row — visible only on small screens, shows all 8 nav items */}
        <div className="md:hidden border-t bg-background overflow-x-auto">
          <nav
            className="flex items-center gap-1 px-3 py-2 min-w-max"
            data-ocid="nav.mobile_topbar"
          >
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  type="button"
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  data-ocid={`nav.mobile_tab.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} No More Scam. Tous droits réservés.
            </div>
            <div className="text-sm text-muted-foreground">
              Fait avec ❤️ grâce à{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Get Premium Modal */}
      <GetPremiumModal
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
      />

      {/* Profile Drawer */}
      <ProfileDrawer
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
      />

      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IntroScreen,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feed",
  component: FeedScreen,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsScreen,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizScreen,
});

const tipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tips",
  component: TipsScreen,
});

const arabicLessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/arabic-lessons",
  component: ArabicLessonsScreen,
});

const touristSitesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tourist-sites",
  component: TouristSitesScreen,
});

const scamStoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scam-stories",
  component: ScamStoriesScreen,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfileScreen,
});

const premiumShopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/premium/shop",
  component: PremiumShopScreen,
});

const premiumProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/premium/products",
  component: PremiumProductsScreen,
});

const transportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/premium/transport",
  component: TransportScreen,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});

const reclamationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reclamations",
  component: ReclamationsScreen,
});

const legalAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assistance-juridique",
  component: LegalAssistanceScreen,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  feedRoute,
  productsRoute,
  quizRoute,
  tipsRoute,
  arabicLessonsRoute,
  touristSitesRoute,
  scamStoriesRoute,
  profileRoute,
  premiumShopRoute,
  premiumProductsRoute,
  transportRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  reclamationsRoute,
  legalAssistanceRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
