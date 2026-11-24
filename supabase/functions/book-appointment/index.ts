import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
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

    // The linked Airtable table currently contains only these two columns.
    const fields: Record<string, string> = {
      Name: d.name,
      Email: d.email,
    };

    const airtableResponse = await fetch(`${GATEWAY_URL}/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': AIRTABLE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
    const responseData = await airtableResponse.json();
    if (!airtableResponse.ok) {
      console.error('Airtable error', airtableResponse.status, responseData);
      throw new Error(`Airtable API failed [${airtableResponse.status}]: ${JSON.stringify(responseData)}`);
    }
    const data = responseData as { records?: Array<{ id?: string }> };

    // Persist to Lovable Cloud DB for the admin status page
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, serviceKey);
      const { error: dbErr } = await supabase.from('appointments').insert({
        name: d.name,
        phone: d.phone,
        email: d.email,
        preferred_date: d.date,
        department: d.department,
        message: d.message || null,
      });
      if (dbErr) console.error('DB insert failed:', dbErr);
    } catch (dbCatch) {
      console.error('DB insert exception:', dbCatch);
    }

    // Fire-and-forget Discord notification (don't block on failure)
    const DISCORD_WEBHOOK_URL = Deno.env.get('DISCORD_WEBHOOK_URL');
    if (DISCORD_WEBHOOK_URL) {
      try {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Charis Dental Clinic',
            embeds: [
              {
                title: '🦷 New Appointment Request',
                color: 0x1d6fd6,
                fields: [
                  { name: '👤 Name', value: d.name, inline: true },
                  { name: '📞 Phone', value: d.phone, inline: true },
                  { name: '✉️ Email', value: d.email, inline: false },
                  { name: '📅 Preferred Date', value: d.date, inline: true },
                  { name: '🏥 Department', value: d.department, inline: true },
                  ...(d.message ? [{ name: '📝 Message', value: d.message, inline: false }] : []),
                ],
                timestamp: new Date().toISOString(),
                footer: { text: 'Charis Dental Clinic • Chennai' },
              },
            ],
          }),
        });
      } catch (notifyErr) {
        console.error('Discord notification failed:', notifyErr);
      }
    }

    return new Response(JSON.stringify({ success: true, id: data.records?.[0]?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('book-appointment error:', msg);
    return new Response(
      JSON.stringify({ success: false, error: 'Appointment submission failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
