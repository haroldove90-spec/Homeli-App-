export type UserRole = "B2C" | "B2B" | "DRIVER" | "ADMIN";

export type AuthMethod = "email" | "phone" | "google" | "apple" | "facebook";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  role: UserRole;
  isKycVerified: boolean;
  kycDocType?: string;
  kycDocUrl?: string;
  birthDate?: string;
  gender?: string;
  interests: string[];
  addresses: Address[];
  walletBalance: number;
  homeliPoints: number;
  notificationsEnabled: boolean;
  biometricsEnabled: boolean;
}

export interface Address {
  id: string;
  label: "Casa" | "Trabajo" | "Otro";
  addressLine: string;
  city: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export interface Product3D {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  title: string;
  description: string;
  category: "Desinfectantes" | "Detergentes" | "Utensilios y Mops" | "Limpieza de Baño" | "Limpieza de Cocina" | "Aromas" | "Hogar" | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  image: string;
  has3DModel: boolean;
  modelGlbUrl?: string;
  modelUsdzUrl?: string;
  dimensions?: { width: string; height: string; depth: string };
  colors?: string[];
  isSponsored?: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  businessName: string;
  category: "Plomería" | "Limpieza" | "Mantenimiento" | "Electricidad" | "Pintura" | "Jardinería" | "Cerrajero";
  avatar: string;
  rating: number;
  completedJobs: number;
  hourlyRate: number;
  fixedPrice?: number;
  description: string;
  coverageRadiusKm: number;
  isVerified: boolean;
  availability: string;
  phone: string;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  providerName: string;
  providerAvatar: string;
  providerPhone: string;
  customerName: string;
  customerAddress: string;
  date: string;
  time: string;
  description: string;
  status: "Aceptado" | "En camino" | "En servicio" | "Finalizado" | "Cancelado";
  estimatedCost: number;
  techLat?: number;
  techLng?: number;
  notes?: string;
}

export interface CartItem {
  product: Product3D;
  quantity: number;
  selectedColor?: string;
}

export interface CartMerchantGroup {
  merchantName: string;
  items: CartItem[];
}

export interface MultiMerchantCart {
  [merchantId: string]: CartMerchantGroup;
}

// -------------------------------------------------------------
// MERCADO LIBRE STYLE MARKETPLACE WORKFLOW TYPES
// -------------------------------------------------------------

export type OrderStatus =
  | "Nuevo"
  | "En preparación"
  | "Listo para recolección"
  | "En camino"
  | "Entregado"
  | "Cancelado"
  | "En disputa";

export type EscrowStatus = "in_escrow" | "released" | "refunded" | "disputed";

export interface TrackingMilestone {
  time: string;
  title: string;
  location: string;
  done: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  merchantId: string;
  merchantName: string;
  items: { title: string; price: number; quantity: number; image: string; productId?: string }[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverLat?: number;
  driverLng?: number;
  createdAt: string;
  invoiceType: "Boleta" | "Factura";
  taxId?: string;
  qrCodeToken: string;
  proofSignature?: string;
  // Mercado Libre workflow extensions
  trackingNumber: string;
  escrowStatus: EscrowStatus;
  escrowAmount: number;
  trackingMilestones: TrackingMilestone[];
  isReviewSubmitted?: boolean;
  claimId?: string;
  deliveredAt?: string;
}

export type VendorReputationLevel = "platinum" | "gold" | "silver" | "rookie";

export interface VendorReputation {
  merchantId: string;
  merchantName: string;
  level: VendorReputationLevel;
  levelLabel: string; // e.g. "MercadoLíder Platinum 🏅"
  onTimeDispatchPercent: number; // e.g. 98%
  complaintRatePercent: number; // e.g. 0.4%
  cancellationRatePercent: number; // e.g. 0.8%
  completedSales60Days: number; // e.g. 340 ventas
  rating: number; // e.g. 4.9
  escrowBalance: number; // Dinero en custodia por pedidos en tránsito
  availableBalance: number; // Dinero disponible para retiro inmediato
}

export interface ProductReview {
  id: string;
  productId: string;
  orderId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  photoUrl?: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  imageUrl?: string;
}

export interface MerchantPayout {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  bankName: string;
  clabeNumber: string;
  status: "Pendiente" | "Procesado" | "Rechazado";
  requestedAt: string;
  referenceNumber: string;
}

export interface DisputeCase {
  id: string;
  orderOrBookingId: string;
  customerId: string;
  customerName: string;
  merchantId: string;
  merchantName: string;
  reason: "Producto dañado o roto" | "No coincide con modelo 3D/descripción" | "Paquete no recibido" | "Faltan piezas o accesorios" | string;
  description: string;
  amount: number;
  evidencePhotoUrl?: string;
  status: "Abierto" | "En Mediación" | "Resuelto con Reembolso" | "Cerrado a Favor de Vendedor";
  createdAt: string;
  resolutionNote?: string;
}

// -------------------------------------------------------------
// COMMUNITY, WALLET & SETTINGS
// -------------------------------------------------------------

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: { id: string; author: string; text: string; time: string }[];
  category: "Pregunta local" | "Recomendación" | "Anuncio" | "Oferta";
  isSponsored?: boolean;
}

export interface WalletTransaction {
  id: string;
  type: "topup" | "payment" | "transfer" | "reward" | "cashout" | "refund" | "escrow_release";
  title: string;
  amount: number;
  date: string;
  status: "Completado" | "Pendiente";
}

export interface AdsCampaign {
  id: string;
  merchantName: string;
  title: string;
  bannerUrl: string;
  dailyBudget: number;
  spent: number;
  targetAudience: string;
  impressions: number;
  clicks: number;
  conversions: number;
  status: "Activo" | "Pausado" | "Finalizado";
}

export interface KycDocument {
  id: string;
  applicantName: string;
  applicantRole: UserRole;
  docType: "INE / Cédula" | "Pasaporte" | "Comprobante Fiscal";
  docNumber: string;
  submittedAt: string;
  status: "Pendiente" | "Aprobado" | "Rechazado";
  documentFrontUrl: string;
  documentBackUrl?: string;
}

export interface SystemSettings {
  marketplaceCommissionPercent: number;
  serviceCommissionPercent: number;
  deliveryBaseFee: number;
  deliveryFeePerKm: number;
  adsCpcRate: number;
}
