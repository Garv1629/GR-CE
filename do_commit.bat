git rm -r --cached public
git add vercel.json package.json scripts/build.js .gitignore
git commit -m "fix(deployment): restore direct root static asset serving and remove conflicting outputDirectory"
git push origin main
