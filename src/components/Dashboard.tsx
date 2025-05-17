import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MedicalRecord, FormField } from '../types';
import { FileText, Activity, Calendar, X, Download, ExternalLink, Upload, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Toast, ToastType } from './Toast';
import { DownloadAnimation } from './DownloadAnimation';

interface DashboardProps {
  user: User;
  records: MedicalRecord[];
  activeTab: 'profile' | 'records';
  isDarkMode: boolean;
}

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface FormData {
  type: 'snils' | 'passport';
  title: string;
  fields: FormField[];
}

const formConfigs: Record<string, FormData> = {
  snils: {
    type: 'snils',
    title: 'Add SNILS Information',
    fields: [
      {
        label: 'SNILS Number',
        type: 'text',
        name: 'snilsNumber',
        placeholder: 'XXX-XXX-XXX XX',
        required: true,
        pattern: '^\\d{3}-\\d{3}-\\d{3}\\s\\d{2}$',
        validation: (value) => {
          if (!value.match(/^\d{3}-\d{3}-\d{3}\s\d{2}$/)) {
            return 'Please enter a valid SNILS number (format: XXX-XXX-XXX XX)';
          }
        }
      }
    ]
  },
  passport: {
    type: 'passport',
    title: 'Add Passport Information',
    fields: [
      {
        label: 'Series',
        type: 'text',
        name: 'series',
        placeholder: 'XXXX',
        required: true,
        pattern: '^\\d{4}$',
        validation: (value) => {
          if (!value.match(/^\d{4}$/)) {
            return 'Please enter a valid passport series (4 digits)';
          }
        }
      },
      {
        label: 'Number',
        type: 'text',
        name: 'number',
        placeholder: 'XXXXXX',
        required: true,
        pattern: '^\\d{6}$',
        validation: (value) => {
          if (!value.match(/^\d{6}$/)) {
            return 'Please enter a valid passport number (6 digits)';
          }
        }
      },
      {
        label: 'Issued By',
        type: 'text',
        name: 'issuedBy',
        required: true
      },
      {
        label: 'Issue Date',
        type: 'date',
        name: 'issueDate',
        required: true
      }
    ]
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ user, records, activeTab, isDarkMode }) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeForm, setActiveForm] = useState<FormData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false
  });

  useEffect(() => {
    if (activeForm || selectedRecord) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeForm, selectedRecord]);

  const showToast = (message: string, type: ToastType) => {
    setToast({
      message,
      type,
      visible: true
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      showToast(`File "${file.name}" uploaded successfully!`, 'success');
      setUploading(false);
    }, 1500);
  };


  const handleDownload = async (record: MedicalRecord) => {
    try {
      setDownloading(true);

      const accessToken = localStorage.getItem('token');

      const urll = `http://localhost:8080/api/v1/file/download?file_id=${record.ID}`;

      const res = await fetch(urll, {
        method: 'GET',
        headers: {
          // Убираем Content-Type для GET-запроса скачивания файлов
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Error downloading file: ${res.status} ${res.statusText}`);
      }

      // Получаем имя файла из заголовков ответа
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = `medical-record-${record.id}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          try {
            filename = decodeURIComponent(filename);
          } catch (e) {
            console.warn('Failed to decode filename from Content-Disposition');
          }
        }
      }

      // Получаем данные файла как Blob
      const blob = await res.blob();

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Имитируем клик по ссылке
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      setDownloading(false);
      showToast('Record downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      setDownloading(false);
      showToast(`Download failed: ${error.message}`, 'error');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    activeForm?.fields.forEach(field => {
      const value = formData[field.name] || '';
      if (field.required && !value) {
        errors[field.name] = `${field.label} is required`;
      } else if (field.validation) {
        const error = field.validation(value);
        if (error) {
          errors[field.name] = error;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setTimeout(() => {
      showToast(`${activeForm?.title} added successfully!`, 'success');
      setActiveForm(null);
      setFormData({});
      setFormErrors({});
    }, 1000);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const ProfileSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Personal Information Card */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
          </div>
          <div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
          </div>
          <div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth</p>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.dateOfBirth}</p>
          </div>
          <div className="md:col-span-2">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</p>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.address}</p>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SNILS Card */}
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                POLIS
              </h3>
              {user.snils ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            {user.snils ? (
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {user.snils}
              </p>
            ) : (
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  No POLIS information provided
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveForm(formConfigs.snils)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add POLIS
                </motion.button>
              </div>
            )}
          </div>

          {/* Passport Card */}
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Passport
              </h3>
              {user.passport ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            {user.passport ? (
              <div className="space-y-2">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Series: {user.passport.series}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Number: {user.passport.number}
                </p>
              </div>
            ) : (
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  No passport information provided
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveForm(formConfigs.passport)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Passport
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const RecordModal = ({ record }: { record: MedicalRecord }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setSelectedRecord(null)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-lg shadow-xl p-6 max-w-2xl w-full border relative`}
      >
        <button
          onClick={() => setSelectedRecord(null)}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <X size={20} />
        </button>

        <div className="flex items-center mb-4">
          {record.type === 'analysis' ? (
            <Activity className="text-blue-500 mr-2" size={24} />
          ) : (
            <FileText className="text-green-500 mr-2" size={24} />
          )}
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {record.FileName}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Description</p>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {record.Description}
            </p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {record.date}
            </p>
          </div>

          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                record.status === 'completed'
                  ? isDarkMode
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-green-100 text-green-800'
                  : isDarkMode
                  ? 'bg-yellow-900/30 text-yellow-400'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {record.status}
            </span>
          </div>

          {record.result && (
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Results</p>
              <div
                className={`mt-2 p-4 rounded ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}
              >
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {record.result}
                </p>
              </div>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              onClick={() => handleDownload(record)}
            >
              <Download size={18} className="mr-2" />
              Download Record
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              onClick={() => showToast('Opening full record...', 'info')}
            >
              <ExternalLink size={18} className="mr-2" />
              View Full Record
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const RecordsSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Medical Records
        </h2>
        <label className={`relative cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            <Upload size={18} className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </motion.div>
        </label>
      </div>
      <div className="space-y-4">
        {records.map((record) => (
          <motion.div
            key={record.id}
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer
              ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setSelectedRecord(record)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {record.type === 'analysis' ? (
                  <Activity className="text-blue-500 mr-2" />
                ) : (
                  <FileText className="text-green-500 mr-2" />
                )}
                <div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {record.FileName}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {record.Description}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`} size={16} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {record.date}
                </span>
                <span
                  className={`ml-4 px-2 py-1 text-xs rounded-full ${
                    record.status === 'completed'
                      ? isDarkMode
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-green-100 text-green-800'
                      : isDarkMode
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {record.status}
                </span>
              </div>
            </div>
            {record.result && (
              <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {record.result}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div>
      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? <ProfileSection key="profile" /> : <RecordsSection key="records" />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecord && <RecordModal record={selectedRecord} />}
        {downloading && <DownloadAnimation onComplete={() => setDownloading(false)} />}
        {activeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setActiveForm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-lg shadow-xl p-6 max-w-md w-full border relative`}
            >
              <button
                onClick={() => setActiveForm(null)}
                className={`absolute top-4 right-4 p-2 rounded-full ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X size={20} />
              </button>

              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeForm.title}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {activeForm.fields.map((field) => (
                  <div key={field.name}>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      pattern={field.pattern}
                      required={field.required}
                      className={`w-full px-3 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } border focus:outline-none focus:ring-2 ${
                        formErrors[field.name]
                          ? 'border-red-500 focus:ring-red-500'
                          : isDarkMode
                          ? 'focus:ring-blue-500 focus:border-blue-500'
                          : 'focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    {formErrors[field.name] && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white mt-6`}
                >
                  Save Information
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, visible: false }))}
          />
        )}
      </AnimatePresence>
    </div>
  );
};