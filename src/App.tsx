import React, { useState } from "react";
import { HomeliProvider, useHomeli } from "./context/HomeliContext";
import { Header } from "./components/common/Header";
import { BottomNav } from "./components/common/BottomNav";
import { WebARViewer } from "./components/common/WebARViewer";
import { OnboardingFlowModal } from "./components/onboarding/OnboardingFlowModal";

import { B2CHomeView } from "./components/b2c/B2CHomeView";
import { ProductMarketplaceView } from "./components/b2c/ProductMarketplaceView";
import { ServiceMarketplaceView } from "./components/b2c/ServiceMarketplaceView";
import { SocialCommunityView } from "./components/b2c/SocialCommunityView";
import { WalletView } from "./components/b2c/WalletView";
import { ActivityView } from "./components/b2c/ActivityView";
import { NotificationsView } from "./components/b2c/NotificationsView";
import { UserProfileView } from "./components/b2c/UserProfileView";
import { CartCheckoutModal } from "./components/b2c/CartCheckoutModal";
import { LiveActivityTrackerModal } from "./components/b2c/LiveActivityTrackerModal";

import { B2BDashboardView } from "./components/b2b/B2BDashboardView";
import { HomeliAdsView } from "./components/b2b/HomeliAdsView";

import { DriverAppView } from "./components/driver/DriverAppView";
import { AdminDashboardView } from "./components/admin/AdminDashboardView";

import { AIAssistantWidget } from "./components/ai/AIAssistantWidget";

function AppContent() {
  const {
    currentRole,
    active3DProduct,
    setActive3DProduct,
    activeTrackBooking,
    setActiveTrackBooking,
    activeTrackOrder,
    setActiveTrackOrder
  } = useHomeli();

  const [activeTab, setActiveTab] = useState<string>("inicio");
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-violet-500 selection:text-white pb-12">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative border-x border-slate-200 flex flex-col">
        
        {/* Header Bar */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Body Content */}
        <main className="flex-1 px-4 py-4 overflow-y-auto">
          {activeTab === "inicio" && <B2CHomeView setActiveTab={setActiveTab} />}
          {activeTab === "servicios" && <ServiceMarketplaceView />}
          {activeTab === "ventas" && <ProductMarketplaceView onOpenCart={() => setIsCartOpen(true)} />}
          {activeTab === "mensajeria" && <SocialCommunityView />}
          {activeTab === "actividad" && <ActivityView />}
          {activeTab === "notificaciones" && <NotificationsView />}
          {activeTab === "perfil" && (
            <div className="space-y-6">
              <UserProfileView setActiveTab={setActiveTab} />
              <WalletView />
            </div>
          )}

          {activeTab === "negocios" && <B2BDashboardView />}
          {activeTab === "landing" && <HomeliAdsView />}
          {activeTab === "delivery" && <DriverAppView />}
          {activeTab === "admin" && <AdminDashboardView />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Global Overlays & Modals */}
        <OnboardingFlowModal />

        {active3DProduct && (
          <WebARViewer product={active3DProduct} onClose={() => setActive3DProduct(null)} />
        )}

        <CartCheckoutModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onOrderPlaced={(orderId) => {
            setActiveTab("actividad");
          }}
        />

        {(activeTrackOrder || activeTrackBooking) && (
          <LiveActivityTrackerModal
            order={activeTrackOrder}
            booking={activeTrackBooking}
            onClose={() => {
              setActiveTrackOrder(null);
              setActiveTrackBooking(null);
            }}
          />
        )}

        <AIAssistantWidget />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <HomeliProvider>
      <AppContent />
    </HomeliProvider>
  );
}
