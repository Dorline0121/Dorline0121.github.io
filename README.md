# Portfolio · Dorline TIAKO OKASSIE

Site statique en HTML, CSS et JavaScript (aucune dépendance à installer).

En ligne : **https://dorline0121.github.io**

## Projets

Chaque projet a sa propre page de présentation (contexte, concepts, problèmes et solutions, ce que j'ai appris) dans le dossier [`projets/`](projets/).

| Projet | Domaine | Statut | Démo |
|---|---|---|---|
| [Aero Predict](projets/aero-predict/README.md) | ML & IA | En cours | [Tester](https://dorline0121.github.io/#aero-predict) |
| [Plantamitz](projets/plantamitz/README.md) | Logiciel | Terminé | [Tester](https://dorline0121.github.io/#plantamitz) |
| [Analyse des ventes](projets/analyse-ventes/README.md) | Data & BI | Terminé | [Tester](https://dorline0121.github.io/#analyse-ventes) |
| [Tableau de bord SuperStore](projets/lab7-superstore/README.md) | Data & BI | Terminé | [Tester](https://dorline0121.github.io/#lab7-superstore) |
| [Machine Learning en Python](projets/labs-data-science/README.md) | ML & IA | Terminé | [Tester](https://dorline0121.github.io/#labs-data-science) |
| [Introduction au Machine Learning](projets/intro-ml/README.md) | ML & IA | Terminé | [Tester](https://dorline0121.github.io/#intro-ml) |
| [Prédiction de salaires](projets/prediction-salaires/README.md) | ML & IA | Terminé | — |
| [Neural Speech](projets/neural-speech/README.md) | ML & IA · Embarqué | Terminé | [Tester](https://dorline0121.github.io/#neural-speech) |
| [Fondamentaux ML & vision](projets/fondamentaux-ml/README.md) | ML & IA | Terminé | — |
| [SECEL Formation](projets/secel-formation/README.md) | Logiciel | Terminé | [Tester](https://dorline0121.github.io/#secel-formation) |
| [SECEL Commandes](projets/secel-commandes/README.md) | Logiciel | Terminé | [Tester](https://dorline0121.github.io/#secel-commandes) |
| [JAVAZIC](projets/javazic/README.md) | Logiciel | Terminé | [Tester](https://dorline0121.github.io/#javazic) |
| [Analyse de données salariales](projets/analyse-salaires/README.md) | Data & BI | En cours | — |


## Fichiers
- `index.html` : structure et textes en français
- `style.css` : couleurs, typographie, mise en page (thème clair et sombre)
- `script.js` : réglages (`CONFIG`), liste des projets (`PROJECTS`), traductions anglaises (`EN`)
- `dashboard.js` : le tableau de bord « Analyse des ventes » interactif (filtres État / Mois, clic sur le camembert)
- `labs-ds.js` : les labs Data Science with Python (DALEX, neurone vs MLP, MLP régularisé, scoring de crédit)
- `assets/varsovie-*.js` : les 3 modèles d'appartements exportés de scikit-learn (arbres encodés en base64)
- `neural-speech.js` : Neural Speech (vidéo du résultat final, MFCC + MLP rejoués sur de vrais enregistrements, preuves FP1-FP6)
- `assets/neural-speech-data.js` : 24 enregistrements du dataset (8 kHz) et les poids du MLP 416-64-32-4 ; `assets/neural-speech-demo.mp4` et `assets/ns-*.jpg` : vidéo et photos de validation
- `secel-demos.js` : ouvre les démos SECEL dans une fenêtre de navigateur (iframe)
- `demos/gestion/` et `demos/lauwa/` : vraies pages des deux applications PHP enregistrées depuis XAMPP ; `demo-shim.js` y remplace le serveur (connexion par rôle, formulaires, livraisons)
- `intro-ml.js` : les labs Introduction to Machine Learning (descente de gradient, k-fold / métriques / random search, prix BMW, vins, K-means)
- `assets/intro-ml-data.js` : modèles BMW et vins exportés de scikit-learn, résultats des labs, clients du centre commercial
- `assets/intro-ml-cal.js` : les 20 640 logements de California Housing (entiers encodés en base64) pour réentraîner la descente de gradient
- `superstore.js` : le lab Power BI SuperStore reconstruit (2 pages du rapport, vue Données, étapes Power Query, mesures DAX)
- `aero.js` : la démo Aero Predict « Tester un moteur » (vraies prédictions des 6 modèles sur FD001)
- `assets/aero-data.js` : ces prédictions, cycle par cycle, pour les 100 moteurs test (chargées à l'ouverture de la démo)
- `javazic.js` : l'application JAVAZIC utilisable (portage JavaScript du projet Java Swing). Comptes : guest/guest, alice/alice, bob/bob, admin/admin
- `plantamitz.js` : le jeu Plantamitz jouable (portage JavaScript du code C)
- `assets/plantamitz-musique.mp3` : la musique du jeu (ton musique.wav converti)
- `assets/plantamitz-demo.mp4` : la vidéo de la version console d'origine
- `assets/ventes-data.js` : les 19 821 transactions extraites de ton fichier Power BI, chargées seulement quand on ouvre le projet
- `assets/` : images (capture du tableau de bord Power BI)
- `projets/<id>/README.md` : la présentation détaillée de chaque projet

## Ajouter un projet
1. Ouvre `script.js` et descends jusqu'à `const PROJECTS = [`.
2. Copie un bloc `{ id: ..., }` existant et colle-le dans la liste.
3. Change `id`, `cats`, `status` (`"done"` ou `"wip"`), `stack`, les textes `fr` et `en`.
4. Pour une capture d'écran, mets l'image dans `assets/` et écris `image: "assets/mon-image.jpg"`.
   Pour ajouter des rubriques (concepts, problèmes et solutions…), ajoute `sections` dans les textes `fr` et `en` (voir le projet `lab7-superstore`).
   Sans image, choisis une vignette : `thumb: "scatter" | "wave" | "kernel" | "list" | "hist"`.
5. Le bouton « Code » de chaque projet pointe vers sa page `projets/<id>/README.md`. Ajoute un dossier `projets/<id>/` avec son README pour un nouveau projet.
6. Lien direct vers un projet : `https://dorline0121.github.io/#<id>`.

## À compléter dans `CONFIG` (en haut de `script.js`)
- `portfolio` : lien du portfolio (GitHub Pages), déjà rempli.
- `linkedin` : l'URL de ton profil LinkedIn (le lien apparaît dès qu'il est rempli)
- `cv` : le chemin de ton CV, par ex. `assets/CV_Dorline_TIAKO_OKASSIE.pdf` (le bouton apparaît dès qu'il est rempli)

## Mettre en ligne avec GitHub Pages
1. Crée un dépôt public nommé `Dorline0121.github.io`.
2. Envoie tous les fichiers de ce dossier à la racine du dépôt.
3. Va dans **Settings → Pages**, choisis la branche `main` et le dossier `/ (root)`.
4. Après une minute, le site est en ligne sur `https://dorline0121.github.io`.

Tes derniers dépôts GitHub s'affichent automatiquement sous les projets une fois le site en ligne.

## Tester en local
Ouvre `index.html` dans ton navigateur, ou lance `python -m http.server` dans le dossier puis va sur `http://localhost:8000`.
