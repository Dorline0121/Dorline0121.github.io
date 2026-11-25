/* =========================================================
   Portfolio · Dorline TIAKO OKASSIE
   ---------------------------------------------------------
   POUR AJOUTER UN PROJET : copie un objet dans PROJECTS
   (plus bas), change les textes, et c'est tout. La grille,
   les filtres et la fenêtre de détail se mettent à jour seuls.
   ========================================================= */

/* ---------- 1. Réglages personnels ---------- */
const CONFIG = {
  email: "dorlineokassie237@gmail.com",
  github: "https://github.com/Dorline0121",
  githubUser: "Dorline0121",       // sert à afficher tes derniers dépôts automatiquement
  linkedin: "https://www.linkedin.com/in/dorline-tiako-okassie-a744462b6",                  // colle ici l'URL de ton profil LinkedIn (ex. https://www.linkedin.com/in/...)
  portfolio: "https://dorline0121.github.io",   // lien du portfolio (GitHub Pages)
  cv: "assets/CV_TIAKO_OKASSIE_Dorline.pdf",   // ton CV (PDF dans assets/)
};

/* ---------- 2. Catégories (filtres) ---------- */
const CATEGORIES = {
  data:     { fr: "Data & BI",  en: "Data & BI" },
  ml:       { fr: "ML & IA",    en: "ML & AI" },
  embedded: { fr: "Embarqué",   en: "Embedded" },
  software: { fr: "Logiciel",   en: "Software" },
};

