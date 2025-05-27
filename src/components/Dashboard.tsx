import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Download, Eye, Calendar, Clock, FileCheck2, AlertCircle } from 'lucide-react';
import { User as UserType, MedicalRecord } from '../types';
import { DownloadAnimation } from './DownloadAnimation';

interface DashboardProps {
  user: UserType | null;
  records: MedicalRecord[];
  activeTab: 'profile' | 'records';
  isDarkMode: boolean;
  language: 'en' | 'ru';
}

const translations = {
  en: {
    personalInfo: 'Personal Information',
    medicalRecords: 'Medical Records',
    name: 'Name',
    email: 'Email',
    dateOfBirth: 'Date of Birth',
    bloodType: 'Blood Type',
    address: 'Address',
    noRecords: 'No medical records found',
    viewDetails: 'View Details',
    downloadRecord: 'Download',
    status: {
      completed: 'Completed',
      pending: 'Pending'
    }
  },
  ru: {
    personalInfo: 'Личная информация',
    medicalRecords: 'Медицинские записи',
    name: 'Имя',
    email: 'Эл. почта',
    dateOfBirth: 'Дата рождения',
    bloodType: 'Группа крови',
    address: 'Адрес',
    noRecords: 'Медицинские записи не найдены',
    viewDetails: 'Просмотр',
    downloadRecord: 'Скачать',
    status: {
      completed: 'Завершено',
      pending: 'В обработке'
    }
  }
};

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  records,
  activeTab,
  isDarkMode,
  language
}) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showDownloadAnimation, setShowDownloadAnimation] = useState(false);
  const t = translations[language];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const handleDownload = async (record: MedicalRecord) => {
    setShowDownloadAnimation(true);
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Here you would typically handle the actual file download
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setShowDownloadAnimation(false);
    }
  };

  return (
    <div className="space-y-6">
      {activeTab === 'profile' && user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.personalInfo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.name}
              </label>
              <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.email}
              </label>
              <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.dateOfBirth}
              </label>
              <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatDate(user.dateOfBirth)}
              </p>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.bloodType}
              </label>
              <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.bloodType}</p>
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.address}
              </label>
              <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.address}</p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'records' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.medicalRecords}
          </h2>
          
          {records.length === 0 ? (
            <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.noRecords}
            </p>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <motion.div
                  key={record.ID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                  } rounded-lg p-6 transition-colors duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <FileCheck2 className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {record.FileName}
                        </h3>
                      </div>
                      <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {record.Description}
                      </p>
                      <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center">
                          <Calendar className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatDate(record.date)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${
                            record.status === 'completed' 
                              ? isDarkMode ? 'text-green-400' : 'text-green-600'
                              : isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                          }`}>
                            {t.status[record.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(record)}
                        className={`p-2 rounded-full ${
                          isDarkMode
                            ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                            : 'bg-green-100 hover:bg-green-200 text-green-600'
                        } transition-colors duration-200`}
                        title={t.downloadRecord}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRecord(record)}
                        className={`p-2 rounded-full ${
                          isDarkMode
                            ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                        } transition-colors duration-200`}
                        title={t.viewDetails}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRecord(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-xl p-6 max-w-lg w-full`}
          >
            <div className="flex items-center mb-4">
              <FileCheck2 className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRecord.FileName}
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Description
                </label>
                <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedRecord.Description}
                </p>
              </div>
              {selectedRecord.result && (
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Result
                  </label>
                  <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecord.result}
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Date
                  </label>
                  <div className="flex items-center mt-1">
                    <Calendar className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(selectedRecord.date)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Status
                  </label>
                  <div className="flex items-center mt-1">
                    {selectedRecord.status === 'completed' ? (
                      <FileCheck2 className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                    ) : (
                      <AlertCircle className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    )}
                    <p className={`${
                      selectedRecord.status === 'completed'
                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                        : isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      {t.status[selectedRecord.status]}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(selectedRecord)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                      : 'bg-green-100 hover:bg-green-200 text-green-600'
                  } transition-colors duration-200 flex items-center`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {t.downloadRecord}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Download Animation */}
      {showDownloadAnimation && (
        <DownloadAnimation onComplete={() => setShowDownloadAnimation(false)} />
      )}
    </div>
  );
};

export default Dashboard;