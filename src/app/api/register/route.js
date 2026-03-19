import getClientPromise from '@/lib/mongodb';

const REQUIRED_FIELDS = [
  'full_name',
  'phone',
  'age',
  'gender',
  'church',
  'emergency_contact_name',
  'emergency_contact_number',
  'emergency_contact_relation',
];

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

    const registration = {
      full_name: String(body.full_name).trim(),
      preferred_name: String(body.preferred_name ?? '').trim(),
      phone: String(body.phone).trim(),
      age,
      gender: String(body.gender).trim(),
      church: String(body.church).trim(),
      address: String(body.address ?? '').trim(),
      emergency_contact_name: String(body.emergency_contact_name).trim(),
      emergency_contact_number: String(body.emergency_contact_number).trim(),
      emergency_contact_relation: String(body.emergency_contact_relation).trim(),
      created_at: new Date(),
    };

    const client = await getClientPromise();
    const db = client.db(process.env.MONGODB_DB || 'breakthrough');
    const result = await db.collection('registrations').insertOne(registration);

    return Response.json(
      {
        ok: true,
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return Response.json(
      {
        error: process.env.NODE_ENV === 'development'
          ? error?.message || 'Server error while saving registration.'
          : 'Server error while saving registration.',
      },
      { status: 500 }
    );
  }
}
