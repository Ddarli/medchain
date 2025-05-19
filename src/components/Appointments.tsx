import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Star, X } from 'lucide-react';
import { Appointment, Doctor } from '../types';
import { Toast } from './Toast';

// Mock doctors data
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availableSlots: ['09:00', '10:00', '14:00', '15:00']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availableSlots: ['11:00', '13:00', '16:00']
  },
  {
    id: '3',
    name: 'Dr. Emily White',
    specialty: 'Pediatrician',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    availableSlots: ['09:30', '10:30', '14:30']
  }
];

interface AppointmentsProps {
  isDarkMode: boolean;
  language: 'en' | 'ru';
}

const translations = {
  en: {
    title: 'Schedule an Appointment',
    subtitle: 'Choose a doctor and convenient time',
    search: 'Search by name or specialty',
    noResults: 'No doctors found',
    available: 'Available slots',
    book: 'Book Appointment',
    myAppointments: 'My Appointments',
    noAppointments: 'No appointments scheduled',
    confirmationTitle: 'Appointment Scheduled',
    confirmationMessage: 'Your appointment has been scheduled successfully',
    noAvailableSlots: 'No available slots',
    status: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  },
  ru: {
    title: 'Записаться на прием',
    subtitle: 'Выберите врача и удобное время',
    search: 'Поиск по имени или специальности',
    noResults: 'Врачи не найдены',
    available: 'Доступное время',
    book: 'Записаться',
    myAppointments: 'Мои записи',
    noAppointments: 'Нет запланированных приемов',
    confirmationTitle: 'Прием запланирован',
    confirmationMessage: 'Ваш прием успешно запланирован',
    noAvailableSlots: 'Нет доступных слотов',
    status: {
      scheduled: 'Запланирован',
      completed: 'Завершен',
      cancelled: 'Отменен'
    }
  }
};

export const Appointments: React.FC<AppointmentsProps> = ({ isDarkMode, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [loading, setLoading] = useState<boolean>(false);

  const t = translations[language];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled'
      };

      setAppointments([...appointments, newAppointment]);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      setShowToast(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </h2>
        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t.subtitle}
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-50 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500">{language === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <div className="text-center text-gray-500">{t.noResults}</div>
      )}

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            whileHover={{ scale: 1.02 }}
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg overflow-hidden`}
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {doctor.name}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {doctor.specialty}
              </p>
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current"/>
                <span className={`ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {doctor.rating}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDoctor(doctor)}
                className={`mt-4 w-full py-2 px-4 rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {t.book}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDoctor(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-xl p-6 max-w-md w-full`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedDoctor.name}
                </h3>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Calendar className="inline-block w-4 h-4 mr-2"/>
                    {language === 'ru' ? 'Дата' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`mt-1 block w-full rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-900'
                    } border border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Clock className="inline-block w-4 h-4 mr-2"/>
                      {t.available}
                    </label>
                    {selectedDoctor.availableSlots.length > 0 ? (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {selectedDoctor.availableSlots.map((slot) => (
                          <motion.button
                            key={slot}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-4 rounded-lg text-sm ${
                              selectedTime === slot
                                ? isDarkMode
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-500 text-white'
                                : isDarkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            {slot}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">{t.noAvailableSlots}</p>
                    )}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full py-2 px-4 rounded-lg ${
                    !selectedDate || !selectedTime
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                  } text-white mt-4`}
                >
                  {t.book}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Appointments Section */}
      {appointments.length > 0 && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mt-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.myAppointments}
          </h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } rounded-lg p-4`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.doctorName}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {appointment.specialty}
                    </p>
                    <div className="flex items-center mt-2">
                      <Calendar className="w-4 h-4 mr-2"/>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {appointment.date}
                      </span>
                      <Clock className="w-4 h-4 ml-4 mr-2"/>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'scheduled'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {t.status[appointment.status]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showToast && (
          <Toast
            message={t.confirmationMessage}
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};