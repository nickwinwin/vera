export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-brand-warm-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-brand p-8 medical-card">
        <h1 className="text-3xl font-display font-bold mb-6">Impressum</h1>
        <p className="text-brand-secondary mb-4">Angaben gemäß § 5 TMG</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">Betreiber</h2>
        <p className="text-brand-secondary">VERA NiSV-AUDIT<br />[Name des Betreibers]<br />[Straße und Hausnummer]<br />[PLZ Ort]</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">Kontakt</h2>
        <p className="text-brand-secondary">E-Mail: [E-Mail-Adresse]<br />Telefon: [Telefonnummer]</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p className="text-brand-secondary">[Name des Verantwortlichen]<br />[Adresse]</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">Haftungsausschluss</h2>
        <p className="text-brand-secondary">Die Inhalte dieser Plattform wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
      </div>
    </div>
  );
}