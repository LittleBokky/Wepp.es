import React from 'react';
import { Product } from '../types';
import { Plus, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-wepp-red/20 transition-all duration-700"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-12 group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />

        {/* Overlay with details on hover */}
        <div className="absolute inset-0 bg-wepp-dark/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center p-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-6 bg-wepp-red"></div>
              <span className="text-wepp-red text-[10px] font-black uppercase tracking-widest">Especificaciones</span>
            </div>
            <p className="text-white text-sm leading-relaxed font-light">
              {product.description}
            </p>
            <button className="text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 pt-4 border-b border-white/20 pb-2 hover:border-wepp-red transition-colors">
              Ficha Técnica <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-6 left-6">
          <span className="bg-wepp-navy text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {product.category}
          </span>
        </div>

        {/* Product ID */}
        <div className="absolute bottom-6 right-6">
          <span className="text-slate-200 text-6xl font-black tracking-tighter opacity-50 group-hover:opacity-0 transition-opacity">
            {product.id}
          </span>
        </div>
      </div>

      <div className="p-10">
        <h3 className="font-black text-2xl leading-tight text-wepp-navy uppercase tracking-tighter mb-6 group-hover:text-wepp-red transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Referencia</span>
            <span className="text-wepp-navy text-xl font-black tracking-tighter">
              Art. Nr. {product.id}
            </span>
          </div>
          <button className="text-wepp-red font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
            Ver Detalles <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
