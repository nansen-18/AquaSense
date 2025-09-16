import React from 'react';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';
import { HazardReport } from '../../types';

interface RecentReportsProps {
  reports: HazardReport[];
  onReportClick: (report: HazardReport) => void;
}

export function RecentReports({ reports, onReportClick }: RecentReportsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          <AlertTriangle className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {reports.slice(0, 10).map((report) => (
          <div
            key={report.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onReportClick(report)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  {report.is_offline_sync && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      📱 Synced
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {report.location_name}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                  <span className="capitalize">{report.hazard_type}</span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="text-2xl">
                  {report.hazard_type === 'tsunami' && '🌊'}
                  {report.hazard_type === 'storm' && '🌪️'}
                  {report.hazard_type === 'flood' && '💧'}
                  {report.hazard_type === 'pollution' && '☣️'}
                  {report.hazard_type === 'wildlife' && '🐋'}
                  {report.hazard_type === 'other' && '⚠️'}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {reports.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 opacity-50" />
            <p>No reports available</p>
          </div>
        )}
      </div>
    </div>
  );
}