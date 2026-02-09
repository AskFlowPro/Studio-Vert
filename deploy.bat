@echo off
echo ================================================
echo   STUDIO VERT - Deploiement Firebase
echo ================================================
echo.

echo [1/3] Build du projet Angular...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR lors du build !
    pause
    exit /b 1
)

echo.
echo [2/3] Deploiement sur Firebase...
call firebase deploy
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR lors du deploiement !
    pause
    exit /b 1
)

echo.
echo ================================================
echo   DEPLOIEMENT TERMINE AVEC SUCCES !
echo ================================================
echo.
echo Votre site est maintenant en ligne !
echo.
pause
