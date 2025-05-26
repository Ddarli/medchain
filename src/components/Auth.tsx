import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Loader2, AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react';

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
    password: 'Password',
    invalidCredentials: 'Invalid credentials',
    invalidEmail: 'Please enter a valid email address',
    switchToLogin: 'Already have an account? Login',
    switchToRegister: 'Need an account? Register'
  },
  ru: {
    login: 'Войти',
    register: 'Регистрация',
    email: 'Эл. почта',
    password: 'Пароль',
    invalidCredentials: 'Неверные учетные данные',
    invalidEmail: 'Пожалуйста, введите корректный адрес эл. почты',
    switchToLogin: 'Уже есть аккаунт? Войти',
    switchToRegister: 'Нужен аккаунт? Зарегистрироваться'
  }
};

export const Auth: React.FC<AuthProps> = ({ onLogin, isDarkMode, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const t = translations[language];

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid(email)) {
      setError(t.invalidEmail);
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegistering ? 'register' : 'authenticate';
      const response = await fetch(`http://localhost:8080/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.invalidCredentials);
      }

      document.cookie = `user_id=${data.UserID}; path=/; max-age=2592000`;
      localStorage.setItem("token", data.Token);
      localStorage.setItem("userRole", data.role);

      onLogin(true, isRegistering, data.NeedDocsSetup, data.role === 'doctor');
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
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200 bg-clip-text text-transparent">
          {isRegistering ? t.register : t.login}
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
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="glass-button w-full flex items-center justify-center py-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isRegistering ? (
                  <UserPlus className="mr-2" size={20} />
                ) : (
                  <LogIn className="mr-2" size={20} />
                )}
                {isRegistering ? t.register : t.login}
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-center text-sm text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 transition-colors"
          >
            {isRegistering ? t.switchToLogin : t.switchToRegister}
          </button>
        </form>
      </div>
    </motion.div>
  );
};