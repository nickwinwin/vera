export const CONSENT_TEMPLATES = [
  {
    name: "Allgemeiner Anamnesebogen",
    category: "anamnese",
    content: {
      sections: [
        {
          title: "1. Persönliche Daten",
          fields: [
            { id: "first_name", label: "Vorname", type: "text", required: true },
            { id: "last_name", label: "Nachname", type: "text", required: true },
            { id: "dob", label: "Geburtsdatum", type: "date", required: true },
            { id: "address", label: "Straße + Hausnummer", type: "text", required: true },
            { id: "city", label: "PLZ + Ort", type: "text", required: true },
            { id: "phone", label: "Telefon (Mobil)", type: "tel", required: true },
            { id: "email", label: "E-Mail", type: "email", required: true }
          ]
        },
        {
          title: "2. Allgemeiner Gesundheitszustand",
          fields: [
            { 
              id: "conditions", 
              label: "Erkrankungen (Mehrfachauswahl)", 
              type: "checkbox-group", 
              options: [
                "Herz-Kreislauf-Erkrankungen",
                "Diabetes",
                "Krebs (auch in der Vergangenheit)",
                "Epilepsie",
                "Autoimmunerkrankungen",
                "Hormonstörungen",
                "Hauterkrankungen",
                "Neigung zu schlechter Wundheilung",
                "Pigmentstörungen / Hyperpigmentierung nach Verletzungen"
              ]
            },
            { id: "other_conditions", label: "Sonstige Erkrankungen", type: "text" },
            { id: "medication", label: "Medikamenteneinnahme (Welche?)", type: "text" },
            { id: "allergies", label: "Allergien / Unverträglichkeiten", type: "text" },
            { id: "infections", label: "Infektionskrankheiten in der Vergangenheit", type: "text" },
            { id: "sun_reaction", label: "Hautreaktionen auf Sonne / Licht", type: "boolean" },
            { id: "previous_treatments", label: "Frühere kosmetische oder medizinische Behandlungen", type: "text" },
            { id: "pregnancy", label: "Aktuelle Schwangerschaft", type: "boolean" },
            { id: "smoking", label: "Rauchen (Menge pro Tag)", type: "text" },
            { id: "alcohol", label: "Alkohol (Häufigkeit)", type: "text" }
          ]
        },
        {
          title: "Abschluss, Datenschutz & Verantwortung",
          fields: [
            { 
              id: "consent_text", 
              type: "info", 
              text: "Ich bestätige hiermit, dass ich die vorstehenden Angaben nach bestem Wissen und Gewissen vollständig und wahrheitsgemäß gemacht habe. Mir ist bekannt, dass unvollständige oder falsche Angaben mögliche Risiken bei kosmetischen oder medizinisch-ästhetischen Behandlungen erhöhen können. Für daraus entstehende Folgen übernehme ich die volle Verantwortung. Ich willige ein, dass meine personenbezogenen Daten sowie meine Gesundheitsangaben gemäß der Datenschutz-Grundverordnung (DSGVO) ausschließlich zum Zweck der Kundenbetreuung, Dokumentation und Durchführung von Behandlungen in diesem Studio gespeichert und verarbeitet werden."
            },
            { id: "signature", label: "Unterschrift Kunde", type: "signature", required: true }
          ]
        }
      ]
    }
  },
  {
    name: "Einwilligungserklärung Chemisches Peeling",
    category: "peeling",
    content: {
      sections: [
        {
          title: "Behandlungsaufklärung",
          fields: [
            { 
              id: "info", 
              type: "info", 
              text: "Mir wurde erläutert, dass es sich hierbei um eine kosmetische/ästhetische Behandlung handelt, bei der durch den Einsatz von Fruchtsäuren oder anderen chemischen Substanzen die oberen Hautschichten kontrolliert abgetragen werden. Mögliche Risiken: Rötungen, Brennen, Schuppung, Pigmentveränderungen."
            },
            { id: "sun_protection", label: "Ich bestätige, dass ich nach der Behandlung direkten Sonnenschutz verwenden werde.", type: "boolean", required: true },
            { id: "signature", label: "Digitale Unterschrift des Kunden", type: "signature", required: true }
          ]
        }
      ]
    }
  },
  {
    name: "Einwilligungserklärung IPL-Behandlung",
    category: "ipl",
    content: {
      sections: [
        {
          title: "IPL Aufklärung",
          fields: [
            { 
              id: "info", 
              type: "info", 
              text: "IPL-Behandlung (Intense Pulsed Light) zur Behandlung von Pigmentveränderungen, Gefäßveränderungen sowie zur Hautverjüngung. Mögliche Nebenwirkungen: Rötungen, Schwellungen, Pigmentveränderungen."
            },
            { id: "no_contraindications", label: "Ich bestätige, dass keine Kontraindikationen (Schwangerschaft, lichtempfindliche Erkrankungen) vorliegen.", type: "boolean", required: true },
            { id: "signature", label: "Digitale Unterschrift des Kunden", type: "signature", required: true }
          ]
        }
      ]
    }
  },
  {
    name: "Einwilligungserklärung Klassische Gesichtsbehandlung",
    category: "classic",
    content: {
      sections: [
        {
          title: "Behandlungsumfang",
          fields: [
            { 
              id: "info", 
              type: "info", 
              text: "Umfasst Reinigung, Ausreinigung, Ultraschall, Masken, Massage. Es kann vorübergehend zu Rötungen oder Irritationen kommen."
            },
            { id: "signature", label: "Unterschrift Kunde", type: "signature", required: true }
          ]
        }
      ]
    }
  },
  {
    name: "Einwilligungserklärung Microneedling",
    category: "microneedling",
    content: {
      sections: [
        {
          title: "Microneedling Aufklärung",
          fields: [
            { 
              id: "info", 
              type: "info", 
              text: "Gezielte Mikroverletzungen der Haut zur Regeneration. Risiken: Rötungen, Schwellungen, kleine Blutungen. Nachsorge: Kein Solarium/Sauna für mehrere Tage."
            },
            { id: "signature", label: "Digitale Unterschrift des Kunden", type: "signature", required: true }
          ]
        }
      ]
    }
  },
  {
    name: "Einwilligungserklärung Radiofrequenz (RF)",
    category: "rf",
    content: {
      sections: [
        {
          title: "Radiofrequenz Aufklärung",
          fields: [
            { 
              id: "info", 
              type: "info", 
              text: "Hochfrequente elektrische Energie zur Gewebserwärmung und Kollagenbildung. Risiken: Rötungen, Wärmegefühl, seltene Verbrennungen."
            },
            { id: "signature", label: "Digitale Unterschrift des Kunden", type: "signature", required: true }
          ]
        }
      ]
    }
  },
  {
    name: "Einwilligungserklärung Ultraschallbehandlung",
    category: "ultraschall",
    content: {
      sections: [
        {
          title: "Ultraschall Aufklärung",
          fields: [
            { 
              id: "info", 
              type: "info", 
              text: "Hochfrequente Schallwellen zur Stimulation und Wirkstoffeinbringung. Risiken: Rötungen, Wärmegefühl."
            },
            { id: "signature", label: "Digitale Unterschrift des Kunden", type: "signature", required: true }
          ]
        }
      ]
    }
  },
  {
    name: "Einwilligungserklärung Laserbehandlung",
    category: "laser",
    content: {
      sections: [
        {
          title: "Laser Aufklärung",
          fields: [
            { 
              id: "info", 
              type: "info", 
              text: "Umfassende Aufklärung über Laserbehandlung. Risiken: Rötungen, Schwellungen, Pigmentveränderungen, seltene Narbenbildung."
            },
            { id: "not_pregnant", label: "Ich bin nicht schwanger oder stille nicht.", type: "boolean", required: true },
            { id: "no_epilepsy", label: "Ich leide nicht an Epilepsie.", type: "boolean", required: true },
            { id: "no_pacemaker", label: "Ich habe keinen Herzschrittmacher.", type: "boolean", required: true },
            { id: "no_infection", label: "Keine akute Hautinfektion im Behandlungsbereich.", type: "boolean", required: true },
            { id: "no_sun", label: "Keine intensive Sonnenexposition in den letzten 4 Wochen.", type: "boolean", required: true },
            { id: "signature", label: "Digitale Unterschrift", type: "signature", required: true }
          ]
        }
      ]
    }
  }
];

