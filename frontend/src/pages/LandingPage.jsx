import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { FiArrowRight, FiMessageSquare, FiShield, FiGlobe, FiUsers, FiClock, FiCheckCircle, FiStar, FiBriefcase, FiAward } from 'react-icons/fi';

const LandingPage = () => {
  const features = [
    {
      icon: <FiMessageSquare />,
      title: 'AI Legal Assistant',
      description: 'Get instant answers to your legal questions with our advanced AI assistant trained on Indian law.'
    },
    {
      icon: <FiShield />,
      title: 'Verified Lawyers',
      description: 'Connect with bar-certified lawyers verified through official enrollment records.'
    },
    {
      icon: <FiGlobe />,
      title: 'Multilingual Support',
      description: 'Access legal help in Hindi, English, Marathi, Gujarati, Tamil, and more regional languages.'
    },
    {
      icon: <FiClock />,
      title: '24/7 Availability',
      description: 'Get legal guidance anytime with our AI assistant and schedule consultations at your convenience.'
    },
    {
      icon: <FiUsers />,
      title: 'Pro Bono Services',
      description: 'Access free legal aid from lawyers offering pro bono services for those in need.'
    },
    {
      icon: <FiCheckCircle />,
      title: 'Case Management',
      description: 'Track your legal cases, appointments, and communications all in one place.'
    }
  ];

  const legalDomains = [
    'Family & Matrimonial Law',
    'Property & Real Estate',
    'Criminal Defense',
    'Consumer Rights',
    'Labor & Employment',
    'Corporate & Business',
    'Taxation & GST',
    'Civil Litigation',
    'RTI & Government',
    'Cyber & IT Law',
    'Immigration',
    'Intellectual Property'
  ];

  const testimonials = [
    {
      quote: "LegalEase helped me understand my tenant rights and connected me with an excellent lawyer who resolved my dispute within weeks.",
      name: "Priya Mehta",
      role: "Citizen, Mumbai",
      rating: 5
    },
    {
      quote: "The AI assistant answered my questions in Hindi which made it so easy to understand. Finally, legal help that speaks my language!",
      name: "Ramesh Kumar",
      role: "Citizen, Lucknow",
      rating: 5
    },
    {
      quote: "As a lawyer, this platform has helped me reach clients who genuinely need help. The case management system is excellent.",
      name: "Adv. Sneha Sharma",
      role: "Lawyer, Delhi",
      rating: 5
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe Your Issue',
      description: 'Tell us about your legal situation using our simple form or chat with our AI assistant.'
    },
    {
      number: '02',
      title: 'Get AI Guidance',
      description: 'Receive instant preliminary advice and understand your legal rights and options.'
    },
    {
      number: '03',
      title: 'Find the Right Lawyer',
      description: 'Browse verified lawyers specializing in your area of need, filtered by language and location.'
    },
    {
      number: '04',
      title: 'Schedule & Connect',
      description: 'Book appointments, chat securely, and track your case progress all in one place.'
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#2A65F1"/>
            <path d="M20 9L8 14.5V25.5L20 31L32 25.5V14.5L20 9Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M8 14.5L20 20M20 31V20M32 14.5L20 20M27 12L13 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>LegalEase</span>
        </div>
        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#testimonials" className={styles.navLink}>Testimonials</a>
          <Link to="/login" className={styles.signInBtn}>Sign In</Link>
          <Link to="/select-role" className={styles.getStartedBtn}>Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.heroBadge}>
          <FiStar className={styles.badgeIcon} />
          <span>Trusted by 50,000+ Citizens Across India</span>
        </div>
        <h1 className={styles.heroTitle}>
          Accessible Legal Aid for <span className={styles.gradientText}>Every Indian Citizen</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Bridging the gap between citizens and legal professionals. Get AI-powered guidance, 
          connect with verified lawyers, and manage your legal matters — all in your own language.
        </p>
        <div className={styles.heroActions}>
          <Link to="/select-role" className={`${styles.primaryBtn} ${styles.heroBtn}`}>
            Get Started Free <FiArrowRight />
          </Link>
          <Link to="/login" className={`${styles.secondaryBtn} ${styles.heroBtn}`}>
            <FiBriefcase /> I am a Lawyer
          </Link>
        </div>
        <div className={styles.heroTrust}>
          <span>✓ No credit card required</span>
          <span>✓ Free AI consultations</span>
          <span>✓ Verified lawyers only</span>
        </div>
      </main>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>50,000+</span>
          <span className={styles.statLabel}>Citizens Helped</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>2,500+</span>
          <span className={styles.statLabel}>Verified Lawyers</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>15+</span>
          <span className={styles.statLabel}>Legal Domains</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>6+</span>
          <span className={styles.statLabel}>Languages Supported</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose LegalEase?</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to navigate the legal system with confidence
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Legal Domains Section */}
      <section className={styles.domainsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Legal Expertise Across All Domains</h2>
          <p className={styles.sectionSubtitle}>
            Our network of lawyers covers every area of Indian law
          </p>
        </div>
        <div className={styles.domainsGrid}>
          {legalDomains.map((domain, index) => (
            <div key={index} className={styles.domainTag}>
              <FiAward className={styles.domainIcon} />
              {domain}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Get legal help in four simple steps
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What People Are Saying</h2>
          <p className={styles.sectionSubtitle}>
            Real stories from citizens and lawyers using LegalEase
          </p>
        </div>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className={styles.starFilled} />
                ))}
              </div>
              <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className={styles.authorName}>{testimonial.name}</p>
                  <p className={styles.authorRole}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Get Legal Help?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of citizens who have found clarity and support through LegalEase.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/select-role" className={`${styles.primaryBtn} ${styles.ctaBtn}`}>
              Start Your Free Consultation <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#2A65F1"/>
                <path d="M20 9L8 14.5V25.5L20 31L32 25.5V14.5L20 9Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M8 14.5L20 20M20 31V20M32 14.5L20 20M27 12L13 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>LegalEase</span>
            </div>
            <p className={styles.footerTagline}>
              न्यायसेतु - Bridging Justice for All
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <Link to="/select-role">Get Started</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Legal Areas</h4>
              <span>Family Law</span>
              <span>Property Law</span>
              <span>Criminal Law</span>
            </div>
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <span>Help Center</span>
              <span>Contact Us</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 LegalEase. All rights reserved. Made with ❤️ for India.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;