import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  UserProfile,
  Product3D,
  ServiceProvider,
  Post,
  Order,
  ServiceBooking,
  CartItem,
  CartMerchantGroup,
  MultiMerchantCart,
  WalletTransaction,
  AdsCampaign,
  KycDocument,
  DisputeCase,
  SystemSettings,
  Address
} from "../types";
import {
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_POSTS,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_ADS,
  INITIAL_KYC_DOCS,
  INITIAL_DISPUTES,
  INITIAL_SYSTEM_SETTINGS
} from "../data/initialData";

interface HomeliContextType {
  // Role & User Profile
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => void;

  // Onboarding Modal Flow State (Image 2)
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;

  // Cart & Marketplace
  products: Product3D[];
  setProducts: React.Dispatch<React.SetStateAction<Product3D[]>>;
  cart: MultiMerchantCart;
  addToCart: (product: Product3D, color?: string) => void;
  removeFromCart: (merchantId: string, productId: string) => void;
  updateQuantity: (merchantId: string, productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotalItems: number;
  cartSubtotal: number;

  // Orders & Deliveries
  orders: Order[];
  createOrder: (merchantId: string, items: CartItem[], invoiceType: "Boleta" | "Factura", taxId?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"], driverInfo?: Partial<Order>) => void;

  // Services & Bookings
  services: ServiceProvider[];
  bookings: ServiceBooking[];
  createBooking: (serviceId: string, date: string, time: string, description: string) => ServiceBooking;
  updateBookingStatus: (bookingId: string, status: ServiceBooking["status"]) => void;

  // Social Community Feed
  posts: Post[];
  addPost: (content: string, category: Post["category"], image?: string) => void;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string) => void;

  // Wallet & Rewards
  walletTransactions: WalletTransaction[];
  topupWallet: (amount: number) => void;
  redeemPoints: (points: number, couponCode: string) => boolean;

  // B2B Merchants
  adsCampaigns: AdsCampaign[];
  addAdsCampaign: (campaign: Omit<AdsCampaign, "id" | "spent" | "impressions" | "clicks" | "conversions" | "status">) => void;
  addProduct: (product: Omit<Product3D, "id">) => void;

  // Admin & KYC
  kycDocs: KycDocument[];
  updateKycStatus: (docId: string, status: KycDocument["status"]) => void;
  disputes: DisputeCase[];
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;

  // Active View Modal Overlays
  active3DProduct: Product3D | null;
  setActive3DProduct: (product: Product3D | null) => void;
  activeTrackBooking: ServiceBooking | null;
  setActiveTrackBooking: (booking: ServiceBooking | null) => void;
  activeTrackOrder: Order | null;
  setActiveTrackOrder: (order: Order | null) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
}

const HomeliContext = createContext<HomeliContextType | undefined>(undefined);

export const HomeliProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("B2C");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  const [user, setUser] = useState<UserProfile>({
    id: "usr-01",
    name: "Mano Varadhan",
    email: "mano.varadhan@email.com",
    phone: "+52 222 628 5414",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
    city: "Puebla, México",
    role: "B2C",
    isKycVerified: true,
    kycDocType: "INE / Cédula",
    birthDate: "1985-08-12",
    gender: "Masculino",
    interests: ["Servicios del hogar", "Compras", "Fitness", "Mascotas", "Tecnología"],
    addresses: [
      { id: "a1", label: "Casa", addressLine: "Calle de los Azahares 402, Lomas de Angelópolis", city: "Puebla", lat: 19.0413, lng: -98.2062, isDefault: true },
      { id: "a2", label: "Trabajo", addressLine: "Av. Juárez 2910, Zona Centro", city: "Puebla", lat: 19.0433, lng: -98.1982 }
    ],
    walletBalance: 2850,
    homeliPoints: 340,
    notificationsEnabled: true,
    biometricsEnabled: true,
  });

