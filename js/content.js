/* =====================================================================
   CONTENU DU SITE – c'est le seul fichier à modifier pour changer les textes.
   Chaque texte existe en { fr: "...", en: "..." }.
   ===================================================================== */
window.SITE = {

  /* Liens et fichiers : laisse "" tant que tu ne les as pas.
     Exemples : photo: "img/photo.jpg", videoPitch: "video/pitch.mp4",
                videoJp: "video/japonais.mp4", cvFr: "docs/CV-Mael-Bargel-FR.pdf" */
  cfg: {
    photo: "img/mael.jpg",
    videoPitch: "https://youtu.be/5dqQHneAT4c",
    videoJp: "https://youtu.be/efaQE_qQP00",
    linkedin: "https://www.linkedin.com/in/ma%C3%ABl-bargel-754b71386/",
    cvFr: "docs/CV-Mael-Bargel-FR.pdf",
    cvEn: "docs/CV-Mael-Bargel-EN.pdf",
    email: "bargelmael@gmail.com",
    phone: { fr: "06 02 17 90 03", en: "+33 6 02 17 90 03" }
  },

  ui: {
    fr: {
      role: "Étudiant à l'ENSEEIHT", dept: "Département des Sciences du numérique",
      cvFr: "CV (Français)", cvEn: "CV (Anglais)", linkedin: "LinkedIn",
      welcome: "Bienvenue",
      explore: "Explorer le portfolio", discover: "Découvrir",
      all: "Tout", projects: "Projets", experiences: "Expériences",
      kindProject: "Projet", kindExperience: "Expérience",
      emptyProject: "Pas encore de projet ajouté", emptyExperience: "Pas encore d'expérience ajoutée",
      emptyHint: "Cette section se remplira au fil de mon parcours.",
      contact: "Contact", contactText: "Un projet, une question, une opportunité ? Écrivez-moi.",
      phoneLbl: "Tél", emailLbl: "E-mail", onlineLbl: "En ligne",
      menu: "Menu", theme: "Changer de thème", language: "Langue", nav: "Navigation principale",
      toAdd: "Lien à ajouter", copy: "© 2026 par Maël BARGEL",
      catPerso: "Projet personnel", catAcademique: "Projet académique",
      statActive: "Joueurs actifs", statVisits: "Visites", statFavorites: "Favoris", statLikes: "J'aime", statUpdated: "Mis à jour le",
      statsNote: "Statistiques Roblox, actualisées toutes les heures", statsAsOf: "relevé du", viewOnRoblox: "Voir le jeu sur Roblox ↗",
      /* Carte des mobilités */
      stateDone: "Fait", stateLive: "En cours", statePlan: "Projet / à venir",
      mapLabel: "Carte du monde des mobilités", mapHint: "Clique sur un point de la carte pour afficher la mobilité.",
      mapTip: "Glisse pour déplacer la carte. Zoom : boutons + / − ou Ctrl + molette.",
      zoomIn: "Zoom avant", zoomOut: "Zoom arrière", zoomReset: "Voir toute la carte",
      closeCard: "Fermer la carte", places: "Lieux", placeholder: "À compléter",
      /* Page carrière */
      secCv: "Mes CV", secVideos: "Mes vidéos de présentation", secLinkedin: "Sur LinkedIn",
      cvFrDesc: "Curriculum vitae en français", cvEnDesc: "Curriculum vitae en anglais",
      download: "Télécharger le CV", pitchTitle: "Elevator pitch", pitchLabel: "Elevator pitch, 2 minutes 56",
      jpTitle: "Présentation en japonais", jpLabel: "Vidéo de présentation en japonais", watchYoutube: "Voir sur YouTube",
      linkedinText: "Retrouve mon parcours et mes projets sur mon profil LinkedIn.", openProfile: "Voir mon profil"
    },
    en: {
      role: "Student at ENSEEIHT", dept: "Digital Sciences Department",
      cvFr: "CV (French)", cvEn: "CV (English)", linkedin: "LinkedIn",
      welcome: "Welcome",
      explore: "Explore the portfolio", discover: "Learn more",
      all: "All", projects: "Projects", experiences: "Experience",
      kindProject: "Project", kindExperience: "Experience",
      emptyProject: "No project added yet", emptyExperience: "No experience added yet",
      emptyHint: "This section will grow as my journey does.",
      contact: "Contact", contactText: "A project, a question, an opportunity? Get in touch.",
      phoneLbl: "Phone", emailLbl: "Email", onlineLbl: "Online",
      menu: "Menu", theme: "Toggle theme", language: "Language", nav: "Main navigation",
      toAdd: "Link to be added", copy: "© 2026 Maël BARGEL",
      catPerso: "Personal project", catAcademique: "Academic project",
      statActive: "Active players", statVisits: "Visits", statFavorites: "Favorites", statLikes: "Likes", statUpdated: "Updated",
      statsNote: "Roblox statistics, refreshed every hour", statsAsOf: "as of", viewOnRoblox: "View the game on Roblox ↗",
      stateDone: "Done", stateLive: "Ongoing", statePlan: "Planned",
      mapLabel: "World map of my mobility", mapHint: "Click a dot on the map to see the mobility.",
      mapTip: "Drag to move the map. Zoom: + / − buttons or Ctrl + scroll.",
      zoomIn: "Zoom in", zoomOut: "Zoom out", zoomReset: "Show the whole map",
      closeCard: "Close card", places: "Places", placeholder: "To be completed",
      secCv: "My CVs", secVideos: "My introduction videos", secLinkedin: "On LinkedIn",
      cvFrDesc: "Curriculum vitae in French", cvEnDesc: "Curriculum vitae in English",
      download: "Download CV", pitchTitle: "Elevator pitch", pitchLabel: "Elevator pitch, 2 minutes 56",
      jpTitle: "Introduction in Japanese", jpLabel: "Introduction video in Japanese", watchYoutube: "Watch on YouTube",
      linkedinText: "Find my background and projects on my LinkedIn profile.", openProfile: "View my profile"
    }
  },

  /* Pages : ordre du menu */
  pages: [
    { id: "home",       href: "index.html",      art: "spark",
      nav:   { fr: "Bienvenue", en: "Welcome" },
      title: { fr: "Bienvenue", en: "Welcome" } },
    { id: "projets",    href: "projets.html",    art: "game",
      nav:   { fr: "Cours / Projets d'ingénierie", en: "Courses / Engineering projects" },
      title: { fr: "Projets et Expériences", en: "Projects and Experience" },
      intro: { fr: "Une présentation de mes différents projets et expériences professionnelles.", en: "An overview of my projects and professional experience." } },
    { id: "mobilites",  href: "mobilites.html",  art: "planet",
      nav:   { fr: "Mobilités", en: "Mobility" },
      title: { fr: "Mobilités", en: "Mobility" },
      intro: { fr: "Une carte du monde de mes séjours et échanges. Chaque point ouvre la fiche de la mobilité.", en: "A world map of my stays and exchanges. Each dot opens the mobility's card." } },
    { id: "carriere",   href: "carriere.html",   art: "growth",
      nav:   { fr: "Développement de carrière", en: "Career development" },
      title: { fr: "Développement de carrière", en: "Career development" },
      intro: { fr: "Mes CV, mes vidéos de présentation et mon profil LinkedIn.", en: "My CVs, introduction videos and LinkedIn profile." } },
    { id: "engagement", href: "engagement.html", art: "globe",
      nav:   { fr: "Engagement civil", en: "Civic engagement" },
      title: { fr: "Engagement civil", en: "Civic engagement" },
      intro: { fr: "Une présentation de mes différents engagements civils.", en: "An overview of my civic engagements." } },
    { id: "interets",   href: "interets.html",   art: "racket",
      nav:   { fr: "Centres d'intérêts", en: "Interests" },
      title: { fr: "Centres d'intérêts", en: "Interests" },
      intro: { fr: "Une présentation de mes différents centres d'intérêts.", en: "An overview of my interests." } }
  ],

  /* Page d'accueil : description de qui je suis + phrase d'introduction du portfolio */
  intro: {
    fr: "Je suis étudiant à l'<strong>ENSEEIHT (N7)</strong>, une grande école d'ingénieurs française. Je suis le cursus Sciences du numérique, et plus précisément le parcours <strong>Systèmes Logiciels</strong>.",
    en: "I'm a student at <strong>ENSEEIHT (N7)</strong>, a leading French engineering school. I'm following the Digital Sciences curriculum, and more specifically the <strong>Software Systems</strong> track."
  },
  portfolioIntro: {
    fr: "Ce portfolio rassemble mes projets, mes mobilités, mon engagement et mon parcours. Bonne visite !",
    en: "This portfolio brings together my projects, mobility, engagement and background. Enjoy your visit!"
  },
  tileText: {
    projets:    { fr: "Mes projets d'ingénierie et mes expériences.", en: "My engineering projects and experience." },
    mobilites:  { fr: "Une carte du monde de mes séjours et échanges.", en: "A world map of my stays and exchanges." },
    carriere:   { fr: "Mes CV, mes vidéos de présentation et mon LinkedIn.", en: "My CVs, introduction videos and LinkedIn." },
    engagement: { fr: "Théâtre interactif, Fresque du climat.", en: "Interactive theatre, Climate Fresk." },
    interets:   { fr: "Sport, jeux vidéo, manga et anime.", en: "Sport, video games, manga and anime." }
  },

  /* Projets et expériences. type : "projet" ou "experience".
     Ajoute img: "img/mon-image.jpg" pour remplacer le visuel abstrait par une vraie image. */
  items: [
    {
      /* category : "perso" (projet personnel) ou "academique" (projet académique) */
      type: "projet", art: "game", img: "img/roblox-jeu.jpg", fit: "wide", category: "perso",
      /* Statistiques mises à jour toutes les heures par .github/workflows/roblox-stats.yml */
      stats: { src: "data/roblox-stats.json", url: "https://www.roblox.com/games/131576522724952/Untitled-Slayer" },
      title:  { fr: "Développement d'un jeu Roblox", en: "Roblox game development" },
      role:   { fr: "Propriétaire", en: "Owner" },
      status: { fr: "Projet actif", en: "Active project" }, live: true,
      /* Une liste ([...]) s'affiche en puces ; un simple texte ("...") s'affiche en paragraphe. */
      desc:   { fr: ["Développement et publication d'un jeu multijoueur RPG en monde ouvert sur Roblox (architecture client-serveur).",
                     "Conception et implémentation des systèmes principaux et des interfaces utilisateurs (UI/UX) : combat, inventaire, dialogues, quêtes et économie.",
                     "Gestion de projet et coordination de prestataires externes (animateurs, artistes VFX/SFX) avec gestion d'un budget alloué.",
                     "Management d'une communauté de plus de 10 000 membres (recrutement et encadrement d'une équipe de modération, support et phases de test)."],
                en: ["Development and release of an open-world multiplayer RPG on Roblox (client-server architecture).",
                     "Design and implementation of the core systems and user interfaces (UI/UX): combat, inventory, dialogues, quests and economy.",
                     "Project management and coordination of external contractors (animators, VFX/SFX artists) within an allocated budget.",
                     "Management of a community of more than 10,000 members (recruiting and supervising a moderation team, support and testing phases)."] },
      tags:   { fr: ["Roblox", "Luau", "Client-serveur", "UI/UX", "Gestion de projet", "Community management"], en: ["Roblox", "Luau", "Client-server", "UI/UX", "Project management", "Community management"] }
    }
  ],

  /* Mobilités affichées sur la carte.
     state : "done" (fait), "live" (en cours) ou "plan" (projet / à venir)
     lat / lon : coordonnées du point (ex. Athènes 37.98 / 23.73, Tokyo 35.68 / 139.69)
     placeholder: true affiche un badge « À compléter » (à retirer une fois la fiche remplie) */
  mobilites: [
    {
      id: "lost-in-space", state: "done", lat: 37.98, lon: 23.73,
      place: { fr: "Grèce", en: "Greece" },
      art: "planet", img: "", more: "",
      eyebrow: { fr: "Échange international", en: "International exchange" },
      title:   { fr: "Lost in Space – Erasmus+", en: "Lost in Space – Erasmus+" },
      role:    { fr: "Collège – 4ème et 3ème", en: "Middle school – 4ème and 3ème" },
      desc:    { fr: "Échange international avec 5 partenaires internationaux sur le thème de l'astronomie. Durant ce projet, j'ai eu un correspondant grec qui m'a accueilli, puis je l'ai à mon tour accueilli. Au cours de ces années, j'ai participé à la mise en place du chemin des planètes dans ma commune.",
                 en: "International exchange with 5 international partners on the theme of astronomy. During this project, a Greek penpal hosted me, and I later hosted him in return. Over those years, I helped set up the planet trail in my town." },
      tags:    { fr: ["Erasmus+", "Astronomie", "5 partenaires"], en: ["Erasmus+", "Astronomy", "5 partners"] }
    },
    {
      id: "japon", state: "done", lat: 35.68, lon: 139.69, placeholder: true,
      place: { fr: "Japon", en: "Japan" },
      art: "sun", img: "", more: "",
      eyebrow: { fr: "Séjour linguistique", en: "Language stay" },
      title:   { fr: "Séjour linguistique au Japon", en: "Language stay in Japan" },
      role:    { fr: "Année à ajouter", en: "Year to be added" },
      desc:    { fr: "Description à venir : le déroulé du séjour, ce que j'y ai appris et ce que j'en retiens.",
                 en: "Description coming soon: how the stay went, what I learned there and what I took from it." },
      tags:    { fr: ["Japonais", "Séjour linguistique"], en: ["Japanese", "Language stay"] }
    }
  ],

  civil: [
    {
      art: "stage", img: "img/proces-king-kong.jpg", fit: "contain", more: "https://www.ecam.fr/news/le-proces-de-king-kong-vss/",
      eyebrow: { fr: "Théâtre interactif", en: "Interactive theatre" },
      title:   { fr: "Le Procès de King-Kong", en: "The Trial of King Kong" },
      role:    { fr: "2025", en: "2025" },
      desc:    { fr: "J'ai eu l'opportunité d'assister à une pièce de théâtre interactif sur les violences sexistes et sexuelles, un projet qui encourage l'ouverture d'esprit et la réflexion. Cette expérience m'a permis d'explorer des sujets importants car elle engageait le public de manière dynamique et participative.",
                 en: "I had the opportunity to attend an interactive theatre play about sexist and sexual violence, a project that encourages open-mindedness and reflection. This experience let me explore important topics, as it engaged the audience in a dynamic, participatory way." },
      tags:    { fr: ["Sensibilisation", "Théâtre interactif"], en: ["Awareness", "Interactive theatre"] }
    },
    {
      art: "globe", img: "img/fresque-du-climat.jpg", fit: "contain", more: "https://fresqueduclimat.org",
      eyebrow: { fr: "Atelier", en: "Workshop" },
      title:   { fr: "La Fresque du climat", en: "The Climate Fresk" },
      role:    { fr: "2025", en: "2025" },
      desc:    { fr: "J'ai participé à la Fresque du climat et j'ai découvert des aspects fascinants sur l'impact de nos actions sur l'environnement. Cette expérience m'a ouvert les yeux sur l'importance de prendre conscience de notre empreinte écologique.",
                 en: "I took part in the Climate Fresk and discovered fascinating aspects of how our actions affect the environment. This experience opened my eyes to the importance of being aware of our ecological footprint." },
      tags:    { fr: ["Climat", "Environnement"], en: ["Climate", "Environment"] }
    }
  ],

  interets: [
    { art: "racket", img: "img/badminton.png", fit: "paper",
      title: { fr: "Sports", en: "Sports" },
      desc:  { fr: "J'aime faire du sport et plus particulièrement du badminton. J'en fais au moins une fois par semaine. De temps en temps, je fais aussi un peu de course à pied. Le sport est une excellente façon de se mettre en forme et de se divertir seul ou avec des amis.",
               en: "I enjoy sport, and badminton in particular. I play at least once a week, and from time to time I also go for a run. Sport is a great way to keep fit and have fun, alone or with friends." } },
    { art: "game", img: "img/jeux-video.png", fit: "paper",
      title: { fr: "Jeux vidéo", en: "Video games" },
      desc:  { fr: "Les jeux vidéo sont bien plus qu'un simple divertissement pour moi. Ils sont la source de ma curiosité pour le monde de l'informatique, me poussant à apprendre à coder mes propres jeux.",
               en: "Video games are much more than simple entertainment for me. They are the source of my curiosity about computing, pushing me to learn to code my own games." } },
    { art: "spark", img: "img/manga-anime.png", fit: "contain",
      title: { fr: "Manga / Anime", en: "Manga / Anime" },
      desc:  { fr: "Parmi les mangas et les animes, on retrouve des histoires variées et captivantes. Chaque œuvre explore des thèmes importants comme l'amitié, le courage ou la persévérance. J'apprécie cette richesse de construction qui me fascine et me rappelle au quotidien des valeurs essentielles.",
               en: "Manga and anime offer varied, captivating stories. Each work explores important themes such as friendship, courage or perseverance. I appreciate this richness of storytelling, which fascinates me and reminds me of essential values in everyday life." } }
  ]
};
