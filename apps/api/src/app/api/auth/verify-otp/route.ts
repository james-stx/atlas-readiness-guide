import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { supabase } from '@/lib/db/supabase';
import { handleApiError } from '@/lib/errors';

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = schema.parse(body);

    // Find user by email
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const user = listData?.users?.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired code.' },
        { status: 400 }
      );
    }

    const { atlas_otp_hash, atlas_otp_expires_at } = user.user_metadata ?? {};

    // Check code hash
    const inputHash = crypto.createHash('sha256').update(code).digest('hex');
    if (!atlas_otp_hash || inputHash !== atlas_otp_hash) {
      return NextResponse.json(
        { error: 'Invalid or expired code.' },
        { status: 400 }
      );
    }

    // Check expiry
    if (!atlas_otp_expires_at || new Date(atlas_otp_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Clear OTP from metadata to prevent reuse
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { atlas_otp_hash: null, atlas_otp_expires_at: null },
    });

    return NextResponse.json({ verified: true, email });
  } catch (error) {
    return handleApiError(error);
  }
}
