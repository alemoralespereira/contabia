import React from 'react';
import Hero from './Hero';
import FeatureSection from './FeatureSection';
import Services from './Services';
import Testimonials from './Testimonials';

const HomePage = ({ setCurrentPage }) => {
  return (
    <div>
      <Hero setCurrentPage={setCurrentPage} />
      <FeatureSection />
      <Services />
      <Testimonials />
    </div>
  );
};

export default HomePage;