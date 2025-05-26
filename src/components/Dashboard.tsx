import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, FileText, Download, Eye, Lock, Unlock, AlertCircle } from 'lucide-react';
import { User as UserType, MedicalRecord } from '../types';

interface DashboardProps {
  user: UserType | null;
  records: MedicalRecord[];
  activeTab: 'profile' | 'records';
  isDarkMode: boolean;
  language: 'en' | 'ru';
}

const translations = {
  en: {
    profile: {
      title: 'Personal Information',
      name: 'Full Name',
      email: 'Email',
      dateOfBirth: 'Date of Birth',
      bloodType: 'Blood Type',
      address: 'Address'
    },
    records: {
      title: 'Medical Records',
      date: 'Date',
      type: 'Type',
      description: 'Description',
      status: 'Status',
      actions: 'Actions',
      noRecords: 'No medical records found',
      download: 'Download',
      view: 'View',
      makePrivate: 'Make Private',
      makePublic: 'Make Public',
      types: {
        analysis: 'Analysis',
        reference: 'Reference'
      },
      statuses: {
        pending: 'Pending',
        completed: 'Completed'
      }
    }
  },
  ru: {
    profile: {
      title: 'Личная информация',
      name: 'ФИО',
      email: 'Эл. почта',
      dateOfBirth: 'Дата рождения',
      bloodType: 'Группа крови',
      address: 'Адрес'
    },
    records: {
      title: 'Медицинские записи',
      date: 'Дата',
      type: 'Тип',
      description: 'Описание',
      status: 'Статус',
      actions: 'Действия',
      noRecords: 'Медицинские записи не найдены',
      download: 'Скачать',
      view: 'Просмотр',
      makePrivate: 'Сделать приватным',
      makePublic: 'Сделать публичным',
      types: {
        analysis: 'Анализ',
        reference: 'Справка'
      },
      statuses: {
        pending: 'В обработке',
        completed: 'Завершено'
      }
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
  const [localRecords, setLocalRecords] = useState<MedicalRecord[]>(records);
  const t = translations[language];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const togglePrivacy = async (recordId: string) => {
    try {
      // In a real application, this would be an API call
      setLocalRecords(prevRecords =>
        prevRecords.map(record =>
          record.ID === recordId
            ? { ...record, isPrivate: !record.isPrivate }
            : record
        )
      );

      // Simulated API call
      // await fetch(`/api/records/${recordId}/privacy`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ isPrivate: !record.isPrivate })
      // });
    } catch (error) {
      console.error('Error toggling privacy:', error);
      // Revert changes on error
      setLocalRecords(records);
    }
  };

  const ProfileSection = () => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {t.profile.title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.profile.name}
          </label>
          <p className={`mt-1 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user?.name}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.profile.email}
          </label>
          <p className={`mt-1 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user?.email}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.profile.dateOfBirth}
          </label>
          <p className={`mt-1 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatDate(user?.dateOfBirth || '')}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.profile.bloodType}
          </label>
          <p className={`mt-1 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user?.bloodType}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.profile.address}
          </label>
          <p className={`mt-1 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user?.address}
          </p>
        </div>
      </div>
    </div>
  );

  const RecordsSection = () => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {t.records.title}
      </h2>

      {localRecords.length === 0 ? (
        <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.records.noRecords}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                <th className="text-left py-3 px-4">{t.records.date}</th>
                <th className="text-left py-3 px-4">{t.records.description}</th>
                <th className="text-left py-3 px-4">{t.records.actions}</th>
              </tr>
            </thead>
            <tbody>
              {localRecords.map((record) => (
                <motion.tr
                  key={record.ID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {formatDate(record.date)}
                  </td>
                  <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    <div>
                      <p className="font-medium">{record.FileName}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {record.Description}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 rounded-lg ${
                              isDarkMode
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-100'
                            }`}
                            title={t.records.download}
                          >
                            <Download className="w-5 h-5 text-blue-500" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedRecord(record)}
                            className={`p-2 rounded-lg ${
                              isDarkMode
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-100'
                            }`}
                            title={t.records.view}
                          >
                            <Eye className="w-5 h-5 text-green-500" />
                          </motion.button>
                        </>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => togglePrivacy(record.ID)}
                        className={`p-2 rounded-lg ${
                          isDarkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        }`}
                        title={record.isPrivate ? t.records.makePublic : t.records.makePrivate}
                      >
                        {record.isPrivate ? (
                          <Lock className="w-5 h-5 text-red-500" />
                        ) : (
                          <Unlock className="w-5 h-5 text-gray-500" />
                        )}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRecord(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-xl p-6 max-w-2xl w-full`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRecord.FileName}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t.records.description}
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

              <div className="flex justify-end space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRecord(null)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {activeTab === 'profile' ? <ProfileSection /> : <RecordsSection />}
    </div>
  );
};

export default Dashboard;