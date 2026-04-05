'use client';

import { useEffect, useState } from 'react';

interface Activity {
  user: string;
  action: string;
  time: string;
}

interface LiveData {
  onlineUsers: number;
  totalUsers: number;
  totalWorkflows: number;
  recentActivities: Activity[];
}

export default function LiveActivity() {
  const [data, setData] = useState<LiveData | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/live-activity');
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
      }
    } catch (error) {
      console.error('Failed to fetch live activity:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 px-4 py-2 text-sm text-gray-300 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {data.onlineUsers} users online now
          </span>
          <span>{data.totalUsers.toLocaleString()} total users</span>
          <span>{data.totalWorkflows.toLocaleString()} workflows generated</span>
        </div>
        <div className="flex items-center space-x-4 overflow-hidden">
          {data.recentActivities.slice(0, 3).map((activity, index) => (
            <span key={index} className="truncate">
              {activity.user} {activity.action}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}