import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.reports': 'Reports',
    'nav.map': 'Map',
    'nav.alerts': 'Alerts',
    'nav.analytics': 'Analytics',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'hazard.tsunami': 'Tsunami',
    'hazard.storm': 'Storm',
    'hazard.flood': 'Flood',
    'hazard.pollution': 'Pollution',
    'hazard.wildlife': 'Wildlife',
    'hazard.other': 'Other',
    'severity.low': 'Low',
    'severity.medium': 'Medium',
    'severity.high': 'High',
    'severity.critical': 'Critical',
    'status.pending': 'Pending',
    'status.verified': 'Verified',
    'status.investigating': 'Investigating',
    'status.resolved': 'Resolved',
    'report.title': 'Report Ocean Hazard',
    'report.description': 'Describe the hazard you observed',
    'report.location': 'Location',
    'report.submit': 'Submit Report',
    'map.filters': 'Filters',
    'map.hotspots': 'Hotspots',
    'dashboard.live_reports': 'Live Reports',
    'dashboard.social_media': 'Social Media',
    'dashboard.ai_analysis': 'AI Analysis'
  },
  hi: {
    'nav.dashboard': 'डैशबोर्ड',
    'nav.reports': 'रिपोर्ट',
    'nav.map': 'मानचित्र',
    'nav.alerts': 'चेतावनी',
    'nav.analytics': 'विश्लेषण',
    'nav.profile': 'प्रोफाइल',
    'nav.logout': 'लॉग आउट',
    'hazard.tsunami': 'सुनामी',
    'hazard.storm': 'तूफान',
    'hazard.flood': 'बाढ़',
    'hazard.pollution': 'प्रदूषण',
    'hazard.wildlife': 'वन्यजीव',
    'hazard.other': 'अन्य',
    'report.title': 'समुद्री खतरे की रिपोर्ट करें',
    'report.description': 'आपके द्वारा देखे गए खतरे का वर्णन करें',
    'report.location': 'स्थान',
    'report.submit': 'रिपोर्ट जमा करें'
  },
  ta: {
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.reports': 'அறிக்கைகள்',
    'nav.map': 'வரைபடம்',
    'nav.alerts': 'எச்சரிக்கைகள்',
    'hazard.tsunami': 'சுனாமி',
    'hazard.storm': 'புயல்',
    'hazard.flood': 'வெள்ளம்',
    'hazard.pollution': 'மாசு',
    'report.title': 'கடல் அபாயத்தை புகாரளிக்க'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}