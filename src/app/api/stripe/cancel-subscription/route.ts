import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' } as any);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    if (!supabase) throw new Error('Supabase non initialisé');
    const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    const { data: sub } = await supabase.from('user_subscriptions').select('subscription_id').eq('user_id', user.id).single();
    if (!sub?.subscription_id) return NextResponse.json({ error: 'Aucune souscription Stripe trouvée' }, { status: 404 });
    await stripe.subscriptions.update(sub.subscription_id, { cancel_at_period_end: true });
    await supabase.from('user_subscriptions').update({ status: 'cancelled', plan: 'free' }).eq('user_id', user.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
} 