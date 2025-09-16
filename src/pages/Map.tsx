import React, { useState, useEffect } from 'react';
import { Search, Filter, Layers, ZoomIn, ZoomOut, MapPin, X } from 'lucide-react';
import { HazardReport, Hotspot, SocialMediaPost } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { InteractiveMap } from '../components/Map/InteractiveMap';

export function Map() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Layer toggles
  const [showReports, setShowReports] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showSocialMedia, setShowSocialMedia] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    hazardTypes: [] as string[],
    severityLevels: [] as string[],
    dateRange: { start: '', end: '' },
    status: [] as string[]
  });

  // Mock data
  useEffect(() => {
    const mockReports: HazardReport[] = [
      {
        id: '1',
        user_id: '1',
        title: 'High waves at Juhu Beach',
        description: 'Unusually high waves hitting the shore, potential tsunami warning signs. Water levels have risen significantly in the past hour.',
        hazard_type: 'tsunami',
        severity: 'high',
        latitude: 19.1075,
        longitude: 72.8263,
        location_name: 'Juhu Beach, Mumbai',
        media_urls: [],
        status: 'verified',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        user: { id: '1', name: 'Coastal Observer', email: 'observer@example.com', role: 'citizen', created_at: '' }
      },
      {
        id: '2',
        user_id: '2',
        title: 'Storm surge approaching Colaba',
        description: 'Strong winds and rising water levels near the fishing harbor. Fishermen are being advised to return to shore immediately.',
        hazard_type: 'storm',
        severity: 'critical',
        latitude: 19.0728,
        longitude: 72.8826,
        location_name: 'Colaba, Mumbai',
        media_urls: [],
        status: 'investigating',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        user: { id: '2', name: 'Fisher Community', email: 'fisher@example.com', role: 'citizen', created_at: '' }
      },
      {
        id: '3',
        user_id: '3',
        title: 'Oil spill detected at Mumbai Port',
        description: 'Large oil spill observed near the port area, affecting marine life and water quality.',
        hazard_type: 'pollution',
        severity: 'medium',
        latitude: 19.0445,
        longitude: 72.8466,
        location_name: 'Mumbai Port',
        media_urls: [],
        status: 'pending',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        user_id: '4',
        title: 'Flooding in coastal areas',
        description: 'Heavy rainfall causing flooding in low-lying coastal areas. Roads are becoming impassable.',
        hazard_type: 'flood',
        severity: 'high',
        latitude: 19.0896,
        longitude: 72.8656,
        location_name: 'Bandra West, Mumbai',
        media_urls: [],
        status: 'verified',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        user_id: '5',
        title: 'Unusual marine life behavior',
        description: 'Dolphins and whales spotted very close to shore, unusual behavior observed.',
        hazard_type: 'wildlife',
        severity: 'low',
        latitude: 13.0827,
        longitude: 80.2707,
        location_name: 'Marina Beach, Chennai',
        media_urls: [],
        status: 'verified',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const mockHotspots: Hotspot[] = [
      {
        id: '1',
        latitude: 19.1,
        longitude: 72.83,
        intensity: 0.9,
        hazard_types: ['tsunami', 'storm'],
        report_count: 25,
        area_name: 'North Mumbai Coast',
        last_updated: new Date().toISOString()
      },
      {
        id: '2',
        latitude: 19.05,
        longitude: 72.85,
        intensity: 0.7,
        hazard_types: ['pollution'],
        report_count: 12,
        area_name: 'Mumbai Harbor',
        last_updated: new Date().toISOString()
      },
      {
        id: '3',
        latitude: 13.08,
        longitude: 80.27,
        intensity: 0.6,
        hazard_types: ['wildlife', 'tsunami'],
        report_count: 8,
        area_name: 'Chennai Coast',
        last_updated: new Date().toISOString()
      }
    ];

    const mockSocialPosts: SocialMediaPost[] = [
      {
        id: '1',
        platform: 'twitter',
        content: 'Massive waves hitting the Mumbai coastline! This looks dangerous.',
        author: 'weatherwatcher',
        url: 'https://twitter.com/weatherwatcher/status/123',
        sentiment: 'negative',
        urgency_score: 0.8,
        keywords: ['waves', 'dangerous', 'Mumbai'],
        hazard_types: ['tsunami'],
        latitude: 19.1,
        longitude: 72.8,
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        confidence_score: 0.85
      },
      {
        id: '2',
        platform: 'facebook',
        content: 'Oil spill visible from the coast, marine life affected.',
        author: 'environmentalist',
        url: 'https://facebook.com/post/456',
        sentiment: 'negative',
        urgency_score: 0.6,
        keywords: ['oil spill', 'marine life'],
        hazard_types: ['pollution'],
        latitude: 19.04,
        longitude: 72.85,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        confidence_score: 0.9
      }
    ];

    setReports(mockReports);
    setHotspots(mockHotspots);
    setSocialPosts(mockSocialPosts);
  }, []);

  const filteredReports = reports.filter(report => {
    if (filters.hazardTypes.length > 0 && !filters.hazardTypes.includes(report.hazard_type)) return false;
    if (filters.severityLevels.length > 0 && !filters.severityLevels.includes(report.severity)) return false;
    if (filters.status.length > 0 && !filters.status.includes(report.status)) return false;
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !report.location_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev].includes(value)
        ? prev[filterType as keyof typeof prev].filter((item: string) => item !== value)
        : [...prev[filterType as keyof typeof prev], value]
    }));
  };

  const handleReportClick = (report: HazardReport) => {
    setSelectedReport(report);
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('nav.map')}</h1>
            <p className="text-gray-600">Interactive hazard visualization and monitoring</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              {filteredReports.length} reports • {hotspots.length} hotspots
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations, hazard types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Hazard Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hazard Types</label>
                <div className="space-y-1">
                  {['tsunami', 'storm', 'flood', 'pollution', 'wildlife', 'other'].map(type => (
                    <label key={type} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.hazardTypes.includes(type)}
                        onChange={() => handleFilterChange('hazardTypes', type)}
                        className="mr-2"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity Levels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <div className="space-y-1">
                  {['low', 'medium', 'high', 'critical'].map(severity => (
                    <label key={severity} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.severityLevels.includes(severity)}
                        onChange={() => handleFilterChange('severityLevels', severity)}
                        className="mr-2"
                      />
                      <span className="capitalize">{severity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-1">
                  {['pending', 'verified', 'investigating', 'resolved'].map(status => (
                    <label key={status} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => handleFilterChange('status', status)}
                        className="mr-2"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <InteractiveMap
          reports={filteredReports}
          hotspots={hotspots}
          socialPosts={socialPosts}
          onReportClick={handleReportClick}
          compact={false}
        />
      </div>
    </div>
  );
}