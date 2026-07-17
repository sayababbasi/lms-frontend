import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const NewsletterSection = () => {
    return (
        <section className="py-20 bg-primary-600 relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-700 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Subscribe to Our Newsletter
                    </h2>
                    <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
                        Get the latest updates, new course notifications, and learning tips delivered directly to your inbox.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                        <button className="px-8 py-4 rounded-xl bg-white text-primary-600 font-bold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
                            Subscribe
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-sm text-primary-200 mt-6">
                        We care about your data in our <span className="underline cursor-pointer hover:text-white">privacy policy</span>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
