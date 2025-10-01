import React, { useState } from 'react';
import Header from '../components/Header';

const TermsAndPrivacy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  const termsContent = `
    Last updated: January 1, 2024

    TERMS OF SERVICE

    1. ACCEPTANCE OF TERMS
    By accessing and using Paw Relief ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.

    2. DESCRIPTION OF SERVICE
    Paw Relief is a mobile application designed to help pet owners track and manage their dog's health information, including symptoms, medications, appointments, and veterinary records.

    3. USER ACCOUNTS
    You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.

    4. ACCEPTABLE USE
    You agree not to use the Service to:
    - Upload false, misleading, or fraudulent information
    - Violate any laws or regulations
    - Infringe on the rights of others
    - Transmit harmful or malicious code
    - Attempt to gain unauthorized access to the Service

    5. HEALTH INFORMATION DISCLAIMER
    The Service is not a substitute for professional veterinary care. Always consult with a licensed veterinarian for medical advice, diagnosis, or treatment. The information provided through the Service is for informational purposes only.

    6. PRIVACY AND DATA
    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.

    7. INTELLECTUAL PROPERTY
    The Service and its original content, features, and functionality are owned by Paw Relief and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

    8. TERMINATION
    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

    9. LIMITATION OF LIABILITY
    In no event shall Paw Relief, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.

    10. GOVERNING LAW
    These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.

    11. CHANGES TO TERMS
    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.

    12. CONTACT INFORMATION
    If you have any questions about these Terms of Service, please contact us at legal@pawrelief.com.
  `;

  const privacyContent = `
    Last updated: January 1, 2024

    PRIVACY POLICY

    1. INFORMATION WE COLLECT
    We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

    Personal Information:
    - Name and contact information
    - Pet information (name, breed, age, medical history)
    - Health data and symptom logs
    - Medication and appointment information
    - Photos and notes you upload

    Automatically Collected Information:
    - Device information and identifiers
    - Usage data and analytics
    - Crash reports and performance data
    - Location data (if enabled)

    2. HOW WE USE YOUR INFORMATION
    We use the information we collect to:
    - Provide, maintain, and improve our services
    - Send you technical notices and support messages
    - Respond to your comments and questions
    - Develop new products and services
    - Ensure the security of our services

    3. INFORMATION SHARING
    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
    - With your explicit consent
    - To comply with legal obligations
    - To protect our rights and safety
    - In connection with a business transfer

    4. DATA SECURITY
    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.

    5. DATA RETENTION
    We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time.

    6. YOUR RIGHTS
    You have the right to:
    - Access your personal information
    - Correct inaccurate information
    - Delete your account and data
    - Export your data
    - Opt out of certain communications
    - Withdraw consent for data processing

    7. COOKIES AND TRACKING
    We use cookies and similar tracking technologies to collect and use personal information about you. You can control cookie settings through your device preferences.

    8. THIRD-PARTY SERVICES
    Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.

    9. CHILDREN'S PRIVACY
    Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.

    10. INTERNATIONAL TRANSFERS
    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.

    11. CHANGES TO THIS POLICY
    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

    12. CONTACT US
    If you have any questions about this Privacy Policy, please contact us at privacy@pawrelief.com.
  `;

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-2">
            <div className="flex">
              <button
                onClick={() => setActiveTab('terms')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  activeTab === 'terms'
                    ? 'bg-primary text-white'
                    : 'text-subtle-light dark:text-subtle-dark hover:text-foreground-light dark:hover:text-foreground-dark'
                }`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-primary text-white'
                    : 'text-subtle-light dark:text-subtle-dark hover:text-foreground-light dark:hover:text-foreground-dark'
                }`}
              >
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-subtle-light dark:text-subtle-dark leading-relaxed">
                {activeTab === 'terms' ? termsContent : privacyContent}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold text-foreground-light dark:text-foreground-dark">Download PDF</span>
                </div>
                <svg className="w-5 h-5 text-subtle-light dark:text-subtle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-foreground-light dark:text-foreground-dark">Email Copy</span>
                </div>
                <svg className="w-5 h-5 text-subtle-light dark:text-subtle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-foreground-light dark:text-foreground-dark">Have Questions?</span>
                </div>
                <svg className="w-5 h-5 text-subtle-light dark:text-subtle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Contact Information</h2>
            <div className="space-y-3 text-subtle-light dark:text-subtle-dark">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>legal@pawrelief.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>privacy@pawrelief.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Pet Care Ave, Veterinary City, VC 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
