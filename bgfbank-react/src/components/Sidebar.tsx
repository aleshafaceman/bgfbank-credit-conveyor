import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { currentPage, setCurrentPage, user, setUser } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Панель управления', icon: 'fa-th-large' },
    { id: 'applications', label: 'Мои заявки', icon: 'fa-file-signature', badge: 1 },
    { id: 'mortgage', label: 'Ипотека', icon: 'fa-wallet' },
    { id: 'profile', label: 'Профиль', icon: 'fa-user-circle' },
    { id: 'settings', label: 'Настройки', icon: 'fa-cog' },
  ];

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <aside className="w-72 bg-primary text-white p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center font-bold text-2xl">
          Б
        </div>
        <span className="text-xl font-bold tracking-wide">БЖФ БАНК</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              navigate(`/${item.id}`);
            }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
              currentPage === item.id
                ? 'bg-white/20 font-semibold'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white mt-4 transition-all"
        >
          <i className="fas fa-sign-out-alt w-5"></i>
          <span>Выйти</span>
        </button>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 p-4 bg-black/20 rounded-2xl">
          <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center font-bold">
            АК
          </div>
          <div>
            <div className="font-semibold text-sm">{user?.name || 'Александр К.'}</div>
            <div className="text-xs text-gray-400">Заемщик · ЕСИА ✓</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
