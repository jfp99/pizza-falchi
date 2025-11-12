import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visit } from '@/models/Analytics';
import { validateCSRFMiddleware } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d

    // Calculate date range
    const startDate = new Date();
    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === '90d') {
      startDate.setDate(startDate.getDate() - 90);
    }

    // Get visit statistics
    const [totalVisits, uniqueVisitors, pageViews, avgDuration] = await Promise.all([
      Visit.countDocuments({ timestamp: { $gte: startDate } }),
      Visit.distinct('sessionId', { timestamp: { $gte: startDate } }).then(ids => ids.length),
      Visit.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Visit.aggregate([
        { $match: { timestamp: { $gte: startDate }, duration: { $gt: 0 } } },
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
      ])
    ]);

    // Get daily visits for chart
    const dailyVisits = await Visit.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      pageViews,
      avgDuration: avgDuration[0]?.avgDuration || 0,
      dailyVisits
    });
  } catch (error) {
    console.error('Error fetching visit analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

  try {
    await connectDB();
    const body = await request.json();

    const visit = await Visit.create({
      page: body.page,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      referrer: request.headers.get('referer') || '',
      sessionId: body.sessionId,
      userId: body.userId,
      timestamp: new Date(),
      duration: body.duration || 0
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { error: 'Erreur lors du tracking de la visite' },
      { status: 500 }
    );
  }
}