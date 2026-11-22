# e-portfolio – Maël BARGEL

Site statique (HTML / CSS / JavaScript), sans outil de build. Compatible GitHub Pages.

## Mettre en ligne sur GitHub Pages

1. Crée un dépôt GitHub (ex. `portfolio`) et dépose-y tout le contenu de ce dossier, avec `index.html` à la racine.
2. Dépôt > Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Le site est disponible après quelques minutes sur `https://<ton-pseudo>.github.io/<dépôt>/`.

## Modifier le contenu

- Textes, projets, liens (CV, LinkedIn, photo, vidéo) : `js/content.js` (chaque texte en `fr` et `en`).
- Couleurs et polices : variables en haut de `css/style.css`.
- Ajouter un projet ou une expérience : ajoute un bloc dans `items` (`type: "projet"` ou `type: "experience"`).
- Images : place-les dans `img/` puis renseigne `img: "img/mon-image.jpg"` dans l'élément concerné.
- Photo de profil, vidéos, CV : renseigne `photo`, `videoPitch`, `videoJp`, `cvFr`, `cvEn` dans `cfg`.
- Description en puces : donne une liste (`["...", "..."]`) à `desc` ; un simple texte reste un paragraphe.

## Statistiques du jeu Roblox (mises à jour automatiques)

- `.github/workflows/roblox-stats.yml` lance toutes les heures `scripts/update-roblox-stats.mjs`, qui lit l'API publique de Roblox et écrit `data/roblox-stats.json`. Le site affiche ce fichier.
- Lancer à la main : onglet Actions > « Mise à jour des statistiques Roblox » > Run workflow.
- Changer de jeu : modifie `ROBLOX_PLACE_ID` dans `scripts/update-roblox-stats.mjs` (le nombre dans l'adresse de la page du jeu) et le lien dans `js/content.js`.
- Si Roblox ne répond pas, le fichier n'est pas modifié et le site garde les dernières valeurs.
