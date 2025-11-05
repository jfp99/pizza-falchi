'use client';

import { useEffect, useState } from 'react';
import { Mail, Users, UserCheck, UserX, TrendingUp, Download, Send } from 'lucide-react';

interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  recentSubscribers: number;
}

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  source: string;
  subscribedAt: string;
  tags: string[];
}

export default function NewsletterAdminPage() {
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newsletter');
      const data = await response.json();
      setStats(data.stats);

      // Fetch subscribers list (would need a separate endpoint)
      // For now, we'll just show stats
    } catch (error) {
      console.error('Failed to fetch newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribers = () => {
    // TODO: Implement CSV export
    alert('Export feature coming soon!');
  };

  const sendCampaign = () => {
    // TODO: Implement email campaign sender
    alert('Campaign feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
        <p className="text-gray-600 mt-2">Manage your email subscribers and campaigns</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Subscribers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Subscribers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Unsubscribed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.unsubscribed}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Recent (Last 30 Days) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last 30 Days</p>
                <p className="text-3xl font-bold text-primary-yellow mt-2">
                  {stats.recentSubscribers}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-yellow" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={sendCampaign}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-red to-soft-red text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Send className="w-5 h-5" />
            Send Campaign
          </button>
          <button
            onClick={exportSubscribers}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Subscribers
          </button>
        </div>
      </div>

      {/* Integration Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Email Marketing Integration
            </h3>
            <p className="text-gray-700 mb-4">
              Connect your email marketing service to send campaigns to your subscribers.
              Supported platforms: Resend, SendGrid, Mailchimp.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Add your email service API key to environment variables</li>
                <li>Configure sender email and name</li>
                <li>Create email templates</li>
                <li>Test email delivery</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Coming Soon: Campaign Manager
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Create and schedule email campaigns</li>
            <li>• Design emails with drag-and-drop builder</li>
            <li>• Track open rates and click-through rates</li>
            <li>• A/B testing for subject lines</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Coming Soon: Automation
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Welcome email series for new subscribers</li>
            <li>• Abandoned cart recovery emails</li>
            <li>• Birthday and special occasion emails</li>
            <li>• Re-engagement campaigns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
