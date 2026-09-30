



import {
  Product3D,
  ServiceProvider,
  Post,
  Order,
  ServiceBooking,
  WalletTransaction,
  AdsCampaign,
  KycDocument,
  DisputeCase,
  SystemSettings,
  ProductReview,
  VendorReputation,
  OrderMessage,
  MerchantPayout
} from "../types";

export const INITIAL_PRODUCTS: Product3D[] = [
  {
    id: "prod-1",
    merchantId: "m-101",
    merchantName: "EcoClean Insumos",
    merchantLogo: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=120&h=120&fit=crop",
    title: "Kit Limpiador Multiusos Biodegradable 3D",
    description: "Fórmula concentrada ecológica cítrica libre de tóxicos. Elimina el 99.9% de bacterias en cubiertas, cristal y acero. Incluye atomizador ergonómico reutilizable. Proyéctalo a escala real en tu cocina con WebAR.",
    category: "Desinfectantes",
    price: 289,
    originalPrice: 350,
    rating: 4.9,
    reviewsCount: 142,
    stock: 45,
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&fit=crop",
    has3DModel: true,
    modelGlbUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    dimensions: { width: "12 cm", height: "28 cm", depth: "8 cm" },
    colors: ["#10b981", "#06b6d4", "#f59e0b"],
    isSponsored: true,
  },
  {
    id: "prod-2",
    merchantId: "m-102",
    merchantName: "Detergentes Pro MX",
    merchantLogo: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=120&h=120&fit=crop",
    title: "Detergente Líquido Concentrado Hipoalergénico 5L 3D",
    description: "Detergente de alto rendimiento para ropa blanca y de color. Protege fibras delicadas, elimina manchas difíciles sin dañar tejidos y deja aroma fresco duradero.",
    category: "Detergentes",
    price: 349,
    originalPrice: 420,
    rating: 4.8,
    reviewsCount: 185,
    stock: 30,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&fit=crop",
    has3DModel: true,
    dimensions: { width: "20 cm", height: "38 cm", depth: "15 cm" },
    colors: ["#3b82f6", "#8b5cf6"],
  },
  {
    id: "prod-3",
    merchantId: "m-103",
    merchantName: "Limpieza Total Directo",
    merchantLogo: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=120&h=120&fit=crop",
    title: "Mopa Giratoria Microfibra Pro con Balde Escurridor 3D",
    description: "Sistema de limpieza de pisos 360° con pedal escurridor de acero inoxidable, manillar telescópico y mopas intercambiables lavables a máquina.",
    category: "Utensilios y Mops",
    price: 499,
    originalPrice: 650,
    rating: 4.9,
    reviewsCount: 210,
    stock: 20,
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&fit=crop",
    has3DModel: true,
    dimensions: { width: "45 cm", height: "120 cm", depth: "28 cm" },
    colors: ["#10b981", "#0284c7"],
    isSponsored: true,
  },
  {
    id: "prod-4",
    merchantId: "m-104",
    merchantName: "Higienix Soluciones",
    merchantLogo: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=120&h=120&fit=crop",
    title: "Gel Desinfectante y Sarricida para Baño y Azulejos Pro 1L",
    description: "Potente removedor de sarro, hongos, moho y marcas de agua dura en azulejos, canceles de vidrio e inodoros con fragancia marina refrescante.",
    category: "Limpieza de Baño",
    price: 149,
    originalPrice: 180,
    rating: 4.7,
    reviewsCount: 96,
    stock: 50,
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&fit=crop",
    has3DModel: false,
  },
  {
    id: "prod-5",
    merchantId: "m-101",
    merchantName: "EcoClean Insumos",
    merchantLogo: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=120&h=120&fit=crop",
    title: "Difusor y Sanitizador Ambiental Automático 3D",
    description: "Aromatizante y purificador ultrasónico inteligente programable con aceites esenciales antibacteriales de lavanda, eucalipto y menta.",
    category: "Aromas",
    price: 589,
    originalPrice: 720,
    rating: 4.8,
    reviewsCount: 112,
    stock: 18,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&fit=crop",
    has3DModel: true,
    dimensions: { width: "15 cm", height: "22 cm", depth: "15 cm" },
    colors: ["#ffffff", "#1e293b"],
  },
  {
    id: "prod-6",
    merchantId: "m-102",
    merchantName: "Detergentes Pro MX",
    merchantLogo: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=120&h=120&fit=crop",
    title: "Desengrasante Industrial Citrus para Cocina 1L 3D",
    description: "Elimina grasa incrustada y aceite quemado en campanas, estufas, parrillas y freidoras sin dañar acabados de acero inoxidable ni esmalte.",
    category: "Limpieza de Cocina",
    price: 179,
    originalPrice: 210,
    rating: 4.9,
    reviewsCount: 134,
    stock: 40,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&fit=crop",
    has3DModel: true,
    dimensions: { width: "10 cm", height: "26 cm", depth: "10 cm" },
  }
];

