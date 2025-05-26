import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, FileText } from 'lucide-react';

interface DocumentSetupProps {
  onComplete: (documentData: {
    passport?: {
      series: string;
      number: string;
      issuedBy: string;
      issueDate: string;
    };
    snils?: string;
  }) => void;
  isDarkMode: boolean;
  language: 'en' | 'ru';
}

const translations = {
  en: {
    title: 'Document Information',
    subtitle: 'Please provide your document details to continue',
    passport: {
      title: 'Passport Information',
      series: 'Series',
      number: 'Number',
      issuedBy: 'Issued By',
      issueDate: 'Issue Date'
    },
    snils: {
      title: 'SNILS Information',
      number: 'SNILS Number'
    },
    insurance: {
      title: 'Insurance Information',
      number: 'Insurance Number'
    },
    continue: 'Continue',
    skip: 'Skip for now',
    required: 'This field is required',
    invalidPassportSeries: 'Please enter a valid passport series (4 digits)',
    invalidPassportNumber: 'Please enter a valid passport number (6 digits)',
    invalidSnils: 'Please enter a valid SNILS number (XXX-XXX-XXX XX)',
    seriesPlaceholder: 'XXXX',
    numberPlaceholder: 'XXXXXX',
    snilsPlaceholder: 'XXX-XXX-XXX XX'
  },
  ru: {
    title: 'Информация о документах',
    subtitle: 'Пожалуйста, предоставьте данные ваших документов для продолжения',
    passport: {
      title: 'Информация о паспорте',
      series: 'Серия',
      number: 'Номер',
      issuedBy: 'Кем выдан',
      issueDate: 'Дата выдачи'
    },
    snils: {
      title: 'Информация о СНИЛС',
      number: 'Номер СНИЛС'
    },
    insurance: {
      title: 'Информация о страховке',
      number: 'Номер страховки'
    },
    continue: 'Продолжить',
    skip: 'Пропустить',
    required: 'Это поле обязательно',
    invalidPassportSeries: 'Пожалуйста, введите корректную серию паспорта (4 цифры)',
    invalidPassportNumber: 'Пожалуйста, введите корректный номер паспорта (6 цифр)',
    invalidSnils: 'Пожалуйста, введите корректный номер СНИЛС (XXX-XXX-XXX XX)',
    seriesPlaceholder: 'XXXX',
    numberPlaceholder: 'XXXXXX',
    snilsPlaceholder: 'XXX-XXX-XXX XX'
  }
};

export const DocumentSetup: React.FC<DocumentSetupProps> = ({ onComplete, isDarkMode, language }) => {
  const [passportSeries, setPassportSeries] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportIssuedBy, setPassportIssuedBy] = useState('');
  const [passportIssueDate, setPassportIssueDate] = useState('');
  const [snils, setSnils] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = translations[language];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate passport fields if any passport field is filled
    if (passportSeries || passportNumber || passportIssuedBy || passportIssueDate) {
      if (!passportSeries.match(/^\d{4}$/)) {
        newErrors.passportSeries = t.invalidPassportSeries;
      }
      if (!passportNumber.match(/^\d{6}$/)) {
        newErrors.passportNumber = t.invalidPassportNumber;
      }
      if (!passportIssuedBy.trim()) {
        newErrors.passportIssuedBy = t.required;
      }
      if (!passportIssueDate) {
        newErrors.passportIssueDate = t.required;
      }
    }

    // Validate SNILS if filled
    if (snils && !snils.match(/^\d{3}-\d{3}-\d{3}\s\d{2}$/)) {
      newErrors.snils = t.invalidSnils;
    }

    // Ensure at least one document is provided
    if (!snils && !passportSeries) {
      newErrors.general = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const documentData: {
          passport?: {
            series: string;
            number: string;
            issuedBy: string;
            issueDate: string;
          };
          snils?: string;
        } = {};

        if (passportSeries && passportNumber && passportIssuedBy && passportIssueDate) {
          documentData.passport = {
            series: passportSeries,
            number: passportNumber,
            issuedBy: passportIssuedBy,
            issueDate: passportIssueDate
          };
        }

        if (snils) {
          documentData.snils = snils;
        }

        const response = await fetch('http://localhost:8080/api/v1/update/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            snils: documentData.snils,
            passport: documentData.passport,
          }),
          credentials: "include"
        });
        console.log("response", response);


        if (!response.ok) {
          throw new Error('Failed to submit document data');
        }

        onComplete(documentData);
      } catch (error) {
        console.error('Error submitting document data:', error);
        setErrors({ general: 'An error occurred while submitting the data.' });
      }
    }
  };

  const handleSkip = () => {
    onComplete({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-2xl w-full`}
      >
        <h2 className={`text-2xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </h2>
        <p className={`text-center mt-2 mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Passport Section */}
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-4">
              <FileText className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.passport.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t.passport.series}
                </label>
                <input
                  type="text"
                  value={passportSeries}
                  onChange={(e) => setPassportSeries(e.target.value)}
                  placeholder={t.seriesPlaceholder}
                  className={`mt-1 block w-full rounded-md shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                />
                {errors.passportSeries && (
                  <p className="mt-1 text-sm text-red-500">{errors.passportSeries}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t.passport.number}
                </label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder={t.numberPlaceholder}
                  className={`mt-1 block w-full rounded-md shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                />
                {errors.passportNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.passportNumber}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t.passport.issuedBy}
                </label>
                <input
                  type="text"
                  value={passportIssuedBy}
                  onChange={(e) => setPassportIssuedBy(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                />
                {errors.passportIssuedBy && (
                  <p className="mt-1 text-sm text-red-500">{errors.passportIssuedBy}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {t.passport.issueDate}
                </label>
                <input
                  type="date"
                  value={passportIssueDate}
                  onChange={(e) => setPassportIssueDate(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                />
                {errors.passportIssueDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.passportIssueDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* SNILS Section */}
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-4">
              <CreditCard className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.snils.title}
              </h3>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t.snils.number}
              </label>
              <input
                type="text"
                value={snils}
                onChange={(e) => setSnils(e.target.value)}
                placeholder={t.snilsPlaceholder}
                className={`mt-1 block w-full rounded-md shadow-sm
                  ${isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-500 focus:ring-blue-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
              />
              {errors.snils && (
                <p className="mt-1 text-sm text-red-500">{errors.snils}</p>
              )}
            </div>
          </div>

          {errors.general && (
            <p className="text-sm text-red-500 text-center">{errors.general}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`flex-1 sm:flex-none sm:min-w-[200px] py-2 px-4 rounded-md shadow-sm text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {t.continue}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSkip}
              className={`flex-1 sm:flex-none sm:min-w-[200px] py-2 px-4 rounded-md shadow-sm
                ${isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              {t.skip}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};