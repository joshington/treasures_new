import React from 'react';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/Hero';
import HowDoYouKnow from '@/components/HowDoYouKnow';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import ContactSection from '@/components/ContactSection';


const index = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <HowDoYouKnow />
      <Testimonials />
      <Pricing />
      <ContactSection />
    </div>
    // <h1 className="text-3xl font-bold underline">
    //   Hello world!
    // </h1>
  )
}

export default index;

