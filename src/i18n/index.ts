import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Importando traduções
import translationPT from './locales/pt/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationFR from './locales/fr/translation.json';
import translationAR from './locales/ar/translation.json';
import translationZH from './locales/zh/translation.json';
import translationRU from './locales/ru/translation.json';

// Recursos de idioma
const resources = {
  pt: {
    translation: translationPT
  },
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  fr: {
    translation: translationFR
  },
  ar: {
    translation: translationAR
  },
  zh: {
    translation: translationZH
  },
  ru: {
    translation: translationRU
  }
};

// Lista de idiomas disponíveis para seleção
export const languageOptions = [
  { code: 'pt', name: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' }
];

i18n
  // Carrega traduções usando http backend
  .use(Backend)
  // Detectar idioma do navegador
  .use(LanguageDetector)
  // Passando i18n para react-i18next
  .use(initReactI18next)
  // Inicialização do i18next
  .init({
    resources, // Recursos pré-carregados
    fallbackLng: 'pt', // Idioma padrão (português)
    debug: true, // Habilitar logs de debug para verificar problemas
    
    interpolation: {
      escapeValue: false, // Não é necessário para React
    },
    
    // Configuração do backend para carregar traduções
    backend: {
      // Caminho para carregar traduções
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Opções de detecção de idioma
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n; 