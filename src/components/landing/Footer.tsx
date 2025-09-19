// TODO: Verify content

const socialLinks = [
    { href: "https://twitter.com/", icon: "M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37c-.83.5-1.75.87-2.72 1.07A4.28 4.28 0 0 0 16 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.1.99C7.69 9.13 4.07 7.2 1.64 4.16c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.11 2.94 3.97 2.97A8.6 8.6 0 0 1 2 19.54c-.65 0-1.28-.04-1.9-.11A12.13 12.13 0 0 0 7.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z" },
    { href: "https://facebook.com/", icon: "M18 2h-3a6 6 0 0 0-6 6v3H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2.22a1 1 0 0 0 1-1l.01-3a1 1 0 0 0-1-1H15V8a2 2 0 0 1 2-2h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" },
    { href: "https://instagram.com/", icon: "M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm6.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" },
];

const Footer: React.FC = () => (
    <footer
        className="footer"
        style={{
            backgroundColor: "var(--janya-text-primary)",
            color: "white",
            padding: "var(--space-4xl) 0 var(--space-2xl)",
            position: "relative",
        }}
    >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-lg)" }}>
            {/* Main Footer Content */}
            <div className="footer-main" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "var(--space-xl)",
                marginBottom: "var(--space-3xl)",
                alignItems: "start"
            }}>
                {/* Brand Section */}
                <div className="footer-brand">
                    <h3
                        style={{
                            fontSize: "var(--font-size-3xl)",
                            fontWeight: "var(--font-weight-bold)",
                            color: "#fff",
                            marginBottom: "var(--space-md)",
                            letterSpacing: "0.02em",
                        }}
                    >
                        Janya
                    </h3>
                    <p
                        style={{
                            fontSize: "var(--font-size-base)",
                            color: "rgba(255, 255, 255, 0.8)",
                            marginBottom: "var(--space-xl)",
                            lineHeight: 1.6,
                            maxWidth: "100%",
                        }}
                    >
                        AI-powered journalling for personal growth and self-discovery
                    </p>

                    {/* Social Links */}
                    <div style={{
                        display: "flex",
                        gap: "var(--space-sm)",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexWrap: "wrap"
                    }}>
                        <span style={{
                            fontSize: "var(--font-size-sm)",
                            color: "rgba(255, 255, 255, 0.6)",
                            marginRight: "var(--space-sm)"
                        }}>
                            Follow us:
                        </span>
                        {socialLinks.map((s, i) => (
                            <a
                                key={i}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 40,
                                    height: 40,
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    color: "#fff",
                                    transition: "all 0.2s ease",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                                }}
                                aria-label="Social link"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d={s.icon} fill="currentColor" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Product Links */}
                <div className="link-group">
                    <h4
                        style={{
                            fontSize: "var(--font-size-lg)",
                            fontWeight: "var(--font-weight-semibold)",
                            marginBottom: "var(--space-lg)",
                            color: "#fff",
                            letterSpacing: "0.01em",
                        }}
                    >
                        Product
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                        {["Features", "Pricing", "Demo", "Updates"].map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    textDecoration: "none",
                                    fontSize: "var(--font-size-base)",
                                    transition: "color 0.2s ease",
                                    lineHeight: 1.5,
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                                }}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Company Links */}
                <div className="link-group">
                    <h4
                        style={{
                            fontSize: "var(--font-size-lg)",
                            fontWeight: "var(--font-weight-semibold)",
                            marginBottom: "var(--space-lg)",
                            color: "#fff",
                            letterSpacing: "0.01em",
                        }}
                    >
                        Company
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                        {["About", "Blog", "Careers", "Contact"].map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    textDecoration: "none",
                                    fontSize: "var(--font-size-base)",
                                    transition: "color 0.2s ease",
                                    lineHeight: 1.5,
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                                }}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Support Links */}
                <div className="link-group">
                    <h4
                        style={{
                            fontSize: "var(--font-size-lg)",
                            fontWeight: "var(--font-weight-semibold)",
                            marginBottom: "var(--space-lg)",
                            color: "#fff",
                            letterSpacing: "0.01em",
                        }}
                    >
                        Support
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                        {["Help Center", "Privacy Policy", "Terms of Service", "Security"].map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    textDecoration: "none",
                                    fontSize: "var(--font-size-base)",
                                    transition: "color 0.2s ease",
                                    lineHeight: 1.5,
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                                }}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div
                className="footer-bottom"
                style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                    paddingTop: "var(--space-xl)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "var(--space-md)",
                }}
            >
                <p
                    style={{
                        fontSize: "var(--font-size-sm)",
                        color: "rgba(255, 255, 255, 0.6)",
                        margin: 0,
                    }}
                >
                    © 2025 Janya. All rights reserved.
                </p>

                <div style={{
                    display: "flex",
                    gap: "var(--space-xl)",
                    alignItems: "center",
                    fontSize: "var(--font-size-sm)"
                }}>
                    <a
                        href="#status"
                        style={{
                            color: "rgba(255, 255, 255, 0.6)",
                            textDecoration: "none",
                            transition: "color 0.2s ease"
                        }}
                        onMouseOver={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)"}
                        onMouseOut={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"}
                    >
                        System Status
                    </a>
                    <a
                        href="#sitemap"
                        style={{
                            color: "rgba(255, 255, 255, 0.6)",
                            textDecoration: "none",
                            transition: "color 0.2s ease"
                        }}
                        onMouseOver={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)"}
                        onMouseOut={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"}
                    >
                        Sitemap
                    </a>
                </div>
            </div>
        </div>

        {/* Responsive Styles */}
        <style jsx>{`
            @media (max-width: 480px) {
                .footer {
                    padding: var(--space-2xl) 0 var(--space-xl) !important;
                }
                
                .container {
                    padding: 0 var(--space-md) !important;
                }
                
                .footer-main {
                    grid-template-columns: 1fr !important;
                    gap: var(--space-lg) !important;
                    text-align: left !important;
                }
                
                .footer-brand {
                    margin-bottom: var(--space-md);
                    text-align: center;
                }
                
                .footer-brand h3 {
                    font-size: var(--font-size-2xl) !important;
                    margin-bottom: var(--space-sm) !important;
                }
                
                .footer-brand p {
                    font-size: var(--font-size-sm) !important;
                    margin-bottom: var(--space-md) !important;
                    text-align: center;
                }
                
                .footer-brand > div {
                    justify-content: center !important;
                    margin-bottom: var(--space-lg);
                }
                
                .footer-brand > div span {
                    display: none !important;
                }
                
                .link-group {
                    text-align: center;
                    padding: var(--space-md) 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                
                .link-group:last-child {
                    border-bottom: none;
                }
                
                .link-group h4 {
                    font-size: var(--font-size-base) !important;
                    margin-bottom: var(--space-sm) !important;
                }
                
                .link-group > div {
                    gap: var(--space-sm) !important;
                }
                
                .link-group a {
                    font-size: var(--font-size-sm) !important;
                    padding: var(--space-xs) 0;
                }
                
                .footer-bottom {
                    flex-direction: column !important;
                    text-align: center !important;
                    gap: var(--space-md) !important;
                    padding-top: var(--space-md) !important;
                }
                
                .footer-bottom p {
                    order: 2;
                }
                
                .footer-bottom > div {
                    order: 1;
                    gap: var(--space-md) !important;
                }
            }
            
            @media (max-width: 768px) and (min-width: 481px) {
                .footer-main {
                    grid-template-columns: 1fr 1fr !important;
                    gap: var(--space-lg) !important;
                }
                
                .footer-brand {
                    grid-column: 1 / -1;
                    text-align: center;
                    margin-bottom: var(--space-lg);
                }
                
                .link-group {
                    text-align: center;
                }
                
                .footer-bottom {
                    flex-direction: column !important;
                    text-align: center;
                    gap: var(--space-lg) !important;
                }
            }
            
            @media (max-width: 1024px) and (min-width: 769px) {
                .footer-main {
                    grid-template-columns: 2fr 1fr 1fr !important;
                    gap: var(--space-xl) !important;
                }
            }
        `}</style>
    </footer>
);

export default Footer;