import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { UserRole } from "../../types";
import { User, ShieldCheck, MapPin, Bell, Fingerprint, Wallet, LogIn, ChevronRight, Check, LogOut, Store, Truck, ShieldAlert } from "lucide-react";

interface UserProfileViewProps {
  setActiveTab?: (tab: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ setActiveTab }) => {
  const { user, updateUser, setIsOnboardingOpen, setOnboardingStep, currentRole, setCurrentRole } = useHomeli();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddressLine, setNewAddressLine] = useState("Calle de los Azahares 402, Lomas de Angelópolis");

  const handleSaveAddress = () => {
    updateUser({
      addresses: [
        { id: "a1", label: "Casa", addressLine: newAddressLine, city: "Puebla", lat: 19.0413, lng: -98.2062, isDefault: true },
        ...user.addresses.slice(1)
      ]
    });
    setIsEditingAddress(false);
  };

  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (setActiveTab) {
      if (role === "B2C") setActiveTab("inicio");
      if (role === "B2B") setActiveTab("negocios");
      if (role === "DRIVER") setActiveTab("delivery");
      if (role === "ADMIN") setActiveTab("admin");
    }
  };

  const handleLogout = () => {
    setOnboardingStep(6);
    setIsOnboardingOpen(true);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Profile Header */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center gap-4 text-slate-900 shadow-sm">
        <div className="relative">
          <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-amber-500" />
          <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
            ✓
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base text-slate-900 truncate">{user.name}</h2>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
              Rol Activo: {currentRole}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              KYC Verificado
            </span>
          </div>
        </div>
      </div>

      {/* Role Navigation & Logout Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-600" />
            Navegación de Roles
          </h3>
          <span className="text-[10px] text-slate-500">Cambiar vista del sistema</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSwitchRole("B2C")}
            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
              currentRole === "B2C" ? "bg-blue-50 border-blue-300 ring-1 ring-blue-400 font-bold" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-slate-800">1. Cliente (B2C)</span>
          </button>

          <button
            onClick={() => handleSwitchRole("B2B")}
            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
              currentRole === "B2B" ? "bg-pink-50 border-pink-300 ring-1 ring-pink-400 font-bold" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Store className="w-4 h-4 text-pink-600" />
            <span className="text-xs text-slate-800">2. Negocio (B2B)</span>
          </button>

          <button
            onClick={() => handleSwitchRole("DRIVER")}
            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
              currentRole === "DRIVER" ? "bg-amber-50 border-amber-300 ring-1 ring-amber-400 font-bold" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Truck className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-slate-800">3. Delivery</span>
          </button>

          <button
            onClick={() => handleSwitchRole("ADMIN")}
            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
              currentRole === "ADMIN" ? "bg-violet-50 border-violet-300 ring-1 ring-violet-400 font-bold" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-violet-600" />
            <span className="text-xs text-slate-800">4. Admin</span>
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-600/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Supabase Configuration Card */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 text-xs text-slate-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px]">⚡</div>
            <div>
              <h3 className="font-bold text-sm text-emerald-950">Supabase Configurado</h3>
              <p className="text-[11px] text-emerald-700 font-mono">Project ID: ejmuvdsqpbfnqzodxkgg</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold text-[10px] border border-emerald-300">
            Conectado
          </span>
        </div>
        <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-emerald-200 font-mono break-all">
          URL: https://ejmuvdsqpbfnqzodxkgg.supabase.co
        </div>
        <p className="text-[11px] text-emerald-900">
          El cliente SDK <code className="bg-emerald-100 px-1 py-0.5 rounded">@supabase/supabase-js</code> fue configurado en <code className="bg-emerald-100 px-1 py-0.5 rounded">src/lib/supabase.ts</code> y el archivo <code className="bg-emerald-100 px-1 py-0.5 rounded">supabase_schema.sql</code> fue generado.
        </p>
      </div>


      {/* Onboarding Flow Re-trigger Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-300 flex items-center justify-between text-xs text-slate-900 shadow-sm">
        <div>
          <div className="font-bold text-amber-900">Flujo de Onboarding & Autenticación</div>
          <div className="text-[11px] text-slate-600">Explora las 15 pantallas de login, registro, OTP y biometría</div>
        </div>
        <button
          onClick={() => {
            setOnboardingStep(1);
            setIsOnboardingOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow hover:bg-amber-400"
        >
          <span>Abrir Modal (15)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Addresses Section */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Direcciones Guardadas
          </h3>
          <button
            onClick={() => setIsEditingAddress(!isEditingAddress)}
            className="text-amber-600 hover:underline font-semibold"
          >
            {isEditingAddress ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditingAddress ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newAddressLine}
              onChange={(e) => setNewAddressLine(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
            />
            <button
              onClick={handleSaveAddress}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
            >
              Guardar Dirección
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {user.addresses.map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{a.label}</div>
                  <div className="text-slate-500">{a.addressLine}</div>
                </div>
                {a.isDefault && <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Principal</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security & Notifications Settings */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs text-slate-900 shadow-sm">
        <h3 className="font-bold text-sm">Seguridad & Ajustes</h3>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Notificaciones Push</span>
          </div>
          <input
            type="checkbox"
            checked={user.notificationsEnabled}
            onChange={() => updateUser({ notificationsEnabled: !user.notificationsEnabled })}
            className="w-4 h-4 accent-amber-500"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-sky-600" />
            <span>Acceso Biométrico (FaceID / TouchID)</span>
          </div>
          <input
            type="checkbox"
            checked={user.biometricsEnabled}
            onChange={() => updateUser({ biometricsEnabled: !user.biometricsEnabled })}
            className="w-4 h-4 accent-amber-500"
          />
        </div>
      </div>

    </div>
  );
};

