import React from 'react';
import { Shield, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

/**
 * VERA Category Box Component
 * 
 * This is the core UI element for the "All Devices" grid.
 * It represents a NiSV regulatory category and its compliance status.
 */

interface CategoryBoxProps {
  category: string;
  status: 'success' | 'warning' | 'error' | 'inactive';
  device: string;
}

export const CategoryBox = ({ category, status, device }: CategoryBoxProps) => {
  return (
    <div className={`medical-card p-6 flex flex-col justify-between gap-4 transition-all duration-300 ${
      status === 'inactive' ? 'bg-white/50 border-dashed opacity-75' : 'bg-white shadow-sm'
    }`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          status === 'inactive' ? 'bg-brand-warm-white text-brand-muted' : 'bg-brand-warm-white text-brand-beige'
        }`}>
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1">
          {status === 'success' && <CheckCircle2 className="w-5 h-5 text-brand-success" />}
          {status === 'warning' && <AlertCircle className="w-5 h-5 text-orange-500" />}
          {status === 'error' && <AlertCircle className="w-5 h-5 text-brand-error" />}
          {status === 'inactive' && <div className="w-2 h-2 rounded-full bg-brand-border" />}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold leading-tight mb-1">{category.name}</h3>
        <p className="text-sm text-brand-muted line-clamp-2">{category.description}</p>
      </div>

      <div className="pt-4 border-t border-brand-warm-white flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wider text-brand-muted">
          {device ? (
            <span className="text-brand-beige">{device.name}</span>
          ) : (
            <span>Nicht konfiguriert</span>
          )}
        </div>
        {device && (
          <div className="text-brand-beige">
            <FileText className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBox;
