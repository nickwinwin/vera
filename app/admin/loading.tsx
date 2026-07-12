import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-brand-beige animate-spin mx-auto mb-4" />
        <p className="text-brand-muted text-sm">Adminbereich wird geladen...</p>
      </div>
    </div>
  );
}