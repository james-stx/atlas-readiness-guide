import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { supabase } from '@/lib/db/supabase';
import { getResendClient, EMAIL_CONFIG } from '@/lib/email';
import { handleApiError } from '@/lib/errors';

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Find existing user or create one
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existingUser = listData?.users?.find((u) => u.email === email);

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUserData, error: createError } =
        await supabase.auth.admin.createUser({ email, email_confirm: true });
      if (createError || !newUserData?.user) {
        throw new Error(createError?.message ?? 'Failed to create user');
      }
      userId = newUserData.user.id;
    }

    // Store OTP hash in user_metadata (30-min expiry)
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { atlas_otp_hash: codeHash, atlas_otp_expires_at: expiresAt },
    });
    if (updateError) throw new Error(updateError.message);

    // Send email via Resend
    const resend = getResendClient();
    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: `${code} is your Atlas sign-in code`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
          <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#111;">Your sign-in code</h2>
          <p style="margin:0 0 24px;color:#555;font-size:15px;">Enter this code to sign in to Atlas Readiness Guide:</p>
          <div style="background:#f5f4ef;border-radius:10px;padding:28px;text-align:center;font-size:44px;font-weight:700;letter-spacing:10px;color:#111;font-family:monospace;">
            ${code}
          </div>
          <p style="margin:24px 0 0;color:#999;font-size:13px;">Expires in 30 minutes. If you didn't request this, you can safely ignore it.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
