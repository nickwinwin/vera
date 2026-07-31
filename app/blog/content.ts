export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  body: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'nisv-2025',
    title: 'NiSV für Kosmetikstudios: Was sich 2025 ändert',
    excerpt: 'Die NiSV betrifft jedes Studio mit IPL, Laser oder Radiofrequenz. Erfahren Sie, was sich 2025 ändert und wie Sie rechtssicher aufstellen.',
    date: '31. Juli 2026',
    readTime: '5 Min',
    category: 'NiSV-Grundlagen',
    body: `
Seit 2020 gilt die NiSV – die Verordnung zum Schutz vor nichtionisierender Strahlung. Viele Studios haben sich in den letzten Jahren auf die neuen Anforderungen eingestellt. Doch 2025 bringt neue Entwicklungen, die jedes Kosmetikstudio mit IPL-, Laser- oder Radiofrequenzgeräten kennen sollte.

**Was ist die NiSV überhaupt?**

Die NiSV regelt den Umgang mit Geräten, die nichtionisierende Strahlung abgeben – also Laser, IPL, Radiofrequenz und ähnliche Technologien. Ziel ist der Schutz von Kunden und Mitarbeitern vor gesundheitlichen Schäden.

Jedes Studio, das solche Geräte einsetzt, muss:
- Eine **Gefährdungsbeurteilung** durchführen
- **Einwilligungen** von Kunden einholen und dokumentieren
- **Wartungsnachweise** für alle Geräte führen
- **Behandlungsparameter** lückenlos dokumentieren
- Bei Bedarf der zuständigen Behörde **Auskunft** erteilen

**Was ändert sich 2025?**

1. **Verschärfte Kontrollen:** Immer mehr Bundesländer intensivieren ihre Prüfungen. Wer nicht vorbereitet ist, riskiert Bußgelder bis zu 50.000 Euro.
2. **Digitale Dokumentation wird erwartet:** Papierordner stoßen an ihre Grenzen. Prüfer erwarten zunehmend strukturierte, durchsuchbare Dokumentation.
3. **Nachschulungspflicht:** Fachkundenachweise müssen regelmäßig aktualisiert werden – auch das muss dokumentiert sein.

**Die 4 häufigsten Fehler bei der NiSV-Umsetzung**

1. **Unvollständige Gerätedokumentation:** Fehlende CE-Zertifikate, unklare Wartungsintervalle.
2. **Lückenhafte Einwilligungen:** Nicht alle erforderlichen Felder ausgefüllt, Unterschriften fehlen.
3. **Keine Behandlungsparameter:** Energie, Pulsdauer, Frequenz – alles muss dokumentiert sein.
4. **Papierchaos:** Im Prüfungsfall müssen Sie Dokumente in Minuten vorlegen können.

**So machen Sie Ihr Studio prüfungsbereit**

VERA hilft Ihnen dabei, alle NiSV-Anforderungen digital, rechtssicher und elegant zu erfüllen:
- **Geräteverwaltung** mit Seriennummer, Wartungsintervall und automatischer Erinnerung
- **Digitale Einwilligungen** per QR-Code – Ihre Kunden unterschreiben auf dem eigenen Smartphone
- **Revisionssichere PDF-Archivierung** aller Dokumente
- **Prüfungsbereit auf Knopfdruck** – ein Klick, und alle relevanten Unterlagen sind sortiert

**Fazit**

NiSV-Compliance ist keine Option – sie ist Pflicht. Aber sie muss nicht bedeuten, dass Sie im Papier untergehen. Mit den richtigen Werkzeugen wird aus der lästigen Pflicht ein echter Wettbewerbsvorteil.`
  },
  {
    slug: '80-prozent-weniger-verwaltung',
    title: '80 % weniger Verwaltung: Wie VERA Ihren Arbeitsalltag verändert',
    excerpt: '4,5 Stunden pro Woche für Verwaltung? Das geht auch anders. Wie VERA Ihren Studio-Alltag revolutioniert.',
    date: '28. Juli 2026',
    readTime: '4 Min',
    category: 'Studio-Alltag',
    body: `
Stellen Sie sich vor, Sie kommen morgens ins Studio. Kein Stapel Papier auf dem Schreibtisch. Keine Suche nach der richtigen Einwilligung. Kein Nachfragen bei Kunden.

Stattdessen: Ein Dashboard, das Ihnen auf einen Blick zeigt, wer heute kommt. QR-Codes, die Ihre Kunden selbst scannen. Ein PDF, das automatisch erstellt wird, sobald die Unterschrift geleistet ist.

**Wo die Zeit wirklich verloren geht**

Ein Kosmetikstudio verbringt durchschnittlich **4,5 Stunden pro Woche** mit Verwaltung:
- 90 Minuten für das Ausdrucken, Verteilen und Einsammeln von Einwilligungen
- 60 Minuten für das Abheften und Sortieren von Papierdokumenten
- 45 Minuten für Wartungstermin-Nachverfolgung
- 30 Minuten für händisches Eintragen von Behandlungsparametern
- 45 Minuten für Prüfungsvorbereitung

Pro Monat: 18 Stunden. Pro Jahr: über 200 Stunden, die für nichts da sind.

**Was VERA anders macht**

VERA digitalisiert diese Prozesse nicht einfach – sie denkt sie neu:

**Einwilligungen:** Der Kunde scannt einen QR-Code, beantwortet Gesundheitsfragen auf dem eigenen Smartphone, unterschreibt digital. Das PDF entsteht automatisch und wird revisionssicher gespeichert.

**Geräteverwaltung:** Einmal anlegen, dann macht VERA den Rest. Wartungsfristen werden automatisch überwacht. Kein Excel, kein Durchblättern.

**Prüfungsvorbereitung:** Ein Klick auf "Prüfungsbericht" – VERA generiert eine vollständige Übersicht aller relevanten Dokumente.

**Der echte Gewinn**

Die 80 % Zeitersparnis sind nicht das Entscheidende. Was wirklich zählt: Sie haben den Kopf frei. Für Ihre Kunden. Für Ihre Behandlungen.`
  },
  {
    slug: 'digitale-einwilligung-qr-code',
    title: 'QR-Code statt Klemmbrett: Der moderne Check-in',
    excerpt: 'Schluss mit Papierbergen: Wie die digitale Einwilligung per QR-Code Ihr Studio entlastet und Ihre Kunden begeistert.',
    date: '25. Juli 2026',
    readTime: '4 Min',
    category: 'Digitalisierung',
    body: `
Der erste Eindruck zählt. Wenn Ihr Kunde das Studio betritt, entscheidet sich in den ersten Sekunden, ob er sich wohlfühlt. Ein Klemmbrett mit Formular ist da nicht gerade einladend.

**Der QR-Code als Lösung**

Ein kleiner Aufsteller am Empfang. Der Kunde scannt den Code mit seinem Smartphone. Kein Warten, kein Stift, kein Papier. In zwei Minuten ist alles erledigt.

**So funktioniert es:**
1. Kunde scannt QR-Code am Empfang
2. Gesundheitsfragen werden auf dem Smartphone angezeigt
3. Kunde beantwortet und unterschreibt digital
4. PDF-Bestätigung geht automatisch per E-Mail
5. Dokument wird revisionssicher archiviert

**Warum Ihre Kunden es lieben werden**

- Keine unleserlichen Handschriften mehr
- Kein Warten, bis das Formular frei wird
- PDF zur eigenen Vorsorge direkt auf dem Handy
- Hygienisch – kein Stift, den vorher jemand anderes angefasst hat

**Warum Sie es lieben werden**

- Kein Durchblättern von Papierstapeln
- Kein händisches Abtippen in Excel
- Alle Dokumente auf Knopfdruck suchbar
- Prüfungsbereit, immer`
  },
  {
    slug: 'nisv-pruefung-checkliste',
    title: 'Was passiert bei einer NiSV-Prüfung? Ein Leitfaden',
    excerpt: 'Die zuständige Behörde kündigt eine Prüfung an. Sind Sie vorbereitet? Ein Leitfaden für Kosmetikstudios.',
    date: '22. Juli 2026',
    readTime: '6 Min',
    category: 'NiSV-Grundlagen',
    body: `
Eine NiSV-Prüfung kündigt sich in der Regel schriftlich an. Sie haben dann einige Wochen Zeit, Ihre Unterlagen zusammenzustellen. Was genau geprüft wird und wie Sie sich optimal vorbereiten.

**Was wird geprüft?**

1. **Gerätedokumentation:**
   - CE-Konformitätserklärungen für alle Geräte
   - Wartungsnachweise und -intervalle
   - Gefährdungsbeurteilungen

2. **Einwilligungen:**
   - Vollständig ausgefüllte Einwilligungserklärungen
   - Nachweis der Aufklärung
   - Digitale oder handschriftliche Unterschriften

3. **Behandlungsparameter:**
   - Dokumentierte Energieeinstellungen
   - Pulsdauer, Frequenz, Applikator-Größe
   - Übereinstimmung mit Herstellervorgaben

4. **Fachkunde:**
   - Nachweise der Mitarbeiter-Schulungen
   - Aktuelle Fachkundenachweise

**Häufige Beanstandungen**

- Fehlende CE-Zertifikate
- Unvollständige Einwilligungsbögen
- Keine Dokumentation der Behandlungsparameter
- Abgelaufene Wartungsfristen
- Fehlende Gefährdungsbeurteilungen

**Mit VERA sind Sie vorbereitet**

VERA führt Sie durch die gesamte Dokumentation. Alle relevanten Unterlagen sind an einem Ort, jederzeit abrufbar und prüfungsbereit sortiert.`
  },
  {
    slug: 'dsgvo-kosmetikstudio',
    title: 'DSGVO im Kosmetikstudio: Was Sie beachten müssen',
    excerpt: 'Datenschutz betrifft auch Kosmetikstudios. Was die DSGVO für Ihre Patientenverwaltung bedeutet und wie VERA hilft.',
    date: '18. Juli 2026',
    readTime: '4 Min',
    category: 'Recht & Sicherheit',
    body: `
Die DSGVO betrifft jedes Unternehmen, das personenbezogene Daten verarbeitet – auch Kosmetikstudios. Gerade bei Gesundheitsdaten (Anamnese, Hautzustand, Behandlungsdokumentation) gelten besondere Anforderungen.

**Was ist zu beachten?**

1. **Rechtsgrundlage:** Jede Datenverarbeitung benötigt eine Rechtsgrundlage. Bei Einwilligungen ist das Art. 6 Abs. 1 lit. a DSGVO, bei Gesundheitsdaten Art. 9 Abs. 2 lit. a.

2. **Informationspflichten:** Kunden müssen verstehen, welche Daten zu welchem Zweck verarbeitet werden. Die Datenschutzerklärung muss klar und verständlich sein.

3. **Auftragsverarbeitung:** Wenn Sie Cloud-Dienste nutzen, brauchen Sie einen AVV (Auftragsverarbeitungsvertrag) mit dem Anbieter.

4. **Aufbewahrungsfristen:** Einwilligungen müssen 10 Jahre aufbewahrt werden, personenbezogene Daten danach gelöscht.

5. **Auskunftsrechte:** Kunden können jederzeit Auskunft über ihre gespeicherten Daten verlangen.

**Wie VERA hilft**

VERA ist DSGVO-nativ entwickelt:
- Verschlüsselte Datenübertragung
- Deutsche Rechenzentren
- Automatische Löschung nach Aufbewahrungsfrist
- Revisionssichere PDF-Archivierung
- Auskunft auf Knopfdruck`
  },
];