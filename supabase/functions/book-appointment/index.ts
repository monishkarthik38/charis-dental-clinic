import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/airtable';
const BASE_ID = 'appbJ9oAfKP6UYaqB';
const TABLE_ID = 'tblDxZOSAoMFSJK7J';

const BodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[+\d\s-]{7,15}$/),
  email: z.string().trim().email().max(120),
  date: z.string().min(1).max(20),
  department: z.string().min(1).max(80),
  message: z.string().trim().max(500).optional().default(''),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');
    const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
    if (!AIRTABLE_API_KEY) throw new Error('AIRTABLE_API_KEY is not configured');

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const d = parsed.data;

    const res = await fetch(`${GATEWAY_URL}/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': AIRTABLE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: d.name,
              Phone: d.phone,
              Email: d.email,
              Date: d.date,
              Department: d.department,
              Message: d.message ?? '',
            },
          },
        ],
        typecast: true,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Airtable error', res.status, data);
      throw new Error(`Airtable API failed [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true, id: data?.records?.[0]?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('book-appointment error:', msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
