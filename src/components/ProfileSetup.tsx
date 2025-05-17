import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Calendar, MapPin, User} from 'lucide-react';

interface ProfileSetupProps {
    onComplete: (userData: {
        name: string;
        dateOfBirth: string;
        address: string;
    }) => void;
    isDarkMode: boolean;
    language: 'en' | 'ru';
}

const translations = {
    en: {
        title: 'Complete Your Profile',
        subtitle: 'Please provide your basic information to continue',
        name: 'Full Name',
        dateOfBirth: 'Date of Birth',
        address: 'Address',
        continue: 'Continue',
        required: 'This field is required',
        invalidDate: 'Please enter a valid date',
        namePlaceholder: 'Enter your full name',
        addressPlaceholder: 'Enter your full address'
    },
    ru: {
        title: 'Заполните профиль',
        subtitle: 'Пожалуйста, предоставьте основную информацию для продолжения',
        name: 'Полное имя',
        dateOfBirth: 'Дата рождения',
        address: 'Адрес',
        continue: 'Продолжить',
        required: 'Это поле обязательно',
        invalidDate: 'Пожалуйста, введите корректную дату',
        namePlaceholder: 'Введите ваше полное имя',
        addressPlaceholder: 'Введите ваш полный адрес'
    }
};

export const ProfileSetup: React.FC<ProfileSetupProps> = ({onComplete, isDarkMode, language}) => {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const t = translations[language];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = t.required;
        }

        if (!dateOfBirth) {
            newErrors.dateOfBirth = t.required;
        } else {
            const date = new Date(dateOfBirth);
            const today = new Date();
            if (isNaN(date.getTime()) || date > today) {
                newErrors.dateOfBirth = t.invalidDate;
            }
        }

        if (!address.trim()) {
            newErrors.address = t.required;
        }

        setErrors(newErrors);
        console.log(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                console.log("token", localStorage.getItem("token"));
                const response = await fetch('http://localhost:8080/api/v1/update/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        name,
                        dateOfBirth,
                        address,
                    }),
                    credentials: "include"
                });
                console.log("response", response);

                if (!response.ok) {
                    throw new Error('Failed to submit profile data');
                }

                const data = await response.json();
                console.log('Profile updated successfully:', data);

                onComplete({
                    name,
                    dateOfBirth,
                    address,
                });
            } catch (err) {
                console.error('Error submitting profile data:', err);
            }
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="w-full max-w-md mx-auto"
        >
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
                <h2 className={`text-2xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t.title}
                </h2>
                <p className={`text-center mt-2 mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.subtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {t.name}
                        </label>
                        <div className="mt-1 relative">
                            <User
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                size={18}/>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.namePlaceholder}
                                className={`pl-10 block w-full rounded-md shadow-sm
                  ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label
                            className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {t.dateOfBirth}
                        </label>
                        <div className="mt-1 relative">
                            <Calendar
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                size={18}/>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className={`pl-10 block w-full rounded-md shadow-sm
                  ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                            />
                        </div>
                        {errors.dateOfBirth && (
                            <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                        )}
                    </div>

                    <div>
                        <label
                            className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {t.address}
                        </label>
                        <div className="mt-1 relative">
                            <MapPin
                                className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                size={18}/>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder={t.addressPlaceholder}
                                rows={3}
                                className={`pl-10 block w-full rounded-md shadow-sm
                  ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                            />
                        </div>
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                        )}
                    </div>

                    <motion.button
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        type="submit"
                        className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white 
              ${isDarkMode
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {t.continue}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};