import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Product3D } from "../../types";
import { Search, Filter, ShoppingBag, Box, Star, Plus, Check, Sparkles } from "lucide-react";

interface ProductMarketplaceViewProps {
  onOpenCart: () => void;
}

export const ProductMarketplaceView: React.FC<ProductMarketplaceViewProps> = ({ onOpenCart }) => {
  const { products, addToCart, cartTotalItems, setActive3DProduct } = useHomeli();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const categories = ["Todos", "Desinfectantes", "Detergentes", "Utensilios y Mops", "Limpieza de Baño", "Limpieza de Cocina", "Aromas"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product3D) => {
    e.stopPropagation();
    addToCart(product);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Header Bar & Cart Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            Marketplace de Limpieza 3D
          </h2>
          <p className="text-xs text-slate-500">Visualiza atomizadores, detergentes y equipos de limpieza a escala real con WebAR</p>
        </div>

        <button
          onClick={onOpenCart}
          className="relative p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Carrito</span>
          {cartTotalItems > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-black">
              {cartTotalItems}
            </span>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar detergentes, desinfectantes, mops, jabones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setActive3DProduct(product)}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md group"
          >
            <div className="relative h-36 bg-slate-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />

              {product.has3DModel && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow">
                  <Box className="w-3 h-3" /> WebAR 3D
                </span>
              )}

              {product.isSponsored && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold">
                  Patrocinado
                </span>
              )}
            </div>

            <div className="p-3 space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 font-medium">{product.merchantName}</span>
                <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{product.title}</h3>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="font-black text-sm text-amber-600">${product.price.toLocaleString()} MXN</div>
                  {product.originalPrice && (
                    <div className="text-[10px] text-slate-400 line-through">${product.originalPrice.toLocaleString()}</div>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    addedItemIds[product.id]
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200"
                  }`}
                  title="Agregar al Carrito"
                >
                  {addedItemIds[product.id] ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
