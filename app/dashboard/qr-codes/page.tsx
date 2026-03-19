'use client';

import { useState, useRef } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { QrCode, Download, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export default function QrCodesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const clinicSlug = user?.clinicSlug || 'beauty-lounge';
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/s/${clinicSlug}` : '';
  const qrRef = useRef<SVGSVGElement>(null);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    toast.success('Link in die Zwischenablage kopiert');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_Code_${clinicSlug}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
      toast.success('QR-Code heruntergeladen');
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">{t('dashboard.qr_codes')}</h1>
        <p className="text-brand-secondary">Generieren Sie QR-Codes für Ihr Studio, damit Kunden sich einchecken können.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-card bg-white p-8 flex flex-col items-center text-center"
        >
          <div className="w-64 h-64 bg-brand-warm-white border-2 border-brand-border rounded-2xl flex items-center justify-center mb-8 p-4">
            <QRCodeSVG 
              id="clinic-qr"
              value={qrUrl} 
              size={200}
              level="H"
              includeMargin={false}
              ref={qrRef}
              className="w-full h-full"
            />
          </div>
          
          <h2 className="text-2xl font-display font-bold mb-2">Haupt-QR-Code</h2>
          <p className="text-brand-secondary mb-8">Platzieren Sie diesen Code an Ihrem Empfang.</p>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            <button 
              onClick={downloadQR}
              className="btn-primary flex-1 min-w-[160px] flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> PNG Download
            </button>
            <button className="btn-outline flex-1 min-w-[160px] flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> PDF Druckvorlage
            </button>
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="medical-card bg-white p-6">
            <h3 className="text-lg font-bold mb-4">Direkt-Link</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={qrUrl}
                className="input-field flex-1 bg-brand-warm-white font-mono text-xs"
              />
              <button 
                onClick={handleCopy}
                className="btn-outline px-4 flex items-center gap-2 whitespace-nowrap"
              >
                {copied ? 'Kopiert!' : <><Copy className="w-4 h-4" /> Kopieren</>}
              </button>
            </div>
            <Link href={qrUrl} target="_blank" className="mt-4 text-sm text-brand-beige font-bold flex items-center gap-1 hover:underline">
              Vorschau öffnen <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          {/* ... (rest of the settings) */}

          <div className="medical-card bg-white p-6">
            <h3 className="text-lg font-bold mb-4">Einstellungen</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Logo im QR-Code</p>
                  <p className="text-xs text-brand-muted">Zeigt Ihr Studio-Logo in der Mitte an.</p>
                </div>
                <div className="w-12 h-6 bg-brand-beige rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Farbe anpassen</p>
                  <p className="text-xs text-brand-muted">QR-Code in Ihren Markenfarben.</p>
                </div>
                <div className="w-6 h-6 bg-brand-beige rounded border border-brand-border" />
              </div>
              <button className="w-full btn-outline py-2 text-sm flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Code neu generieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
