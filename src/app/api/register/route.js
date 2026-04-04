import { ObjectId } from 'mongodb';
import getClientPromise from '@/lib/mongodb';

const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'preferred_name',
  'phone',
  'age',
  'gender',
  'small_group_leader',
  'christian_duration',
  'payment_method',
  'emergency_contact_name',
  'emergency_contact_number',
  'emergency_contact_relation',
];

const PAYMENT_METHODS = new Set(['GCASH', 'BANK TRANSFER', 'CASH']);
const PAYMENT_STATUSES = new Set(['UNPAID', 'PAID']);

function getAuthorizedToken(request) {
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  const headerToken = request.headers.get('x-register-read-token');
  return headerToken || queryToken;
}

function isAuthorized(request) {
  const token = getAuthorizedToken(request);
  const configuredToken = process.env.REGISTER_READ_TOKEN;

  if (!configuredToken) {
    return { ok: false, status: 403, error: 'Read token is not configured.' };
  }

  if (token !== configuredToken) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  return { ok: true };
}

function normalizePhilippineMobile(value) {
  const cleaned = String(value ?? '').trim().replace(/[\s()-]/g, '');
  if (/^09\d{9}$/.test(cleaned)) return `+63${cleaned.slice(1)}`;
  if (/^\+639\d{9}$/.test(cleaned)) return cleaned;
  if (/^639\d{9}$/.test(cleaned)) return `+${cleaned}`;
  return null;
}

function isValidName(value) {
  return /^[A-Za-z\s]+$/.test(String(value ?? '').trim());
}

function toUpperTrimmed(value) {
  return String(value ?? '').trim().toUpperCase();
}

export async function GET(request) {
  try {
    const auth = isAuthorized(request);
    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);

    const limitParam = Number(searchParams.get('limit') || 100);
    const limit = Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, 500)
      : 100;

    const client = await getClientPromise();
    const db = client.db(process.env.MONGODB_DB || 'breakthrough');

    const records = await db
      .collection('registrations')
      .find({}, { sort: { created_at: -1 }, limit })
      .toArray();

    return Response.json(
      {
        ok: true,
        count: records.length,
        records,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Registration API GET error:', error);
    return Response.json(
      {
        error:
          process.env.NODE_ENV === 'development'
            ? error?.message || 'Server error while reading registrations.'
            : 'Server error while reading registrations.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (!String(body[field] ?? '').trim()) {
        return Response.json({ error: `${field} is required.` }, { status: 400 });
      }
    }

    const age = Number(body.age);
    if (Number.isNaN(age) || age < 10 || age > 65) {
      return Response.json({ error: 'Age must be between 10 and 65.' }, { status: 400 });
    }

    const firstName = toUpperTrimmed(body.first_name);
    const lastName = toUpperTrimmed(body.last_name);
    const preferredName = toUpperTrimmed(body.preferred_name);
    const emergencyContactName = toUpperTrimmed(body.emergency_contact_name);

    if (!isValidName(firstName)) {
      return Response.json({ error: 'Invalid first name. Use letters and spaces only.' }, { status: 400 });
    }

    if (!isValidName(lastName)) {
      return Response.json({ error: 'Invalid last name. Use letters and spaces only.' }, { status: 400 });
    }

    if (!isValidName(preferredName)) {
      return Response.json({ error: 'Invalid preferred name. Use letters and spaces only.' }, { status: 400 });
    }

    if (!isValidName(emergencyContactName)) {
      return Response.json({ error: 'Invalid emergency contact name. Use letters and spaces only.' }, { status: 400 });
    }

    const normalizedPhone = normalizePhilippineMobile(body.phone);
    const normalizedEmergencyPhone = normalizePhilippineMobile(body.emergency_contact_number);
    const smallGroupLeader = toUpperTrimmed(body.small_group_leader);
    const christianDuration = toUpperTrimmed(body.christian_duration);
    const paymentMethod = toUpperTrimmed(body.payment_method);
    const otherChurch = toUpperTrimmed(body.other_church ?? '');

    if (smallGroupLeader === 'FROM OTHER CHURCH' && !otherChurch) {
      return Response.json({ error: 'other_church is required when selecting FROM OTHER CHURCH.' }, { status: 400 });
    }

    if (!PAYMENT_METHODS.has(paymentMethod)) {
      return Response.json({ error: 'Invalid payment method.' }, { status: 400 });
    }

    if (!normalizedPhone) {
      return Response.json(
        { error: 'Invalid phone number. Use PH mobile format: 09XXXXXXXXX, +639XXXXXXXXX, or 639XXXXXXXXX.' },
        { status: 400 },
      );
    }

    if (!normalizedEmergencyPhone) {
      return Response.json(
        { error: 'Invalid emergency contact number. Use PH mobile format: 09XXXXXXXXX, +639XXXXXXXXX, or 639XXXXXXXXX.' },
        { status: 400 },
      );
    }

    const client = await getClientPromise();
    const db = client.db(process.env.MONGODB_DB || 'breakthrough');

    const duplicate = await db.collection('registrations').findOne({
      first_name: { $regex: `^${firstName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      last_name: { $regex: `^${lastName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });

    if (duplicate) {
      return Response.json(
        { error: 'A registration with the same first and last name already exists.' },
        { status: 409 },
      );
    }

    const registration = {
      first_name: firstName,
      last_name: lastName,
      preferred_name: preferredName,
      phone: normalizedPhone,
      age,
      gender: toUpperTrimmed(body.gender),
      small_group_leader: smallGroupLeader,
      other_church: otherChurch,
      christian_duration: christianDuration,
      payment_method: paymentMethod,
      payment_status: 'UNPAID',
      emergency_contact_name: emergencyContactName,
      emergency_contact_number: normalizedEmergencyPhone,
      emergency_contact_relation: toUpperTrimmed(body.emergency_contact_relation),
      created_at: new Date(),
      payment_status_updated_at: null,
    };

    const result = await db.collection('registrations').insertOne(registration);

    return Response.json(
      {
        ok: true,
        id: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return Response.json(
      {
        error:
          process.env.NODE_ENV === 'development'
            ? error?.message || 'Server error while saving registration.'
            : 'Server error while saving registration.',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const auth = isAuthorized(request);
    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const recordId = String(body.id ?? '').trim();
    const paymentStatus = toUpperTrimmed(body.payment_status);

    if (!ObjectId.isValid(recordId)) {
      return Response.json({ error: 'Invalid registration id.' }, { status: 400 });
    }

    if (!PAYMENT_STATUSES.has(paymentStatus)) {
      return Response.json({ error: 'Invalid payment status.' }, { status: 400 });
    }

    const client = await getClientPromise();
    const db = client.db(process.env.MONGODB_DB || 'breakthrough');

    const result = await db.collection('registrations').findOneAndUpdate(
      { _id: new ObjectId(recordId) },
      {
        $set: {
          payment_status: paymentStatus,
          payment_status_updated_at: new Date(),
        },
      },
      { returnDocument: 'after' },
    );

    if (!result) {
      return Response.json({ error: 'Registration not found.' }, { status: 404 });
    }

    return Response.json({ ok: true, record: result }, { status: 200 });
  } catch (error) {
    console.error('Registration API PATCH error:', error);
    return Response.json(
      {
        error:
          process.env.NODE_ENV === 'development'
            ? error?.message || 'Server error while updating payment status.'
            : 'Server error while updating payment status.',
      },
      { status: 500 },
    );
  }
}
