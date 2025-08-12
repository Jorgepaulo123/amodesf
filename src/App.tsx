import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Building2, Users2, Hammer, Phone, ChevronRight, Facebook, Instagram, Linkedin as LinkedIn, Mail, Send, Menu, X, MapPin, Wrench, Sun, Droplet, Zap, Waves, Settings, MessageCircle, Moon, Twitter, Youtube, BookOpen, Heart, DollarSign, Scale, Music, Leaf, Globe } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Region, Publicacao } from './types';
import { mozambiqueRegions } from './data';
import { useTranslation } from 'react-i18next';
import { languageOptions } from './i18n';
import DonationButton from './components/DonationButton';
import VolunteerButton from './components/VolunteerButton';
import ImageCarousel from './components/ImageCarousel';

// Adicionar as interfaces de volta
// Adicionando interface para dados da galeria
interface GaleriaItem {
  url: string;
  titulo_publicacao: string;
  categoria: string;
  data: string;
  publicacao_id: number;
}

interface GaleriaResponse {
  total: number;
  items: GaleriaItem[];
}

// Adicionando interface para membros da equipe
interface Membro {
  id: number;
  nome: string;
  cargo: string;
  descricao: string | null;
  username: string | null;
  senha: string;
  foto_perfil: string;
  created_at: string;
  updated_at: string;
}

// Adicionando interface para categorias
interface Categoria {
  nome: string;
  id: number;
  created_at: string;
  updated_at: string;
}

// CSS para esconder a scrollbar horizontal mas manter a funcionalidade
const noScrollbarStyles = `
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}`;

// CSS para animações de deslizamento - estilo carrossel
const slideAnimationStyles = `
.category-carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.category-carousel .carousel-container {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-page {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  width: 100%;
}

.carousel-button {
  background-color: #06b6d4;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.carousel-button:hover {
  transform: translateY(-50%) scale(1.1);
}

.carousel-button:active {
  transform: translateY(-50%) scale(0.95);
}

.carousel-button.prev {
  left: 0;
}

.carousel-button.next {
  right: 0;
}

.carousel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.category-button {
  padding: 8px 16px;
  border-radius: 9999px;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.category-button.active {
  background-color: #06b6d4;
  color: white;
}

.category-button:not(.active) {
  background-color: #f3f4f6;
  color: #4b5563;
}

.category-button:not(.active):hover {
  background-color: #e5e7eb;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}`;

const heroSlides = [
  {
    image: "https://www.engenhariacompartilhada.com.br//Imagens/Conteudo/CONSTRUCAO-CIVIL.jpg",
    title: "Construindo o Futuro de Moçambique",
    subtitle: "Excelência em Construção e Engenharia"
  },
  {
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Inovação em Cada Projeto",
    subtitle: "Transformando Visões em Realidade"
  },
  {
    image: "https://criteriaenergia.com.br/wp-content/uploads/2023/12/painel-solar_criacao-e-historia-752x440-1.jpg",
    title: "Compromisso com a Qualidade",
    subtitle: "Construindo com Excelência"
  }
];

const projects = [
  {
    title: "Obras de Emergência em Sofala",
    location: "Província de Sofala",
    description: "Contratação de Empreitada para Obras de Emergência na Província de Sofala, incluindo intervenções críticas e melhorias na infraestrutura local.",
    image: "https://noticias.mmo.co.mz/wp-content/uploads/2023/08/Obras-de-emergencia-no-troco-Save-Muxungue-Inchope.jpg"
  },
  {
    title: "Manutenção de Estradas na Zambézia",
    location: "Maganja da Costa, Zambézia",
    description: "Manutenção de rotina de 198,67 km da estrada e reparação de um acampamento base, garantindo a qualidade e segurança do tráfego.",
    image: "https://www.rm.co.mz/wp-content/uploads/2022/01/3433f4e2f36f2510e3f91cf9fb61b7d9.jpg"
  },
  {
    title: "Reabilitação OMS Maputo",
    location: "Maputo",
    description: "Reabilitação dos escritórios da Organização Mundial de Saúde em Maputo, incluindo modernização das instalações e melhorias estruturais.",
    image: "https://www.afro.who.int/sites/default/files/2022-02/Dr%20Crescencio%20da%20OMS%20e%20Sra%20Riva%20Mendonca%20%20na%20parte%20do%20centro%20de%20saude%20%20de%20%20Topuito%20destruido%20pelo%20ciclone%20ANA%20na%20Provincia%20de%20Nampula%20.jpg"
  },
  {
    title: "Praças de Portagem",
    location: "Província de Maputo",
    description: "Obras de construção de praças de portagem e centros de manutenção na cidade de província de Maputo, melhorando a infraestrutura viária.",
    image: "https://www.revimo.co.mz/assets/img/portagens/portagens5.jpg"
  },
  {
    title: "Intervenção Urbana em Quelimane",
    location: "Quelimane, Zambézia",
    description: "Obras de Manutenção da rotunda e praça da independência, incluindo a av. Eduardo Mondlane e av. Dos Heróis da libertação nacional.",
    image: "https://verdade.co.mz/wp-content/uploads/elementor/thumbs/quelimane-aerea-pctgynvni6bbj0je0tubwi8uk4dz5yv26sty1jmnpk.jpg"
  },
  {
    title: "Ponte Rio Raraga",
    location: "Maganja da Costa, Zambézia",
    description: "Obras de Manutenção da ponte sobre o rio raraga, garantindo a segurança e durabilidade da estrutura.",
    image: "https://www.rm.co.mz/wp-content/uploads/2023/03/estrada-EN-13.jpg"
  },
  {
    title: "Reabilitação INCM",
    location: "Maputo",
    description: "Reabilitação e Remodelação das Antigas Instalações do INCM, modernizando o espaço e melhorando sua funcionalidade.",
    image: "https://aimnews.org/wp-content/uploads/2023/09/INCMa.jpg"
  },
  {
    title: "Edifício MAAF Quelimane",
    location: "Quelimane, Zambézia",
    description: "Obra de Construção do Edifício Comercial do Director da MAAF, incluindo instalações modernas e funcionais.",
    image: "https://www.zambezia.gov.mz/var/ezdemo_site/storage/images/galeria/fotos/edificios-do-governo-da-zambezia/governo-da-zambezia/39510-1-por-MZ/Governo-da-Zambezia_galleryfull.jpg"
  }
];

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -18.665695,
  lng: 35.529562
};