export const INITIAL_SERVICES: ServiceProvider[] = [
  {
    id: "srv-1",
    name: "Técnico Plomero Certificado Carlos M.",
    businessName: "Plomería Express Homeli",
    category: "Plomería",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&fit=crop",
    rating: 4.95,
    completedJobs: 240,
    hourlyRate: 350,
    fixedPrice: 450,
    description: "Especialista con más de 12 años en detección de fugas invisibles, reparación de tuberías PEX/PVC, hidroneumáticos y calentadores solares.",
    coverageRadiusKm: 15,
    isVerified: true,
    availability: "Disponible hoy - Atiende emergencias 24/7",
    phone: "+52 222 555 1234",
  },
  {
    id: "srv-2",
    name: "Servicio de Limpieza Profunda Homeli Clean",
    businessName: "EcoClean Residencial",
    category: "Limpieza",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop",
    rating: 4.9,
    completedJobs: 410,
    hourlyRate: 280,
    fixedPrice: 650,
    description: "Personal uniformado y verificado con insumos ecológicos. Desinfección de salas, colchones, cocina y baños.",
    coverageRadiusKm: 20,
    isVerified: true,
    availability: "Citas disponibles esta semana",
    phone: "+52 222 555 5678",
  },
  {
    id: "srv-3",
    name: "Ing. Jorge Ramos - Mantenimiento A/C y Climas",
    businessName: "ClimaTech Soluciones",
    category: "Mantenimiento",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
    rating: 4.88,
    completedJobs: 180,
    hourlyRate: 400,
    fixedPrice: 750,
    description: "Mantenimiento preventivo y correctivo de aire acondicionado minisplit e industrial. Recarga de gas ecológico R410A y diagnóstico digital.",
    coverageRadiusKm: 25,
    isVerified: true,
    availability: "Disponible mañana",
    phone: "+52 222 555 9012",
  },
  {
    id: "srv-4",
    name: "Electricista Certificado CFE - Roberto V.",
    businessName: "Voltio Seguro",
    category: "Electricidad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop",
    rating: 4.92,
    completedJobs: 310,
    hourlyRate: 380,
    fixedPrice: 500,
    description: "Instalación de centros de carga, tierras físicas, luminarias LED smart y solución de cortos circuitos de alta complejidad.",
    coverageRadiusKm: 18,
    isVerified: true,
    availability: "Disponible hoy",
    phone: "+52 222 555 3456",
  },
  {
    id: "srv-5",
    name: "Pinturas & Acabados de Lujo - Grupo Deco",
    businessName: "Pintores Profesionales Homeli",
    category: "Pintura",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop",
    rating: 4.85,
    completedJobs: 145,
    hourlyRate: 300,
    fixedPrice: 1200,
    description: "Aplicación de pintura vinílica lavable, impermeabilizaciones garantizadas por 5 a 10 años e instalación de papel tapiz.",
    coverageRadiusKm: 30,
    isVerified: true,
    availability: "Citas con previa valoración",
    phone: "+52 222 555 7890",
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    authorName: "Sofía Martínez",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&fit=crop",
    authorRole: "Vecino verificado - Lomas de Angelópolis",
    timestamp: "Hace 20 min",
    content: "¡Hola comunidad Homeli! 👋 ¿Alguien me puede recomendar un excelente plomero para cambiar la grifería de mi cocina esta tarde? Necesito alguien puntual y que acepte pago por la Billetera Homeli.",
    likes: 14,
    isLiked: false,
    commentsCount: 3,
    category: "Pregunta local",
    comments: [
      { id: "c1", author: "Carlos M.", text: "¡Hola Sofía! Yo tengo disponibilidad a las 4:00 PM con garantía Homeli en el trabajo.", time: "Hace 15 min" },
      { id: "c2", author: "Andrés P.", text: "Te recomiendo 100% a Plomería Express Homeli en la sección de Servicios de la app. Los contraté la semana pasada.", time: "Hace 10 min" }
    ]
  },
  {
    id: "post-2",
    authorName: "EcoClean Insumos",
    authorAvatar: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=120&h=120&fit=crop",
    authorRole: "Negocio Aliado Oficial 🌟",
    timestamp: "Hace 1 hora",
    content: "🎉 ¡NUEVO LANZAMIENTO EN WEBAR! Ya puedes proyectar nuestro nuevo 'Kit Limpiador Multiusos Biodegradable' en tu cocina o área de lavado con la cámara de tu teléfono en 3D. Usa el cupón HOMELI20 para 20% OFF.",
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&fit=crop",
    likes: 48,
    isLiked: true,
    commentsCount: 8,
    category: "Oferta",
    isSponsored: true,
    comments: [
      { id: "c3", author: "Lucía F.", text: "¡Lo acabo de visualizar con el visor WebAR y ya pedí el paquete de 3 atomizadores ecológicos!", time: "Hace 30 min" }
    ]
  },
  {
    id: "post-3",
    authorName: "Homeli IA Bot",
    authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&fit=crop",
    authorRole: "Asistente Inteligente Homeli 🤖",
    timestamp: "Hace 3 horas",
    content: "💡 Consejo de Limpieza del día: Para desinfectar pisos de cerámica o madera sin manchar, utiliza limpiadores ecológicos pH neutro. Encuentra las mejores marcas biodegradables en nuestro Marketplace de Limpieza.",
    likes: 89,
    isLiked: false,
    commentsCount: 12,
    category: "Recomendación",
    comments: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9421",
    customerId: "usr-01",
    customerName: "Mano Varadhan",
    customerPhone: "+52 222 628 5414",
    deliveryAddress: "Calle de los Azahares 402, Lomas de Angelópolis, Puebla",
    merchantId: "m-101",
    merchantName: "EcoClean Insumos",
    items: [
      {
        productId: "prod-1",
        title: "Kit Limpiador Multiusos Biodegradable 3D",
        price: 289,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300&fit=crop"
      }
    ],
    totalAmount: 578,
    deliveryFee: 45,
    status: "En camino",
    driverId: "drv-55",
    driverName: "Mateo Hernández",
    driverPhone: "+52 222 888 4321",
    driverLat: 19.0413,
    driverLng: -98.2062,
    createdAt: "2026-08-12 09:15 AM",
    invoiceType: "Factura",
    taxId: "VARM851208XX1",
    qrCodeToken: "HOMELI-QR-9421-TOKEN",
    trackingNumber: "HML-TRK-9421MX",
    escrowStatus: "in_escrow",
    escrowAmount: 578,
    isReviewSubmitted: false,
    trackingMilestones: [
      { time: "09:15 AM", title: "Pago Acreditado & Protegido en Escrow", location: "Plataforma Homeli", done: true },
      { time: "09:40 AM", title: "Empacado y listo para despacho", location: "Bodega EcoClean Puebla", done: true },
      { time: "10:15 AM", title: "Recolectado por Repartidor Partner", location: "EcoClean Insumos", done: true },
      { time: "10:30 AM", title: "En camino a tu domicilio (Seguimiento GPS)", location: "Ruta Angelópolis", done: true },
      { time: "Estimado 11:15 AM", title: "Entrega con PIN o Firma de Conformidad", location: "Calle de los Azahares 402", done: false }
    ]
  },
  {
    id: "ORD-8810",
    customerId: "usr-01",
    customerName: "Mano Varadhan",
    customerPhone: "+52 222 628 5414",
    deliveryAddress: "Calle de los Azahares 402, Lomas de Angelópolis, Puebla",
    merchantId: "m-102",
    merchantName: "Detergentes Pro MX",
    items: [
      {
        productId: "prod-2",
        title: "Detergente Líquido Concentrado Hipoalergénico 5L 3D",
        price: 349,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&fit=crop"
      }
    ],
    totalAmount: 394,
    deliveryFee: 45,
    status: "Entregado",
    driverId: "drv-55",
    driverName: "Mateo Hernández",
    driverPhone: "+52 222 888 4321",
    createdAt: "2026-08-10 14:20 PM",
    deliveredAt: "2026-08-10 16:05 PM",
    invoiceType: "Boleta",
    qrCodeToken: "HOMELI-QR-8810-TOKEN",
    trackingNumber: "HML-TRK-8810MX",
    escrowStatus: "released",
    escrowAmount: 349,
    isReviewSubmitted: true,
    trackingMilestones: [
      { time: "14:20 PM", title: "Pago Acreditado & Protegido", location: "Plataforma Homeli", done: true },
      { time: "14:45 PM", title: "Preparado en almacén", location: "Centro Detergentes Pro", done: true },
      { time: "15:20 PM", title: "Despachado con Repartidor", location: "Puebla Norte", done: true },
      { time: "16:05 PM", title: "Entregado a cliente (Recepción confirmada)", location: "Domicilio", done: true }
    ]
  }
];

