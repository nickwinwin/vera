import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="w-16 h-16 text-brand-muted mb-4" />
      <h1 className="text-4xl font-display font-bold mb-2">404</h1>
      <p className="text-xl text-brand-secondary mb-2">Seite nicht gefunden</p>
      <p className="text-brand-muted mb-8">Die angeforderte Seite existiert nicht.</p>
      <Link href="/" className="btn-primary px-6 py-2">
        Zur Startseite
      </Link>
    </div>
  );
}