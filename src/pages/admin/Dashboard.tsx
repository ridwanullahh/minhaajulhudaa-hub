import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SchoolAdmin from './SchoolAdmin';
import MasjidAdmin from './MasjidAdmin';
import CharityAdmin from './CharityAdmin';
import TravelsAdmin from './TravelsAdmin';
import NotFound from '../NotFound';

interface AdminDashboardProps {
  platform: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ platform }) => {
  const getAdminComponent = () => {
    switch (platform) {
      case 'school':
        return <SchoolAdmin />;
      case 'masjid':
        return <MasjidAdmin />;
      case 'charity':
        return <CharityAdmin />;
      case 'travels':
        return <TravelsAdmin />;
      default:
        return <NotFound />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={getAdminComponent()} />
      <Route path="/*" element={getAdminComponent()} />
    </Routes>
  );
};

export default AdminDashboard;
