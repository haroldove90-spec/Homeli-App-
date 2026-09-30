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
  Address,
  ProductReview,
  VendorReputation,
  OrderMessage,
  MerchantPayout,
  TrackingMilestone
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
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_REVIEWS,
  INITIAL_VENDOR_REPUTATIONS,
  INITIAL_ORDER_MESSAGES,
  INITIAL_MERCHANT_PAYOUTS
} from "../data/initialData";

interface HomeliContextType {
  // Role & User Profile
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => void;

  // Onboarding Modal Flow State
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

  // Orders & Deliveries (MercadoLibre style)
  orders: Order[];
  createOrder: (merchantId: string, items: CartItem[], invoiceType: "Boleta" | "Factura", taxId?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"], driverInfo?: Partial<Order>) => void;
  confirmOrderDelivery: (orderId: string) => void;

  // Post-Sale Direct Chat
  orderMessages: OrderMessage[];
  sendOrderMessage: (orderId: string, text: string, imageUrl?: string) => void;

  // Verified Buyer Reviews
  reviews: ProductReview[];
  submitReview: (productId: string, orderId: string, rating: number, comment: string, photoUrl?: string) => void;
  getProductReviews: (productId: string) => ProductReview[];

  // Vendor Reputation & Finanzas B2B (Escrow & Retiros)
  vendorReputations: Record<string, VendorReputation>;
  merchantPayouts: MerchantPayout[];
  requestMerchantPayout: (merchantId: string, amount: number, clabe: string, bankName: string) => boolean;
  getMerchantReputation: (merchantId: string) => VendorReputation;

  // Disputes & Protected Purchase
  disputes: DisputeCase[];
  openDispute: (orderId: string, reason: string, description: string, evidencePhotoUrl?: string) => DisputeCase;
  resolveDispute: (disputeId: string, resolution: "refund_buyer" | "release_seller", note?: string) => void;

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

  // New Mercado Libre workflow states
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);
  const [vendorReputations, setVendorReputations] = useState<Record<string, VendorReputation>>(INITIAL_VENDOR_REPUTATIONS);
  const [orderMessages, setOrderMessages] = useState<OrderMessage[]>(INITIAL_ORDER_MESSAGES);
  const [merchantPayouts, setMerchantPayouts] = useState<MerchantPayout[]>(INITIAL_MERCHANT_PAYOUTS);

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

  // Orders creation with MercadoLibre-style Escrow & Tracking
  const createOrder = (merchantId: string, items: CartItem[], invoiceType: "Boleta" | "Factura", taxId?: string): Order => {
    const merchant = items[0].product.merchantName;
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const trackingCode = `HML-TRK-${Math.floor(100000 + Math.random() * 900000)}MX`;
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

    const newOrder: Order = {
      id: orderId,
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      deliveryAddress: user.addresses.find((a) => a.isDefault)?.addressLine || user.addresses[0]?.addressLine || "Dirección principal",
      merchantId,
      merchantName: merchant,
      items: items.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      totalAmount: subtotal + 45,
      deliveryFee: 45,
      status: "Nuevo",
      createdAt: nowTime,
      invoiceType,
      taxId,
      qrCodeToken: `HOMELI-QR-${Date.now()}`,
      trackingNumber: trackingCode,
      escrowStatus: "in_escrow",
      escrowAmount: subtotal,
      isReviewSubmitted: false,
      trackingMilestones: [
        { time: nowTime, title: "Pago Acreditado & Protegido en Custodia Escrow", location: "Homeli Seguro", done: true },
        { time: "En proceso", title: "Comercio preparando el paquete", location: `Almacén ${merchant}`, done: false },
        { time: "Pendiente", title: "Recolecta de Repartidor Partner", location: "Ruta Homeli", done: false },
        { time: "Pendiente", title: "En camino a tu domicilio (Seguimiento GPS)", location: "Tu Ciudad", done: false },
        { time: "Estimado", title: "Entrega con PIN de seguridad", location: "Tu Domicilio", done: false }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Debit Buyer's Wallet & Register Transaction
    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "payment",
        title: `Compra Protegida en ${merchant} (${orderId})`,
        amount: -(subtotal + 45),
        date: "Hace un momento",
        status: "Completado"
      },
      ...prev
    ]);

    // Retain Seller Funds in Escrow
    setVendorReputations((prev) => {
      const rep = prev[merchantId] || {
        merchantId,
        merchantName: merchant,
        level: "gold",
        levelLabel: "MercadoLíder Gold 🥇",
        onTimeDispatchPercent: 97.0,
        complaintRatePercent: 0.5,
        cancellationRatePercent: 0.2,
        completedSales60Days: 120,
        rating: 4.85,
        escrowBalance: 0,
        availableBalance: 1500
      };
      return {
        ...prev,
        [merchantId]: {
          ...rep,
          escrowBalance: rep.escrowBalance + subtotal
        }
      };
    });

