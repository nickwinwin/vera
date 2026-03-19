'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { 
  Heart, 
  Activity, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ClientFormsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [step, setStep] = useState(1);

  const [healthData, setHealthData] = useState({
    diabetes: false,
    epilepsy: false,
    cancer: false,
    hormones: false,
    skin: false,
    meds: '',
    allergies: ''
  });

  const [sensitivityData, setSensitivityData] = useState({
    sunReaction: 'normal',
    tanning: false,
    recentPeeling: false
  });

  const nextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // After finishing the health questionnaire, go to choose the procedure
      router.push(`/s/${slug}/procedures`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col p-6">
      <div className="max-w-2xl w-full mx-auto">
        {/* Progress */}
        <div className="flex justify-between mb-12">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-brand-beige text-white' : 'bg-white text-brand-muted border border-brand-border'}`}>
                {step > s ? <Check className="w-6 h-6" /> : s}
              </div>
              {s === 1 && <div className={`flex-1 h-1 mx-4 rounded ${step > 1 ? 'bg-brand-beige' : 'bg-brand-border'}`} />}
            </div>
          ))}
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="medical-card bg-white p-8"
        >
          {step === 1 ? (
            <div className="space-y-8">
              <div className="text-center">
                <Heart className="w-12 h-12 text-brand-beige mx-auto mb-4" />
                <h1 className="text-2xl font-display font-bold">Allgemeine Anamnese</h1>
                <p className="text-brand-secondary">Bitte geben Sie Auskunft über Ihren Gesundheitszustand.</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-brand-dark uppercase tracking-wider">Erkrankungen (falls zutreffend)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'diabetes', label: 'Diabetes' },
                    { id: 'epilepsy', label: 'Epilepsie' },
                    { id: 'cancer', label: 'Krebserkrankung' },
                    { id: 'hormones', label: 'Hormonstörungen' },
                    { id: 'skin', label: 'Hauterkrankungen' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-3 p-3 border border-brand-border rounded-brand cursor-pointer hover:bg-brand-warm-white transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-brand-beige"
                        checked={(healthData as any)[item.id]}
                        onChange={(e) => setHealthData({...healthData, [item.id]: e.target.checked})}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Medikamenteneinnahme</label>
                  <textarea 
                    className="input-field min-h-[80px]" 
                    placeholder="Welche Medikamente nehmen Sie aktuell ein?"
                    value={healthData.meds}
                    onChange={(e) => setHealthData({...healthData, meds: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Allergien / Unverträglichkeiten</label>
                  <textarea 
                    className="input-field min-h-[80px]" 
                    placeholder="Haben Sie bekannte Allergien?"
                    value={healthData.allergies}
                    onChange={(e) => setHealthData({...healthData, allergies: e.target.value})}
                  />
                </div>
              </div>

              <button onClick={nextStep} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                Weiter <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <Activity className="w-12 h-12 text-brand-beige mx-auto mb-4" />
                <h1 className="text-2xl font-display font-bold">Hautsensibilität</h1>
                <p className="text-brand-secondary">Spezifische Fragen für lichtbasierte Behandlungen.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3">Wie reagiert Ihre Haut auf Sonne?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'burn', label: 'Brennt immer, bräunt nie' },
                      { id: 'normal', label: 'Brennt manchmal, bräunt langsam' },
                      { id: 'tan', label: 'Brennt selten, bräunt schnell' }
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-3 p-4 border rounded-brand cursor-pointer transition-all ${sensitivityData.sunReaction === opt.id ? 'border-brand-beige bg-brand-beige/5' : 'border-brand-border'}`}>
                        <input 
                          type="radio" 
                          name="sun"
                          className="w-5 h-5 accent-brand-beige"
                          checked={sensitivityData.sunReaction === opt.id}
                          onChange={() => setSensitivityData({...sensitivityData, sunReaction: opt.id})}
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-brand flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Wichtig: Falls Sie in den letzten 4 Wochen intensiver Sonnenstrahlung ausgesetzt waren, informieren Sie bitte Ihren Behandler.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 py-4 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> Zurück
                </button>
                <button onClick={nextStep} className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                  Abschließen <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
