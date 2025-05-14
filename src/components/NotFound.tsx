import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900 dark:to-cyan-800">
      {/* Header with logo */}
      <header className="p-4">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="AMODES" className="h-10" />
            <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">AMODES</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-8xl font-bold text-cyan-500 mb-4">404</h1>
            
            <div className="w-20 h-1 bg-cyan-500 mx-auto mb-6"></div>
            
            <h2 className="text-3xl font-bold text-cyan-900 dark:text-white mb-4">
              {t('notFound.title', 'Página Não Encontrada')}
            </h2>
            
            <p className="text-lg text-cyan-700 dark:text-cyan-200 mb-8">
              {t('notFound.message', 'Não existe nada aqui. A página que você está procurando não foi encontrada.')}
            </p>
            
            <Link 
              to="/"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('notFound.backHome', 'Voltar para o Início')}
            </Link>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-1/3 left-10 opacity-20 hidden lg:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-32 h-32 rounded-full border-6 border-cyan-300 dark:border-cyan-700"></div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/4 right-10 opacity-20 hidden lg:block"
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 rounded-full border-6 border-cyan-300 dark:border-cyan-700"></div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-cyan-700 dark:text-cyan-200 text-sm">
        <p>© {new Date().getFullYear()} AMODES - Associação Moçambicana para o Desenvolvimento Sustentável</p>
      </footer>
    </div>
  );
};

export default NotFound; 