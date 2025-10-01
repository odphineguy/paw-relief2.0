import React, { useState } from 'react';
import Header from '../components/Header';

const UserGuides: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using Paw Relief',
      duration: '5 min read',
      difficulty: 'Beginner',
      sections: [
        {
          title: 'Welcome to Paw Relief',
          content: 'Paw Relief is designed to help you track and manage your dog\'s health. This guide will walk you through the essential features to get you started.'
        },
        {
          title: 'Setting Up Your First Dog Profile',
          content: '1. Tap the Profile tab\n2. Tap "Add Dog"\n3. Enter your dog\'s name, breed, and age\n4. Upload a photo\n5. Add any known allergies or health conditions\n6. Save the profile'
        },
        {
          title: 'Understanding the Dashboard',
          content: 'The Dashboard shows:\n• Recent symptoms logged\n• Upcoming medication reminders\n• Health insights and patterns\n• Quick access to common actions'
        }
      ]
    },
    {
      id: 'health-tracking',
      title: 'Health Tracking',
      description: 'How to log and monitor your dog\'s health',
      duration: '8 min read',
      difficulty: 'Beginner',
      sections: [
        {
          title: 'Logging Symptoms',
          content: 'To log a symptom:\n1. Tap the "+" button on the main screen\n2. Select the symptom type from the list\n3. Rate the severity (1-5 scale)\n4. Add any triggers you noticed\n5. Include notes and photos if helpful\n6. Save the log'
        },
        {
          title: 'Understanding Severity Levels',
          content: 'Use this scale to rate symptoms:\n• 1-2: Mild (slight discomfort, minimal impact)\n• 3: Moderate (noticeable but manageable)\n• 4-5: Severe (significant impact, needs attention)'
        },
        {
          title: 'Tracking Patterns',
          content: 'The app automatically tracks patterns in your dog\'s health data. Look for:\n• Seasonal allergies\n• Food sensitivities\n• Environmental triggers\n• Medication effectiveness'
        }
      ]
    },
    {
      id: 'medications',
      title: 'Medication Management',
      description: 'Setting up and managing medication reminders',
      duration: '6 min read',
      difficulty: 'Intermediate',
      sections: [
        {
          title: 'Adding Medications',
          content: 'To add a medication:\n1. Go to the Medications tab\n2. Tap "Add Reminder"\n3. Enter medication name and dosage\n4. Set the frequency and times\n5. Add any special instructions\n6. Save the reminder'
        },
        {
          title: 'Managing Reminders',
          content: 'You can:\n• Edit existing reminders\n• Mark doses as given or missed\n• Adjust timing as needed\n• Add notes about side effects\n• View medication history'
        },
        {
          title: 'Missed Doses',
          content: 'If you miss a dose:\n1. Log it in the app\n2. Check with your vet about timing\n3. Never double-dose without vet approval\n4. Note any changes in your dog\'s condition'
        }
      ]
    },
    {
      id: 'vet-reports',
      title: 'Veterinary Reports',
      description: 'Generating and sharing health reports with your vet',
      duration: '4 min read',
      difficulty: 'Beginner',
      sections: [
        {
          title: 'Creating a Vet Report',
          content: 'To generate a report:\n1. Go to Profile > Generate Vet Report\n2. Select the date range\n3. Choose what to include\n4. Review the summary\n5. Share with your veterinarian'
        },
        {
          title: 'What\'s Included',
          content: 'Reports include:\n• Symptom logs and patterns\n• Medication history\n• Weight tracking\n• Photos and notes\n• Timeline of health events'
        }
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      description: 'Using advanced features and customization',
      duration: '10 min read',
      difficulty: 'Advanced',
      sections: [
        {
          title: 'Custom Reminders',
          content: 'Create custom reminders for:\n• Vet appointments\n• Grooming sessions\n• Exercise routines\n• Special diets\n• Health check-ups'
        },
        {
          title: 'Data Export',
          content: 'Export your data:\n1. Go to Settings > Privacy & Data\n2. Tap "Export Data"\n3. Choose format (JSON, CSV, PDF)\n4. Select date range\n5. Download your data'
        },
        {
          title: 'Privacy Settings',
          content: 'Control your privacy:\n• Choose what data to share\n• Set data retention periods\n• Control analytics and tracking\n• Manage third-party sharing'
        }
      ]
    }
  ];

  const GuideCard = ({ guide }: { guide: typeof guides[0] }) => (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-2">{guide.title}</h3>
          <p className="text-subtle-light dark:text-subtle-dark mb-3">{guide.description}</p>
          <div className="flex items-center gap-4 text-sm text-subtle-light dark:text-subtle-dark">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {guide.duration}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {guide.difficulty}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSelectedGuide(selectedGuide === guide.id ? null : guide.id)}
          className="ml-4 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <svg 
            className={`w-5 h-5 transition-transform ${selectedGuide === guide.id ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {selectedGuide === guide.id && (
        <div className="border-t border-border-light dark:border-border-dark pt-4">
          <div className="space-y-4">
            {guide.sections.map((section, index) => (
              <div key={index} className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                <h4 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">{section.title}</h4>
                <p className="text-subtle-light dark:text-subtle-dark whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Learn How to Use Paw Relief</h2>
            <p className="text-subtle-light dark:text-subtle-dark mb-4">
              These guides will help you get the most out of Paw Relief. Start with "Getting Started" if you're new to the app.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Pro Tip</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Bookmark this page for quick reference. You can also access these guides anytime from the Help & Support section.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guide Cards */}
          <div className="space-y-4">
            {guides.map(guide => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>

          {/* Additional Resources */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Additional Resources</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-semibold text-foreground-light dark:text-foreground-dark">Video Tutorials</span>
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
                  <span className="font-semibold text-foreground-light dark:text-foreground-dark">FAQ</span>
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
                  <span className="font-semibold text-foreground-light dark:text-foreground-dark">Contact Support</span>
                </div>
                <svg className="w-5 h-5 text-subtle-light dark:text-subtle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuides;
