import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import DonationForm from './components/DonationForm';
import VolunteerForm from './components/VolunteerForm';
import NotFound from './components/NotFound';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/doar" element={<DonationForm />} />
        <Route path="/voluntario" element={<VolunteerForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter; 