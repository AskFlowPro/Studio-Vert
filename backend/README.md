# 🌿 Studio Vert - Backend API

Backend Node.js pour gérer les fonctionnalités du site Studio Vert.

## 📋 Fonctionnalités

### 1. 📱 Récupération automatique des avis Google
- **Scheduler hebdomadaire** : Tous les lundis à 9h00
- **API manuelle** : Déclenchement à la demande
- Sauvegarde dans `src/assets/google-reviews.json`

### 2. 📧 API d'envoi d'emails
- Formulaire de contact du site
- Email formaté et stylisé
- Support des pièces jointes (à venir)

---

## 🚀 Installation

### 1. Installer les dépendances

```bash
cd backend
npm install
```

### 2. Configurer l'email Gmail

#### A. Activer la validation en 2 étapes

1. Allez sur https://myaccount.google.com/security
2. Cliquez sur "Validation en 2 étapes"
3. Suivez les instructions pour l'activer

#### B. Créer un mot de passe d'application

1. Toujours sur https://myaccount.google.com/security
2. Cherchez "Mots de passe des applications" (en bas de la page)
3. Sélectionnez "Autre (nom personnalisé)"
4. Tapez "Studio Vert Backend"
5. Cliquez sur "Générer"
6. **Copiez le mot de passe** (16 caractères, style : `abcd efgh ijkl mnop`)

#### C. Configurer le fichier .env

Ouvrez le fichier `.env` et ajoutez le mot de passe :

```env
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

⚠️ **Important** : Remplacez `abcd efgh ijkl mnop` par le vrai mot de passe généré !

---

## ▶️ Démarrage

### Mode production
```bash
npm start
```

### Mode développement (avec auto-reload)
```bash
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

---

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```

Réponse :
```json
{
  "status": "OK",
  "message": "Studio Vert Backend API",
  "timestamp": "2026-02-09T..."
}
```

### 2. Envoi de formulaire de contact
```
POST /api/contact
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "06 12 34 56 78",
  "message": "Bonjour, je souhaite un devis..."
}
```

Réponse succès :
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès !"
}
```

### 3. Mise à jour manuelle des avis Google
```
POST /api/update-reviews
```

Réponse succès :
```json
{
  "success": true,
  "message": "Avis Google mis à jour avec succès !"
}
```

---

## ⏰ Scheduler Automatique

Le backend récupère automatiquement les avis Google :
- **Quand** : Tous les lundis à 9h00 (heure de Paris)
- **Où** : Sauvegardés dans `../src/assets/google-reviews.json`
- **Limite** : 5 avis maximum

Pour modifier le planning, éditez cette ligne dans `server.js` :

```javascript
// Exécute tous les lundis à 9h00
cron.schedule('0 9 * * 1', async () => {
  // ...
});
```

### Format cron :
```
┌───────────── minute (0 - 59)
│ ┌───────────── heure (0 - 23)
│ │ ┌───────────── jour du mois (1 - 31)
│ │ │ ┌───────────── mois (1 - 12)
│ │ │ │ ┌───────────── jour de la semaine (0 - 7) (0 et 7 = dimanche)
│ │ │ │ │
0 9 * * 1
```

**Exemples** :
- `0 9 * * 1` = Tous les lundis à 9h00
- `0 0 * * *` = Tous les jours à minuit
- `0 12 * * 0` = Tous les dimanches à midi
- `0 */6 * * *` = Toutes les 6 heures

---

## 🔧 Configuration avancée

### Variables d'environnement (.env)

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `PORT` | Port du serveur | `3000` |
| `GOOGLE_API_KEY` | Clé API Google Places | (déjà configurée) |
| `GOOGLE_PLACE_ID` | ID du lieu Google | (déjà configuré) |
| `EMAIL_TO` | Email de destination | `studiovertpaysage@gmail.com` |
| `EMAIL_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `EMAIL_PORT` | Port SMTP | `587` |
| `EMAIL_USER` | Email d'envoi | `studiovertpaysage@gmail.com` |
| `EMAIL_PASSWORD` | Mot de passe d'application | **À CONFIGURER** |

---

## 🔐 Sécurité

### ⚠️ Fichiers à NE PAS commiter sur Git

Le fichier `.gitignore` devrait contenir :

```
node_modules/
.env
*.log
```

### 🛡️ Bonnes pratiques

1. **Ne jamais partager** votre fichier `.env`
2. **Ne jamais commiter** les mots de passe
3. Utilisez des **mots de passe d'application** Gmail (pas votre mot de passe principal)
4. Régénérez le mot de passe si compromis

---

## 🐛 Dépannage

### Erreur : "Configuration email manquante"
➡️ Vérifiez que `EMAIL_PASSWORD` est bien défini dans `.env`

### Erreur : "Invalid login"
➡️ Vérifiez que :
1. La validation en 2 étapes est activée sur Gmail
2. Vous utilisez un **mot de passe d'application** (pas votre mot de passe Gmail normal)
3. Le mot de passe est correct dans `.env`

### Les avis Google ne se mettent pas à jour
➡️ Vérifiez :
1. La clé API Google est valide
2. L'API Places est activée sur Google Cloud Console
3. Le fichier de destination existe : `../src/assets/google-reviews.json`

### Le scheduler ne fonctionne pas
➡️ Le serveur doit **rester actif** pour que le scheduler fonctionne
➡️ Envisagez d'utiliser un service comme PM2 pour garder le serveur en ligne

---

## 🚀 Déploiement en production

### Option 1 : PM2 (recommandé)

```bash
npm install -g pm2
pm2 start server.js --name studiovert-backend
pm2 save
pm2 startup
```

### Option 2 : Service Windows

Créez un service Windows pour démarrer automatiquement le backend.

### Option 3 : Hébergement cloud

- **Heroku** : Gratuit (avec limitations)
- **Railway** : Gratuit jusqu'à 5$
- **Render** : Gratuit (500h/mois)
- **DigitalOcean** : À partir de 5$/mois

---

## 📞 Support

Pour toute question :
- Email : studiovertpaysage@gmail.com
- GitHub Issues : (si applicable)

---

**🌿 Studio Vert - Entretien et création paysagères**
*Lyon & Alentours*
