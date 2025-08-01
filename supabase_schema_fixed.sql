-- =====================================================
-- SCHEMA SUPABASE POUR VINTED PRO - VERSION CORRIGÉE
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

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: INVENTAIRE
-- =====================================================
CREATE TABLE IF NOT EXISTS inventaire (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('Vêtements', 'Chaussures', 'Sacs', 'Accessoires')),
  description TEXT,
  etat TEXT NOT NULL CHECK (etat IN ('Neuf', 'Très bon état', 'Bon état', 'Correct')),
  marque TEXT,
  taille TEXT,
  prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
  cout DECIMAL(10,2) NOT NULL CHECK (cout >= 0),
  marge DECIMAL(10,2) GENERATED ALWAYS AS (prix - cout) STORED,
  margePourcent DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN prix > 0 THEN ((prix - cout) / prix) * 100 ELSE 0 END) STORED,
  statut TEXT NOT NULL DEFAULT 'En vente' CHECK (statut IN ('En vente', 'Vendu', 'Archivé')),
  vues INTEGER DEFAULT 0 CHECK (vues >= 0),
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  dateAjout DATE DEFAULT CURRENT_DATE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_inventaire_user_id ON inventaire(user_id);
CREATE INDEX IF NOT EXISTS idx_inventaire_statut ON inventaire(statut);
CREATE INDEX IF NOT EXISTS idx_inventaire_categorie ON inventaire(categorie);
CREATE INDEX IF NOT EXISTS idx_inventaire_created_at ON inventaire(created_at);

-- Trigger pour updated_at
CREATE TRIGGER update_inventaire_updated_at 
  BEFORE UPDATE ON inventaire 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: VENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS ventes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article TEXT NOT NULL,
  categorie TEXT NOT NULL,
  acheteur TEXT NOT NULL,
  prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
  cout DECIMAL(10,2) NOT NULL CHECK (cout >= 0),
  marge DECIMAL(10,2) GENERATED ALWAYS AS (prix - cout) STORED,
  margePourcent DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN prix > 0 THEN ((prix - cout) / prix) * 100 ELSE 0 END) STORED,
  date DATE DEFAULT CURRENT_DATE,
  statut TEXT NOT NULL DEFAULT 'En cours' CHECK (statut IN ('Livré', 'Expédié', 'En cours')),
  frais_port DECIMAL(10,2) DEFAULT 0,
  frais_commission DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les ventes
CREATE INDEX IF NOT EXISTS idx_ventes_user_id ON ventes(user_id);
CREATE INDEX IF NOT EXISTS idx_ventes_date ON ventes(date);
CREATE INDEX IF NOT EXISTS idx_ventes_statut ON ventes(statut);

-- Trigger pour updated_at
CREATE TRIGGER update_ventes_updated_at 
  BEFORE UPDATE ON ventes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: STOCK
-- =====================================================
CREATE TABLE IF NOT EXISTS stock (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  seuilAlerte INTEGER NOT NULL DEFAULT 3 CHECK (seuilAlerte >= 0),
  prixUnitaire DECIMAL(10,2) NOT NULL CHECK (prixUnitaire >= 0),
  valeurTotale DECIMAL(10,2) GENERATED ALWAYS AS (quantite * prixUnitaire) STORED,
  statut TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN quantite = 0 THEN 'Rupture'
      WHEN quantite <= seuilAlerte THEN 'Faible'
      ELSE 'Normal'
    END
  ) STORED,
  derniereMiseAJour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour le stock
CREATE INDEX IF NOT EXISTS idx_stock_user_id ON stock(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_statut ON stock(statut);
CREATE INDEX IF NOT EXISTS idx_stock_categorie ON stock(categorie);

-- Trigger pour updated_at
CREATE TRIGGER update_stock_updated_at 
  BEFORE UPDATE ON stock 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: ANALYTICS (pour les statistiques)
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_articles INTEGER DEFAULT 0,
  articles_en_vente INTEGER DEFAULT 0,
  articles_vendus INTEGER DEFAULT 0,
  articles_archives INTEGER DEFAULT 0,
  total_ventes INTEGER DEFAULT 0,
  total_revenus DECIMAL(10,2) DEFAULT 0,
  total_marge DECIMAL(10,2) DEFAULT 0,
  total_vues INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  stock_faible INTEGER DEFAULT 0,
  stock_rupture INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Index pour analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- =====================================================
-- POLITIQUES DE SÉCURITÉ RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

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

-- Politiques pour analytics
CREATE POLICY "Users can view own analytics" ON analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON analytics
  FOR UPDATE USING (auth.uid() = user_id);

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

-- Fonction pour calculer les statistiques (version simplifiée)
CREATE OR REPLACE FUNCTION calculate_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_articles BIGINT,
  articles_en_vente BIGINT,
  articles_vendus BIGINT,
  total_ventes BIGINT,
  total_revenus DECIMAL,
  total_marge DECIMAL,
  stock_faible BIGINT,
  stock_rupture BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(i.id) as total_articles,
    COUNT(CASE WHEN i.statut = 'En vente' THEN 1 END) as articles_en_vente,
    COUNT(CASE WHEN i.statut = 'Vendu' THEN 1 END) as articles_vendus,
    COUNT(v.id) as total_ventes,
    COALESCE(SUM(v.prix), 0) as total_revenus,
    COALESCE(SUM(v.marge), 0) as total_marge,
    COUNT(CASE WHEN s.statut = 'Faible' THEN 1 END) as stock_faible,
    COUNT(CASE WHEN s.statut = 'Rupture' THEN 1 END) as stock_rupture
  FROM inventaire i
  LEFT JOIN ventes v ON v.user_id = user_uuid
  LEFT JOIN stock s ON s.user_id = user_uuid
  WHERE i.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 