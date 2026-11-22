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
- Photo de profil, vidéo, CV : renseigne `photo`, `video`, `cvFr`, `cvEn` dans `cfg`.
