import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Erreur Webhook Stripe:', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // Essaye de récupérer l'email ou userId depuis metadata
    const email = session.metadata?.email;
    const userId = session.metadata?.userId;
    let user_id = userId;
    // Si pas d'userId, tente de retrouver l'utilisateur par email
    if (!user_id && email) {
      const { data: user, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      if (user) user_id = user.id;
    }
    if (user_id) {
      // Upsert dans user_subscriptions
      await supabase
        .from('user_subscriptions')
        .upsert([
          {
            user_id,
            subscription_id: session.subscription,
            plan: 'premium',
            status: 'active',
            start_date: new Date().toISOString(),
          }
        ], { onConflict: 'user_id' });
      console.log('Abonnement activé pour user_id:', user_id);
    } else {
      console.warn('Impossible de retrouver l\'utilisateur pour activer l\'abonnement Stripe.');
    }
  }

  return NextResponse.json({ received: true });
} 