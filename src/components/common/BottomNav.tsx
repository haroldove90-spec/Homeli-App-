import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Home, Activity, Plus, Bell, User, ShoppingBag, Wrench, Wallet, PlusCircle, X } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { cartTotalItems, setIsOnboardingOpen, setOnboardingStep } = useHomeli();
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  return (
    <>
      {/* Quick Actions Drawer Overlay */}
      {isQuickMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-violet-600" />
                Acciones Rápidas Homeli
              </h3>
              <button
                onClick={() => setIsQuickMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setActiveTab("servicios");
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Contratar Servicio</div>
                  <div className="text-xs text-slate-500">Plomero, limpieza, etc.</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setActiveTab("ventas");
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Comprar Productos 3D</div>
                  <div className="text-xs text-slate-500">Marketplace con AR</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setActiveTab("mensajeria");
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Comunidad & Feed</div>
                  <div className="text-xs text-slate-500">Publicar recomendación</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setActiveTab("perfil");
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Billetera & Puntos</div>
                  <div className="text-xs text-slate-500">Saldo y recargas</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Nav Bar matching White Theme */}
      <div className="fixed bottom-3 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-500 w-auto sm:w-[500px] max-w-full px-6 py-2 shadow-xl rounded-full">
        <div className="flex items-center justify-between relative">
          
          {/* 1. Inicio */}
          <button
            onClick={() => setActiveTab("inicio")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "inicio" ? "text-violet-600 font-bold" : "hover:text-slate-900"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Inicio</span>
          </button>

          {/* 2. Actividad */}
          <button
            onClick={() => setActiveTab("actividad")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "actividad" ? "text-violet-600 font-bold" : "hover:text-slate-900"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px]">Actividad</span>
          </button>

          {/* 3. Central Plus (+) Action Button */}
          <div className="relative -top-5">
            <button
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-transform ring-4 ring-white"
              title="Acciones Rápidas"
            >
              <Plus className={`w-7 h-7 transition-transform ${isQuickMenuOpen ? "rotate-45" : ""}`} />
            </button>
          </div>

          {/* 4. Notificaciones */}
          <button
            onClick={() => setActiveTab("notificaciones")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "notificaciones" ? "text-violet-600 font-bold" : "hover:text-slate-900"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-[10px]">Notificaciones</span>
          </button>

          {/* 5. Perfil */}
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "perfil" ? "text-violet-600 font-bold" : "hover:text-slate-900"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Perfil</span>
          </button>

        </div>
      </div>
    </>
  );
};
