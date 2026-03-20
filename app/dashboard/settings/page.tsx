'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Building, MapPin, Phone, Mail, Globe, Camera, Save, Bell, Shield, Users, Loader2, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import proceduresData from '@/data/procedures.json';

export default function SettingsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    owner_id: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logo_url: ''
  });

  const categories = proceduresData.filter(p => p.id !== 'anamnese');

  useEffect(() => {
    if (user?.clinicId) {
      fetchClinicData();
      fetchEquipment();
    }
  }, [user]);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('clinic_id', user!.clinicId);

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleUpdateDevice = async (categoryId: string, name: string) => {
    try {
      const existing = equipment.find(e => e.category_id === categoryId || e.type === categoryId);
      
      if (existing) {
        const { error } = await supabase
          .from('equipment')
          .update({ name })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('equipment')
          .insert({
            clinic_id: user!.clinicId,
            category_id: categoryId,
            type: categoryId,
            name: name,
            status: 'active'
          });
        if (error) throw error;
      }
      
      fetchEquipment();
      toast.success('Gerät aktualisiert');
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const fetchClinicData = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', user!.clinicId)
        .single();

      if (error) throw error;
      setFormData({
        name: data.name || '',
        owner_id: data.owner_id || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        website: data.website || '',
        logo_url: data.logo_url || ''
      });
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          website: formData.website
        })
        .eq('id', user!.clinicId);

      if (error) throw error;
      toast.success('Einstellungen erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving clinic data:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-beige animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: Building },
    { id: 'equipment', label: 'Geräte-Inventar', icon: Laptop },
    { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
    { id: 'security', label: 'Sicherheit', icon: Shield },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold">{t('dashboard.settings')}</h1>
        <p className="text-brand-secondary">Verwalten Sie Ihr Studio-Profil und Ihre Kontaktdaten.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="medical-card bg-white p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-brand-warm-white rounded-full border-2 border-brand-border flex items-center justify-center overflow-hidden">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building className="w-16 h-16 text-brand-beige/20" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-brand-beige text-white rounded-full shadow-lg border-2 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold">{formData.name}</h3>
            <p className="text-xs text-brand-muted">Studio-Logo</p>
          </div>

          <nav className="medical-card bg-white overflow-hidden">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-6 py-3 text-sm flex items-center gap-3 transition-colors ${
                  activeTab === tab.id 
                    ? 'font-bold bg-brand-beige text-white' 
                    : 'font-medium text-brand-secondary hover:bg-brand-warm-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="medical-card bg-white p-8 space-y-8"
              >
                <section className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-brand-border pb-4">Studio-Informationen</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-brand-secondary mb-2">Name des Studios</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-secondary mb-2">E-Mail-Adresse</label>
                      <input 
                        type="email" 
                        className="input-field" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-secondary mb-2">Website</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.website}
                        onChange={e => setFormData({...formData, website: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-brand-border pb-4">Adresse & Kontakt</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-brand-secondary mb-2">Anschrift</label>
                      <textarea 
                        rows={2}
                        className="input-field resize-none" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-secondary mb-2">Telefon</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </section>

                <div className="pt-6 border-t border-brand-border flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Änderungen speichern
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'equipment' && (
              <motion.div 
                key="equipment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="medical-card bg-white p-8 space-y-8"
              >
                <section className="space-y-6">
                  <div className="flex justify-between items-center border-b border-brand-border pb-4">
                    <h2 className="text-xl font-bold">Geräte-Inventar</h2>
                    <p className="text-xs text-brand-muted uppercase font-bold">NiSV Kategorien</p>
                  </div>
                  
                  <div className="space-y-4">
                    {categories.map((cat) => {
                      const device = equipment.find(e => e.category_id === cat.id || e.type === cat.id);
                      return (
                        <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-brand-warm-white/30 rounded-lg border border-brand-border/50">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{cat.name}</h4>
                            <p className="text-xs text-brand-muted">{cat.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text"
                              placeholder="Gerätename / Modell"
                              className="input-field text-sm py-1.5"
                              defaultValue={device?.name || ''}
                              onBlur={(e) => handleUpdateDevice(cat.id, e.target.value)}
                            />
                            <div className={`w-2 h-2 rounded-full ${device?.name ? 'bg-brand-success' : 'bg-brand-border'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="medical-card bg-white p-8"
              >
                <h2 className="text-xl font-bold mb-6">Benachrichtigungen</h2>
                <div className="space-y-6">
                  {[
                    { title: 'E-Mail Benachrichtigungen', desc: 'Erhalten Sie Updates zu neuen Einwilligungen per E-Mail.' },
                    { title: 'Wartungserinnerungen', desc: 'Benachrichtigung wenn Geräte-Wartungen anstehen.' },
                    { title: 'Compliance-Alerts', desc: 'Warnung bei fehlenden oder abgelaufenen Dokumenten.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-brand-border last:border-0">
                      <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm text-brand-muted">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-brand-beige rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="medical-card bg-white p-8"
              >
                <h2 className="text-xl font-bold mb-6">Sicherheit</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-secondary mb-2">Aktuelles Passwort</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-secondary mb-2">Neues Passwort</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <button className="btn-outline py-2 px-6 text-sm">Passwort ändern</button>
                  
                  <div className="pt-8 border-t border-brand-border">
                    <p className="font-bold text-brand-error mb-2">Account löschen</p>
                    <p className="text-sm text-brand-muted mb-4">Dies wird alle Ihre Daten unwiderruflich löschen.</p>
                    <button className="text-brand-error text-sm font-bold hover:underline">Studio-Account jetzt löschen</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div 
                key="team"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="medical-card bg-white p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Team-Verwaltung</h2>
                  <button className="btn-primary py-2 px-4 text-sm">Mitglied einladen</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-brand-warm-white rounded-brand border border-brand-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-beige text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-bold">{user?.name} (Ich)</p>
                        <p className="text-xs text-brand-muted">Inhaber • Admin</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-success uppercase tracking-widest">Aktiv</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