  const [products, setProducts] = useState<Product3D[]>(INITIAL_PRODUCTS);
  const [services, setServices] = useState<ServiceProvider[]>(INITIAL_SERVICES);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [bookings, setBookings] = useState<ServiceBooking[]>(INITIAL_BOOKINGS);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [adsCampaigns, setAdsCampaigns] = useState<AdsCampaign[]>(INITIAL_ADS);
  const [kycDocs, setKycDocs] = useState<KycDocument[]>(INITIAL_KYC_DOCS);
  const [disputes, setDisputes] = useState<DisputeCase[]>(INITIAL_DISPUTES);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);

  const [cart, setCart] = useState<MultiMerchantCart>({});
  const [active3DProduct, setActive3DProduct] = useState<Product3D | null>(null);
  const [activeTrackBooking, setActiveTrackBooking] = useState<ServiceBooking | null>(null);
  const [activeTrackOrder, setActiveTrackOrder] = useState<Order | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  // Cart operations
  const addToCart = (product: Product3D, color?: string) => {
    setCart((prev) => {
      const merchantId = product.merchantId;
      const merchantName = product.merchantName;
      const existingMerchantGroup = prev[merchantId] || { merchantName, items: [] };

      const existingItemIndex = existingMerchantGroup.items.findIndex(
        (i) => i.product.id === product.id && i.selectedColor === color
      );

      let updatedItems: CartItem[];
      if (existingItemIndex > -1) {
        updatedItems = existingMerchantGroup.items.map((item, idx) =>
          idx === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [...existingMerchantGroup.items, { product, quantity: 1, selectedColor: color }];
      }

      return {
        ...prev,
        [merchantId]: {
          merchantName,
          items: updatedItems,
        },
      };
    });
  };

  const removeFromCart = (merchantId: string, productId: string) => {
    setCart((prev) => {
      const group = prev[merchantId];
      if (!group) return prev;
      const filtered = group.items.filter((i) => i.product.id !== productId);
      if (filtered.length === 0) {
        const copy = { ...prev };
        delete copy[merchantId];
        return copy;
      }
      return {
        ...prev,
        [merchantId]: { ...group, items: filtered },
      };
    });
  };

  const updateQuantity = (merchantId: string, productId: string, delta: number) => {
    setCart((prev) => {
      const group = prev[merchantId];
      if (!group) return prev;
      const updated = group.items
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      if (updated.length === 0) {
        const copy = { ...prev };
        delete copy[merchantId];
        return copy;
      }
      return {
        ...prev,
        [merchantId]: { ...group, items: updated },
      };
    });
  };

  const clearCart = () => setCart({});

  const cartTotalItems = (Object.values(cart) as CartMerchantGroup[]).reduce((acc, m) => {
    return acc + m.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const cartSubtotal = (Object.values(cart) as CartMerchantGroup[]).reduce((acc, m) => {
    return acc + m.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, 0);

  // Orders creation
  const createOrder = (merchantId: string, items: CartItem[], invoiceType: "Boleta" | "Factura", taxId?: string): Order => {
    const merchant = items[0].product.merchantName;
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      deliveryAddress: user.addresses.find((a) => a.isDefault)?.addressLine || user.addresses[0]?.addressLine || "Dirección principal",
      merchantId,
      merchantName: merchant,
      items: items.map((i) => ({
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      totalAmount: subtotal + 120,
      deliveryFee: 120,
      status: "Nuevo",
      createdAt: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      invoiceType,
      taxId,
      qrCodeToken: `HOMELI-QR-${Date.now()}`
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add wallet deduction
    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "payment",
        title: `Compra en ${merchant}`,
        amount: -(subtotal + 120),
        date: "Hace un momento",
        status: "Completado"
      },
      ...prev
    ]);

    // Award Homeli Points
    updateUser({ homeliPoints: user.homeliPoints + Math.floor(subtotal / 10) });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"], driverInfo?: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, ...driverInfo } : o))
    );
  };

  // Services Bookings
  const createBooking = (serviceId: string, date: string, time: string, description: string): ServiceBooking => {
    const targetService = services.find((s) => s.id === serviceId) || services[0];
    const newBooking: ServiceBooking = {
      id: `BKG-${Math.floor(100 + Math.random() * 900)}`,
      serviceId,
      serviceName: targetService.businessName,
      category: targetService.category,
      providerName: targetService.name,
      providerAvatar: targetService.avatar,
      providerPhone: targetService.phone,
      customerName: user.name,
      customerAddress: user.addresses[0]?.addressLine || "Lomas de Angelópolis",
      date,
      time,
      description,
      status: "Aceptado",
      estimatedCost: targetService.fixedPrice || targetService.hourlyRate,
      techLat: 19.040,
      techLng: -98.205
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: ServiceBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // Social feed
  const addPost = (content: string, category: Post["category"], image?: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: currentRole === "B2C" ? "Cliente Verificado" : "Negocio Homeli",
      timestamp: "Hace un momento",
      content,
      image,
      likes: 0,
      commentsCount: 0,
      comments: [],
      category
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const addCommentToPost = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComm = { id: `c-${Date.now()}`, author: user.name, text, time: "Ahora" };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComm],
          };
        }
        return p;
      })
    );
  };

  // Wallet
  const topupWallet = (amount: number) => {
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "topup",
        title: "Recarga Billetera Homeli",
        amount,
        date: "Ahora",
        status: "Completado"
      },
      ...prev
    ]);
  };

  const redeemPoints = (points: number, couponCode: string): boolean => {
    if (user.homeliPoints < points) return false;
    setUser((prev) => ({ ...prev, homeliPoints: prev.homeliPoints - points }));
    return true;
  };

  // B2B & Admin
  const addAdsCampaign = (campaign: Omit<AdsCampaign, "id" | "spent" | "impressions" | "clicks" | "conversions" | "status">) => {
    const newCamp: AdsCampaign = {
      ...campaign,
      id: `ad-${Date.now()}`,
      spent: 0,
      impressions: 1,
      clicks: 0,
      conversions: 0,
      status: "Activo"
    };
    setAdsCampaigns((prev) => [newCamp, ...prev]);
  };

  const addProduct = (product: Omit<Product3D, "id">) => {
    const newProd: Product3D = {
      ...product,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateKycStatus = (docId: string, status: KycDocument["status"]) => {
    setKycDocs((prev) =>
      prev.map((k) => (k.id === docId ? { ...k, status } : k))
    );
  };

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <HomeliContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        user,
        updateUser,

        isOnboardingOpen,
        setIsOnboardingOpen,
        onboardingStep,
        setOnboardingStep,

        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalItems,
        cartSubtotal,

        orders,
        createOrder,
        updateOrderStatus,

        services,
        bookings,
        createBooking,
        updateBookingStatus,

        posts,
        addPost,
        toggleLikePost,
        addCommentToPost,

        walletTransactions,
        topupWallet,
        redeemPoints,

        adsCampaigns,
        addAdsCampaign,
        addProduct,

        kycDocs,
        updateKycStatus,
        disputes,
        systemSettings,
        updateSystemSettings,

        active3DProduct,
        setActive3DProduct,
        activeTrackBooking,
        setActiveTrackBooking,
        activeTrackOrder,
        setActiveTrackOrder,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
      }}
    >
      {children}
    </HomeliContext.Provider>
  );
};

export const useHomeli = () => {
  const context = useContext(HomeliContext);
  if (!context) throw new Error("useHomeli must be used within HomeliProvider");
  return context;
};
