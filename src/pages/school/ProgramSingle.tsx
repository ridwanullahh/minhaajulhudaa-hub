import React from 'react';
import { useParams } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';

const SchoolProgramSingle = () => {
  const { slug } = useParams();
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ModernCard variant="glass" className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Program Details</h1>
          <p className="text-gray-600">Program slug: {slug}</p>
          <p className="text-gray-600 mt-4">This page will show detailed information about the specific program.</p>
        </ModernCard>
      </div>
    </div>
  );
};

export default SchoolProgramSingle;