// Componente de animação de pulso reutilizável
const PulseLoader = ({ color = "bg-cyan-500" }: { color?: string }) => (
  <div className="flex items-center justify-center space-x-1 py-2">
    <div className={`pulse-dot pulse-dot-1 ${color}`}></div>
    <div className={`pulse-dot pulse-dot-2 ${color}`}></div>
    <div className={`pulse-dot pulse-dot-3 ${color}`}></div>
  </div>
);

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-cyan-50 to-cyan-100 dark:from-cyan-900 dark:to-cyan-800"
  >
    <div className="relative">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [0.5, 1.2, 1],
          opacity: [0, 1, 1]
        }}
        transition={{ 
          duration: 1.8,
          times: [0, 0.6, 1],
          ease: "easeOut"
        }}
        className="flex flex-col items-center"
      >
        <img 
          src="/images/logo.png" 
          alt="AMODES" 
          className="h-32 w-auto mb-4"
        />
        
        {/* Animação de Pulso usando o componente PulseLoader */}
        <PulseLoader />
      </motion.div>
    </div>
  </motion.div>
);

// Adicionar a declaração do array areasAtuacao dentro do componente App, logo após as definições de estado

// Interface para o formulário de doações
interface DonationFormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

function App() {
  const { t, i18n } = useTranslation();
  const [currentProject, setCurrentProject] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Region | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [isLoadingPublicacoes, setIsLoadingPublicacoes] = useState(true);
  const [selectedPublicacao, setSelectedPublicacao] = useState<Publicacao | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState(4);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [heroImages, setHeroImages] = useState<GaleriaItem[]>([]);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isLoadingHeroImages, setIsLoadingHeroImages] = useState(true);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [isLoadingMembros, setIsLoadingMembros] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todos");
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const categoriesPerPage = 4; // Número de categorias visíveis por vez
  const [galeriaItems, setGaleriaItems] = useState<GaleriaItem[]>([]);
  const [isLoadingGaleria, setIsLoadingGaleria] = useState(true);
  const [visibleGaleriaItems, setVisibleGaleriaItems] = useState(4); // Número inicial de itens visíveis
  const [hasMoreGaleriaItems, setHasMoreGaleriaItems] = useState(false); // Indica se há mais imagens para mostrar
  const [isLoadingMoreGaleria, setIsLoadingMoreGaleria] = useState(false); // Estado de carregamento para "Ver mais"
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [donationFormData, setDonationFormData] = useState<DonationFormData>({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  const [isDonationSubmitting, setIsDonationSubmitting] = useState(false);
  const [donationSubmitted, setDonationSubmitted] = useState(false);
  const [showDonationConfirmation, setShowDonationConfirmation] = useState(false);
  const [donationError, setDonationError] = useState('');
  
  // Adicionar estados para o formulário de contato
  const [contactFormData, setContactFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactMessage, setContactMessage] = useState('');
  
  // Comentários removidos para evitar referências a variáveis não definidas
  
  // Definir as áreas de atuação com acesso à função t (7 áreas com objectivos)
  const areasAtuacao = [
    {
      title: t('areasAtuacao.areas.pazDemocracia.titulo', 'Paz, Democracia e Boa Governação'),
      icon: <Globe className="w-12 h-12 text-cyan-500" />,
      objective: t('areasAtuacao.areas.pazDemocracia.objetivo', 'Promover a cultura da paz, a participação cívica da juventude e o fortalecimento das instituições democráticas.'),
      items: t('areasAtuacao.areas.pazDemocracia.itens', { returnObjects: true }) as string[]
    },
    {
      title: t('areasAtuacao.areas.saudeGenero.titulo', 'Saúde, Direitos e Justiça de Género'),
      icon: <Heart className="w-12 h-12 text-cyan-500" />,
      objective: t('areasAtuacao.areas.saudeGenero.objetivo', 'Defender os direitos humanos com enfoque especial na saúde sexual e reprodutiva, igualdade de género e justiça social.'),
      items: t('areasAtuacao.areas.saudeGenero.itens', { returnObjects: true }) as string[]
    },
    {
      title: t('areasAtuacao.areas.meioAmbiente.titulo', 'Meio ambiente (Mudanças Climáticas)'),
      icon: <Leaf className="w-12 h-12 text-cyan-500" />,
      objective: t('areasAtuacao.areas.meioAmbiente.objetivo', 'Promover ações resilientes às mudanças climáticas com inclusão de comunidades rurais e jovens no desenvolvimento sustentável.'),
      items: t('areasAtuacao.areas.meioAmbiente.itens', { returnObjects: true }) as string[]
    },
    {
      title: t('areasAtuacao.areas.educacaoCiencia.titulo', 'Educação, Ciência e Inovação'),
      icon: <BookOpen className="w-12 h-12 text-cyan-500" />,
      objective: t('areasAtuacao.areas.educacaoCiencia.objetivo', 'Garantir acesso equitativo à educação de qualidade, com foco em ciência, tecnologia e inovação como ferramentas de transformação social.'),
      items: t('areasAtuacao.areas.educacaoCiencia.itens', { returnObjects: true }) as string[]
    },
    {
      title: t('areasAtuacao.areas.juventudeEmpreendedorismo.titulo', 'Juventude, Empreendedorismo e Habilitação para a Vida'),
      icon: <Users2 className="w-12 h-12 text-cyan-500" />,
      objective: t('areasAtuacao.areas.juventudeEmpreendedorismo.objetivo', 'Fortalecer capacidades empreendedoras da juventude, promovendo inclusão económica e habilidades para a vida.'),
      items: t('areasAtuacao.areas.juventudeEmpreendedorismo.itens', { returnObjects: true }) as string[]
    },
    {
      title: t('areasAtuacao.areas.direitosJustica.titulo', 'Direitos Humanos e Justiça Social'),
      icon: <Scale className="w-12 h-12 text-cyan-500" />,
      objective: t('areasAtuacao.areas.direitosJustica.objetivo', 'Defender os direitos fundamentais, promover equidade, justiça social e combate à discriminação em todas as formas.'),
      items: t('areasAtuacao.areas.direitosJustica.itens', { returnObjects: true }) as string[]
    },
    {
      title: t('areasAtuacao.areas.engajamentoLideranca.titulo', 'Engajamento Comunitário e Liderança Inclusiva'),
      icon: <Users2 className="w-12 h-12 text-cyan-500" />,
      objective: t('areasAtuacao.areas.engajamentoLideranca.objetivo', 'Estimular o envolvimento ativo das comunidades, com enfoque na liderança jovem e inclusão de todos os grupos sociais.'),
      items: t('areasAtuacao.areas.engajamentoLideranca.itens', { returnObjects: true }) as string[]
    }
  ];

  // Calcular o total de páginas de categorias
  const totalCategoryPages = useMemo(() => {
    if (categorias.length === 0) return 0;
    return Math.ceil((categorias.length + 1) / categoriesPerPage); // +1 para o botão "Todos"
  }, [categorias.length]);

  // Navegar entre páginas de categorias com animação
  const navigateCategories = (direction: 'prev' | 'next') => {
    if (isSliding) return; // Evitar múltiplos cliques durante a animação
    
    setIsSliding(true);
    // Ao clicar em 'next' (>) queremos que as categorias saiam para a esquerda
    // Ao clicar em 'prev' (<) queremos que as categorias saiam para a direita
    setSlideDirection(direction === 'next' ? 'left' : 'right');
    
    // Aguardar um pouco para a animação iniciar antes de mudar a página
    setTimeout(() => {
      if (direction === 'prev' && currentCategoryPage > 0) {
        setCurrentCategoryPage(currentCategoryPage - 1);
      } else if (direction === 'next' && currentCategoryPage < totalCategoryPages - 1) {
        setCurrentCategoryPage(currentCategoryPage + 1);
      }
      
      // Finalizar a animação após a mudança de página
      setTimeout(() => {
        setIsSliding(false);
        setSlideDirection(null);
      }, 300); // Duração da animação de saída
    }, 150); // Tempo para iniciar a mudança após início da animação
  };

  // Função para verificar e atualizar a visibilidade das setas
  const checkScrollArrows = useCallback(() => {
    if (!categoriesRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
    setShowLeftArrow(scrollLeft > 10); // 10px de tolerância
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px de tolerância no final
  }, []);

  // Função para rolar para a esquerda/direita
  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoriesRef.current) return;
    
    const scrollAmount = 250; // pixels a rolar
    const newScrollLeft = direction === 'left' 
      ? categoriesRef.current.scrollLeft - scrollAmount
      : categoriesRef.current.scrollLeft + scrollAmount;
    
    categoriesRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Adicionar listener para verificar as setas quando a lista é rolada
  useEffect(() => {
    const ref = categoriesRef.current;
    if (ref) {
      checkScrollArrows();
      ref.addEventListener('scroll', checkScrollArrows);
      window.addEventListener('resize', checkScrollArrows);
      
      return () => {
        ref.removeEventListener('scroll', checkScrollArrows);
        window.removeEventListener('resize', checkScrollArrows);
      };
    }
  }, [checkScrollArrows]);

  // Verificar setas quando as categorias são carregadas
  useEffect(() => {
    if (!isLoadingCategorias) {
      // Verificar após um atraso para garantir que o DOM foi atualizado
      setTimeout(checkScrollArrows, 100);
    }
  }, [isLoadingCategorias, categorias, checkScrollArrows]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length);
    }, 8000); // Alterado de 6000 para 8000ms (8 segundos)
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000); // Aumentado para 3 segundos para mostrar a animação completa
  }, []);

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

  useEffect(() => {
    const fetchHeroImages = async () => {
      setIsLoadingHeroImages(true);
      try {
        console.log('Buscando imagens para o hero...');
        const response = await fetch('https://amodes.onrender.com/galeria/random/?limite=4', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar imagens: ${response.status}`);
        }
        
        const data: GaleriaResponse = await response.json();
        console.log('Imagens para hero carregadas:', data);
        
        if (data.items && data.items.length > 0) {
          setHeroImages(data.items);
        } else {
          // Fallback para imagens padrão se a API não retornar nada
          setHeroImages([
            {
              url: "https://storage.googleapis.com/amodes-344f3.firebasestorage.app/publicacoes/1749635227_5b6dbf8f.jpeg",
              titulo_publicacao: "Trabalho em Equipe",
              categoria: "institucional",
              data: new Date().toISOString(),
              publicacao_id: 1
            },
            {
              url: "https://storage.googleapis.com/amodes-344f3.firebasestorage.app/publicacoes/1749635227_5b6dbf8f.jpeg",
              titulo_publicacao: "Reunião Estratégica",
              categoria: "reuniao",
              data: new Date().toISOString(),
              publicacao_id: 2
            }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar imagens para o hero:', error);
        // Definir imagens de fallback em caso de erro
        setHeroImages([
          {
            url: "https://storage.googleapis.com/amodes-344f3.firebasestorage.app/publicacoes/1749635227_5b6dbf8f.jpeg",
            titulo_publicacao: "Trabalho em Equipe",
            categoria: "institucional",
            data: new Date().toISOString(),
            publicacao_id: 1
          },
          {
            url: "https://storage.googleapis.com/amodes-344f3.firebasestorage.app/publicacoes/1749635227_5b6dbf8f.jpeg",
            titulo_publicacao: "Reunião Estratégica",
            categoria: "reuniao",
            data: new Date().toISOString(),
            publicacao_id: 2
          }
        ]);
      } finally {
        setIsLoadingHeroImages(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Alternar imagem do hero a cada 5 segundos
  useEffect(() => {
    if (heroImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Criar URLSearchParams para enviar dados como form-urlencoded
      const formBody = new URLSearchParams();
      formBody.append('nome', formData.name);
      formBody.append('email', formData.email);
      formBody.append('mensagem', formData.message);

      const response = await fetch('https://amodes.onrender.com/enviar-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });

      if (response.ok) {
        // Limpar o formulário após envio bem-sucedido
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setIsFormSubmitted(true); // Set form submitted state to true
      } else {
        throw new Error('Falha ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para inscrever usuário na newsletter
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

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    setIsChatLoading(true);
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA7JmeO-KmIL2tUmlhI4UXaFr1sUlihY30',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `Você é um assistente da ENGEPOWER, uma empresa de engenharia e construção em Moçambique. 
              Responda a seguinte pergunta de forma profissional: ${userMessage}` }]
            }]
          })
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.' 
      }]);
    }
    setIsChatLoading(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Função para formatar datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Função para abrir modal de publicação
  const handleOpenModal = (publicacao: Publicacao) => {
    setSelectedPublicacao(publicacao);
    setIsModalOpen(true);
  };

  // Spinner component
  const Spinner = ({ className }: { className: string }) => (
    <div className={`animate-spin rounded-full border-b-2 border-current ${className}`}></div>
  );

  // Função para buscar publicações
  useEffect(() => {
    const fetchPublicacoes = async () => {
      setIsLoadingPublicacoes(true);
      try {
        console.log('Iniciando busca de publicações...');
        const response = await fetch('https://amodes.onrender.com/publicacoes/?skip=0&limit=5', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors' // Adicionar mode: 'cors' para resolver problemas de CORS
        });

        console.log('Resposta da API:', response.status);
        if (!response.ok) {
          throw new Error(`Falha ao carregar publicações: ${response.status}`);
        }
        
        const data: Publicacao[] = await response.json();
        console.log('Publicações carregadas:', data);
        setPublicacoes(data);
        setHasMore(data.length >= 5); // Se recebemos pelo menos 5 items, provavelmente há mais
      } catch (error) {
        console.error('Erro ao carregar publicações:', error);
        // Dados de fallback para teste
        setPublicacoes([
          {
            id: 1,
            titulo: "Exemplo de Actividade 1",
            conteudo: "Esta é uma actividade de exemplo enquanto não conseguimos conectar à API.",
            fotos: ["https://storage.googleapis.com/amodes18.firebasestorage.app/publicacoes/1746107498_388809cd.jpg"],
            autor_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categoria: "exemplo"
          },
          {
            id: 2,
            titulo: "Exemplo de Actividade 2",
            conteudo: "Esta é uma segunda actividade de exemplo para demonstrar a paginação.",
            fotos: ["https://storage.googleapis.com/amodes18.firebasestorage.app/publicacoes/1746107498_388809cd.jpg"],
            autor_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categoria: "exemplo"
          },
          {
            id: 3,
            titulo: "Exemplo de Actividade 3",
            conteudo: "Esta é uma terceira actividade de exemplo para demonstrar a paginação.",
            fotos: ["https://storage.googleapis.com/amodes18.firebasestorage.app/publicacoes/1746107498_388809cd.jpg"],
            autor_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categoria: "exemplo"
          },
          {
            id: 4,
            titulo: "Exemplo de Actividade 4",
            conteudo: "Esta é uma quarta actividade de exemplo para demonstrar a paginação.",
            fotos: ["https://storage.googleapis.com/amodes18.firebasestorage.app/publicacoes/1746107498_388809cd.jpg"],
            autor_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categoria: "exemplo"
          },
          {
            id: 5,
            titulo: "Exemplo de Actividade 5",
            conteudo: "Esta é uma quinta actividade de exemplo para demonstrar a paginação.",
            fotos: ["https://storage.googleapis.com/amodes18.firebasestorage.app/publicacoes/1746107498_388809cd.jpg"],
            autor_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categoria: "exemplo"
          }
        ]);
        setHasMore(true); // Para demonstrar o botão "Ver Mais" nos dados de teste
      } finally {
        setIsLoadingPublicacoes(false);
      }
    };

    fetchPublicacoes();
  }, []);

  // Função para carregar mais publicações
  const loadMore = async () => {
    setIsLoadingMore(true);
    try {
      const response = await fetch(`https://amodes.onrender.com/publicacoes/?skip=${publicacoes.length}&limit=4`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Falha ao carregar mais publicações: ${response.status}`);
      }

      const newData: Publicacao[] = await response.json();
      console.log('Novas publicações carregadas:', newData);
      setPublicacoes(prev => [...prev, ...newData]);
      setVisibleItems(prev => prev + 4);
      setHasMore(newData.length >= 4); // Se recebemos menos que 4, não há mais items
    } catch (error) {
      console.error('Erro ao carregar mais publicações:', error);
      // Em caso de erro, simplesmente aumentar os itens visíveis para os dados de fallback
      setVisibleItems(prev => Math.min(prev + 4, publicacoes.length));
      setHasMore(visibleItems + 4 < publicacoes.length);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Efeito para carregar membros da equipe
  useEffect(() => {
    const fetchMembros = async () => {
      setIsLoadingMembros(true);
      try {
        console.log('Buscando membros da equipe...');
        const response = await fetch('https://amodes.onrender.com/membros/?skip=0&limit=100', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar membros: ${response.status}`);
        }
        
        const data: Membro[] = await response.json();
        console.log('Membros da equipe carregados:', data);
        
        if (data && data.length > 0) {
          setMembros(data);
        } else {
          // Fallback para membros fictícios se a API não retornar dados
          setMembros([
            {
              id: 1,
              nome: "Ana Silva",
              cargo: "Directora Executiva",
              descricao: "Mais de 3 anos de experiência em gestão de projectos sociais e desenvolvimento comunitário.",
              username: null,
              senha: "",
              foto_perfil: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 2,
              nome: "Carlos Mendes",
              cargo: "Coordenador de Projectos",
              descricao: "Especialista em implementação e monitoramento de projectos de desenvolvimento social.",
              username: null,
              senha: "",
              foto_perfil: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 3,
              nome: "Maria Fernanda",
              cargo: "Assistente Social",
              descricao: "Graduada em Serviço Social com experiência em atendimento a comunidades vulneráveis.",
              username: null,
              senha: "",
              foto_perfil: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar membros da equipe:', error);
        // Usar dados fictícios em caso de erro
        setMembros([
          {
            id: 1,
            nome: "Ana Silva",
            cargo: "Directora Executiva",
            descricao: "Mais de 3 anos de experiência em gestão de projectos sociais e desenvolvimento comunitário.",
            username: null,
            senha: "",
            foto_perfil: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            nome: "Carlos Mendes",
            cargo: "Coordenador de Projectos",
            descricao: "Especialista em implementação e monitoramento de projectos de desenvolvimento social.",
            username: null,
            senha: "",
            foto_perfil: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      } finally {
        setIsLoadingMembros(false);
      }
    };

    fetchMembros();
  }, []);

  // Efeito para carregar categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      setIsLoadingCategorias(true);
      try {
        console.log('Buscando categorias...');
        const response = await fetch('https://amodes.onrender.com/categorias/?skip=0&limit=100', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar categorias: ${response.status}`);
        }
        
        const data: Categoria[] = await response.json();
        console.log('Categorias carregadas:', data);
        
        if (data && data.length > 0) {
          setCategorias(data);
        } else {
          // Fallback para categorias fictícias se a API não retornar dados
          setCategorias([
            { id: 1, nome: "Eventos", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 2, nome: "Projectos", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 3, nome: "Workshops", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 4, nome: "Equipa", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Usar categorias fictícias em caso de erro
        setCategorias([
          { id: 1, nome: "Eventos", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, nome: "Projectos", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 3, nome: "Workshops", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 4, nome: "Equipa", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ]);
      } finally {
        setIsLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  // Efeito para buscar imagens da galeria com base na categoria selecionada
  useEffect(() => {
    const fetchGaleriaItems = async () => {
      setIsLoadingGaleria(true);
      setVisibleGaleriaItems(4); // Resetar para 4 itens visíveis ao mudar de categoria
      
      try {
        console.log(`Buscando imagens da galeria para categoria: ${categoriaAtiva === "Todos" ? "todas" : categoriaAtiva}`);
        
        // Construir URL com ou sem o parâmetro de categoria
        const url = categoriaAtiva === "Todos" 
          ? 'https://amodes.onrender.com/galeria/?skip=0&limit=100' 
          : `https://amodes.onrender.com/galeria/?categoria=${encodeURIComponent(categoriaAtiva)}&skip=0&limit=100`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar imagens da galeria: ${response.status}`);
        }
        
        const data: GaleriaResponse = await response.json();
        console.log('Imagens da galeria carregadas:', data);
        
        if (data.items && data.items.length > 0) {
          setGaleriaItems(data.items);
          // Verificar se há mais itens além dos visíveis inicialmente
          setHasMoreGaleriaItems(data.items.length > 4);
        } else {
          // Fallback para imagens padrão se a API não retornar nada
          setGaleriaItems([]);
          setHasMoreGaleriaItems(false);
        }
      } catch (error) {
        console.error('Erro ao carregar imagens da galeria:', error);
        // Fallback para imagens padrão em caso de erro
        setGaleriaItems([]);
        setHasMoreGaleriaItems(false);
      } finally {
        setIsLoadingGaleria(false);
      }
    };

    fetchGaleriaItems();
  }, [categoriaAtiva]); // Recarregar sempre que a categoria ativa mudar

  // Função para carregar mais imagens da galeria
  const loadMoreGaleriaItems = () => {
    setIsLoadingMoreGaleria(true);
    
    // Simular um tempo de carregamento para melhor feedback visual
    setTimeout(() => {
      // Mostrar mais 4 itens ou todos os restantes, o que for menor
      const newVisibleItems = Math.min(visibleGaleriaItems + 4, galeriaItems.length);
      setVisibleGaleriaItems(newVisibleItems);
      // Verifica se ainda há mais itens para mostrar
      setHasMoreGaleriaItems(newVisibleItems < galeriaItems.length);
      setIsLoadingMoreGaleria(false);
    }, 800);
  };

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

  // Handle donation form input changes
  const handleDonationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle donation form submission
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Show confirmation modal before submitting
    setShowDonationConfirmation(true);
  };

  // Confirm and submit donation
  const confirmDonation = async () => {
    setIsDonationSubmitting(true);
    setDonationError('');
    
    try {
      const response = await fetch('https://amodes.onrender.com/doacoes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationFormData),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar a doação. Por favor, tente novamente.');
      }
      
      setDonationSubmitted(true);
      setDonationFormData({
        nome: '',
        email: '',
        telefone: '',
        mensagem: ''
      });
    } catch (error) {
      setDonationError(error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua doação.');
    } finally {
      setIsDonationSubmitting(false);
      setShowDonationConfirmation(false);
    }
  };

  // Cancel donation confirmation
  const cancelDonation = () => {
    setShowDonationConfirmation(false);
  };

  // Adicionar função de manipulação do formulário de contato
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Adicionar função de envio do formulário de contato
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);
    setContactStatus('idle');
    
    try {
      const response = await fetch('https://amodes.onrender.com/enviar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contactFormData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setContactStatus('success');
        setContactMessage(data.message || 'Mensagem enviada com sucesso!');
        setContactFormData({
          nome: '',
          email: '',
          assunto: '',
          mensagem: ''
        });
      } else {
        setContactStatus('error');
        setContactMessage(data.detail || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setContactStatus('error');
      setContactMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsContactSubmitting(false);
    }
  };
  
  // Render da seção de Galeria com categorias expansíveis
  return (
    <>
      <AnimatePresence>
        {isInitialLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Header */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white bg-opacity-95 backdrop-blur-md shadow-md dark:bg-slate-900 dark:bg-opacity-95" : "bg-white bg-opacity-80 backdrop-blur-md dark:bg-slate-900 dark:bg-opacity-80"
      }`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Logo" className="h-10" />
              <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400 hidden sm:block">AMODES</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-5">
              <a href="#inicio" className="text-sm text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.inicio')}
              </a>
              <a href="#sobre" className="text-sm text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.sobre')}
              </a>
              <a href="#equipe" className="text-sm text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.equipe')}
              </a>
              <a href="#atividades" className="text-sm text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.atividades')}
              </a>
              <a href="#galeria" className="text-sm text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.galeria')}
              </a>
              <a href="#contato" className="text-sm text-slate-700 hover:text-cyan-500 dark:text-slate-200 dark:hover:text-cyan-300 transition">
                {t('header.contato')}
              </a>
            </nav>

            {/* Controls: Theme Toggle, Language Selector, Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-full text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" aria-label={t('header.modoClaro')} />
                ) : (
                  <Moon className="h-4 w-4" aria-label={t('header.modoEscuro')} />
                )}
              </button>

              {/* Language Selector */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-1.5 rounded-full text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700 flex items-center"
                  aria-label="Select language"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </button>
                
                {isLanguageMenuOpen && (
                  <div className={`absolute ${document.documentElement.dir === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50`}>
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`flex items-center w-full text-left px-3 py-2 text-xs ${
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
                className="md:hidden p-1.5 rounded-full text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? null : <Menu className="h-4 w-4" />}
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
                <a
                  href="#inicio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.inicio')}
                </a>
                <a
                  href="#sobre"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.sobre')}
                </a>
                <a
                  href="#equipe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.equipe')}
                </a>
                <a
                  href="#actividades"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.atividades')}
                </a>
                <a
                  href="#galeria"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.galeria')}
                </a>
                <a
                  href="#contato"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-cyan-200 py-2 border-b border-cyan-500 dark:border-cyan-700"
                >
                  {t('header.contato')}
                </a>
                
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

      {/* Hero Section */}
      <section id="inicio" className="pt-0">
        <div className="relative min-h-[70vh]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            {heroImages.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentHeroImage}
                  src={heroImages[currentHeroImage].url} 
                  alt="AMODES" 
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              </AnimatePresence>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2BBCD4]/90 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '70vh' }}>
            <div className="max-w-3xl" data-aos="fade-right">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
                Associação Moçambicana de Desenvolvimento Sustentável
              </h1>
              <p className="text-lg md:text-xl text-white mb-6 max-w-2xl">
                Agir para Impactar
              </p>
              <a 
                href="#sobre"
                className="inline-block bg-white text-cyan-500 px-6 py-3 rounded-lg text-base font-medium hover:bg-cyan-50 transition-all transform hover:scale-105 shadow-lg"
              >
                {t('hero.botao')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 px-6 bg-cyan-100 dark:bg-cyan-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-cyan-900 dark:text-white">
                {t('servicos.titulo')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-cyan-500 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-cyan-900 dark:text-white">
                      {t('servicos.impactoSocial.titulo')}
                    </h3>
                    <p className="text-cyan-700 dark:text-cyan-200">
                      {t('servicos.impactoSocial.descricao')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-cyan-500 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-cyan-900 dark:text-white">
                      {t('servicos.educacao.titulo')}
                    </h3>
                    <p className="text-cyan-700 dark:text-cyan-200">
                      {t('servicos.educacao.descricao')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-cyan-500 p-3 rounded-lg">
                    <Users2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-cyan-900 dark:text-white">
                      {t('servicos.desenvolvimento.titulo')}
                    </h3>
                    <p className="text-cyan-700 dark:text-cyan-200">
                      {t('servicos.desenvolvimento.descricao')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://storage.googleapis.com/amodes-344f3.firebasestorage.app/publicacoes/1749635227_5b6dbf8f.jpeg"
                alt="Impacto na Comunidade"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-cyan-500 text-white p-6 rounded-lg shadow-xl">
                <p className="text-2xl font-bold">+1000</p>
                <p className="text-sm">Vidas Impactadas</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-cyan-700 rounded-lg shadow-lg p-8 text-center"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-900 dark:text-white">{t('servicos.botaoDoe')}</h3>
              <p className="text-cyan-700 dark:text-cyan-200 mb-6">
                Sua doação ajuda a manter os nossos projectos e impactar mais vidas.
              </p>
              <DonationButton />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-cyan-700 rounded-lg shadow-lg p-8 text-center"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-900 dark:text-white">{t('servicos.botaoVoluntario')}</h3>
              <p className="text-cyan-700 dark:text-cyan-200 mb-6">
                Junte-se a nós e faça parte desta transformação social.
              </p>
              <VolunteerButton />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-cyan-700 rounded-lg shadow-lg p-8 text-center"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-900 dark:text-white">{t('servicos.botaoSaibaMais')}</h3>
              <p className="text-cyan-700 dark:text-cyan-200 mb-6">
                Conheça mais sobre os nossos projectos e como podemos trabalhar juntos.
              </p>
              <button className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all">
                {t('servicos.botaoSaibaMais')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação Section */}
      <section id="areas-atuacao" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('areasAtuacao.titulo')}</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('areasAtuacao.descricao')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areasAtuacao.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    {area.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{area.title}</h3>
                  {area.objective && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{area.objective}</p>
                  )}
                  <ul className="space-y-3">
                    {area.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-gray-600 dark:text-gray-300">
                        <ChevronRight className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('projetos.titulo')}</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('projetos.descricao')}
            </p>
          </div>

          {isLoadingPublicacoes ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="w-12 h-12 text-cyan-500" />
            </div>
          ) : publicacoes.length > 0 ? (
            <>
              <div className="space-y-16">
                {publicacoes.slice(0, visibleItems).map((publicacao, index) => (
                  <div 
                    key={publicacao.id || index}
                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
                    data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                  >
                    <div className="lg:w-1/2">
                      {publicacao.fotos && publicacao.fotos.length > 0 ? (
                        <ImageCarousel 
                          images={publicacao.fotos} 
                          alt={publicacao.titulo} 
                        />
                      ) : (
                        <div className="rounded-lg shadow-lg w-full h-[300px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <p className="text-gray-500 dark:text-gray-400">{t('geral.semImagem')}</p>
                        </div>
                      )}
                    </div>
                    <div className="lg:w-1/2 space-y-4">
                      <div className="text-cyan-500 text-sm font-semibold mb-2">
                        {formatDate(publicacao.created_at)}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {publicacao.titulo}
                      </h3>
                      <div className="relative">
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
                          {publicacao.conteudo}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenModal(publicacao)}
                        className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-all inline-flex items-center space-x-2"
                      >
                        <span>{t('geral.saibaMais')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && visibleItems < publicacoes.length && (
                <div className="flex justify-center mt-16">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t('geral.carregando')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('geral.verMais')}</span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-300">{t('projetos.nenhumaAtividade')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experiencia" className="py-16 md:py-20 bg-white dark:bg-cyan-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Coluna da esquerda - Missão, Visão e Valores */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-8 text-cyan-900 dark:text-white">{t('quemSomos.titulo')}</h2>
                
                {/* Missão */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-cyan-500 mb-4">{t('quemSomos.missao.titulo')}</h3>
                  <p className="text-cyan-700 dark:text-cyan-100 leading-relaxed">
                    {t('quemSomos.missao.descricao')}
                  </p>
                </div>

                {/* Visão */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-cyan-500 mb-4">{t('quemSomos.visao.titulo')}</h3>
                  <p className="text-cyan-700 dark:text-cyan-100 leading-relaxed">
                    {t('quemSomos.visao.descricao')}
                  </p>
                </div>

                {/* Valores */}
                <div>
                  <h3 className="text-xl font-bold text-cyan-500 mb-4">{t('quemSomos.valores.titulo')}</h3>
                  <ul className="space-y-3">
                    {(t('quemSomos.valores.itens', { returnObjects: true }) as string[]).map((valor: string, index: number) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span className="text-cyan-700 dark:text-cyan-100">{valor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('areas-atuacao')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all"
                >
                  {t('quemSomos.botoes.areasAtuacao')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-cyan-900 text-white px-8 py-3 rounded-lg hover:bg-cyan-800 transition-all"
                >
                  {t('quemSomos.botoes.contato')}
                </motion.button>
              </div>
            </div>

            {/* Coluna da direita - Imagem e Estatísticas */}
            <div className="space-y-6 mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
              >
                <img 
                  src="https://storage.googleapis.com/amodes-344f3.firebasestorage.app/publicacoes/1749635227_5b6dbf8f.jpeg"
                  alt="Impacto na Comunidade"
                  className="rounded-xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-cyan-500 text-white p-6 rounded-lg shadow-xl">
                  <p className="text-lg font-semibold">Compromisso com a Comunidade</p>
                  <p className="text-sm mt-2">Transformando vidas desde 2015</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-6 mt-16">
                <div className="text-center p-6 bg-cyan-50 dark:bg-cyan-700 rounded-lg">
                  <div className="text-4xl font-bold text-cyan-500">1000+</div>
                  <div className="text-cyan-700 dark:text-cyan-100">{t('quemSomos.estatisticas.familias')}</div>
                </div>
                <div className="text-center p-6 bg-cyan-50 dark:bg-cyan-700 rounded-lg">
                  <div className="text-4xl font-bold text-cyan-500">7</div>
                  <div className="text-cyan-700 dark:text-cyan-100">{t('quemSomos.estatisticas.areas')}</div>
                </div>
                <div className="text-center p-6 bg-cyan-50 dark:bg-cyan-700 rounded-lg">
                  <div className="text-4xl font-bold text-cyan-500">20+</div>
                  <div className="text-cyan-700 dark:text-cyan-100">{t('quemSomos.estatisticas.projetos')}</div>
                </div>
                <div className="text-center p-6 bg-cyan-50 dark:bg-cyan-700 rounded-lg">
                  <div className="text-4xl font-bold text-cyan-500">50+</div>
                  <div className="text-cyan-700 dark:text-cyan-100">{t('quemSomos.estatisticas.voluntarios')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria Section */}
      <section id="galeria" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('galeria.titulo')}</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('galeria.descricao')}
            </p>
          </div>

          {/* Filtros com Toggle (Mobile) */}
          <div className="relative mb-12">
            {/* Versão Mobile: Botão de Categorias com Seta */}
            <div className="md:hidden w-full flex flex-col space-y-4">
              <div className="flex justify-between items-center p-3 bg-cyan-500 text-white rounded-lg cursor-pointer"
                   onClick={() => setShowAllCategories(!showAllCategories)}>
                <span className="font-medium">{t('galeria.categorias')}</span>
                <ChevronRight className={`w-5 h-5 transform transition-transform duration-300 ${showAllCategories ? 'rotate-90' : ''}`} />
              </div>
              
              {/* Dropdown de Categorias */}
              {showAllCategories && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCategoriaAtiva("Todos");
                      setShowAllCategories(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      categoriaAtiva === "Todos"
                        ? "bg-cyan-500 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t('galeria.todos')}
                  </button>
                  
                  {isLoadingCategorias ? (
                    // Skeletons de carregamento
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    ))
                  ) : (
                    categorias.map((categoria) => (
                      <button
                        key={categoria.id}
                        onClick={() => {
                          setCategoriaAtiva(categoria.nome);
                          setShowAllCategories(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          categoriaAtiva === categoria.nome
                            ? "bg-cyan-500 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {categoria.nome}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            
            {/* Versão Desktop: Carrossel de Filtros */}
            <div className="hidden md:block relative px-10 py-2">
              <div className="category-carousel">
                {/* Container do Carrossel com estilo de transição suave */}
                <div 
                  className="carousel-container"
                  style={{ 
                    transform: `translateX(-${currentCategoryPage * 100}%)`,
                  }}
                >
                  {/* Primeira página com "Todos" + primeiras categorias */}
                  <div className="carousel-page justify-center">
                    <button
                      onClick={() => setCategoriaAtiva("Todos")}
                      className={`category-button ${categoriaAtiva === "Todos" ? "active" : ""}`}
                    >
                      Todos
                    </button>
                    
                    {!isLoadingCategorias && categorias.slice(0, categoriesPerPage - 1).map((categoria) => (
                      <button
                        key={categoria.id}
                        onClick={() => setCategoriaAtiva(categoria.nome)}
                        className={`category-button ${categoriaAtiva === categoria.nome ? "active" : ""}`}
                      >
                        {categoria.nome}
                      </button>
                    ))}
                    
                    {/* Skeletons durante carregamento */}
                    {isLoadingCategorias && Array(3).fill(0).map((_, index) => (
                      <div key={index} className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                  
                  {/* Páginas adicionais de categorias */}
                  {Array.from({ length: Math.ceil((categorias.length - (categoriesPerPage - 1)) / categoriesPerPage) }).map((_, pageIndex) => (
                    <div key={pageIndex} className="carousel-page justify-center">
                      {!isLoadingCategorias && categorias
                        .slice(
                          categoriesPerPage - 1 + (pageIndex * categoriesPerPage),
                          categoriesPerPage - 1 + ((pageIndex + 1) * categoriesPerPage)
                        )
                        .map((categoria) => (
                          <button
                            key={categoria.id}
                            onClick={() => setCategoriaAtiva(categoria.nome)}
                            className={`category-button ${categoriaAtiva === categoria.nome ? "active" : ""}`}
                          >
                            {categoria.nome}
                          </button>
                        ))
                      }
                      
                      {/* Skeletons durante carregamento */}
                      {isLoadingCategorias && Array(4).fill(0).map((_, index) => (
                        <div key={index} className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      ))}
                    </div>
                  ))}
                </div>
                
                {/* Botão Anterior */}
                {currentCategoryPage > 0 && (
                  <button 
                    onClick={() => navigateCategories('prev')}
                    className="carousel-button prev"
                    disabled={isSliding}
                    aria-label="Categorias anteriores"
                  >
                    <ChevronRight className={`w-5 h-5 transform rotate-180 ${document.documentElement.dir === 'rtl' ? 'rtl-mirror' : ''}`} />
                  </button>
                )}
                
                {/* Botão Próximo */}
                {currentCategoryPage < totalCategoryPages - 1 && (
                <button
                    onClick={() => navigateCategories('next')}
                    className="carousel-button next"
                    disabled={isSliding}
                    aria-label="Próximas categorias"
                  >
                    <ChevronRight className={`w-5 h-5 ${document.documentElement.dir === 'rtl' ? 'rtl-mirror' : ''}`} />
                </button>
                )}
              </div>
            </div>
          </div>

          {/* Grade de Imagens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingGaleria ? (
              // Skeletons de carregamento
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg animate-pulse"></div>
              ))
            ) : galeriaItems.length > 0 ? (
              // Renderizar imagens dinâmicas da API (limitado ao número visível)
              galeriaItems.slice(0, visibleGaleriaItems).map((item, index) => (
                <motion.div
                  key={item.publicacao_id}
                  className="group relative overflow-hidden rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={item.url}
                    alt={item.titulo_publicacao}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-cyan-400 text-sm mb-2 block">{item.categoria}</span>
                      <h3 className="text-white text-xl font-semibold">{item.titulo_publicacao}</h3>
                      <p className="text-gray-300 text-sm mt-1">{formatDate(item.data)}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Mensagem quando não há imagens para a categoria selecionada
              <div className="col-span-3 text-center py-16">
                <p className="text-gray-600 dark:text-gray-300">{t('galeria.nenhumaImagem')}</p>
                <button 
                  onClick={() => setCategoriaAtiva("Todos")} 
                  className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  {t('galeria.verTodasCategorias')}
                </button>
              </div>
            )}
          </div>
          
          {/* Botão "Ver Mais" para a galeria */}
          {hasMoreGaleriaItems && !isLoadingGaleria && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMoreGaleriaItems}
                disabled={isLoadingMoreGaleria}
                className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMoreGaleria ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('galeria.carregando')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('galeria.verMais')}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Fallback para as imagens estáticas caso a API não retorne nada e não esteja carregando */}
          {!isLoadingGaleria && galeriaItems.length === 0 && categoriaAtiva === "Todos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {/* Dados estáticos para exibição caso a API não retorne nada */}
              {[
                {
                  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                  category: "Eventos",
                  title: "Assembleia Geral"
                },
                {
                  image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                  category: "Projetos",
                  title: "Capacitação Profissional"
                },
                {
                  image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                  category: "Workshops",
                  title: "Workshop de Liderança"
                },
                {
                  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                  category: "Equipe",
                  title: "Reunião da Equipe"
                }
              ].slice(0, 4).map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-cyan-400 text-sm mb-2 block">{item.category}</span>
                      <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 bg-white dark:bg-cyan-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cyan-900 dark:text-white">{t('sobre.titulo')}</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-cyan-900 dark:text-white mb-6">{t('sobre.historia.titulo')}</h3>
                <p className="text-cyan-700 dark:text-cyan-100 leading-relaxed mb-6">
                  {t('sobre.historia.descricao1')}
                </p>
                <p className="text-cyan-700 dark:text-cyan-100 leading-relaxed">
                  {t('sobre.historia.descricao2')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-6 bg-cyan-50 dark:bg-cyan-700 rounded-lg">
                  <div className="text-4xl font-bold text-cyan-500">3+</div>
                  <div className="text-cyan-700 dark:text-cyan-100">{t('sobre.estatisticas.anosExperiencia')}</div>
                </div>
                <div className="text-center p-6 bg-cyan-50 dark:bg-cyan-700 rounded-lg">
                  <div className="text-4xl font-bold text-cyan-500">1000+</div>
                  <div className="text-cyan-700 dark:text-cyan-100">{t('sobre.estatisticas.vidasImpactadas')}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://storage.googleapis.com/amodes-344f3.firebasestorage.app/publicacoes/1747916617_3966b27e.jpeg"
                alt="Equipe AMODES em reunião"
                className="rounded-lg shadow-xl w-full object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-cyan-500 text-white p-6 rounded-lg shadow-xl">
                <p className="text-lg font-semibold">{t('sobre.compromisso.titulo')}</p>
                <p className="text-sm mt-2">{t('sobre.compromisso.descricao')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe Section */}
      <section id="equipe" className="py-20 bg-cyan-50 dark:bg-cyan-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-cyan-900 dark:text-white">{t('equipe.titulo')}</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-4"></div>
            <p className="text-cyan-700 dark:text-cyan-200 max-w-2xl mx-auto">
              {t('equipe.descricao')}
            </p>
          </div>

          {isLoadingMembros ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {membros.map((membro, index) => (
                <motion.div
                  key={membro.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-cyan-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative h-80">
                    <img 
                      src={membro.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(membro.nome)}&background=0D9488&color=ffffff&size=512`} 
                      alt={membro.nome} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para avatar gerado se a imagem não carregar
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(membro.nome)}&background=0D9488&color=ffffff&size=512`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold">{membro.nome}</h3>
                      <p className="text-cyan-300 font-medium">{membro.cargo}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-cyan-700 dark:text-cyan-200">
                      {membro.descricao || t('equipe.membroDefault')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20 bg-white dark:bg-cyan-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-cyan-900 dark:text-white">{t('contato.titulo')}</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-4"></div>
            <p className="text-cyan-700 dark:text-cyan-200 max-w-2xl mx-auto">
              {t('contato.descricao')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-cyan-900 dark:text-white">{t('contato.formulario.enviar')}</h3>
              
              {contactStatus === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-green-800 dark:text-green-200">{t('contato.sucesso')}</h3>
                  <p className="mt-2 text-sm text-green-600 dark:text-green-300">{contactMessage}</p>
                  <button
                    onClick={() => setContactStatus('idle')}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Enviar nova mensagem
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nome" className="block text-cyan-700 dark:text-cyan-200 mb-2">{t('contato.nome')}</label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={contactFormData.nome}
                        onChange={handleContactInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-cyan-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-cyan-700 dark:text-cyan-200 mb-2">{t('contato.email')}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-cyan-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="assunto" className="block text-cyan-700 dark:text-cyan-200 mb-2">{t('contato.assunto')}</label>
                    <input
                      type="text"
                      id="assunto"
                      name="assunto"
                      value={contactFormData.assunto}
                      onChange={handleContactInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-cyan-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="mensagem" className="block text-cyan-700 dark:text-cyan-200 mb-2">{t('contato.mensagem')}</label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={contactFormData.mensagem}
                      onChange={handleContactInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-cyan-700 dark:text-white"
                    ></textarea>
                  </div>
                  
                  {contactStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                      <p className="text-red-600 dark:text-red-300">{contactMessage}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isContactSubmitting}
                    className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all disabled:opacity-60 flex items-center justify-center"
                  >
                    {isContactSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('contato.enviando')}
                      </>
                    ) : (
                      t('Enviar')
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-cyan-100 dark:bg-cyan-700 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-900 dark:text-white">{t('contato.endereco')}</h4>
                    <p className="text-cyan-700 dark:text-cyan-200">Niassa, Lichinga</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-cyan-100 dark:bg-cyan-700 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-900 dark:text-white">{t('contato.telefone')}</h4>
                    <p className="text-cyan-700 dark:text-cyan-200">258845381847</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-cyan-100 dark:bg-cyan-700 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-900 dark:text-white">Email</h4>
                    <p className="text-cyan-700 dark:text-cyan-200">amodesassociacao@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/1FGanbccKh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/amodes_moz?igsh=MWdjeWo3MHlocXh1aQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Confirmation Modal */}
      {showDonationConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-cyan-900 dark:text-white mb-4">Confirmar Doação</h3>
            <p className="text-cyan-700 dark:text-cyan-200 mb-6">
              Está prestes a fazer uma doação para AMODES. Deseja continuar?
            </p>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <button
                onClick={confirmDonation}
                className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-all flex items-center justify-center space-x-2"
                disabled={isDonationSubmitting}
              >
                {isDonationSubmitting ? (
                  <>
                    <Spinner className="h-5 w-5 text-white" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>Confirmar</span>
                )}
              </button>
              <button
                onClick={cancelDonation}
                className="border border-cyan-500 text-cyan-500 px-6 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900 transition-all"
                disabled={isDonationSubmitting}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-cyan-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Coluna 1 - Logo e Descrição */}
            <div>
              <div className="flex items-center mb-6">
                <a href="#inicio">
                  <img 
                    src="/images/logo.png" 
                    alt="AMODES" 
                    className="h-12 w-auto"
                  />
                </a>
              </div>
              <h5 className="text-cyan-300 font-semibold mb-2">Associação  Moçambicana de Desenvolvimento Sustentável</h5>
              <p className="text-cyan-400">Agir para Impactar</p>
            </div>

            {/* Coluna 2 - Links Rápidos */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">{t('footer.linksRapidos')}</h4>
              <ul className="space-y-2">
                <li><a href="#inicio" className="text-cyan-400 hover:text-cyan-300 transition-colors">Início</a></li>
                <li><a href="#sobre" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sobre</a></li>
                <li><a href="#equipe" className="text-cyan-400 hover:text-cyan-300 transition-colors">Equipa</a></li>
                <li><a href="#projetos" className="text-cyan-400 hover:text-cyan-300 transition-colors">Actividades</a></li>
                <li><a href="#galeria" className="text-cyan-400 hover:text-cyan-300 transition-colors">Galeria</a></li>
                <li><a href="#contato" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contacto</a></li>
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
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">{t('footer.contatos')}</h4>
              <div className="space-y-3">
                <p className="flex items-center space-x-3 text-cyan-400">
                  <Phone className="w-5 h-5" />
                  <span>258845381847</span>
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
              <h4 className="text-lg font-semibold mb-4 text-cyan-400">{t('contato.newsletter.titulo')}</h4>
              <p className="text-cyan-400 mb-4">{t('contato.newsletter.descricao')}</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder={t('contato.newsletter.placeholder')}
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
                  {isNewsletterSubmitting ? t('contato.newsletter.processando') : t('contato.newsletter.botao')}
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-cyan-800 mt-12 pt-8 text-center">
            <p className="text-cyan-400">{t('footer.direitos')}</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && selectedPublicacao && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedPublicacao.titulo}
                  </h3>
                  <p className="text-cyan-500 text-sm">
                    {formatDate(selectedPublicacao.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={t('geral.fechar')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedPublicacao.fotos && selectedPublicacao.fotos.length > 0 ? (
                <ImageCarousel 
                  images={selectedPublicacao.fotos} 
                  alt={selectedPublicacao.titulo}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('geral.semImagem')}</p>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedPublicacao.conteudo}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default App;

