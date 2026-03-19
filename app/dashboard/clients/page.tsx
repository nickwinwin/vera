'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Loader2,
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function ClientsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    if (user?.clinicId) {
      fetchClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('clinic_id', user!.clinicId)
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Klient wirklich löschen?')) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      toast.success('Klient gelöscht');
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const filteredClients = clients.filter(client => 
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">{t('dashboard.clients')}</h1>
          <p className="text-brand-secondary">Verwalten Sie Ihre Kunden und deren Behandlungsdokumentation.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Neuer Kunde
        </button>
      </div>

      <div className="medical-card bg-white overflow-hidden">
        <div className="p-4 border-b border-brand-border flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Kunden suchen..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-warm-white border border-brand-border rounded-brand focus:outline-none focus:border-brand-beige text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-warm-white border-b border-brand-border">
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Kunde</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Letzter Besuch</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Behandlungen</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-primary mb-2" />
                    <p className="text-brand-secondary">Kunden werden geladen...</p>
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-brand-secondary">Keine Kunden gefunden.</p>
                  </td>
                </tr>
              ) : filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-brand-warm-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-warm-white flex items-center justify-center text-brand-beige font-bold">
                        {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{client.first_name} {client.last_name}</p>
                        <p className="text-xs text-brand-muted">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-brand-secondary">
                      <Calendar className="w-4 h-4" /> {client.created_at ? new Date(client.created_at).toLocaleDateString('de-DE') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">Klient seit {client.created_at ? new Date(client.created_at).getFullYear() : 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-brand-success" /> 
                      <span className="text-xs font-medium text-brand-success">Aktiv</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="p-2 hover:bg-brand-warm-white rounded-brand text-brand-beige" 
                        title="Ansehen"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 hover:bg-red-50 rounded-brand text-brand-error"
                        title="Löschen"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-brand-border flex items-center justify-between">
          <p className="text-xs text-brand-muted">Zeige {filteredClients.length} von {clients.length} Kunden</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-brand-border rounded text-xs disabled:opacity-50" disabled>Vorherige</button>
            <button className="px-3 py-1 bg-brand-beige text-white rounded text-xs">1</button>
            <button className="px-3 py-1 border border-brand-border rounded text-xs disabled:opacity-50" disabled>Nächste</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-brand-border flex justify-between items-center">
                <h2 className="text-xl font-display font-bold">Klientendetails</h2>
                <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-brand-warm-white rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-brand-beige text-white flex items-center justify-center text-2xl font-bold">
                    {selectedClient.first_name.charAt(0)}{selectedClient.last_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedClient.first_name} {selectedClient.last_name}</h3>
                    <p className="text-brand-secondary">Klient seit {new Date(selectedClient.created_at).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-brand-warm-white rounded-brand">
                    <Mail className="w-5 h-5 text-brand-beige" />
                    <div>
                      <p className="text-xs text-brand-muted uppercase font-bold">E-Mail</p>
                      <p className="text-sm font-medium">{selectedClient.email || 'Nicht angegeben'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand-warm-white rounded-brand">
                    <Phone className="w-5 h-5 text-brand-beige" />
                    <div>
                      <p className="text-xs text-brand-muted uppercase font-bold">Telefon</p>
                      <p className="text-sm font-medium">{selectedClient.phone || 'Nicht angegeben'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand-warm-white rounded-brand">
                    <MapPin className="w-5 h-5 text-brand-beige" />
                    <div>
                      <p className="text-xs text-brand-muted uppercase font-bold">Adresse</p>
                      <p className="text-sm font-medium">{selectedClient.address || 'Nicht angegeben'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-border">
                  <button className="btn-primary w-full py-3">Behandlungshistorie ansehen</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
