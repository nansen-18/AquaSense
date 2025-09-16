import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Users, MapPin, Activity, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentReports } from '../components/Dashboard/RecentReports';
import { SocialMediaFeed } from '../components/Dashboard/SocialMediaFeed';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { HazardReport, SocialMediaPost, Hotspot, AIAnalysis } from '../types';

export function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  // Mock data generation
  useEffect(() => {
    // Generate mock reports
    const mockReports: HazardReport[] = [
      {
        id: '1',
        user_id: '1',
        title: 'High waves observed at Juhu Beach',
        description: 'Unusually high waves hitting the shore, potential tsunami warning signs',
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
        title: 'Storm surge approaching',
        description: 'Strong winds and rising water levels near the fishing harbor',
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
        title: 'Water pollution detected',
        description: 'Oil spill observed near the port area, affecting marine life',
        hazard_type: 'pollution',
        severity: 'medium',
        latitude: 19.0445,
        longitude: 72.8466,
        location_name: 'Mumbai Port',
        media_urls: [],
        status: 'pending',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        is_offline_sync: true
      }
    ];
    
    // Generate mock social media posts
    const mockSocialPosts: SocialMediaPost[] = [
      {
        id: '1',
        platform: 'twitter',
        content: 'Massive waves hitting the Mumbai coastline! This looks dangerous. #Mumbai #Tsunami #Alert',
        author: 'weatherwatcher',
        url: 'https://twitter.com/weatherwatcher/status/123',
        sentiment: 'negative',
        urgency_score: 0.8,
        keywords: ['waves', 'dangerous', 'Mumbai', 'tsunami'],
        hazard_types: ['tsunami'],
        latitude: 19.1,
        longitude: 72.8,
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        confidence_score: 0.85
      },
      {
        id: '2',
        platform: 'facebook',
        content: 'Storm clouds gathering over the Arabian Sea. Fishermen advised to stay on shore today.',
        author: 'mumbaiweather',
        url: 'https://facebook.com/mumbaiweather/posts/456',
        sentiment: 'neutral',
        urgency_score: 0.6,
        keywords: ['storm', 'fishermen', 'arabian sea'],
        hazard_types: ['storm'],
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        confidence_score: 0.9
      }
    ];

    // Generate mock hotspots
    const mockHotspots: Hotspot[] = [
      {
        id: '1',
        latitude: 19.1,
        longitude: 72.83,
        intensity: 0.8,
        hazard_types: ['tsunami', 'storm'],
        report_count: 15,
        area_name: 'North Mumbai Coast',
        last_updated: new Date().toISOString()
      },
      {
        id: '2',
        latitude: 19.05,
        longitude: 72.85,
        intensity: 0.6,
        hazard_types: ['pollution'],
        report_count: 8,
        area_name: 'Mumbai Harbor',
        last_updated: new Date().toISOString()
      }
    ];

    // Generate mock AI analysis
    const mockAiAnalysis: AIAnalysis = {
      keyword_trends: [
        { keyword: 'tsunami', count: 45, trend: 'up' },
        { keyword: 'waves', count: 32, trend: 'up' },
        { keyword: 'flooding', count: 28, trend: 'stable' },
        { keyword: 'storm', count: 19, trend: 'down' }
      ],
      sentiment_overview: {
        positive: 15,
        negative: 65,
        neutral: 20
      },
      urgency_alerts: 12,
      geographic_clusters: [
        { latitude: 19.1, longitude: 72.83, post_count: 25 },
        { latitude: 19.05, longitude: 72.85, post_count: 18 }
      ]
    };

    setReports(mockReports);
    setSocialPosts(mockSocialPosts);
    setHotspots(mockHotspots);
    setAiAnalysis(mockAiAnalysis);
  }, []);

  const handleReportClick = (report: HazardReport) => {
    // Handle report click - could open modal or navigate to details
    console.log('Report clicked:', report);
  };

  const criticalReports = reports.filter(r => r.severity === 'critical').length;
  const totalReports = reports.length;
  const verifiedReports = reports.filter(r => r.status === 'verified').length;
  const activeHotspots = hotspots.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AquaSense Dashboard</h1>
          <p className="text-gray-600">Real-time ocean hazard monitoring</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">System Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Reports"
          value={totalReports}
          change="+12%"
          trend="up"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Critical Alerts"
          value={criticalReports}
          change="+3"
          trend="up"
          icon={<TrendingUp className="h-6 w-6" />}
          color="red"
        />
        <StatsCard
          title="Verified Reports"
          value={`${verifiedReports}/${totalReports}`}
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Active Hotspots"
          value={activeHotspots}
          icon={<MapPin className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* AI Analysis Overview */}
      {user?.role === 'analyst' && aiAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Analysis Overview</h3>
            <Brain className="h-5 w-5 text-purple-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{aiAnalysis.urgency_alerts}</div>
              <div className="text-sm text-gray-600">Urgency Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {aiAnalysis.keyword_trends.filter(k => k.trend === 'up').length}
              </div>
              <div className="text-sm text-gray-600">Trending Keywords</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {aiAnalysis.geographic_clusters.reduce((sum, cluster) => sum + cluster.post_count, 0)}
              </div>
              <div className="text-sm text-gray-600">Social Media Mentions</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Live Hazard Map</h3>
            </div>
            <div className="h-96">
              <InteractiveMap
                reports={reports}
                hotspots={hotspots}
                socialPosts={socialPosts}
                onReportClick={handleReportClick}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <RecentReports reports={reports} onReportClick={handleReportClick} />
        </div>
      </div>

      {/* Social Media Feed - Only for officials and analysts */}
      {(user?.role === 'official' || user?.role === 'analyst') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SocialMediaFeed posts={socialPosts} />
          
          {/* AI Insights */}
          {user?.role === 'analyst' && aiAnalysis && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Trending Keywords</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {aiAnalysis.keyword_trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">#{trend.keyword}</span>
                        <span className={`text-sm ${
                          trend.trend === 'up' ? 'text-green-600' : 
                          trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '→'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{trend.count} mentions</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}