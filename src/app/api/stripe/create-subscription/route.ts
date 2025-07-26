import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' } as any);

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();
    if (!email || !plan) {
      return NextResponse.json({ error: 'Email et plan requis' }, { status: 400 });
    }
    const priceId = plan === 'annuel' ? process.env.STRIPE_PRICE_ID_ANNUEL! : process.env.STRIPE_PRICE_ID_MENSUEL!;
    if (!priceId) {
      return NextResponse.json({ error: 'ID de prix Stripe manquant' }, { status: 500 });
    }
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];
    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    // Récupère l'utilisateur pour lier son id dans metadata
    if (!supabase) throw new Error('Supabase non initialisé');
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    // Création de la session Stripe Checkout avec metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/abonnement/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/abonnement/cancel`,
      metadata: {
        email,
        userId: user?.id || ''
      }
    });

    // Enregistrement dans Supabase (optionnel, peut être fait via webhook Stripe après paiement)
    if (user) {
      await supabase
        .from('user_subscriptions')
        .upsert([
          { user_id: user.id, subscription_id: session.subscription }
        ], { onConflict: 'user_id' });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erreur Stripe:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur Stripe' }, { status: 500 });
  }
} 