# HighScoreDisplay

Une application web de tableau des meilleurs scores dans un style arcade rétro, avec une esthétique de moniteur CRT, des couleurs néon et une gestion interactive des scores.

## Vue d'ensemble

HighScoreDisplay est une application web statique qui reproduit fidèlement l'expérience des bornes d'arcade classiques des années 80-90. L'application affiche un tableau de 10 positions avec les meilleurs scores, le tout dans une interface nostalgique qui rappelle les écrans CRT (Cathode Ray Tube) avec leurs effets visuels caractéristiques.

L'application est entièrement fonctionnelle sans base de données externe, utilisant le localStorage du navigateur pour persister les données entre les sessions.

## Structure du Projet

```
HighScoreDisplay/
├── index.html    # Page principale
├── style.css     # Styles de l'application
├── script.js     # Logique JavaScript
├── tests/        # Tests automatisés (Playwright)
├── docs/         # Documentation et screenshots
└── package.json  # Dépendances pour les tests
```

## Démarrage Rapide

Ouvrez simplement `index.html` dans votre navigateur web. Aucune installation ni compilation nécessaire !

L'application est également disponible en ligne : **https://valentinrochet.github.io/HighScoreDisplay/**

Ou utilisez un serveur local :
```bash
python -m http.server 8000
# Puis ouvrez http://localhost:8000/index.html
```

## Fonctionnalités et Utilisation

### 1. Ajouter un Score

- Cliquez sur le bouton **"PRESS START"** en bas de l'écran
- Une fenêtre popup s'ouvre
- Entrez le nom du joueur et le score
- Cliquez sur **"Ajouter"**
- Le score est automatiquement inséré à sa position dans le classement avec une animation

**Notes :**
- Les scores sont triés automatiquement du plus élevé au plus bas
- Seuls les 10 meilleurs scores sont conservés
- Si vous ajoutez un 11ème score inférieur aux autres, il ne sera pas affiché mais restera en mémoire
- Les animations de glissement montrent visuellement où le nouveau score s'insère

### 2. Supprimer un Score

- Cliquez directement sur le **numéro de rang** (1ST, 2ND, 3RD, etc.) du score à supprimer
- Une fenêtre de confirmation apparaît avec le détail du score
- Confirmez la suppression
- Le score est retiré et les positions suivantes remontent automatiquement

**Astuce :** Seuls les rangs contenant des scores réels (non vides) sont cliquables.

### 3. Modifier le Titre

- Cliquez sur le **titre principal** en haut de l'écran ("HIGH SCORE" par défaut)
- Une fenêtre popup s'ouvre avec plusieurs options :
  - **Modifier le titre** : Entrez un nouveau titre personnalisé
  - **Supprimer tous les scores** : Bouton rouge pour réinitialiser complètement le tableau
- Le titre est immédiatement mis à jour après validation

### 4. Voir Tous les Scores

- Cliquez sur le bouton **"VIEW ALL"** en bas de l'écran
- Une fenêtre s'ouvre affichant tous les scores enregistrés (y compris ceux hors du top 10)
- Utile pour voir l'historique complet de tous les scores ajoutés

### 5. Persistance des Données

- **Tous les scores et le titre sont automatiquement sauvegardés** dans le navigateur
- Les données persistent même après fermeture de l'onglet ou du navigateur
- Pour réinitialiser : cliquez sur le titre puis "Supprimer tous les scores"

## Effets Visuels

L'application reproduit fidèlement l'esthétique des bornes d'arcade :

- **Écran CRT** : Lignes de balayage (scanlines), effet de scintillement
- **Couleurs néon** : Dégradés cyan/magenta, effets de lueur
- **Animations** :
  - Glissement fluide lors de l'insertion de scores
  - Effet "machine à écrire" pour les nouveaux scores
  - Particules flottantes en arrière-plan
- **Classement coloré** :
  - 🥇 1ère place : Or
  - 🥈 2ème place : Argent
  - 🥉 3ème place : Bronze
  - Places suivantes : Cyan

## Tests

Pour exécuter les tests automatisés (Playwright) :

```bash
npm install
node tests/complete-test.js      # Séquence de test complète
node tests/simple-test.js        # Test simple
```

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript pur (aucun framework)
- **Polices** : Google Fonts (Press Start 2P - police pixel art)
- **Stockage** : LocalStorage du navigateur
- **Tests** : Playwright (tests automatisés)

## Cas d'Usage

- Affichage de scores pour un jeu vidéo rétro
- Tableau de classement pour une compétition ou un événement
- Décoration nostalgique pour un espace gaming
- Démonstration d'effets CSS avancés (CRT, néon)

## Développement

Pour les développeurs souhaitant contribuer ou modifier l'application, consultez la [documentation détaillée](docs/CLAUDE.md) qui contient :
- Architecture et structure du code
- Conventions de codage
- Guide des animations et timings
- Instructions pour les tests

## Licence

Projet libre d'utilisation.
