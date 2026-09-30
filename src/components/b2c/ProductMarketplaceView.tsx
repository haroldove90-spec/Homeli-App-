import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Product3D } from "../../types";
import { Search, ShoppingBag, Box, Star, Plus, Check, ShieldCheck, Award, MessageSquare, X, ThumbsUp } from "lucide-react";

interface ProductMarketplaceViewProps {
  onOpenCart: () => void;
}

export const ProductMarketplaceView: React.FC<ProductMarketplaceViewProps> = ({ onOpenCart }) => {
  const { products, addToCart, cartTotalItems, setActive3DProduct, getMerchantReputation, getProductReviews } = useHomeli();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [selectedProductReviews, setSelectedProductReviews] = useState<Product3D | null>(null);

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

      {/* Trust & Guarantee Banner (MercadoLibre style) */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-blue-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Compra Protegida:</strong> Si no es lo que esperabas, te devolvemos el 100% de tu dinero.</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600 text-[11px]">
          <span className="flex items-center gap-1 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-600" /> Vendedores MercadoLíder Certificados
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">📦 Dinero retenido en custodia hasta tu conformidad</span>
        </div>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map((product) => {
          const rep = getMerchantReputation(product.merchantId);
          const reviews = getProductReviews(product.id);

          return (
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

                {product.price >= 299 && (
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-black">
                    Envío Gratis
                  </span>
                )}
              </div>

              <div className="p-3 space-y-2">
                <div>
                  {/* Vendor reputation tag */}
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-slate-500 font-medium truncate max-w-[65%]">{product.merchantName}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded text-[9px]">
                      {rep.level === "platinum" ? "🏅 Platinum" : "🥇 Gold"}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{product.title}</h3>
                </div>

                {/* Rating & Reviews */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProductReviews(product);
                  }}
                  className="flex items-center gap-1 text-[11px] hover:underline"
                >
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900 ml-1">{product.rating}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">({product.reviewsCount + reviews.length})</span>
                </div>

                {/* Price & Add Button */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
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
          );
        })}
      </div>

      {/* Verified Reviews Modal */}
      {selectedProductReviews && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 space-y-4 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Opiniones de Compradores Verificados
                </h3>
                <p className="text-[11px] text-slate-500 truncate max-w-xs">{selectedProductReviews.title}</p>
              </div>
              <button
                onClick={() => setSelectedProductReviews(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {getProductReviews(selectedProductReviews.id).length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Aún no hay reseñas escritas para este producto.</p>
                  <p className="text-[11px] text-slate-400 mt-1">¡Sé el primero en calificarlo al recibir tu entrega!</p>
                </div>
              ) : (
                getProductReviews(selectedProductReviews.id).map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.userAvatar ? (
                          <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                            {rev.userName[0]}
                          </div>
                        )}
                        <span className="font-bold text-slate-800 text-[11px]">{rev.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] text-emerald-700 font-bold ml-1 bg-emerald-50 px-1 rounded">
                        ✓ Compra Verificada
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs leading-relaxed">{rev.comment}</p>

                    {rev.photoUrl && (
                      <img
                        src={rev.photoUrl}
                        alt="Foto de comprador"
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 mt-1"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedProductReviews(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
