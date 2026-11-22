// Met à jour data/roblox-stats.json à partir de l'API publique de Roblox.
// Lancé toutes les heures par .github/workflows/roblox-stats.yml (Node 20+, aucune dépendance).
// En cas d'erreur (Roblox indisponible, limite de requêtes), le fichier existant est conservé.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const PLACE_ID = process.env.ROBLOX_PLACE_ID || '131576522724952';
const OUT = process.env.STATS_OUT || 'data/roblox-stats.json';

async function getJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': 'eportfolio-stats/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
  return res.json();
}

try {
  // 1) identifiant de l'univers à partir de l'identifiant du lieu (celui de l'adresse de la page du jeu)
  const { universeId } = await getJson(`https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`);
  if (!universeId) throw new Error('universeId introuvable');

  // 2) statistiques générales et votes
  const [games, votes] = await Promise.all([
    getJson(`https://games.roblox.com/v1/games?universeIds=${universeId}`),
    getJson(`https://games.roblox.com/v1/games/votes?universeIds=${universeId}`)
  ]);
  const g = games.data && games.data[0];
  const v = (votes.data && votes.data[0]) || {};
  if (!g) throw new Error('Jeu introuvable dans la réponse de Roblox');

  let previous = {};
  try { previous = JSON.parse(await readFile(OUT, 'utf8')); } catch { /* premier lancement */ }

  const next = {
    placeId: PLACE_ID,
    universeId,
    name: g.name ?? previous.name ?? null,
    playing: g.playing ?? previous.playing ?? null,
    visits: g.visits ?? previous.visits ?? null,
    favorites: g.favoritedCount ?? previous.favorites ?? null,
    likes: v.upVotes ?? previous.likes ?? null,
    dislikes: v.downVotes ?? previous.dislikes ?? null,
    created: g.created ?? previous.created ?? null,
    gameUpdated: g.updated ?? previous.gameUpdated ?? null,
    fetchedAt: new Date().toISOString()
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(next, null, 2) + '\n');
  console.log('Statistiques mises à jour :', JSON.stringify(next));
} catch (err) {
  // On ne fait pas échouer le workflow : le site garde les dernières valeurs connues.
  console.log(`::warning::Mise à jour des statistiques Roblox impossible : ${err.message}`);
}
