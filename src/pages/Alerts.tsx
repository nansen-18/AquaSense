import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, Users, Filter, Bell, BellOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types';

export function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    // Mock alerts data
    const mockAlerts: Notification[] = [
      {
        id: '1',
        user_id: user?.id || '1',
        title: 'Critical Tsunami Warning',
        message: 'High waves detected at multiple coastal locations. Immediate evacuation recommended for low-lying areas.',
        type: 'alert',
        priority: 'high',
        read: false,
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        user_id: user?.id || '1',
        title: 'Storm Surge Alert',
        message: 'Strong winds and rising water levels reported near Mumbai Harbor. Fishermen advised to return to shore.',
        type: 'warning',
        priority: 'high',
        read: false,
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        user_id: user?.id || '1',
        title: 'Report Verification Update',
        message: 'Your hazard report "Oil spill at Marina Beach" has been verified by officials.',
        type: 'info',
        priority: 'medium',
        read: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        user_id: user?.id || '1',
        title: 'Weather Advisory',
        message: 'Moderate rainfall expected in coastal areas over the next 24 hours. Monitor conditions closely.',
        type: 'info',
        priority: 'low',
        read: true,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        user_id: user?.id || '1',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM IST. Some features may be temporarily unavailable.',
        type: 'info',
        priority: 'low',
        read: false,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setAlerts(mockAlerts);
  }, [user]);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'high' || filter === 'medium' || filter === 'low') return alert.priority === filter;
    return true;
  });

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-orange-500 bg-orange-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-600">
            Stay informed about ocean hazards and system updates
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <BellOff className="h-4 w-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Alerts', count: alerts.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'high', label: 'High Priority', count: alerts.filter(a => a.priority === 'high').length },
              { key: 'medium', label: 'Medium Priority', count: alerts.filter(a => a.priority === 'medium').length },
              { key: 'low', label: 'Low Priority', count: alerts.filter(a => a.priority === 'low').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(alert.priority)} ${
              !alert.read ? 'border-r-4 border-r-blue-500' : ''
            } transition-all hover:shadow-md`}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className={`text-lg font-semibold ${!alert.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {alert.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(alert.priority)}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                      {!alert.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                  <p className={`text-sm mb-3 ${!alert.read ? 'text-gray-900' : 'text-gray-600'}`}>
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {alert.type === 'alert' ? 'Emergency Alert' : 
                         alert.type === 'warning' ? 'Warning' : 'Information'}
                      </span>
                    </div>
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'All alerts have been read' : 
               filter === 'all' ? 'No alerts available at this time' :
               `No ${filter} priority alerts found`}
            </p>
          </div>
        )}
      </div>

      {/* Alert Statistics */}
      {user?.role === 'official' || user?.role === 'analyst' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {alerts.filter(a => a.priority === 'medium').length}
              </div>
              <div className="text-sm text-gray-600">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {alerts.filter(a => a.priority === 'low').length}
              </div>
              <div className="text-sm text-gray-600">Low Priority</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}