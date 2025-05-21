import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, Loader2, AlertCircle, Eye, EyeOff, Stethoscope } from 'lucide-react';

interface AuthProps {
  onLogin: (value: boolean, isNewUser?: boolean, needDocuments?: boolean, isDoctor?: boolean) => void;
  isDarkMode: boolean;
  language: 'en' | 'ru';
}

const translations = {
  en: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    phone: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    passwordRequirements: 'Minimum 8 characters, must include a number and special character',
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    invalidCredentials: 'Invalid credentials',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number (e.g., +1 234 567 8900)',
    invalidPassword: 'Password must be at least 8 characters long and include a number and special character',
    passwordMismatch: 'Passwords do not match',
    doctorLogin: 'Doctor Login',
    patientLogin: 'Patient Login',
    testCredentials: 'Test Credentials',
    useTestCredentials: 'Use test credentials'
  },
  ru: {
    login: 'Войти',
    register: 'Регистрация',
    email: 'Эл. почта',
    phone: 'Номер телефона',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    passwordRequirements: 'Минимум 8 символов, должен включать цифру и специальный символ',
    noAccount: 'Нет аккаунта?',
    haveAccount: 'Уже есть аккаунт?',
    invalidCredentials: 'Неверные учетные данные',
    invalidEmail: 'Пожалуйста, введите корректный адрес эл. почты',
    invalidPhone: 'Пожалуйста, введите корректный номер телефона (например, +1 234 567 8900)',
    invalidPassword: 'Пароль должен содержать минимум 8 символов, цифру и специальный символ',
    passwordMismatch: 'Пароли не совпадают',
    doctorLogin: 'Вход для врачей',
    patientLogin: 'Вход для пациентов',
    testCredentials: 'Тестовые данные',
    useTestCredentials: 'Использовать тестовые данные'
  }
};

// Test credentials
const testCredentials = {
  patient: {
    email: 'test@example.com',
    password: 'Test123!@#'
  },
  doctor: {
    email: 'doctor@example.com',
    password: 'Doctor123!@#'
  }
};

export const Auth: React.FC<AuthProps> = ({ onLogin, isDarkMode, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  const t = translations[language];

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPhoneValid = (phone: string) => {
    const phoneRegex = /^\+?\d{1,4}?\s?\d{3}\s?\d{3}\s?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const useTestCredentials = () => {
    const credentials = isDoctor ? testCredentials.doctor : testCredentials.patient;
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (!isEmailValid(email)) {
        setError(t.invalidEmail);
        return;
      }

      if (!isPhoneValid(phone)) {
        setError(t.invalidPhone);
        return;
      }

      if (!isPasswordValid(password)) {
        setError(t.invalidPassword);
        return;
      }

      if (password !== confirmPassword) {
        setError(t.passwordMismatch);
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate API call with test credentials
      if (
        (isDoctor && email === testCredentials.doctor.email && password === testCredentials.doctor.password) ||
        (!isDoctor && email === testCredentials.patient.email && password === testCredentials.patient.password)
      ) {
        localStorage.setItem("token", "mock-token");
        localStorage.setItem("userType", isDoctor ? "doctor" : "patient");
        onLogin(true, false, false, isDoctor);
        return;
      }

      const response = await fetch(isLogin ? 'http://localhost:8080/auth/authenticate' : 'http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...(isLogin ? {} : { phone }),
          role: isDoctor ? 'doctor' : 'patient'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.invalidCredentials);
      }

      document.cookie = `user_id=${data.UserID}; path=/; max-age=2592000`;
      localStorage.setItem("token", data.Token);
      localStorage.setItem("userType", isDoctor ? "doctor" : "patient");

      onLogin(true, !data.Verified, data.NeedDocsSetup, isDoctor);
    } catch (err: any) {
      setError(err.message || t.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-panel rounded-2xl p-8">
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDoctor(false)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              !isDoctor
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {t.patientLogin}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDoctor(true)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDoctor
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Stethoscope className="w-5 h-5 mr-2" />
            {t.doctorLogin}
          </motion.button>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200 bg-clip-text text-transparent">
          {isLogin ? t.login : t.register}
        </h2>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">
                {t.phone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="glass-input w-full"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">
              {t.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-dark-400 hover:text-dark-600 dark:text-dark-400 dark:hover:text-dark-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLogin && (
              <p className="mt-2 text-xs text-dark-500 dark:text-dark-400">
                {t.passwordRequirements}
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass-input w-full pr-10"
                  required={!isLogin}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-dark-400 hover:text-dark-600 dark:text-dark-400 dark:hover:text-dark-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="glass-button w-full flex items-center justify-center py-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="mr-2" size={20} />
                {t.login}
              </>
            ) : (
              <>
                <UserPlus className="mr-2" size={20} />
                {t.register}
              </>
            )}
          </motion.button>

          {isLogin && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={useTestCredentials}
              className="glass-button-secondary w-full flex items-center justify-center py-3 mt-4"
            >
              {t.useTestCredentials}
            </motion.button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-dark-600 dark:text-dark-400">
          {isLogin ? t.noAccount : t.haveAccount}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setPassword('');
              setConfirmPassword('');
              setPhone('');
            }}
            className="ml-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            {isLogin ? t.register : t.login}
          </button>
        </p>
      </div>
    </motion.div>
  );
};