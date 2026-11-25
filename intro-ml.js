/* =========================================================
   Introduction to Machine Learning — labs 2, 3 et 4 (ECE ING4)
   ---------------------------------------------------------
   5 onglets, tous calculés dans le navigateur :
   1. Descente de gradient (Lab 2) : la régression linéaire codée à la
      main, réentraînée ici sur les 12 384 logements de Californie.
   2. Validation & métriques (Lab 3, exos 1-3) : k-fold, seuil de
      décision et matrice de confusion, random search.
   3. Prix BMW (Lab 3, exo 4) : le pipeline et les 3 modèles linéaires
      exportés depuis scikit-learn (mêmes prédictions que le notebook).
   4. Vins (Lab 4) : régression logistique, arbre, Random Forest et
      Gradient Boosting exportés depuis scikit-learn.
   5. Clients K-means (Lab 4) : segmentation en direct + résultat du lab.
   Données : assets/intro-ml-data.js et assets/intro-ml-cal.js
   ========================================================= */
(function () {
  const PAL = ["#1C7ED6", "#E03131", "#2F9E44", "#AE3EC9", "#F08C00", "#0C8599", "#C2255C", "#5C7CFA", "#868E96", "#74B816"];
  const CLS = ["#1C7ED6", "#D9480F", "#2F9E44"];

  const TXT = {
    fr: {
      tabs: ["Descente de gradient", "Validation & métriques", "Prix BMW", "Vins", "Clients K-means"],
      loading: "Chargement des données…", fail: "Impossible de charger les données.",
      // A
      leadA: "Lab 2 : régression linéaire codée à la main (descente de gradient + pénalité L2), sur le jeu California Housing (prix médian d'un quartier, en 100 000 $). Choisissez un réglage : le modèle est réentraîné ici, sur les mêmes 12 384 logements d'entraînement que dans le notebook.",
      lr: "Taux d'apprentissage", iters: "Itérations", lam: "Régularisation λ",
      train: "Entraîner", best: "Meilleur réglage du lab", stop: "Arrêter", clear: "Effacer les courbes",
      courbe: "Perte d'entraînement (MSE + pénalité) à chaque itération", echLog: "échelle logarithmique",
      it: "itération", enCours: "Entraînement…",
      kTrainMae: "MAE entraînement", kValMae: "MAE validation", kValRmse: "RMSE validation", kValR2: "R² validation", kLoss: "Perte finale",
      poids: "Poids appris (variables standardisées)", poidsLead: "Plus λ est grand, plus les poids sont tirés vers 0.",
      grille: "Grid search : les 36 combinaisons (triées par MAE de validation)", grilleLead: "Cliquez sur une ligne pour réentraîner ce réglage.",
      thLr: "lr", thN: "itérations", thLam: "λ", thTm: "MAE train", thVm: "MAE val", thVr: "RMSE val", thR2: "R² val",
      diag: {
        under: "Sous-apprentissage (biais élevé) : la descente n'a pas convergé, l'erreur reste haute en entraînement comme en validation.",
        reg: "Régularisation forte : les poids sont écrasés vers 0, le modèle devient trop simple et l'erreur remonte des deux côtés.",
        ok: "Bon compromis : le modèle a convergé et l'écart entre entraînement et validation reste très faible (faible variance).",
        mid: "Convergence partielle : l'erreur baisse encore, il faudrait plus d'itérations ou un pas plus grand.",
      },
      finalA: "Modèle final (lr = 0,1 · 200 itérations · λ = 0) sur le jeu de test (4 128 logements)",
      sk: "scikit-learn (LinearRegression + GridSearchCV)", scratch: "Ma descente de gradient",
      // B
      leadB: "Lab 3, exercices 1 à 3 : trois outils de scikit-learn recodés « from scratch », puis vérifiés contre la bibliothèque.",
      kfT: "1 · Validation croisée k-fold (Iris, Random Forest)", kfLead: "Chaque carré est une fleur, colorée par espèce. Les fleurs sont mélangées puis découpées en k plis : chaque pli sert une fois de test.",
      melange: "Mélanger avant de découper", sansMel: "Sans mélange, les plis ne contiennent qu'une ou deux espèces : le modèle est testé sur une espèce qu'il n'a presque jamais vue. C'est le problème rencontré, d'où le mélange avec une graine fixe.",
      pli: "Pli", moy: "Moyenne", skk: "scikit-learn (KFold + cross_val_score) : 0,960, avec un autre mélange.",
      esp: ["setosa", "versicolor", "virginica"],
      mtT: "2 · Precision, recall et F1 (Breast Cancer, régression logistique)", mtLead: "Les 114 tumeurs du test, placées selon la probabilité « bénigne » donnée par le modèle. Déplacez le seuil de décision : la matrice de confusion et les métriques se recalculent avec mes fonctions.",
      seuil: "Seuil de décision", benin: "bénigne (positive)", malin: "maligne",
      predP: "prédit bénigne", predN: "prédit maligne", vraiP: "vraiment bénigne", vraiN: "vraiment maligne",
      noteSeuil: "À 0,5 (seuil par défaut) : exactement les valeurs du notebook, identiques à scikit-learn.",
      rsT: "3 · Random search (arbre de décision, Breast Cancer)", rsLead: "La grille compte 32 combinaisons. Une recherche aléatoire en tire quelques-unes sans remise, les évalue par validation croisée 5 plis (codée à la main, sur l'entraînement seulement) et garde la meilleure.",
      tirage: "Nombre de tirages", tirer: "Tirer au hasard", notebook: "Tirage du notebook (graine 42)", tout: "Tout évaluer (grid search)",
      prof: "profondeur", crit: "critère", split: "min_samples_split", sansLim: "∞",
      meilleur: "Meilleure combinaison", cv: "accuracy CV", testAcc: "accuracy test", defaut: "arbre par défaut",
      rsNote: (n) => `${n} entraînements × 5 plis au lieu de 32 × 5.`,
      // C
      leadC: "Lab 3, exercice 4 : prix de vente (enchères 2018) de BMW d'occasion. Le pipeline du notebook (âge de la voiture, polynômes de degré 2, standardisation, one-hot, booléens) et les 3 modèles sont exportés depuis scikit-learn : les prédictions sont les mêmes que dans le notebook.",
      voitureTest: "Voiture du test au hasard", modele: "Modèle", km: "Kilométrage", puiss: "Puissance (ch)", age: "Âge à la vente",
      carbu: "Carburant", couleur: "Couleur", carro: "Carrosserie", options: "Options (feature_1 à feature_8)", opt: "option",
      ans: "ans", rare: "rare, regroupé", prixReel: "Prix réel", vendue: "vendue", immat: "immatriculée",
      noms: { lasso: "Lasso", ridge: "Ridge", lin: "Régression linéaire" },
      contrib: "D'où vient le prix estimé par le Lasso ?", contribLead: "Somme des poids × valeurs, regroupée par information. Base = constante du modèle.",
      base: "Base (constante)", grp: { km: "Kilométrage", puiss: "Puissance", age: "Âge", croise: "Termes croisés", model_key: "Modèle", fuel: "Carburant", paint_color: "Couleur", car_type: "Carrosserie", opt: "Options" },
      nuage: "Prix prédit (Lasso) contre prix réel, 956 voitures du test", reelAx: "prix réel (€)", predAx: "prix prédit (€)",
      resC: "Résultats sur le jeu de test", alpha: "α (validation croisée)", zeros: (z, n) => `Le Lasso met ${z} poids sur ${n} exactement à 0.`,
      // D
      leadD: "Lab 4 : reconnaître le cépage d'un vin (3 classes) à partir de 13 mesures chimiques et de 6 ratios que j'ai créés. Les 4 pipelines sont exportés depuis scikit-learn et tournent ici ; choisissez un vin du test, puis modifiez ses mesures.",
      vin: "Vin du test", vrai: "classe réelle", modif: "Modifier les mesures (les autres restent celles du vin choisi)",
      reset: "Revenir au vin d'origine", erreurs: "Vins mal classés par au moins un modèle",
      wnoms: { lr: "Régression logistique", dt: "Arbre de décision", rf: "Random Forest", gb: "Gradient Boosting" },
      classe: "Cultivar", correct: "correct", faux: "erreur",
      feat: { alcohol: "Alcool", flavanoids: "Flavonoïdes", proline: "Proline", color_intensity: "Intensité de couleur", hue: "Teinte", "od280/od315_of_diluted_wines": "OD280/OD315" },
      tabD: "Comparaison sur les 45 vins du test", mAcc: "Accuracy", mP: "Precision macro", mR: "Recall macro", mF: "F1 macro", mAuc: "AUC (ovr)", mCv: "F1 macro en CV (train)",
      confT: "Matrices de confusion (lignes = classe réelle)", impT: "Variables les plus utilisées par la Random Forest", impLead: "En orange : les ratios que j'ai créés. Une importance n'est pas une cause.",
      noteD: "Petit test (45 vins) : une erreur coûte 2,2 points. La validation croisée classe d'ailleurs la régression logistique devant (0,985).",
      // E
      leadE: "Lab 4 : segmenter 200 clients d'un centre commercial sans aucune étiquette. K-means travaille sur 4 variables standardisées : âge, revenu annuel, score de dépense et le ratio dépense / revenu que j'ai ajouté.",
      k: "Nombre de clusters k", mode: "Mode", modeLab: "Résultat du lab (n_init = 20)", modeAnim: "K-means pas à pas",
      etape: "Étape suivante", jouer: "Lancer", reinitK: "Nouvelle initialisation",
      vue: "Vue", vueRev: "Revenu / dépense", vueAge: "Âge / dépense",
      revenu: "Revenu annuel (k$)", depense: "Score de dépense (1-100)", ageAx: "Âge",
      coude: "Méthode du coude (inertie)", silh: "Score de silhouette", choisi: "k retenu : 6 (silhouette maximale, coude à 5-6)",
      iter: "itération", inertie: "inertie", conv: "convergé",
      segT: "Les 6 segments (k = 6)", taille: "clients", femmes: "femmes",
      seg: [
        ["Clients mûrs réguliers", "Fidéliser : offres de valeur, promotions hebdomadaires, livraison"],
        ["Petits budgets économes", "Actions peu coûteuses : bons de réduction, gamme essentielle"],
        ["Aisés mais prudents", "Plus gros potentiel : produits premium, campagne de notoriété, enquêtes"],
        ["Jeunes impulsifs", "Réseaux sociaux et appli, réductions étudiantes, ventes flash"],
        ["Jeunes clients moyens", "Carte de fidélité de bienvenue, récompenses progressives"],
        ["Clients premium", "Cible prioritaire : programme VIP, accès en avant-première, offres personnalisées"],
      ],
      cible: ["Partiellement", "Non", "Pas encore", "Oui, secondaire", "Oui, croissance", "Oui, priorité"],
      nouveau: "Où irait un nouveau client ?", nouveauLead: "Le client est standardisé comme les 200 autres, puis rattaché au centroïde le plus proche.",
      segOf: "Segment",
    },
    en: {
      tabs: ["Gradient descent", "Validation & metrics", "BMW prices", "Wines", "K-means customers"],
      loading: "Loading data…", fail: "The data could not be loaded.",
      leadA: "Lab 2: linear regression coded by hand (gradient descent + L2 penalty), on the California Housing dataset (median value of a block, in $100,000). Pick a setting: the model is retrained here, on the same 12,384 training homes as in the notebook.",
      lr: "Learning rate", iters: "Iterations", lam: "Regularisation λ",
      train: "Train", best: "Best setting of the lab", stop: "Stop", clear: "Clear curves",
      courbe: "Training loss (MSE + penalty) at each iteration", echLog: "log scale",
      it: "iteration", enCours: "Training…",
      kTrainMae: "Train MAE", kValMae: "Validation MAE", kValRmse: "Validation RMSE", kValR2: "Validation R²", kLoss: "Final loss",
      poids: "Learned weights (standardised features)", poidsLead: "The larger λ, the more the weights are pulled towards 0.",
      grille: "Grid search: the 36 combinations (sorted by validation MAE)", grilleLead: "Click a row to retrain that setting.",
      thLr: "lr", thN: "iterations", thLam: "λ", thTm: "train MAE", thVm: "val MAE", thVr: "val RMSE", thR2: "val R²",
      diag: {
        under: "Underfitting (high bias): gradient descent has not converged, the error stays high on both training and validation.",
        reg: "Strong regularisation: the weights are crushed towards 0, the model becomes too simple and the error rises on both sides.",
        ok: "Good trade-off: the model has converged and the gap between training and validation stays very small (low variance).",
        mid: "Partial convergence: the error is still decreasing, it needs more iterations or a larger step.",
      },
      finalA: "Final model (lr = 0.1 · 200 iterations · λ = 0) on the test set (4,128 homes)",
      sk: "scikit-learn (LinearRegression + GridSearchCV)", scratch: "My gradient descent",
      leadB: "Lab 3, exercises 1 to 3: three scikit-learn tools recoded from scratch, then checked against the library.",
      kfT: "1 · k-fold cross-validation (Iris, Random Forest)", kfLead: "Each square is a flower, coloured by species. The flowers are shuffled and then cut into k folds: each fold is the test set once.",
      melange: "Shuffle before splitting", sansMel: "Without shuffling, the folds contain only one or two species: the model is tested on a species it has hardly seen. That was the problem, hence the shuffle with a fixed seed.",
      pli: "Fold", moy: "Mean", skk: "scikit-learn (KFold + cross_val_score): 0.960, with a different shuffle.",
      esp: ["setosa", "versicolor", "virginica"],
      mtT: "2 · Precision, recall and F1 (Breast Cancer, logistic regression)", mtLead: "The 114 test tumours, placed by the model's “benign” probability. Move the decision threshold: the confusion matrix and the metrics are recomputed with my functions.",
      seuil: "Decision threshold", benin: "benign (positive)", malin: "malignant",
      predP: "predicted benign", predN: "predicted malignant", vraiP: "actually benign", vraiN: "actually malignant",
      noteSeuil: "At 0.5 (default threshold): exactly the notebook values, identical to scikit-learn.",
      rsT: "3 · Random search (decision tree, Breast Cancer)", rsLead: "The grid has 32 combinations. A random search draws a few without replacement, evaluates them with 5-fold cross-validation (hand-coded, on the training set only) and keeps the best.",
      tirage: "Number of draws", tirer: "Draw at random", notebook: "Notebook draw (seed 42)", tout: "Evaluate all (grid search)",
      prof: "depth", crit: "criterion", split: "min_samples_split", sansLim: "∞",
      meilleur: "Best combination", cv: "CV accuracy", testAcc: "test accuracy", defaut: "default tree",
      rsNote: (n) => `${n} trainings × 5 folds instead of 32 × 5.`,
      leadC: "Lab 3, exercise 4: sale price (2018 auctions) of used BMWs. The notebook pipeline (car age, degree-2 polynomials, scaling, one-hot, booleans) and the 3 models are exported from scikit-learn: the predictions are the same as in the notebook.",
      voitureTest: "Random test car", modele: "Model", km: "Mileage", puiss: "Power (hp)", age: "Age at sale",
      carbu: "Fuel", couleur: "Colour", carro: "Body type", options: "Options (feature_1 to feature_8)", opt: "option",
      ans: "yrs", rare: "rare, grouped", prixReel: "Actual price", vendue: "sold", immat: "registered",
      noms: { lasso: "Lasso", ridge: "Ridge", lin: "Linear regression" },
      contrib: "Where does the Lasso estimate come from?", contribLead: "Sum of weights × values, grouped by feature. Base = the model's intercept.",
      base: "Base (intercept)", grp: { km: "Mileage", puiss: "Power", age: "Age", croise: "Cross terms", model_key: "Model", fuel: "Fuel", paint_color: "Colour", car_type: "Body type", opt: "Options" },
      nuage: "Predicted (Lasso) vs actual price, 956 test cars", reelAx: "actual price (€)", predAx: "predicted price (€)",
      resC: "Results on the test set", alpha: "α (cross-validation)", zeros: (z, n) => `The Lasso sets ${z} of ${n} weights exactly to 0.`,
      leadD: "Lab 4: recognise a wine's cultivar (3 classes) from 13 chemical measurements and 6 ratios I created. The 4 pipelines are exported from scikit-learn and run here; pick a test wine, then change its measurements.",
      vin: "Test wine", vrai: "true class", modif: "Change the measurements (the others stay those of the chosen wine)",
      reset: "Back to the original wine", erreurs: "Wines misclassified by at least one model",
      wnoms: { lr: "Logistic regression", dt: "Decision tree", rf: "Random Forest", gb: "Gradient Boosting" },
      classe: "Cultivar", correct: "correct", faux: "error",
      feat: { alcohol: "Alcohol", flavanoids: "Flavanoids", proline: "Proline", color_intensity: "Colour intensity", hue: "Hue", "od280/od315_of_diluted_wines": "OD280/OD315" },
      tabD: "Comparison on the 45 test wines", mAcc: "Accuracy", mP: "Macro precision", mR: "Macro recall", mF: "Macro F1", mAuc: "AUC (ovr)", mCv: "CV macro F1 (train)",
      confT: "Confusion matrices (rows = true class)", impT: "Features used most by the Random Forest", impLead: "In orange: the ratios I created. Importance is not causation.",
      noteD: "Small test set (45 wines): one error costs 2.2 points. Cross-validation actually ranks logistic regression first (0.985).",
      leadE: "Lab 4: segment 200 shopping-mall customers without any label. K-means works on 4 standardised features: age, annual income, spending score and the spending / income ratio I added.",
      k: "Number of clusters k", mode: "Mode", modeLab: "Lab result (n_init = 20)", modeAnim: "K-means step by step",
      etape: "Next step", jouer: "Run", reinitK: "New initialisation",
      vue: "View", vueRev: "Income / spending", vueAge: "Age / spending",
      revenu: "Annual income (k$)", depense: "Spending score (1-100)", ageAx: "Age",
      coude: "Elbow method (inertia)", silh: "Silhouette score", choisi: "Chosen k: 6 (highest silhouette, elbow at 5-6)",
      iter: "iteration", inertie: "inertia", conv: "converged",
      segT: "The 6 segments (k = 6)", taille: "customers", femmes: "women",
      seg: [
        ["Mature steady shoppers", "Retain: value offers, weekly promotions, delivery"],
        ["Budget-conscious savers", "Low-cost actions: coupons, essentials range"],
        ["Wealthy careful spenders", "Biggest potential: premium products, awareness campaign, surveys"],
        ["Young impulsive shoppers", "Social media and app, student discounts, flash sales"],
        ["Young mainstream shoppers", "Welcome loyalty card, progressive rewards"],
        ["Luxury shoppers", "Top target: VIP programme, early access, personalised offers"],
      ],
      cible: ["Partially", "No", "Not yet", "Yes, secondary", "Yes, growth", "Yes, priority"],
      nouveau: "Where would a new customer go?", nouveauLead: "The customer is standardised like the other 200, then assigned to the closest centroid.",
      segOf: "Segment",
    },
  };

  /* ---------- chargement ---------- */
  let charge = null;
  function charger() {
    if (charge) return charge;
    const un = (f, nom) => new Promise((ok, ko) => {
      if (window[nom]) return ok();
      const s = document.createElement("script"); s.src = f; s.onload = ok; s.onerror = ko; document.head.appendChild(s);
    });
    charge = Promise.all([un("assets/intro-ml-data.js", "INTRO_ML"), un("assets/intro-ml-cal.js", "INTRO_ML_CAL")])
      .then(() => window.INTRO_ML).catch((e) => { charge = null; throw e; });
    return charge;
  }

  /* =========================================================
     Cœur de calcul (sans DOM) — exposé pour les tests
     ========================================================= */
  const core = {};
  // California : 13 variables comme dans le notebook (8 numériques + one-hot drop_first)
  core.cal = function () {
    if (core._cal) return core._cal;
    const C = window.INTRO_ML_CAL, o = atob(C.b64), u8 = new Uint8Array(o.length);
    for (let i = 0; i < o.length; i++) u8[i] = o.charCodeAt(i);
    const I = new Int32Array(u8.buffer), n = I.length / 9, F = 13;
    const X = new Float64Array(n * F), y = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const g = (j) => I[i * 9 + j];
      const lon = g(0) / 100, lat = g(1) / 100, age = g(2), rooms = g(3), bed = g(4), pop = g(5), hh = g(6), inc = g(7) / 10000;
      const aveR = rooms / hh, o2 = i * F;
      X[o2] = inc; X[o2 + 1] = age; X[o2 + 2] = aveR; X[o2 + 3] = bed / hh; X[o2 + 4] = pop; X[o2 + 5] = pop / hh; X[o2 + 6] = lat; X[o2 + 7] = lon;
      // HouseAgeBin : young [0,10], medium ]10,30], old ]30,100] → colonnes medium, young
      X[o2 + 8] = age > 10 && age <= 30 ? 1 : 0; X[o2 + 9] = age <= 10 ? 1 : 0;
      // AveRoomsBin : small [0,5], medium ]5,7], large ]7,20], au-delà manquant → large, medium, __missing__
      X[o2 + 10] = aveR > 7 && aveR <= 20 ? 1 : 0; X[o2 + 11] = aveR > 5 && aveR <= 7 ? 1 : 0; X[o2 + 12] = aveR > 20 ? 1 : 0;
      y[i] = g(8) / 100000;
    }
    const [ntr, nva] = C.n;
    // standardisation avec les statistiques du train uniquement
    const mu = new Float64Array(F), sd = new Float64Array(F);
    for (let i = 0; i < ntr; i++) for (let j = 0; j < F; j++) mu[j] += X[i * F + j];
    for (let j = 0; j < F; j++) mu[j] /= ntr;
    for (let i = 0; i < ntr; i++) for (let j = 0; j < F; j++) { const d = X[i * F + j] - mu[j]; sd[j] += d * d; }
    for (let j = 0; j < F; j++) { sd[j] = Math.sqrt(sd[j] / ntr); if (sd[j] === 0) sd[j] = 1; }
    for (let i = 0; i < n; i++) for (let j = 0; j < F; j++) X[i * F + j] = (X[i * F + j] - mu[j]) / sd[j];
    core._cal = { X, y, F, ntr, nva, n,
      names: ["MedInc", "HouseAge", "AveRooms", "AveBedrms", "Population", "AveOccup", "Latitude", "Longitude", "HouseAgeBin_medium", "HouseAgeBin_young", "AveRoomsBin_large", "AveRoomsBin_medium", "AveRoomsBin_missing"] };
    return core._cal;
  };
  // une itération de descente de gradient (perte calculée avant la mise à jour, comme dans le notebook)
  core.gdStep = function (D, w, st, lr, lam, g) {
    const { X, y, F, ntr } = D; g.fill(0); let gb = 0, se = 0;
    for (let i = 0; i < ntr; i++) {
      let s = st.b; const o = i * F;
      for (let j = 0; j < F; j++) s += X[o + j] * w[j];
      const e = s - y[i]; se += e * e; gb += e;
      for (let j = 0; j < F; j++) g[j] += X[o + j] * e;
    }
    let w2 = 0; for (let j = 0; j < F; j++) w2 += w[j] * w[j];
    const loss = se / ntr + lam / 2 * w2;
    for (let j = 0; j < F; j++) w[j] -= lr * (2 / ntr * g[j] + lam * w[j]);
    st.b -= lr * (2 / ntr * gb);
    return loss;
  };
  core.regMetrics = function (D, w, b, a, z) {
    const { X, y, F } = D; let ae = 0, se = 0, sy = 0; const n = z - a;
    for (let i = a; i < z; i++) sy += y[i];
    const my = sy / n; let st = 0;
    for (let i = a; i < z; i++) { let s = b; for (let j = 0; j < F; j++) s += X[i * F + j] * w[j]; const e = y[i] - s; ae += Math.abs(e); se += e * e; st += (y[i] - my) ** 2; }
    return { mae: ae / n, mse: se / n, rmse: Math.sqrt(se / n), r2: 1 - se / st };
  };
  // BMW : vecteur de 69 variables
  core.bmwX = function (B, car) {
    const [mk, km, pw, age, fuel, col, typ, bits] = car;
    const base = [km, pw, age], x = new Float64Array(B.names.length);
    B.poly.forEach((pws, j) => { let v = 1; pws.forEach((p, t) => { v *= base[t] ** p; }); x[j] = (v - B.mean[j]) / B.scale[j]; });
    [mk, fuel, col, typ].forEach((v, t) => { const oh = B.oh[t]; const ix = oh.map[v] !== undefined ? oh.map[v] : oh.inf; if (ix >= 0) x[B.poly.length + ix] = 1; });
    const nb = B.names.length; for (let k = 0; k < 8; k++) x[nb - 8 + k] = (bits >> k) & 1;
    return x;
  };
  core.lin = (m, x) => { let s = m.b; for (let j = 0; j < x.length; j++) s += m.coef[j] * x[j]; return s; };
  // Vins
  core.wineX = function (W, raw) {
    const c = (n) => raw[W.cols.indexOf(n)];
    const x = raw.slice(0, 13).concat([c("total_phenols") / c("nonflavanoid_phenols"), c("flavanoids") / c("total_phenols"), c("alcohol") / c("malic_acid"),
      c("color_intensity") / c("alcohol"), c("proline") / c("alcohol"), c("color_intensity") / c("hue")]);
    return x.map((v, j) => (v - W.mean[j]) / W.scale[j]);
  };
  const softmax = (z) => { const m = Math.max(...z), e = z.map((v) => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); };
  const leaf = (t, x) => { let i = 0; while (t[i][0] !== -1) { const [f, th, l, r] = t[i]; i = Math.fround(x[f]) <= th ? l : r; } return t[i][1]; };
  core.wineP = function (W, x) {
    const lr = softmax(W.lr.W.map((row, k) => row.reduce((s, w, j) => s + w * x[j], W.lr.b[k])));
    const dt = leaf(W.dt, x);
    const rf = [0, 0, 0]; W.rf.forEach((t) => { const p = leaf(t, x); for (let k = 0; k < 3; k++) rf[k] += p[k] / W.rf.length; });
    const raw = W.gb.init.slice(); W.gb.trees.forEach((st) => st.forEach((t, k) => { raw[k] += W.gb.lr * leaf(t, x); }));
    return { lr, dt, rf, gb: softmax(raw) };
  };
  // K-means
  core.mallX = function (M, row) {
    const v = [row[0], row[2], row[3], row[3] / row[2]];
    return v.map((a, j) => (a - M.mean[j]) / M.scale[j]);
  };
  core.d2 = (a, b) => { let s = 0; for (let j = 0; j < a.length; j++) s += (a[j] - b[j]) ** 2; return s; };
  core.silhouette = function (X, lab, k) {
    const n = X.length; let tot = 0;
    const cnt = new Array(k).fill(0); lab.forEach((l) => cnt[l]++);
    for (let i = 0; i < n; i++) {
      const s = new Array(k).fill(0);
      for (let j = 0; j < n; j++) if (j !== i) s[lab[j]] += Math.sqrt(core.d2(X[i], X[j]));
      const li = lab[i]; if (cnt[li] <= 1) continue;
      const a = s[li] / (cnt[li] - 1); let b = Infinity;
      for (let c = 0; c < k; c++) if (c !== li && cnt[c] > 0) b = Math.min(b, s[c] / cnt[c]);
      tot += (b - a) / Math.max(a, b);
    }
    return tot / n;
  };
  core.inertia = (X, lab, C) => X.reduce((s, x, i) => s + core.d2(x, C[lab[i]]), 0);
  core.centroids = function (X, lab, k) {
    const C = Array.from({ length: k }, () => new Array(X[0].length).fill(0)), n = new Array(k).fill(0);
    X.forEach((x, i) => { n[lab[i]]++; x.forEach((v, j) => { C[lab[i]][j] += v; }); });
    return C.map((c, i) => c.map((v) => v / Math.max(1, n[i])));
  };

  /* =========================================================
     Petits outils de dessin (SVG)
     ========================================================= */
  function ticks(a, b, n = 5) {
    const step0 = (b - a) / n, p = 10 ** Math.floor(Math.log10(step0)), m = step0 / p;
    const step = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p, out = [];
    for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  }
  function chart({ w = 640, h = 260, xr, yr, logy = false, series = [], points = [], xt, yt, fx = (v) => v, fy = (v) => v, xlab = "", ylab = "", marks = "", ml = 52 }) {
    const L = ml, R = 14, T = 12, Bm = 34;
    const ly = (v) => (logy ? Math.log10(v) : v);
    const X = (v) => L + (v - xr[0]) / (xr[1] - xr[0]) * (w - L - R);
    const Y = (v) => T + (1 - (ly(v) - ly(yr[0])) / (ly(yr[1]) - ly(yr[0]))) * (h - T - Bm);
    let s = `<svg class="ds-svg" viewBox="0 0 ${w} ${h}" role="img">`;
    (yt || ticks(yr[0], yr[1])).forEach((v) => { s += `<line class="ds-g" x1="${L}" x2="${w - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end">${fy(v)}</text>`; });
    (xt || ticks(xr[0], xr[1])).forEach((v) => { s += `<text x="${X(v)}" y="${h - Bm + 15}" text-anchor="middle">${fx(v)}</text>`; });
    if (xlab) s += `<text class="ds-ax" x="${(L + w - R) / 2}" y="${h - 4}" text-anchor="middle">${xlab}</text>`;
    if (ylab) s += `<text class="ds-ax" x="12" y="${T + (h - T - Bm) / 2}" text-anchor="middle" transform="rotate(-90 12 ${T + (h - T - Bm) / 2})">${ylab}</text>`;
    s += marks ? marks(X, Y) : "";
    series.forEach((se) => {
      if (!se.pts.length) return;
      s += `<polyline fill="none" stroke="${se.color}" stroke-width="${se.width || 2}" ${se.dash ? `stroke-dasharray="${se.dash}"` : ""} opacity="${se.op || 1}" points="${se.pts.map(([a, b]) => `${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(" ")}"/>`;
      if (se.dots) se.pts.forEach(([a, b], i) => { s += `<circle cx="${X(a)}" cy="${Y(b)}" r="${se.hi === i ? 5.5 : 3.5}" fill="${se.hi === i ? se.color : "var(--surface)"}" stroke="${se.color}" stroke-width="2"/>`; });
    });
    points.forEach((p) => { s += `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="${p[3] || 3.6}" fill="${p[2]}" ${p[4] || ""}/>`; });
    return s + "</svg>";
  }

  /* =========================================================
     Montage
     ========================================================= */
  function mount(root, lang) {
    const T = TXT[lang] || TXT.fr, loc = lang === "en" ? "en-US" : "fr-FR";
    const nb = (v, d = 0) => v.toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d });
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const eur = (v) => (lang === "en" ? "€" + nb(v) : nb(v) + " €");
    let detruit = false, onglet = 0, nettoyage = [];
    const raf = (f) => { const id = requestAnimationFrame(f); nettoyage.push(() => cancelAnimationFrame(id)); };

    root.innerHTML = `<div class="ds-tabs im-tabs" role="tablist">${T.tabs.map((t, i) => `<button class="ds-tab" role="tab" data-t="${i}" aria-selected="${i === 0}">${t}</button>`).join("")}</div>
      <div class="ds-panel" id="im-panel"><p class="ds-loading">${T.loading}</p></div>`;
    const panel = root.querySelector("#im-panel");
    root.querySelectorAll(".ds-tab").forEach((b) => b.addEventListener("click", () => {
      onglet = +b.dataset.t; root.querySelectorAll(".ds-tab").forEach((x) => x.setAttribute("aria-selected", x === b)); afficher();
    }));
    const q = (s) => panel.querySelector(s);
    const pills = (name, vals, cur, lab = (v) => v) => `<div class="ds-pills" data-g="${name}">${vals.map((v, i) => `<button class="ds-pill" data-i="${i}" aria-pressed="${i === cur}">${lab(v)}</button>`).join("")}</div>`;
    const onPills = (name, f) => panel.querySelectorAll(`[data-g="${name}"] .ds-pill`).forEach((b) => b.addEventListener("click", () => {
      panel.querySelectorAll(`[data-g="${name}"] .ds-pill`).forEach((x) => x.setAttribute("aria-pressed", x === b)); f(+b.dataset.i);
    }));

    function afficher() {
      nettoyage.forEach((f) => f()); nettoyage = [];
      panel.innerHTML = `<p class="ds-loading">${T.loading}</p>`;
      charger().then((D) => { if (!detruit) [ongletA, ongletB, ongletC, ongletD, ongletE][onglet](D); })
        .catch(() => { if (!detruit) panel.innerHTML = `<p class="ds-loading">${T.fail}</p>`; });
    }

    /* ---------------- A · descente de gradient ---------------- */
    const LRS = [0.001, 0.01, 0.1], NS = [200, 1000, 3000], LAMS = [0, 0.01, 0.1, 1];
    const SA = { lr: 2, n: 0, lam: 0, runs: [] };
    function ongletA(Dt) {
      const L2 = Dt.lab2, CAL = core.cal();
      const dec = (v) => (lang === "en" ? String(v) : String(v).replace(".", ","));
      panel.innerHTML = `<p class="ds-lead">${T.leadA}</p>
        <div class="ds-appart">
          <div class="im-ctrls">
            <div><span class="im-lab">${T.lr}</span>${pills("lr", LRS, SA.lr, dec)}</div>
            <div><span class="im-lab">${T.iters}</span>${pills("n", NS, SA.n, (v) => nb(v))}</div>
            <div><span class="im-lab">${T.lam}</span>${pills("lam", LAMS, SA.lam, dec)}</div>
          </div>
          <div class="ds-ctrl"><button class="btn" id="im-go">${T.train}</button><button class="btn btn-ghost" id="im-best">${T.best}</button><button class="btn btn-ghost" id="im-clear">${T.clear}</button><span class="ds-small" id="im-etat"></span></div>
        </div>
        <div class="ds-box"><h5>${T.courbe}</h5><p class="ds-small">${T.echLog}</p><div id="im-curve"></div><div class="ds-leg" id="im-leg"></div></div>
        <div class="ds-kpis" id="im-kpis"></div>
        <p class="ds-choice" id="im-diag"></p>
        <div class="ds-two">
          <div class="ds-box"><h5>${T.poids}</h5><p class="ds-small">${T.poidsLead}</p><div class="ds-bars im-wbars" id="im-w"></div></div>
          <div class="ds-box"><h5>${T.finalA}</h5>
            <div class="ds-tablewrap"><table class="ds-table im-mini"><thead><tr><th></th><th>MAE</th><th>RMSE</th><th>R²</th></tr></thead><tbody>
              <tr><th scope="row">${T.scratch}</th><td class="best">${nb(L2.test.mae, 4)}</td><td>${nb(L2.test.rmse, 4)}</td><td>${nb(L2.test.r2, 4)}</td></tr>
              <tr><th scope="row">${T.sk}</th><td>${nb(L2.sk.mae, 4)}</td><td>${nb(L2.sk.rmse, 4)}</td><td>${nb(L2.sk.r2, 4)}</td></tr>
            </tbody></table></div>
            <p class="ds-small">${lang === "fr" ? "scikit-learn résout les équations normales (solution exacte) ; ma descente de gradient arrive au même résultat à 0,0003 près." : "scikit-learn solves the normal equations (exact solution); my gradient descent reaches the same result within 0.0003."}</p>
          </div>
        </div>
        <div class="ds-box"><h5>${T.grille}</h5><p class="ds-small">${T.grilleLead}</p><div class="ds-tablewrap im-gridwrap"><table class="ds-table im-grid"><thead><tr><th>${T.thLr}</th><th>${T.thN}</th><th>${T.thLam}</th><th>${T.thTm}</th><th>${T.thVm}</th><th>${T.thVr}</th><th>${T.thR2}</th></tr></thead><tbody id="im-gbody"></tbody></table></div></div>`;
      onPills("lr", (i) => { SA.lr = i; majGrille(); }); onPills("n", (i) => { SA.n = i; majGrille(); }); onPills("lam", (i) => { SA.lam = i; majGrille(); });
      const setP = (a, b, c) => { SA.lr = a; SA.n = b; SA.lam = c; [["lr", a], ["n", b], ["lam", c]].forEach(([g, v]) => panel.querySelectorAll(`[data-g="${g}"] .ds-pill`).forEach((x) => x.setAttribute("aria-pressed", +x.dataset.i === v))); majGrille(); };
      const tri = L2.grid.slice().sort((a, b) => a.vmae - b.vmae);
      q("#im-gbody").innerHTML = tri.map((g) => `<tr data-k="${LRS.indexOf(g.lr)},${NS.indexOf(g.n)},${LAMS.indexOf(g.lam)}"><td>${dec(g.lr)}</td><td>${nb(g.n)}</td><td>${dec(g.lam)}</td><td>${nb(g.tmae, 4)}</td><td>${nb(g.vmae, 4)}</td><td>${nb(g.vrmse, 4)}</td><td>${nb(g.vr2, 4)}</td></tr>`).join("");
      q("#im-gbody").addEventListener("click", (e) => { const tr = e.target.closest("tr"); if (!tr) return; const [a, b, c] = tr.dataset.k.split(",").map(Number); setP(a, b, c); entrainer(); });
      function majGrille() { const k = `${SA.lr},${SA.n},${SA.lam}`; panel.querySelectorAll("#im-gbody tr").forEach((tr) => tr.classList.toggle("im-cur", tr.dataset.k === k)); }
      q("#im-best").addEventListener("click", () => { setP(2, 0, 0); entrainer(); });
      q("#im-clear").addEventListener("click", () => { SA.runs = SA.runs.slice(-1); dessinerCourbe(); });
      let job = null;
      q("#im-go").addEventListener("click", () => { if (job) { job.stop = true; } else entrainer(); });
      nettoyage.push(() => { if (job) job.stop = true; });
      const nomRun = (r) => `lr ${dec(LRS[r.p[0]])} · ${nb(NS[r.p[1]])} it. · λ ${dec(LAMS[r.p[2]])}`;
      function dessinerCourbe() {
        const maxN = Math.max(200, ...SA.runs.map((r) => r.n));
        const all = SA.runs.flatMap((r) => r.loss);
        const lo = Math.max(0.3, Math.min(0.5, ...all)), hi = Math.max(6, ...all);
        const series = SA.runs.map((r, i) => {
          const pts = [], step = Math.max(1, Math.floor(r.loss.length / 400));
          for (let t = 0; t < r.loss.length; t += step) pts.push([t + 1, r.loss[t]]);
          if (r.loss.length) pts.push([r.loss.length, r.loss[r.loss.length - 1]]);
          return { pts, color: PAL[r.c % PAL.length], width: i === SA.runs.length - 1 ? 2.6 : 1.6, op: i === SA.runs.length - 1 ? 1 : 0.55 };
        });
        q("#im-curve").innerHTML = chart({ w: 680, h: 250, xr: [0, maxN], yr: [lo, hi], logy: true, series, yt: [0.5, 1, 2, 5].filter((v) => v >= lo && v <= hi), fx: (v) => nb(v), fy: (v) => nb(v, v < 1 ? 1 : 0), xlab: T.it });
        q("#im-leg").innerHTML = SA.runs.map((r) => `<span><i style="background:${PAL[r.c % PAL.length]}"></i>${nomRun(r)}${r.fin ? ` · <b>${nb(r.loss[r.loss.length - 1], 4)}</b>` : ""}</span>`).join("");
      }
      function kpis(r) {
        if (!r || !r.fin) { q("#im-kpis").innerHTML = ""; q("#im-diag").textContent = ""; return; }
        const k = [[nb(r.tr.mae, 4), T.kTrainMae], [nb(r.va.mae, 4), T.kValMae], [nb(r.va.rmse, 4), T.kValRmse], [nb(r.va.r2, 4), T.kValR2], [nb(r.loss[r.loss.length - 1], 4), T.kLoss]];
        q("#im-kpis").innerHTML = k.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("");
        const d = r.va.r2 < 0.3 ? T.diag.under : LAMS[r.p[2]] >= 1 ? T.diag.reg : r.va.r2 < 0.61 ? T.diag.mid : T.diag.ok;
        q("#im-diag").innerHTML = `<b>${nomRun(r)}</b> — ${d}`;
        const m = Math.max(...Array.from(r.w, Math.abs), 0.01);
        q("#im-w").innerHTML = CAL.names.map((nm, j) => { const v = r.w[j], pc = Math.abs(v) / m * 50; return `<div class="ds-bar im-wbar"><span>${nm}</span><div><i style="margin-left:${v < 0 ? 50 - pc : 50}%;width:${pc}%;background:${v < 0 ? "#C92A2A" : "var(--data)"}"></i></div><b>${nb(v, 3)}</b></div>`; }).join("");
      }
      function entrainer() {
        if (job) return;
        const r = { p: [SA.lr, SA.n, SA.lam], n: NS[SA.n], loss: [], c: (SA.cpt = (SA.cpt || 0) + 1) - 1, fin: false };
        SA.runs.push(r); if (SA.runs.length > 4) SA.runs.shift();
        const lr = LRS[r.p[0]], lam = LAMS[r.p[2]], w = new Float64Array(CAL.F), g = new Float64Array(CAL.F), st = { b: 0 };
        job = { stop: false }; const me = job;
        q("#im-go").textContent = T.stop; q("#im-etat").textContent = T.enCours; kpis(null);
        const tranche = () => {
          if (me.stop || detruit) { job = null; if (!detruit) { q("#im-go").textContent = T.train; q("#im-etat").textContent = ""; SA.runs = SA.runs.filter((x) => x !== r); dessinerCourbe(); } return; }
          const t0 = performance.now();
          while (r.loss.length < r.n && performance.now() - t0 < 45) r.loss.push(core.gdStep(CAL, w, st, lr, lam, g));
          q("#im-etat").textContent = `${T.it} ${nb(r.loss.length)} / ${nb(r.n)}`;
          if (r.loss.length >= r.n || performance.now() - (me.dessin || 0) > 120) { dessinerCourbe(); me.dessin = performance.now(); }
          if (r.loss.length < r.n) return raf(tranche);
          r.fin = true; r.w = w; r.b = st.b;
          r.tr = core.regMetrics(CAL, w, st.b, 0, CAL.ntr); r.va = core.regMetrics(CAL, w, st.b, CAL.ntr, CAL.ntr + CAL.nva);
          job = null; q("#im-go").textContent = T.train; q("#im-etat").textContent = "";
          dessinerCourbe(); kpis(r);
        };
        raf(tranche);
      }
      majGrille(); dessinerCourbe();
      const last = SA.runs[SA.runs.length - 1];
      if (last && last.fin) kpis(last); else { SA.runs = []; entrainer(); }
    }

    /* ---------------- B · validation & métriques ---------------- */
    const SB = { k: 1, mel: true, seuil: 0.5, tir: 10, tires: null };
    function ongletB(Dt) {
      const KF = Dt.kfold, MT = Dt.metrics, RS = Dt.rsearch;
      panel.innerHTML = `<p class="ds-lead">${T.leadB}</p>
        <div class="ds-box"><h5>${T.kfT}</h5><p class="ds-small">${T.kfLead}</p>
          <div class="ds-ctrl">${pills("kf", [3, 5, 10], SB.k, (v) => "k = " + v)}<label class="im-check"><input type="checkbox" id="im-mel" ${SB.mel ? "checked" : ""}> ${T.melange}</label></div>
          <div class="ds-leg">${T.esp.map((e, i) => `<span><i style="background:${CLS[i]}"></i>${e}</span>`).join("")}</div>
          <div id="im-folds" class="im-folds"></div><p class="ds-small" id="im-kfnote"></p></div>
        <div class="ds-box"><h5>${T.mtT}</h5><p class="ds-small">${T.mtLead}</p>
          <label class="ds-slider">${T.seuil} : <b id="im-sv"></b><input type="range" id="im-seuil" min="0.02" max="0.98" step="0.01" value="${SB.seuil}"></label>
          <div id="im-strip"></div>
          <div class="ds-leg"><span><i style="background:${CLS[2]}"></i>${T.benin}</span><span><i style="background:${CLS[1]}"></i>${T.malin}</span></div>
          <div class="im-cmwrap"><div id="im-cm"></div><div class="ds-kpis im-k4" id="im-met"></div></div><p class="ds-small" id="im-mnote"></p></div>
        <div class="ds-box"><h5>${T.rsT}</h5><p class="ds-small">${T.rsLead}</p>
          <div class="ds-ctrl"><label class="ds-slider im-inline">${T.tirage} : <b id="im-tv">${SB.tir}</b><input type="range" id="im-tir" min="1" max="32" value="${SB.tir}"></label>
            <button class="btn" id="im-rand">${T.tirer}</button><button class="btn btn-ghost" id="im-nb">${T.notebook}</button><button class="btn btn-ghost" id="im-all">${T.tout}</button></div>
          <div id="im-rsgrid"></div><p class="ds-choice" id="im-rsres"></p></div>`;
      // k-fold
      const y = KF.y;
      function folds() {
        const k = [3, 5, 10][SB.k], R = KF.res[k];
        const perm = SB.mel ? R.perm : Array.from({ length: 150 }, (_, i) => i);
        const sizes = Array.from({ length: k }, (_, i) => Math.floor(150 / k) + (i < 150 % k ? 1 : 0));
        let o = 0, html = "";
        sizes.forEach((s, i) => {
          const part = perm.slice(o, o + s); o += s;
          const cnt = [0, 0, 0]; part.forEach((p) => cnt[y[p]]++);
          html += `<div class="im-fold"><span class="im-fl">${T.pli} ${i + 1}</span><div class="im-sq">${part.map((p) => `<i style="background:${CLS[y[p]]}"></i>`).join("")}</div>
            ${SB.mel ? `<b>${nb(R.acc[i], 3)}</b>` : `<b class="im-warn">${cnt.filter((c) => c).length === 1 ? "1 " + (lang === "fr" ? "espèce" : "species") : cnt.filter((c) => c).length + " " + (lang === "fr" ? "espèces" : "species")}</b>`}</div>`;
        });
        q("#im-folds").innerHTML = html;
        q("#im-kfnote").innerHTML = SB.mel ? `<b>${T.moy} : ${nb(R.mean, 3)} ± ${nb(R.std, 3)}</b> — ${T.skk}` : T.sansMel;
      }
      onPills("kf", (i) => { SB.k = i; folds(); });
      q("#im-mel").addEventListener("change", (e) => { SB.mel = e.target.checked; folds(); });
      folds();
      // métriques
      function metriques() {
        const s = SB.seuil; q("#im-sv").textContent = nb(s, 2);
        let TP = 0, FP = 0, FN = 0, TN = 0;
        MT.p.forEach((p, i) => { const pr = p >= s ? 1 : 0, t = MT.y[i]; if (pr && t) TP++; else if (pr) FP++; else if (t) FN++; else TN++; });
        const P = TP + FP ? TP / (TP + FP) : 0, R = TP + FN ? TP / (TP + FN) : 0, F = P + R ? 2 * P * R / (P + R) : 0;
        // nuage 1D : probabilité en x, deux lignes (classe réelle), un peu de dispersion verticale
        const pts = MT.p.map((p, i) => [p, (MT.y[i] ? 0.7 : 0.25) + ((i * 37) % 11 - 5) * 0.018, MT.y[i] ? CLS[2] : CLS[1], 3.4, `opacity=".8"`]);
        q("#im-strip").innerHTML = chart({ w: 680, h: 150, xr: [0, 1], yr: [0, 1], yt: [], points: pts, ml: 16, fx: (v) => nb(v, 1), xlab: lang === "fr" ? "probabilité « bénigne »" : "“benign” probability",
          marks: (X, Y) => `<rect x="${X(s)}" y="${Y(1)}" width="${X(1) - X(s)}" height="${Y(0) - Y(1)}" fill="${CLS[2]}" opacity=".07"/><line x1="${X(s)}" x2="${X(s)}" y1="${Y(1)}" y2="${Y(0)}" stroke="var(--accent)" stroke-width="2"/>` });
        q("#im-cm").innerHTML = `<table class="im-cm"><thead><tr><th></th><th>${T.predP}</th><th>${T.predN}</th></tr></thead><tbody>
          <tr><th>${T.vraiP}</th><td class="ok"><b>${TP}</b><span>TP</span></td><td class="ko"><b>${FN}</b><span>FN</span></td></tr>
          <tr><th>${T.vraiN}</th><td class="ko"><b>${FP}</b><span>FP</span></td><td class="ok"><b>${TN}</b><span>TN</span></td></tr></tbody></table>`;
        q("#im-met").innerHTML = [[P, "Precision", "TP / (TP + FP)"], [R, "Recall", "TP / (TP + FN)"], [F, "F1", "2PR / (P + R)"], [(TP + TN) / 114, "Accuracy", "(TP + TN) / 114"]]
          .map(([v, l, f]) => `<div><b>${nb(v, 4)}</b><span>${l}<br>${f}</span></div>`).join("");
        q("#im-mnote").textContent = Math.abs(s - 0.5) < 0.005 ? T.noteSeuil : "";
      }
      q("#im-seuil").addEventListener("input", (e) => { SB.seuil = +e.target.value; metriques(); });
      metriques();
      // random search
      const C = RS.combos, DEP = [3, 5, 7, null], CRI = ["gini", "entropy"], SPL = [2, 3, 4, 5];
      const ix = (c) => DEP.indexOf(c.d) * 8 + CRI.indexOf(c.c) * 4 + SPL.indexOf(c.s);
      const cvs = C.map((c) => c.cv), lo = Math.min(...cvs), hi = Math.max(...cvs);
      function grille() {
        const vus = new Set(SB.tires || []); let best = -1;
        (SB.tires || []).forEach((i) => { if (best < 0 || C[i].cv > C[best].cv) best = i; });
        let h = `<div class="im-rs"><div></div>${CRI.map((c) => `<div class="im-rsh" style="grid-column:span 4">${T.crit} = ${c}</div>`).join("")}
          <div></div>${CRI.map(() => SPL.map((s) => `<div class="im-rsh">split ${s}</div>`).join("")).join("")}`;
        DEP.forEach((d) => {
          h += `<div class="im-rsh im-rsr">${T.prof} ${d === null ? T.sansLim : d}</div>`;
          CRI.forEach((c) => SPL.forEach((s) => {
            const i = C.findIndex((x) => x.d === d && x.c === c && x.s === s), v = vus.has(i), t = (C[i].cv - lo) / (hi - lo || 1);
            h += `<div class="im-rsc${v ? " vu" : ""}${i === best ? " best" : ""}" style="${v ? `--t:${(0.15 + 0.85 * t).toFixed(2)}` : ""}">${v ? nb(C[i].cv, 3) : ""}${v && SB.ordre ? `<small>#${SB.ordre.indexOf(i) + 1}</small>` : ""}</div>`;
          }));
        });
        q("#im-rsgrid").innerHTML = h + "</div>";
        q("#im-rsres").innerHTML = best < 0 ? "" : `<b>${T.meilleur} :</b> max_depth = ${C[best].d === null ? "None" : C[best].d}, criterion = ${C[best].c}, min_samples_split = ${C[best].s} — ${T.cv} <b>${nb(C[best].cv, 4)}</b> · ${T.testAcc} <b>${nb(C[best].test, 4)}</b> (${T.defaut} : ${nb(RS.dflt, 4)}). ${vus.size < 32 ? T.rsNote(vus.size) : ""}`;
      }
      q("#im-tir").addEventListener("input", (e) => { SB.tir = +e.target.value; q("#im-tv").textContent = SB.tir; });
      q("#im-rand").addEventListener("click", () => {
        const a = Array.from({ length: 32 }, (_, i) => i);
        for (let i = 31; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        SB.tires = a.slice(0, SB.tir); SB.ordre = SB.tires.slice(); grille();
      });
      q("#im-nb").addEventListener("click", () => { SB.tires = RS.nb.slice(); SB.ordre = RS.nb.slice(); SB.tir = 10; q("#im-tir").value = 10; q("#im-tv").textContent = 10; grille(); });
      q("#im-all").addEventListener("click", () => { SB.tires = Array.from({ length: 32 }, (_, i) => i); SB.ordre = null; grille(); });
      if (!SB.tires) { SB.tires = RS.nb.slice(); SB.ordre = RS.nb.slice(); }
      grille();
    }

    /* ---------------- C · prix BMW ---------------- */
    const SC = { car: null, reel: null, src: null };
    function ongletC(Dt) {
      const B = Dt.bmw, cats = (t) => Object.keys(B.oh[t].map).sort((a, b) => (B.oh[t].counts[b] || 0) - (B.oh[t].counts[a] || 0));
      const rare = (t, v) => B.oh[t].inf >= 0 && B.oh[t].map[v] === B.oh[t].inf;
      const opt = (t) => cats(t).map((v) => `<option value="${esc(v)}">${esc(v)}${rare(t, v) ? ` (${T.rare})` : ""}</option>`).join("");
      if (!SC.car) choisir(B.cars.findIndex((c) => c[0] === "320" && c[6] === "estate") || 0);
      function choisir(i) { const c = B.cars[i]; SC.car = c.slice(0, 8); SC.reel = c[8]; SC.src = c; }
      panel.innerHTML = `<p class="ds-lead">${T.leadC}</p>
        <div class="ds-appart">
          <div class="ds-presets"><button class="btn" id="im-car">${T.voitureTest}</button><span class="ds-small" id="im-carinfo"></span></div>
          <div class="ds-inputs im-bmw">
            <label>${T.modele}<select id="b-mk">${opt(0)}</select></label>
            <label>${T.carbu}<select id="b-fuel">${opt(1)}</select></label>
            <label>${T.couleur}<select id="b-col">${opt(2)}</select></label>
            <label>${T.carro}<select id="b-typ">${opt(3)}</select></label>
            <label>${T.km} <b id="b-kmv"></b><input type="range" id="b-km" min="0" max="400000" step="1000"></label>
            <label>${T.puiss} <b id="b-pwv"></b><input type="range" id="b-pw" min="${B.ranges.power[0]}" max="${Math.min(450, B.ranges.power[1])}" step="1"></label>
            <label>${T.age} <b id="b-agev"></b><input type="range" id="b-age" min="0" max="25" step="0.1"></label>
          </div>
          <div><span class="im-lab">${T.options}</span><div class="ds-pills" id="b-opts">${Array.from({ length: 8 }, (_, k) => `<button class="ds-pill" data-k="${k}">${T.opt} ${k + 1}</button>`).join("")}</div></div>
        </div>
        <div class="ds-preds" id="b-preds"></div>
        <div class="ds-two">
          <div class="ds-box"><h5>${T.contrib}</h5><p class="ds-small">${T.contribLead}</p><div id="b-contrib"></div></div>
          <div class="ds-box"><h5>${T.nuage}</h5><div id="b-nuage"></div></div>
        </div>
        <div class="ds-box"><h5>${T.resC}</h5><div class="ds-tablewrap"><table class="ds-table"><thead><tr><th>${T.modele}</th><th>${T.alpha}</th><th>R²</th><th>RMSE</th></tr></thead><tbody>
          ${["lin", "ridge", "lasso"].map((m) => `<tr><th scope="row">${T.noms[m]}</th><td>${m === "lin" ? "–" : nb(B.alpha[m], 2)}</td><td class="${m === "lasso" ? "best" : ""}">${nb(B.models[m].r2, 4)}</td><td class="${m === "lasso" ? "best" : ""}">${eur(B.models[m].rmse)}</td></tr>`).join("")}
        </tbody></table></div><p class="ds-small">${T.zeros(B.zeros, B.names.length)} ${lang === "fr" ? `${nb(B.ntrain)} voitures en entraînement, ${nb(B.ntest)} en test.` : `${nb(B.ntrain)} training cars, ${nb(B.ntest)} test cars.`}</p></div>`;
      const F = { mk: q("#b-mk"), fuel: q("#b-fuel"), col: q("#b-col"), typ: q("#b-typ"), km: q("#b-km"), pw: q("#b-pw"), age: q("#b-age") };
      function versChamps() {
        const c = SC.car; F.mk.value = c[0]; F.km.value = c[1]; F.pw.value = c[2]; F.age.value = c[3]; F.fuel.value = c[4]; F.col.value = c[5]; F.typ.value = c[6];
        panel.querySelectorAll("#b-opts .ds-pill").forEach((b) => b.setAttribute("aria-pressed", !!((c[7] >> +b.dataset.k) & 1)));
      }
      function depuisChamps() {
        let bits = 0; panel.querySelectorAll("#b-opts .ds-pill").forEach((b) => { if (b.getAttribute("aria-pressed") === "true") bits |= 1 << +b.dataset.k; });
        SC.car = [F.mk.value, +F.km.value, +F.pw.value, +F.age.value, F.fuel.value, F.col.value, F.typ.value, bits]; SC.reel = null;
      }
      Object.values(F).forEach((el) => el.addEventListener("input", () => { depuisChamps(); maj(); }));
      panel.querySelectorAll("#b-opts .ds-pill").forEach((b) => b.addEventListener("click", () => { b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"); depuisChamps(); maj(); }));
      q("#im-car").addEventListener("click", () => { choisir(Math.floor(Math.random() * B.cars.length)); versChamps(); maj(); });
      const nuagePts = B.cars.map((c) => [c[8], c[9]]);
      function maj() {
        const c = SC.car, x = core.bmwX(B, c);
        q("#b-kmv").textContent = nb(c[1]) + " km"; q("#b-pwv").textContent = nb(c[2]); q("#b-agev").textContent = nb(c[3], 1) + " " + T.ans;
        const s = SC.src && SC.reel !== null ? SC.src : null;
        q("#im-carinfo").textContent = s ? `${T.immat} ${s[10].slice(0, 7)} · ${T.vendue} ${s[11].slice(0, 7)}` : "";
        const P = { lasso: core.lin(B.models.lasso, x), ridge: core.lin(B.models.ridge, x), lin: core.lin(B.models.lin, x) };
        const col = { lasso: "var(--accent)", ridge: "#1C7ED6", lin: "#2F9E44" };
        q("#b-preds").innerHTML = ["lasso", "ridge", "lin"].map((m) => `<div class="ds-pred" style="--c:${col[m]}"><span>${T.noms[m]}</span><b>${eur(Math.round(P[m] / 10) * 10)}</b><small>R² ${nb(B.models[m].r2, 4)}</small></div>`).join("")
          + (SC.reel !== null ? `<div class="ds-pred ds-reel"><span>${T.prixReel}</span><b>${eur(SC.reel)}</b><small>${lang === "fr" ? "écart Lasso" : "Lasso gap"} ${eur(Math.round((P.lasso - SC.reel) / 10) * 10)}</small></div>` : "");
        // contributions groupées
        const co = B.models.lasso.coef, g = {}; const add = (k, v) => { g[k] = (g[k] || 0) + v; };
        B.names.forEach((nm, j) => {
          const v = co[j] * x[j]; if (!v) return;
          if (j < 9) { const p = B.poly[j]; const nz = p.filter((a) => a).length; add(nz > 1 ? "croise" : p[0] ? "km" : p[1] ? "puiss" : "age", v); }
          else if (nm.startsWith("feature_")) add("opt", v);
          else add(["model_key", "fuel", "paint_color", "car_type"].find((cc) => nm.startsWith(cc + "_")), v);
        });
        const et = Object.entries(g).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
        let cum = B.models.lasso.b; const steps = [[T.base, cum, 0, cum]];
        et.forEach(([k, v]) => { steps.push([T.grp[k], v, cum, cum + v]); cum += v; });
        const all = steps.flatMap((s) => [s[2], s[3]]).concat([0]), lo = Math.min(...all), hi = Math.max(...all);
        const W = 500, rowH = 24, L = 110, R = 64, H = rowH * (steps.length + 1) + 8, X = (v) => L + (v - lo) / (hi - lo || 1) * (W - L - R);
        let svg = `<svg class="ds-svg" viewBox="0 0 ${W} ${H}">`;
        steps.forEach((s, i) => {
          const y0 = 4 + i * rowH, a = X(Math.min(s[2], s[3])), b = X(Math.max(s[2], s[3]));
          const c = i === 0 ? "var(--muted)" : s[1] >= 0 ? "#2F9E44" : "#C92A2A";
          svg += `<text class="ds-lab" x="${L - 8}" y="${y0 + 15}" text-anchor="end">${esc(s[0])}</text><rect x="${a}" y="${y0 + 4}" width="${Math.max(1.5, b - a)}" height="${rowH - 8}" rx="2" fill="${c}" opacity=".85"/>
            <text class="ds-val" x="${b + 6}" y="${y0 + 15}">${i === 0 ? "" : s[1] >= 0 ? "+" : "−"}${nb(Math.abs(Math.round(s[1])))}</text>`;
        });
        const yf = 4 + steps.length * rowH;
        svg += `<line class="ds-ref" x1="${X(0)}" x2="${X(0)}" y1="0" y2="${yf}"/><text class="ds-lab" x="${L - 8}" y="${yf + 15}" text-anchor="end"><tspan font-weight="700">= ${T.noms.lasso}</tspan></text><rect x="${X(Math.min(0, cum))}" y="${yf + 4}" width="${Math.abs(X(cum) - X(0))}" height="${rowH - 8}" rx="2" fill="var(--accent)"/><text class="ds-val" x="${X(Math.max(0, cum)) + 6}" y="${yf + 15}" font-weight="700">${eur(Math.round(cum))}</text></svg>`;
        q("#b-contrib").innerHTML = svg;
        const mx = 100000;
        const pts = nuagePts.filter((p) => p[0] <= mx && p[1] <= mx).map((p) => [p[0], Math.max(-5000, p[1]), "var(--data)", 2.2, `opacity=".35"`]);
        if (SC.reel !== null && SC.reel <= mx) pts.push([SC.reel, Math.min(mx, P.lasso), "var(--accent)", 6, `stroke="var(--surface)" stroke-width="2"`]);
        q("#b-nuage").innerHTML = chart({ w: 460, h: 330, xr: [0, mx], yr: [-5000, mx], points: pts, fx: (v) => nb(v / 1000) + "k", fy: (v) => nb(v / 1000) + "k", xlab: T.reelAx, ylab: T.predAx, ml: 46,
          marks: (X, Y) => `<line class="ds-ref" x1="${X(0)}" y1="${Y(0)}" x2="${X(mx)}" y2="${Y(mx)}"/>` });
      }
      versChamps(); maj();
    }

    /* ---------------- D · vins ---------------- */
    const SD = { i: 0, raw: null };
    function ongletD(Dt) {
      const W = Dt.wine, MODS = ["lr", "dt", "rf", "gb"], KEY = ["alcohol", "flavanoids", "proline", "color_intensity", "hue", "od280/od315_of_diluted_wines"];
      const preds = W.test.map((r) => core.wineP(W, core.wineX(W, r)));
      const am = (p) => p.indexOf(Math.max(...p));
      const errs = W.test.map((_, i) => i).filter((i) => MODS.some((m) => am(preds[i][m]) !== W.ytest[i]));
      if (!SD.raw) SD.raw = W.test[SD.i].slice();
      panel.innerHTML = `<p class="ds-lead">${T.leadD}</p>
        <div class="ds-appart">
          <div class="ds-ctrl"><label class="im-sel">${T.vin} <select id="w-sel">${W.test.map((_, i) => `<option value="${i}">#${W.ids[i]} · ${T.vrai} ${W.ytest[i]}${errs.includes(i) ? " ⚠" : ""}</option>`).join("")}</select></label>
            <button class="btn btn-ghost" id="w-reset">${T.reset}</button></div>
          <p class="ds-small">⚠ ${T.erreurs} : ${errs.map((i) => `<button class="im-link" data-w="${i}">#${W.ids[i]}</button>`).join(" ")}</p>
          <span class="im-lab">${T.modif}</span>
          <div class="ds-inputs im-wine">${KEY.map((k) => { const j = W.cols.indexOf(k), [a, b] = W.ranges[k]; const st = k === "proline" ? 10 : (b - a) / 200; return `<label>${T.feat[k]} <b data-v="${j}"></b><input type="range" data-j="${j}" min="${a}" max="${b}" step="${st.toPrecision(2)}"></label>`; }).join("")}</div>
        </div>
        <div class="im-wpreds" id="w-preds"></div>
        <div class="ds-box"><h5>${T.tabD}</h5><div class="ds-tablewrap"><table class="ds-table"><thead><tr><th>${T.modele}</th><th>${T.mAcc}</th><th>${T.mP}</th><th>${T.mR}</th><th>${T.mF}</th><th>${T.mAuc}</th><th>${T.mCv}</th></tr></thead><tbody>
          ${["rf", "gb", "lr", "dt"].map((m) => { const M = W.metrics[m], b = (v, best) => `<td class="${v === best ? "best" : ""}">${nb(v, 3)}</td>`; return `<tr><th scope="row">${T.wnoms[m]}</th>${b(M.acc, 1)}${b(M.p, 1)}${b(M.r, 1)}${b(M.f1, 1)}${b(M.auc, 1)}<td class="${m === "lr" ? "best" : ""}">${nb(M.cv, 3)} ± ${nb(M.cvs, 3)}</td></tr>`; }).join("")}
        </tbody></table></div><p class="ds-small">${T.noteD}</p></div>
        <div class="ds-two">
          <div class="ds-box"><h5>${T.confT}</h5><div class="im-confs" id="w-conf"></div></div>
          <div class="ds-box"><h5>${T.impT}</h5><p class="ds-small">${T.impLead}</p><div class="ds-bars" id="w-imp"></div></div>
        </div>`;
      // matrices de confusion calculées ici
      q("#w-conf").innerHTML = MODS.map((m) => {
        const cm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; preds.forEach((p, i) => cm[W.ytest[i]][am(p[m])]++);
        return `<div><span class="im-cmt">${T.wnoms[m]}</span><table class="im-cm3">${cm.map((r, a) => `<tr>${r.map((v, b) => `<td class="${a === b ? "ok" : v ? "ko" : ""}">${v}</td>`).join("")}</tr>`).join("")}</table></div>`;
      }).join("");
      const ENG = new Set(W.cols.slice(13)), imp = W.imp.rf.map((v, j) => [W.cols[j], v]).sort((a, b) => b[1] - a[1]).slice(0, 10), mi = imp[0][1];
      q("#w-imp").innerHTML = imp.map(([nm, v]) => `<div class="ds-bar"><span>${esc(nm)}</span><div><i style="width:${v / mi * 100}%;background:${ENG.has(nm) ? "#E8590C" : "var(--data)"};opacity:1"></i></div><b>${nb(v, 3)}</b></div>`).join("");
      const sl = panel.querySelectorAll(".im-wine input");
      function versChamps() { sl.forEach((s) => { s.value = SD.raw[+s.dataset.j]; }); }
      sl.forEach((s) => s.addEventListener("input", () => { SD.raw[+s.dataset.j] = +s.value; maj(); }));
      q("#w-sel").value = SD.i;
      q("#w-sel").addEventListener("change", (e) => { SD.i = +e.target.value; SD.raw = W.test[SD.i].slice(); versChamps(); maj(); });
      q("#w-reset").addEventListener("click", () => { SD.raw = W.test[SD.i].slice(); versChamps(); maj(); });
      panel.querySelectorAll("[data-w]").forEach((b) => b.addEventListener("click", () => { SD.i = +b.dataset.w; q("#w-sel").value = SD.i; SD.raw = W.test[SD.i].slice(); versChamps(); maj(); }));
      function maj() {
        panel.querySelectorAll("[data-v]").forEach((b) => { const j = +b.dataset.v, v = SD.raw[j]; b.textContent = nb(v, W.cols[j] === "proline" ? 0 : 2); });
        const P = core.wineP(W, core.wineX(W, SD.raw)), vrai = W.ytest[SD.i];
        const modifie = SD.raw.some((v, j) => v !== W.test[SD.i][j]);
        q("#w-preds").innerHTML = MODS.map((m) => {
          const p = P[m], k = am(p), ok = k === vrai;
          return `<div class="ds-box im-wcard"><div class="im-wtop"><span>${T.wnoms[m]}</span>${modifie ? "" : `<em class="${ok ? "ok" : "ko"}">${ok ? T.correct : T.faux}</em>`}</div>
            <b class="im-wcls" style="color:${CLS[k]}">${T.classe} ${k}</b>
            ${p.map((v, c) => `<div class="im-pbar"><span>${c}</span><div><i style="width:${v * 100}%;background:${CLS[c]}"></i></div><b>${nb(v * 100, 0)} %</b></div>`).join("")}</div>`;
        }).join("");
      }
      versChamps(); maj();
    }

    /* ---------------- E · K-means ---------------- */
    const SE = { k: 6, mode: 0, vue: 0, anim: null, client: [30, 70, 80] };
    function ongletE(Dt) {
      const M = Dt.mall, X = M.rows.map((r) => core.mallX(M, r)), N = X.length;
      panel.innerHTML = `<p class="ds-lead">${T.leadE}</p>
        <div class="ds-appart">
          <div class="im-ctrls">
            <label class="ds-slider im-inline">${T.k} : <b id="e-kv">${SE.k}</b><input type="range" id="e-k" min="2" max="10" value="${SE.k}"></label>
            <div><span class="im-lab">${T.mode}</span>${pills("mode", [T.modeLab, T.modeAnim], SE.mode)}</div>
            <div><span class="im-lab">${T.vue}</span>${pills("vue", [T.vueRev, T.vueAge], SE.vue)}</div>
          </div>
          <div class="ds-ctrl" id="e-anim"><button class="btn" id="e-play">${T.jouer}</button><button class="btn btn-ghost" id="e-step">${T.etape}</button><button class="btn btn-ghost" id="e-init">${T.reinitK}</button><span class="ds-small" id="e-etat"></span></div>
        </div>
        <div class="ds-two im-e2">
          <div class="ds-box"><div id="e-scatter"></div><div class="ds-leg" id="e-leg"></div></div>
          <div class="im-col">
            <div class="ds-box"><h5>${T.coude}</h5><div id="e-elbow"></div></div>
            <div class="ds-box"><h5>${T.silh}</h5><div id="e-sil"></div><p class="ds-small">${T.choisi}</p></div>
          </div>
        </div>
        <div class="ds-box" id="e-segs"></div>
        <div class="ds-box"><h5>${T.nouveau}</h5><p class="ds-small">${T.nouveauLead}</p>
          <div class="ds-inputs im-new">${[[T.ageAx, 18, 70], [T.revenu, 15, 137], [T.depense, 1, 99]].map(([l, a, b], i) => `<label>${l} <b data-c="${i}"></b><input type="range" data-ci="${i}" min="${a}" max="${b}" value="${SE.client[i]}"></label>`).join("")}</div>
          <p class="ds-choice" id="e-new"></p></div>`;
      onPills("mode", (i) => { SE.mode = i; if (i === 1) initAnim(); tout(); });
      onPills("vue", (i) => { SE.vue = i; dessin(); });
      q("#e-k").addEventListener("input", (e) => { SE.k = +e.target.value; q("#e-kv").textContent = SE.k; if (SE.mode === 1) initAnim(); tout(); });
      let timer = null; const stopT = () => { clearInterval(timer); timer = null; q("#e-play").textContent = T.jouer; };
      nettoyage.push(() => clearInterval(timer));
      q("#e-step").addEventListener("click", () => { stopT(); pas(); dessin(); });
      q("#e-init").addEventListener("click", () => { stopT(); initAnim(); dessin(); });
      q("#e-play").addEventListener("click", () => {
        if (timer) return stopT();
        if (SE.anim && SE.anim.conv) initAnim();
        q("#e-play").textContent = "❚❚"; timer = setInterval(() => { pas(); dessin(); if (SE.anim.conv) stopT(); }, 650);
      });
      panel.querySelectorAll("[data-ci]").forEach((s) => s.addEventListener("input", () => { SE.client[+s.dataset.ci] = +s.value; nouveau(); }));
      // k-means++ (aléatoire) puis Lloyd pas à pas : affectation, puis recalcul des centroïdes
      function initAnim() {
        const k = SE.k, C = [X[Math.floor(Math.random() * N)].slice()];
        while (C.length < k) {
          const d = X.map((x) => Math.min(...C.map((c) => core.d2(x, c)))), s = d.reduce((a, b) => a + b, 0);
          let r = Math.random() * s, i = 0; while (r > d[i] && i < N - 1) { r -= d[i]; i++; } C.push(X[i].slice());
        }
        SE.anim = { k, C, lab: null, it: 0, phase: 0, conv: false };
      }
      function pas() {
        const A = SE.anim; if (!A || A.conv) return;
        if (A.phase === 0) {
          const lab = X.map((x) => { let b = 0, bd = Infinity; A.C.forEach((c, j) => { const d = core.d2(x, c); if (d < bd) { bd = d; b = j; } }); return b; });
          if (A.lab && lab.every((l, i) => l === A.lab[i])) { A.conv = true; return; }
          A.lab = lab; A.it++; A.phase = 1;
        } else { A.C = core.centroids(X, A.lab, A.k); A.phase = 0; }
      }
      const etat = () => {
        if (SE.mode === 0) {
          const lab = M.labels[SE.k];
          return { lab, C: core.centroids(X, lab, SE.k) };
        }
        return { lab: SE.anim.lab, C: SE.anim.C };
      };
      const orig = (c) => c.map((v, j) => v * M.scale[j] + M.mean[j]);
      function dessin() {
        const { lab, C } = etat(), v = SE.vue;
        const ax = v === 0 ? [2, 1] : [0, 1], rowv = (r) => (v === 0 ? [r[2], r[3]] : [r[0], r[3]]);
        const xr = v === 0 ? [10, 140] : [15, 72];
        const pts = M.rows.map((r, i) => { const [a, b] = rowv(r); return [a, b, lab ? PAL[lab[i] % PAL.length] : "var(--muted)", 4.2, `opacity=".85"`]; });
        const cen = C.map((c, j) => { const o = orig(c); return [v === 0 ? o[1] : o[0], o[2], j]; });
        const places = [];
        q("#e-scatter").innerHTML = chart({ w: 560, h: 380, xr, yr: [0, 100], points: pts, xlab: v === 0 ? T.revenu : T.ageAx, ylab: T.depense, ml: 46,
          marks: () => "" }).replace("</svg>", cen.map(([a, b, j]) => {
          const XX = 46 + (a - xr[0]) / (xr[1] - xr[0]) * (560 - 46 - 14), YY = 12 + (1 - b / 100) * (380 - 12 - 34);
          const proche = places.some(([x, y]) => Math.abs(x - XX) < 34 && Math.abs(y - YY) < 18); places.push([XX, YY]);
          return `<g transform="translate(${XX.toFixed(1)},${YY.toFixed(1)})"><path d="M-7,-7L7,7M7,-7L-7,7" stroke="var(--surface)" stroke-width="6"/><path d="M-7,-7L7,7M7,-7L-7,7" stroke="${PAL[j % PAL.length]}" stroke-width="3"/>${SE.mode === 0 && SE.k === 6 ? `<text x="${proche ? 9 : -9}" y="${proche ? 18 : -8}" text-anchor="${proche ? "start" : "end"}" class="ds-lab" font-weight="700" paint-order="stroke" stroke="var(--surface)" stroke-width="3">C${j}</text>` : ""}</g>`;
        }).join("") + "</svg>");
        const cnt = new Array(SE.k).fill(0); if (lab) lab.forEach((l) => cnt[l]++);
        q("#e-leg").innerHTML = C.map((_, j) => `<span><i style="background:${PAL[j % PAL.length]};border-radius:50%"></i>${SE.mode === 0 && SE.k === 6 ? T.seg[j][0] : "C" + j} · <b>${cnt[j]}</b></span>`).join("");
        if (SE.mode === 1) {
          const A = SE.anim, it = A.lab ? core.inertia(X, A.lab, A.C) : null;
          q("#e-etat").textContent = A.lab ? `${T.iter} ${A.it} · ${T.inertie} ${nb(it, 1)}${A.conv ? ` · ${T.conv} · silhouette ${nb(core.silhouette(X, A.lab, A.k), 3)}` : ""}` : (lang === "fr" ? "Centroïdes initiaux (k-means++) : cliquez sur Étape suivante." : "Initial centroids (k-means++): click Next step.");
        }
      }
      function courbes() {
        const ks = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        const hiIdx = ks.indexOf(SE.k);
        q("#e-elbow").innerHTML = chart({ w: 400, h: 170, xr: [2, 10], yr: [100, 560], xt: ks, yt: [100, 300, 500], series: [{ pts: ks.map((k) => [k, M.inertia[k]]), color: "var(--data)", dots: true, hi: hiIdx }], fx: (v) => v, fy: (v) => nb(v), ml: 40 });
        q("#e-sil").innerHTML = chart({ w: 400, h: 170, xr: [2, 10], yr: [0.3, 0.44], xt: ks, yt: [0.3, 0.35, 0.4], series: [{ pts: ks.map((k) => [k, M.sil[k]]), color: "#E8590C", dots: true, hi: hiIdx }], fx: (v) => v, fy: (v) => nb(v, 2), ml: 40 });
      }
      function segments() {
        const el = q("#e-segs");
        if (SE.k !== 6 || SE.mode !== 0) { el.hidden = true; return; }
        el.hidden = false;
        const lab = M.labels[6];
        el.innerHTML = `<h5>${T.segT}</h5><div class="im-segs">${T.seg.map(([nm, act], j) => {
          const idx = lab.map((l, i) => (l === j ? i : -1)).filter((i) => i >= 0), m = (f) => idx.reduce((s, i) => s + f(M.rows[i]), 0) / idx.length;
          const fem = idx.filter((i) => M.rows[i][1] === "F").length / idx.length;
          return `<div class="im-seg" style="--c:${PAL[j]}"><b>C${j} · ${esc(nm)}</b><span>${idx.length} ${T.taille} · ${nb(m((r) => r[0]), 0)} ${lang === "fr" ? "ans" : "y/o"} · ${nb(m((r) => r[2]), 0)} k$ · score ${nb(m((r) => r[3]), 0)} · ${nb(fem * 100, 0)} % ${T.femmes}</span><em>${T.cible[j]}</em><p>${esc(act)}</p></div>`;
        }).join("")}</div>`;
      }
      function nouveau() {
        panel.querySelectorAll("[data-c]").forEach((b) => { b.textContent = SE.client[+b.dataset.c]; });
        const [a, inc, sc] = SE.client, x = core.mallX(M, [a, "", inc, sc]);
        let b = 0, bd = Infinity; M.c6.forEach((c, j) => { const d = core.d2(x, c); if (d < bd) { bd = d; b = j; } });
        q("#e-new").innerHTML = `<b style="color:${PAL[b]}">C${b} · ${esc(T.seg[b][0])}</b> — ${esc(T.seg[b][1])} <span class="ds-small">(${lang === "fr" ? "ratio dépense / revenu" : "spending / income ratio"} ${nb(sc / inc, 2)})</span>`;
      }
      function tout() { q("#e-anim").hidden = SE.mode !== 1; dessin(); courbes(); segments(); }
      if (SE.mode === 1 && (!SE.anim || SE.anim.k !== SE.k)) initAnim();
      tout(); nouveau();
    }

    afficher();
    return { destroy() { detruit = true; nettoyage.forEach((f) => f()); nettoyage = []; root.innerHTML = ""; } };
  }

  window.IntroML = { mount, _core: core };
})();
