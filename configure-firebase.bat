@echo off
echo ================================================
echo   Configuration Firebase Functions
echo ================================================
echo.
echo Cette commande va configurer les variables
echo d'environnement pour Firebase Functions.
echo.
echo ATTENTION: Vous devez remplacer le mot de passe
echo Gmail par votre VRAI mot de passe d'application !
echo.
pause

echo.
echo Configuration en cours...
echo.

firebase functions:config:set google.api_key="AIzaSyCrKEvFxcABHXKD-E6xxNe_YwviEXROGuE"
firebase functions:config:set google.place_id="ChIJwfhSL4Pq9EcRqcmswNRXNzU"
firebase functions:config:set email.to="studiovertpaysage@gmail.com"
firebase functions:config:set email.user="studiovertpaysage@gmail.com"

echo.
echo ================================================
echo IMPORTANT: Configurez le mot de passe Gmail !
echo ================================================
echo.
echo Executez cette commande en remplacant VOTRE_MOT_DE_PASSE:
echo.
echo firebase functions:config:set email.password="VOTRE_MOT_DE_PASSE"
echo.
echo Pour obtenir un mot de passe d'application Gmail:
echo 1. Allez sur https://myaccount.google.com/security
echo 2. Activez la validation en 2 etapes
echo 3. Cherchez "Mots de passe des applications"
echo 4. Generez un mot de passe pour "Mail"
echo 5. Copiez-le et executez la commande ci-dessus
echo.
echo ================================================
echo.

echo Verification de la configuration actuelle:
firebase functions:config:get

echo.
pause
