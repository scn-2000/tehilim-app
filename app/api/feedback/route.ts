import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message, email, page } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.from('feedback').insert({
      user_email: email?.trim() || null,
      message: message.trim(),
      page: page || '/',
    });

    await resend.emails.send({
      from: 'TehilimForAll <onboarding@resend.dev>',
      to: 'samuel.c.nejman@gmail.com',
      subject: 'TehilimForAll Feedback',
      html: `
        <h2>New Feedback</h2>
        <p><strong>Message:</strong></p>
        <p>${message.trim().replace(/\n/g, '<br>')}</p>
        <hr>
        <p><strong>From:</strong> ${email?.trim() || 'Anonymous'}</p>
        <p><strong>Page:</strong> ${page || '/'}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feedback error:', err);
    return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 });
  }
}
