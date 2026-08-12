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

export type OrderStatus = "Nuevo" | "En preparación" | "Listo para recolección" | "En camino" | "Entregado" | "Cancelado";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  merchantId: string;
  merchantName: string;
  items: { title: string; price: number; quantity: number; image: string }[];
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
}

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
  type: "topup" | "payment" | "transfer" | "reward" | "cashout";
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

export interface DisputeCase {
  id: string;
  orderOrBookingId: string;
  customerName: string;
  merchantName: string;
  reason: string;
  amount: number;
  status: "Abierto" | "En Mediación" | "Resuelto con Reembolso" | "Cerrado";
  createdAt: string;
}

export interface SystemSettings {
  marketplaceCommissionPercent: number;
  serviceCommissionPercent: number;
  deliveryBaseFee: number;
  deliveryFeePerKm: number;
  adsCpcRate: number;
}
