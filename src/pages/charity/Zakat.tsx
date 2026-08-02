import React from 'react';
import ZakatCalculator from '@/components/charity/ZakatCalculator';

/**
 * Charity Zakat Calculator page
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Wrapper page that renders the ZakatCalculator component with a
 * simple header. Accessed via /charity/zakat.
 */
const CharityZakat: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Zakat Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate your Zakat al-Mal based on the nisab threshold.
            Zakat is 2.5% of qualifying wealth held for one lunar year.
          </p>
        </div>
        <ZakatCalculator />
      </div>
    </div>
  );
};

export default CharityZakat;
