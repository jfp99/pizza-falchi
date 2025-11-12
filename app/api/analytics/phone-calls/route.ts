import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PhoneCall } from '@/models/Analytics';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateCSRFMiddleware } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const status = searchParams.get('status'); // handled or unhandled

    // Calculate date range
    const startDate = new Date();
    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === '90d') {
      startDate.setDate(startDate.getDate() - 90);
    }

    const query: any = { timestamp: { $gte: startDate } };
    if (status === 'handled') {
      query.handled = true;
    } else if (status === 'unhandled') {
      query.handled = false;
    }

    const calls = await PhoneCall.find(query)
      .populate('handledBy', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);

    // Get statistics
    const [totalCalls, handledCalls, averageDuration, callsByPurpose] = await Promise.all([
      PhoneCall.countDocuments({ timestamp: { $gte: startDate } }),
      PhoneCall.countDocuments({ timestamp: { $gte: startDate }, handled: true }),
      PhoneCall.aggregate([
        { $match: { timestamp: { $gte: startDate }, duration: { $gt: 0 } } },
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
      ]),
      PhoneCall.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$purpose', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return NextResponse.json({
      calls,
      stats: {
        totalCalls,
        handledCalls,
        unhandledCalls: totalCalls - handledCalls,
        averageDuration: averageDuration[0]?.avgDuration || 0,
        callsByPurpose
      }
    });
  } catch (error) {
    console.error('Error fetching phone call analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des appels' },
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
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const phoneCall = await PhoneCall.create({
      phoneNumber: body.phoneNumber,
      customerName: body.customerName,
      purpose: body.purpose,
      duration: body.duration,
      notes: body.notes,
      handled: body.handled || false,
      handledBy: body.handled ? session.user.id : undefined,
      timestamp: new Date()
    });

    return NextResponse.json(phoneCall, { status: 201 });
  } catch (error) {
    console.error('Error creating phone call record:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de l\'appel' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('id');

    if (!callId) {
      return NextResponse.json({ error: 'ID de l\'appel requis' }, { status: 400 });
    }

    const body = await request.json();

    const phoneCall = await PhoneCall.findByIdAndUpdate(
      callId,
      {
        ...body,
        handledBy: body.handled ? session.user.id : undefined
      },
      { new: true }
    );

    if (!phoneCall) {
      return NextResponse.json({ error: 'Appel non trouvé' }, { status: 404 });
    }

    return NextResponse.json(phoneCall);
  } catch (error) {
    console.error('Error updating phone call:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'appel' },
      { status: 500 }
    );
  }
}