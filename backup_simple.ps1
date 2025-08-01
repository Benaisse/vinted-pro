# Script de sauvegarde simple pour Vinted Pro
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "vinted-pro-backup-$timestamp"

Write-Host "=== SAUVEGARDE VINTED PRO ===" -ForegroundColor Green
Write-Host "Creation du dossier de sauvegarde: $backupDir" -ForegroundColor Yellow

# Creer le dossier de sauvegarde
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Copier tous les fichiers du projet
Write-Host "Copie des fichiers..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Exclude "node_modules", ".next", "vinted-pro-backup-*", "backup_*.ps1" | Copy-Item -Destination $backupDir -Recurse -Force

# Creer le fichier d'information de sauvegarde
$backupInfo = "Sauvegarde Vinted Pro`nDate: $(Get-Date)`nDossier: $backupDir`n`nFonctionnalites sauvegardees:`n- Import HTML/CSV pour les ventes`n- Import HTML/CSV pour les boosts`n- Gestion des inventaires`n- Analytics et statistiques`n- Authentification Supabase`n- Base de donnees PostgreSQL"
$backupInfo | Out-File -FilePath "$backupDir\BACKUP_INFO.md" -Encoding UTF8

# Creer les instructions de restauration
$restoreInstructions = "Instructions de Restauration`n`n1. Installer les dependances: npm install`n2. Configurer .env.local avec vos cles Supabase`n3. Lancer: npm run dev`n4. Verifier la base de donnees"
$restoreInstructions | Out-File -FilePath "$backupDir\RESTORE_INSTRUCTIONS.md" -Encoding UTF8

Write-Host "Sauvegarde terminee avec succes!" -ForegroundColor Green
Write-Host "Dossier de sauvegarde: $backupDir" -ForegroundColor Cyan
Write-Host "Fichiers crees: BACKUP_INFO.md, RESTORE_INSTRUCTIONS.md" -ForegroundColor Cyan 