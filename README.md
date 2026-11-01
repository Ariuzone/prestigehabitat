# Prestige Habitat — démonstration Matrice Studio

Site vitrine statique d'une agence immobilière de luxe **fictive** à Cannes
(Côte d'Azur), réalisé comme démonstration par Matrice Studio. Tous les biens,
personnages, prix et chiffres sont imaginaires. Voir [SOURCES.md](SOURCES.md)
pour les ressources tierces et leurs licences.

## Déploiement

Le site est déjà généré : aucun backend, installation de dépendances ou build
n'est nécessaire. Publiez le contenu de ce dossier sur un hébergement de site
statique (par exemple GitHub Pages, Netlify ou tout serveur web).

Pour le prévisualiser localement, ouvrez `index.html` dans un navigateur ou
servez ce dossier avec un serveur HTTP :

```bash
python -m http.server 8000
# puis ouvrez http://localhost:8000
```

Les cartes interactives Leaflet et les tuiles OpenStreetMap nécessitent une
connexion internet ; les pages et les autres ressources sont servies
localement.

## Contenu publié

- `index.html` : accueil.
- `biens.html` et `biens/` : catalogue et fiches des biens.
- `agence.html`, `services.html`, `quartiers.html`, `estimation.html`,
  `contact.html` et `comparateur.html` : pages de présentation et outils.
- `mentions-legales.html`, `politique-de-confidentialite.html`,
  `plan-du-site.html` et `404.html` : pages complémentaires.
- `assets/` : feuilles de style, scripts du site, polices, images, icônes et
  bibliothèque Leaflet.
- `favicon.*`, les icônes PNG, `site.webmanifest`, `robots.txt` et `sitemap.xml` :
  ressources destinées aux navigateurs et moteurs de recherche.
- `SOURCES.md` : origines et licences des ressources tierces.

Les outils de production, sources du générateur et données de construction ne
sont pas inclus dans cette version destinée au déploiement. Les pages HTML
publiées sont les fichiers à servir tels quels.

## Fonctionnalités

- Recherche de biens avec filtres, tri et partage de l'URL filtrée.
- Carte Leaflet interactive, favoris et comparateur enregistrés dans
  `localStorage`.
- Formulaires avec validation accessible et message de confirmation ; aucune
  donnée n'est envoyée à un serveur.
- Données structurées Schema.org, Open Graph, Twitter Cards, URL canoniques et
  sitemap.

## Accessibilité et performances

- Navigation clavier, focus visibles, lien d'évitement, libellés explicites et
  prise en compte de `prefers-reduced-motion`.
- Images WebP avec repli JPG et chargement différé lorsque c'est approprié.
- Polices locales ; les cartes sont la seule fonctionnalité qui dépend de
  ressources externes.

© 2026 Matrice Studio. Tous droits réservés.
