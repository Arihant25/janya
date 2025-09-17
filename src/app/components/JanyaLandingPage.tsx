'use client';

import React, { useEffect, useRef } from 'react';

export default function JanyaLandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Create Material Web elements dynamically to avoid TypeScript issues
        const createMaterialElement = (tagName: string, props: any = {}, textContent?: string) => {
            const element = document.createElement(tagName);
            Object.entries(props).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value as string;
                } else {
                    element.setAttribute(key, value as string);
                }
            });
            if (textContent) {
                element.textContent = textContent;
            }
            return element;
        };

        if (containerRef.current) {
            // Find and replace placeholder buttons with Material Web components
            const fillButtons = containerRef.current.querySelectorAll('[data-material="filled-button"]');
            fillButtons.forEach(button => {
                const mdButton = createMaterialElement('md-filled-button', {
                    className: button.className
                }, button.textContent || '');
                button.parentNode?.replaceChild(mdButton, button);
            });

            const outlinedButtons = containerRef.current.querySelectorAll('[data-material="outlined-button"]');
            outlinedButtons.forEach(button => {
                const mdButton = createMaterialElement('md-outlined-button', {
                    className: button.className
                }, button.textContent || '');
                button.parentNode?.replaceChild(mdButton, button);
            });

            const textButtons = containerRef.current.querySelectorAll('[data-material="text-button"]');
            textButtons.forEach(button => {
                const mdButton = createMaterialElement('md-text-button', {
                    className: button.className
                }, button.textContent || '');
                button.parentNode?.replaceChild(mdButton, button);
            });

            const textFields = containerRef.current.querySelectorAll('[data-material="outlined-text-field"]');
            textFields.forEach(field => {
                const mdField = createMaterialElement('md-outlined-text-field', {
                    label: field.getAttribute('data-label') || '',
                    type: field.getAttribute('data-type') || 'text',
                    className: field.className
                });
                field.parentNode?.replaceChild(mdField, field);
            });

            const cards = containerRef.current.querySelectorAll('[data-material="card"]');
            cards.forEach(card => {
                const mdCard = createMaterialElement('md-card', {
                    className: card.className
                });
                mdCard.innerHTML = card.innerHTML;
                card.parentNode?.replaceChild(mdCard, card);
            });
        }
    }, []);

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
            icon: '📊',
            title: 'Mood Tracking',
            description: 'Track your emotional journey with visual mood analytics and progress tracking.'
        },
        {
            icon: '🎯',
            title: 'Goal Setting',
            description: 'Set and track personal goals with AI-assisted progress monitoring and suggestions.'
        },
        {
            icon: '🌱',
            title: 'Growth Analytics',
            description: 'Discover patterns in your personal growth with detailed analytics and insights.'
        },
        {
            icon: '💡',
            title: 'Smart Prompts',
            description: 'Never run out of things to write with AI-generated prompts tailored to your interests.'
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="md-typescale-display-large hero-title">
                            Transform Your Thoughts with <span className="accent-text">Janya</span>
                        </h1>
                        <p className="md-typescale-headline-medium hero-subtitle">
                            The AI-powered journalling app that turns your daily reflections into meaningful insights for personal growth.
                        </p>

                        <div className="hero-actions">
                            <button
                                data-material="filled-button"
                                className="primary-button"
                            >
                                Start Journalling Today
                            </button>
                            <button
                                data-material="outlined-button"
                                className="secondary-button"
                            >
                                Watch Demo
                            </button>
                        </div>

                        {/* Newsletter Signup */}
                        <div className="newsletter-signup">
                            <p className="md-typescale-body-large">Join the waitlist for early access</p>
                            <div className="email-form">
                                <div
                                    data-material="outlined-text-field"
                                    data-label="Enter your email"
                                    data-type="email"
                                    className="email-input"
                                ></div>
                                <button
                                    data-material="filled-button"
                                    className="submit-button"
                                >
                                    Join Waitlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="md-typescale-display-medium">
                            Powerful Features for Mindful Journalling
                        </h2>
                        <p className="md-typescale-body-large">
                            Discover how Janya's AI-powered features can enhance your journalling experience
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} data-material="card" className="feature-card">
                                <div className="feature-content">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3 className="md-typescale-headline-small">{feature.title}</h3>
                                    <p className="md-typescale-body-medium">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="md-typescale-display-medium">How Janya Works</h2>
                        <p className="md-typescale-body-large">
                            Three simple steps to start your AI-enhanced journalling journey
                        </p>
                    </div>

                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3 className="md-typescale-headline-small">Write</h3>
                            <p className="md-typescale-body-medium">
                                Express your thoughts freely in our intuitive journal interface
                            </p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3 className="md-typescale-headline-small">Analyze</h3>
                            <p className="md-typescale-body-medium">
                                Our AI analyzes patterns, emotions, and themes in your entries
                            </p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3 className="md-typescale-headline-small">Grow</h3>
                            <p className="md-typescale-body-medium">
                                Receive personalized insights to guide your personal development
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="md-typescale-display-medium">
                            Ready to Begin Your Journey?
                        </h2>
                        <p className="md-typescale-headline-small">
                            Join thousands of users who have discovered the power of AI-enhanced journalling
                        </p>

                        <div className="cta-actions">
                            <button
                                data-material="filled-button"
                                className="primary-button large"
                            >
                                Get Started Free
                            </button>
                            <button
                                data-material="text-button"
                                className="link-button"
                            >
                                Learn more about our features →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3 className="md-typescale-headline-medium">Janya</h3>
                            <p className="md-typescale-body-medium">
                                AI-powered journalling for personal growth
                            </p>
                        </div>

                        <div className="footer-links">
                            <div className="link-group">
                                <h4 className="md-typescale-title-medium">Product</h4>
                                <a href="#features" className="footer-link">Features</a>
                                <a href="#pricing" className="footer-link">Pricing</a>
                                <a href="#demo" className="footer-link">Demo</a>
                            </div>
                            <div className="link-group">
                                <h4 className="md-typescale-title-medium">Company</h4>
                                <a href="#about" className="footer-link">About</a>
                                <a href="#blog" className="footer-link">Blog</a>
                                <a href="#contact" className="footer-link">Contact</a>
                            </div>
                            <div className="link-group">
                                <h4 className="md-typescale-title-medium">Support</h4>
                                <a href="#help" className="footer-link">Help Center</a>
                                <a href="#privacy" className="footer-link">Privacy</a>
                                <a href="#terms" className="footer-link">Terms</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="md-typescale-body-small">
                            © 2025 Janya. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}