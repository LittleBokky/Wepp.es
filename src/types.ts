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
  {
    id: '2010',
    name: 'Motor-System-Reiniger',
    category: 'Motor y Transmisión',
    description: 'Limpiador de alto rendimiento para el sistema del motor. Elimina depósitos y mejora el rendimiento.',
    price: 28.50,
    image: 'https://picsum.photos/seed/wepp2010/400/600',
    features: ['Deposit Control Technology', 'Limpieza profunda', 'Mejora la compresión']
  },
  {
    id: '2011',
    name: 'Ölstop-Additiv',
    category: 'Motor y Transmisión',
    description: 'Aditivo para detener fugas de aceite. Regenera juntas de goma y plástico.',
    price: 19.90,
    image: 'https://picsum.photos/seed/wepp2011/400/600',
    features: ['Detiene fugas', 'Regenera juntas', 'Reduce el consumo de aceite']
  },
  {
    id: '2012',
    name: 'Getriebe-Öl-Additiv',
    category: 'Motor y Transmisión',
    description: 'Aditivo para aceite de transmisión. Reduce el desgaste y el ruido.',
    price: 22.00,
    image: 'https://picsum.photos/seed/wepp2012/400/600',
    features: ['Suaviza el cambio', 'Reduce fricción', 'Larga duración']
  },
  {
    id: '2013',
    name: 'ATF-Cleaner',
    category: 'Motor y Transmisión',
    description: 'Limpiador para transmisiones automáticas. Elimina depósitos antes del cambio de fluido.',
    price: 24.50,
    image: 'https://picsum.photos/seed/wepp2013/400/600',
    features: ['Limpieza ATF', 'Sin residuos', 'Protege componentes']
  },
  {
    id: '2014',
    name: 'ATF-Protection',
    category: 'Motor y Transmisión',
    description: 'Protección para transmisiones automáticas. Mejora la estabilidad térmica.',
    price: 26.00,
    image: 'https://picsum.photos/seed/wepp2014/400/600',
    features: ['Estabilidad térmica', 'Reduce oxidación', 'Mejora el rendimiento']
  },
  {
    id: '2015',
    name: 'Power-Steering-Cleaner',
    category: 'Motor y Transmisión',
    description: 'Limpiador para sistemas de dirección asistida. Elimina contaminantes.',
    price: 18.75,
    image: 'https://picsum.photos/seed/wepp2015/400/600',
    features: ['Limpieza dirección', 'Evita ruidos', 'Fácil aplicación']
  },
  {
    id: '2006',
    name: 'Klima-Desinfektions-Pistole',
    category: 'Aire Acondicionado',
    description: 'Herramienta profesional para la desinfección de sistemas de aire acondicionado.',
    price: 145.00,
    image: 'https://picsum.photos/seed/wepp2006/400/600',
    features: ['Uso profesional', 'Desinfección total', 'Alta calidad']
  }
];
