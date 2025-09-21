'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/navigation';
import { Button, Card, Elevation } from '../../app/components/MaterialComponents';
import { Sparkles, Zap, Shield, Lightbulb, Edit, Brain, TrendingUp, Rocket, ArrowRight } from 'lucide-react';

export default function JanyaLandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: Zap,
            title: 'AI-Powered Insights',
            description: 'Get personalized insights and patterns from your journal entries using advanced AI analysis.'
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your thoughts are safe with end-to-end encryption and local data storage options.'
        },
        {
            icon: Lightbulb,
            title: 'Smart Prompts',
            description: 'Never run out of things to write with AI-generated prompts tailored to your interests.'
        }
    ];

    const handleStartJournalling = () => {
        router.push('/journal');
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--md-sys-color-background)' }}>
            {/* Navigation */}
            <Navbar onGetStarted={handleStartJournalling} />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 md:py-24" 
                     style={{ 
                         backgroundColor: 'var(--md-sys-color-primary)',
                         color: 'var(--md-sys-color-on-primary)'
                     }}>
                <Elevation level={1} className="absolute inset-0" />
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <Sparkles className="w-16 h-16 md:w-20 md:h-20" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Transform Your Thoughts with Janya
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Discover meaningful insights from your daily reflections with Janya's intelligent analysis and personalized growth recommendations.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button
                                variant="filled"
                                size="large"
                                className="px-8 py-4 text-lg font-semibold"
                                onClick={handleStartJournalling}
                                style={{ 
                                    backgroundColor: 'var(--md-sys-color-surface)',
                                    color: 'var(--md-sys-color-on-surface)'
                                }}
                            >
                                Start for Free
                            </Button>
                        </div>

                        {/* Stats */}
                        <Card variant="elevated" className="max-w-2xl mx-auto p-8 backdrop-blur-sm">
                            <Elevation level={2} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                                        10k+
                                    </div>
                                    <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        Active Users
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                                        1M+
                                    </div>
                                    <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        Journal Entries
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                                        4.9★
                                    </div>
                                    <div style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        User Rating
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24" style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                            Everything You Need for Meaningful Journalling
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Powerful features designed to enhance your self-reflection and personal growth journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <Card
                                    key={index}
                                    variant="elevated"
                                    className="p-8 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                                >
                                    <Elevation level={1} className="group-hover:shadow-lg transition-all duration-300" />
                                    <div className="text-center">
                                        <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent className="w-12 h-12 mx-auto" style={{ color: 'var(--md-sys-color-primary)' }} />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                                            {feature.title}
                                        </h3>
                                        <p className="leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 md:py-24" 
                     style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                            Simple Steps to Transformative Insights
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Get started with Janya in just three easy steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Write Freely',
                                description: 'Express your thoughts and feelings in our intuitive, distraction-free journal interface',
                                icon: Edit
                            },
                            {
                                step: '02',
                                title: 'AI Analysis',
                                description: 'Our intelligent system analyzes patterns, emotions, and themes in your entries',
                                icon: Brain
                            },
                            {
                                step: '03',
                                title: 'Grow & Improve',
                                description: 'Receive personalized insights and actionable recommendations for personal growth',
                                icon: TrendingUp
                            }
                        ].map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <Card key={index} variant="elevated" className="text-center p-8 relative">
                                    <Elevation level={1} />
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                                         style={{ backgroundColor: 'var(--md-sys-color-primary)' }}>
                                        {step.step}
                                    </div>
                                    <div className="mb-6">
                                        <IconComponent className="w-16 h-16 mx-auto" style={{ color: 'var(--md-sys-color-secondary)' }} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                                        {step.title}
                                    </h3>
                                    <p className="leading-relaxed" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        {step.description}
                                    </p>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24" 
                     style={{ 
                         backgroundColor: 'var(--md-sys-color-secondary)',
                         color: 'var(--md-sys-color-on-secondary)'
                     }}>
                <Elevation level={1} className="absolute inset-0" />
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Rocket className="w-16 h-16 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Start Your Journey Today
                        </h2>
                        <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of users who have discovered the power of AI-enhanced journalling for personal growth
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Button
                                variant="filled"
                                size="large"
                                className="px-8 py-4 text-lg font-semibold"
                                onClick={handleStartJournalling}
                                style={{ 
                                    backgroundColor: 'var(--md-sys-color-surface)',
                                    color: 'var(--md-sys-color-on-surface)'
                                }}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="text"
                                size="large"
                                className="px-6 py-4 text-lg"
                                style={{ color: 'var(--md-sys-color-on-secondary)' }}
                            >
                                <span className="flex items-center gap-2">
                                    Learn more
                                    <ArrowRight className="w-5 h-5" />
                                </span>
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