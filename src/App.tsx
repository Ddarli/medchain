import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { AccessLogs } from './components/AccessLogs';
import { ProfileSetup } from './components/ProfileSetup';
import { User, MedicalRecord } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User as UserIcon, FileText, LogOut, History, Calendar } from 'lucide-react';
import {DocumentSetup} from "./components/DocumentSetup.tsx";
import { Appointments } from './components/Appointments';

const translations = {
  en: {
    appName: 'MedPortal',
    profile: 'Profile',
    records: 'Records',
    accessLogs: 'Access Logs',
    logout: 'Logout',
    personalInfo: 'Personal Information',
    documents: 'Documents',
    name: 'Name',
    email: 'Email',
    dateOfBirth: 'Date of Birth',
    bloodType: 'Blood Type',
    address: 'Address',
    uploadFile: 'Upload File',
    uploading: 'Uploading...',
    downloadRecord: 'Download Record',
    viewFullRecord: 'View Full Record',
    medicalRecords: 'Medical Records',
    appointments: 'Appointments',
    status: {
      completed: 'Completed',
      pending: 'Pending'
    }
  },
  ru: {
    appName: 'МедПортал',
    profile: 'Профиль',
    records: 'Записи',
    accessLogs: 'Журнал доступа',
    logout: 'Выход',
    personalInfo: 'Личная информация',
    documents: 'Документы',
    name: 'Имя',
    email: 'Эл. почта',
    dateOfBirth: 'Дата рождения',
    bloodType: 'Группа крови',
    address: 'Адрес',
    uploadFile: 'Загрузить файл',
    uploading: 'Загрузка...',
    downloadRecord: 'Скачать запись',
    viewFullRecord: 'Просмотреть полную запись',
    medicalRecords: 'Медицинские записи',
    appointments: 'Записи',
    status: {
      completed: 'Завершено',
      pending: 'В обработке'
    }
  }
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  }
};

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'records' | 'access-logs' | 'appointments'>('profile');
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [needsDocumentSetup, setNeedsDocumentSetup] = useState(false);
  const t = translations[language];

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(isAuthenticated, needsProfileSetup, needsDocumentSetup);
    if (isAuthenticated && !needsDocumentSetup) {
      const fetchData = async () => {
        try {
          setLoading(true);

          const accessToken = localStorage.getItem('token');

          const res = await fetch('http://localhost:8080/api/v1/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include',
          });

          const userData = await res.json();

          setUser(userData);
          console.log(user)

          const recordsRes = await fetch('http://localhost:8080/api/v1/files', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include',
          });

          const recordsData = await recordsRes.json();
          setRecords(recordsData.Files.FilesMetadata);
          console.log('Records:', records);
        } catch (err) {
          console.error('Error fetching data', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);


  const handleLogin = (value: boolean, isNewUser: boolean, needDocuments: boolean) => {
    setIsAuthenticated(value);
    setNeedsProfileSetup(isNewUser);
    setNeedsDocumentSetup(needDocuments);
  };


  const handleProfileSetup = (userData: { name: string; dateOfBirth: string; address: string }) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...userData,
      };
    });
    setNeedsProfileSetup(false);
  };

  const handleDocumentSetup = (documentData: {
    passport?: {
      series: string;
      number: string;
      issuedBy: string;
      issueDate: string;
    };
    snils?: string;
  }) => {
    setUser((prev) => {
      console.log(prev);
      if (!prev) return prev;
      return {
        ...prev,
        ...documentData,
      };
    });
    setNeedsDocumentSetup(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('profile');
    setUser(null);
  };


  const handleLanguageChange = () => {
    setLanguage(current => current === 'en' ? 'ru' : 'en');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.h1 
                className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.appName}
              </motion.h1>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'profile'
                      ? isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  {t.profile}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('records')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'records'
                      ? isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t.records}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'appointments'
                      ? isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t.appointments}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('access-logs')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'access-logs'
                      ? isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <History className="w-4 h-4 mr-2" />
                  {t.accessLogs}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isDarkMode
                      ? 'text-red-400 hover:bg-red-900/20'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.logout}
                </motion.button>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLanguageChange}
                className={`px-2 py-1 rounded ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'en' ? 'RU' : 'EN'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'text-yellow-300 hover:text-yellow-400' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="container mx-auto py-12 px-4">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
              <motion.div key="auth" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex justify-center">
                <Auth onLogin={handleLogin} isDarkMode={isDarkMode} language={language} />
              </motion.div>
          ) : needsProfileSetup ? (
              <motion.div key="profile-setup" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex justify-center">
                <ProfileSetup onComplete={handleProfileSetup} isDarkMode={isDarkMode} language={language} />
              </motion.div>
          ) : needsDocumentSetup ? (
            <motion.div key="document-setup" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="flex justify-center">
                <DocumentSetup onComplete={handleDocumentSetup} isDarkMode={isDarkMode} language={language} />
              </motion.div>
          ) : (
              <motion.div key={activeTab} variants={pageVariants} initial="initial" animate="enter" exit="exit">
                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : activeTab === 'access-logs' ? (
                    <AccessLogs isDarkMode={isDarkMode} language={language} />
                ) : activeTab === 'appointments' ? (
                    <Appointments isDarkMode={isDarkMode} language={language} />
                ) : (
                    <Dashboard
                        user={user}
                        records={records}
                        activeTab={activeTab === 'profile' ? 'profile' : 'records'}
                        isDarkMode={isDarkMode}
                        language={language}
                    />
                )}
              </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;