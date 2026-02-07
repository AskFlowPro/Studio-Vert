# 📱 Instructions pour intégrer Elfsight Google Reviews

## ✅ Ce qui est déjà fait :
- Le script Elfsight est chargé dans le site
- Le conteneur pour le widget est créé
- Le style est appliqué

## 🚀 Ce qu'il vous reste à faire :

### Étape 1 : Créer votre widget Elfsight (5 minutes)

1. **Allez sur** : https://elfsight.com/google-reviews-widget/
2. **Cliquez** sur "Create Widget for Free" (ou "Try for Free")
3. **Créez un compte** (gratuit) ou connectez-vous
4. **Recherchez** "Studio Vert" ou "studiovert Lyon" dans la barre de recherche
5. **Sélectionnez** votre établissement Google My Business
6. **Personnalisez** le widget (optionnel) :
   - Couleurs : Utilisez #6B7553 (vert de votre charte)
   - Disposition : Carrousel ou grille
   - Nombre d'avis : 3-5 recommandés
7. **Copiez** le code widget fourni

### Étape 2 : Récupérer votre Widget ID

Le code Elfsight ressemble à ceci :
```html
<div class="elfsight-app-a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"></div>
```

L'ID du widget est la partie après `elfsight-app-` :
**a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6**

### Étape 3 : Insérer votre Widget ID dans le code

1. **Ouvrez** le fichier : `src/app/app.component.ts`
2. **Trouvez** la ligne 148 :
   ```html
   <div class="elfsight-app-VOTRE_WIDGET_ID" data-elfsight-app-lazy></div>
   ```
3. **Remplacez** `VOTRE_WIDGET_ID` par votre ID réel
4. **Exemple** :
   ```html
   <div class="elfsight-app-a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6" data-elfsight-app-lazy></div>
   ```

### Étape 4 : Vérifier que ça fonctionne

1. **Sauvegardez** le fichier
2. **Rechargez** votre site (http://localhost:4200)
3. **Scrollez** jusqu'à la section "Avis"
4. **Les vrais avis Google** s'affichent automatiquement ! 🎉

## 💰 Tarification Elfsight

### Version GRATUITE :
- ✅ Widget fonctionnel
- ✅ Avis synchronisés automatiquement
- ❌ Marque "Powered by Elfsight" affichée
- ❌ Limité à 200 vues/mois

### Version PREMIUM (5-10$/mois) :
- ✅ Sans marque Elfsight
- ✅ Vues illimitées
- ✅ Support prioritaire
- ✅ Personnalisation avancée

**Recommandation** : Commencez avec la version gratuite, puis passez à Premium si nécessaire.

## ⚡ Alternative 100% gratuite et illimitée

Si vous ne voulez pas de marque Elfsight, gardez le carrousel actuel avec les témoignages manuels + lien vers Google.

## 🆘 Besoin d'aide ?

Si vous avez des problèmes :
1. Vérifiez que l'ID du widget est correct
2. Assurez-vous d'avoir un compte Google My Business actif
3. Consultez https://help.elfsight.com/

---

**Note** : Les avis se mettent à jour automatiquement toutes les 24h avec Elfsight !
