import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Product3D, Order } from "../../types";
import {
  Store,
  Plus,
  Box,
  Check,
  Clock,
  Package,
  AlertCircle,
  TrendingUp,
  Award,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  MessageSquare,
  Truck,
  Building,
  DollarSign
} from "lucide-react";
import { OrderChatModal } from "../marketplace/OrderChatModal";

export const B2BDashboardView: React.FC = () => {
  const {
    products,
    addProduct,
    orders,
    updateOrderStatus,
    vendorReputations,
    merchantPayouts,
    requestMerchantPayout
  } = useHomeli();

  const [activeTab, setActiveTab] = useState<"inventory" | "orders" | "finances" | "reputation" | "kyb">("inventory");

  // Merchant identifier for active vendor
  const merchantId = "m-101";
  const rep = vendorReputations[merchantId] || {
    merchantId,
    merchantName: "EcoClean Insumos",
    level: "platinum",
    levelLabel: "MercadoLíder Platinum 🏅",
    onTimeDispatchPercent: 98.6,
    complaintRatePercent: 0.3,
    cancellationRatePercent: 0.2,
    completedSales60Days: 480,
    rating: 4.95,
    escrowBalance: 1250,
    availableBalance: 8450
  };

  // Chat modal
  const [selectedChatOrder, setSelectedChatOrder] = useState<Order | null>(null);

  // New 3D product modal form
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Desinfectantes");
  const [price, setPrice] = useState(289);
  const [description, setDescription] = useState("");
  const [glbUrl, setGlbUrl] = useState("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&fit=crop");

  // Payout withdrawal modal form
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(rep.availableBalance > 0 ? rep.availableBalance : 1000);
  const [bankName, setBankName] = useState("BBVA Bancomer");
  const [clabeNumber, setClabeNumber] = useState("012680015489201934");
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      merchantId: "m-101",
      merchantName: "EcoClean Insumos",
      merchantLogo: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=120&h=120&fit=crop",
      title,
      description,
      category,
      price: Number(price),
      rating: 5.0,
      reviewsCount: 0,
      stock: 25,
      image: imageUrl,
      has3DModel: true,
      modelGlbUrl: glbUrl,
      dimensions: { width: "15 cm", height: "30 cm", depth: "10 cm" }
    });
    setIsAddProductOpen(false);
    setTitle("");
    setDescription("");
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0 || payoutAmount > rep.availableBalance) return;

    const ok = requestMerchantPayout(merchantId, payoutAmount, clabeNumber, bankName);
    if (ok) {
      setPayoutSuccess(true);
      setTimeout(() => {
        setPayoutSuccess(false);
        setIsPayoutOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200 text-slate-900">
      
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-pink-600" />
              Consola Comercial B2B • {rep.merchantName}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              {rep.levelLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Termómetro de vendedor, billetera con custodia Escrow, despachos y catálogo 3D
          </p>
        </div>

        <button
          onClick={() => setIsAddProductOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto 3D</span>
        </button>
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`py-2 px-3.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === "inventory" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Inventario 3D ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`py-2 px-3.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === "orders" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Pedidos & Guías ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("reputation")}
          className={`py-2 px-3.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === "reputation" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Termómetro Reputación
        </button>
        <button
          onClick={() => setActiveTab("finances")}
          className={`py-2 px-3.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === "finances" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Billetera & Escrow (${rep.availableBalance.toLocaleString()})
        </button>
        <button
          onClick={() => setActiveTab("kyb")}
          className={`py-2 px-3.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === "kyb" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          KYB & Fiscal
        </button>
      </div>

      {/* TAB 1: INVENTORY & 3D AR */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex gap-3 items-center shadow-sm">
              <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">{p.title}</div>
                <div className="text-[10px] text-slate-500">{p.category} • Stock: {p.stock} uds</div>
                <div className="font-black text-sm text-pink-600 mt-1">${p.price.toLocaleString()} MXN</div>
              </div>
              {p.has3DModel && (
                <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                  .GLB 3D
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ORDERS & MERCADOENVIOS TRACKING */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {orders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span>{ord.id}</span>
                    <span>• {ord.customerName}</span>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      Guía: {ord.trackingNumber || ord.id}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {ord.createdAt} • Comprobante: {ord.invoiceType} • Destino: {ord.deliveryAddress}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ord.escrowStatus === "in_escrow" && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      En Custodia Escrow
                    </span>
                  )}
                  {ord.escrowStatus === "released" && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      Pago Acreditado
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                    {ord.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-700">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.title}</span>
                    <span className="font-bold">${it.price * it.quantity} MXN</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
                <span className="font-bold text-pink-600">Total Orden: ${ord.totalAmount} MXN</span>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedChatOrder(ord)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chat Comprador</span>
                  </button>

                  {ord.status === "Nuevo" && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, "En preparación")}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm"
                    >
                      Empacar Pedido
                    </button>
                  )}

                  {ord.status === "En preparación" && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, "Listo para recolección")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Listo para Colecta</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MERCADOLIBRE-STYLE VENDOR REPUTATION THERMOMETER */}
      {activeTab === "reputation" && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 font-black">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">{rep.levelLabel}</h3>
                  <p className="text-xs text-slate-500">
                    Nivel más alto de vendedor en Homeli basado en tu comportamiento de los últimos 60 días
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-emerald-600">{rep.rating} ★</div>
                <div className="text-[10px] text-slate-400">Calificación Promedio</div>
              </div>
            </div>

            {/* 5-Segment Colored Thermometer Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Termómetro de Calidad del Vendedor:</span>
                <span className="text-emerald-700">¡Nivel Verde Oscuro Platino!</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 h-4">
                <div className="rounded-l-lg bg-rose-200 opacity-60" title="Rojo: Calidad Crítica" />
                <div className="bg-orange-200 opacity-60" title="Naranja: Mejorable" />
                <div className="bg-amber-200 opacity-60" title="Amarillo: En revisión" />
                <div className="bg-emerald-300 opacity-70" title="Verde Claro: Buen Vendedor" />
                <div className="rounded-r-lg bg-emerald-600 shadow-md ring-2 ring-emerald-500 ring-offset-1 flex items-center justify-center text-[10px] text-white font-black" title="Verde Oscuro: MercadoLíder Platinum">
                  ✓
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Menor calidad</span>
                <span>Objetivo: Verde Platino</span>
              </div>
            </div>

            {/* Operational Quality Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Despacho a Tiempo</span>
                <div className="text-lg font-black text-emerald-600">{rep.onTimeDispatchPercent}%</div>
                <p className="text-[10px] text-slate-500">Objetivo &gt; 95% para mantener Platinum</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Tasa de Reclamos</span>
                <div className="text-lg font-black text-emerald-600">{rep.complaintRatePercent}%</div>
                <p className="text-[10px] text-slate-500">Excelente: Mantienes reclamos por debajo del 1.0%</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Cancelaciones de Venta</span>
                <div className="text-lg font-black text-emerald-600">{rep.cancellationRatePercent}%</div>
                <p className="text-[10px] text-slate-500">Excelente: Sin quiebres de stock imprevistos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCES & ESCROW BALANCES */}
      {activeTab === "finances" && (
        <div className="space-y-4">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Saldo en Custodia / Escrow */}
            <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Saldo en Custodia (Escrow)
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Retenido temporalmente
                </span>
              </div>
              <div className="text-2xl font-black text-amber-900">${rep.escrowBalance.toLocaleString()} MXN</div>
              <p className="text-[11px] text-amber-800 leading-snug">
                Fondos de compras en preparación o reparto. Se liberan automáticamente 48 hrs después de confirmada la entrega al cliente.
              </p>
            </div>

            {/* Saldo Disponible para Retiro */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  Saldo Disponible
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                  Listo para Transferir
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-900">${rep.availableBalance.toLocaleString()} MXN</div>
              <div className="pt-1">
                <button
                  onClick={() => setIsPayoutOpen(true)}
                  disabled={rep.availableBalance <= 0}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-40 transition-all flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Solicitar Retiro a Cuenta CLABE</span>
                </button>
              </div>
            </div>
          </div>

          {/* Payouts History */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Historial de Retiros Bancarios (SPEI)
            </h3>

            {merchantPayouts.map((pay) => (
              <div key={pay.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    ${pay.amount.toLocaleString()} MXN • {pay.bankName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    CLABE: {pay.clabeNumber} • Ref: {pay.referenceNumber} • {pay.requestedAt}
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  pay.status === "Procesado" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}>
                  {pay.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: KYB STATUS */}
      {activeTab === "kyb" && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Estado KYB: Verificado Homeli Partner</div>
              <div className="text-slate-500">RFC: ECO1809028X1 • Razón Social: EcoClean Insumos S.A. de C.V.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">Beneficios Comerciales Homeli:</div>
            <div>✓ Sello de Vendedor Verificado y presencia en visores 3D WebAR.</div>
            <div>✓ Protección contra fraude y retención de fondos segura (Escrow).</div>
            <div>✓ Tasa preferencial de comisión de marketplace (8.5%).</div>
          </div>
        </div>
      )}

      {/* MODAL: ADD 3D PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 space-y-3 shadow-2xl">
            <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
              <Box className="w-5 h-5 text-pink-600" /> Nuevo Artículo con WebAR 3D
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Título del Producto</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                >
                  <option value="Desinfectantes">Desinfectantes</option>
                  <option value="Detergentes">Detergentes</option>
                  <option value="Utensilios y Mops">Utensilios y Mops</option>
                  <option value="Limpieza de Baño">Limpieza de Baño</option>
                  <option value="Aromas">Aromas</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Precio ($ MXN)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Enlace Modelo .GLB 3D</label>
                <input
                  type="url"
                  value={glbUrl}
                  onChange={(e) => setGlbUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs shadow-md"
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: PAYOUT WITHDRAWAL TO CLABE */}
      {isPayoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRequestPayout} className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
              <Building className="w-5 h-5 text-emerald-600" /> Retiro a Cuenta Bancaria (SPEI)
            </h3>

            {payoutSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">¡Retiro Solicitado Exitosamente!</h4>
                <p className="text-xs text-slate-500">
                  La transferencia SPEI ha sido enviada a tu cuenta con número de rastreo.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Monto a Retirar ($ MXN)</label>
                  <input
                    type="number"
                    max={rep.availableBalance}
                    min={100}
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">
                    Disponible: ${rep.availableBalance.toLocaleString()} MXN
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Banco Receptor</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">CLABE Interbancaria (18 dígitos)</label>
                  <input
                    type="text"
                    maxLength={18}
                    required
                    value={clabeNumber}
                    onChange={(e) => setClabeNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPayoutOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    Confirmar Transferencia
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* CHAT POST-VENTA MODAL */}
      {selectedChatOrder && (
        <OrderChatModal order={selectedChatOrder} onClose={() => setSelectedChatOrder(null)} />
      )}

    </div>
  );
};
