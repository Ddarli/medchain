import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLogin: (value: boolean, isNewUser?: boolean) => void;
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
    passwordMismatch: 'Passwords do not match'
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
    passwordMismatch: 'Пароли не совпадают'
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
      const response = await fetch(isLogin ? 'http://localhost:8080/auth/authenticate' : 'http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...(isLogin ? {} : { phone }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.invalidCredentials);
      }

      document.cookie = `user_id=${data.UserID}; path=/; max-age=2592000`;
      localStorage.setItem("token", data.Token);

      onLogin(true, !data.Verified, data.NeedDocsSetup);
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
      className="w-full max-w-md"
    >
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
        <h2 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {isLogin ? t.login : t.register}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-md shadow-sm
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t.phone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className={`mt-1 block w-full rounded-md shadow-sm
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {t.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm pr-10
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                  ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLogin && (
              <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.passwordRequirements}
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {t.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-1 block w-full rounded-md shadow-sm pr-10
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                  required={!isLogin}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                    ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
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
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white 
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
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
        </form>
        <p className={`mt-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isLogin ? t.noAccount : t.haveAccount}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setPassword('');
              setConfirmPassword('');
              setPhone('');
            }}
            className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} ml-1`}
          >
            {isLogin ? t.register : t.login}
          </button>
        </p>
      </div>
    </motion.div>
  );
};