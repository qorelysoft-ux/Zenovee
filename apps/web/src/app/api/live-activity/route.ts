import { NextResponse } from 'next/server';
import { prisma } from '../_lib/prisma';

export async function GET() {
  try {
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total workflows (tool runs)
    const totalWorkflows = await prisma.toolRun.count();

    // Simulate online users (50-200, with some variation)
    const baseOnline = 120;
    const variation = Math.floor(Math.random() * 40) - 20; // -20 to +20
    const onlineUsers = Math.max(50, Math.min(200, baseOnline + variation));

    // Get recent activities (last 10 tool runs)
    const recentRuns = await prisma.toolRun.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        tool: true,
        user: true,
      },
    });

    // Format activities
    const recentActivities = recentRuns.map((run: any) => ({
      user: run.user.name || run.user.email.split('@')[0] || 'Anonymous',
      action: `generated ${run.tool.name}`,
      time: run.createdAt.toISOString(),
    }));

    // If no real activities, add some simulated ones
    if (recentActivities.length === 0) {
      recentActivities.push(
        { user: 'Sarah', action: 'generated SEO article', time: new Date().toISOString() },
        { user: 'Mike', action: 'created ad copy', time: new Date(Date.now() - 30000).toISOString() },
        { user: 'Emma', action: 'optimized landing page', time: new Date(Date.now() - 60000).toISOString() }
      );
    }

    return NextResponse.json({
      onlineUsers,
      totalUsers,
      totalWorkflows,
      recentActivities,
    });
  } catch (error) {
    console.error('Error fetching live activity:', error);
    // Fallback to simulated data
    return NextResponse.json({
      onlineUsers: 87,
      totalUsers: 1250,
      totalWorkflows: 5432,
      recentActivities: [
        { user: 'Sarah', action: 'generated SEO article', time: new Date().toISOString() },
        { user: 'Mike', action: 'created ad copy', time: new Date(Date.now() - 30000).toISOString() },
        { user: 'Emma', action: 'optimized landing page', time: new Date(Date.now() - 60000).toISOString() },
      ],
    });
  }
}