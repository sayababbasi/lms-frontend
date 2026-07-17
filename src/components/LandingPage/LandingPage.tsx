import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesGrid from './FeaturesGrid';
import PricingSection from './PricingSection';
import StatsSection from './StatsSection';
import TestimonialsSection from './TestimonialsSection';
import TrustedBySection from './TrustedBySection';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
            <Header />
            <HeroSection />
            <TrustedBySection />
            <StatsSection />
            <FeaturesGrid />
            <PricingSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPage;
