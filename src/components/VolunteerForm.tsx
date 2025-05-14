import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, CheckCircle, X } from 'lucide-react';
import Layout from './Layout';

interface VolunteerFormData {
  nome: string;
  email: string;
  telefone: string;
  area_interesse: string;
  cidade: string;
  mensagem: string;
}

const VolunteerForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<VolunteerFormData>({
    nome: '',
    email: '',
    telefone: '',
    area_interesse: '',
    cidade: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/voluntarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar o formulário');
      }
      
      const data = await response.json();
      console.log('Volunteer registration submitted:', data);
      setVolunteerSuccess(true);
      
      // Reset form after success
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        area_interesse: '',
        cidade: '',
        mensagem: ''
      });
    } catch (error) {
      console.error('Error submitting volunteer form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  const areasInteresse = [
    'Educação e Cultura',
    'Saúde e Bem-estar',
    'Meio Ambiente (Mudanças Climáticas)',
    'Direitos Humanos',
    'Empoderamento Económico Social/Empreendedorismo'
  ];

  return (
    <Layout>
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <UserPlus className="mx-auto h-12 w-12 text-emerald-500" />
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('volunteer.title', 'Seja Voluntário')}
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {t('volunteer.subtitle', 'Junte-se a nós e contribua para o desenvolvimento sustentável de Moçambique')}
            </p>
          </div>

          {volunteerSuccess ? (
            <div className="bg-white shadow overflow-hidden rounded-lg p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100">
                <CheckCircle className="h-6 w-6 text-cyan-600" />
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">{t('volunteer.thankYou', 'Obrigado pelo seu interesse!')}</h2>
              <p className="mt-2 text-sm text-gray-500">
                {t('volunteer.successMessage', 'A sua inscrição como voluntário foi recebida com sucesso. Entraremos em contacto em breve.')}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  onClick={() => setVolunteerSuccess(false)}
                >
                  {t('volunteer.newRegistration', 'Fazer nova inscrição')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        {t('volunteer.name', 'Nome completo')}
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
                        {t('volunteer.email', 'Email')}
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
                        {t('volunteer.phone', 'Telefone')}
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="telefone"
                          id="telefone"
                          required
                          value={formData.telefone}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                        {t('volunteer.city', 'Cidade')}
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cidade"
                          id="cidade"
                          required
                          value={formData.cidade}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="area_interesse" className="block text-sm font-medium text-gray-700">
                        {t('volunteer.interestArea', 'Área de interesse')}
                      </label>
                      <div className="mt-1">
                        <select
                          id="area_interesse"
                          name="area_interesse"
                          required
                          value={formData.area_interesse}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Selecione uma área</option>
                          {areasInteresse.map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
                        {t('volunteer.message', 'Mensagem (opcional)')}
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
                        {t('volunteer.messageHelp', 'Partilhe connosco a sua motivação para ser voluntário ou qualquer outra informação que considere relevante.')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      >
                        {t('volunteer.submit', 'Inscrever-me')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('volunteer.aboutTitle', 'Sobre o voluntariado')}</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{t('volunteer.aboutText', 'O voluntariado é uma forma importante de contribuir para o desenvolvimento sustentável de Moçambique. Como voluntário, você terá a oportunidade de participar em projectos e actividades que fazem a diferença na vida das comunidades.')}</p>
              </div>
              <div className="mt-5">
                <a href="#" className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
                  {t('volunteer.learnMore', 'Saiba mais sobre o nosso programa de voluntariado')} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('volunteer.confirmTitle', 'Confirmar Inscrição')}
              </h3>
              <button
                onClick={handleCancelSubmit}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                {t('volunteer.confirmMessage', 'Por favor, confirme os dados da sua inscrição:')}
              </p>
              
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t('volunteer.name', 'Nome')}:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white col-span-2">
                    {formData.nome}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t('volunteer.email', 'Email')}:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white col-span-2">
                    {formData.email}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t('volunteer.phone', 'Telefone')}:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white col-span-2">
                    {formData.telefone}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t('volunteer.city', 'Cidade')}:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white col-span-2">
                    {formData.cidade}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {t('volunteer.interestArea', 'Área de interesse')}:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white col-span-2">
                    {formData.area_interesse}
                  </p>
                </div>
                
                {formData.mensagem && (
                  <div className="grid grid-cols-3 gap-2">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {t('volunteer.message', 'Mensagem')}:
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white col-span-2">
                      {formData.mensagem}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleCancelSubmit}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600"
              >
                {t('volunteer.cancel', 'Cancelar')}
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('volunteer.processing', 'A processar...')}</span>
                  </>
                ) : (
                  <span>{t('volunteer.confirm', 'Confirmar')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VolunteerForm; 