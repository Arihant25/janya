'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/navigation';
import { Button } from '../../app/components/MaterialComponents';

export default function JanyaLandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: '✨',
            title: 'AI-Powered Insights',
            description: 'Get personalized insights and patterns from your journal entries using advanced AI analysis.'
        },
        {
            icon: '🔐',
            title: 'Privacy First',
            description: 'Your thoughts are safe with end-to-end encryption and local data storage options.'
        },
        {
            icon: '💡',
            title: 'Smart Prompts',
            description: 'Never run out of things to write with AI-generated prompts tailored to your interests.'
        }
    ];

    const handleStartJournalling = () => {
        router.push('/journal');
    };

    return (
        <div className="min-h-screen bg-surface">
            {/* Navigation */}
            <Navbar onGetStarted={handleStartJournalling} />

            {/* Hero Section */}
            <section className="hero-section bg-gradient py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
                            Transform Your Thoughts with Janya
                        </h1>
                        <p className="text-xl md:text-2xl text-on-primary/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Discover meaningful insights from your daily reflections with Janya's intelligent analysis and personalized growth recommendations.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button
                                variant="filled"
                                className="px-8 py-4 text-lg font-semibold"
                                onClick={handleStartJournalling}
                            >
                                Start for Free
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="max-w-2xl mx-auto p-8 bg-surface/10 backdrop-blur-sm border border-outline/20 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-on-surface mb-2">10k+</div>
                                    <div className="text-on-surface-variant">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-on-surface mb-2">1M+</div>
                                    <div className="text-on-surface-variant">Journal Entries</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-on-surface mb-2">4.9★</div>
                                    <div className="text-on-surface-variant">User Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24 bg-surface">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-6">
                            Everything You Need for Meaningful Journalling
                        </h2>
                        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                            Powerful features designed to enhance your self-reflection and personal growth journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-surface-variant rounded-xl p-8 border border-outline-variant hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                            >
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-on-surface mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-on-surface-variant leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 md:py-24 bg-surface-variant/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-6">
                            Simple Steps to Transformative Insights
                        </h2>
                        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                            Get started with Janya in just three easy steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Write Freely',
                                description: 'Express your thoughts and feelings in our intuitive, distraction-free journal interface',
                                icon: '✍️'
                            },
                            {
                                step: '02',
                                title: 'AI Analysis',
                                description: 'Our intelligent system analyzes patterns, emotions, and themes in your entries',
                                icon: '🤖'
                            },
                            {
                                step: '03',
                                title: 'Grow & Improve',
                                description: 'Receive personalized insights and actionable recommendations for personal growth',
                                icon: '🚀'
                            }
                        ].map((step, index) => (
                            <div key={index} className="text-center relative">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-on-primary mx-auto mb-6 shadow-lg">
                                    {step.step}
                                </div>
                                <div className="text-6xl mb-6">{step.icon}</div>
                                <h3 className="text-2xl font-bold text-on-surface mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-on-surface-variant leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient text-on-primary">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Start Your Journey Today
                        </h2>
                        <p className="text-xl md:text-2xl text-on-primary/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of users who have discovered the power of AI-enhanced journalling for personal growth
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Button
                                variant="filled"
                                className="px-8 py-4 text-lg font-semibold bg-surface text-on-surface hover:bg-surface/90"
                                onClick={handleStartJournalling}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="text"
                                className="px-6 py-4 text-lg text-on-primary hover:bg-on-primary/10"
                            >
                                Learn more →
                            </Button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}