import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Map, AlertTriangle, FileText, Activity, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: BarChart3, roles: ['citizen', 'official', 'analyst'] },
    { name: t('nav.reports'), href: '/reports', icon: FileText, roles: ['citizen', 'official', 'analyst'] },
    { name: t('nav.map'), href: '/map', icon: Map, roles: ['citizen', 'official', 'analyst'] },
    { name: t('nav.alerts'), href: '/alerts', icon: AlertTriangle, roles: ['official', 'analyst'] },
    { name: t('nav.analytics'), href: '/analytics', icon: Activity, roles: ['analyst'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['citizen', 'official', 'analyst'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'citizen')
  );

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        <div className="flex flex-col w-full h-full pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 px-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-900">AquaSense</h2>
            </div>
          </div>

          <nav className="mt-8 flex-1 px-4 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700 border-r-2'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors`
                }
              >
                <item.icon
                  className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Role indicator */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                user?.role === 'official' ? 'bg-blue-100 text-blue-800' :
                user?.role === 'analyst' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}