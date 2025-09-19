'use client';

import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/navigation';

export default function JanyaLandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const handleStartJournalling = () => {
        router.push('/journal');
    };

    return (
        <div ref={containerRef} className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
            {/* Navigation */}
            <Navbar onGetStarted={handleStartJournalling} />

            {/* Hero Section */}
            <section className="hero-section" style={{
                backgroundColor: 'var(--janya-text-primary)',
                color: 'white',
                position: 'relative'
            }}>
                <div className="container" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    textAlign: 'center'
                }}>
                    <div className="hero-content">
                        <h1 style={{
                            fontSize: '2.9rem',
                            fontWeight: '700',
                            marginBottom: '1.5rem',
                            maxWidth: '900px',
                            margin: '0 auto 1.5rem auto',
                            color: 'var(--janya-neutral)'
                        }}>
                            Transform Your Thoughts with{' '}
                            <span style={{ color: 'var(--janya-secondary)' }}>Janya</span>
                        </h1>
                        <p className="hero-subtitle" style={{
                            fontSize: '1.25rem',
                            marginBottom: '3rem',
                            opacity: '0.9',
                            maxWidth: '700px',
                            margin: '0 auto 3rem auto',
                            lineHeight: '1.6',
                            color: 'var(--janya-accent-light)'
                        }}>
                            Discover meaningful insights from your daily reflections with Janya's intelligent analysis and personalized growth recommendations.
                        </p>

                        <div className="hero-actions" style={{
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '4rem'
                        }}>
                            <button
                                data-material="filled-button"
                                className="primary-button"
                                onClick={handleStartJournalling}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    backgroundColor: 'white',
                                    color: 'var(--janya-text-primary)',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Start for Free
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '2rem',
                            maxWidth: '800px',
                            padding: '2rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                }}>10k+</div>
                                <div style={{
                                    fontSize: '1rem',
                                    opacity: 0.8
                                }}>Active Users</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                }}>1M+</div>
                                <div style={{
                                    fontSize: '1rem',
                                    opacity: 0.8
                                }}>Journal Entries</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                }}>4.9★</div>
                                <div style={{
                                    fontSize: '1rem',
                                    opacity: 0.8
                                }}>User Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section" style={{
                padding: '6rem 0',
                backgroundColor: 'white'
            }}>
                <div className="container" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem'
                }}>
                    <div className="section-header" style={{
                        textAlign: 'center',
                        marginBottom: '4rem'
                    }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: 'var(--janya-text-primary)',
                            marginBottom: '1.5rem'
                        }}>
                            Everything You Need for Meaningful Journalling
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--janya-text-secondary)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            Powerful features designed to enhance your self-reflection and personal growth journey
                        </p>
                    </div>

                    <div className="features-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '2rem'
                    }}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card"
                                style={{
                                    padding: '2rem',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '16px',
                                    border: '1px solid #e9ecef',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.backgroundColor = '#f1f3f4';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    fontSize: '3rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: 'var(--janya-text-primary)',
                                    marginBottom: '1rem'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    fontSize: '1rem',
                                    color: 'var(--janya-text-secondary)',
                                    lineHeight: '1.6'
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" style={{
                padding: '6rem 0',
                backgroundColor: '#f8f9fa'
            }}>
                <div className="container" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem'
                }}>
                    <div className="section-header" style={{
                        textAlign: 'center',
                        marginBottom: '4rem'
                    }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: 'var(--janya-text-primary)',
                            marginBottom: '1.5rem'
                        }}>
                            Simple Steps to Transformative Insights
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--janya-text-secondary)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            Get started with Janya in just three easy steps
                        </p>
                    </div>

                    <div className="steps-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '3rem',
                        alignItems: 'start'
                    }}>
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
                            <div key={index} className="step-card" style={{
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {step.icon}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    color: 'var(--janya-accent-light)',
                                    marginBottom: '1rem',
                                    letterSpacing: '0.1em'
                                }}>
                                    STEP {step.step}
                                </div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: 'var(--janya-text-primary)',
                                    marginBottom: '1rem'
                                }}>
                                    {step.title}
                                </h3>
                                <p style={{
                                    fontSize: '1rem',
                                    color: 'var(--janya-text-secondary)',
                                    lineHeight: '1.6'
                                }}>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" style={{
                padding: '6rem 0',
                backgroundColor: 'var(--janya-text-primary)',
                color: 'white'
            }}>
                <div className="container" style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem'
                    }}>
                        Start Your Journey Today
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '3rem',
                        opacity: '0.9',
                        lineHeight: '1.6'
                    }}>
                        Join thousands of users who have discovered the power of AI-enhanced journalling for personal growth
                    </p>

                    <div className="cta-actions" style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '2rem'
                    }}>
                        <button
                            data-material="filled-button"
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                borderRadius: '12px',
                                backgroundColor: 'white',
                                color: 'var(--janya-text-primary)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Get Started Free
                        </button>
                        <button
                            data-material="text-button"
                            style={{
                                padding: '1rem 1.5rem',
                                fontSize: '1.125rem',
                                color: 'white',
                                backgroundColor: 'transparent',
                                border: 'none',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Learn more →
                        </button>
                    </div>

                    <p style={{
                        fontSize: '0.875rem',
                        opacity: '0.7'
                    }}>
                        No credit card required • Free 14-day trial • Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {/* Global Styles */}
            <style jsx global>{`
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                
                .container {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                
                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0 1rem !important;
                    }
                    
                    .nav-links {
                        flex-direction: column !important;
                        gap: 1rem !important;
                        width: 100%;
                        margin-top: 1rem;
                    }
                    
                    .hero-section {
                        padding-top: 10rem !important;
                        padding-bottom: 4rem !important;
                    }
                    
                    .container {
                        padding: 0 1rem !important;
                    }
                    
                    .hero-title {
                        font-size: 2rem !important;
                        margin-bottom: 1rem !important;
                    }
                    
                    .hero-subtitle {
                        font-size: 1.125rem !important;
                        margin-bottom: 2rem !important;
                    }
                    
                    .hero-actions {
                        flex-direction: column !important;
                        align-items: center;
                        gap: 1rem !important;
                    }
                    
                    .hero-stats {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                        padding: 1.5rem !important;
                    }
                    
                    .features-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                    
                    .feature-card {
                        padding: 1.5rem !important;
                    }
                    
                    .steps-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    
                    .section-header h2 {
                        font-size: 2rem !important;
                    }
                    
                    .cta-actions {
                        flex-direction: column !important;
                        align-items: center;
                        gap: 1rem !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .hero-title {
                        font-size: 1.75rem !important;
                    }
                    
                    .section-header h2 {
                        font-size: 1.75rem !important;
                    }
                    
                    .features-grid {
                        grid-template-columns: 1fr !important;
                    }
                    
                    .feature-card {
                        min-width: unset !important;
                    }
                }
            `}</style>
        </div>
    );
}