export const DEMO_EQUIPMENT = [
  { name: "Lumenis M22", type: "IPL / Laser", status: "active" },
  { name: "HydraFacial Elite", type: "Gesichtsbehandlung", status: "active" },
  { name: "SkinPen Precision", type: "Microneedling", status: "active" },
  { name: "Zimmer ZWave", type: "Radiofrequenz", status: "maintenance" }
];

export const DEMO_CLIENTS = [
  { first_name: "Anna", last_name: "Schmidt", email: "anna.s@example.com", phone: "+49 170 1234567" },
  { first_name: "Max", last_name: "Mustermann", email: "max.m@example.com", phone: "+49 171 7654321" },
  { first_name: "Julia", last_name: "Weber", email: "j.weber@example.com", phone: "+49 172 9876543" }
];

export const DEMO_PROCEDURES = [
  { name: "Anamnese", category: "anamnese", description: "Allgemeine Gesundheitsabfrage vor der Erstbehandlung", icon: "Clock" },
  { name: "Chemisches Peeling", category: "peeling", description: "Hauterneuerung durch kontrollierte Säureanwendung", icon: "Shield" },
  { name: "IPL-Behandlung", category: "ipl", description: "Lichtbasierte Therapie für Pigmente und Gefäße", icon: "ArrowRight" },
  { name: "Laserbehandlung", category: "laser", description: "Hautverjüngung und Haarentfernung per Laser", icon: "Shield" },
  { name: "Microneedling", category: "microneedling", description: "Kollagenstimulation durch Mikroperforation", icon: "ArrowRight" },
  { name: "Radiofrequenz", category: "rf", description: "Gewebeverfeinerung durch Wärmeenergie", icon: "Clock" }
];
