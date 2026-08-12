import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Product3D } from "../../types";
import { Store, Plus, Box, Check, Clock, Package, AlertCircle, Calendar, Upload, Sparkles, TrendingUp } from "lucide-react";

export const B2BDashboardView: React.FC = () => {
  const { products, addProduct, orders, updateOrderStatus } = useHomeli();
  const [activeTab, setActiveTab] = useState<"inventory" | "orders" | "kyb">("inventory");

  // New 3D product modal form
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Product3D["category"]>("Muebles");
  const [price, setPrice] = useState(2500);
  const [description, setDescription] = useState("");
  const [glbUrl, setGlbUrl] = useState("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&fit=crop");

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      merchantId: "m-101",
      merchantName: "Mi Comercio Aliado Homeli",
      merchantLogo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop",
      title,
      description,
      category,
      price: Number(price),
      rating: 5.0,
      reviewsCount: 1,
      stock: 10,
      image: imageUrl,
      has3DModel: true,
      modelGlbUrl: glbUrl,
      dimensions: { width: "120 cm", height: "80 cm", depth: "60 cm" }
    });
    setIsAddProductOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-pink-600" />
            Panel B2B Comercio / Negocio
          </h2>
          <p className="text-xs text-slate-500">Gestión de inventario 3D AR, pedidos en vivo y validación KYB</p>
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
      <div className="flex gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === "inventory" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Inventario & 3D AR ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === "orders" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          Pedidos En Vivo ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("kyb")}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === "kyb" ? "bg-pink-600 text-white shadow-sm font-bold" : "hover:text-slate-900"
          }`}
        >
          KYB & Fiscal
        </button>
      </div>

      {/* TAB 1: INVENTORY & 3D MODELS */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((p) => (
            <div key={p.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex gap-3 items-center shadow-sm">
              <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">{p.title}</div>
                <div className="text-[10px] text-slate-500">{p.category} • Stock: {p.stock} unidades</div>
                <div className="font-black text-sm text-pink-600 mt-1">${p.price.toLocaleString()} MXN</div>
              </div>
              {p.has3DModel && (
                <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  .GLB 3D
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LIVE ORDERS BOARD */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {orders.map((ord) => (
            <div key={ord.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="font-bold text-xs text-slate-900">{ord.id} • {ord.customerName}</div>
                  <div className="text-[10px] text-slate-500">{ord.createdAt} • Comprobante: {ord.invoiceType}</div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                  {ord.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-700">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.title}</span>
                    <span className="font-bold">${it.price * it.quantity} MXN</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-pink-600">Total: ${ord.totalAmount} MXN</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(ord.id, "En preparación")}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-[11px] shadow-sm"
                  >
                    En Preparación
                  </button>
                  <button
                    onClick={() => updateOrderStatus(ord.id, "Listo para recolección")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] shadow-sm"
                  >
                    Listo Delivery
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: KYB VERIFICATION STATUS */}
      {activeTab === "kyb" && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Estado KYB: Verificado Homeli Partner</div>
              <div className="text-slate-500">RFC: ETH1904128X9 • Razón Social: Mueblería Mōdern S.A.</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
            ✓ Tu comercio cuenta con sello de verificación azul y acceso a ventas con comisión del 8.5%.
          </div>
        </div>
      )}

      {/* Add 3D Product Modal */}
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
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                >
                  <option value="Muebles">Muebles</option>
                  <option value="Iluminación">Iluminación</option>
                  <option value="Herramientas">Herramientas</option>
                  <option value="Electrodomésticos">Electrodomésticos</option>
                  <option value="Decoración">Decoración</option>
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

    </div>
  );
};
