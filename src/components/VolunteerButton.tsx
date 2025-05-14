import React from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VolunteerButton: React.FC = () => {
  const navigate = useNavigate();

  const handleVolunteerClick = () => {
    navigate('/voluntario');
  };

  return (
    <button 
      onClick={handleVolunteerClick}
      className="bg-cyan-500 text-white px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all flex items-center justify-center space-x-2"
      type="button"
    >
      <UserPlus className="h-5 w-5" />
      <span>Seja Voluntário</span>
    </button>
  );
};

export default VolunteerButton; 