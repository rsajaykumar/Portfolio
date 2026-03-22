@echo off
echo =======================================
echo Pushing changes to GitHub automatically
echo =======================================

git add .

set /p msg="Enter commit message (or press enter for default): "
if "%msg%"=="" set msg="Auto-update from local %date% %time%"

git commit -m "%msg%"
git push origin master

echo =======================================
echo Push Complete! Netlify will auto-deploy.
echo =======================================
pause