export const INITIAL_BOOKINGS: ServiceBooking[] = [
  {
    id: "BKG-302",
    serviceId: "srv-1",
    serviceName: "Reparación de Fuga y Mantenimiento de Hidro",
    category: "Plomería",
    providerName: "Técnico Plomero Certificado Carlos M.",
    providerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&fit=crop",
    providerPhone: "+52 222 555 1234",
    customerName: "Mano Varadhan",
    customerAddress: "Calle de los Azahares 402, Lomas de Angelópolis",
    date: "2026-08-12",
    time: "16:00 PM",
    description: "Instalación de grifo monomando en tarja de cocina y chequeo de presión de agua.",
    status: "En camino",
    estimatedCost: 450,
    techLat: 19.038,
    techLng: -98.210
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  { id: "tx-1", type: "topup", title: "Recarga por Tarjeta Visa **** 4920", amount: 1500, date: "Hoy, 08:30 AM", status: "Completado" },
  { id: "tx-2", type: "payment", title: "Pago Servicio Plomería Express", amount: -450, date: "Ayer, 04:15 PM", status: "Completado" },
  { id: "tx-3", type: "reward", title: "Bonificación Puntos Homeli (Compra EcoClean Insumos)", amount: 120, date: "10 Ago 2026", status: "Completado" }
];

export const INITIAL_ADS: AdsCampaign[] = [
  {
    id: "ad-1",
    merchantName: "EcoClean Insumos",
    title: "Promoción Insumos y Productos de Limpieza WebAR 3D",
    bannerUrl: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&fit=crop",
    dailyBudget: 250,
    spent: 180,
    targetAudience: "Puebla - Hombres y Mujeres 20-60 años interesados en Limpieza y Desinfección",
    impressions: 4280,
    clicks: 342,
    conversions: 28,
    status: "Activo"
  }
];

export const INITIAL_KYC_DOCS: KycDocument[] = [
  {
    id: "kyc-01",
    applicantName: "Mano Varadhan",
    applicantRole: "B2C",
    docType: "INE / Cédula",
    docNumber: "ID-MX-22940219",
    submittedAt: "Hoy 07:10 AM",
    status: "Aprobado",
    documentFrontUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&fit=crop"
  },
  {
    id: "kyc-02",
    applicantName: "ElectroTech Home S.A. de C.V.",
    applicantRole: "B2B",
    docType: "Comprobante Fiscal",
    docNumber: "RFC: ETH1904128X9",
    submittedAt: "Ayer 06:40 PM",
    status: "Pendiente",
    documentFrontUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&fit=crop"
  },
  {
    id: "kyc-03",
    applicantName: "Mateo Hernández",
    applicantRole: "DRIVER",
    docType: "Pasaporte",
    docNumber: "PAS-MX-8839201",
    submittedAt: "Ayer 02:15 PM",
    status: "Aprobado",
    documentFrontUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&fit=crop"
  }
];

export const INITIAL_DISPUTES: DisputeCase[] = [
  {
    id: "DSP-102",
    orderOrBookingId: "ORD-8810",
    customerId: "usr-02",
    merchantId: "m-102",
    customerName: "Lucía Fernández",
    merchantName: "Detergentes Pro MX",
    reason: "Producto dañado o roto",
    description: "El envase llegó abollado con derrame parcial durante el traslado.",
    amount: 349,
    evidencePhotoUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&fit=crop",
    status: "En Mediación",
    createdAt: "09 Ago 2026"
  }
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  marketplaceCommissionPercent: 8.5,
  serviceCommissionPercent: 12.0,
  deliveryBaseFee: 35.0,
  deliveryFeePerKm: 12.0,
  adsCpcRate: 3.5
};

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    orderId: "ORD-8810",
    userName: "Valeria R. (Compradora Verificada)",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop",
    rating: 5,
    comment: "¡Excelente desinfectante! El atomizador tiene un acabado ergonómico premium. Además la visualización en 3D en la mesa de mi cocina antes de comprar me ayudó a comprobar el tamaño exacto.",
    isVerifiedPurchase: true,
    createdAt: "Ayer",
    photoUrl: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&fit=crop"
  },
  {
    id: "rev-2",
    productId: "prod-1",
    orderId: "ORD-7740",
    userName: "Eduardo Lozano",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&fit=crop",
    rating: 5,
    comment: "Llegó en menos de 45 minutos con entrega protegida. Aroma cítrico muy fresco que dura horas sin químicos irritantes.",
    isVerifiedPurchase: true,
    createdAt: "Hace 3 días"
  },
  {
    id: "rev-3",
    productId: "prod-2",
    orderId: "ORD-8810",
    userName: "Mano Varadhan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
    rating: 5,
    comment: "Muy rendidor y no mancha la ropa de color. Envío super puntual y la garantía de devolución da mucha tranquilidad.",
    isVerifiedPurchase: true,
    createdAt: "Hace 2 días"
  }
];

