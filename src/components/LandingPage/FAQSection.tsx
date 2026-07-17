import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "How do I sign up for a course?",
        answer: "Signing up is easy! Just create an account, browse our course catalog, and click 'Enroll' on any course you wish to take."
    },
    {
        question: "Is there a free trial for premium courses?",
        answer: "Many of our courses offer a free preview or trial period so you can explore the content before committing."
    },
    {
        question: "Can I teach on this platform?",
        answer: "Absolutely! We welcome experts from all fields. Sign up as an instructor to start creating and selling your courses."
    },
    {
        question: "Do you offer certificates?",
        answer: "Yes, most of our courses provide a verified certificate of completion that you can add to your LinkedIn profile or resume."
    }
];

const FAQSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-600">
                        Have questions? We're here to help.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Disclosure key={index} as="div" className="border border-slate-200 rounded-xl overflow-hidden">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left font-medium text-slate-900 bg-slate-50 hover:bg-slate-100 focus:outline-none transition-colors">
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                            className={`${open ? 'transform rotate-180' : ''
                                                } w-5 h-5 text-slate-500 transition-transform duration-200`}
                                        />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Disclosure.Panel className="px-6 py-4 text-slate-600 bg-white">
                                            {faq.answer}
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
