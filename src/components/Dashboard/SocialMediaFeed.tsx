import React, { useState } from 'react';
import { MessageCircle, TrendingUp, MapPin, ExternalLink } from 'lucide-react';
import { SocialMediaPost } from '../../types';

interface SocialMediaFeedProps {
  posts: SocialMediaPost[];
}

export function SocialMediaFeed({ posts }: SocialMediaFeedProps) {
  const [filter, setFilter] = useState<'all' | 'high-urgency' | 'verified'>('all');

  const filteredPosts = posts.filter(post => {
    if (filter === 'high-urgency') return post.urgency_score > 0.7;
    if (filter === 'verified') return post.confidence_score > 0.8;
    return true;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return '𝕏';
      case 'facebook': return '📘';
      case 'youtube': return '📺';
      default: return '📱';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score > 0.8) return 'bg-red-100 text-red-800 border-red-200';
    if (score > 0.6) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (score > 0.4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Social Media Monitor</h3>
          <MessageCircle className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Posts' },
            { key: 'high-urgency', label: 'High Urgency' },
            { key: 'verified', label: 'High Confidence' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredPosts.slice(0, 15).map((post) => (
          <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getPlatformIcon(post.platform)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">@{post.author}</span>
                  <span className={`text-xs ${getSentimentColor(post.sentiment)}`}>
                    {post.sentiment}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(post.urgency_score)}`}>
                    {Math.round(post.urgency_score * 100)}% urgent
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {post.latitude && post.longitude && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Location detected
                      </span>
                    )}
                    <span>{new Date(post.created_at).toLocaleString()}</span>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                {post.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-4 opacity-50" />
            <p>No posts match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}