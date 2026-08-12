import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Globe,
  MapPin,
  Smartphone,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Bell,
  Fingerprint,
  Sparkles,
  ArrowRight,
  Upload,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";

export const OnboardingFlowModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, onboardingStep, setOnboardingStep, updateUser, user, setCurrentRole } = useHomeli();

  // Local state for step inputs
  const [selectedLang, setSelectedLang] = useState<"es" | "en">("es");
  const [selectedRoleUsage, setSelectedRoleUsage] = useState<"user" | "business" | "both">("user");
  const [phoneNumber, setPhoneNumber] = useState("+52 222 628 5414");
  const [otpCode, setOtpCode] = useState(["2", "4", "5", "7", "8", "6"]);
  const [emailInput, setEmailInput] = useState("mano.varadhan@email.com");
  const [passwordInput, setPasswordInput] = useState("••••••••");
  const [fullNameInput, setFullNameInput] = useState(user.name);
  const [cityInput, setCityInput] = useState("Puebla, México");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests);
  const [kycDocType, setKycDocType] = useState("INE / Cédula");

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (onboardingStep === 13) {
      // Welcome finish
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setIsOnboardingOpen(false);
      return;
    }
    setOnboardingStep(onboardingStep + 1);
  };

  const handlePrev = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    } else {
      setIsOnboardingOpen(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-2xl text-slate-900 flex flex-col min-h-[640px] max-h-[92vh]">
        
        {/* Top Stepper Indicator */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-10">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-amber-700">
              Pantalla {onboardingStep} / 15
            </span>
            <span className="text-[10px] text-slate-500">
              ({onboardingStep === 1 ? "Splash" : onboardingStep === 2 ? "Intro" : onboardingStep === 3 ? "Idioma" : onboardingStep === 4 ? "Rol" : onboardingStep === 5 ? "Ubicación" : onboardingStep === 6 ? "Acceso" : onboardingStep === 7 ? "OTP" : onboardingStep === 8 ? "Login Correo" : onboardingStep === 9 ? "Registro" : onboardingStep === 10 ? "Perfil" : onboardingStep === 11 ? "Alertas" : onboardingStep === 12 ? "Biometría" : onboardingStep === 13 ? "Bienvenida" : onboardingStep === 14 ? "Password" : "KYC"})
            </span>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-amber-500 h-1 transition-all duration-300"
            style={{ width: `${(onboardingStep / 15) * 100}%` }}
          />
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
          
          {/* SCREEN 1: SPLASH SCREEN (Image 2 - Screen 1) */}
          {onboardingStep === 1 && (
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-6">
              <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-1 shadow-xl">
                <div className="w-full h-full bg-white rounded-[22px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                  <img
                    src="https://ejmuvdsqpbfnqzodxkgg.supabase.co/storage/v1/object/public/graficos/homelilogo.png"
                    alt="Homeli Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                  Homeli
                </h2>
                <p className="text-xs uppercase tracking-widest text-violet-700 font-bold mt-1">
                  SERVICIOS DE ESTILO DE VIDA
                </p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Tu vida más fácil, en una sola app.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 text-xs text-slate-500">
                <span>🔒 Seguro</span>
                <span>•</span>
                <span>⚡ En tiempo real</span>
                <span>•</span>
                <span>🌐 WebAR 3D</span>
              </div>
            </div>
          )}

          {/* SCREEN 2: ONBOARDING CAROUSEL (Image 2 - Screen 2) */}
          {onboardingStep === 2 && (
            <div className="flex flex-col items-center text-center my-auto space-y-6">
              <div className="text-5xl p-4 bg-violet-100 rounded-full border border-violet-200">
                🐘🏡
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Todo para tu hogar en una sola app
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Servicios • Compras Marketplace • Negocios • Mensajes • Entregas
                </p>
              </div>

              <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Contrata plomeros, limpieza y técnicos certificados.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Visualiza productos e insumos de limpieza con WebAR 3D.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Seguimiento GPS en vivo de tu delivery y técnico.</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: SELECT LANGUAGE (Image 2 - Screen 3) */}
          {onboardingStep === 3 && (
            <div className="space-y-6 my-auto">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Selecciona tu idioma</h3>
                <p className="text-xs text-slate-500 mt-1">Puedes cambiarlo más tarde en ajustes</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedLang("es")}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    selectedLang === "es"
                      ? "bg-violet-50 border-violet-500 text-slate-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇲🇽</span>
                    <div>
                      <div className="font-semibold text-sm">Español</div>
                      <div className="text-xs text-slate-500">Idioma principal</div>
                    </div>
                  </div>
                  {selectedLang === "es" && <Check className="w-5 h-5 text-violet-600" />}
                </button>

                <button
                  onClick={() => setSelectedLang("en")}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    selectedLang === "en"
                      ? "bg-violet-50 border-violet-500 text-slate-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇺🇸</span>
                    <div>
                      <div className="font-semibold text-sm">English</div>
                      <div className="text-xs text-slate-500">Secondary language</div>
                    </div>
                  </div>
                  {selectedLang === "en" && <Check className="w-5 h-5 text-violet-600" />}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: SELECT ROLE USAGE (Image 2 - Screen 4) */}
          {onboardingStep === 4 && (
            <div className="space-y-6 my-auto">
              <div className="text-center">
                <div className="text-3xl mb-2">🐘❓</div>
                <h3 className="text-lg font-bold text-slate-900">¿Cómo usarás Homeli?</h3>
                <p className="text-xs text-slate-500 mt-1">Adapta la interfaz a tus necesidades</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedRoleUsage("user");
                    setCurrentRole("B2C");
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    selectedRoleUsage === "user"
                      ? "bg-amber-50 border-amber-500 text-slate-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">👤 Usuario</div>
                  <div className="text-xs text-slate-500 mt-0.5">Para recibir servicios, comprar y disfrutar</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedRoleUsage("business");
                    setCurrentRole("B2B");
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    selectedRoleUsage === "business"
                      ? "bg-amber-50 border-amber-500 text-slate-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">🏢 Negocio / Empresa</div>
                  <div className="text-xs text-slate-500 mt-0.5">Para ofrecer servicios y vender productos</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedRoleUsage("both");
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    selectedRoleUsage === "both"
                      ? "bg-amber-50 border-amber-500 text-slate-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">🤝 Ambos</div>
                  <div className="text-xs text-slate-500 mt-0.5">Disfruta y haz crecer tu negocio</div>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: LOCATION PERMISSION (Image 2 - Screen 5) */}
          {onboardingStep === 5 && (
            <div className="text-center space-y-6 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Permitir ubicación</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Te mostraremos servicios, ofertas y negocios cerca de ti
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-800">Ofertas locales personalizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-800">Proveedores y especialistas cercanos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-800">Entrega de productos más rápida con GPS</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 6: LOGIN / AUTH HUB (Image 2 - Screen 6) */}
          {onboardingStep === 6 && (
            <div className="space-y-4 my-auto">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Iniciar sesión o Registrarse</h3>
                <p className="text-xs text-slate-500 mt-1">Ingresa para seguir disfrutando de todos los servicios</p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setOnboardingStep(10)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 font-semibold text-xs flex items-center justify-center gap-3 hover:bg-slate-200 transition-colors"
                >
                  <span className="text-base">🌐</span> Continuar con Google
                </button>

                <button
                  onClick={() => setOnboardingStep(10)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors"
                >
                  <span className="text-base">🍎</span> Continuar con Apple
                </button>

                <button
                  onClick={() => setOnboardingStep(10)}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors"
                >
                  <span className="text-base">📘</span> Continuar con Facebook
                </button>

                <div className="relative py-2 flex items-center justify-center text-xs text-slate-400">
                  <span className="bg-white px-3 z-10">o</span>
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                </div>

                <button
                  onClick={() => setOnboardingStep(7)}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
                >
                  <Smartphone className="w-4 h-4" /> Ingresar con teléfono
                </button>

                <button
                  onClick={() => setOnboardingStep(8)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Ingresar con correo
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 7: PHONE OTP VERIFICATION (Image 2 - Screen 7) */}
          {onboardingStep === 7 && (
            <div className="space-y-6 my-auto text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Verifica tu código</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hemos enviado un código SMS al +52 222 628 5414
                </p>
              </div>

              {/* 6-box OTP code input */}
              <div className="flex items-center justify-center gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const copy = [...otpCode];
                      copy[idx] = e.target.value;
                      setOtpCode(copy);
                    }}
                    className="w-11 h-12 rounded-xl bg-slate-50 border border-amber-500 text-center text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                ))}
              </div>

              <p className="text-xs text-slate-500">
                Reenviar código en <span className="text-amber-700 font-mono font-bold">00:28</span>
              </p>
            </div>
          )}

          {/* SCREEN 8: EMAIL LOGIN FORM (Image 2 - Screen 8) */}
          {onboardingStep === 8 && (
            <div className="space-y-5 my-auto">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Iniciar sesión con correo</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <label className="flex items-center gap-1.5 text-slate-700">
                    <input type="checkbox" defaultChecked className="accent-amber-500" />
                    Recordarme
                  </label>
                  <button onClick={() => setOnboardingStep(14)} className="text-amber-700 font-medium hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  ¿Aún no tienes cuenta?{" "}
                  <button onClick={() => setOnboardingStep(9)} className="text-amber-700 font-bold hover:underline">
                    Regístrate
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 9: CREATE ACCOUNT FORM (Image 2 - Screen 9) */}
          {onboardingStep === 9 && (
            <div className="space-y-4 my-auto">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Crear cuenta</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                  <div className="mt-1 space-y-0.5 text-[10px] text-emerald-700 font-medium">
                    <div>✓ 8+ caracteres</div>
                    <div>✓ Mayúscula y minúscula</div>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[10px] text-slate-600 pt-1">
                  <input type="checkbox" defaultChecked className="accent-amber-500 mt-0.5" />
                  Acepto los Términos y Condiciones y la Política de Privacidad de Homeli.
                </label>
              </div>
            </div>
          )}

          {/* SCREEN 10: COMPLETE PROFILE (Image 2 - Screen 10) */}
          {onboardingStep === 10 && (
            <div className="space-y-4 my-auto">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Completa tu perfil</h3>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-500"
                  />
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-amber-500 text-slate-950 font-bold shadow-md">
                    ✏️
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-slate-600 mb-0.5">Nombre</label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-0.5">Ciudad</label>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Intereses principales</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Servicios del hogar", "Compras", "Fitness", "Mascotas", "Tecnología"].map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          selectedInterests.includes(item)
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 11: PUSH NOTIFICATIONS PROMPT (Image 2 - Screen 11) */}
          {onboardingStep === 11 && (
            <div className="space-y-6 my-auto text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Bell className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Mantente siempre informado</h3>
                <p className="text-xs text-slate-500 mt-1">Activa alertas para no perderte actualizaciones clave</p>
              </div>

              <div className="space-y-2.5 text-xs text-left">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-800">Ofertas y promociones</span>
                  <input type="checkbox" defaultChecked className="accent-amber-500 w-4 h-4" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-800">Actualizaciones de servicios</span>
                  <input type="checkbox" defaultChecked className="accent-amber-500 w-4 h-4" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-800">Estado de tus pedidos</span>
                  <input type="checkbox" defaultChecked className="accent-amber-500 w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 12: BIOMETRIC AUTH (Image 2 - Screen 12) */}
          {onboardingStep === 12 && (
            <div className="space-y-6 my-auto text-center">
              <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 mx-auto flex items-center justify-center">
                <Fingerprint className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Acceso rápido y seguro</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ¿Quieres activar el inicio de sesión con tu huella o reconocimiento facial?
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <button className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-medium text-slate-800 flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-sky-600" /> Huella digital
                </button>
                <button className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left font-medium text-slate-800 flex items-center gap-3">
                  <span>👤</span> Face ID
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 13: WELCOME MODAL (Image 2 - Screen 13) */}
          {onboardingStep === 13 && (
            <div className="text-center space-y-6 my-auto">
              <div className="text-6xl animate-bounce">🎉</div>
              <div>
                <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>¡Bienvenido a Homeli!</h3>
                <p className="text-xs text-amber-700 font-bold mt-1">
                  Todo listo para disfrutar de una vida más fácil
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div>✨ Tu perfil ha sido verificado</div>
                <div>💰 Recibiste +100 Puntos Homeli de regalo</div>
              </div>
            </div>
          )}

          {/* SCREEN 14: FORGOT PASSWORD (Image 2 - Screen 14) */}
          {onboardingStep === 14 && (
            <div className="space-y-6 my-auto">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Recuperar contraseña</h3>
                <p className="text-xs text-slate-500 mt-1">Ingresa tu correo para recibir las instrucciones</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 15: KYC ID DOCUMENT UPLOAD (Extra security screen) */}
          {onboardingStep === 15 && (
            <div className="space-y-6 my-auto">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-violet-100 text-violet-700 mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Verificación KYC de Identidad</h3>
                <p className="text-xs text-slate-500 mt-1">Sube tu identificación para transacciones seguras</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Tipo de documento</label>
                  <select
                    value={kycDocType}
                    onChange={(e) => setKycDocType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="INE / Cédula">INE / Cédula Oficial</option>
                    <option value="Pasaporte">Pasaporte Internacional</option>
                    <option value="Comprobante Fiscal">Comprobante Fiscal (KYB)</option>
                  </select>
                </div>

                <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                  <div className="font-semibold text-slate-900">Haz clic o arrastra foto del documento</div>
                  <div className="text-[10px] text-slate-500 mt-1">JPG, PNG o PDF (Máx 10MB)</div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Button */}
          <div className="pt-6">
            <button
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {onboardingStep === 1 && "Comenzar →"}
              {onboardingStep === 2 && "Continuar →"}
              {onboardingStep === 3 && "Continuar →"}
              {onboardingStep === 4 && "Continuar →"}
              {onboardingStep === 5 && "Activar ubicación →"}
              {onboardingStep === 6 && "Siguiente →"}
              {onboardingStep === 7 && "Verificar código →"}
              {onboardingStep === 8 && "Iniciar sesión →"}
              {onboardingStep === 9 && "Crear cuenta →"}
              {onboardingStep === 10 && "Guardar perfil →"}
              {onboardingStep === 11 && "Activar notificaciones →"}
              {onboardingStep === 12 && "Activar biometría →"}
              {onboardingStep === 13 && "Explorar Homeli 🚀"}
              {onboardingStep === 14 && "Enviar instrucciones →"}
              {onboardingStep === 15 && "Enviar documento →"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
