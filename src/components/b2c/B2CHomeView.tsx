import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import {
  Shield,
  Wrench,
  ShoppingBag,
  Send,
  Building,
  Sparkles,
  ChevronRight,
  Sparkle,
  ArrowRight,
  TrendingUp,
  Box,
  Star,
  MapPin,
  Clock,
  Wallet,
  Gift
} from "lucide-react";

interface B2CHomeViewProps {
  setActiveTab: (tab: string) => void;
}

export const B2CHomeView: React.FC<B2CHomeViewProps> = ({ setActiveTab }) => {
  const {
    user,
    setIsOnboardingOpen,
    setOnboardingStep,
    setCurrentRole,
    products,
    setActive3DProduct,
    services,
    setIsAIAssistantOpen,
  } = useHomeli();

  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Fetch AI Recommendations from Express server backend
  const fetchRecommendations = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInterests: user.interests,
          userLocation: user.city,
          query: "Sugiéreme 2 servicios urgentes y 1 producto de limpieza 3D WebAR para mi hogar",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAiRecommendations(json.data);
      } else {
        setAiRecommendations(json.fallback);
      }
    } catch (e) {
      setAiRecommendations({
        greeting: "¡Hola! Te presentamos las recomendaciones más solicitadas en Puebla hoy.",
        recommendedServices: [
          {
            title: "Servicio de Limpieza Profunda Residencial",
            category: "Limpieza",
            reason: "Popular en tu zona esta semana",
            estimatedPrice: "$650 MXN",
            rating: 4.95,
          },
        ],
        recommendedProducts: [
          {
            title: "Kit Limpiador Multiusos Biodegradable 3D",
            category: "Desinfectantes",
            reason: "Pruébalo con la cámara WebAR antes de comprar",
            price: "$289 MXN",
            has3D: true,
          },
        ],
        smartTip: "Utiliza paños de microfibra de colores distintos para baño y cocina para evitar contaminación cruzada.",
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      
      {/* 1. HERO BANNER CARD (Matching Image 1 EXACTLY) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-5 text-white shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-left max-w-xs sm:max-w-sm">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Sincroniza tu vida, <br />
              <span className="text-indigo-400">simplifica tu mundo</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conecta tus pedidos, servicios y negocios en vivo con Homeli de forma rápida y segura.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setOnboardingStep(6);
                  setIsOnboardingOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>🔑 Iniciar sesión / Registrarse</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Mascot Elephant/Boy Character Illustration */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-violet-600/30 to-indigo-500/30 p-2 flex items-center justify-center relative">
              <div className="text-6xl animate-pulse">🐘👍</div>
              {/* Checkmark bubble badge */}
              <div className="absolute top-1 right-1 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-lg font-bold text-xs">
                ✓
              </div>
              {/* Heart bubble badge */}
              <div className="absolute bottom-1 left-1 p-1.5 rounded-full bg-rose-500 text-white shadow-lg text-xs">
                ❤️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 2x3 MAIN CATEGORY GRID CARDS (White Theme) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-sm text-slate-900">Explorar Módulos Principales</h3>
          <span className="text-[11px] text-slate-500 font-medium">Super App Homeli</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Admin */}
          <div
            onClick={() => {
              setCurrentRole("ADMIN");
              setActiveTab("admin");
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-500 hover:bg-slate-50 cursor-pointer transition-all group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:text-violet-600 group-hover:bg-violet-100 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-violet-700 transition-colors">Admin</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                Panel administrativo y control total
              </p>
            </div>
          </div>

          {/* Card 2: Servicios */}
          <div
            onClick={() => setActiveTab("servicios")}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-slate-50 cursor-pointer transition-all group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-100 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">Servicios</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                Gestiona y ofrece tus servicios
              </p>
            </div>
          </div>

          {/* Card 3: Ventas (Marketplace Products) */}
          <div
            onClick={() => setActiveTab("ventas")}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-slate-50 cursor-pointer transition-all group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-100 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">Ventas</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                Vende productos y gestiona pedidos
              </p>
            </div>
          </div>

          {/* Card 4: Mensajería (Social Feed & Chat) */}
          <div
            onClick={() => setActiveTab("mensajeria")}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:bg-slate-50 cursor-pointer transition-all group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:text-sky-600 group-hover:bg-sky-100 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">Mensajería</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                Chat rápido y seguro en tiempo real
              </p>
            </div>
          </div>

          {/* Card 5: Negocios (B2B Merchant Hub) */}
          <div
            onClick={() => {
              setCurrentRole("B2B");
              setActiveTab("negocios");
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-pink-500 hover:bg-slate-50 cursor-pointer transition-all group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20 group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6" />
              </div>
              <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:text-pink-600 group-hover:bg-pink-100 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-pink-700 transition-colors">Negocios</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                Administra tus negocios y aliados
              </p>
            </div>
          </div>

          {/* Card 6: Landing Page / PUB Ads */}
          <div
            onClick={() => {
              setCurrentRole("B2B");
              setActiveTab("landing");
            }}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px]">
                PUB
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                Landing Page
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                Crea páginas increíbles en minutos
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. GEMINI AI RECOMMENDATIONS ENGINE WIDGET */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-violet-200 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
              <Sparkle className="w-4 h-4 animate-spin" />
            </div>
            <h4 className="font-bold text-xs text-violet-900 uppercase tracking-wider">
              Recomendaciones con Inteligencia Artificial
            </h4>
          </div>
          <button
            onClick={fetchRecommendations}
            disabled={isLoadingAi}
            className="text-[11px] font-semibold text-violet-700 hover:text-violet-900 underline"
          >
            {isLoadingAi ? "Generando..." : "Generar nuevas 🔄"}
          </button>
        </div>

        {aiRecommendations ? (
          <div className="space-y-2 text-xs">
            <p className="text-slate-700 italic font-medium bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
              "{aiRecommendations.greeting}"
            </p>

            {aiRecommendations.recommendedServices && aiRecommendations.recommendedServices.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Servicio sugerido:</span>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="font-bold text-slate-900">{aiRecommendations.recommendedServices[0].title}</div>
                    <div className="text-[10px] text-slate-500">{aiRecommendations.recommendedServices[0].reason}</div>
                  </div>
                  <button
                    onClick={() => setActiveTab("servicios")}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-[11px] hover:bg-teal-700"
                  >
                    Contratar {aiRecommendations.recommendedServices[0].estimatedPrice}
                  </button>
                </div>
              </div>
            )}

            {aiRecommendations.smartTip && (
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <span>💡</span>
                <span><strong>Tip de Hogar:</strong> {aiRecommendations.smartTip}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-sm">
            <span>Obtén sugerencias personalizadas de productos y técnicos para tu hogar.</span>
            <button
              onClick={fetchRecommendations}
              className="px-3 py-1.5 rounded-xl bg-violet-600 text-white font-bold text-[11px] flex items-center gap-1 shadow hover:bg-violet-700"
            >
              Consultar IA <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 4. WEBAR 3D HIGHLIGHTED PRODUCTS SLIDER */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-600" />
            Productos con WebAR 3D
          </h3>
          <button
            onClick={() => setActiveTab("ventas")}
            className="text-xs text-violet-600 hover:underline font-semibold"
          >
            Ver todos ({products.length})
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => setActive3DProduct(product)}
              className="w-44 flex-shrink-0 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="relative h-28 bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow">
                  <Box className="w-3 h-3" /> 3D AR
                </span>
              </div>
              <div className="p-3 space-y-1">
                <h4 className="font-bold text-xs text-slate-900 truncate">{product.title}</h4>
                <div className="text-[10px] text-slate-500">{product.merchantName}</div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-extrabold text-sm text-emerald-700">${product.price.toLocaleString()} MXN</span>
                  <div className="flex items-center text-[10px] text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
