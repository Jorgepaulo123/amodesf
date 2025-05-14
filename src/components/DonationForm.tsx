import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, DollarSign } from 'lucide-react';
import Layout from './Layout';

interface DonationFormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  valor: string;
}

const DonationForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DonationFormData>({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
    valor: '100'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Donation submitted:', formData);
      setDonationSuccess(true);
      
      // Reset form after success
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        mensagem: '',
        valor: '100'
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('donation.title', 'Faça uma Doação')}
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {t('donation.subtitle', 'Ajude-nos a continuar os nossos projectos e actividades para o desenvolvimento sustentável de Moçambique')}
            </p>
          </div>

          {donationSuccess ? (
            <div className="bg-white shadow overflow-hidden rounded-lg p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">{t('donation.thankYou', 'Obrigado pela sua doação!')}</h2>
              <p className="mt-2 text-sm text-gray-500">
                {t('donation.successMessage', 'A sua contribuição é muito importante para os nossos projectos. Entraremos em contacto em breve.')}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={() => setDonationSuccess(false)}
                >
                  {t('donation.newDonation', 'Fazer nova doação')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        {t('donation.name', 'Nome completo')}
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="nome"
                          id="nome"
                          required
                          value={formData.nome}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t('donation.email', 'Email')}
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                        {t('donation.phone', 'Telefone')}
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="telefone"
                          id="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
                        {t('donation.amount', 'Valor da doação (MZN)')}
                      </label>
                      <div className="mt-1">
                        <select
                          id="valor"
                          name="valor"
                          value={formData.valor}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="100">100 MZN</option>
                          <option value="500">500 MZN</option>
                          <option value="1000">1.000 MZN</option>
                          <option value="5000">5.000 MZN</option>
                          <option value="10000">10.000 MZN</option>
                          <option value="custom">{t('donation.customAmount', 'Outro valor')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
                        {t('donation.message', 'Mensagem (opcional)')}
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="mensagem"
                          name="mensagem"
                          rows={4}
                          value={formData.mensagem}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {t('donation.messageHelp', 'Partilhe connosco o motivo da sua doação ou qualquer outra informação que considere relevante.')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('donation.processing', 'A processar...')}
                          </>
                        ) : (
                          t('donation.submit', 'Doar agora')
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('donation.aboutTitle', 'Sobre as doações')}</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{t('donation.aboutText', 'As suas doações são essenciais para continuarmos o nosso trabalho em prol do desenvolvimento sustentável de Moçambique. Todos os fundos são utilizados para financiar os nossos projectos e actividades.')}</p>
              </div>
              <div className="mt-5">
                <a href="#" className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
                  {t('donation.learnMore', 'Saiba mais sobre como utilizamos as doações')} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonationForm; 