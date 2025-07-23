import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export type Subscription = { plan: string; status: string } | null;

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubscription() {
      setLoading(true);
      try {
        if (user && supabase) {
          const { data: subData } = await supabase
            .from('user_subscriptions')
            .select('plan, status')
            .eq('user_id', user.id)
            .single();
          if (subData) setSubscription(subData);
          else setSubscription({ plan: 'free', status: 'active' });
        }
      } catch (e) {
        setError("Erreur lors de la récupération de l'abonnement");
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, [user]);

  const upgradeToPremium = async () => {
    if (!user || !supabase) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert([
          { user_id: user.id, plan: 'premium', status: 'active', start_date: new Date().toISOString() }
        ], { onConflict: 'user_id' });
      if (error) throw error;
      setSubscription({ plan: 'premium', status: 'active' });
      setSuccess('Vous êtes maintenant Premium !');
    } catch (err: any) {
      setError(err.message || 'Erreur lors du passage à Premium');
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    success,
    error,
    upgradeToPremium,
    setSuccess,
    setError,
  };
} 