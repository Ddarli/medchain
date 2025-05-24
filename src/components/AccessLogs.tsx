import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { AccessLog } from '../types';

interface AccessLogsProps {
  isDarkMode: boolean;
}

// Mock data for access logs
const mockAccessLogs: AccessLog[] = [
  {
    id: '1',
    recordId: '1',
    recordTitle: 'Общий анализ крови',
    accessedBy: {
      id: '101',
      name: 'Доктор Анна Смирнова',
      role: 'Терапевт'
    },
    timestamp: '2025-05-15T10:30:00Z'
  },
  {
    id: '2',
    recordId: '1',
    recordTitle: 'Рентген околоносовых пазух',
    accessedBy: {
      id: '102',
      name: 'Доктор Александр Ткаченко',
      role: 'Лор'
    },
    timestamp: '2025-05-11T11:45:00Z'
  }
];

const filterOptions = [
  { value: 'all', label: 'Все', icon: <Filter className="w-4 h-4" /> },
  { value: 'view', label: 'Views Only', icon: <Eye className="w-4 h-4" /> },
  { value: 'download', label: 'Downloads Only', icon: <Download className="w-4 h-4" /> }
];

export const AccessLogs: React.FC<AccessLogsProps> = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'view' | 'download'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLogs = mockAccessLogs
    .filter(log => 
      log.recordTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accessedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accessedBy.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(log => filterType === 'all' || log.accessType === filterType);

  const selectedOption = filterOptions.find(option => option.value === filterType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Журнал доступа к медицинским записям
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className={`relative ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по врачу или анализу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 placeholder-gray-500'
              } focus:outline-none focus:ring-2 ${
                isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-500/30'
              } focus:border-blue-500 transition-all duration-200`}
            />
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            } transition-colors duration-200 min-w-[200px] justify-between`}
          >
            <div className="flex items-center gap-2">
              {selectedOption?.icon}
              <span>{selectedOption?.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? 'transform rotate-180' : ''
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className={`absolute z-10 mt-2 w-full rounded-lg border shadow-lg ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                {filterOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setFilterType(option.value as typeof filterType);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
                      isDarkMode
                        ? 'text-white hover:bg-gray-600'
                        : 'text-gray-900 hover:bg-gray-50'
                    } ${option.value === filterType ? (
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                    ) : ''} transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg`}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`border rounded-lg p-4 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {log.recordTitle}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Просмотренно: {log.accessedBy.name}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Специальность: {log.accessedBy.role}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {log.accessType === 'view' ? (
                  <Eye className="w-5 h-5 text-blue-500" />
                ) : (
                  <Download className="w-5 h-5 text-green-500" />
                )}
                <div className="flex items-center text-sm">
                  <Calendar className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};