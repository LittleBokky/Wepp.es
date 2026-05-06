export interface Product {
  id: string;
  name: string;
  category: 'Motor y Transmisión' | 'Refrigeración' | 'Aire Acondicionado' | 'Combustible' | 'Frenos' | 'Mantenimiento y Cuidado' | 'Carrocería';
  description: string;
  price: number;
  image: string;
  features: string[];
}

export const PRODUCTS: Product[] = [
  // MOTOR Y TRANSMISIÓN
  {
    id: '2010',
    name: 'WEPP 2010 Motor-System-Reiniger',
    category: 'Motor y Transmisión',
    description: 'Limpiador de alto rendimiento para el sistema del motor. Elimina depósitos y mejora el rendimiento.',
    price: 28.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2010_7.jpg',
    features: ['Deposit Control Technology', 'Limpieza profunda', 'Mejora la compresión']
  },
  {
    id: '2011',
    name: 'WEPP 2011 Ölstop-Additiv',
    category: 'Motor y Transmisión',
    description: 'Aditivo para detener fugas de aceite. Regenera juntas de goma y plástico.',
    price: 19.90,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2011_640px.jpg',
    features: ['Detiene fugas', 'Regenera juntas', 'Reduce el consumo de aceite']
  },
  {
    id: '2012',
    name: 'WEPP 2012 Getriebe-Öl-Additiv',
    category: 'Motor y Transmisión',
    description: 'Aditivo para aceite de transmisión. Reduce el desgaste y el ruido.',
    price: 22.00,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2012_640px.jpg',
    features: ['Suaviza el cambio', 'Reduce fricción', 'Larga duración']
  },
  {
    id: '2013',
    name: 'WEPP 2013 ATF-Cleaner',
    category: 'Motor y Transmisión',
    description: 'Limpiador para transmisiones automáticas. Elimina depósitos antes del cambio de fluido.',
    price: 24.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2013_640px.jpg',
    features: ['Limpieza ATF', 'Sin residuos', 'Protege componentes']
  },
  {
    id: '2014',
    name: 'WEPP 2014 ATF-Protection',
    category: 'Motor y Transmisión',
    description: 'Protección para transmisiones automáticas. Mejora la estabilidad térmica.',
    price: 26.00,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2014_640px.jpg',
    features: ['Estabilidad térmica', 'Reduce oxidación', 'Mejora el rendimiento']
  },

  // COMBUSTIBLE
  {
    id: '2031',
    name: 'WEPP 2031 Drosselkl.-Vergaser-Reiniger',
    category: 'Combustible',
    description: 'Limpiador especializado para mariposas y carburadores. Elimina resinas y barnices.',
    price: 18.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2031_640px.jpg',
    features: ['Limpieza instantánea', 'Sin desmontaje', 'Mejora ralentí']
  },
  {
    id: '2032',
    name: 'WEPP 2032 Diesel-System-Schutz',
    category: 'Combustible',
    description: 'Protección integral para sistemas de inyección Diésel. Certificación TÜV.',
    price: 24.90,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2032_1.jpg',
    features: ['Certificación TÜV', 'Protección inyectores', 'Reduce emisiones']
  },
  {
    id: '2032+',
    name: 'WEPP 2032+ Diesel Complete Clean',
    category: 'Combustible',
    description: 'Limpieza profunda de todo el sistema de combustible diesel. Máximo rendimiento.',
    price: 32.00,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/Wepp-2032_.jpg',
    features: ['Limpieza total', 'Aumento de Cetano', 'Ahorro combustible']
  },

  // REFRIGERACIÓN
  {
    id: '2020',
    name: 'WEPP 2020 Kühlsystem-Sicherung',
    category: 'Refrigeración',
    description: 'Protección y lubricación permanente para el sistema de refrigeración.',
    price: 16.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2020_640px.jpg',
    features: ['Evita corrosión', 'Lubrica bomba de agua', 'Protege termostato']
  },
  {
    id: '2021',
    name: 'WEPP 2021 Kühlerdicht',
    category: 'Refrigeración',
    description: 'Sellador de fugas de alto rendimiento para radiadores y sistemas de calefacción.',
    price: 18.00,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2021_640px.jpg',
    features: ['Sella grietas', 'No obstruye', 'Uso preventivo']
  },
  {
    id: '2023',
    name: 'WEPP 2023 Kühlerreinigung',
    category: 'Refrigeración',
    description: 'Limpiador de radiador. Elimina depósitos de cal, lodos y contaminantes.',
    price: 15.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2023_640px.jpg',
    features: ['Elimina cal', 'Mejora transferencia calor', 'Neutro con juntas']
  },

  // AIRE ACONDICIONADO
  {
    id: '20241000',
    name: 'WEPP 2024 Klimafresh',
    category: 'Aire Acondicionado',
    description: 'Refrescante biológico para sistemas de aire acondicionado. Elimina olores de raíz.',
    price: 12.90,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2024-1000_640px.jpg',
    features: ['Elimina olores', 'Acción biológica', 'Fácil uso']
  },
  {
    id: '2025-A',
    name: 'WEPP 2025 Airfresh',
    category: 'Aire Acondicionado',
    description: 'Ambientador profesional de larga duración para el habitáculo del vehículo.',
    price: 9.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2025_640px.jpg',
    features: ['Larga duración', 'Fragancia premium', 'Neutraliza olores']
  },
  {
    id: '2127',
    name: 'WEPP 2127 Luftkanal-Reiniger',
    category: 'Aire Acondicionado',
    description: 'Limpiador de conductos de ventilación. Higieniza el sistema A/C profesionalmente.',
    price: 19.00,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2127_640px.jpg',
    features: ['Limpieza profunda', 'Higienizante', 'Sin humos tóxicos']
  },

  // FRENOS
  {
    id: '2060',
    name: 'WEPP 2060 Bremsen-Reiniger',
    category: 'Frenos',
    description: 'Limpiador de frenos de alta potencia. Secado rápido sin residuos.',
    price: 8.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2060_640px.jpg',
    features: ['Efecto desengrasante', 'Secado rápido', 'Alta presión']
  },
  {
    id: '2055',
    name: 'WEPP 2055 Bremsen-System-Schutz',
    category: 'Frenos',
    description: 'Tratamiento protector para componentes metálicos del sistema de frenos.',
    price: 14.00,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2055_640px.jpg',
    features: ['Evita ruidos', 'Protección corrosión', 'Uso profesional']
  },
  {
    id: '2455',
    name: 'WEPP 2455 Bremsen-Paste',
    category: 'Frenos',
    description: 'Pasta cerámica de alta temperatura para sistemas de frenado. Antichirrido.',
    price: 12.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2455_640px.jpg',
    features: ['Antichirrido', 'Sin metal', 'Resistente al calor']
  },

  // MANTENIMIENTO Y CUIDADO
  {
    id: '2040',
    name: 'WEPP 2040 Haftsynthese 2000',
    category: 'Mantenimiento y Cuidado',
    description: 'Lubricante sintético de alta adherencia para partes móviles sometidas a presión.',
    price: 16.00,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2040_640px.jpg',
    features: ['Extrema adherencia', 'Soporta presión', 'Larga duración']
  },
  {
    id: '2026',
    name: 'WEPP 2026 Scheibenwasch-Konzentrat',
    category: 'Mantenimiento y Cuidado',
    description: 'Limpiaparabrisas concentrado 1:100 de alta eficacia Verano.',
    price: 7.90,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2026_640px.jpg',
    features: ['Super concentrado', 'Elimina insectos', 'Sin rastro']
  },

  // CARROCERÍA
  {
    id: '2083',
    name: 'WEPP 2083 Reiniger 1L',
    category: 'Carrocería',
    description: 'Limpiador industrial de alta potencia para superficies metálicas y plásticas de la carrocería.',
    price: 14.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2083_640px.jpg',
    features: ['Limpieza industrial', 'Desengrasante', 'Multiusos']
  },
  {
    id: '2090',
    name: 'WEPP 2090 Metallschutz-Spray',
    category: 'Carrocería',
    description: 'Spray protector de metales contra la corrosión y agentes externos.',
    price: 15.90,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2090_640px.jpg',
    features: ['Anticorrosivo', 'Resistente al agua', 'Larga duración']
  },
  {
    id: '2091',
    name: 'WEPP 2091 Unterbodenschutz',
    category: 'Carrocería',
    description: 'Protección de bajos para vehículos. Resistente a impactos y salinidad.',
    price: 17.50,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2091_640px.jpg',
    features: ['Protección de bajos', 'Resistente a la sal', 'Insonorizante']
  },
  {
    id: '2092',
    name: 'WEPP 2092 Hohlraumversiegelung',
    category: 'Carrocería',
    description: 'Sellador de cavidades para prevenir la corrosión interna en estructuras de vehículos.',
    price: 19.80,
    image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2092_640px.jpg',
    features: ['Sellado interno', 'Alta penetración', 'Previene el óxido']
  }
];

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
  date: string;
  salespersonId?: string;
  shippingAddress: string;
}

export interface Comercial {
  id: string;
  name: string;
  email: string;
  region: string;
  commissions: number;
  totalSales: number;
  status: 'Activo' | 'Inactivo';
  joinDate: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeComerciales: number;
  inventoryValue: number;
  salesGrowth: number;
  recentOrders: Order[];
}

export interface VendorCredential {
  id: string;
  username: string;
  passwordHash: string;
  salespersonId: string;
  name: string;
  active: boolean;
  createdAt: string;
}

export interface WorkshopCredential {
  id: string;
  username: string;
  passwordHash: string;
  tallerId: string;
  name: string;
  active: boolean;
  createdAt: string;
}

export interface UserSession {
  type: 'admin' | 'vendor' | 'workshop';
  email?: string;
  credential?: VendorCredential;
  workshopCredential?: WorkshopCredential;
}

export interface Taller {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  joinDate: string;
  notes?: string;
  salespersonId?: string;
}

export interface Budget {
  id: string;
  tallerId: string;
  tallerName: string;
  salespersonId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'Borrador' | 'Enviado' | 'Aceptado' | 'Rechazado';
  createdAt: string;
  validUntil: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