export const INITIAL_VENDOR_REPUTATIONS: Record<string, VendorReputation> = {
  "m-101": {
    merchantId: "m-101",
    merchantName: "EcoClean Insumos",
    level: "platinum",
    levelLabel: "MercadoLíder Platinum 🏅",
    onTimeDispatchPercent: 98.6,
    complaintRatePercent: 0.3,
    cancellationRatePercent: 0.2,
    completedSales60Days: 480,
    rating: 4.95,
    escrowBalance: 1250.00, // En custodia temporal
    availableBalance: 8450.00 // Listo para retiro bancario
  },
  "m-102": {
    merchantId: "m-102",
    merchantName: "Detergentes Pro MX",
    level: "gold",
    levelLabel: "MercadoLíder Gold 🥇",
    onTimeDispatchPercent: 96.2,
    complaintRatePercent: 0.8,
    cancellationRatePercent: 0.5,
    completedSales60Days: 290,
    rating: 4.88,
    escrowBalance: 780.00,
    availableBalance: 4620.00
  },
  "m-103": {
    merchantId: "m-103",
    merchantName: "Limpieza Total Directo",
    level: "platinum",
    levelLabel: "MercadoLíder Platinum 🏅",
    onTimeDispatchPercent: 99.1,
    complaintRatePercent: 0.2,
    cancellationRatePercent: 0.1,
    completedSales60Days: 520,
    rating: 4.97,
    escrowBalance: 980.00,
    availableBalance: 12300.00
  },
  "m-104": {
    merchantId: "m-104",
    merchantName: "Higienix Soluciones",
    level: "silver",
    levelLabel: "Vendedor Destacado Silver 🥈",
    onTimeDispatchPercent: 94.0,
    complaintRatePercent: 1.2,
    cancellationRatePercent: 1.0,
    completedSales60Days: 140,
    rating: 4.75,
    escrowBalance: 420.00,
    availableBalance: 2100.00
  }
};

