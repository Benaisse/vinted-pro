-- =====================================================
-- SCHEMA SUPABASE POUR VINTED PRO - VERSION FINALE
-- =====================================================

-- Activation des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: PROFILS UTILISATEURS
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: INVENTAIRE
-- =====================================================
CREATE TABLE IF NOT EXISTS inventaire (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL,
  description TEXT,
  etat TEXT NOT NULL,
  marque TEXT,
  taille TEXT,
  prix DECIMAL(10,2) NOT NULL,
  cout DECIMAL(10,2) NOT NULL,
  marge DECIMAL(10,2) GENERATED ALWAYS AS (prix - cout) STORED,
  margePourcent DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN prix > 0 THEN ((prix - cout) / prix) * 100 ELSE 0 END) STORED,
  statut TEXT NOT NULL DEFAULT 'En vente',
  vues INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  date_ajout DATE DEFAULT CURRENT_DATE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_inventaire_user_id ON inventaire(user_id);
CREATE INDEX IF NOT EXISTS idx_inventaire_statut ON inventaire(statut);
CREATE INDEX IF NOT EXISTS idx_inventaire_categorie ON inventaire(categorie);

-- =====================================================
-- TABLE: VENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS ventes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article TEXT NOT NULL,
  categorie TEXT NOT NULL,
  acheteur TEXT NOT NULL,
  prix DECIMAL(10,2) NOT NULL,
  cout DECIMAL(10,2) NOT NULL,
  marge DECIMAL(10,2) GENERATED ALWAYS AS (prix - cout) STORED,
  margePourcent DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN prix > 0 THEN ((prix - cout) / prix) * 100 ELSE 0 END) STORED,
  date_vente DATE DEFAULT CURRENT_DATE,
  statut TEXT NOT NULL DEFAULT 'En cours',
  frais_port DECIMAL(10,2) DEFAULT 0,
  frais_commission DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les ventes
CREATE INDEX IF NOT EXISTS idx_ventes_user_id ON ventes(user_id);
CREATE INDEX IF NOT EXISTS idx_ventes_date_vente ON ventes(date_vente);
CREATE INDEX IF NOT EXISTS idx_ventes_statut ON ventes(statut);

-- =====================================================
-- TABLE: STOCK
-- =====================================================
CREATE TABLE IF NOT EXISTS stock (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 0,
  seuil_alerte INTEGER NOT NULL DEFAULT 3,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  valeur_totale DECIMAL(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
  statut TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN quantite = 0 THEN 'Rupture'
      WHEN quantite <= seuil_alerte THEN 'Faible'
      ELSE 'Normal'
    END
  ) STORED,
  derniere_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour le stock
CREATE INDEX IF NOT EXISTS idx_stock_user_id ON stock(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_statut ON stock(statut);
CREATE INDEX IF NOT EXISTS idx_stock_categorie ON stock(categorie);

-- =====================================================
-- POLITIQUES DE SÉCURITÉ RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour inventaire
CREATE POLICY "Users can view own inventaire" ON inventaire
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventaire" ON inventaire
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventaire" ON inventaire
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventaire" ON inventaire
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour ventes
CREATE POLICY "Users can view own ventes" ON ventes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ventes" ON ventes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ventes" ON ventes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ventes" ON ventes
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour stock
CREATE POLICY "Users can view own stock" ON stock
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stock" ON stock
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stock" ON stock
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stock" ON stock
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- FONCTIONS UTILES
-- =====================================================

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 