import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const FAQs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const faqData = [
    {
      id: 'getting-started',
      category: 'Getting Started',
      questions: [
        {
          id: 'how-to-add-dog',
          question: 'How do I add my dog to the app?',
          answer: 'To add your dog, go to the Profile section and tap the "Add Dog" button. You\'ll need to provide basic information like name, breed, age, and upload a photo.'
        },
        {
          id: 'first-time-setup',
          question: 'What should I do when first setting up the app?',
          answer: 'Start by adding your dog\'s profile, then set up medication reminders if needed. We recommend logging any current health conditions and uploading recent vet records.'
        },
        {
          id: 'backup-data',
          question: 'How do I backup my data?',
          answer: 'Your data is automatically backed up to our secure servers. You can also export your data manually from the Privacy & Data section in settings.'
        }
      ]
    },
    {
      id: 'health-tracking',
      category: 'Health Tracking',
      questions: [
        {
          id: 'log-symptoms',
          question: 'How do I log symptoms?',
          answer: 'Tap the "+" button on the main screen or go to the Dashboard and tap "Log Symptom". Select the symptom type, severity, and add any notes or photos.'
        },
        {
          id: 'symptom-severity',
          question: 'How do I determine symptom severity?',
          answer: 'Use the 1-5 scale: 1-2 (mild), 3 (moderate), 4-5 (severe). Consider factors like frequency, impact on daily activities, and your dog\'s comfort level.'
        },
        {
          id: 'vet-reports',
          question: 'How do I generate vet reports?',
          answer: 'Go to the Profile section and tap "Generate Vet Report". The app will compile your dog\'s health data into a comprehensive report you can share with your veterinarian.'
        }
      ]
    },
    {
      id: 'medications',
      category: 'Medications & Reminders',
      questions: [
        {
          id: 'set-reminders',
          question: 'How do I set medication reminders?',
          answer: 'Go to the Medications section and tap "Add Reminder". Enter the medication name, dosage, frequency, and time. You can set multiple reminders for different medications.'
        },
        {
          id: 'missed-dose',
          question: 'What if I miss a medication dose?',
          answer: 'Log the missed dose in the app and note the reason. The app will help you determine if you should give a late dose or wait for the next scheduled time.'
        },
        {
          id: 'medication-history',
          question: 'Can I see my dog\'s medication history?',
          answer: 'Yes, go to the Medications section to view all past and current medications, including dosage history and any changes made over time.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      category: 'Troubleshooting',
      questions: [
        {
          id: 'app-crashes',
          question: 'The app keeps crashing. What should I do?',
          answer: 'Try restarting your device and updating the app. If the problem persists, go to Settings > Help & Support > Contact Us to report the issue.'
        },
        {
          id: 'sync-issues',
          question: 'My data isn\'t syncing properly. How do I fix this?',
          answer: 'Check your internet connection and try logging out and back in. If the issue continues, go to Settings > App Preferences and toggle Auto Sync off and on again.'
        },
        {
          id: 'notifications-not-working',
          question: 'I\'m not receiving notifications. What\'s wrong?',
          answer: 'Check your device\'s notification settings for the app and ensure notifications are enabled in the app\'s Notification Settings. Also verify that your device isn\'t in Do Not Disturb mode.'
        }
      ]
    },
    {
      id: 'privacy-security',
      category: 'Privacy & Security',
      questions: [
        {
          id: 'data-privacy',
          question: 'How is my data protected?',
          answer: 'We use industry-standard encryption to protect your data. All data is stored securely and we never share your personal information without your explicit consent.'
        },
        {
          id: 'delete-account',
          question: 'How do I delete my account?',
          answer: 'Go to Settings > Privacy & Data > Privacy Settings and tap "Delete Account". This will permanently remove all your data from our servers.'
        },
        {
          id: 'data-export',
          question: 'Can I export my data?',
          answer: 'Yes, you can export all your data in JSON, CSV, or PDF format. Go to Settings > Privacy & Data > Export Data to start the export process.'
        }
      ]
    }
  ];

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Search FAQs</h2>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full px-4 py-3 pl-12 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-subtle-light dark:text-subtle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* FAQ Categories */}
          {filteredFAQs.map(category => (
            <div key={category.id} className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">{category.category}</h2>
              
              <div className="space-y-3">
                {category.questions.map(question => (
                  <div key={question.id} className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(question.id)}
                      className="w-full px-4 py-4 text-left bg-background-light dark:bg-background-dark hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark pr-4">
                          {question.question}
                        </h3>
                        <svg 
                          className={`w-5 h-5 text-subtle-light dark:text-subtle-dark transition-transform ${
                            expandedItems.has(question.id) ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {expandedItems.has(question.id) && (
                      <div className="px-4 pb-4 bg-background-light dark:bg-background-dark">
                        <p className="text-subtle-light dark:text-subtle-dark leading-relaxed">
                          {question.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
