/**
 * Firebase Functions pour Studio Vert
 *
 * Fonctionnalités:
 * 1. Envoi d'emails pour le formulaire de contact
 * 2. Récupération hebdomadaire des avis Google (scheduled function)
 */

// Charger les variables d'environnement depuis .env
require('dotenv').config();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const axios = require('axios');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

// Configurer Firestore pour utiliser la base de données nommée
const db = admin.firestore();
db.settings({
  databaseId: 'studiovert-database'
});

// ============ CONFIGURATION ============
const CONFIG = {
  googleApiKey: process.env.GOOGLE_API_KEY || 'AIzaSyCrKEvFxcABHXKD-E6xxNe_YwviEXROGuE',
  googlePlaceId: process.env.GOOGLE_PLACE_ID || 'ChIJwfhSL4Pq9EcRqcmswNRXNzU',
  emailTo: process.env.EMAIL_TO || 'studiovertpaysage@gmail.com',
  emailUser: process.env.EMAIL_USER || 'studiovertpaysage@gmail.com',
  emailPassword: process.env.EMAIL_PASSWORD || '',
};

// Configuration email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: CONFIG.emailUser,
    pass: CONFIG.emailPassword
  }
});

// ============ FONCTIONS DE SÉCURITÉ ============
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/javascript:/gi, '')
                       .replace(/on\w+\s*=/gi, '');

  return sanitized.trim();
}

function containsURL(text) {
  const urlPattern = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(com|fr|net|org|io|co|be|ch|de|uk|eu|info|biz))/gi;
  return urlPattern.test(text);
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const phonePattern = /^[\d\s\+\-\(\)]{10,20}$/;
  return phonePattern.test(phone);
}

// ============ FONCTION: RÉCUPÉRATION AVIS GOOGLE ============
async function fetchGoogleReviews() {
  console.log('🔍 Récupération des avis Google...');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${CONFIG.googlePlaceId}&fields=reviews,rating,user_ratings_total&key=${CONFIG.googleApiKey}&language=fr`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== 'OK') {
      console.error(`❌ Erreur API Google: ${data.status}`);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return null;
  }
}

function formatReviews(googleData) {
  if (!googleData || !googleData.reviews) {
    return [];
  }

  // Filtrer uniquement les avis 5 étoiles
  const fiveStarReviews = googleData.reviews.filter(review => review.rating === 5);

  // Trier par date (les plus récents d'abord basé sur le timestamp)
  fiveStarReviews.sort((a, b) => (b.time || 0) - (a.time || 0));

  // Limiter à 4 avis maximum
  const reviews = [];
  for (const review of fiveStarReviews.slice(0, 4)) {
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

// ============ SCHEDULED FUNCTION: MISE À JOUR HEBDOMADAIRE DES AVIS ============
// Exécute tous les lundis à 9h00 (Europe/Paris)
exports.updateGoogleReviewsScheduled = functions.pubsub
  .schedule('0 9 * * 1')
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    console.log('⏰ Mise à jour hebdomadaire des avis Google');

    try {
      const googleData = await fetchGoogleReviews();
      if (!googleData) {
        console.error('❌ Impossible de récupérer les avis');
        return null;
      }

      const reviews = formatReviews(googleData);

      // Sauvegarder dans Firestore
      await admin.firestore().collection('config').doc('reviews').set({
        reviews: reviews,
        rating: googleData.rating,
        totalReviews: googleData.user_ratings_total,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ ${reviews.length} avis mis à jour avec succès`);
      return null;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      return null;
    }
  });

// ============ HTTP FUNCTION: API ENVOI EMAIL ============
const app = express();
app.use(cors({ origin: true }));

app.post('/contact', express.json({ limit: '10mb' }), async (req, res) => {
  console.log('📧 Nouvelle demande de contact');

  try {
    let { name, email, phone, message, attachments = [] } = req.body;

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

    // Validation téléphone
    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone invalide'
      });
    }

    // Bloquer les liens
    if (containsURL(name) || containsURL(message)) {
      console.warn('⚠️ Spam détecté: URL dans le formulaire');
      return res.status(400).json({
        success: false,
        message: 'Les liens ne sont pas autorisés dans le formulaire'
      });
    }

    // Limiter la longueur
    if (name.length > 100 || message.length > 2000 || (phone && phone.length > 30)) {
      return res.status(400).json({
        success: false,
        message: 'Un ou plusieurs champs sont trop longs'
      });
    }

    // Préparer les pièces jointes depuis base64
    const emailAttachments = attachments.map((file) => ({
      filename: file.name || 'photo.jpg',
      content: file.data,
      encoding: 'base64',
      contentType: file.type || 'image/jpeg'
    }));

    // Composer l'email
    const mailOptions = {
      from: `"Studio Vert Contact" <${CONFIG.emailUser}>`,
      to: CONFIG.emailTo,
      replyTo: email,
      subject: `🌿 Nouveau contact: ${name}`,
      attachments: emailAttachments,
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
    await transporter.sendMail(mailOptions);

    console.log('✅ Email envoyé avec succès');

    res.json({
      success: true,
      message: 'Votre message a été envoyé avec succès !'
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
});

// Mise à jour manuelle des avis
app.post('/update-reviews', express.json(), async (req, res) => {
  console.log('🔄 Mise à jour manuelle des avis');

  try {
    const googleData = await fetchGoogleReviews();
    if (!googleData) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des avis'
      });
    }

    const reviews = formatReviews(googleData);

    await admin.firestore().collection('config').doc('reviews').set({
      reviews: reviews,
      rating: googleData.rating,
      totalReviews: googleData.user_ratings_total,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: 'Avis mis à jour avec succès',
      count: reviews.length
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
});

// Récupérer les avis
app.get('/reviews', async (req, res) => {
  try {
    const doc = await admin.firestore().collection('config').doc('reviews').get();

    if (!doc.exists) {
      return res.json({ reviews: [] });
    }

    res.json(doc.data());
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ reviews: [] });
  }
});

exports.api = functions.https.onRequest(app);
