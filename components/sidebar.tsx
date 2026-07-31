'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { 
  LayoutDashboard, 
  BookOpen, 
  Shield, 
  ClipboardList, 
  Users, 
  QrCode, 
  Settings, 
  CreditCard, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard.overview') },
    { href: '/dashboard/catalog', icon: BookOpen, label: t('dashboard.catalog') },
    { href: '/dashboard/equipment', icon: Shield, label: t('dashboard.my_equipment') },
    { href: '/dashboard/procedures', icon: ClipboardList, label: t('dashboard.procedures') },
    { href: '/dashboard/procedures/logs', icon: BookOpen, label: 'Behandlungs-Log' },
    { href: '/dashboard/clients', icon: Users, label: t('dashboard.clients') },
    { href: '/dashboard/qr-codes', icon: QrCode, label: t('dashboard.qr_codes') },
    { href: '/dashboard/settings', icon: Settings, label: t('dashboard.settings') },
    { href: '/dashboard/subscription', icon: CreditCard, label: t('dashboard.subscription') },
  ];

  return (
    <aside className={`bg-white border-r border-brand-border flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-20 flex items-center px-6 border-b border-brand-border overflow-hidden">
        <Shield className="w-8 h-8 text-brand-beige flex-shrink-0" />
        {!collapsed && <span className="ml-3 text-2xl font-display font-bold tracking-tight">VERA</span>}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-3 rounded-brand transition-colors group ${isActive ? 'bg-brand-beige text-white' : 'text-brand-secondary hover:bg-brand-warm-white hover:text-brand-beige'}`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-brand-muted group-hover:text-brand-beige'}`} />
              {!collapsed && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-brand-border">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center px-3 py-3 text-brand-secondary hover:bg-brand-warm-white rounded-brand transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-3 font-medium">Minimieren</span>
            </>
          )}
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center px-3 py-3 text-brand-error hover:bg-red-50 rounded-brand transition-colors mt-1"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 font-medium">Abmelden</span>}
        </button>
      </div>
    </aside>
  );
}
