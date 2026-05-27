import { useState } from 'react';
import { useAppStore } from '../store/appStore';

const AuthPage: React.FC = () => {
  const { setUser } = useAppStore();
  const [view, setView] = useState<'login' | 'sms' | 'register'>('login');
  const [phone, setPhone] = useState('+7 (999) 123-45-67');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!phone || phone.length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }
    if (!password) {
      setError('Введите пароль');
      return;
    }
    
    // Demo login - in real app would verify with backend
    setUser({
      phone,
      name: 'Александр Кузнецов',
      isAuthenticated: true,
      isTwoFactorEnabled: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-3xl">
            Б
          </div>
          <h1 className="text-2xl font-bold text-gray-800">БЖФ БАНК</h1>
          <p className="text-gray-500 mt-2">Кредитный конвейер</p>
        </div>

        {view === 'login' && (
          <>
            <h2 className="text-xl font-semibold mb-2">Вход в личный кабинет</h2>
            <p className="text-gray-500 text-sm mb-6">Введите номер телефона и пароль</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефона</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Введите пароль"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                onClick={handleLogin}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
              >
                Войти
              </button>

              <div className="text-center">
                <button
                  onClick={() => setView('sms')}
                  className="text-primary text-sm hover:underline"
                >
                  Войти по SMS-коду
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">или</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-white rounded flex items-center justify-center text-green-600 text-xs font-bold">ГС</span>
                Войти через Госуслуги
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Нет аккаунта?{' '}
                  <button
                    onClick={() => setView('register')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </div>
            </div>
          </>
        )}

        {view === 'sms' && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Вход по SMS</h2>
            <p className="text-gray-500 text-sm mb-6">
              Мы отправили код на номер<br />
              <span className="font-semibold">{phone}</span>
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ))}
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors mb-4"
            >
              Войти
            </button>

            <button
              onClick={() => setView('login')}
              className="text-gray-500 text-sm hover:underline"
            >
              ← Назад
            </button>
          </div>
        )}

        {view === 'register' && (
          <>
            <h2 className="text-xl font-semibold mb-2">Регистрация</h2>
            <p className="text-gray-500 text-sm mb-6">Введите номер телефона для создания личного кабинета</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефона</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <button
                onClick={() => setView('sms')}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
              >
                Получить код в SMS
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">или</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-white rounded flex items-center justify-center text-green-600 text-xs font-bold">ГС</span>
                Через Госуслуги
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Уже есть аккаунт?{' '}
                  <button
                    onClick={() => setView('login')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Войти
                  </button>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
