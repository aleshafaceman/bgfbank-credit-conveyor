import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Добрый день, {user?.name?.split(' ')[0] || 'Александр'}!
        </h1>
        <p className="text-gray-500">У вас активная заявка на кредит под залог недвижимости</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Активная заявка */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-file-signature text-primary text-xl"></i>
            <h3 className="font-semibold text-gray-800">Активная заявка</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Текущий статус рассмотрения</p>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg">
              <i className="fas fa-sync-alt fa-spin mr-1"></i> В обработке
            </span>
            <span className="font-bold text-primary">№4421-И</span>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Параметры</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Данные</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-gray-800 font-semibold">Оценка</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-gray-400">Прескоринг</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/applications')}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
          >
            Перейти к заявке
          </button>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-bolt text-primary text-xl"></i>
            <h3 className="font-semibold text-gray-800">Быстрые действия</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/conveyor')}
              className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors text-center"
            >
              <i className="fas fa-plus-circle text-primary text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-700">Новая заявка</div>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors text-center"
            >
              <i className="fas fa-home text-primary text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-700">Недвижимость</div>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors text-center"
            >
              <i className="fas fa-file-upload text-primary text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-700">2-НДФЛ</div>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors text-center"
            >
              <i className="fas fa-user-edit text-primary text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-700">Профиль</div>
            </button>
          </div>
        </div>

        {/* Персональное предложение */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-star text-yellow-500 text-xl"></i>
            <h3 className="font-semibold text-gray-800">Персональное предложение</h3>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-5">
            <div className="text-xs text-gray-600 mb-1">Предодобренный лимит</div>
            <div className="text-2xl font-bold text-primary mb-2">до 6 200 000 ₽</div>
            <div className="text-sm text-gray-600 mb-4">Ставка от 12.3% · Срок до 25 лет</div>
            <button
              onClick={() => navigate('/applications')}
              className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
            >
              Оформить заявку
            </button>
          </div>
        </div>

        {/* Уведомления */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-bell text-primary text-xl"></i>
            <h3 className="font-semibold text-gray-800">Уведомления</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-file-upload text-yellow-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-800">Загрузите справку 2-НДФЛ</div>
                <div className="text-sm text-gray-500">Требуется для заявки №4421-И</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-blue-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-800">Оценка недвижимости завершена</div>
                <div className="text-sm text-gray-500">Квартира на Крылатской — 8 500 000 ₽</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <div>
                <div className="font-medium text-gray-800">Данные из ЕСИА синхронизированы</div>
                <div className="text-sm text-gray-500">14 июня 2026, 14:30</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
