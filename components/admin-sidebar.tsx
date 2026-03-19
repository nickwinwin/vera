'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { 
  BarChart3, 
  Building2, 
  Shield, 
  FileText, 
  Settings, 
  CreditCard, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: '/admin', icon: BarChart3, label: 'Plattform-Stats' },
    { href: '/admin/clinics', icon: Building2, label: 'Kliniken' },
    { href: '/admin/equipment', icon: Shield, label: 'Gerätekatalog' },
    { href: '/admin/documents', icon: FileText, label: 'Dokumententypen' },
    { href: '/admin/forms', icon: LayoutGrid, label: 'Formular-Templates' },
    { href: '/admin/subscriptions', icon: CreditCard, label: 'Abonnements' },
  ];

  return (
    <aside className={`bg-brand-dark text-white border-r border-white/10 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-20 flex items-center px-6 border-b border-white/10 overflow-hidden">
        <Shield className="w-8 h-8 text-brand-beige flex-shrink-0" />
        {!collapsed && <span className="ml-3 text-2xl font-display font-bold tracking-tight">VERA <span className="text-[10px] bg-brand-beige text-white px-1 rounded align-top">ADMIN</span></span>}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-3 rounded-brand transition-colors group ${isActive ? 'bg-brand-beige text-white' : 'text-brand-muted hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-brand-muted group-hover:text-white'}`} />
              {!collapsed && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center px-3 py-3 text-brand-muted hover:bg-white/5 rounded-brand transition-colors"
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
          className="w-full flex items-center px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-brand transition-colors mt-1"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 font-medium">Abmelden</span>}
        </button>
      </div>
    </aside>
  );
}