export const INITIAL_ORDER_MESSAGES: OrderMessage[] = [
  {
    id: "msg-1",
    orderId: "ORD-9421",
    senderId: "m-101",
    senderName: "EcoClean Insumos (Vendedor)",
    senderRole: "B2B",
    text: "¡Hola Mano! Tu pedido de atomizadores desinfectantes ya fue empacado con sello de seguridad biodegradable y va en camino con el repartidor.",
    timestamp: "09:42 AM"
  },
  {
    id: "msg-2",
    orderId: "ORD-9421",
    senderId: "usr-01",
    senderName: "Mano Varadhan (Comprador)",
    senderRole: "B2C",
    text: "¡Excelente! Por favor indícale al repartidor que toque el timbre del Depto 402.",
    timestamp: "09:48 AM"
  },
  {
    id: "msg-3",
    orderId: "ORD-9421",
    senderId: "m-101",
    senderName: "EcoClean Insumos (Vendedor)",
    senderRole: "B2B",
    text: "Anotado en la guía de entrega. Cualquier duda o detalle cuentas con Compra Protegida Homeli.",
    timestamp: "09:50 AM"
  }
];

export const INITIAL_MERCHANT_PAYOUTS: MerchantPayout[] = [
  {
    id: "pay-101",
    merchantId: "m-101",
    merchantName: "EcoClean Insumos",
    amount: 5000.00,
    bankName: "BBVA Bancomer",
    clabeNumber: "012680015489201934",
    status: "Procesado",
    requestedAt: "08 Ago 2026",
    referenceNumber: "SPEI-HML-884920"
  }
];

