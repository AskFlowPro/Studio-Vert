#!/usr/bin/env node
/**
 * Backend Server pour Studio Vert
 *
 * Fonctionnalités:
 * 1. Récupération automatique hebdomadaire des avis Google
 * 2. API d'envoi d'email pour le formulaire de contact
 *
 * Installation:
 *   cd backend
 *   npm install
 *
 * Démarrage:
 *   npm start
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============ CONFIGURATION ============
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyCrKEvFxcABHXKD-E6xxNe_YwviEXROGuE";
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJwfhSL4Pq9EcRqcmswNRXNzU";
const EMAIL_TO = process.env.EMAIL_TO || "studiovertpaysage@gmail.com";
const MAX_REVIEWS = 5;

// Configuration email (à compléter)
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '', // Votre email
    pass: process.env.EMAIL_PASSWORD || '' // Mot de passe d'application Gmail
  }
};

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ FONCTION: RÉCUPÉRATION AVIS GOOGLE ============
async function fetchGoogleReviews() {
  console.log('🔍 Récupération des avis Google...');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_API_KEY}&language=fr`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== 'OK') {
      console.error(`❌ Erreur API Google: ${data.status}`);
      console.error(`   Message: ${data.error_message || 'Aucun message'}`);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return null;
  }
}

function formatReviews(googleData) {
  if (!googleData || !googleData.reviews) {
    console.error('❌ Aucun avis trouvé');
    return [];
  }

  const reviews = [];
  for (const review of googleData.reviews.slice(0, MAX_REVIEWS)) {
    reviews.push({
      author: review.author_name || 'Anonyme',
      initial: (review.author_name || 'A')[0].toUpperCase(),
      text: review.text || '',
      rating: review.rating || 5,
      date: review.relative_time_description || ''
    });
  }

  return reviews;
}

async function saveReviews(reviews) {
  if (!reviews || reviews.length === 0) {
    console.error('❌ Aucun avis à sauvegarder');
    return false;
  }

  const outputPath = path.join(__dirname, '../src/assets/google-reviews.json');

  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(reviews, null, 2), 'utf-8');
    console.log(`✅ ${reviews.length} avis sauvegardés dans ${outputPath}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error.message);
    return false;
  }
}

async function updateGoogleReviews() {
  console.log('\n' + '='.repeat(50));
  console.log('📱 Studio Vert - Mise à jour des avis Google');
  console.log('='.repeat(50) + '\n');

  const googleData = await fetchGoogleReviews();
  if (!googleData) return false;

  const reviews = formatReviews(googleData);
  const success = await saveReviews(reviews);

  if (success) {
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Succès ! ${reviews.length} avis récupérés`);
    console.log(`⭐ Note moyenne: ${googleData.rating || 'N/A'}`);
    console.log(`📊 Nombre total d'avis: ${googleData.user_ratings_total || 'N/A'}`);
    console.log('='.repeat(50) + '\n');
  }

  return success;
}

// ============ SCHEDULER HEBDOMADAIRE ============
// Exécute tous les lundis à 9h00
cron.schedule('0 9 * * 1', async () => {
  console.log('⏰ Tâche planifiée: Mise à jour hebdomadaire des avis Google');
  await updateGoogleReviews();
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});

console.log('✅ Scheduler configuré: mise à jour des avis tous les lundis à 9h00');

// ============ SÉCURITÉ: VALIDATION & SANITIZATION ============
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';

  // Supprimer les balises HTML
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Supprimer les scripts potentiels
  sanitized = sanitized.replace(/javascript:/gi, '')
                       .replace(/on\w+\s*=/gi, '');

  return sanitized.trim();
}

function containsURL(text) {
  // Détecte les URLs (http://, https://, www., .com, .fr, etc.)
  const urlPattern = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(com|fr|net|org|io|co|be|ch|de|uk|eu|info|biz))/gi;
  return urlPattern.test(text);
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  // Accepte les formats: 0612345678, 06 12 34 56 78, +33612345678, etc.
  const phonePattern = /^[\d\s\+\-\(\)]{10,20}$/;
  return phonePattern.test(phone);
}

// ============ API: ENVOI EMAIL FORMULAIRE DE CONTACT ============
app.post('/api/contact', async (req, res) => {
  console.log('\n📧 Nouvelle demande de contact reçue');

  let { name, email, phone, message } = req.body;

  // Validation basique
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez remplir tous les champs obligatoires'
    });
  }

  // Sanitization
  name = sanitizeInput(name);
  email = sanitizeInput(email);
  phone = phone ? sanitizeInput(phone) : '';
  message = sanitizeInput(message);

  // Validation email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Adresse email invalide'
    });
  }

  // Validation téléphone (si fourni)
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Numéro de téléphone invalide'
    });
  }

  // Vérifier la présence de liens dans le nom ou le message
  if (containsURL(name) || containsURL(message)) {
    console.warn('⚠️ Tentative de spam détectée: URL dans le formulaire');
    return res.status(400).json({
      success: false,
      message: 'Les liens ne sont pas autorisés dans le formulaire'
    });
  }

  // Limiter la longueur des champs
  if (name.length > 100 || message.length > 2000 || (phone && phone.length > 30)) {
    return res.status(400).json({
      success: false,
      message: 'Un ou plusieurs champs sont trop longs'
    });
  }

  // Vérifier la configuration email
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    console.error('❌ Configuration email manquante');
    return res.status(500).json({
      success: false,
      message: 'Erreur de configuration du serveur email'
    });
  }

  try {
    // Créer le transporteur email
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    // Vérifier la connexion
    await transporter.verify();

    // Composer l'email
    const mailOptions = {
      from: `"Studio Vert Contact" <${EMAIL_CONFIG.auth.user}>`,
      to: EMAIL_TO,
      replyTo: email,
      subject: `🌿 Nouveau contact: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6B7553 0%, #9BAA7F 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #F5F1E8; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #6B7553; display: block; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-radius: 5px; border-left: 4px solid #9BAA7F; }
            .footer { text-align: center; margin-top: 20px; color: #6B6B6B; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌿 STUDIO VERT</h1>
              <p style="margin: 10px 0 0 0;">Nouvelle demande de contact</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">👤 Nom</span>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <span class="label">📧 Email</span>
                <div class="value"><a href="mailto:${email}" style="color: #6B7553; text-decoration: none;">${email}</a></div>
              </div>

              ${phone ? `
              <div class="field">
                <span class="label">📱 Téléphone</span>
                <div class="value"><a href="tel:${phone}" style="color: #6B7553; text-decoration: none;">${phone}</a></div>
              </div>
              ` : ''}

              <div class="field">
                <span class="label">💬 Message</span>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Envoyé depuis le formulaire de contact de studiovert.fr</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email envoyé avec succès:', info.messageId);

    res.json({
      success: true,
      message: 'Votre message a été envoyé avec succès !'
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    });
  }
});

// ============ API: MISE À JOUR MANUELLE DES AVIS ============
app.post('/api/update-reviews', async (req, res) => {
  console.log('\n🔄 Mise à jour manuelle des avis Google demandée');

  const success = await updateGoogleReviews();

  if (success) {
    res.json({
      success: true,
      message: 'Avis Google mis à jour avec succès !'
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des avis'
    });
  }
});

// ============ ROUTES DE TEST ============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Studio Vert Backend API',
    timestamp: new Date().toISOString()
  });
});

// ============ DÉMARRAGE DU SERVEUR ============
app.listen(PORT, async () => {
  console.log('\n' + '='.repeat(50));
  console.log('🌿 STUDIO VERT - Backend Server');
  console.log('='.repeat(50));
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50) + '\n');

  // Mise à jour initiale des avis au démarrage
  console.log('🔄 Mise à jour initiale des avis Google...');
  await updateGoogleReviews();
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
});
