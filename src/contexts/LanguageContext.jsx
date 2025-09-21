import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation files
const translations = {
  en: {
    // Navigation
    home: 'Home',
    report: 'Report',
    map: 'Map',
    dashboard: 'Dashboard',
    leaderboard: 'Leaderboard',
    resolved: 'Resolved',
    
    // Common
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    close: 'Close',
    
    // Home Page
    openCivicIssues: 'Open Civic Issues',
    upvote: 'Upvote',
    markResolved: 'Mark Resolved',
    viewDetails: 'View Details',
    noIssues: 'No issues found',
    initializingBackend: 'Initializing backend… please wait!',
    
    // Report Page
    reportCivicIssue: 'Report a Civic Issue',
    title: 'Title',
    describeIssue: 'Describe the issue',
    uploadMedia: 'Upload Images/Videos',
    location: 'Location',
    department: 'Department',
    urgency: 'Urgency',
    analyzing: 'Analyzing...',
    uploadingMedia: 'Uploading media...',
    reportedPoints: 'Reported! +10 points',
    
    // Map Page
    issuesMap: 'Issues Map',
    searchLocation: 'Search for a location...',
    useMyLocation: 'Use my location',
    priorityLegend: 'Priority Legend',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    yourLocation: 'Your Location',
    youAreHere: 'You are here',
    selectedLocation: 'Selected Location',
    clickToChange: 'Click anywhere on the map to change',
    status: 'Status',
    
    // Dashboard
    departmentAnalytics: 'Department Analytics Dashboard',
    issuesByDepartment: 'Issues by Department',
    openIssues: 'Open Issues',
    resolutionRate: 'Resolution Rate (%)',
    avgResponseTime: 'Avg. Response Time',
    reportingTrend: 'Reporting Trend (Issues per Week)',
    issuesReported: 'Issues Reported',
    analyticsNote: 'These analytics help track reporting trends, departmental performance, and system effectiveness to drive civic engagement and accountability.',
    
    // Leaderboard
    leaderboard: 'Leaderboard',
    topCitizens: 'Top Citizens',
    topVolunteers: 'Top Volunteers',
    departmentsByIssues: 'Departments by Issues',
    points: 'Points',
    issues: 'Issues',
    
    // Issue Detail
    comments: 'Comments',
    addComment: 'Add comment',
    add: 'Add',
    noMediaUploaded: 'No media uploaded',
    aiAssistant: 'AI Assistant',
    thinking: 'Thinking...',
    
    // Categories
    general: 'General',
    roadPothole: 'Road/Pothole',
    sewageWater: 'Sewage/Water',
    garbage: 'Garbage',
    
    // Urgency
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    
    // Status
    pending: 'Pending',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    
    // Roles
    citizen: 'Citizen',
    admin: 'Admin',
    volunteer: 'Volunteer',
    
    // App Info
    appName: 'ECHO',
    tagline: 'Turning complaints into change',
    byTeamREACTronauts: 'by team REACTronauts',
    changeLanguage: 'Change Language'
  },
  
  hi: {
    // Navigation
    home: 'होम',
    report: 'रिपोर्ट',
    map: 'नक्शा',
    dashboard: 'डैशबोर्ड',
    leaderboard: 'लीडरबोर्ड',
    resolved: 'हल',
    
    // Common
    loading: 'लोड हो रहा है...',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    view: 'देखें',
    search: 'खोजें',
    filter: 'फिल्टर',
    sort: 'सॉर्ट',
    close: 'बंद करें',
    
    // Home Page
    openCivicIssues: 'खुले नागरिक मुद्दे',
    upvote: 'अपवोट',
    markResolved: 'हल के रूप में चिह्नित करें',
    viewDetails: 'विवरण देखें',
    noIssues: 'कोई मुद्दे नहीं मिले',
    initializingBackend: 'बैकएंड शुरू हो रहा है… कृपया प्रतीक्षा करें!',
    
    // Report Page
    reportCivicIssue: 'नागरिक मुद्दे की रिपोर्ट करें',
    title: 'शीर्षक',
    describeIssue: 'मुद्दे का वर्णन करें',
    uploadMedia: 'छवियां/वीडियो अपलोड करें',
    location: 'स्थान',
    department: 'विभाग',
    urgency: 'तात्कालिकता',
    analyzing: 'विश्लेषण कर रहे हैं...',
    uploadingMedia: 'मीडिया अपलोड हो रहा है...',
    reportedPoints: 'रिपोर्ट किया गया! +10 अंक',
    
    // Map Page
    issuesMap: 'मुद्दों का नक्शा',
    searchLocation: 'स्थान खोजें...',
    useMyLocation: 'मेरा स्थान उपयोग करें',
    priorityLegend: 'प्राथमिकता किंवदंती',
    highPriority: 'उच्च प्राथमिकता',
    mediumPriority: 'मध्यम प्राथमिकता',
    lowPriority: 'कम प्राथमिकता',
    yourLocation: 'आपका स्थान',
    youAreHere: 'आप यहाँ हैं',
    selectedLocation: 'चयनित स्थान',
    clickToChange: 'बदलने के लिए नक्शे पर कहीं भी क्लिक करें',
    status: 'स्थिति',
    
    // Dashboard
    departmentAnalytics: 'विभाग विश्लेषण डैशबोर्ड',
    issuesByDepartment: 'विभाग के अनुसार मुद्दे',
    openIssues: 'खुले मुद्दे',
    resolutionRate: 'समाधान दर (%)',
    avgResponseTime: 'औसत प्रतिक्रिया समय',
    reportingTrend: 'रिपोर्टिंग प्रवृत्ति (प्रति सप्ताह मुद्दे)',
    issuesReported: 'रिपोर्ट किए गए मुद्दे',
    analyticsNote: 'ये विश्लेषण नागरिक भागीदारी और जवाबदेही को बढ़ावा देने के लिए रिपोर्टिंग प्रवृत्तियों, विभागीय प्रदर्शन और सिस्टम प्रभावशीलता को ट्रैक करने में मदद करते हैं।',
    
    // Leaderboard
    leaderboard: 'लीडरबोर्ड',
    topCitizens: 'शीर्ष नागरिक',
    topVolunteers: 'शीर्ष स्वयंसेवक',
    departmentsByIssues: 'मुद्दों के अनुसार विभाग',
    points: 'अंक',
    issues: 'मुद्दे',
    
    // Issue Detail
    comments: 'टिप्पणियां',
    addComment: 'टिप्पणी जोड़ें',
    add: 'जोड़ें',
    noMediaUploaded: 'कोई मीडिया अपलोड नहीं किया गया',
    aiAssistant: 'AI सहायक',
    thinking: 'सोच रहे हैं...',
    
    // Categories
    general: 'सामान्य',
    roadPothole: 'सड़क/गड्ढे',
    sewageWater: 'सीवेज/पानी',
    garbage: 'कचरा',
    
    // Urgency
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    
    // Status
    pending: 'लंबित',
    inProgress: 'प्रगति में',
    resolved: 'हल',
    
    // Roles
    citizen: 'नागरिक',
    admin: 'प्रशासक',
    volunteer: 'स्वयंसेवक',
    
    // App Info
    appName: 'इको',
    tagline: 'शिकायतों को बदलाव में बदलना',
    byTeamREACTronauts: 'टीम REACTronauts द्वारा',
    changeLanguage: 'भाषा बदलें'
  },
  
  mr: {
    // Navigation
    home: 'मुख्यपृष्ठ',
    report: 'अहवाल',
    map: 'नकाशा',
    dashboard: 'डॅशबोर्ड',
    leaderboard: 'लीडरबोर्ड',
    resolved: 'सोडवले',
    
    // Common
    loading: 'लोड होत आहे...',
    submit: 'सबमिट करा',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    edit: 'संपादित करा',
    delete: 'हटवा',
    view: 'पहा',
    search: 'शोधा',
    filter: 'फिल्टर',
    sort: 'सॉर्ट',
    close: 'बंद करा',
    
    // Home Page
    openCivicIssues: 'खुले नागरिक मुद्दे',
    upvote: 'अपवोट',
    markResolved: 'सोडवले म्हणून चिन्हांकित करा',
    viewDetails: 'तपशील पहा',
    noIssues: 'कोणतेही मुद्दे सापडले नाहीत',
    initializingBackend: 'बॅकएंड सुरू होत आहे… कृपया प्रतीक्षा करा!',
    
    // Report Page
    reportCivicIssue: 'नागरिक मुद्द्याचा अहवाल द्या',
    title: 'शीर्षक',
    describeIssue: 'मुद्द्याचे वर्णन करा',
    uploadMedia: 'छवी/व्हिडिओ अपलोड करा',
    location: 'स्थान',
    department: 'विभाग',
    urgency: 'तातडी',
    analyzing: 'विश्लेषण करत आहे...',
    uploadingMedia: 'मीडिया अपलोड होत आहे...',
    reportedPoints: 'अहवाल दिला! +10 गुण',
    
    // Map Page
    issuesMap: 'मुद्द्यांचा नकाशा',
    searchLocation: 'स्थान शोधा...',
    useMyLocation: 'माझे स्थान वापरा',
    priorityLegend: 'प्राधान्य किंवदंती',
    highPriority: 'उच्च प्राधान्य',
    mediumPriority: 'मध्यम प्राधान्य',
    lowPriority: 'कमी प्राधान्य',
    yourLocation: 'तुमचे स्थान',
    youAreHere: 'तुम्ही येथे आहात',
    selectedLocation: 'निवडलेले स्थान',
    clickToChange: 'बदलण्यासाठी नकाशावर कुठेही क्लिक करा',
    status: 'स्थिती',
    
    // Dashboard
    departmentAnalytics: 'विभाग विश्लेषण डॅशबोर्ड',
    issuesByDepartment: 'विभागानुसार मुद्दे',
    openIssues: 'खुले मुद्दे',
    resolutionRate: 'निराकरण दर (%)',
    avgResponseTime: 'सरासरी प्रतिसाद वेळ',
    reportingTrend: 'अहवाल देण्याची प्रवृत्ती (दर आठवड्याला मुद्दे)',
    issuesReported: 'अहवाल दिलेले मुद्दे',
    analyticsNote: 'हे विश्लेषण नागरिक सहभाग आणि जबाबदारी वाढविण्यासाठी अहवाल देण्याच्या प्रवृत्ती, विभागीय कामगिरी आणि सिस्टम प्रभावीता ट्रॅक करण्यात मदत करते.',
    
    // Leaderboard
    leaderboard: 'लीडरबोर्ड',
    topCitizens: 'शीर्ष नागरिक',
    topVolunteers: 'शीर्ष स्वयंसेवक',
    departmentsByIssues: 'मुद्द्यांनुसार विभाग',
    points: 'गुण',
    issues: 'मुद्दे',
    
    // Issue Detail
    comments: 'टिप्पण्या',
    addComment: 'टिप्पणी जोडा',
    add: 'जोडा',
    noMediaUploaded: 'कोणतेही मीडिया अपलोड केले नाही',
    aiAssistant: 'AI सहाय्यक',
    thinking: 'विचार करत आहे...',
    
    // Categories
    general: 'सामान्य',
    roadPothole: 'रस्ता/खड्डा',
    sewageWater: 'सीवेज/पाणी',
    garbage: 'कचरा',
    
    // Urgency
    low: 'कमी',
    medium: 'मध्यम',
    high: 'उच्च',
    
    // Status
    pending: 'प्रलंबित',
    inProgress: 'प्रगतीत',
    resolved: 'सोडवले',
    
    // Roles
    citizen: 'नागरिक',
    admin: 'प्रशासक',
    volunteer: 'स्वयंसेवक',
    
    // App Info
    appName: 'इको',
    tagline: 'तक्रारींना बदलात रूपांतरित करणे',
    byTeamREACTronauts: 'टीम REACTronauts द्वारा',
    changeLanguage: 'भाषा बदला'
  },
  
  sat: {
    // Navigation (Santhali - using Devanagari script)
    home: 'घर',
    report: 'रिपोर्ट',
    map: 'नक्शा',
    dashboard: 'डैशबोर्ड',
    leaderboard: 'लीडरबोर्ड',
    resolved: 'हल',
    
    // Common
    loading: 'लोड हो रहा है...',
    submit: 'भेजें',
    cancel: 'रद्द',
    save: 'बचाएं',
    edit: 'संपादित',
    delete: 'मिटाएं',
    view: 'देखें',
    search: 'खोजें',
    filter: 'फिल्टर',
    sort: 'सॉर्ट',
    close: 'बंद',
    
    // Home Page
    openCivicIssues: 'खुले नागरिक मुद्दे',
    upvote: 'अपवोट',
    markResolved: 'हल मानें',
    viewDetails: 'विवरण देखें',
    noIssues: 'कोई मुद्दे नहीं',
    initializingBackend: 'बैकएंड शुरू... कृपया रुकें!',
    
    // Report Page
    reportCivicIssue: 'नागरिक मुद्दे की रिपोर्ट',
    title: 'शीर्षक',
    describeIssue: 'मुद्दे का वर्णन',
    uploadMedia: 'छवि/वीडियो अपलोड',
    location: 'स्थान',
    department: 'विभाग',
    urgency: 'तात्कालिकता',
    analyzing: 'विश्लेषण...',
    uploadingMedia: 'मीडिया अपलोड...',
    reportedPoints: 'रिपोर्ट किया! +10 अंक',
    
    // Map Page
    issuesMap: 'मुद्दों का नक्शा',
    searchLocation: 'स्थान खोजें...',
    useMyLocation: 'मेरा स्थान',
    priorityLegend: 'प्राथमिकता किंवदंती',
    highPriority: 'उच्च प्राथमिकता',
    mediumPriority: 'मध्यम प्राथमिकता',
    lowPriority: 'कम प्राथमिकता',
    yourLocation: 'आपका स्थान',
    youAreHere: 'आप यहाँ हैं',
    selectedLocation: 'चयनित स्थान',
    clickToChange: 'बदलने के लिए नक्शे पर क्लिक करें',
    status: 'स्थिति',
    
    // Dashboard
    departmentAnalytics: 'विभाग विश्लेषण डैशबोर्ड',
    issuesByDepartment: 'विभाग के अनुसार मुद्दे',
    openIssues: 'खुले मुद्दे',
    resolutionRate: 'समाधान दर (%)',
    avgResponseTime: 'औसत प्रतिक्रिया समय',
    reportingTrend: 'रिपोर्टिंग प्रवृत्ति (प्रति सप्ताह मुद्दे)',
    issuesReported: 'रिपोर्ट किए गए मुद्दे',
    analyticsNote: 'ये विश्लेषण नागरिक भागीदारी और जवाबदेही को बढ़ावा देने के लिए रिपोर्टिंग प्रवृत्तियों, विभागीय प्रदर्शन और सिस्टम प्रभावशीलता को ट्रैक करने में मदद करते हैं।',
    
    // Leaderboard
    leaderboard: 'लीडरबोर्ड',
    topCitizens: 'शीर्ष नागरिक',
    topVolunteers: 'शीर्ष स्वयंसेवक',
    departmentsByIssues: 'मुद्दों के अनुसार विभाग',
    points: 'अंक',
    issues: 'मुद्दे',
    
    // Issue Detail
    comments: 'टिप्पणियां',
    addComment: 'टिप्पणी जोड़ें',
    add: 'जोड़ें',
    noMediaUploaded: 'कोई मीडिया अपलोड नहीं',
    aiAssistant: 'AI सहायक',
    thinking: 'सोच रहे हैं...',
    
    // Categories
    general: 'सामान्य',
    roadPothole: 'सड़क/गड्ढे',
    sewageWater: 'सीवेज/पानी',
    garbage: 'कचरा',
    
    // Urgency
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    
    // Status
    pending: 'लंबित',
    inProgress: 'प्रगति में',
    resolved: 'हल',
    
    // Roles
    citizen: 'नागरिक',
    admin: 'प्रशासक',
    volunteer: 'स्वयंसेवक',
    
    // App Info
    appName: 'इको',
    tagline: 'शिकायतों को बदलाव में बदलना',
    byTeamREACTronauts: 'टीम REACTronauts द्वारा',
    changeLanguage: 'भाषा बदलें'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    t,
    changeLanguage,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
      { code: 'sat', name: 'संथाली', flag: '🇮🇳' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
