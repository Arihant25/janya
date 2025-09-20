'use client';

import React, { useEffect, useState } from 'react';

interface NavbarProps {
    onGetStarted?: () => void;
}

export default function Navbar({ onGetStarted }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 500);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
                setShowMobileMenu(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        handleScroll(); // Set initial state
        handleResize(); // Set initial state

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const textColor = scrolled ? 'var(--janya-text-secondary)' : 'var(--janya-neutral)';

    const toggleMobileMenu = () => {
        if (!mobileMenuOpen) {
            setShowMobileMenu(true);
            setTimeout(() => setMobileMenuOpen(true), 10);
        } else {
            setMobileMenuOpen(false);
            setTimeout(() => setShowMobileMenu(false), 300);
        }
    };

    return (
        <>
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                backdropFilter: 'blur(10px)',
                zIndex: 1002,
                padding: '1rem 0',
                color: 'var(--janya-neutral)'
            }}>
                <div className="nav-container" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: textColor,
                        transition: 'color 0.3s ease'
                    }}>
                        Janya
                    </div>

                    {/* Desktop Navigation */}
                    <div className="nav-links" style={{
                        display: isMobile ? 'none' : 'flex',
                        gap: '2rem',
                        alignItems: 'center'
                    }}>
                        <a href="#features" style={{
                            textDecoration: 'none',
                            color: textColor,
                            fontSize: '1rem',
                            transition: 'color 0.3s ease'
                        }}>Features</a>
                        <a href="#how-it-works" style={{
                            textDecoration: 'none',
                            color: textColor,
                            fontSize: '1rem',
                            transition: 'color 0.3s ease'
                        }}>How it works</a>
                        <button
                            style={{
                                backgroundColor: scrolled ? 'var(--janya-primary)' : 'var(--janya-text-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onClick={onGetStarted}
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={toggleMobileMenu}
                        style={{
                            display: isMobile ? 'flex' : 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '8px',
                        }}
                        className="mobile-menu-toggle"
                    >
                        <span style={{
                            width: '24px',
                            height: '2px',
                            backgroundColor: textColor,
                            transition: 'all 0.3s ease',
                            transform: mobileMenuOpen ? 'rotate(45deg) translate(3px, 6px)' : 'none'
                        }}></span>
                        <span style={{
                            width: '24px',
                            height: '2px',
                            backgroundColor: textColor,
                            transition: 'all 0.3s ease',
                            opacity: mobileMenuOpen ? 0 : 1
                        }}></span>
                        <span style={{
                            width: '24px',
                            height: '2px',
                            backgroundColor: textColor,
                            transition: 'all 0.3s ease',
                            transform: mobileMenuOpen ? 'rotate(-45deg) translate(3px, -6px)' : 'none'
                        }}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1001,
                    opacity: mobileMenuOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }} onClick={toggleMobileMenu}>
                    <div style={{
                        position: 'fixed',
                        top: '0',
                        right: '0',
                        height: '100vh',
                        width: '280px',
                        // backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(20px)',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.3s ease-in-out',
                        boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)'
                    }} onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginBottom: '2rem'
                        }}>
                            <button
                                onClick={toggleMobileMenu}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}
                            >
                                <span style={{
                                    width: '24px',
                                    height: '2px',
                                    backgroundColor: textColor,
                                    transition: 'all 0.3s ease',
                                    transform: 'rotate(45deg) translate(6px, 6px)'
                                }}></span>
                                <span style={{
                                    width: '24px',
                                    height: '2px',
                                    backgroundColor: textColor,
                                    transition: 'all 0.3s ease',
                                    opacity: 0
                                }}></span>
                                <span style={{
                                    width: '24px',
                                    height: '2px',
                                    backgroundColor: textColor,
                                    transition: 'all 0.3s ease',
                                    transform: 'rotate(-45deg) translate(6px, -6px)'
                                }}></span>
                            </button>
                        </div>
                        <a href="#features" style={{
                            textDecoration: 'none',
                            color: textColor,
                            fontSize: '1.1rem',
                            padding: '0.75rem 0',
                            borderBottom: `1px solid ${textColor}20`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }} onClick={toggleMobileMenu}>Features</a>
                        <a href="#how-it-works" style={{
                            textDecoration: 'none',
                            color: textColor,
                            fontSize: '1.1rem',
                            padding: '0.75rem 0',
                            borderBottom: `1px solid ${textColor}20`,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }} onClick={toggleMobileMenu}>How it works</a>
                        <button
                            style={{
                                backgroundColor: scrolled ? 'var(--janya-primary)' : 'var(--janya-text-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                marginTop: '1rem',
                                width: '100%'
                            }}
                            onClick={() => {
                                onGetStarted?.();
                                toggleMobileMenu();
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
