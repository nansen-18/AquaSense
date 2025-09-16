import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { HazardReport, Hotspot, SocialMediaPost } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  reports: HazardReport[];
  hotspots: Hotspot[];
  socialPosts: SocialMediaPost[];
  onReportClick?: (report: HazardReport) => void;
  compact?: boolean;
}

export function InteractiveMap({ reports, hotspots, socialPosts, onReportClick, compact = false }: InteractiveMapProps) {
  const [showHotspots, setShowHotspots] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showSocialMedia, setShowSocialMedia] = useState(true);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#EF4444'; // red
      case 'high': return '#F97316';     // orange
      case 'medium': return '#EAB308';   // yellow
      case 'low': return '#22C55E';      // green
      default: return '#6B7280';         // gray
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'tsunami': return '🌊';
      case 'storm': return '🌪️';
      case 'flood': return '💧';
      case 'pollution': return '☣️';
      case 'wildlife': return '🐋';
      default: return '⚠️';
    }
  };

  return (
    <div className="relative h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Layer Controls - only show if not compact */}
      {!compact && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Layers</span>
          </div>
          <div className="space-y-1">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={showReports}
                onChange={(e) => setShowReports(e.target.checked)}
                className="mr-2"
              />
              Reports ({reports.length})
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={showHotspots}
                onChange={(e) => setShowHotspots(e.target.checked)}
                className="mr-2"
              />
              Hotspots ({hotspots.length})
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={showSocialMedia}
                onChange={(e) => setShowSocialMedia(e.target.checked)}
                className="mr-2"
              />
              Social Media ({socialPosts.filter(p => p.latitude && p.longitude).length})
            </label>
          </div>
        </div>
      )}

      {/* Legend - only show if not compact */}
      {!compact && (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Severity</h4>
          <div className="space-y-1">
            {[
              { severity: 'critical', color: '#EF4444', label: 'Critical' },
              { severity: 'high', color: '#F97316', label: 'High' },
              { severity: 'medium', color: '#EAB308', label: 'Medium' },
              { severity: 'low', color: '#22C55E', label: 'Low' }
            ].map(({ severity, color, label }) => (
              <div key={severity} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: color }}
                ></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaflet Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={compact ? 5 : 6}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Report Markers */}
        {showReports && reports.map((report) => (
          <CircleMarker
            key={`report-${report.id}`}
            center={[report.latitude, report.longitude]}
            radius={compact ? 6 : 8}
            fillColor={getSeverityColor(report.severity)}
            color="white"
            weight={2}
            opacity={1}
            fillOpacity={0.8}
            eventHandlers={{
              click: () => onReportClick && onReportClick(report)
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(report.severity)}`}>
                    {report.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>📍 {report.location_name}</p>
                  <p>🕒 {new Date(report.created_at).toLocaleString()}</p>
                  <p>👤 {report.user?.name || 'Anonymous'}</p>
                  <p>📊 {getHazardIcon(report.hazard_type)} {report.hazard_type}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Hotspot Markers */}
        {showHotspots && hotspots.map((hotspot) => (
          <CircleMarker
            key={`hotspot-${hotspot.id}`}
            center={[hotspot.latitude, hotspot.longitude]}
            radius={compact ? 10 : 15}
            fillColor="#DC2626"
            color="white"
            weight={2}
            opacity={1}
            fillOpacity={0.6}
          >
            <Popup maxWidth={250}>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-1">🔥 Hazard Hotspot</h3>
                <p className="text-sm text-gray-600 mb-2">{hotspot.area_name}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>📊 Intensity: {Math.round(hotspot.intensity * 100)}%</p>
                  <p>📈 Reports: {hotspot.report_count}</p>
                  <p>🏷️ Types: {hotspot.hazard_types.join(', ')}</p>
                  <p>🕒 Updated: {new Date(hotspot.last_updated).toLocaleString()}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Social Media Markers */}
        {showSocialMedia && socialPosts.filter(p => p.latitude && p.longitude).map((post) => (
          <CircleMarker
            key={`social-${post.id}`}
            center={[post.latitude!, post.longitude!]}
            radius={compact ? 4 : 6}
            fillColor="#8B5CF6"
            color="white"
            weight={1}
            opacity={1}
            fillOpacity={0.7}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">
                    {post.platform === 'twitter' ? '𝕏' : post.platform === 'facebook' ? '📘' : '📺'} @{post.author}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.urgency_score > 0.7 ? 'bg-red-100 text-red-800' : 
                    post.urgency_score > 0.4 ? 'bg-orange-100 text-orange-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {Math.round(post.urgency_score * 100)}% urgent
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>💭 Sentiment: {post.sentiment}</p>
                  <p>🎯 Confidence: {Math.round(post.confidence_score * 100)}%</p>
                  <p>🕒 {new Date(post.created_at).toLocaleString()}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}