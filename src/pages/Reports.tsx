import React, { useState } from 'react';
import { Plus, Camera, MapPin, Send, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { HazardReport } from '../types';

export function Reports() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isOnline, addPendingReport, pendingReports } = useOfflineSync();
  
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hazard_type: 'other' as HazardReport['hazard_type'],
    severity: 'medium' as HazardReport['severity'],
    location_name: '',
    latitude: 19.0760,
    longitude: 72.8777
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Mock existing reports
  const [reports] = useState<HazardReport[]>([
    {
      id: '1',
      user_id: user?.id || '1',
      title: 'High waves at Marina Beach',
      description: 'Observed unusually high waves during morning walk',
      hazard_type: 'tsunami',
      severity: 'medium',
      latitude: 13.0827,
      longitude: 80.2707,
      location_name: 'Marina Beach, Chennai',
      media_urls: [],
      status: 'verified',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      user: { id: '1', name: user?.name || 'You', email: user?.email || '', role: 'citizen', created_at: '' }
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter location manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReport: HazardReport = {
      id: Date.now().toString(),
      user_id: user?.id || '',
      title: formData.title,
      description: formData.description,
      hazard_type: formData.hazard_type,
      severity: formData.severity,
      latitude: formData.latitude,
      longitude: formData.longitude,
      location_name: formData.location_name,
      media_urls: [], // In production, files would be uploaded first
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user,
      is_offline_sync: !isOnline
    };

    if (!isOnline) {
      addPendingReport(newReport);
      alert('Report saved offline. It will be submitted when connection is restored.');
    } else {
      // In production, this would submit to the API
      console.log('Submitting report:', newReport);
      alert('Report submitted successfully!');
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      hazard_type: 'other',
      severity: 'medium',
      location_name: '',
      latitude: 19.0760,
      longitude: 72.8777
    });
    setSelectedFiles([]);
    setShowReportForm(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.reports')}</h1>
          <p className="text-gray-600">Submit and track ocean hazard reports</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          
          {/* New Report Button */}
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>{t('report.title')}</span>
          </button>
        </div>
      </div>

      {/* Pending Reports Warning */}
      {pendingReports.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <WifiOff className="h-5 w-5 text-orange-600" />
            <span className="text-orange-800 font-medium">
              {pendingReports.length} report{pendingReports.length > 1 ? 's' : ''} pending sync
            </span>
          </div>
          <p className="text-orange-700 text-sm mt-1">
            These reports will be automatically submitted when you're back online.
          </p>
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{t('report.title')}</h2>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the hazard"
                />
              </div>

              {/* Hazard Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hazard Type *
                  </label>
                  <select
                    name="hazard_type"
                    required
                    value={formData.hazard_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="tsunami">{t('hazard.tsunami')}</option>
                    <option value="storm">{t('hazard.storm')}</option>
                    <option value="flood">{t('hazard.flood')}</option>
                    <option value="pollution">{t('hazard.pollution')}</option>
                    <option value="wildlife">{t('hazard.wildlife')}</option>
                    <option value="other">{t('hazard.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level *
                  </label>
                  <select
                    name="severity"
                    required
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">{t('severity.low')}</option>
                    <option value="medium">{t('severity.medium')}</option>
                    <option value="high">{t('severity.high')}</option>
                    <option value="critical">{t('severity.critical')}</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('report.description')} *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed information about what you observed"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('report.location')} *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="location_name"
                    required
                    value={formData.location_name}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Marina Beach, Chennai"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Use GPS</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Latitude"
                  />
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Longitude"
                  />
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos/Videos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    Click to upload photos or videos
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Max 10MB per file. Supports JPG, PNG, MP4
                  </p>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Send className="h-4 w-4" />
                  <span>{t('report.submit')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {user?.role === 'citizen' ? 'Your Reports' : 'All Reports'}
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[...pendingReports, ...reports].map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                    {report.is_offline_sync && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        📱 Pending Sync
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">{report.hazard_type}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{report.description}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {report.location_name}
                    </span>
                    <span>{new Date(report.created_at).toLocaleString()}</span>
                    {report.user?.name && <span>by {report.user.name}</span>}
                  </div>
                </div>
                <div className="text-3xl">
                  {report.hazard_type === 'tsunami' && '🌊'}
                  {report.hazard_type === 'storm' && '🌪️'}
                  {report.hazard_type === 'flood' && '💧'}
                  {report.hazard_type === 'pollution' && '☣️'}
                  {report.hazard_type === 'wildlife' && '🐋'}
                  {report.hazard_type === 'other' && '⚠️'}
                </div>
              </div>
            </div>
          ))}
          
          {reports.length === 0 && pendingReports.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reports yet. Submit your first hazard report to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}