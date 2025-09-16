export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'official' | 'analyst';
  phone?: string;
  organization?: string;
  created_at: string;
}

export interface HazardReport {
  id: string;
  user_id: string;
  title: string;
  description: string;
  hazard_type: 'tsunami' | 'storm' | 'flood' | 'pollution' | 'wildlife' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  location_name: string;
  media_urls: string[];
  status: 'pending' | 'verified' | 'investigating' | 'resolved';
  created_at: string;
  updated_at: string;
  user?: User;
  is_offline_sync?: boolean;
}

export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'youtube';
  content: string;
  author: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency_score: number;
  keywords: string[];
  hazard_types: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
  confidence_score: number;
}

export interface Hotspot {
  id: string;
  latitude: number;
  longitude: number;
  intensity: number;
  hazard_types: string[];
  report_count: number;
  area_name: string;
  last_updated: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  created_at: string;
}

export interface MapFilters {
  hazard_types: string[];
  severity_levels: string[];
  date_range: {
    start: string;
    end: string;
  };
  sources: string[];
  status: string[];
}

export interface AIAnalysis {
  keyword_trends: Array<{
    keyword: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  sentiment_overview: {
    positive: number;
    negative: number;
    neutral: number;
  };
  urgency_alerts: number;
  geographic_clusters: Array<{
    latitude: number;
    longitude: number;
    post_count: number;
  }>;
}