import getClientPromise from '@/lib/mongodb';

const REQUIRED_FIELDS = [
  'full_name',
  'preferred_name',
  'phone',
  'age',
  'gender',
  'church',
  'small_group_leader',
  'christian_duration',
  'emergency_contact_name',
  'emergency_contact_number',
  'emergency_contact_relation',
];

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

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toUpperTrimmed(value) {
  return String(value ?? '').trim().toUpperCase();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryToken = searchParams.get('token');
    const headerToken = request.headers.get('x-register-read-token');
    const token = headerToken || queryToken;
    const configuredToken = process.env.REGISTER_READ_TOKEN;

    if (!configuredToken) {
      return Response.json({ error: 'Read token is not configured.' }, { status: 403 });
    }

    if (token !== configuredToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const fullName = toUpperTrimmed(body.full_name);
    const preferredName = toUpperTrimmed(body.preferred_name);
    const emergencyContactName = toUpperTrimmed(body.emergency_contact_name);

    if (!isValidName(fullName)) {
      return Response.json({ error: 'Invalid full name. Use letters and spaces only.' }, { status: 400 });
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
    const otherChurch = toUpperTrimmed(body.other_church ?? '');

    if (smallGroupLeader === 'FROM OTHER CHURCH' && !otherChurch) {
      return Response.json({ error: 'other_church is required when selecting FROM OTHER CHURCH.' }, { status: 400 });
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

    const duplicatePreferredName = await db.collection('registrations').findOne({
      preferred_name: { $regex: `^${escapeRegex(preferredName)}$`, $options: 'i' },
    });

    if (duplicatePreferredName) {
      return Response.json(
        { error: 'Preferred name already exists. Please choose a different preferred name.' },
        { status: 409 },
      );
    }

    const registration = {
      full_name: fullName,
      preferred_name: preferredName,
      phone: normalizedPhone,
      age,
      gender: toUpperTrimmed(body.gender),
      church: toUpperTrimmed(body.church),
      small_group_leader: smallGroupLeader,
      other_church: otherChurch,
      christian_duration: christianDuration,
      emergency_contact_name: emergencyContactName,
      emergency_contact_number: normalizedEmergencyPhone,
      emergency_contact_relation: toUpperTrimmed(body.emergency_contact_relation),
      created_at: new Date(),
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
