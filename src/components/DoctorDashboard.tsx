import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, User, FileText, Calendar, Search } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  lastVisit: string;
  nextAppointment?: string;
  condition: 'stable' | 'needs-attention' | 'critical';
  records: number;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    dateOfBirth: '1990-05-15',
    lastVisit: '2025-03-10',
    nextAppointment: '2025-04-20',
    condition: 'stable',
    records: 5
  },
  {
    id: '2',
    name: 'Alice Smith',
    dateOfBirth: '1985-08-22',
    lastVisit: '2025-03-15',
    condition: 'needs-attention',
    records: 8
  },
  {
    id: '3',
    name: 'Bob Johnson',
    dateOfBirth: '1978-12-03',
    lastVisit: '2025-03-12',
    nextAppointment: '2025-04-15',
    condition: 'critical',
    records: 12
  }
];

export const DoctorDashboard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments'>('patients');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConditionStyle = (condition: Patient['condition']) => {
    switch (condition) {
      case 'stable':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 md:mb-0`}>
          Doctor Dashboard
        </h2>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('patients')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'patients'
                ? 'bg-blue-500 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Patients
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'appointments'
                ? 'bg-blue-500 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Appointments
          </motion.button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              <th className="text-left py-3 px-4">Patient</th>
              <th className="text-left py-3 px-4">Date of Birth</th>
              <th className="text-left py-3 px-4">Last Visit</th>
              <th className="text-left py-3 px-4">Next Appointment</th>
              <th className="text-left py-3 px-4">Condition</th>
              <th className="text-left py-3 px-4">Records</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <motion.tr
                key={patient.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <User className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {patient.name}
                    </span>
                  </div>
                </td>
                <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {patient.dateOfBirth}
                </td>
                <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {patient.lastVisit}
                </td>
                <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {patient.nextAppointment || 'Not scheduled'}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getConditionStyle(patient.condition)}`}>
                    {patient.condition.replace('-', ' ')}
                  </span>
                </td>
                <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />А
                    {patient.records}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    View Details
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};