'use client';

import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { Bell, Search, Globe, User } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  const { language, setLanguage } = useI18n();

  return (
    <header className="h-20 bg-white border-b border-brand-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input 
            type="text" 
            placeholder="Suchen..." 
            className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
          className="flex items-center gap-1 text-sm font-medium text-brand-secondary hover:text-brand-beige transition-colors"
        >
          <Globe className="w-4 h-4" />
          {language.toUpperCase()}
        </button>
        
        <button className="relative text-brand-secondary hover:text-brand-beige transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-error rounded-full" />
        </button>

        <div className="h-8 w-px bg-brand-border" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{user?.name}</p>
            <p className="text-xs text-brand-muted capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-brand-warm-white rounded-full border border-brand-border flex items-center justify-center text-brand-beige">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
