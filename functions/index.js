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
    if (name.length > 100 || message.length > 3000 || (phone && phone.length > 30)) {
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
      from: `"Studio Vert" <${CONFIG.emailUser}>`,
      to: CONFIG.emailTo,
      replyTo: email,
      subject: `Nouveau contact - ${name}`,
      attachments: emailAttachments,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
              background: #f5f7f0;
              padding: 40px 20px;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(107, 117, 83, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #374836 0%, #6B7553 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .logo {
              font-family: 'Georgia', serif;
              font-size: 32px;
              font-weight: 700;
              color: #F5F1E8;
              letter-spacing: 0.05em;
              margin-bottom: 8px;
            }
            .subtitle {
              color: rgba(245, 241, 232, 0.9);
              font-size: 15px;
              font-weight: 400;
              letter-spacing: 0.02em;
            }
            .content {
              padding: 40px 30px;
            }
            .badge {
              display: inline-block;
              background: rgba(107, 117, 83, 0.1);
              color: #374836;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 600;
              letter-spacing: 0.03em;
              margin-bottom: 24px;
              text-transform: uppercase;
            }
            .field {
              margin-bottom: 24px;
            }
            .field-label {
              font-size: 12px;
              font-weight: 600;
              color: #6B7553;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              margin-bottom: 8px;
              display: block;
            }
            .field-value {
              background: #F5F1E8;
              padding: 16px 18px;
              border-radius: 10px;
              color: #374836;
              font-size: 15px;
              line-height: 1.6;
              border-left: 3px solid #6B7553;
            }
            .field-value a {
              color: #374836;
              text-decoration: none;
              font-weight: 500;
            }
            .field-value a:hover {
              color: #6B7553;
            }
            .message-field {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .attachments {
              margin-top: 8px;
              padding-top: 12px;
              border-top: 1px solid rgba(107, 117, 83, 0.2);
            }
            .attachment-count {
              font-size: 13px;
              color: #6B7553;
              font-weight: 500;
            }
            .footer {
              background: #F5F1E8;
              padding: 24px 30px;
              text-align: center;
              border-top: 1px solid rgba(107, 117, 83, 0.1);
            }
            .footer-text {
              color: rgba(55, 72, 54, 0.6);
              font-size: 13px;
              line-height: 1.5;
            }
            .footer-link {
              color: #6B7553;
              text-decoration: none;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="logo">STUDIO VERT</div>
              <div class="subtitle">Paysagiste Lyon & Alentours</div>
            </div>

            <div class="content">
              <div class="badge">📩 Nouvelle demande</div>

              <div class="field">
                <span class="field-label">Contact</span>
                <div class="field-value">${name}</div>
              </div>

              <div class="field">
                <span class="field-label">Email</span>
                <div class="field-value">
                  <a href="mailto:${email}">${email}</a>
                </div>
              </div>

              ${phone ? `
              <div class="field">
                <span class="field-label">Téléphone</span>
                <div class="field-value">
                  <a href="tel:${phone}">${phone}</a>
                </div>
              </div>
              ` : ''}

              <div class="field">
                <span class="field-label">Message</span>
                <div class="field-value message-field">${message.replace(/\n/g, '<br>')}</div>
                ${emailAttachments.length > 0 ? `
                <div class="attachments">
                  <span class="attachment-count">📎 ${emailAttachments.length} photo${emailAttachments.length > 1 ? 's' : ''} jointe${emailAttachments.length > 1 ? 's' : ''}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="footer">
              <p class="footer-text">
                Envoyé depuis <a href="https://studiovertpaysage.fr" class="footer-link">studiovertpaysage.fr</a>
              </p>
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
