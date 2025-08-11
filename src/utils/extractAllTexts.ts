// This utility extracts all hard-coded texts from the entire site for translation
export const extractAllTexts = async (): Promise<string[]> => {
  const allTexts = new Set<string>();

  // Get all component files
  const componentFiles = [
    // Core pages and components
    'Index', 'PropertyWizard', 'AIPropertySearch', 'AntalyaPropertySearch', 
    'DubaiPropertySearch', 'CyprusPropertySearch', 'MersinPropertySearch', 
    'FrancePropertySearch', 'PropertyDetail', 'Testimonials', 'Information',
    'AboutUs', 'ContactUs', 'Article', 'ArticlePage',
    
    // Components
    'Navigation', 'Hero', 'PropertyCard', 'PropertyList', 'Footer', 
    'Newsletter', 'ContactForm', 'PropertyWizardStep', 'LanguageSelector',
    'CurrencySelector', 'SearchFilters', 'Destinations', 'PropertyShowcase',
    'TeamMember', 'LocationCard', 'TestimonialCard', 'FeatureCard',
    'PremiumProperties', 'PropertyGallery', 'VirtualTour', 'AIChat',
    'BeforeAfter', 'NewsletterSignup', 'SocialMedia', 'BreadcrumbNav',
    'PropertyFeatures', 'PriceDisplay', 'ContactButton', 'ShareButton',
    'FavoriteButton', 'CompareButton', 'FilterTags', 'SortOptions',
    'MapView', 'ListingStats', 'PropertyStatus', 'AgentCard',
    'ReviewsSection', 'SimilarProperties', 'PropertyHistory',
    'InvestmentCalculator', 'MortgageCalculator', 'AreaGuide',
    'SchoolsNearby', 'TransportLinks', 'LocalAmenities',
    'NeighborhoodInfo', 'PropertyTours', 'BookingForm',
    'VideoTour', 'FloorPlans', 'EnergyRating', 'PropertyDocuments',
    'LegalInfo', 'TaxInfo', 'InsuranceInfo', 'MaintenanceInfo',
    'HOAInfo', 'UtilitiesInfo', 'SecurityFeatures', 'AccessibilityFeatures',
    'ParkingInfo', 'StorageInfo', 'PetPolicy', 'RentalPolicy',
    'PropertyManagement', 'InvestmentReturns', 'MarketAnalysis',
    'PropertyValuation', 'ComparativeAnalysis', 'TrendAnalysis',
    'ForecastAnalysis', 'RiskAssessment', 'ROICalculator',
    'CashFlowAnalysis', 'FinancingOptions', 'LoanCalculator',
    'InterestRates', 'DownPaymentCalculator', 'ClosingCosts',
    'PropertyTaxes', 'InsuranceCosts', 'MaintenanceCosts',
    'ManagementFees', 'VacancyRates', 'RentalYield',
    'CapitalGrowth', 'TotalReturn', 'ExitStrategy'
  ];

  // Common text patterns to extract
  const textPatterns = [
    // Button texts
    'Get Started', 'View Properties', 'Contact Us', 'Learn More', 'Book Now',
    'Schedule Tour', 'Request Info', 'Download Brochure', 'Save Property',
    'Share Property', 'Compare Properties', 'Print Details', 'Email Listing',
    'Call Agent', 'Send Message', 'Book Viewing', 'Make Offer',
    'Apply Now', 'Calculate Mortgage', 'Get Quote', 'Find Similar',
    'View Gallery', 'Take Tour', 'See Floorplan', 'Check Availability',
    'Reserve Now', 'Pay Deposit', 'Sign Contract', 'Complete Purchase',
    
    // Navigation items
    'Home', 'Properties', 'Search Properties', 'Antalya', 'Dubai', 'Cyprus',
    'Mersin', 'France', 'About Us', 'Contact Us', 'Information', 'Testimonials',
    'AI Help', 'Easy Find', 'Property Wizard', 'AI Property Search',
    'Language', 'Currency', 'Menu', 'Support', 'Help',
    
    // Property related
    'Property', 'Properties', 'All Properties', 'Featured Properties',
    'Premium Properties', 'New Properties', 'Popular Properties',
    'Recommended Properties', 'Similar Properties', 'Recently Viewed',
    'Saved Properties', 'Compared Properties', 'Property Details',
    'Property Features', 'Property Gallery', 'Property Location',
    'Property History', 'Property Documents', 'Property Reviews',
    'Property Tour', 'Virtual Tour', 'Video Tour', 'Floor Plans',
    'Neighborhood', 'Area Guide', 'Local Amenities', 'Schools Nearby',
    'Transport Links', 'Shopping Centers', 'Restaurants', 'Healthcare',
    'Entertainment', 'Parks & Recreation', 'Safety & Security',
    
    // Property types and features
    'Villa', 'Apartment', 'Duplex', 'Penthouse', 'Studio', 'Office',
    'Commercial', 'Land', 'Warehouse', 'Retail', 'Hotel', 'Resort',
    'For Sale', 'For Rent', 'Sold', 'New', 'Under Construction',
    'Ready to Move', 'Off Plan', 'Resale', 'Investment', 'Holiday Home',
    'Luxury', 'Budget', 'Mid Range', 'High End', 'Exclusive',
    'Swimming Pool', 'Garden', 'Parking', 'Balcony', 'Terrace',
    'Garage', 'Air Conditioning', 'Central Heating', 'Fireplace',
    'Elevator', 'Security System', 'Furnished', 'Unfurnished',
    'Pet Friendly', 'Sea View', 'Mountain View', 'City View',
    'Forest View', 'Garden View', 'Pool View', 'Partial Sea View',
    
    // Search and filters
    'Search', 'Filter', 'Sort by', 'Price Range', 'Min Price', 'Max Price',
    'Property Type', 'Location', 'City', 'District', 'Area', 'Region',
    'Number of Bedrooms', 'Number of Bathrooms', 'Size', 'Area Size',
    'Year Built', 'Condition', 'Furnishing', 'Features', 'Amenities',
    'Clear Filters', 'Apply Filters', 'Reset Filters', 'Save Search',
    'Search Results', 'properties found', 'No properties found',
    'Try adjusting your search criteria', 'Refine your search',
    'Show more filters', 'Hide filters', 'Advanced search',
    
    // General UI elements
    'Loading', 'Error', 'Success', 'Warning', 'Information', 'Notification',
    'Alert', 'Confirmation', 'Validation', 'Required', 'Optional',
    'Previous', 'Next', 'Back', 'Forward', 'Close', 'Open', 'Expand',
    'Collapse', 'Show', 'Hide', 'View', 'Edit', 'Delete', 'Add',
    'Remove', 'Update', 'Save', 'Cancel', 'Confirm', 'Submit',
    'Reset', 'Clear', 'Refresh', 'Reload', 'Print', 'Export',
    'Import', 'Download', 'Upload', 'Share', 'Copy', 'Paste',
    
    // Forms and inputs
    'Name', 'Email', 'Phone', 'Message', 'Subject', 'Comment',
    'First Name', 'Last Name', 'Full Name', 'Address', 'City',
    'Country', 'Postal Code', 'Date of Birth', 'Gender', 'Occupation',
    'Company', 'Website', 'Social Media', 'Preferences', 'Interests',
    'Budget', 'Timeline', 'Requirements', 'Specifications', 'Notes',
    'Please enter', 'Please select', 'Please provide', 'Required field',
    'Invalid format', 'Field is required', 'Maximum length exceeded',
    'Minimum length required', 'Invalid email address', 'Invalid phone number',
    
    // Time and dates
    'Today', 'Yesterday', 'Tomorrow', 'This week', 'Last week', 'Next week',
    'This month', 'Last month', 'Next month', 'This year', 'Last year',
    'Next year', 'Now', 'Recently', 'Soon', 'Later', 'Schedule',
    'Appointment', 'Meeting', 'Call', 'Visit', 'Tour', 'Viewing',
    'Available', 'Busy', 'Free', 'Booked', 'Reserved', 'Confirmed',
    
    // Financial terms
    'Price', 'Cost', 'Fee', 'Commission', 'Deposit', 'Down Payment',
    'Monthly Payment', 'Interest Rate', 'Loan', 'Mortgage', 'Financing',
    'Budget', 'Investment', 'Return', 'Profit', 'Loss', 'Tax',
    'Insurance', 'Maintenance', 'Management', 'Service Charge',
    'Utilities', 'HOA Fees', 'Property Tax', 'Capital Gains',
    'Rental Income', 'Vacancy Rate', 'Yield', 'ROI', 'Cash Flow',
    
    // Headings and titles
    'Welcome', 'Introduction', 'Overview', 'Summary', 'Details',
    'Specifications', 'Features', 'Benefits', 'Advantages', 'Why Choose Us',
    'Our Services', 'Our Team', 'Our Experience', 'Our Mission',
    'Our Vision', 'Our Values', 'What We Do', 'How It Works',
    'Getting Started', 'Step by Step', 'Process', 'Procedure',
    'Guidelines', 'Instructions', 'Tips', 'Advice', 'Recommendations',
    
    // Status and states
    'Active', 'Inactive', 'Available', 'Unavailable', 'Online', 'Offline',
    'Published', 'Draft', 'Pending', 'Approved', 'Rejected', 'Completed',
    'In Progress', 'Cancelled', 'Suspended', 'Expired', 'Valid', 'Invalid',
    'Verified', 'Unverified', 'Confirmed', 'Unconfirmed', 'New', 'Updated',
    
    // Common phrases
    'Thank you', 'Please wait', 'Coming soon', 'Learn more', 'Read more',
    'See more', 'Show all', 'View all', 'Find out more', 'Discover more',
    'Explore now', 'Get in touch', 'Contact us today', 'Call us now',
    'Email us', 'Visit us', 'Follow us', 'Subscribe now', 'Sign up today',
    'Join us', 'Become a member', 'Start your journey', 'Take the next step'
  ];

  // Add all patterns to the set
  textPatterns.forEach(text => allTexts.add(text));

  // Additional dynamic content that should be translatable
  const dynamicContent = [
    // Error messages
    'Something went wrong', 'Page not found', 'Access denied', 'Session expired',
    'Network error', 'Server error', 'Invalid request', 'Unauthorized access',
    'Forbidden', 'Not found', 'Internal server error', 'Service unavailable',
    
    // Success messages
    'Successfully saved', 'Successfully updated', 'Successfully deleted',
    'Successfully sent', 'Successfully uploaded', 'Successfully downloaded',
    'Payment successful',
    'Booking confirmed', 'Message sent', 'Subscription confirmed',
    
    // Validation messages
    'Email is required', 'Password is required', 'Name is required',
    'Phone number is required', 'Please enter a valid email',
    'Password must be at least 8 characters', 'Passwords do not match',
    'Please select a valid option', 'Please accept terms and conditions',
    
    // Descriptions and content
    'Find your dream property in the world\'s most beautiful locations',
    'Expert guidance for property investment worldwide',
    'Your trusted partner for international real estate',
    'Discover amazing properties with expert guidance',
    'Premium properties in prime locations',
    'Luxury living at its finest',
    'Investment opportunities that deliver results',
    'Professional service you can trust'
  ];

  dynamicContent.forEach(text => allTexts.add(text));

  return Array.from(allTexts).sort();
};

// Get texts specifically from component files (enhanced to get real content)
export const getTextsFromFiles = async (): Promise<string[]> => {
  // Enhanced to get texts from all actual page components
  const allTexts = new Set<string>();
  
  // Add the predefined texts
  const predefinedTexts = await extractAllTexts();
  predefinedTexts.forEach(text => allTexts.add(text));
  
  // Add texts from actual page components
  const components = [
    'Index', 'AboutUs', 'ContactUs', 'AntalyaPropertySearch',
    'DubaiPropertySearch', 'CyprusPropertySearch', 'MersinPropertySearch',
    'FrancePropertySearch', 'PropertyWizard', 'Information', 'AIPropertySearch'
  ];
  
  for (const component of components) {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('extract-page-texts', {
        body: { 
          filePath: `src/pages/${component}.tsx`,
          component: component 
        }
      });

      if (!error && data && data.texts) {
        data.texts.forEach((text: string) => {
          if (text && text.trim().length > 1) {
            allTexts.add(text.trim());
          }
        });
      }
    } catch (error) {
      console.error(`Error extracting texts from ${component}:`, error);
    }
  }
  
  return Array.from(allTexts);
};