import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonationButton: React.FC = () => {
  const navigate = useNavigate();

  const handleDonationClick = () => {
    navigate('/doar');
  };

  return (
    <button 
      onClick={handleDonationClick}
      className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all flex items-center justify-center space-x-2"
      type="button"
    >
      <Heart className="h-5 w-5" />
      <span>Doe Agora</span>
    </button>
  );
};

export default DonationButton;
