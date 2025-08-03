import React from 'react';
import { useParams } from 'react-router-dom';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';

const CharityBlogPost = () => {
  const { slug } = useParams();
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Blog Post <span className="text-platform-primary">Page</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This is the blog post page for Charity platform.
            {slug && ` Current item: ${slug}`}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <ModernCard key={item} variant="glass" className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Blog Post Item {item}
              </h3>
              <p className="text-gray-600 mb-6">
                This is a placeholder for blog post content. 
                Real data will be loaded from the GitHub database.
              </p>
              <ModernButton className="w-full">
                Learn More
              </ModernButton>
            </ModernCard>
          ))}
        </div>

        <div className="mt-16 text-center">
          <ModernCard variant="gradient" padding="xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              This page is under development and will be fully functional soon.
            </p>
            <ModernButton size="lg">
              Get Notified
            </ModernButton>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default CharityBlogPost;