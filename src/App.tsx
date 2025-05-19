import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { AccessLogs } from './components/AccessLogs';
import { ProfileSetup } from './components/ProfileSetup';
import { User, MedicalRecord } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  User as UserIcon, 
  FileText, 
  LogOut, 
  History, 
  Calendar,
  Menu,
  X as CloseIcon,
  Globe
} from 'lucide-react';
import { DocumentSetup } from "./components/DocumentSetup";
import { Appointments } from './components/Appointments';

// Mock data for when backend fails
const mockUser: User = {
  id: 'mock-user-id',
  name: 'John Doe',
  email: 'john@example.com',
  dateOfBirth: '1990-01-01',
  bloodType: 'A+',
  address: '123 Main St, City',
};

const mockRecords: MedicalRecord[] = [
  {
    ID: 'mock-1',
    date: '2025-03-15',
    type: 'analysis',
    FileName: 'Blood Test Results',
    Description: 'Regular blood test analysis',
    status: 'completed',
    result: 'All parameters within normal range'
  },
  {
    ID: 'mock-2',
    date: '2025-03-10',
    type: 'reference',
    FileName: 'X-Ray Report',
    Description: 'Chest X-Ray examination',
    status: 'pending'
  }
];

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'records' | 'access-logs' | 'appointments'>('profile');
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [needsDocumentSetup, setNeedsDocumentSetup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
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
          }).catch(() => null);

          let userData = mockUser;
          if (res?.ok) {
            userData = await res.json();
          }

          setUser(userData);

          const recordsRes = await fetch('http://localhost:8080/api/v1/files', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include',
          }).catch(() => null);

          let recordsData = mockRecords;
          if (recordsRes?.ok) {
            const data = await recordsRes.json();
            recordsData = data.Files.FilesMetadata;
          }

          setRecords(recordsData);
        } catch (err) {
          console.error('Error fetching data:', err);
          // Use mock data on error
          setUser(mockUser);
          setRecords(mockRecords);
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
    setUser(prev => prev ? { ...prev, ...userData } : null);
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
    setUser(prev => prev ? { ...prev, ...documentData } : null);
    setNeedsDocumentSetup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setActiveTab('profile');
    setUser(null);
  };

  const handleLanguageChange = () => {
    setLanguage(current => current === 'en' ? 'ru' : 'en');
  };

  const NavLink = ({ tab, icon: Icon, label }: { tab: typeof activeTab; icon: any; label: string }) => (
    <motion.button
      whileHover={{ x: 5 }}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
        activeTab === tab
          ? isDarkMode
            ? 'bg-gray-700 text-white'
            : 'bg-blue-50 text-blue-700'
          : isDarkMode
          ? 'text-gray-300 hover:bg-gray-700/50'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Top Navigation */}
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm fixed top-0 left-0 right-0 z-20`}>
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 rounded-lg mr-2 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {isSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {t.appName}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLanguageChange}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Globe className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? 'text-red-400 hover:bg-red-900/20'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 flex">
        {/* Sidebar */}
        {isAuthenticated && (
          <motion.aside
            initial={false}
            animate={{ width: isSidebarOpen ? 280 : 0 }}
            className={`fixed left-0 top-16 bottom-0 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg overflow-hidden z-10`}
          >
            <div className="p-4 space-y-2">
              <NavLink tab="profile" icon={UserIcon} label={t.profile} />
              <NavLink tab="records" icon={FileText} label={t.records} />
              <NavLink tab="appointments" icon={Calendar} label={t.appointments} />
              <NavLink tab="access-logs" icon={History} label={t.accessLogs} />
            </div>
          </motion.aside>
        )}

        {/* Content Area */}
        <main 
          className={`flex-1 transition-all duration-300 ${
            isAuthenticated && isSidebarOpen ? 'ml-[280px]' : 'ml-0'
          }`}
        >
          <div className="container mx-auto p-6">
            <AnimatePresence mode="wait">
              {!isAuthenticated ? (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center"
                >
                  <Auth onLogin={handleLogin} isDarkMode={isDarkMode} language={language} />
                </motion.div>
              ) : needsProfileSetup ? (
                <motion.div
                  key="profile-setup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center"
                >
                  <ProfileSetup onComplete={handleProfileSetup} isDarkMode={isDarkMode} language={language} />
                </motion.div>
              ) : needsDocumentSetup ? (
                <motion.div
                  key="document-setup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center"
                >
                  <DocumentSetup onComplete={handleDocumentSetup} isDarkMode={isDarkMode} language={language} />
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                      <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Loading...
                      </div>
                    </div>
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;