import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="mb-6">
                            <img
                                src="/branding/revoticai-new-logo-for-dark-theme.png"
                                alt="Revotic LMS"
                                className="h-10 w-auto"
                            />
                        </div>
                        <p className="mb-6 leading-relaxed">
                            Empowering education through technology. Join us in shaping the future of learning.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Browse Courses</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">For Instructors</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">For Enterprise</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Success Stories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Cookie Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary-500 transition-colors">Accessibility</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <div>
                        &copy; {new Date().getFullYear()} Revotic-LMS. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