    // Automatically send initial post-sale message
    setOrderMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        orderId: newOrder.id,
        senderId: merchantId,
        senderName: `${merchant} (Vendedor)`,
        senderRole: "B2B",
        text: `¡Hola ${user.name}! Gracias por tu compra. Tu pedido #${newOrder.id} ha sido recibido y lo estamos preparando con empaque seguro y garantía de Compra Protegida.`,
        timestamp: nowTime
      }
    ]);

    // Award Homeli Points
    updateUser({
      walletBalance: Math.max(0, user.walletBalance - (subtotal + 45)),
      homeliPoints: user.homeliPoints + Math.floor(subtotal / 10)
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"], driverInfo?: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updated = { ...o, status, ...driverInfo };

        // Update milestones based on status
        if (status === "En preparación") {
          updated.trackingMilestones = updated.trackingMilestones.map((m, idx) =>
            idx <= 1 ? { ...m, done: true } : m
          );
        } else if (status === "Listo para recolección") {
          updated.trackingMilestones = updated.trackingMilestones.map((m, idx) =>
            idx <= 2 ? { ...m, done: true } : m
          );
        } else if (status === "En camino") {
          updated.trackingMilestones = updated.trackingMilestones.map((m, idx) =>
            idx <= 3 ? { ...m, done: true } : m
          );
        } else if (status === "Entregado") {
          updated.trackingMilestones = updated.trackingMilestones.map((m) => ({ ...m, done: true }));
          updated.deliveredAt = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
        }
        return updated;
      })
    );
  };

  // Buyer confirms delivery -> Releases Escrow to Merchant Available Balance!
  const confirmOrderDelivery = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const merchantId = targetOrder.merchantId;
    const escrowAmt = targetOrder.escrowAmount || targetOrder.totalAmount - (targetOrder.deliveryFee || 0);
    const commissionPercent = systemSettings.marketplaceCommissionPercent;
    const netSellerEarnings = escrowAmt * (1 - commissionPercent / 100);

    // Update order
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Entregado",
              escrowStatus: "released",
              deliveredAt: "Hoy " + new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
              trackingMilestones: o.trackingMilestones.map((m) => ({ ...m, done: true }))
            }
          : o
      )
    );

    // Release escrow to merchant
    setVendorReputations((prev) => {
      const rep = prev[merchantId];
      if (!rep) return prev;
      return {
        ...prev,
        [merchantId]: {
          ...rep,
          escrowBalance: Math.max(0, rep.escrowBalance - escrowAmt),
          availableBalance: rep.availableBalance + netSellerEarnings,
          completedSales60Days: rep.completedSales60Days + 1
        }
      };
    });

    // Notify in chat
    sendOrderMessage(orderId, "¡Entrega confirmada con éxito por el comprador! Los fondos han sido liberados al saldo disponible del vendedor.");
  };

  // Post-Sale Messaging
  const sendOrderMessage = (orderId: string, text: string, imageUrl?: string) => {
    const newMessage: OrderMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      senderId: currentRole === "B2C" ? user.id : "m-101",
      senderName: currentRole === "B2C" ? `${user.name} (Comprador)` : "Vendedor Homeli",
      senderRole: currentRole,
      text,
      timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      imageUrl
    };
    setOrderMessages((prev) => [...prev, newMessage]);
  };

  // Verified Buyer Reviews
  const submitReview = (productId: string, orderId: string, rating: number, comment: string, photoUrl?: string) => {
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      orderId,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
      isVerifiedPurchase: true,
      createdAt: "Hoy",
      photoUrl
    };

    setReviews((prev) => [newRev, ...prev]);

    // Mark order as reviewed
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isReviewSubmitted: true } : o))
    );

    // Update product rating and review count
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newCount = p.reviewsCount + 1;
          const newRating = Number(((p.rating * p.reviewsCount + rating) / newCount).toFixed(2));
          return { ...p, reviewsCount: newCount, rating: newRating };
        }
        return p;
      })
    );
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Vendor reputation helper
  const getMerchantReputation = (merchantId: string): VendorReputation => {
    return (
      vendorReputations[merchantId] || {
        merchantId,
        merchantName: "Comercio Homeli Aliado",
        level: "gold",
        levelLabel: "MercadoLíder Gold 🥇",
        onTimeDispatchPercent: 97.5,
        complaintRatePercent: 0.4,
        cancellationRatePercent: 0.1,
        completedSales60Days: 180,
        rating: 4.88,
        escrowBalance: 0,
        availableBalance: 2400
      }
    );
  };

  // Payout request
  const requestMerchantPayout = (merchantId: string, amount: number, clabe: string, bankName: string): boolean => {
    const rep = vendorReputations[merchantId];
    if (!rep || rep.availableBalance < amount) return false;

    // Deduct available balance
    setVendorReputations((prev) => ({
      ...prev,
      [merchantId]: {
        ...rep,
        availableBalance: rep.availableBalance - amount
      }
    }));

    const newPayout: MerchantPayout = {
      id: `pay-${Date.now()}`,
      merchantId,
      merchantName: rep.merchantName,
      amount,
      bankName,
      clabeNumber: clabe,
      status: "Pendiente",
      requestedAt: "Hoy " + new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      referenceNumber: `SPEI-HML-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setMerchantPayouts((prev) => [newPayout, ...prev]);
    return true;
  };

  // Disputes & Protected Purchase
  const openDispute = (orderId: string, reason: string, description: string, evidencePhotoUrl?: string): DisputeCase => {
    const order = orders.find((o) => o.id === orderId);
    const newDispute: DisputeCase = {
      id: `DSP-${Math.floor(100 + Math.random() * 900)}`,
      orderOrBookingId: orderId,
      customerId: user.id,
      customerName: user.name,
      merchantId: order ? order.merchantId : "m-101",
      merchantName: order ? order.merchantName : "Comercio Homeli",
      reason: reason as any,
      description,
      evidencePhotoUrl,
      amount: order ? order.totalAmount : 500,
      status: "Abierto",
      createdAt: "Hoy " + new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Freeze order in dispute
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "En disputa",
              escrowStatus: "disputed",
              claimId: newDispute.id
            }
          : o
      )
    );

    // Notify in order chat
    sendOrderMessage(
      orderId,
      `⚠️ [COMPRA PROTEGIDA] El comprador abrió un reclamo formal #${newDispute.id}: "${reason}". El dinero se mantiene en custodia segura hasta la resolución.`
    );

    return newDispute;
  };

  // Super Admin arbitrates dispute
  const resolveDispute = (disputeId: string, resolution: "refund_buyer" | "release_seller", note?: string) => {
    const targetDisp = disputes.find((d) => d.id === disputeId);
    if (!targetDisp) return;

    if (resolution === "refund_buyer") {
      // 100% Refund to Buyer's Wallet
      setUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + targetDisp.amount
      }));

      setWalletTransactions((prev) => [
        {
          id: `tx-ref-${Date.now()}`,
          type: "refund",
          title: `Reembolso Compra Protegida (${targetDisp.orderOrBookingId})`,
          amount: targetDisp.amount,
          date: "Hoy",
          status: "Completado"
        },
        ...prev
      ]);

      // Update Order
      setOrders((prev) =>
        prev.map((o) =>
          o.id === targetDisp.orderOrBookingId
            ? { ...o, escrowStatus: "refunded", status: "Cancelado" }
            : o
        )
      );

      // Debit Merchant Escrow
      setVendorReputations((prev) => {
        const mId = targetDisp.merchantId;
        const rep = prev[mId];
        if (!rep) return prev;
        return {
          ...prev,
          [mId]: {
            ...rep,
            escrowBalance: Math.max(0, rep.escrowBalance - targetDisp.amount),
            complaintRatePercent: Number((rep.complaintRatePercent + 0.1).toFixed(1))
          }
        };
      });

      // Update Dispute
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === disputeId
            ? {
                ...d,
                status: "Resuelto con Reembolso",
                resolutionNote: note || "Reembolso automático del 100% emitido a la Billetera Homeli del comprador."
              }
            : d
        )
      );

      sendOrderMessage(
        targetDisp.orderOrBookingId,
        `✅ [RESOLUCIÓN ADMIN] El reclamo ha sido resuelto. Se acreditó el reembolso total de $${targetDisp.amount} MXN a la Billetera Homeli del comprador.`
      );
    } else {
      // Release payment to seller
      const commissionPercent = systemSettings.marketplaceCommissionPercent;
      const netSeller = targetDisp.amount * (1 - commissionPercent / 100);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === targetDisp.orderOrBookingId
            ? { ...o, escrowStatus: "released", status: "Entregado" }
            : o
        )
      );

      setVendorReputations((prev) => {
        const mId = targetDisp.merchantId;
        const rep = prev[mId];
        if (!rep) return prev;
        return {
          ...prev,
          [mId]: {
            ...rep,
            escrowBalance: Math.max(0, rep.escrowBalance - targetDisp.amount),
            availableBalance: rep.availableBalance + netSeller
          }
        };
      });

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === disputeId
            ? {
                ...d,
                status: "Cerrado a Favor de Vendedor",
                resolutionNote: note || "Comprobantes de entrega y conformidad validados. Fondos liberados al vendedor."
              }
            : d
        )
      );

      sendOrderMessage(
        targetDisp.orderOrBookingId,
        `⚖️ [RESOLUCIÓN ADMIN] Mediación concluida. Los comprobantes de entrega fueron validados y el pago fue acreditado al vendedor.`
      );
    }
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
        confirmOrderDelivery,

        orderMessages,
        sendOrderMessage,

        reviews,
        submitReview,
        getProductReviews,

        vendorReputations,
        merchantPayouts,
        requestMerchantPayout,
        getMerchantReputation,

        disputes,
        openDispute,
        resolveDispute,

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
