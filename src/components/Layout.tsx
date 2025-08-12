import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Users2, Hammer, Phone, Facebook, Instagram, Linkedin, Mail, Menu, X, MapPin, Globe, MessageCircle, Moon, Sun, Twitter, Youtube } from 'lucide-react';
import { languageOptions } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      // Manter apenas a lógica de fundo translúcido
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
    
    // Encontrar a direção do idioma
    const selectedLanguage = languageOptions.find(lang => lang.code === lng);
    if (selectedLanguage && selectedLanguage.dir === 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
    }
  };

  // Fechar menu de idiomas ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Por favor, insira um email válido');
      return;
    }
    
    setIsNewsletterSubmitting(true);
    setNewsletterStatus('idle');
    
    try {
      // Criar o corpo da requisição usando URLSearchParams para form-urlencoded
      const formBody = new URLSearchParams();
      formBody.append('email', newsletterEmail);
      
      const response = await fetch('https://amodes.onrender.com/newsletter/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formBody
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message || 'Email cadastrado com sucesso!');
        setNewsletterEmail(''); // Limpa o campo após sucesso
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.detail || 'Erro ao cadastrar email. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na inscrição da newsletter:', error);
      setNewsletterStatus('error');
      setNewsletterMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Idêntico ao da página principal */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white bg-opacity-95 backdrop-blur-md shadow-md dark:bg-slate-900 dark:bg-opacity-95" : "bg-white bg-opacity-80 backdrop-blur-md dark:bg-slate-900 dark:bg-opacity-80"
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Logo" className="h-12" />
              <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400 hidden sm:block">AMODES</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/#inicio" className="text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.inicio')}
              </Link>
              <Link to="/#sobre" className="text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.sobre')}
              </Link>
              <Link to="/#equipe" className="text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.equipe')}
              </Link>
              <Link to="/#projetos" className="text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.atividades')}
              </Link>
              <Link to="/#galeria" className="text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.galeria')}
              </Link>
              <Link to="/#contato" className="text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.contato')}
              </Link>
            </nav>

            {/* Controls: Theme Toggle, Language Selector, Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" aria-label={t('header.modoClaro')} />
                ) : (
                  <Moon className="h-5 w-5" aria-label={t('header.modoEscuro')} />
                )}
              </button>

              {/* Language Selector */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-2 rounded-full text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700 flex items-center"
                  aria-label="Select language"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </button>
                
                {isLanguageMenuOpen && (
                  <div className={`absolute ${document.documentElement.dir === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50`}>
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                            i18n.language === lang.code
                              ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-200'
                              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? null : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-64 bg-cyan-600 dark:bg-cyan-800 shadow-lg"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/#inicio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.inicio')}
                </Link>
                <Link
                  to="/#sobre"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.sobre')}
                </Link>
                <Link
                  to="/#equipe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.equipe')}
                </Link>
                <Link
                  to="/#projetos"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.atividades')}
                </Link>
                <Link
                  to="/#galeria"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.galeria')}
                </Link>
                <Link
                  to="/#contato"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.contato')}
                </Link>
                
                {/* Language Options in Mobile Menu */}
                <div className="pt-4">
                  <h3 className="text-white text-sm mb-2">{t('header.selecionarIdioma')}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {languageOptions.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          changeLanguage(language.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded text-center ${
                          i18n.language === language.code
                            ? 'bg-white text-cyan-600'
                            : 'bg-cyan-700 text-white hover:bg-cyan-500'
                        }`}
                      >
                        <span className="block text-lg mb-1">{language.flag}</span>
                        <span className="text-xs">{language.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - com padding-top para compensar o header fixo */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer - Igual ao da página principal */}
      <footer className="bg-cyan-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Coluna 1 - Logo e Descrição */}
            <div>
              <div className="flex items-center mb-6">
                <Link to="/">
                  <img 
                    src="/images/logo.png" 
                    alt="AMODES" 
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
              <h5 className="text-cyan-300 font-semibold mb-2">Associação Moçambicana para o desenvolvimento sustentável-AMODES</h5>
              <p className="text-cyan-400">Agir para impactar</p>
            </div>

            {/* Coluna 2 - Links Rápidos */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">{t('footer.linksRapidos', 'Links Rápidos')}</h4>
              <ul className="space-y-2">
                <li><Link to="/#inicio" className="text-cyan-400 hover:text-cyan-300 transition-colors">Início</Link></li>
                <li><Link to="/#sobre" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sobre</Link></li>
                <li><Link to="/#equipe" className="text-cyan-400 hover:text-cyan-300 transition-colors">Equipa</Link></li>
                <li><Link to="/#projetos" className="text-cyan-400 hover:text-cyan-300 transition-colors">Actividades</Link></li>
                <li><Link to="/#galeria" className="text-cyan-400 hover:text-cyan-300 transition-colors">Galeria</Link></li>
                <li><Link to="/#contato" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contacto</Link></li>
              </ul>
            </div>
            
            {/* Coluna 3 - Províncias */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">Províncias de Actuação</h4>
              <ul className="space-y-2 text-cyan-400">
                <li>Niassa</li>
                <li>Cabo Delgado</li>
                <li>Tete</li>
                <li>Sofala</li>
                <li>Maputo</li>
              </ul>
            </div>

            {/* Coluna 4 - Contatos */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">{t('footer.contatos', 'Contatos')}</h4>
              <div className="space-y-3">
                <p className="flex items-center space-x-3 text-cyan-400">
                  <Phone className="w-5 h-5" />
                  <span>(12) 3456-7890</span>
                </p>
                <p className="flex items-center space-x-3 text-cyan-400">
                  <MessageCircle className="w-5 h-5" />
                  <span>(12) 9876-5432 (WhatsApp)</span>
                </p>
                <p className="flex items-center space-x-3 text-cyan-400">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="break-all">amodesassociacao@gmail.com</span>
                </p>
                <p className="flex items-center space-x-3 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                  <span>Niassa, Moçambique</span>
                </p>
                <div className="flex space-x-4 pt-4">
                  <a href="https://www.facebook.com/share/1FGanbccKh/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/amodes_moz?igsh=MWdjeWo3MHlocXh1aQ==" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Coluna 5 - Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">{t('contato.newsletter.titulo', 'Newsletter')}</h4>
              <p className="text-cyan-400 mb-4">{t('contato.newsletter.descricao', 'Inscreva-se para receber nossas atualizações')}</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder={t('contato.newsletter.placeholder', 'Seu email')}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-cyan-800 border border-cyan-700 text-white placeholder-cyan-400 focus:outline-none focus:border-cyan-500"
                    disabled={isNewsletterSubmitting}
                  />
                  {isNewsletterSubmitting && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                {newsletterStatus !== 'idle' && (
                  <p className={`text-sm ${newsletterStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {newsletterMessage}
                  </p>
                )}
                
                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
                  disabled={isNewsletterSubmitting}
                >
                  {isNewsletterSubmitting ? t('contato.newsletter.processando', 'Processando...') : t('contato.newsletter.botao', 'Inscrever-se')}
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-cyan-800 mt-12 pt-8 text-center">
            <p className="text-cyan-400">{t('footer.direitos', '© 2023 AMODES. Todos os direitos reservados.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 