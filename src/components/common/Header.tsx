import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { UserRole } from "../../types";
import { Bell, ShieldCheck, User, Store, Truck, ShieldAlert, Sparkles, LogOut, ChevronRight, X, LogIn } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, unreadNotificationsCount = 2 }) => {
  const { currentRole, setCurrentRole, user, setIsOnboardingOpen, setOnboardingStep, setIsAIAssistantOpen } = useHomeli();
  const [isRoleLogoutModalOpen, setIsRoleLogoutModalOpen] = useState(false);

  const roleInfo: Record<UserRole, { label: string; desc: string; icon: any; color: string; tagBg: string }> = {
    B2C: { label: "Cliente Final (B2C)", desc: "Marketplace 3D, servicios de limpieza y feed comunitario", icon: User, color: "text-blue-600 bg-blue-50 border-blue-200", tagBg: "bg-blue-100 text-blue-800" },
    B2B: { label: "Negocio / Merchant (B2B)", desc: "Consola de ventas, publicidad Homeli Ads y catálogo", icon: Store, color: "text-pink-600 bg-pink-50 border-pink-200", tagBg: "bg-pink-100 text-pink-800" },
    DRIVER: { label: "Repartidor (Delivery)", desc: "Consola de entregas GPS en vivo y ganancias", icon: Truck, color: "text-amber-600 bg-amber-50 border-amber-200", tagBg: "bg-amber-100 text-amber-800" },
    ADMIN: { label: "Super Admin", desc: "Monitoreo global, verificación KYC y disputas", icon: ShieldAlert, color: "text-violet-600 bg-violet-50 border-violet-200", tagBg: "bg-violet-100 text-violet-800" },
  };

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "B2C") setActiveTab("inicio");
    if (role === "B2B") setActiveTab("negocios");
    if (role === "DRIVER") setActiveTab("delivery");
    if (role === "ADMIN") setActiveTab("admin");
    setIsRoleLogoutModalOpen(false);
  };

  const handleLogout = () => {
    setIsRoleLogoutModalOpen(false);
    setOnboardingStep(6); // Step 6 is login/auth screen
    setIsOnboardingOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
        {/* Main App Brand Header */}
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveTab("inicio")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Logo Icon Graphic */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 p-0.5 shadow-md shadow-violet-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden relative border border-slate-100">
                <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h1 className="font-black text-xl tracking-tight text-slate-900 font-sans">
                  Homeli
                </h1>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold border-t border-slate-200 pt-0.5">
                SERVICIOS DE ESTILO DE VIDA
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* AI Bot Button */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="p-2.5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 hover:opacity-90 transition-all relative"
              title="Asistente IA Homeli"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Notifications Button with Red Dot */}
            <button
              onClick={() => setActiveTab("notificaciones")}
              className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Cerrar Sesión / Switch Role Button */}
            <button
              onClick={() => setIsRoleLogoutModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-sm"
              title="Cerrar sesión o cambiar de rol"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[11px]">Salir</span>
            </button>

          </div>
        </div>
      </header>

      {/* Role Selection & Logout Modal */}
      {isRoleLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Navegación & Sesión</h3>
                  <p className="text-xs text-slate-500">Selecciona un rol o cierra tu sesión</p>
                </div>
              </div>
              <button
                onClick={() => setIsRoleLogoutModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img src={user.avatar} alt="Avatar" className="w-11 h-11 rounded-full object-cover border-2 border-amber-500" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleInfo[currentRole].tagBg}`}>
                    Rol Activo: {currentRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Navigation Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cambiar Vista / Navegar en Rol
              </label>
              {(["B2C", "B2B", "DRIVER", "ADMIN"] as UserRole[]).map((r) => {
                const info = roleInfo[r];
                const IconComponent = info.icon;
                const isSelected = currentRole === r;

                return (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? "bg-violet-50 border-violet-300 ring-2 ring-violet-500/20"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`p-2 rounded-xl border ${info.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                        <span>{info.label}</span>
                        {isSelected && <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">Activo</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{info.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Actions: Onboarding & Logout */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsRoleLogoutModalOpen(false);
                  setOnboardingStep(1);
                  setIsOnboardingOpen(true);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogIn className="w-4 h-4 text-amber-600" />
                <span>Ver Flujo Onboarding Completo (15)</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-600/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión Activa</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

