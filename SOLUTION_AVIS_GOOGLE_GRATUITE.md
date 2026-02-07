# 🎯 Solution 100% Gratuite pour Avis Google Personnalisés

## Option 1 : Script Python Simple (RECOMMANDÉ - 100% Gratuit)

Cette solution utilise un petit script Python qui tourne sur votre ordinateur et récupère les avis Google pour les injecter dans votre site.

### Étape 1 : Installer Python
1. Téléchargez Python : https://www.python.org/downloads/
2. Installez-le (cochez "Add to PATH")

### Étape 2 : Créer le script

Créez un fichier `fetch-google-reviews.py` :

```python
import requests
import json

# Configuration
API_KEY = "VOTRE_CLE_API_GOOGLE"  # Gratuit sur Google Cloud
PLACE_ID = "ChIJwfhSL4Pq9EcRqcmswNRXNzU"  # Studio Vert Lyon

# Récupérer les avis
url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={PLACE_ID}&fields=reviews,rating&key={API_KEY}"
response = requests.get(url)
data = response.json()

# Extraire et formater les avis
if 'result' in data and 'reviews' in data['result']:
    reviews = []
    for review in data['result']['reviews'][:5]:  # 5 derniers avis
        reviews.append({
            'author': review['author_name'],
            'initial': review['author_name'][0],
            'text': review['text'],
            'rating': review['rating'],
            'date': review['relative_time_description']
        })

    # Sauvegarder dans un fichier JSON
    with open('angular-project/src/assets/google-reviews.json', 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(reviews)} avis récupérés avec succès !")
else:
    print("❌ Erreur lors de la récupération des avis")
```

### Étape 3 : Exécuter le script

```bash
python fetch-google-reviews.py
```

Le script crée un fichier `google-reviews.json` avec vos vrais avis Google !

### Étape 4 : Charger les avis dans Angular

Le code est déjà prêt dans votre projet. Il chargera automatiquement les avis depuis le fichier JSON.

---

## Option 2 : Widget Externe Gratuit (Outscraper)

### Alternative simple sans code :

1. **Allez sur** : https://app.outscraper.com/google-maps-reviews
2. **Créez un compte gratuit** (100 requêtes/mois gratuites)
3. **Entrez** : "Studio Vert Lyon"
4. **Téléchargez** le JSON des avis
5. **Copiez** le fichier dans `angular-project/src/assets/google-reviews.json`

---

## Option 3 : Service Backend Node.js (Pour mise à jour auto)

Si vous voulez que les avis se mettent à jour automatiquement :

### Créez un fichier `server.js` :

```javascript
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = 'VOTRE_CLE_API_GOOGLE';
const PLACE_ID = 'ChIJwfhSL4Pq9EcRqcmswNRXNzU';

app.get('/api/reviews', async (req, res) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${API_KEY}`
    );

    const reviews = response.data.result.reviews.slice(0, 5).map(review => ({
      author: review.author_name,
      initial: review.author_name[0],
      text: review.text,
      rating: review.rating,
      date: review.relative_time_description
    }));

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(3000, () => console.log('Serveur démarré sur http://localhost:3000'));
```

### Installation :
```bash
npm install express axios cors
node server.js
```

---

## 🆚 Comparaison des solutions

| Solution | Gratuit | Personnalisable | Mise à jour auto | Difficulté |
|----------|---------|-----------------|------------------|------------|
| **Script Python** | ✅ 100% | ✅ 100% | ⚠️ Manuel | ⭐ Facile |
| **Outscraper** | ✅ Limité | ✅ 100% | ❌ Manuel | ⭐ Très facile |
| **Backend Node.js** | ✅ 100% | ✅ 100% | ✅ Auto | ⭐⭐ Moyen |
| **Elfsight** | ⚠️ Limité | ⚠️ Limité | ✅ Auto | ⭐ Très facile |

---

## 💡 Ma Recommandation

**Pour Studio Vert, je recommande Option 1 (Script Python)** :

✅ **Avantages** :
- 100% gratuit (quota Google : 28 500 requêtes/mois)
- Contrôle total du design (déjà fait dans votre site)
- Vous lancez le script 1 fois par semaine pour mettre à jour
- Aucune dépendance externe
- Design parfaitement intégré à votre charte graphique

📝 **Utilisation** :
1. Lancez le script une fois par semaine : `python fetch-google-reviews.py`
2. Les avis se mettent à jour automatiquement sur le site
3. Le design reste exactement celui que j'ai créé (avec votre charte verte)

---

## 🔑 Obtenir votre clé API Google (Gratuit)

1. https://console.cloud.google.com
2. Créer un projet "Studio Vert Website"
3. Activer "Places API"
4. Créer une clé API
5. Restriction recommandée : Sites web → `studiovert.fr/*`

**Quota gratuit** : 28 500 requêtes/mois = 950/jour = LARGEMENT suffisant !

---

Quelle option préférez-vous ? Je peux configurer tout le code nécessaire ! 🚀
