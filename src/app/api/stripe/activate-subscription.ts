import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();
    if (!email || !plan) {
      return NextResponse.json({ error: 'Email et plan requis' }, { status: 400 });
    }
    // Récupérer l'utilisateur par email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (userError || !user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    // Upsert l'abonnement
    const { error: upsertError } = await supabase
      .from('user_subscriptions')
      .upsert([
        { user_id: user.id, plan, status: 'active', start_date: new Date().toISOString() }
      ], { onConflict: 'user_id' });
    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
} 