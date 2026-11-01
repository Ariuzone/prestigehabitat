# SOURCES.md — Ressources tierces du site Prestige Habitat

Démonstration réalisée par **Matrice Studio**. Chaque ressource locale est listée
avec son URL d'origine pour faciliter son remplacement.

## Logotype, monogramme et icônes

| Fichier local | Origine |
|---|---|
| `favicon.svg`, `assets/icons/monogramme.svg`, `assets/icons/logo-plein.svg`, favicon PNG/ICO, en-tête et pied de page | **Création originale Matrice Studio** — monogramme « clef-arche » dessiné pour cette démonstration (arche architecturale formant le pommeau d'une clef). Aucun logo existant n'a été copié ou imité. |
| Icônes SVG inline (surface, pièces, chambres, cœur, épingle, services, etc. dans `assets/js/app.js`, `assets/js/biens.js` et le gabarit) | **Création originale Matrice Studio**, géométrie simple dessinée à la main. |

## Polices (sous-ensembles « latin », servis en local)

| Fichier local | Origine | Licence |
|---|---|---|
| `assets/fonts/cormorant-*.woff2` | Google Fonts — https://fonts.google.com/specimen/Cormorant+Garamond | SIL OFL 1.1 |
| `assets/fonts/jost-*.woff2` | Google Fonts — https://fonts.google.com/specimen/Jost | SIL OFL 1.1 |
| `assets/fonts/cinzel-*.woff2` | Google Fonts — https://fonts.google.com/specimen/Cinzel | SIL OFL 1.1 |

## Photographies

Toutes les photographies du site sont servies en local depuis `assets/img/`
(formats WebP + JPG optimisés). Les originaux de travail ne sont pas inclus
dans le déploiement. Auteurs non identifiés pour les images Unsplash ; les URL
CDN ci-dessous pointent vers l'original.

### Vues de villes et territoires (Wikimedia Commons / Wikipédia)

| Image locale | URL d'origine | Utilisé pour |
|---|---|---|
| `assets/img/pages/hero-cannes.*` | https://commons.wikimedia.org/wiki/File:Cannes_-_port_et_croisette.jpg | Héros accueil, image OG, popup carte Penthouse Panorama |
| `assets/img/pages/hero-croisette.*` | https://fr.wikipedia.org/wiki/Boulevard_de_la_Croisette (image principale) | Quartier Croisette, fiche Appartement Royale, Penthouse Panorama |
| `assets/img/pages/hero-suquet.*` | https://commons.wikimedia.org/wiki/File:Le_Suquet_01.jpg | Quartier Suquet, fiches Duplex du Suquet et Suite du Port |
| `assets/img/pages/quartier-palm-beach.*` | https://commons.wikimedia.org/wiki (recherche « Vieux Port Cannes yachts ») | Quartier Palm Beach |
| `assets/img/pages/hero-cap.*` | https://fr.wikipedia.org/wiki/Cap_d%27Antibes (image principale) | Quartier Cap d'Antibes, fiche Villa Ondine |
| `assets/img/pages/hero-mougins.*` | https://commons.wikimedia.org/wiki/File:Mougins_01_(cropped).jpg | Quartier Mougins |
| `assets/img/pages/hero-theoule.*` | https://fr.wikipedia.org/wiki/Th%C3%A9oule-sur-Mer (image principale) | Héros quartiers, quartier Théoule, fiche Villa Marina |
| `assets/img/pages/hero-cannet.*` | https://commons.wikimedia.org/wiki/File:La_place_Bellevue_du_Cannet.JPG | Quartier Le Cannet, fiche Domaine des Colles |
| `assets/img/pages/hero-juan.*` | https://fr.wikipedia.org/wiki/Juan-les-Pins (image principale) | Héros contact |
| `assets/img/pages/hero-antibes.*` | https://fr.wikipedia.org/wiki/Antibes (image principale) | Quartier Cap d'Antibes (sommaire), fiche Loft du Vieil Antibes |
| `assets/img/pages/hero-lerins.*` | https://fr.wikipedia.org/wiki/%C3%8Eles_de_L%C3%A9rins (image principale) | Quartier Les Îles de Lérins |

### Photographies d'architecture, d'intérieurs et de vie (Unsplash)

Les identifiants indiqués ci-dessous permettent de retrouver les photos
Unsplash d'origine. Le manifeste de production et les fichiers bruts ne sont
pas inclus dans le déploiement.

| Nom brut | URL d'origine (préfixe : `https://images.unsplash.com/photo-`) | Utilisé pour |
|---|---|---|
| `1600585154340-be6161a56a0c` (villa-a) | villa moderne avec piscine | Fiche Villa Sillage |
| `1600596542815-ffad4c1539a9` (villa-b) | villa blanche et piscine | Héros catalogue, fiche Villa Joséphine |
| `1613490493576-7fde63acd811` (villa-e) | villa contemporaine au crépuscule | Fiche Villa Azur (photo principale) |
| `1600121848594-d8644e57abab` (villa-d) | piscine de nuit | Fiche Villa Joséphine |
| `1580587771525-78b9dba3b914` (villa-i) | villa moderne, piscine | Fiche Villa Azur |
| `1564013799919-ab600027ffc6` (villa-g) | villa blanche et jardin | Fiche Villa des Pins |
| `1512917774080-9991f1c4c750` (villa-h) | villa et palmiers, piscine | Fiche Villa Marina |
| `1568605114967-8130f3a36994` (villa-j) | maison classique | Fiche Villa Joséphine |
| `1570129477492-45c003edd2be` (villa-k) | maison blanche classique | Fiche Domaine des Colles |
| `1523755231516-e43fd2e8dca5` (villa-l) | séjour ouvert sur piscine | Fiche Villa Marina |
| `1600566753086-00f18fb6b3ea` (villa-c) | intérieur bois et séjour | Fiche Villa Sillage (extérieur nuit) |
| `1449844908441-8829872d2607` (villa-m) | maison contemporaine | Fiche Villa Sillage (extérieur) |
| `1584132967334-10e028bd69f7` (villa-n) | résidence tropicale | Réserve |
| `1566073771259-6a8506099945` (villa-o) | terrasse de resort | Fiche Villa Ondine |
| `1542314831-068cd1dbfeeb` (villa-p) | piscine de nuit | Fiche Villa Ondine |
| `mas-0` | https://commons.wikimedia.org/wiki/File:Mas_(Provencal_Farmhouse).jpg | Fiche Mas des Oliviers |
| `mas-1` | https://commons.wikimedia.org (recherche « mas provençal ») | Fiche Mas des Oliviers (jardin) |
| intérieurs `int-a` à `int-t` (identifiants détaillés dans le manifeste) | Unsplash | Salons, cuisines, chambres et salles de bains des 14 fiches |
| salles de bain `bath-a` à `bath-d`, salles à manger `din-a`/`din-b` | Unsplash | Fiches biens |
| `mer-a` à `mer-h` | Unsplash (plages, criques, yacht) | Vues et ambiances marines des fiches |
| `ter-a`, `ter-b`, `ter-e`, `ter-f` | Unsplash (dressing, ponton, lagon, escalier) | Penthouse Horizon, Duplex du Suquet, Villa Ondine |
| `cel-a` (chai moderne), `cel-b` (vignoble) | Unsplash | Fiche Mas des Oliviers |
| `gol-a` (golfeur) | Unsplash | Fiche Villa Sillage, bloc « Golf & sport » |
| portraits `p-a` à `p-h` | Unsplash | Équipe de six conseillers (`assets/img/portraits/`) |
| services `svc-a` à `svc-l` | Unsplash (gastronomie, réunions, spa, clefs) | Héros services/agence/estimation, blocs « L'art de vivre » |

## Bibliothèque logicielle embarquée

| Fichier local | Origine | Licence |
|---|---|---|
| `assets/lib/leaflet/leaflet.js` + `leaflet.css` | https://leafletjs.com (Leaflet 1.9.4) | BSD 2-Clause |

## Fonds de carte

| Ressource | Origine | Licence |
|---|---|---|
| Tuiles des cartes interactives (fiches, catalogue, contact) | https://www.openstreetmap.org — servi à distance par le protocole standard de Leaflet | ODbL, © contributeurs d'OpenStreetMap |

## Outils de production (non inclus dans le déploiement)

- Pillow (Python) : recadrage, optimisation WebP/JPG, favicons PNG/ICO, og-image.
- Playwright (Node) : captures d'écran et tests automatisés uniquement.

## Contenus textuels

L'intégralité des textes (histoire de l'agence, biens, quartiers, services,
avis clients, mentions légales) est une **rédaction originale de Matrice
Studio** pour cette démonstration. Les biens, l'équipe, les avis et les chiffres
sont entièrement fictifs.