/* ---------- 3. Projets ----------
   Champs :
   id        identifiant unique (sans espace)
   cats      une ou plusieurs catégories ci-dessus
   status    "done" (terminé) ou "wip" (en cours)
   image     capture d'écran (optionnel) — sinon "thumb" dessine une vignette
   thumb     "scatter" | "wave" | "kernel" | "list" | "hist"
   stack     technologies affichées en étiquettes
   repo/demo liens (laisse "" si tu n'en as pas encore)
   fr / en   textes dans chaque langue
------------------------------------------------------------ */
const PROJECTS = [
  {
    id: "aero-predict",
    cats: ["ml"],
    status: "wip",
    image: "assets/aero-predict.jpg",
    app: "aero",
    cta: { fr: "Tester la démo", en: "Try the demo" },
    badge: { fr: "Démo interactive", en: "Interactive demo" },
    stack: ["Python", "PyTorch", "LSTM", "XGBoost", "Optuna", "Streamlit"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/aero-predict", demo: "",
    fr: {
      title: "Aero Predict",
      summary: "Prédiction de la durée de vie restante (RUL) d'un moteur d'avion, vol par vol, à partir de ses capteurs, pour le retirer avant la panne.",
      metric: "RMSE 11,16", metricLabel: "sur FD001 (objectif < 18,91)",
      context: "ECE Paris · PPE Technique · ING4 · projet d'équipe · jusqu'en décembre 2026",
      text: "Projet de maintenance prédictive en équipe de 6, sur les moteurs NASA C-MAPSS. Surestimer la durée de vie est le cas dangereux : tout le projet est construit pour l'éviter. La démo ci-dessous rejoue les vraies prédictions des 6 modèles sur les 100 moteurs test de FD001, en attendant le prototype complet prévu en décembre.",
      points: [
        "Comparaison de 6 modèles : arbres (RF, LightGBM, XGBoost) et réseaux (LSTM, CNN 1D)",
        "Ensemble de 5 LSTM : RMSE de 11,16 au test, contre 19,70 pour XGBoost au départ",
        "Score NASA divisé par 3,75 en deux mois (852,9 à 227,2)",
        "Prédiction en 1 à 15 ms, un cycle à la fois ; le modèle ne lit jamais le futur",
        "Alerte déclenchée à 30 cycles de la panne, validée sur des moteurs jamais vus",
        "Prototype en cours : démo locale avec Streamlit, explicabilité (SHAP) prévue",
        "Mon rôle : référente tableau de bord et alertes, tests de la démo « Tester un moteur », relecture des soutenances",
      ],
    },
    en: {
      title: "Aero Predict",
      summary: "Predicting the remaining useful life (RUL) of an aircraft engine, flight by flight, from its sensors, so it can be removed before it fails.",
      metric: "RMSE 11.16", metricLabel: "on FD001 (target < 18.91)",
      context: "ECE Paris · Technical PPE · Year 4 · team project · running until December 2026",
      text: "Predictive maintenance in a team of 6, on NASA C-MAPSS engines. Overestimating remaining life is the dangerous error, and the whole project is built to avoid it. The demo below replays the real predictions of the 6 models on the 100 FD001 test engines, ahead of the full prototype planned for December.",
      points: [
        "Comparison of 6 models: tree models (RF, LightGBM, XGBoost) and neural networks (LSTM, 1D CNN)",
        "Ensemble of 5 LSTMs: test RMSE of 11.16, against 19.70 for the first XGBoost",
        "NASA score divided by 3.75 in two months (852.9 down to 227.2)",
        "Prediction in 1 to 15 ms, one cycle at a time; the model never reads the future",
        "Alert raised 30 cycles before failure, checked on engines never seen in training",
        "Prototype in progress: local Streamlit demo, explainability (SHAP) planned",
        "My role: dashboard and alerts lead, testing the “Test an engine” demo, reviewing the project reviews",
      ],
    },
  },
  {
    id: "plantamitz",
    cats: ["software"],
    status: "done",
    image: "assets/plantamitz.png",
    video: "assets/plantamitz-demo.mp4",
    poster: "assets/plantamitz-poster.jpg",
    game: "plantamitz",
    cta: { fr: "Jouer", en: "Play" },
    badge: { fr: "Jouable", en: "Playable" },
    stack: ["C", "JavaScript", "Algorithmes", "Projet de groupe"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/plantamitz", demo: "",
    fr: {
      title: "Plantamitz",
      summary: "Jeu de plateau en C inspiré des jeux « match-3 » : remplir un contrat de collecte de fruits et légumes en un nombre limité de coups.",
      metric: "25 × 45", metricLabel: "cases par plateau",
      context: "ECE Paris · Programmation en C · projet de groupe",
      text: "Le jeu original est écrit en C pour la console Windows. Pour pouvoir y jouer ici, je l'ai réécrit en JavaScript à partir du même code : mêmes règles, mêmes contrats, mêmes touches. Cliquez dans la console puis utilisez le clavier, ou touchez les cases sur téléphone.",
      points: [
        "Génération aléatoire du plateau qui refuse les alignements interdits (horizontal, vertical, carré 2×2, figure en H)",
        "Gestion des contrats par niveau, avec compteur d'items restants et de coups restants",
        "Vérification automatique de l'état du contrat : réussi, en cours ou échoué",
        "Détection des alignements au clavier (Z, Q, S, D) et affichage coloré en console",
        "Bonus : musique d'introduction et bombes qui modifient les alignements",
      ],
    },
    en: {
      title: "Plantamitz",
      summary: "A match-3 style board game written in C: fill a contract for fruits and vegetables within a limited number of moves.",
      metric: "25 × 45", metricLabel: "cells per board",
      context: "ECE Paris · C programming · team project",
      text: "The original game is written in C for the Windows console. To make it playable here, I rewrote it in JavaScript from the same code: same rules, same contracts, same keys. Click inside the console and use the keyboard, or tap the cells on a phone.",
      points: [
        "Random board generation that rejects forbidden patterns (horizontal, vertical, 2×2 square, H shape)",
        "Contracts per level, with counters for items and moves left",
        "Automatic contract status check: success, in progress or failed",
        "Pattern detection from the keyboard (Z, Q, S, D) and coloured console display",
        "Bonus: intro music and bombs that change the matches",
      ],
    },
  },
  {
    id: "analyse-ventes",
    cats: ["data"],
    status: "done",
    image: "assets/analyse-ventes.jpg",
    stack: ["Power BI", "DAX", "Data modeling", "Data viz"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/analyse-ventes", demo: "",
    extra: "salesChart",
    cta: { fr: "Tester le tableau de bord", en: "Try the dashboard" },
    badge: { fr: "Interactif", en: "Interactive" },
    fr: {
      title: "Analyse des ventes",
      summary: "Tableau de bord Power BI pour suivre le chiffre d'affaires d'un revendeur de vélos : évolution mensuelle, marques, clients et patrimoine.",
      metric: "19 821", metricLabel: "transactions analysées",
      context: "Power BI · données 2017 d'un revendeur de vélos australien",
      text: "L'objectif : donner à une équipe commerciale une vue d'ensemble de l'année 2017 qu'elle peut filtrer par État et par mois, sans toucher aux données brutes. Le tableau de bord ci-dessous est reconstruit en JavaScript à partir des données du fichier Power BI et réagit aux filtres comme dans Power BI.",
      points: [
        "Modèle relationnel à trois tables (Transactions, Démographie, Adresses) reliées par l'identifiant client",
        "Indicateurs clés : chiffre d'affaires, nombre de transactions, taux de marge moyen, CA par marque (mesure DAX)",
        "Filtres interactifs par État (NSW, QLD, VIC) et par mois",
        "Évolution du CA, répartition par marque, meilleurs clients et ventes selon le patrimoine",
      ],
    },
    en: {
      title: "Sales Analysis",
      summary: "Power BI dashboard tracking a bike retailer's revenue: monthly trend, brands, customers and property value.",
      metric: "19,821", metricLabel: "transactions analysed",
      context: "Power BI · 2017 data from an Australian bike retailer",
      text: "The goal: give a sales team an overview of 2017 that they can filter by state and month without touching the raw data. The dashboard below is rebuilt in JavaScript from the Power BI file's data and reacts to filters just like in Power BI.",
      points: [
        "Relational model with three tables (Transactions, Demographics, Addresses) joined on customer ID",
        "Key metrics: revenue, transaction count, average margin rate, revenue per brand (DAX measure)",
        "Interactive slicers by state (NSW, QLD, VIC) and by month",
        "Revenue trend, brand split, top customers and sales by property valuation",
      ],
    },
  },
  {
    id: "lab7-superstore",
    cats: ["data"],
    status: "done",
    image: "assets/superstore.jpg",
    app: "superstore",
    cta: { fr: "Ouvrir le rapport", en: "Open the report" },
    badge: { fr: "Interactif", en: "Interactive" },
    stack: ["Power BI Desktop", "Power Query", "DAX", "Excel"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/lab7-superstore", demo: "",
    fr: {
      title: "Tableau de bord SuperStore",
      summary: "Lab Power BI : d'un fichier brut mal formé à un tableau de bord interactif de deux pages, avec mesures DAX, segments et treemap à couleurs conditionnelles.",
      metric: "23,95K", metricLabel: "de ventes analysées, 50 commandes 2023",
      context: "ECE Paris · ING4 · Lab 7 Business Intelligence · 18 novembre 2026 · travail individuel",
      text: "Toute la chaîne BI sur un petit jeu de ventes : importer et nettoyer les données avec Power Query, créer des mesures DAX, construire les visuels, ajouter des filtres puis raconter ce que montrent les chiffres. Ci-dessous, le rapport reconstruit en JavaScript à partir du fichier .pbix et des données d'origine : les deux pages, la table, les étapes Power Query et les mesures.",
      points: [
        "Nettoyage dans Power Query : fractionnement d'une colonne unique en 8 colonnes, en-têtes, types de données avec paramètres régionaux",
        "Mesures DAX Revenue et Total Margin, recalculées selon les filtres",
        "Page 1 : carte KPI, histogramme par catégorie, courbe mensuelle de la marge, segments Region et Vendeur",
        "Page 2 : treemap de la marge par région avec dégradé conditionnel rouge / gris / vert et analyse écrite pour le directeur",
        "Rapport de lab rédigé avec captures, tableaux de référence et conclusion",
      ],
      sections: [
        { titre: "Concepts importants", items: [
          "ETL avec Power Query : transformer avant de charger, chaque étape est enregistrée et rejouable",
          "Types de données et paramètres régionaux : un séparateur décimal mal lu fausse tous les calculs",
          "Mesure DAX contre colonne : une mesure s'adapte au contexte de filtre",
          "Hiérarchie de dates : choisir le bon niveau (mois plutôt que jour) pour lire une tendance",
          "Segments et interactions : filtrer tous les visuels d'un clic",
          "Mise en forme conditionnelle : une couleur doit avoir un sens métier (rouge = perte)",
          "Storytelling : conclure par une analyse claire pour la direction",
        ] },
        { titre: "Problèmes rencontrés et solutions", paires: [
          ["Toutes les valeurs d'une commande dans une seule cellule (Column1).", "Fractionner la colonne par délimiteur (virgule, à chaque occurrence) : 8 colonnes."],
          ["En-têtes promus deux fois : la première commande devenait l'en-tête, il ne restait que 49 lignes.", "Suppression de l'étape en trop dans « Étapes appliquées »."],
          ["Power BI en français lit 1200.50 comme 120050.", "Type modifié avec paramètres régionaux Anglais (États-Unis) pour Ventes et Profit."],
          ["Confusion entre le visuel « Map » (carte géographique) et la carte KPI « 123 ».", "Utilisation du visuel Carte (Card) pour afficher Revenue."],
          ["Courbe en « électrocardiogramme » avec l'axe des dates au jour.", "Garder seulement le niveau Mois de la hiérarchie de dates : 12 points lisibles."],
          ["Le dégradé par défaut colorait l'Est en rouge alors qu'il est rentable.", "Minimum personnalisé à −900, centre à 0 en gris : le rouge signifie vraiment une perte."],
        ] },
        { titre: "Ce que j'ai appris", items: [
          "Vérifier les données dès l'import : le nombre de lignes et les types évitent des erreurs invisibles plus tard",
          "Préférer des mesures DAX aux colonnes brutes pour un tableau de bord vraiment interactif",
          "Une visualisation doit être réglée pour dire la vérité : niveau de date, échelle de couleurs",
          "Lire les chiffres : 81 % des ventes en Informatique, le Sud est la région la plus rentable, l'Est la plus fragile, et les pertes viennent de la catégorie Bureau (−190 €), pas d'une région",
        ] },
      ],
    },
    en: {
      title: "SuperStore Dashboard",
      summary: "Power BI lab: from a badly formatted raw file to a two-page interactive dashboard, with DAX measures, slicers and a treemap with conditional colours.",
      metric: "23.95K", metricLabel: "in sales analysed, 50 orders in 2023",
      context: "ECE Paris · Year 4 · Lab 7 Business Intelligence · 18 November 2026 · individual work",
      text: "The whole BI chain on a small sales dataset: import and clean the data with Power Query, create DAX measures, build the visuals, add filters, then tell what the numbers show. Below, the report rebuilt in JavaScript from the .pbix file and the original data: both pages, the table, the Power Query steps and the measures.",
      points: [
        "Cleaning in Power Query: one column split into 8, headers, data types with locale",
        "DAX measures Revenue and Total Margin, recalculated with the filters",
        "Page 1: KPI card, column chart by category, monthly margin line, Region and Vendeur slicers",
        "Page 2: margin treemap by region with a red / grey / green conditional gradient and a written analysis for the director",
        "Lab report with screenshots, reference tables and conclusion",
      ],
      sections: [
        { titre: "Key concepts", items: [
          "ETL with Power Query: transform before loading, every step is recorded and replayable",
          "Data types and locale: a misread decimal separator breaks every calculation",
          "DAX measure vs column: a measure adapts to the filter context",
          "Date hierarchy: pick the right level (month rather than day) to read a trend",
          "Slicers and interactions: filter every visual in one click",
          "Conditional formatting: a colour must carry business meaning (red = loss)",
          "Storytelling: end with a clear analysis for management",
        ] },
        { titre: "Problems met and solutions", paires: [
          ["All the values of an order in a single cell (Column1).", "Split column by delimiter (comma, each occurrence): 8 columns."],
          ["Headers promoted twice: the first order became the header and only 49 rows remained.", "Deleted the extra step in “Applied steps”."],
          ["Power BI with French settings reads 1200.50 as 120050.", "Changed type with locale English (United States) for Ventes and Profit."],
          ["Confusion between the geographic “Map” visual and the “123” KPI card.", "Used the Card visual to show Revenue."],
          ["An “electrocardiogram” line with a daily date axis.", "Kept only the Month level of the date hierarchy: 12 readable points."],
          ["The default gradient coloured the East red although it is profitable.", "Custom minimum at −900, centre at 0 in grey: red now really means a loss."],
        ] },
        { titre: "What I learned", items: [
          "Check the data right at import: row counts and types prevent invisible errors later",
          "Prefer DAX measures over raw columns for a truly interactive dashboard",
          "A visual must be tuned to tell the truth: date level, colour scale",
          "Reading the numbers: 81% of sales in Informatique, the South is the most profitable region, the East the weakest, and losses come from the Bureau category (−€190), not from a region",
        ] },
      ],
    },
  },
  {
    id: "labs-data-science",
    cats: ["ml"],
    status: "done",
    image: "assets/labs-ds.jpg",
    app: "labsds",
    cta: { fr: "Ouvrir les labs", en: "Open the labs" },
    badge: { fr: "Interactif", en: "Interactive" },
    stack: ["Python", "scikit-learn", "DALEX", "Keras", "XGBoost", "pandas"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/labs-data-science", demo: "",
    fr: {
      title: "Machine Learning en Python",
      summary: "Quatre labs du cours Data Science with Python : expliquer un modèle de prix avec DALEX, scorer un risque de crédit, comprendre ce qu'apporte un réseau de neurones et le régulariser.",
      metric: "R² 0,978", metricLabel: "meilleur modèle (MLP régularisé)",
      context: "ECE Paris · ING4 · Data Science with Python (Mme Laure Normand) · novembre 2026 · travail individuel",
      text: "Les modèles d'appartements tournent ici à l'identique : je les ai exportés depuis scikit-learn et ils redonnent exactement les prédictions du notebook (4 820, 4 408 et 4 662 zł/m² pour le client du TP). Les explications DALEX se recalculent pour chaque appartement.",
      points: [
        "DALEX sur les prix au m² à Varsovie : importance des variables, profils, Break Down et « et si ? » pour expliquer une estimation à un client",
        "Comparaison régression linéaire, arbre de décision et Random Forest : erreur divisée par 2,6, et l'effet en U de l'année de construction retrouvé",
        "Scoring de crédit (German Credit) : 7 modèles en validation croisée à 5 plis, choix guidé par le recall, le F1 et l'écart train-test",
        "Neurone seul contre MLP sur make_moons : 0,84 contre 0,95 de précision, et le détail des 337 paramètres",
        "MLP Keras sur données tabulaires : surapprentissage visible sur les courbes, corrigé par dropout et early stopping",
        "Une présentation DALEX pour une agence immobilière, en français et en anglais",
      ],
      sections: [
        { titre: "Concepts importants", items: [
          "Explicabilité (XAI) avec DALEX : importance par permutation, profils de dépendance partielle, Break Down, Ceteris Paribus",
          "Compromis biais / variance : profondeur d'un arbre, écart entre score d'entraînement et de test",
          "Méthodes d'ensemble : bagging (Random Forest) et boosting (XGBoost)",
          "Classes déséquilibrées : precision, recall, F1 et AUC plutôt que l'accuracy ; class_weight=\"balanced\"",
          "Validation croisée stratifiée à 5 plis",
          "Réseaux de neurones : couches cachées, ReLU, rétropropagation, optimiseur Adam, nombre de paramètres",
          "Régularisation : dropout et early stopping ; mise à l'échelle des entrées et de la cible",
        ] },
        { titre: "Problèmes rencontrés et solutions", paires: [
          ["La régression linéaire ignore l'année de construction (importance ≈ 0), alors que les prix réels forment un U.", "Arbre et Random Forest, expliqués avec DALEX : ils retrouvent le U, et l'erreur passe de 263 à 101 zł/m²."],
          ["Un arbre sans limite apprend par cœur : erreur nulle en entraînement, la pire en test.", "Choix de la profondeur en comparant les scores d'entraînement et de test (profondeur 4 pour le crédit, 10 pour les appartements)."],
          ["70 % de bons payeurs : l'accuracy est trompeuse et la Random Forest ne détecte que 37 % des mauvais payeurs.", "Recall, F1 et AUC comme critères, et class_weight=\"balanced\"."],
          ["Comparaison injuste : seule la Random Forest était équilibrée.", "Même réglage appliqué à la régression logistique, qui devient la meilleure (recall 0,720, F1 0,606)."],
          ["Un neurone seul plafonne à 0,84 sur les deux lunes.", "Deux couches cachées de 16 neurones (ReLU) : frontière courbe, 0,95."],
          ["Le MLP surapprend après l'époque 33.", "Dropout 0,2 et early stopping (patience 20) : erreur réduite de 37 %."],
          ["La sortie TanH ne produit que des valeurs entre −1 et 1.", "Prix mis à l'échelle entre −1 et 1 pour l'entraînement, puis reconverti en złoty pour l'évaluation."],
        ] },
        { titre: "Ce que j'ai appris", items: [
          "Un modèle plus complexe n'est pas forcément meilleur, surtout sur un petit jeu de données",
          "Comparer des modèles dans les mêmes conditions avant de conclure",
          "Sur des données déséquilibrées, l'AUC seule ne suffit pas : il faut regarder le recall et le F1",
          "L'explicabilité permet d'utiliser un modèle plus performant tout en justifiant ses décisions",
          "Sur de petites données tabulaires, les modèles classiques restent très compétitifs face aux réseaux de neurones",
        ] },
      ],
    },
    en: {
      title: "Machine Learning in Python",
      summary: "Four labs from the Data Science with Python course: explain a price model with DALEX, score credit risk, understand what a neural network adds and regularise it.",
      metric: "R² 0.978", metricLabel: "best model (regularised MLP)",
      context: "ECE Paris · Year 4 · Data Science with Python (Mrs Laure Normand) · November 2026 · individual work",
      text: "The apartment models run here identically: I exported them from scikit-learn and they give exactly the notebook's predictions (4,820, 4,408 and 4,662 zł/m² for the lab client). The DALEX explanations recalculate for every apartment.",
      points: [
        "DALEX on Warsaw prices per m²: feature importance, profiles, Break Down and what-if to explain an estimate to a client",
        "Linear regression vs decision tree vs Random Forest: error divided by 2.6, and the U-shaped effect of the construction year recovered",
        "Credit scoring (German Credit): 7 models with 5-fold cross-validation, chosen on recall, F1 and train-test gap",
        "Single neuron vs MLP on make_moons: 0.84 vs 0.95 accuracy, and the breakdown of the 337 parameters",
        "Keras MLP on tabular data: overfitting visible on the curves, fixed with dropout and early stopping",
        "A DALEX presentation for a real-estate agency, in French and English",
      ],
      sections: [
        { titre: "Key concepts", items: [
          "Explainability (XAI) with DALEX: permutation importance, partial dependence profiles, Break Down, Ceteris Paribus",
          "Bias / variance trade-off: tree depth, gap between training and test scores",
          "Ensemble methods: bagging (Random Forest) and boosting (XGBoost)",
          "Imbalanced classes: precision, recall, F1 and AUC instead of accuracy; class_weight=\"balanced\"",
          "Stratified 5-fold cross-validation",
          "Neural networks: hidden layers, ReLU, backpropagation, Adam optimizer, parameter count",
          "Regularisation: dropout and early stopping; scaling of inputs and target",
        ] },
        { titre: "Problems met and solutions", paires: [
          ["Linear regression ignores the construction year (importance ≈ 0), while real prices form a U.", "Tree and Random Forest, explained with DALEX: they recover the U, and the error drops from 263 to 101 zł/m²."],
          ["An unlimited tree learns by heart: zero training error, the worst test error.", "Depth chosen by comparing training and test scores (depth 4 for credit, 10 for apartments)."],
          ["70% good payers: accuracy is misleading and the Random Forest only detects 37% of bad payers.", "Recall, F1 and AUC as criteria, and class_weight=\"balanced\"."],
          ["Unfair comparison: only the Random Forest was balanced.", "Same setting applied to logistic regression, which becomes the best (recall 0.720, F1 0.606)."],
          ["A single neuron plateaus at 0.84 on the two moons.", "Two hidden layers of 16 neurons (ReLU): curved boundary, 0.95."],
          ["The MLP overfits after epoch 33.", "Dropout 0.2 and early stopping (patience 20): error cut by 37%."],
          ["The TanH output only produces values between −1 and 1.", "Price scaled to [−1, 1] for training, converted back to złoty for evaluation."],
        ] },
        { titre: "What I learned", items: [
          "A more complex model is not always better, especially on a small dataset",
          "Compare models under the same conditions before concluding",
          "On imbalanced data, AUC alone is not enough: look at recall and F1",
          "Explainability makes it possible to use a stronger model while justifying its decisions",
          "On small tabular data, classical models remain very competitive against neural networks",
        ] },
      ],
    },
  },
  {
    id: "intro-ml",
    cats: ["ml"],
    status: "done",
    image: "assets/intro-ml.jpg",
    app: "introml",
    cta: { fr: "Ouvrir les labs", en: "Open the labs" },
    badge: { fr: "Interactif", en: "Interactive" },
    stack: ["Python", "NumPy", "pandas", "scikit-learn", "Matplotlib", "Seaborn", "Jupyter"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/intro-ml", demo: "",
    fr: {
      title: "Introduction au Machine Learning",
      summary: "Trois labs du cours : descente de gradient codée à la main, validation croisée, métriques et random search « from scratch », prix de BMW d'occasion, classification de vins et segmentation de clients avec K-means.",
      metric: "R² 0,849", metricLabel: "prix des BMW (Lasso)",
      context: "ECE Paris · ING4 · Introduction to Machine Learning · octobre 2026 · travail individuel (groupe 01)",
      text: "Tout tourne ici, dans le navigateur. La descente de gradient est réentraînée sur les 12 384 logements californiens ; les modèles BMW et vins sont exportés depuis scikit-learn et redonnent exactement les résultats des notebooks (R² 0,8487 pour le Lasso, 45 vins sur 45 pour la Random Forest) ; K-means s'exécute en direct sur les 200 clients.",
      points: [
        "Régression linéaire par descente de gradient avec pénalité L2, codée avec NumPy, puis grid search sur 36 réglages : MAE de test 0,529 (scikit-learn : 0,530)",
        "One-hot encoding, MAE, MSE, RMSE et R² recodés à la main ; lecture biais / variance selon le pas, le nombre d'itérations et λ",
        "Validation croisée k-fold, precision / recall / F1 et random search écrits sans scikit-learn, résultats identiques à la bibliothèque",
        "Prix de 4 779 BMW d'occasion : nettoyage, âge de la voiture, polynômes, standardisation, one-hot ; régression linéaire, Ridge et Lasso (R² 0,849, erreur ≈ 3 360 €)",
        "Vins : 6 ratios créés, 4 pipelines sans fuite de données comparés en macro-F1, Random Forest réglée par GridSearchCV (45 / 45 sur le test)",
        "Clients : K-means sur 4 variables standardisées, k = 6 choisi par le coude et la silhouette (0,425), stabilité vérifiée (ARI = 1), 6 segments et actions marketing",
      ],
      sections: [
        { titre: "Concepts importants", items: [
          "Descente de gradient : gradient de la MSE, taux d'apprentissage, convergence, régularisation L2",
          "Séparation train / validation / test et validation croisée k-fold (mélange, graine fixe)",
          "Fuite de données : séparer avant tout fit, transformateurs ajustés sur le train uniquement, pipelines",
          "Feature engineering : âge, polynômes de degré 2, ratios, one-hot avec catégories rares regroupées",
          "Ridge (L2) contre Lasso (L1) : le Lasso met des poids exactement à 0 et sélectionne les variables",
          "Métriques : MAE, RMSE, R² ; matrice de confusion, precision, recall, F1, moyennes macro, AUC",
          "Recherche d'hyperparamètres : grid search, random search, GridSearchCV sans toucher au test",
          "Apprentissage non supervisé : K-means, standardisation, méthode du coude, silhouette, ARI",
        ] },
        { titre: "Problèmes rencontrés et solutions", paires: [
          ["Avec un pas de 0,001 et 200 itérations, R² de validation de −1,10 : la descente n'a pas convergé.", "Grid search sur le pas, les itérations et λ, avec des variables standardisées : lr = 0,1 et 200 itérations suffisent (R² 0,617)."],
          ["Les fleurs d'Iris sont triées par espèce : sans mélange, chaque pli ne contient qu'une espèce.", "Mélange des indices avec une graine fixe, puis np.array_split pour des plis de tailles inégales."],
          ["Risque de division par zéro dans precision et recall, et avertissement de non-convergence.", "Retour à 0 quand le dénominateur est nul ; max_iter=10000 pour la régression logistique."],
          ["Un tirage naïf peut reprendre deux fois la même combinaison, et le même modèle garde ses anciens réglages.", "Tirage sans remise parmi les 32 combinaisons et une copie neuve du modèle (clone) à chaque essai."],
          ["Données BMW impossibles : kilométrage négatif, puissance nulle, 62 prix sous 1 000 €.", "Suppression de ces 64 lignes (4 843 → 4 779 voitures)."],
          ["Beaucoup de modèles BMW rares, absents du train ou presque.", "OneHotEncoder avec min_frequency=10 et handle_unknown=\"infrequent_if_exist\" : ils sont regroupés."],
          ["Échelles très différentes (kilomètres ≈ 10⁵, puissance ≈ 10²), alors que Ridge, Lasso et K-means y sont sensibles.", "StandardScaler ajusté sur le train seulement, placé dans les pipelines."],
          ["Un 0/1 comme le genre, une fois standardisé, ferait couper les clients par genre plutôt que par comportement.", "Genre gardé seulement pour décrire les segments ; ajout du ratio dépense / revenu à la place."],
          ["Seulement 45 vins en test : une erreur fait perdre 2,2 points, et la Random Forest affiche 100 %.", "Validation croisée stratifiée en plus du test, et prudence dans la conclusion."],
        ] },
        { titre: "Ce que j'ai appris", items: [
          "Recoder un algorithme est le meilleur moyen de comprendre ce que fait vraiment la bibliothèque",
          "Le pas et le nombre d'itérations comptent autant que le modèle lui-même",
          "Choisir la métrique avant de comparer : l'accuracy seule cache des erreurs sur les petites classes",
          "La régularisation rend un modèle plus simple et plus stable, au prix d'un peu de biais",
          "Sans étiquettes, un choix de k se justifie par plusieurs critères et par l'utilité métier",
          "Un score parfait sur un petit test reste à confirmer par validation croisée",
        ] },
      ],
    },
    en: {
      title: "Introduction to Machine Learning",
      summary: "Three labs from the course: hand-coded gradient descent, cross-validation, metrics and random search from scratch, used BMW prices, wine classification and customer segmentation with K-means.",
      metric: "R² 0.849", metricLabel: "BMW prices (Lasso)",
      context: "ECE Paris · Year 4 · Introduction to Machine Learning · October 2026 · individual work (group 01)",
      text: "Everything runs here, in the browser. Gradient descent is retrained on the 12,384 Californian homes; the BMW and wine models are exported from scikit-learn and give exactly the notebook results (R² 0.8487 for the Lasso, 45 of 45 wines for the Random Forest); K-means runs live on the 200 customers.",
      points: [
        "Linear regression by gradient descent with an L2 penalty, coded with NumPy, then grid search over 36 settings: test MAE 0.529 (scikit-learn: 0.530)",
        "One-hot encoding, MAE, MSE, RMSE and R² recoded by hand; bias / variance reading by step size, iterations and λ",
        "k-fold cross-validation, precision / recall / F1 and random search written without scikit-learn, same results as the library",
        "Prices of 4,779 used BMWs: cleaning, car age, polynomials, scaling, one-hot; linear regression, Ridge and Lasso (R² 0.849, error ≈ €3,360)",
        "Wines: 6 engineered ratios, 4 leakage-safe pipelines compared on macro-F1, Random Forest tuned with GridSearchCV (45 / 45 on the test set)",
        "Customers: K-means on 4 standardised features, k = 6 chosen by elbow and silhouette (0.425), stability checked (ARI = 1), 6 segments and marketing actions",
      ],
      sections: [
        { titre: "Key concepts", items: [
          "Gradient descent: MSE gradient, learning rate, convergence, L2 regularisation",
          "Train / validation / test split and k-fold cross-validation (shuffle, fixed seed)",
          "Data leakage: split before any fit, transformers fitted on the training set only, pipelines",
          "Feature engineering: age, degree-2 polynomials, ratios, one-hot with rare categories grouped",
          "Ridge (L2) vs Lasso (L1): the Lasso sets weights exactly to 0 and selects features",
          "Metrics: MAE, RMSE, R²; confusion matrix, precision, recall, F1, macro averages, AUC",
          "Hyperparameter search: grid search, random search, GridSearchCV without touching the test set",
          "Unsupervised learning: K-means, scaling, elbow method, silhouette, ARI",
        ] },
        { titre: "Problems met and solutions", paires: [
          ["With a step of 0.001 and 200 iterations, validation R² of −1.10: gradient descent had not converged.", "Grid search over the step, iterations and λ, with standardised features: lr = 0.1 and 200 iterations are enough (R² 0.617)."],
          ["The Iris flowers are sorted by species: without shuffling, each fold holds a single species.", "Indices shuffled with a fixed seed, then np.array_split for folds of unequal size."],
          ["Risk of division by zero in precision and recall, and a non-convergence warning.", "Return 0 when the denominator is zero; max_iter=10000 for logistic regression."],
          ["A naive draw can pick the same combination twice, and a reused model keeps its old settings.", "Draw without replacement among the 32 combinations and a fresh copy of the model (clone) for each trial."],
          ["Impossible BMW records: negative mileage, zero power, 62 prices below €1,000.", "These 64 rows removed (4,843 → 4,779 cars)."],
          ["Many rare BMW models, absent or almost absent from the training set.", "OneHotEncoder with min_frequency=10 and handle_unknown=\"infrequent_if_exist\": they are grouped."],
          ["Very different scales (km ≈ 10⁵, power ≈ 10²), while Ridge, Lasso and K-means are sensitive to them.", "StandardScaler fitted on the training set only, inside the pipelines."],
          ["A 0/1 feature like gender, once standardised, would make K-means split customers by gender instead of behaviour.", "Gender kept only to describe the segments; the spending / income ratio added instead."],
          ["Only 45 test wines: one error costs 2.2 points, and the Random Forest shows 100%.", "Stratified cross-validation on top of the test set, and a cautious conclusion."],
        ] },
        { titre: "What I learned", items: [
          "Recoding an algorithm is the best way to understand what the library really does",
          "The step size and the number of iterations matter as much as the model itself",
          "Choose the metric before comparing: accuracy alone hides errors on small classes",
          "Regularisation makes a model simpler and more stable, at the cost of a little bias",
          "Without labels, a choice of k is justified by several criteria and by business usefulness",
          "A perfect score on a small test set still has to be confirmed by cross-validation",
        ] },
      ],
    },
  },
  {
    id: "prediction-salaires",
    cats: ["ml"],
    status: "done",
    thumb: "scatter",
    stack: ["Python", "XGBoost", "Optuna", "Flask", "Docker"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/prediction-salaires", demo: "",
    fr: {
      title: "Prédiction de salaires",
      summary: "Pipeline de Machine Learning complet, de la donnée brute à une API prête à déployer, avec suivi des performances du modèle.",
      metric: "R² ≈ 0,98", metricLabel: "sur 250 000 lignes",
      context: "Machine Learning · de bout en bout",
      text: "Un projet pensé comme en entreprise : le modèle ne s'arrête pas au notebook, il est servi par une API et surveillé une fois en place.",
      points: [
        "Préparation d'un jeu de données de 250 000 lignes",
        "Modèle XGBoost, hyperparamètres optimisés avec Optuna",
        "Coefficient de détermination R² ≈ 0,98",
        "API de prédiction Flask, conteneurisée avec un Dockerfile",
        "Tableau de bord de monitoring du modèle",
      ],
    },
    en: {
      title: "Salary Prediction",
      summary: "End-to-end Machine Learning pipeline, from raw data to a deployable API, with model performance monitoring.",
      metric: "R² ≈ 0.98", metricLabel: "on 250,000 rows",
      context: "Machine Learning · end to end",
      text: "Built the way it would be at a company: the model doesn't stop at the notebook, it is served through an API and monitored once running.",
      points: [
        "Preparation of a 250,000-row dataset",
        "XGBoost model, hyperparameters tuned with Optuna",
        "Coefficient of determination R² ≈ 0.98",
        "Flask prediction API, containerised with a Dockerfile",
        "Model monitoring dashboard",
      ],
    },
  },
  {
    id: "neural-speech",
    cats: ["ml", "embedded"],
    status: "done",
    image: "assets/neural-speech.jpg",
    app: "neuralspeech",
    cta: { fr: "Voir la démo", en: "See the demo" },
    badge: { fr: "Vidéo + démo", en: "Video + demo" },
    stack: ["Arduino Due", "C++", "Python", "scikit-learn", "librosa", "Selenium", "Audacity", "Oscilloscope"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/neural-speech", demo: "",
    fr: {
      title: "Neural Speech",
      summary: "Commande vocale embarquée : on appuie sur un bouton, on dit « Paris », « Togo », « Cameroun » ou « Ivoire », et Google Earth s'envole vers la destination.",
      metric: "≈ 93 %", metricLabel: "mots reconnus (validation croisée)",
      context: "ECE Paris · ING3 · projet d'électronique embarquée (S6) · équipe de 5",
      text: "Toute la chaîne est faite par l'équipe : acquisition du son sur Arduino Due, filtrage, décimation, MFCC, réseau de neurones et pilotage de Google Earth. La vidéo montre le résultat final. En dessous, la reconnaissance tourne ici sur de vrais enregistrements du projet, avec les mêmes calculs et les mêmes poids, qui redonnent exactement les sorties du modèle Python.",
      points: [
        "Acquisition à 32 kHz par timer et ADC 12 bits, micro MAX9814, restitution par le DAC validée à l'oscilloscope",
        "Filtre passe-bas biquad anti-repliement : −73,6 dB vers 3,8 kHz (exigence −30 dB), puis décimation 32 → 8 kHz",
        "Dataset de 4 mots enregistré avec notre montage : 200 fichiers WAV d'une seconde (50 par mot)",
        "MFCC (13 coefficients × 32 trames) harmonisés entre Python et l'Arduino, MLP 416 → 64 → 32 → 4 exporté en C (model.h)",
        "Intégration : bouton et LED sur l'Arduino, liaison série vers Python, navigation Google Earth avec Selenium",
        "Livrables : planning Gantt, architectures, audit FP1 à FP6, soutenances devant jury",
      ],
      sections: [
        { titre: "Concepts importants", items: [
          "Échantillonnage et théorème de Nyquist-Shannon : 32 kHz pour capter, 8 kHz pour une voix limitée à 4 kHz",
          "Filtrage numérique IIR (biquad) et repliement de spectre",
          "Décimation et économie de mémoire sur microcontrôleur",
          "MFCC : pré-accentuation, fenêtre de Hamming, FFT, banc de filtres Mel, log et DCT",
          "Perceptron multicouche (ReLU, softmax) et export des poids vers du C",
          "Interruption timer, buffers et liaison série (UART) entre l'Arduino et le PC",
        ] },
        { titre: "Problèmes rencontrés et solutions", paires: [
          ["Dérive entre le signal d'entrée et le signal restitué par le DAC.", "Timer recalibré (RC = 1313 pour ≈ 32 kHz) et vérification par les logs série et l'oscilloscope."],
          ["Atténuation insuffisante du premier filtre.", "Coefficients du biquad recalculés en Python, puis validés dans Audacity : −73,6 dB vers 3,8 kHz."],
          ["Artefacts audio après le sous-échantillonnage.", "Filtre passe-bas appliqué avant la décimation."],
          ["Les MFCC calculés en Python et sur l'Arduino ne donnaient pas les mêmes vecteurs.", "Paramètres harmonisés (FFT 512, pas de 256, 26 filtres Mel, 13 coefficients) et même algorithme des deux côtés."],
          ["Erreurs d'arrondi en convertissant les poids du réseau en C.", "Script d'export dédié qui génère model.h automatiquement depuis l'entraînement."],
          ["Seulement 40 enregistrements par mot au lieu des 50 demandés.", "Enregistrements complétés par de l'augmentation de données, puis classes équilibrées à 50 exemples."],
          ["Le cahier des charges recommandait un buffer circulaire.", "Buffer statique d'une seconde, suffisant pour des commandes courtes ; testé sans débordement sur 20 acquisitions consécutives."],
          ["Selenium n'arrivait pas à piloter Google Earth.", "Chrome lancé avec le port de débogage 9222 et procédure de lancement documentée."],
        ] },
        { titre: "Ce que j'ai appris", items: [
          "Valider chaque étape avec une mesure (oscilloscope, spectre) avant de passer à la suivante",
          "Un modèle embarqué impose des choix de mémoire et de calcul dès l'acquisition",
          "Le prétraitement doit être identique à l'entraînement et sur la carte",
          "Documenter les écarts au cahier des charges et les justifier par des tests",
          "Travailler en équipe de 5 avec un planning et des jalons de soutenance",
        ] },
      ],
    },
    en: {
      title: "Neural Speech",
      summary: "Embedded voice command: press a button, say “Paris”, “Togo”, “Cameroun” or “Ivoire”, and Google Earth flies to the destination.",
      metric: "≈ 93%", metricLabel: "words recognised (cross-validation)",
      context: "ECE Paris · Year 3 · embedded electronics project (S6) · team of 5",
      text: "The team built the whole chain: sound capture on an Arduino Due, filtering, decimation, MFCC, neural network and Google Earth control. The video shows the final result. Below, the recognition runs here on real project recordings, with the same computations and weights, giving exactly the Python model's outputs.",
      points: [
        "32 kHz capture with a timer and 12-bit ADC, MAX9814 microphone, DAC playback validated on the oscilloscope",
        "Anti-aliasing biquad low-pass filter: −73.6 dB around 3.8 kHz (requirement −30 dB), then decimation 32 → 8 kHz",
        "4-word dataset recorded with our circuit: 200 one-second WAV files (50 per word)",
        "MFCC (13 coefficients × 32 frames) matched between Python and the Arduino, 416 → 64 → 32 → 4 MLP exported to C (model.h)",
        "Integration: button and LED on the Arduino, serial link to Python, Google Earth navigation with Selenium",
        "Deliverables: Gantt plan, architectures, FP1 to FP6 audit, jury presentations",
      ],
      sections: [
        { titre: "Key concepts", items: [
          "Sampling and the Nyquist-Shannon theorem: 32 kHz to capture, 8 kHz for a voice limited to 4 kHz",
          "IIR digital filtering (biquad) and aliasing",
          "Decimation and memory savings on a microcontroller",
          "MFCC: pre-emphasis, Hamming window, FFT, Mel filter bank, log and DCT",
          "Multilayer perceptron (ReLU, softmax) and exporting the weights to C",
          "Timer interrupts, buffers and serial link (UART) between the Arduino and the PC",
        ] },
        { titre: "Problems met and solutions", paires: [
          ["Drift between the input signal and the DAC output.", "Timer recalibrated (RC = 1313 for ≈ 32 kHz) and checked with serial logs and the oscilloscope."],
          ["The first filter did not attenuate enough.", "Biquad coefficients recomputed in Python, then validated in Audacity: −73.6 dB around 3.8 kHz."],
          ["Audio artefacts after downsampling.", "Low-pass filter applied before decimation."],
          ["MFCCs computed in Python and on the Arduino gave different vectors.", "Parameters matched (512 FFT, hop 256, 26 Mel filters, 13 coefficients) and the same algorithm on both sides."],
          ["Rounding errors when converting the network weights to C.", "Dedicated export script that generates model.h automatically from training."],
          ["Only 40 recordings per word instead of the required 50.", "Recordings completed with data augmentation, then classes balanced at 50 examples."],
          ["The specification recommended a circular buffer.", "One-second static buffer, enough for short commands; tested without overflow over 20 consecutive captures."],
          ["Selenium could not drive Google Earth.", "Chrome started with debugging port 9222 and a documented launch procedure."],
        ] },
        { titre: "What I learned", items: [
          "Validate each step with a measurement (oscilloscope, spectrum) before moving to the next",
          "An embedded model forces memory and compute choices from the capture stage onwards",
          "Preprocessing must be identical at training time and on the board",
          "Document deviations from the specification and justify them with tests",
          "Work in a team of 5 with a plan and presentation milestones",
        ] },
      ],
    },
  },
  {
    id: "fondamentaux-ml",
    cats: ["ml"],
    status: "done",
    thumb: "kernel",
    stack: ["Python", "Jupyter", "TensorFlow", "Google Colab"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/fondamentaux-ml", demo: "",
    fr: {
      title: "Fondamentaux ML & vision",
      summary: "Algorithmes codés pour comprendre ce qui se passe sous le capot : régressions, réseaux de neurones, convolutions.",
      metric: "5", metricLabel: "algorithmes implémentés",
      context: "ECE Paris · travaux depuis février 2026",
      text: "La figure animée en haut de cette page reprend l'un de ces travaux : une descente de gradient qui ajuste une droite de régression.",
      points: [
        "Régression linéaire et régression logistique",
        "Réseau de neurones qui résout le problème XOR",
        "Classification MNIST par CNN entraîné pour microcontrôleur",
        "Convolution 2D et détection de contours (filtres de Sobel et gaussien)",
        "Descente de gradient 2D appliquée à la régression linéaire multipoints",
      ],
    },
    en: {
      title: "ML & Vision Foundations",
      summary: "Algorithms coded from scratch to understand what happens under the hood: regressions, neural networks, convolutions.",
      metric: "5", metricLabel: "algorithms implemented",
      context: "ECE Paris · coursework since February 2026",
      text: "The animated figure at the top of this page is based on one of these: gradient descent fitting a regression line.",
      points: [
        "Linear and logistic regression",
        "Neural network solving the XOR problem",
        "MNIST classification with a CNN trained for a microcontroller",
        "2D convolution and edge detection (Sobel and Gaussian filters)",
        "2D gradient descent applied to multi-point linear regression",
      ],
    },
  },
  {
    id: "secel-formation",
    cats: ["software"],
    status: "done",
    image: "assets/secel-formation.jpg",
    app: "secelformation",
    cta: { fr: "Tester l'application", en: "Try the app" },
    badge: { fr: "Démo testable", en: "Live demo" },
    stack: ["PHP", "MySQL", "Bootstrap", "jQuery", "AJAX", "XAMPP"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/secel-formation", demo: "",
    fr: {
      title: "SECEL Formation",
      summary: "Application web de gestion d'un centre de formation : formations, planning, formateurs, apprenants, appel quotidien et attestations, avec deux rôles (administrateur et formateur).",
      metric: "2 rôles", metricLabel: "administrateur et formateur",
      context: "BTS Génie Logiciel · projet de soutenance · centre de formation SECEL",
      text: "J'ai adapté un système open source de gestion des présences (PHP / MySQL) aux besoins du centre SECEL. J'y ai ajouté les formations avec leur prix et leur durée, le planning des sessions, les attestations de formation et l'inscription en ligne. La démo affiche les vraies pages de l'application, enregistrées depuis XAMPP avec ses données de démonstration : connectez-vous en administrateur ou en formateur, ajoutez un apprenant, faites l'appel ou générez une attestation.",
      points: [
        "Administrateur : formations (prix, durée, classe, lieu), planning des sessions, formateurs, apprenants, sessions et trimestres",
        "Génération d'une attestation de formation (apprenant, formation, lieu, enseignant, session, mention)",
        "Formateur : liste de sa classe, appel du jour par cases à cocher, présences par date, taux de présence par apprenant, export CSV",
        "Listes dépendantes en AJAX : le choix de la classe charge les lieux correspondants",
        "Inscription en ligne avec mot de passe haché",
        "Remis en route en 2026 : base de données reconstruite et bugs corrigés pour PHP 8",
      ],
      sections: [
        { titre: "Concepts importants", items: [
          "Architecture PHP / MySQL classique : une page par fonctionnalité, sessions PHP pour les rôles",
          "Modèle relationnel : classes, lieux, formateurs, apprenants, formations, planning, présences",
          "Contrôle d'accès par rôle (Administrator / ClassTeacher) à la connexion et sur chaque page",
          "Accès à MySQL avec mysqli, requête préparée pour le planning ; mots de passe hachés (password_hash pour l'inscription en ligne, md5 hérité du modèle pour les comptes)",
          "AJAX pour les listes dépendantes sans recharger la page",
        ] },
        { titre: "Problèmes rencontrés et solutions", paires: [
          ["Le fichier SQL livré était celui du modèle d'origine : il manquait les tables des formations, du planning et des inscriptions, et toutes les pages concernées plantaient.", "Base complète reconstruite à partir des requêtes du code, avec des données de démonstration réalistes."],
          ["Sous PHP 8.1, une table manquante déclenche une exception ; comme les pages masquaient les erreurs, on obtenait une page blanche sans message.", "Rapport d'erreurs mysqli réglé dans la connexion et cause réelle trouvée en lisant les journaux du serveur."],
          ["Le planning ne s'enregistrait jamais : un var_dump() suivi d'un die() de débogage était resté dans le code.", "Code de débogage retiré, enregistrement de la classe et du lieu choisis, liste corrigée."],
          ["Formations : un champ « Duration » mal nommé et une jointure sur le mauvais identifiant.", "Noms de champs alignés avec la base et jointures corrigées."],
          ["Le formulaire d'inscription écrivait dans une autre base de données.", "Une seule base pour tout le site."],
          ["Chemins écrits avec la mauvaise casse (includes/, FORMULAIRE/), tolérés sous Windows mais pas sur un serveur Linux.", "Casse harmonisée pour que le site fonctionne sur n'importe quel hébergeur."],
        ] },
        { titre: "Ce que j'ai appris", items: [
          "Partir d'un projet existant demande d'abord de comprendre son modèle de données",
          "Toujours livrer le script SQL à jour avec le code",
          "Prochaine étape de sécurité : requêtes préparées partout et password_hash à la place de md5",
          "Ne jamais masquer les erreurs en développement : une page blanche cache la vraie cause",
          "Tester chaque rôle et chaque formulaire, pas seulement la page d'accueil",
          "Présenter et défendre un projet devant un jury",
        ] },
      ],
    },
    en: {
      title: "SECEL Formation",
      summary: "Web app to run a training centre: courses, schedule, trainers, learners, daily attendance and certificates, with two roles (administrator and trainer).",
      metric: "2 roles", metricLabel: "administrator and trainer",
      context: "BTS in Software Engineering · final defence project · SECEL training centre",
      text: "I adapted an open-source attendance system (PHP / MySQL) to the needs of the SECEL centre. I added courses with their price and duration, the session schedule, training certificates and online registration. The demo shows the app's real pages, saved from XAMPP with its demo data: log in as administrator or trainer, add a learner, take attendance or generate a certificate.",
      points: [
        "Administrator: courses (price, duration, class, location), session schedule, trainers, learners, sessions and terms",
        "Training certificate generation (learner, course, location, teacher, session, grade)",
        "Trainer: class list, daily roll call with checkboxes, attendance by date, attendance rate per learner, CSV export",
        "AJAX dependent lists: choosing a class loads its locations",
        "Online registration with hashed passwords",
        "Brought back to life in 2026: database rebuilt and bugs fixed for PHP 8",
      ],
      sections: [
        { titre: "Key concepts", items: [
          "Classic PHP / MySQL architecture: one page per feature, PHP sessions for the roles",
          "Relational model: classes, locations, trainers, learners, courses, schedule, attendance",
          "Role-based access control (Administrator / ClassTeacher) at login and on every page",
          "MySQL access with mysqli, a prepared statement for the schedule; hashed passwords (password_hash for online registration, md5 inherited from the template for accounts)",
          "AJAX for dependent lists without reloading the page",
        ] },
        { titre: "Problems met and solutions", paires: [
          ["The SQL file shipped was the original template's: the course, schedule and registration tables were missing, so every related page crashed.", "Complete database rebuilt from the code's queries, with realistic demo data."],
          ["On PHP 8.1, a missing table throws an exception; since the pages hid errors, you got a blank page with no message.", "mysqli error reporting set in the connection, and the real cause found by reading the server logs."],
          ["The schedule was never saved: a debugging var_dump() followed by die() had been left in the code.", "Debug code removed, the chosen class and location saved, list fixed."],
          ["Courses: a misnamed “Duration” field and a join on the wrong id.", "Field names aligned with the database and joins fixed."],
          ["The registration form wrote to another database.", "One single database for the whole site."],
          ["Paths with the wrong case (includes/, FORMULAIRE/), accepted by Windows but not by a Linux server.", "Case harmonised so the site runs on any host."],
        ] },
        { titre: "What I learned", items: [
          "Starting from an existing project means understanding its data model first",
          "Always ship the up-to-date SQL script with the code",
          "Next security step: prepared statements everywhere and password_hash instead of md5",
          "Never hide errors during development: a blank page hides the real cause",
          "Test every role and every form, not just the home page",
          "Present and defend a project in front of a jury",
        ] },
      ],
    },
  },
  {
    id: "secel-commandes",
    cats: ["software"],
    status: "done",
    image: "assets/secel-commandes.jpg",
    app: "secelcommandes",
    cta: { fr: "Tester l'application", en: "Try the app" },
    badge: { fr: "Démo testable", en: "Live demo" },
    stack: ["PHP (PDO)", "MySQL", "Tailwind CSS", "JavaScript", "Chart.js", "Leaflet"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/secel-commandes", demo: "",
    fr: {
      title: "SECEL Commandes",
      summary: "Boutique en ligne et gestion des commandes, avec suivi des livraisons sur une carte du Cameroun. Le client commande et suit son colis ; l'administrateur gère commandes, stock et livraisons.",
      metric: "22 villes", metricLabel: "livrées depuis Douala",
      context: "BTS Génie Logiciel · projet de ma camarade Lauwa Lesly, que j'ai remis en route et enrichi",
      text: "Le projet d'origine est celui de Lauwa : une boutique et un tableau de bord d'administration. Il ne fonctionnait plus faute de base de données. Je l'ai reconstruite, j'ai corrigé les bugs et j'ai ajouté une carte de suivi des livraisons au Cameroun. La démo affiche les vraies pages de l'application, enregistrées depuis XAMPP : passez une commande en tant que client, puis connectez-vous en admin et faites avancer le colis de ville en ville dans la section Livraisons.",
      points: [
        "Client : catalogue, panier, commande avec ville de livraison et paiement Orange Money ou MTN Mobile Money",
        "Code de suivi et page de suivi : carte, étapes, position du colis, date prévue, livreur, historique",
        "Admin : chiffre d'affaires, commandes, clients, produits avec alertes de stock",
        "Livraisons : carte de toutes les livraisons, filtre par statut, bouton « Étape suivante », attribution du livreur",
        "Itinéraires réels par les grandes villes (Douala → Edéa → Yaoundé → Bafia → Ngaoundéré → Garoua…) et distance estimée",
        "La commande suit automatiquement le statut de sa livraison",
      ],
      sections: [
        { titre: "Concepts importants", items: [
          "Rôles enregistrés à l'inscription (user / admin) et redirection selon le rôle à la connexion",
          "PDO et requêtes préparées, mots de passe hachés avec password_hash()",
          "Modèle de données : clients, produits, commandes, fournisseurs, livraisons et historique",
          "Machine à états d'une livraison : Confirmée → En préparation → Expédiée → En transit → Arrivée en ville → Livrée",
          "Cartographie : coordonnées GPS des villes, itinéraires, distance de Haversine, carte Leaflet / OpenStreetMap",
          "Migration SQL qui ajoute des tables sans effacer les données existantes",
        ] },
        { titre: "Problèmes rencontrés et solutions", paires: [
          ["Aucun fichier SQL n'était fourni : l'application ne pouvait pas démarrer.", "Base gestion_commandes reconstruite à partir de toutes les requêtes du code, avec des données de démonstration."],
          ["Un message était affiché avant la redirection de connexion (« headers already sent ») : la redirection pouvait échouer.", "Message retiré, session ouverte avant toute sortie."],
          ["Le tableau de bord utilisait la liste des clients avant de l'avoir chargée.", "Données chargées en haut de la page, avec contrôle du rôle admin."],
          ["Le formulaire « Nouvelle commande » envoyait vers un fichier qui n'existait pas.", "add_commande.php créé : commande enregistrée, stock décrémenté, livraison créée."],
          ["La carte de livraison du tableau de bord n'affichait que des points factices.", "Vraie carte reliée aux tables livraison et livraison_historique, côté admin et côté client."],
          ["Leaflet ne s'affiche pas correctement dans une section cachée au chargement.", "Carte créée seulement quand la section devient visible."],
        ] },
        { titre: "Ce que j'ai appris", items: [
          "Reprendre le code de quelqu'un d'autre : lire, tester, corriger sans tout réécrire",
          "Ajouter une fonctionnalité complète, de la base de données à l'interface",
          "Penser l'expérience des deux côtés : le client qui suit, l'administrateur qui fait avancer",
          "Livrer une migration pour ne pas faire perdre leurs données aux utilisateurs",
        ] },
      ],
    },
    en: {
      title: "SECEL Commandes",
      summary: "Online shop and order management, with delivery tracking on a map of Cameroon. Customers order and track their parcel; the administrator manages orders, stock and deliveries.",
      metric: "22 cities", metricLabel: "served from Douala",
      context: "BTS in Software Engineering · my classmate Lauwa Lesly's project, which I revived and extended",
      text: "The original project is Lauwa's: a shop and an admin dashboard. It no longer worked because its database was missing. I rebuilt it, fixed the bugs and added delivery tracking on a map of Cameroon. The demo shows the app's real pages, saved from XAMPP: place an order as a customer, then log in as admin and move the parcel from city to city in the Deliveries section.",
      points: [
        "Customer: catalogue, cart, order with delivery city and Orange Money or MTN Mobile Money payment",
        "Tracking code and tracking page: map, steps, parcel position, expected date, driver, history",
        "Admin: revenue, orders, customers, products with stock alerts",
        "Deliveries: map of all deliveries, status filter, “Next step” button, driver assignment",
        "Routes through the main cities (Douala → Edéa → Yaoundé → Bafia → Ngaoundéré → Garoua…) and estimated distance",
        "Each order automatically follows its delivery status",
      ],
      sections: [
        { titre: "Key concepts", items: [
          "Roles stored at sign-up (user / admin) and redirection by role at login",
          "PDO and prepared statements, passwords hashed with password_hash()",
          "Data model: customers, products, orders, suppliers, deliveries and history",
          "Delivery state machine: Confirmed → Preparing → Shipped → In transit → Arrived in town → Delivered",
          "Mapping: GPS coordinates of cities, routes, Haversine distance, Leaflet / OpenStreetMap map",
          "SQL migration that adds tables without erasing existing data",
        ] },
        { titre: "Problems met and solutions", paires: [
          ["No SQL file was provided: the app could not start.", "gestion_commandes database rebuilt from every query in the code, with demo data."],
          ["A message was printed before the login redirect (“headers already sent”): the redirect could fail.", "Message removed, session started before any output."],
          ["The dashboard used the customer list before loading it.", "Data loaded at the top of the page, with an admin role check."],
          ["The “New order” form posted to a file that did not exist.", "add_commande.php created: order saved, stock decremented, delivery created."],
          ["The dashboard delivery map only showed fake dots.", "Real map linked to the livraison and livraison_historique tables, on the admin and customer sides."],
          ["Leaflet does not render correctly in a section hidden at load time.", "Map created only when the section becomes visible."],
        ] },
        { titre: "What I learned", items: [
          "Taking over someone else's code: read, test and fix without rewriting everything",
          "Adding a complete feature, from the database to the interface",
          "Thinking about both sides: the customer who tracks, the administrator who moves things forward",
          "Shipping a migration so users don't lose their data",
        ] },
      ],
    },
  },
  {
    id: "javazic",
    cats: ["software"],
    status: "done",
    image: "assets/javazic.png",
    app: "javazic",
    cta: { fr: "Ouvrir l'application", en: "Open the app" },
    badge: { fr: "Utilisable", en: "Usable" },
    stack: ["Java", "Swing", "MVC", "POO"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/javazic", demo: "",
    fr: {
      title: "JAVAZIC",
      summary: "Application Java de catalogue musical et de playlists, façon Spotify, avec interface Swing et trois profils : visiteur, abonné, administrateur.",
      metric: "MVC", metricLabel: "architecture",
      context: "ECE Paris · Programmation orientée objet · soutenance avril 2026 · projet d'équipe",
      text: "L'application d'origine est en Java (Swing). Pour l'utiliser ici, je l'ai réécrite en JavaScript à partir du même code : mêmes comptes de démonstration, même catalogue, mêmes règles par profil. Connectez-vous avec guest/guest, alice/alice ou admin/admin.",
      points: [
        "Architecture MVC",
        "Interface graphique Swing : connexion, catalogue, playlists, historique, administration, statistiques",
        "Navigation groupe → album → titres, recherche simple et avancée (genre, période), notes et avis",
        "Trois profils : visiteur (3 écoutes), abonné (playlists, historique), administrateur",
        "Sauvegarde de l'état par sérialisation Java",
      ],
    },
    en: {
      title: "JAVAZIC",
      summary: "A Spotify-style Java app for a music catalogue and playlists, with a Swing interface and three profiles: visitor, subscriber, admin.",
      metric: "MVC", metricLabel: "architecture",
      context: "ECE Paris · Object-oriented programming · presented April 2026 · team project",
      text: "The original app is written in Java (Swing). To use it here, I rewrote it in JavaScript from the same code: same demo accounts, same catalogue, same rules per profile. Log in with guest/guest, alice/alice or admin/admin.",
      points: [
        "MVC architecture",
        "Swing interface: login, catalogue, playlists, history, admin, statistics",
        "Group → album → track browsing, simple and advanced search (genre, period), ratings and reviews",
        "Three profiles: visitor (3 plays), subscriber (playlists, history), admin",
        "State saved with Java serialization",
      ],
    },
  },
  {
    id: "analyse-salaires",
    cats: ["data"],
    status: "wip",
    thumb: "hist",
    stack: ["pandas", "scikit-learn", "seaborn"],
    repo: "https://github.com/Dorline0121/Dorline0121.github.io/tree/main/projets/analyse-salaires", demo: "",
    fr: {
      title: "Analyse de données salariales",
      summary: "Exploration d'un jeu de 2 000 salaires pour comprendre ce qui les fait varier.",
      metric: "2 000", metricLabel: "lignes",
      context: "Analyse exploratoire · en cours",
      text: "Projet en cours : je le complète au fur et à mesure et je publierai le notebook sur GitHub.",
      points: [
        "Nettoyage et exploration avec pandas",
        "Visualisations avec seaborn",
        "Premiers modèles avec scikit-learn",
      ],
    },
    en: {
      title: "Salary Data Analysis",
      summary: "Exploring a 2,000-row salary dataset to understand what drives pay differences.",
      metric: "2,000", metricLabel: "rows",
      context: "Exploratory analysis · in progress",
      text: "Work in progress: I'm adding to it step by step and will publish the notebook on GitHub.",
      points: [
        "Cleaning and exploration with pandas",
        "Visualisations with seaborn",
        "First models with scikit-learn",
      ],
    },
  },
];

/* Données du graphique « CA par marque » (extraites du fichier .pbix, en millions $) */
const SALES_BY_BRAND = [
  ["Solex", 4.45], ["WeareA2B", 4.13], ["Giant Bicycles", 4.06],
  ["Trek Bicycles", 3.51], ["OHM Cycles", 2.97], ["Norco Bicycles", 2.63],
];

/* ---------- 4. Traductions anglaises ----------
   Le français est écrit directement dans index.html ;
   ici on ne met que l'anglais pour chaque data-i18n. */
const EN = {
  "skip": "Skip to projects",
  "nav.projects": "Projects", "nav.path": "Background", "nav.skills": "Skills", "nav.contact": "Contact",
  "hero.eyebrow": "Engineering student · Data &amp; AI · ECE Paris",
  "hero.lead": "I turn raw data into decisions: cleaning and analysis with Python and SQL, Machine Learning models, and dashboards that business teams actually read.",
  "hero.status": "4-month Data &amp; AI internship · from 19 April 2027",
  "hero.cta1": "See my projects", "hero.cta2": "Get in touch", "hero.cv": "Download my CV",
  "fig.title": "Linear regression · gradient descent", "fig.epoch": "epoch",
  "about.eyebrow": "About",
  "about.title": "Rigorous, curious, and on the side of data.",
  "about.p1": "I'm in the fourth year of the engineering programme at ECE Paris, majoring in Data &amp; Artificial Intelligence. Before Paris, I completed a dual track at IME in Douala: preparatory classes and a BTS in Software Engineering. That development background helps me every day when I build a data pipeline or deploy a model.",
  "about.p2": "My internships at CAMTEL and at a health centre taught me that an analysis only matters if someone can use it. I'm building my GitHub one project at a time, and this portfolio grows with it.",
  "facts.school": "Education", "facts.school.v": "Year 4 · ECE Paris<br>Data &amp; AI major",
  "facts.lang": "Languages", "facts.lang.v": "French<br>English C1 · TOEIC 850",
  "facts.where": "Based in", "facts.certs": "Certifications",
  "facts.club": "Involvement", "facts.club.v": "President of the Health Club, IME",
  "facts.hobbies": "Interests", "facts.hobbies.v": "Music · Film · Sport · Travel",
  "projects.eyebrow": "Projects", "projects.title": "What I've built",
  "next.title": "Next project in the works",
  "next.text": "I add new projects regularly. The easiest way to see what I'm working on right now is my GitHub.",
  "next.cta": "Follow on GitHub",
  "repos.eyebrow": "Latest GitHub repositories",
  "path.eyebrow": "Background", "path.title": "Experience and education",
  "path.exp": "Experience", "path.edu": "Education",
  "exp1.date": "Jun – Aug 2024", "exp1.role": "Data Analyst / Data Scientist Intern",
  "exp1.list": "<li>Collected, cleaned and analysed customer data with Excel and SQL</li><li>Statistical analysis to spot trends and outliers</li><li>Regression and sales forecasting models in Python and TensorFlow</li><li>Power BI reports for stakeholders</li><li>Led a data marketing project: <strong>+15% customer conversion rate</strong></li>",
  "exp2.date": "Aug – Sep 2024", "exp2.role": "IT Department Intern",
  "exp2.list": "<li>IT maintenance and router configuration</li><li>Built forms and websites (HTML5/CSS, PHP, JavaScript)</li>",
  "exp3.date": "Jun – Jul 2022", "exp3.role": "Data Intern",
  "exp3.list": "<li>Collected and structured medical and administrative data</li><li>Set up a MySQL database to improve record traceability</li>",
  "edu1.title": "Engineering degree, Data &amp; AI major",
  "edu1.note": "Currently in Year 4. Machine Learning, Deep Learning, image processing, embedded computing.",
  "edu3.title": "Preparatory cycle, Years 1 &amp; 2",
  "skills.eyebrow": "Skills", "skills.title": "My toolkit",
  "skills.g1": "Languages", "skills.g2": "Data &amp; Machine Learning", "skills.g3": "BI &amp; visualisation",
  "skills.g4": "Tools &amp; deployment", "skills.g5": "Methods", "skills.g6": "Soft skills",
  "skills.soft": "<li>Teamwork</li><li>Cross-cultural adaptability</li><li>Rigour</li><li>Analytical mindset</li>",
  "contact.eyebrow": "Contact", "contact.title": "Let's work together.",
  "contact.text": "I'm looking for a 4-month (16-week) Data &amp; AI internship starting 19 April 2027. If you have a project or a question about my background, write to me: I reply quickly.",
  "contact.copy": "Copy",
  "footer.made": "Designed and coded in HTML, CSS and JavaScript.",
};

/* Petits textes générés par le script */
const UI = {
  fr: { all: "Tous", details: "Voir le détail", code: "Code", demo: "Démo", done: "Terminé", wip: "En cours",
        what: "Ce que j'ai fait", stack: "Outils", kpis: "Chiffres clés 2017", brand: "Chiffre d'affaires par marque (M$)",
        brandNote: "Hors transactions sans marque renseignée.", copied: "Adresse copiée.", copyFail: "Sélectionnez l'adresse pour la copier.",
        k1: "chiffre d'affaires", k2: "transactions", k3: "clients", k4: "taux de marge moyen",
        updated: "mis à jour", langBtn: "Switch to English", themeBtn: "Changer de thème" },
  en: { all: "All", details: "See details", code: "Code", demo: "Demo", done: "Done", wip: "In progress",
        what: "What I did", stack: "Tools", kpis: "2017 key figures", brand: "Revenue by brand ($M)",
        brandNote: "Excludes transactions with no brand recorded.", copied: "Address copied.", copyFail: "Select the address to copy it.",
        k1: "revenue", k2: "transactions", k3: "customers", k4: "average margin rate",
        updated: "updated", langBtn: "Passer en français", themeBtn: "Toggle theme" },
};

/* =========================================================
   Code (normalement pas besoin de modifier ce qui suit)
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* stockage indisponible */ } },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let lang = store.get("lang") === "en" ? "en" : "fr";
let activeFilter = "all";
const FR = {}; // rempli automatiquement depuis le HTML

/* ---------- Langue ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!(key in FR)) FR[key] = el.innerHTML;
    const val = lang === "en" ? EN[key] : FR[key];
    if (val !== undefined) el.innerHTML = val;
  });
  const lt = $("#lang-toggle");
  lt.textContent = lang === "en" ? "FR" : "EN";
  lt.setAttribute("aria-label", UI[lang].langBtn);
  $("#theme-toggle").setAttribute("aria-label", UI[lang].themeBtn);
  renderFilters();
  renderProjects();
  renderRepos();
}
$("#lang-toggle").addEventListener("click", () => {
  lang = lang === "fr" ? "en" : "fr";
  store.set("lang", lang);
  applyLang();
});

/* ---------- Thème clair / sombre ---------- */
const savedTheme = store.get("theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$("#theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  store.set("theme", next);
});

/* ---------- Filtres ---------- */
function renderFilters() {
  const wrap = $("#filters");
  const counts = { all: PROJECTS.length };
  PROJECTS.forEach((p) => p.cats.forEach((c) => (counts[c] = (counts[c] || 0) + 1)));
  const keys = ["all", ...Object.keys(CATEGORIES).filter((k) => counts[k])];
  wrap.innerHTML = keys.map((k) => {
    const label = k === "all" ? UI[lang].all : CATEGORIES[k][lang];
    return `<button class="filter" type="button" data-f="${k}" aria-pressed="${k === activeFilter}">${esc(label)}<span class="count">${counts[k]}</span></button>`;
  }).join("");
}
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".filter");
  if (!b) return;
  activeFilter = b.dataset.f;
  renderFilters();
  renderProjects();
});

/* ---------- Cartes projets ---------- */
function renderProjects() {
  const list = PROJECTS.filter((p) => activeFilter === "all" || p.cats.includes(activeFilter));
  $("#project-grid").innerHTML = list.map((p) => {
    const t = p[lang];
    const media = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(t.title)}" loading="lazy">`
      : thumbSVG(p.thumb);
    const links = [
      p.repo ? `<a class="link-quiet" href="${esc(p.repo)}" target="_blank" rel="noopener">${UI[lang].code} ↗</a>` : "",
      p.demo ? `<a class="link-quiet" href="${esc(p.demo)}" target="_blank" rel="noopener">${UI[lang].demo} ↗</a>` : "",
    ].join("");
    return `
      <article class="card">
        <div class="card-media">${media}</div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-cat">${p.cats.map((c) => esc(CATEGORIES[c][lang])).join(" · ")}</span>
            <span class="pills">${p.badge ? `<span class="pill play">${esc(p.badge[lang])}</span>` : ""}<span class="pill ${p.status === "wip" ? "live" : ""}">${UI[lang][p.status]}</span></span>
          </div>
          <h3>${esc(t.title)}</h3>
          <p class="card-sum">${esc(t.summary)}</p>
          ${t.metric ? `<p class="metric"><b>${esc(t.metric)}</b><span>${esc(t.metricLabel || "")}</span></p>` : ""}
          <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          <div class="card-foot">
            <button class="link-btn" type="button" data-open="${p.id}">${p.cta ? esc(p.cta[lang]) : UI[lang].details}</button>
            ${links}
          </div>
        </div>
      </article>`;
  }).join("");
}
$("#project-grid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-open]");
  if (b) openProject(b.dataset.open);
});

/* Vignettes dessinées en SVG pour les projets sans capture d'écran */
function thumbSVG(kind) {
  const W = 320, H = 180;
  let body = "";
  const rnd = mulberry32(kind.length * 97);
  if (kind === "scatter") {
    for (let i = 0; i < 40; i++) {
      const x = 30 + rnd() * 260, y = 150 - (x - 30) * 0.42 - rnd() * 40 + 10;
      body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="var(--data)" fill-opacity=".75"/>`;
    }
    body += `<line x1="30" y1="143" x2="290" y2="33" stroke="var(--accent)" stroke-width="2.5"/>`;
  } else if (kind === "wave") {
    for (let i = 0; i < 64; i++) {
      const h = (Math.sin(i / 5) * 0.5 + 0.6) * (0.35 + rnd() * 0.65) * 110;
      body += `<rect x="${20 + i * 4.4}" y="${(90 - h / 2).toFixed(1)}" width="2.6" height="${h.toFixed(1)}" rx="1.3" fill="var(--data)" fill-opacity="${(0.35 + h / 180).toFixed(2)}"/>`;
    }
  } else if (kind === "kernel") {
    const k = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]; // filtre de Sobel
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const x = 40 + c * 40, y = 30 + r * 40, v = k[r][c];
      body += `<rect x="${x}" y="${y}" width="36" height="36" rx="4" fill="${v === 0 ? "var(--surface)" : v > 0 ? "var(--data)" : "var(--accent)"}" fill-opacity="${v === 0 ? 1 : 0.25 + Math.abs(v) * 0.3}" stroke="var(--line)"/>`;
      body += `<text x="${x + 18}" y="${y + 23}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" fill="var(--fg)">${v}</text>`;
    }
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      const edge = Math.abs(c - 2.5) < 1 ? 0.85 : 0.12 + rnd() * 0.1;
      body += `<rect x="${190 + c * 18}" y="${36 + r * 18}" width="16" height="16" rx="2" fill="var(--fg)" fill-opacity="${edge.toFixed(2)}"/>`;
    }
    body += `<text x="168" y="95" text-anchor="middle" font-size="18" fill="var(--muted)">→</text>`;
  } else if (kind === "list") {
    for (let i = 0; i < 5; i++) {
      const y = 26 + i * 28;
      body += `<rect x="40" y="${y}" width="20" height="20" rx="4" fill="${i === 1 ? "var(--accent)" : "var(--data)"}" fill-opacity="${i === 1 ? 0.9 : 0.35}"/>`;
      body += `<rect x="72" y="${y + 3}" width="${120 + rnd() * 80}" height="6" rx="3" fill="var(--fg)" fill-opacity="${i === 1 ? 0.8 : 0.35}"/>`;
      body += `<rect x="72" y="${y + 13}" width="${60 + rnd() * 40}" height="4" rx="2" fill="var(--muted)" fill-opacity=".45"/>`;
      body += `<text x="280" y="${y + 14}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="10" fill="var(--muted)">${2 + (i % 3)}:${String(10 + i * 7).slice(0, 2)}</text>`;
    }
  } else if (kind === "rul") {
    // courbe de dégradation : RUL qui décroît, seuil d'alerte à 30 cycles
    let d = "";
    for (let i = 0; i <= 60; i++) {
      const x = 24 + i * (272 / 60);
      const y = 150 - Math.min(125, 125 - i * 2.1 + Math.sin(i / 3) * 3) * 0.95;
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    body += `<line x1="24" y1="${150 - 30 * 0.95}" x2="296" y2="${150 - 30 * 0.95}" stroke="var(--accent)" stroke-dasharray="4 4" stroke-width="1.5"/>`;
    body += `<text x="296" y="${150 - 30 * 0.95 - 6}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="10" fill="var(--accent)">alerte · 30</text>`;
    body += `<path d="${d}" fill="none" stroke="var(--data)" stroke-width="2.5" stroke-linejoin="round"/>`;
    body += `<line x1="24" y1="150" x2="296" y2="150" stroke="var(--line)"/>`;
  } else if (kind === "board") {
    // plateau de jeu : lettres S F P O M
    const letters = "SFPOM", colors = ["#E0A526", "#D9434F", "#6FBF4A", "#E8892B", "#F2B43A"];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) {
      const k = Math.floor(rnd() * 5);
      const x = 22 + c * 32, y = 14 + r * 26;
      body += `<rect x="${x}" y="${y}" width="28" height="22" rx="6" fill="${colors[k]}" fill-opacity=".22" stroke="${colors[k]}" stroke-opacity=".7"/>`;
      body += `<text x="${x + 14}" y="${y + 15}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="500" fill="var(--fg)">${letters[k]}</text>`;
    }
  } else if (kind === "hist") {
    const vals = [8, 18, 34, 55, 72, 80, 68, 50, 34, 22, 14, 9, 5];
    vals.forEach((v, i) => {
      const h = v * 1.6;
      body += `<rect x="${34 + i * 20}" y="${158 - h}" width="16" height="${h}" rx="2" fill="var(--data)" fill-opacity=".7"/>`;
    });
    body += `<line x1="30" y1="158" x2="296" y2="158" stroke="var(--line)"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${body}</svg>`;
}

/* ---------- Fenêtre de détail ---------- */
const modal = $("#project-modal");
function openProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  const t = p[lang], u = UI[lang];
  let extra = "";
  const isDash = p.extra === "salesChart" && window.SalesDashboard;
  const isGame = p.game === "plantamitz" && window.Plantamitz;
  if (isDash) extra = `<div class="pbi-wrap" id="pbi-root"></div>`;
  if (isGame) extra = `<div class="pz-wrap" id="pz-root"></div>`;
  const isApp = p.app === "javazic" && window.Javazic;
  if (isApp) extra = `<div class="jz-wrap" id="jz-root"></div>`;
  const isAero = p.app === "aero" && window.AeroDemo;
  if (isAero) extra = `<div class="ae-wrap" id="ae-root"></div>`;
  const isSS = p.app === "superstore" && window.SuperStoreDemo;
  if (isSS) extra = `<div class="ss-wrap" id="ss-root"></div>`;
  const isDS = p.app === "labsds" && window.LabsDS;
  if (isDS) extra = `<div class="ds-wrap" id="ds-root"></div>`;
  const isIM = p.app === "introml" && window.IntroML;
  const isNS = p.app === "neuralspeech" && window.NeuralSpeech;
  const isSA = (p.app === "secelformation" && window.SecelFormation) || (p.app === "secelcommandes" && window.SecelCommandes);
  if (isSA) extra = `<div class="ds-wrap" id="sa-root"></div>`;
  if (isNS) extra = `<div class="ds-wrap" id="ns-root"></div>`;
  if (isIM) extra = `<div class="ds-wrap" id="im-root"></div>`;
  if (p.video) extra += `
    <p class="m-h">${lang === "fr" ? "Vidéo : la version console d'origine (C, Windows)" : "Video: the original console version (C, Windows)"}</p>
    <video class="m-video" controls preload="none" playsinline ${p.poster ? `poster="${esc(p.poster)}"` : ""}><source src="${esc(p.video)}" type="video/mp4"></video>`;
  modal.classList.toggle("modal-wide", !!(isDash || isGame || isApp || isAero || isSS || isDS || isIM || isNS || isSA));
  if (activeGame) { activeGame.destroy(); activeGame = null; }
  $("#modal-body").innerHTML = `
    <p class="m-cat">${p.cats.map((c) => esc(CATEGORIES[c][lang])).join(" · ")} · ${u[p.status]}</p>
    <h3 id="modal-title">${esc(t.title)}</h3>
    <p class="m-context">${esc(t.context || "")}</p>
    ${p.image && !isDash && !isGame && !isApp && !isAero && !isSS && !isDS && !isIM && !isNS && !isSA ? `<img class="m-img" src="${esc(p.image)}" alt="${esc(t.title)}">` : ""}
    <p class="m-text">${esc(t.text || t.summary)}</p>
    ${extra}
    ${(t.sections || []).map((sec) => `<p class="m-h">${esc(sec.titre)}</p>` + (sec.paires
      ? `<div class="m-pairs">${sec.paires.map(([a, b]) => `<div><p class="m-prob">${esc(a)}</p><p class="m-sol">${esc(b)}</p></div>`).join("")}</div>`
      : `<ul class="m-list">${sec.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`)).join("")}
    <p class="m-h">${u.what}</p>
    <ul class="m-list">${t.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <p class="m-h">${u.stack}</p>
    <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    ${(p.repo || p.demo) ? `<div class="m-links">
      ${p.repo ? `<a class="btn" href="${esc(p.repo)}" target="_blank" rel="noopener">${u.code} ↗</a>` : ""}
      ${p.demo ? `<a class="btn" href="${esc(p.demo)}" target="_blank" rel="noopener">${u.demo} ↗</a>` : ""}
    </div>` : ""}`;
  if (isDash) window.SalesDashboard.mount($("#pbi-root"), lang);
  if (isGame) activeGame = window.Plantamitz.mount($("#pz-root"));
  if (isApp) activeGame = window.Javazic.mount($("#jz-root"));
  if (isAero) activeGame = window.AeroDemo.mount($("#ae-root"), lang);
  if (isSS) activeGame = window.SuperStoreDemo.mount($("#ss-root"), lang);
  if (isDS) activeGame = window.LabsDS.mount($("#ds-root"), lang);
  if (isIM) activeGame = window.IntroML.mount($("#im-root"), lang);
  if (isNS) activeGame = window.NeuralSpeech.mount($("#ns-root"), lang);
  if (isSA) activeGame = (p.app === "secelformation" ? window.SecelFormation : window.SecelCommandes).mount($("#sa-root"), lang);
  if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  modal.scrollTop = 0;
}
function closeModal() { if (modal.open) modal.close ? modal.close() : modal.removeAttribute("open"); }
$("#modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
// le jeu s'arrête (et sauvegarde) quand la fenêtre se ferme
let activeGame = null;
modal.addEventListener("close", () => {
  if (activeGame) { activeGame.destroy(); activeGame = null; }
  modal.querySelectorAll("video").forEach((v) => v.pause());
});
// Échap sert au jeu : il ne ferme pas la fenêtre quand on joue
modal.addEventListener("cancel", (e) => { if (activeGame && activeGame.hasFocus && activeGame.hasFocus()) e.preventDefault(); });

function salesBlock() {
  const u = UI[lang];
  const n = (v, d = 2) => v.toLocaleString(lang === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const kpis = [
    [`${n(21.95)} M$`, u.k1], [lang === "fr" ? "19 821" : "19,821", u.k2],
    [lang === "fr" ? "3 493" : "3,493", u.k3], [`${n(44.6, 1)} %`.replace(" %", lang === "fr" ? " %" : "%"), u.k4],
  ];
  // Barres horizontales à l'échelle (0 → 5 M$)
  const W = 640, rowH = 30, left = 118, right = 56, top = 8, max = 5;
  const H = top + SALES_BY_BRAND.length * rowH + 22;
  const x = (v) => left + (v / max) * (W - left - right);
  let svg = "";
  [0, 1, 2, 3, 4, 5].forEach((tck) => {
    svg += `<line x1="${x(tck)}" y1="${top}" x2="${x(tck)}" y2="${H - 20}" stroke="var(--line)" stroke-width="1"/>`;
    svg += `<text x="${x(tck)}" y="${H - 6}" text-anchor="middle">${tck}</text>`;
  });
  SALES_BY_BRAND.forEach(([name, v], i) => {
    const y = top + i * rowH;
    svg += `<text x="${left - 10}" y="${y + 18}" text-anchor="end">${esc(name)}</text>`;
    svg += `<rect x="${left}" y="${y + 5}" width="${x(v) - left}" height="${rowH - 12}" rx="3" fill="${i === 0 ? "var(--accent)" : "var(--data)"}" fill-opacity="${i === 0 ? 1 : 0.7}"/>`;
    svg += `<text class="val" x="${x(v) + 6}" y="${y + 18}">${n(v)}</text>`;
  });
  return `
    <p class="m-h">${u.kpis}</p>
    <div class="m-kpis">${kpis.map(([b, s]) => `<div><b>${b}</b><span>${esc(s)}</span></div>`).join("")}</div>
    <p class="m-h">${u.brand}</p>
    <svg class="m-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(u.brand)}">${svg}</svg>
    <p class="m-note">${u.brandNote}</p>`;
}

/* ---------- Dépôts GitHub (chargés si l'API est joignable) ---------- */
let repoCache = null;
async function loadRepos() {
  if (!CONFIG.githubUser) return;
  try {
    const r = await fetch(`https://api.github.com/users/${CONFIG.githubUser}/repos?sort=updated&per_page=6`);
    if (!r.ok) return;
    const data = await r.json();
    // on ignore les forks et le dépôt « profil » (même nom que l'utilisateur)
    repoCache = data.filter((x) => !x.fork && x.name.toLowerCase() !== CONFIG.githubUser.toLowerCase());
    renderRepos();
  } catch { /* hors ligne ou bloqué : la section reste masquée */ }
}
function renderRepos() {
  if (!repoCache || !repoCache.length) { $("#repos").hidden = true; return; }
  const fmt = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { month: "short", year: "numeric" });
  $("#repo-list").innerHTML = repoCache.map((x) => `
    <li><a href="${esc(x.html_url)}" target="_blank" rel="noopener">
      <span class="repo-name">${esc(x.name)}</span>
      ${x.description ? `<span class="repo-desc">${esc(x.description)}</span>` : ""}
      <span class="repo-meta">${esc(x.language || "")}${x.language ? " · " : ""}${UI[lang].updated} ${fmt.format(new Date(x.pushed_at))}</span>
    </a></li>`).join("");
  $("#repos").hidden = false;
}

/* ---------- Contact ---------- */
function setupContact() {
  $("#email-link").href = `mailto:${CONFIG.email}`;
  $("#email-link").textContent = CONFIG.email;
  $("#gh-link").href = CONFIG.github;
  $("#gh-follow").href = CONFIG.github;
  if (CONFIG.linkedin) { $("#li-link").href = CONFIG.linkedin; $("#li-link").hidden = false; }
  if (CONFIG.portfolio) { $("#pf-link").href = CONFIG.portfolio; $("#pf-link").hidden = false; }
  if (CONFIG.cv) { $("#cv-link").href = CONFIG.cv; $("#cv-link").hidden = false; }
  $("#copy-email").addEventListener("click", () => {
    const status = $("#copy-status");
    const fallback = () => {
      const range = document.createRange();
      range.selectNodeContents($("#email-link"));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      status.textContent = UI[lang].copyFail;
    };
    try {
      navigator.clipboard.writeText(CONFIG.email).then(() => (status.textContent = UI[lang].copied), fallback);
    } catch { fallback(); }
  });
  $("#year").textContent = new Date().getFullYear();
}

/* =========================================================
   Figure du hero : descente de gradient sur une régression
   linéaire. ŷ = w·x + b, perte = MSE.
   ========================================================= */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startGradientDescent() {
  const canvas = $("#gd-canvas");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LR = 0.35, MAX_EPOCH = 160;
  let seed = 7, pts = [], w, b, epoch, losses, hold = 0, visible = true, colors = {};

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    ["--fg", "--muted", "--line", "--accent", "--data", "--surface"].forEach((k) => (colors[k] = cs.getPropertyValue(k).trim()));
  }
  function newData() {
    const r = mulberry32(seed++);
    const slope = 0.25 + r() * 0.55 * (r() > 0.3 ? 1 : -0.6);
    const icpt = slope > 0 ? 0.12 + r() * 0.2 : 0.7 + r() * 0.15;
    pts = Array.from({ length: 34 }, () => {
      const x = 0.04 + r() * 0.92;
      const noise = (r() + r() + r() - 1.5) * 0.12;
      return [x, Math.min(0.97, Math.max(0.03, icpt + slope * x + noise))];
    });
    w = slope > 0 ? -0.5 : 0.8; b = slope > 0 ? 0.85 : 0.1;
    epoch = 0; losses = [mse()];
  }
  function mse() { return pts.reduce((s, [x, y]) => s + (w * x + b - y) ** 2, 0) / pts.length; }
  function step() {
    let dw = 0, db = 0;
    for (const [x, y] of pts) { const e = w * x + b - y; dw += e * x; db += e; }
    w -= LR * (2 / pts.length) * dw;
    b -= LR * (2 / pts.length) * db;
    epoch++; losses.push(mse());
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.width * (38 / 56) * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function draw() {
    const Wd = canvas.width / (ctx.getTransform().a || 1), Hd = canvas.height / (ctx.getTransform().d || 1);
    const pad = { l: 34, r: 16, t: 16, b: 28 };
    const X = (v) => pad.l + v * (Wd - pad.l - pad.r);
    const Y = (v) => Hd - pad.b - v * (Hd - pad.t - pad.b);
    ctx.clearRect(0, 0, Wd, Hd);

    // grille
    ctx.strokeStyle = colors["--line"]; ctx.lineWidth = 1;
    ctx.font = "10px 'JetBrains Mono', monospace"; ctx.fillStyle = colors["--muted"];
    for (let i = 0; i <= 4; i++) {
      const v = i / 4;
      ctx.beginPath(); ctx.moveTo(X(0), Y(v)); ctx.lineTo(X(1), Y(v)); ctx.stroke();
      ctx.textAlign = "right"; ctx.fillText(v.toFixed(2).replace(/0$/, ""), pad.l - 6, Y(v) + 3);
      ctx.textAlign = "center"; ctx.fillText(v.toFixed(2).replace(/0$/, ""), X(v), Hd - pad.b + 16);
    }

    // résidus
    ctx.save();
    ctx.beginPath();
    ctx.rect(X(0), Y(1), X(1) - X(0), Y(0) - Y(1));
    ctx.clip();
    ctx.strokeStyle = colors["--accent"]; ctx.globalAlpha = 0.28;
    for (const [x, y] of pts) { ctx.beginPath(); ctx.moveTo(X(x), Y(y)); ctx.lineTo(X(x), Y(w * x + b)); ctx.stroke(); }
    ctx.globalAlpha = 1;

    // droite de régression
    ctx.strokeStyle = colors["--accent"]; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(X(0), Y(b)); ctx.lineTo(X(1), Y(w + b)); ctx.stroke();
    ctx.restore();

    // points
    ctx.fillStyle = colors["--data"];
    for (const [x, y] of pts) { ctx.beginPath(); ctx.arc(X(x), Y(y), 3.6, 0, Math.PI * 2); ctx.fill(); }

    // mini-courbe de perte (coin haut droit)
    const bw = Math.min(130, Wd * 0.3), bh = 46, bx = X(1) - bw - 6, by = Y(1) + 6;
    ctx.fillStyle = colors["--surface"]; ctx.globalAlpha = 0.9;
    ctx.fillRect(bx, by, bw, bh); ctx.globalAlpha = 1;
    ctx.strokeStyle = colors["--line"]; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
    ctx.fillStyle = colors["--muted"]; ctx.textAlign = "left"; ctx.fillText("loss", bx + 6, by + 12);
    const lmax = losses[0] || 1;
    ctx.strokeStyle = colors["--fg"]; ctx.lineWidth = 1.5; ctx.beginPath();
    losses.forEach((l, i) => {
      const lx = bx + 6 + (i / MAX_EPOCH) * (bw - 12);
      const ly = by + bh - 6 - (l / lmax) * (bh - 22);
      i ? ctx.lineTo(lx, ly) : ctx.moveTo(lx, ly);
    });
    ctx.stroke();

    // lecture
    $("#gd-epoch").textContent = String(epoch).padStart(3, "0");
    $("#gd-mse").textContent = mse().toFixed(4);
    $("#gd-eq").textContent = `${w.toFixed(2)}x ${b < 0 ? "−" : "+"} ${Math.abs(b).toFixed(2)}`;
  }

  let frame = 0;
  function loop() {
    if (visible) {
      frame++;
      if (hold > 0) {
        hold--;
        if (hold === 0) { newData(); draw(); }
      } else if (frame % 2 === 0) {
        step(); draw();
        if (epoch >= MAX_EPOCH) hold = 150;
      }
    }
    requestAnimationFrame(loop);
  }

  readColors();
  newData();
  if (reduce) { while (epoch < MAX_EPOCH) step(); }
  resize();
  window.addEventListener("resize", resize);
  new MutationObserver(() => { readColors(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { readColors(); draw(); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  if (!reduce) requestAnimationFrame(loop);
}

/* ---------- Démarrage ---------- */
setupContact();
applyLang();
loadRepos();
startGradientDescent();

// Lien direct vers un projet : https://dorline0121.github.io/#secel-commandes
function ouvrirDepuisAncre() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (PROJECTS.some((p) => p.id === id)) openProject(id);
}
ouvrirDepuisAncre();
window.addEventListener("hashchange", ouvrirDepuisAncre);
