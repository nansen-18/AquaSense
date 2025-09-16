import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Brain, MapPin, Calendar, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AIAnalysis, HazardReport, SocialMediaPost } from '../types';

export function Analytics() {
  const { user } = useAuth();
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    // Mock analytics data
    const mockAiAnalysis: AIAnalysis = {
      keyword_trends: [
        { keyword: 'tsunami', count: 156, trend: 'up' },
        { keyword: 'waves', count: 134, trend: 'up' },
        { keyword: 'flooding', count: 89, trend: 'stable' },
        { keyword: 'storm', count: 67, trend: 'down' },
        { keyword: 'pollution', count: 45, trend: 'up' },
        { keyword: 'cyclone', count: 34, trend: 'stable' },
        { keyword: 'erosion', count: 28, trend: 'down' },
        { keyword: 'wildlife', count: 23, trend: 'up' }
      ],
      sentiment_overview: {
        positive: 15,
        negative: 65,
        neutral: 20
      },
      urgency_alerts: 23,
      geographic_clusters: [
        { latitude: 19.1, longitude: 72.83, post_count: 45 },
        { latitude: 19.05, longitude: 72.85, post_count: 32 },
        { latitude: 13.08, longitude: 80.27, post_count: 28 },
        { latitude: 11.93, longitude: 79.83, post_count: 19 }
      ]
    };

    const mockReports: HazardReport[] = [
      {
        id: '1',
        user_id: '1',
        title: 'High waves at Juhu Beach',
        description: 'Unusually high waves hitting the shore',
        hazard_type: 'tsunami',
        severity: 'high',
        latitude: 19.1075,
        longitude: 72.8263,
        location_name: 'Juhu Beach, Mumbai',
        media_urls: [],
        status: 'verified',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const mockSocialPosts: SocialMediaPost[] = [
      {
        id: '1',
        platform: 'twitter',
        content: 'Massive waves hitting the Mumbai coastline!',
        author: 'weatherwatcher',
        url: 'https://twitter.com/weatherwatcher/status/123',
        sentiment: 'negative',
        urgency_score: 0.8,
        keywords: ['waves', 'Mumbai'],
        hazard_types: ['tsunami'],
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        confidence_score: 0.85
      }
    ];

    setAiAnalysis(mockAiAnalysis);
    setReports(mockReports);
    setSocialPosts(mockSocialPosts);
  }, [timeRange]);

  if (user?.role !== 'analyst') {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Restricted</h2>
          <p className="text-yellow-700">
            Analytics features are only available to Data Analysts. 
            Please contact your administrator to upgrade your account.
          </p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">AI-powered insights and trend analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgency Alerts</p>
                <p className="text-2xl font-bold text-red-600">{aiAnalysis.urgency_alerts}</p>
              </div>
              <Brain className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social Media Posts</p>
                <p className="text-2xl font-bold text-blue-600">{socialPosts.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Geographic Clusters</p>
                <p className="text-2xl font-bold text-purple-600">{aiAnalysis.geographic_clusters.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trending Keywords</p>
                <p className="text-2xl font-bold text-green-600">
                  {aiAnalysis.keyword_trends.filter(k => k.trend === 'up').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Trends */}
        {aiAnalysis && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Keyword Trends</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {aiAnalysis.keyword_trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">#{trend.keyword}</span>
                      {getTrendIcon(trend.trend)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">{trend.count}</span>
                      <span className={`text-xs ${getTrendColor(trend.trend)}`}>
                        {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}
                        {trend.trend !== 'stable' ? Math.floor(Math.random() * 20 + 5) + '%' : 'stable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sentiment Analysis */}
        {aiAnalysis && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Negative</span>
                  <span className="text-sm font-bold text-red-600">{aiAnalysis.sentiment_overview.negative}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${aiAnalysis.sentiment_overview.negative}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Neutral</span>
                  <span className="text-sm font-bold text-gray-600">{aiAnalysis.sentiment_overview.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full" 
                    style={{ width: `${aiAnalysis.sentiment_overview.neutral}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Positive</span>
                  <span className="text-sm font-bold text-green-600">{aiAnalysis.sentiment_overview.positive}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${aiAnalysis.sentiment_overview.positive}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Geographic Clusters */}
      {aiAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Geographic Activity Clusters</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiAnalysis.geographic_clusters.map((cluster, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-bold text-gray-900">{cluster.post_count} posts</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>Lat: {cluster.latitude.toFixed(4)}</p>
                    <p>Lng: {cluster.longitude.toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700">
              <strong>Trend Alert:</strong> Tsunami-related keywords have increased by 45% in the last 24 hours, 
              primarily concentrated around Mumbai coastal areas.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700">
              <strong>Sentiment Shift:</strong> Overall sentiment has become more negative (65%), indicating 
              increased public concern about ocean hazards.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700">
              <strong>Geographic Pattern:</strong> Activity clusters show concentration in major coastal cities, 
              suggesting coordinated monitoring efforts may be needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}