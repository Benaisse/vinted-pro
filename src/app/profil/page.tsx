"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, LogOut, Edit, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilPage() {
  console.log("SUPABASE_URL (client):", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("SUPABASE_KEY (client):", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log("TEST_VAR:", process.env.NEXT_PUBLIC_TEST_VAR);
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  // DEBUG: Afficher l'état user/loading
  console.log("ProfilPage user:", user, "loading:", loading);
  const [editGeneral, setEditGeneral] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || "");
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url || "/placeholder.svg");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bio, setBio] = useState(user?.user_metadata?.bio || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', postal: '', country: '' });
  const [addressBackup, setAddressBackup] = useState(address);
  const [savingAddress, setSavingAddress] = useState(false);
  const [stats, setStats] = useState({ total_sales: 0, active_listings: 0, average_rating: 0, reviews_count: 0 });
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [notifSuccess, setNotifSuccess] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);

  useEffect(() => {
    async function fetchStatsAndReviewsAndAddressAndSubscription() {
      setLoadingStats(true);
      try {
        if (user && supabase) {
          // Stats
          const { data: statsData } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
          if (statsData) setStats(statsData);
          // Reviews
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
          if (reviewsData) setReviews(reviewsData);
          // Adresse
          const { data: addressData } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', user.id)
            .single();
          if (addressData) setAddress({
            street: addressData.street || '',
            city: addressData.city || '',
            postal: addressData.postal || '',
            country: addressData.country || ''
          });
          // Abonnement
          const { data: subData } = await supabase
            .from('user_subscriptions')
            .select('plan, status')
            .eq('user_id', user.id)
            .single();
          if (subData) setSubscription(subData);
          else setSubscription({ plan: 'free', status: 'active' });
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStatsAndReviewsAndAddressAndSubscription();
  }, [user]);

  useEffect(() => {
    async function testSupabase() {
      try {
        if (!supabase) throw new Error('Supabase non initialisé');
        const { data, error } = await supabase.from("ventes").select("*").limit(1);
        if (error) {
          console.error("❌ Supabase error:", error.message);
        } else {
          console.log("✅ Supabase connecté, données:", data);
        }
      } catch (e) {
        console.error("❌ Exception Supabase:", e);
      }
    }
    testSupabase();
  }, []);

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }
  if (!user) return <div className="text-red-600 text-center mt-10">Utilisateur non authentifié ou session expirée.<br/>Vérifiez votre connexion ou contactez le support.</div>;

  const email = user?.email || '';
  const inscription = user.created_at ? new Date(user.created_at).toLocaleString() : "-";

  // Gestion de l'upload d'image
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  // Sauvegarde des modifications
  const handleSaveGeneral = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    let avatarUrl = avatar;
    try {
      if (avatarFile && supabase && user) {
        // Upload avatar si modifié
        const { data, error: uploadError } = await supabase.storage.from('avatars').upload(`public/${user.id}_${Date.now()}`, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        if (data) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
          avatarUrl = urlData?.publicUrl || avatarUrl;
        }
      }
      if (supabase && user) {
        // Mettre à jour le profil utilisateur
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: name, avatar_url: avatarUrl, bio }
        });
        if (updateError) throw updateError;
        setSuccess("Profil mis à jour !");
        setEditGeneral(false);
      }
    } catch (e: any) {
      setError(e.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // Annuler l'édition
  const handleCancelGeneral = () => {
    setEditGeneral(false);
    setName(user?.user_metadata?.full_name || user?.user_metadata?.name || "");
    setAvatar(user?.user_metadata?.avatar_url || "/placeholder.svg");
    setBio(user?.user_metadata?.bio || "");
    setAvatarFile(null);
    setError("");
    setSuccess("");
  };

  // Gestion du changement de mot de passe
  const handleChangePassword = async () => {
    setChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setPasswordSuccess("Mot de passe modifié avec succès !");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setChangingPassword(false);
    }
  };

  // Gestion des préférences de notifications
  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    setNotifError("");
    setNotifSuccess("");
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ data: { notifications } });
        if (error) throw error;
        setNotifSuccess("Notifications mises à jour !");
      }
    } catch (e: any) {
      setNotifError(e.message || "Erreur lors de la sauvegarde des notifications");
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleUpgradeToPremium = async () => {
    if (!supabase || !user) return;
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert([
          { user_id: user.id, plan: 'premium', status: 'active', start_date: new Date().toISOString() }
        ], { onConflict: 'user_id' });
      if (error) throw error;
      setSubscription({ plan: 'premium', status: 'active' });
      setSuccess('Vous êtes maintenant Premium !');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du passage à Premium');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Titre principal */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold mb-1 text-slate-900">Mon Profil</h1>
          <p className="text-slate-600">Gérez vos informations personnelles et vos paramètres de compte.</p>
        </div>

        {/* Informations Générales */}
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Informations Générales</h2>
              <p className="text-slate-500 text-sm">Mettez à jour votre photo de profil et vos informations personnelles.</p>
            </div>
            {!editGeneral && (
              <button onClick={() => setEditGeneral(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-sm font-medium border border-indigo-100 text-indigo-700 shadow-sm transition">
                <Edit className="w-4 h-4" /> Modifier
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar + nom/email/plan */}
            <div className="flex flex-col items-center md:w-1/3">
              <div className="relative mb-2">
                <Avatar className="h-24 w-24 shadow-lg border-4 border-indigo-100">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-3xl">
                    {name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {editGeneral && (
                  <button
                    className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 shadow hover:bg-indigo-700 transition"
                    onClick={() => fileInputRef.current?.click()}
                    title="Changer la photo"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  aria-label="Changer la photo de profil"
                />
              </div>
              <div className="text-center">
                {editGeneral ? (
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-lg font-bold text-center border-b-2 border-indigo-200 focus:border-indigo-500 outline-none bg-transparent py-1 transition"
                    placeholder="Nom complet"
                    maxLength={40}
                    aria-label="Nom complet"
                  />
                ) : (
                  <div className="text-lg font-bold text-slate-900">{name}</div>
                )}
                <div className="text-slate-500 text-sm">{email}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-yellow-600 font-medium">Plan Gratuit</span>
                </div>
              </div>
            </div>
            {/* Champs éditables */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                  {editGeneral ? (
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-200" />
                  ) : (
                    <div className="bg-slate-100 rounded-xl px-3 py-2">{name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse e-mail</label>
                  <input type="email" value={email} disabled className="w-full border rounded-xl px-3 py-2 bg-slate-100 text-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de téléphone</label>
                  <input type="text" value={user?.user_metadata?.phone || ''} disabled className="w-full border rounded-xl px-3 py-2 bg-slate-100 text-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                  {editGeneral ? (
                    <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full border rounded-xl px-3 py-2 min-h-[40px] focus:ring-2 focus:ring-indigo-200" />
                  ) : (
                    <div className="bg-slate-100 rounded-xl px-3 py-2 min-h-[40px]">{bio || <span className="text-slate-400">Aucune bio renseignée</span>}</div>
                  )}
                </div>
              </div>
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
              {editGeneral && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveGeneral}
                    disabled={saving || !name.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-600 transition text-base shadow-md disabled:opacity-60"
                  >
                    <Save className="w-5 h-5" /> {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button
                    onClick={handleCancelGeneral}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:from-gray-400 hover:to-gray-300 transition text-base shadow-md"
                  >
                    <X className="w-5 h-5" /> Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Adresse de livraison */}
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Adresse de livraison</h2>
              <p className="text-slate-500 text-sm">Mettez à jour votre adresse pour les livraisons.</p>
            </div>
            {!editAddress ? (
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-sm font-medium border border-indigo-100 text-indigo-700 shadow-sm transition"
                onClick={() => {
                  setAddressBackup(address);
                  setEditAddress(true);
                }}
              >
                <Edit className="w-4 h-4" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-sm font-medium border border-green-100 text-green-700 shadow-sm transition"
                  onClick={async () => {
                    setSavingAddress(true);
                    setError("");
                    setSuccess("");
                    try {
                      if (user && supabase) {
                        // On suppose une table 'user_addresses' avec user_id, street, city, postal, country
                        const { error: upsertError } = await supabase
                          .from('user_addresses')
                          .upsert([
                            {
                              user_id: user.id,
                              street: address.street,
                              city: address.city,
                              postal: address.postal,
                              country: address.country
                            }
                          ], { onConflict: 'user_id' });
                        if (upsertError) throw upsertError;
                        setSuccess("Adresse enregistrée avec succès !");
                        setTimeout(() => setSuccess("") , 2500);
                      }
                      setEditAddress(false);
                    } catch (err: any) {
                      setError(err.message || "Erreur lors de la sauvegarde de l'adresse");
                    } finally {
                      setSavingAddress(false);
                    }
                  }}
                  disabled={savingAddress}
                >
                  <Save className="w-4 h-4" /> {savingAddress ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium border border-gray-200 text-gray-700 shadow-sm transition"
                  onClick={() => {
                    setAddress(addressBackup);
                    setEditAddress(false);
                  }}
                  disabled={savingAddress}
                >
                  <X className="w-4 h-4" /> Annuler
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rue et numéro</label>
              <input
                type="text"
                value={address.street}
                onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                disabled={!editAddress}
                className={`w-full border rounded-xl px-3 py-2 ${editAddress ? "bg-white" : "bg-slate-100 text-slate-500"}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
              <input
                type="text"
                value={address.city}
                onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                disabled={!editAddress}
                className={`w-full border rounded-xl px-3 py-2 ${editAddress ? "bg-white" : "bg-slate-100 text-slate-500"}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Code postal</label>
              <input
                type="text"
                value={address.postal}
                onChange={e => setAddress(a => ({ ...a, postal: e.target.value }))}
                disabled={!editAddress}
                className={`w-full border rounded-xl px-3 py-2 ${editAddress ? "bg-white" : "bg-slate-100 text-slate-500"}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
              <input
                type="text"
                value={address.country}
                onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                disabled={!editAddress}
                className={`w-full border rounded-xl px-3 py-2 ${editAddress ? "bg-white" : "bg-slate-100 text-slate-500"}`}
              />
            </div>
          </div>
        </section>

        {/* Paramètres du Compte & Abonnement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paramètres du Compte */}
          <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 mb-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Paramètres du Compte</h2>
              <p className="text-slate-500 text-sm">Gérez votre mot de passe et vos préférences de notification.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full border rounded-xl px-3 py-2" autoComplete="current-password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border rounded-xl px-3 py-2" autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le nouveau mot de passe</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border rounded-xl px-3 py-2" autoComplete="new-password" />
              </div>
              {passwordError && <div className="text-red-600 text-sm mb-2">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-600 text-sm mb-2">{passwordSuccess}</div>}
              <button onClick={handleChangePassword} disabled={changingPassword} className="w-full bg-gray-900 text-white py-2 rounded-xl font-semibold mt-2 hover:bg-gray-800 transition disabled:opacity-60">
                {changingPassword ? "Changement..." : "Changer le mot de passe"}
              </button>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" checked={notifications.email} onChange={() => setNotifications(n => ({ ...n, email: !n.email }))} />
                <span className="text-sm text-slate-600">Notifications par e-mail</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={notifications.push} onChange={() => setNotifications(n => ({ ...n, push: !n.push }))} />
                <span className="text-sm text-slate-600">Notifications push</span>
              </div>
             {(notifError || notifSuccess) && <div className={notifError ? "text-red-600 text-sm mb-2" : "text-green-600 text-sm mb-2"}>{notifError || notifSuccess}</div>}
             <button onClick={handleSaveNotifications} disabled={savingNotifications} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold mt-2 hover:bg-indigo-700 transition disabled:opacity-60">
               {savingNotifications ? "Enregistrement..." : "Enregistrer les préférences"}
             </button>
            </div>
          </section>
          {/* Abonnement */}
          <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 mb-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Abonnement</h2>
              <p className="text-slate-500 text-sm">Gérez votre plan et vos informations de paiement.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 mb-4">
              <div className="font-medium text-purple-700 mb-1">
                Plan Actuel : {subscription?.plan === 'premium' ? 'Premium' : 'Gratuit'}
              </div>
              <div className="text-xs text-purple-600">
                {subscription?.plan === 'premium'
                  ? 'Articles et ventes illimités, alertes IA, analytics avancées.'
                  : 'Limité à 50 articles et 25 ventes/mois.'}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-lg">Premium</div>
                <div className="text-2xl font-bold">19€<span className="text-base font-normal">/mois</span></div>
              </div>
              <ul className="text-sm mb-4 space-y-1">
                <li>✓ Articles illimités</li>
                <li>✓ Alertes IA personnalisées</li>
                <li>✓ Analytics avancées</li>
              </ul>
              <button
                className="w-full bg-white/90 text-purple-700 font-semibold rounded-xl py-2 hover:bg-white transition"
                onClick={handleUpgradeToPremium}
                disabled={subscription?.plan === 'premium'}
              >
                {subscription?.plan === 'premium' ? 'Déjà Premium' : 'Passer à Premium'}
              </button>
            </div>
            <div className="bg-slate-100 rounded-xl p-4">
              <div className="text-sm text-slate-700 mb-1">Méthode de paiement</div>
              <div className="flex items-center justify-between">
                <span>Carte se terminant par **** 4242</span>
                <button className="text-blue-600 hover:underline text-sm">Modifier</button>
              </div>
            </div>
          </section>
        </div>

        {/* Statistiques & Avis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statistiques */}
          <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 mb-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Statistiques Vinted</h2>
              <p className="text-slate-500 text-sm">Aperçu de vos performances sur Vinted.</p>
            </div>
            {loadingStats ? (
              <div className="text-center text-slate-400">Chargement...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">{stats.total_sales}</div>
                  <div className="text-xs text-blue-700 mt-1">Ventes totales</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">{stats.active_listings}</div>
                  <div className="text-xs text-green-700 mt-1">Articles en ligne</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">{stats.average_rating}</div>
                  <div className="text-xs text-yellow-700 mt-1">Note moyenne ({stats.reviews_count} avis)</div>
                </div>
              </div>
            )}
          </section>
          {/* Avis */}
          <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 mb-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Vos Avis</h2>
              <p className="text-slate-500 text-sm">Les retours de vos acheteurs sur Vinted.</p>
            </div>
            {loadingStats ? (
              <div className="text-center text-slate-400">Chargement...</div>
            ) : (
              <div className="space-y-4">
                {reviews.length === 0 && <div className="text-slate-400 text-sm">Aucun avis pour le moment.</div>}
                {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{review.author}</span>
                      <span className="text-yellow-500">{'★'.repeat(Math.round(review.rating))}{'☆'.repeat(5 - Math.round(review.rating))}</span>
                      <span className="text-xs text-slate-400">{review.rating}/5</span>
                    </div>
                    <div className="text-sm text-slate-700 mb-1">"{review.comment}"</div>
                    <div className="text-xs text-slate-400">
                      {review.date ? `Il y a ${getRelativeTime(review.date)}` : ''}
                      {review.product ? ` - ${review.product}` : ''}
                    </div>
                  </div>
                ))}
                {reviews.length > 2 && (
                  <button className="w-full text-blue-600 hover:underline text-sm mt-2" onClick={() => setShowAllReviews(v => !v)}>
                    {showAllReviews ? 'Réduire' : 'Voir tous les avis'}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} sec`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} jours`;
  return date.toLocaleDateString();
} 