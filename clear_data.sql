-- Script pour vider toutes les données de l'utilisateur connecté
-- ATTENTION : Cette action est irréversible !

-- Vider l'inventaire
DELETE FROM inventaire WHERE user_id = auth.uid();

-- Vider les ventes
DELETE FROM ventes WHERE user_id = auth.uid();

-- Vider le stock
DELETE FROM stock WHERE user_id = auth.uid();

-- Vider les boosts
DELETE FROM boosts WHERE user_id = auth.uid();

-- Message de confirmation
SELECT 'Toutes les données ont été supprimées avec succès' as message; 