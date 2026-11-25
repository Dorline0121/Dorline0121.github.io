/* =========================================================
   Data Science with Python — labs (ECE ING4)
   ---------------------------------------------------------
   4 onglets :
   1. Varsovie · DALEX : les 3 modèles du TP (régression linéaire,
      arbre profondeur 10, Random Forest 300 arbres) exportés depuis
      scikit-learn et exécutés ici à l'identique ; Break Down calculé
      avec l'algorithme de DALEX sur les 9 000 appartements test ;
      « et si ? » (ceteris paribus) ; importance et profil de l'année
      calculés avec dalex.
   2. Neurone vs MLP : un réseau entraîné en direct sur make_moons.
   3. MLP régularisé : courbes d'apprentissage du notebook + comparaison.
   4. Scoring de crédit : biais / variance selon la profondeur, tableau final.
   ========================================================= */
(function () {
  const VARS = ["district", "construction_year", "surface", "floor", "no_rooms"];
  const COUL = { lin: "#2F9E44", tree: "#D9480F", rf: "#1C7ED6" };

  const TXT = {
    fr: {
      tabs: ["Varsovie · DALEX", "Neurone vs MLP", "MLP régularisé", "Scoring de crédit"],
      loading: "Chargement des modèles…", fail: "Impossible de charger les modèles.",
      noms: { lin: "Régression linéaire", tree: "Arbre de décision", rf: "Random Forest" },
      vlab: { district: "Quartier", construction_year: "Année de construction", surface: "Surface (m²)", floor: "Étage", no_rooms: "Pièces" },
      leadA: "Les 3 modèles du TP tournent ici à l'identique (mêmes prédictions que dans le notebook). Changez l'appartement : les estimations et les explications DALEX se recalculent.",
      client: "Client du TP", hasard: "Appartement test au hasard", libre: "Appartement libre",
      estime: "Prix estimé", reel: "Prix réel", ecart: "écart", parM2: "zł/m²",
      bd: "Pourquoi ce prix ? (Break Down)", bdLead: "Part de chaque information dans l'estimation, calculée comme DALEX sur les 9 000 appartements test.",
      calcul: "Calcul…", moyenne: "Moyenne des prédictions", prediction: "Prédiction",
      wi: "Et si… ? (Ceteris Paribus)", wiLead: "On fait varier une seule information de cet appartement, les autres restent fixes.",
      imp: "Ce qui compte le plus pour chaque modèle", impLead: "Hausse de l'erreur (RMSE) quand on mélange l'information au hasard (model_parts, DALEX).",
      prof: "Effet de l'année de construction", profLead: "Profil moyen (model_profile, DALEX). Les arbres retrouvent le U des prix réels ; la droite de la régression linéaire ne le voit pas.",
      perf: "Performance sur les 9 000 appartements test",
      modele: "Modèle", mae: "Erreur moyenne (MAE)", rmse: "RMSE", r2: "R²",
      leadB: "Un neurone seul ne trace qu'une droite ; des couches cachées permettent une frontière courbe. Choisissez une architecture et entraînez-la en direct sur les « deux lunes » (1 000 points, bruit 0,2, 70 % entraînement).",
      archi: "Architecture", entrainer: "Entraîner", pause: "Pause", reinit: "Réinitialiser",
      params: "paramètres", epoque: "époque", perte: "perte", accTrain: "précision entraînement", accTest: "précision test",
      noteB: "Réseau réentraîné ici dans le navigateur (Adam) : les chiffres peuvent varier légèrement d'un entraînement à l'autre. Dans le rapport : 0,84 pour un neurone, 0,95 pour (16, 16), 0,96 pour (64, 64).",
      neurone: "1 neurone",
      leadC: "Même problème (prix au m² à Varsovie) avec un réseau Keras 14 → 64 → 32 → 1 (3 073 paramètres). Sans régularisation, il surapprend après l'époque 33 ; avec dropout 0,2 et early stopping, les courbes ne divergent plus.",
      sansReg: "Sans régularisation : la validation remonte après l'époque 33", avecReg: "Dropout 0,2 + early stopping : arrêt à l'époque 224, meilleure époque 204",
      compC: "Comparaison sur les 9 000 appartements test (erreur moyenne, zł/m²)",
      leadD: "German Credit (1 000 clients, 30 % de mauvais payeurs). Faites varier la profondeur de l'arbre : le score d'entraînement monte toujours, celui de test redescend. C'est le surapprentissage.",
      jeu: "Jeu de données", credit: "Crédit (AUC)", appart: "Appartements (erreur zł/m²)", profondeur: "Profondeur", sansLimite: "sans limite",
      train: "Entraînement", test: "Test", ecartTT: "Écart",
      tabD: "Tableau final (validation croisée à 5 plis, trié par F1)", choix: "Modèle retenu : régression logistique équilibrée",
      choixTxt: "Meilleur recall (72 % des mauvais payeurs détectés) et meilleur F1, l'écart train-test le plus faible (0,053), et des coefficients lisibles pour justifier une décision. À utiliser pour signaler les dossiers à vérifier, pas pour refuser automatiquement (precision 0,524).",
      regles: "Règles lues dans l'arbre (profondeur 4)",
      reglesL: ["Client avec un compte courant : 41,9 % de mauvais payeurs (11,7 % sans compte courant)", "… et un crédit de plus de 22,5 mois : 53,7 %", "… et moins de 100 € d'épargne : 61,9 %", "Profil le plus sûr : pas de compte courant, pas d'autre crédit, plus de 30,5 ans : 8,2 %"],
    },
    en: {
      tabs: ["Warsaw · DALEX", "Neuron vs MLP", "Regularised MLP", "Credit scoring"],
      loading: "Loading the models…", fail: "The models could not be loaded.",
      noms: { lin: "Linear regression", tree: "Decision tree", rf: "Random Forest" },
      vlab: { district: "District", construction_year: "Construction year", surface: "Surface (m²)", floor: "Floor", no_rooms: "Rooms" },
      leadA: "The lab's 3 models run here identically (same predictions as in the notebook). Change the apartment: the estimates and the DALEX explanations recalculate.",
      client: "Lab client", hasard: "Random test apartment", libre: "Custom apartment",
      estime: "Estimated price", reel: "Actual price", ecart: "gap", parM2: "zł/m²",
      bd: "Why this price? (Break Down)", bdLead: "Contribution of each feature to the estimate, computed like DALEX on the 9,000 test apartments.",
      calcul: "Computing…", moyenne: "Mean prediction", prediction: "Prediction",
      wi: "What if…? (Ceteris Paribus)", wiLead: "One feature of this apartment changes, the others stay fixed.",
      imp: "What matters most to each model", impLead: "Increase in error (RMSE) when the feature is shuffled at random (model_parts, DALEX).",
      prof: "Effect of the construction year", profLead: "Average profile (model_profile, DALEX). The trees find the U shape of real prices; the linear regression's straight line misses it.",
      perf: "Performance on the 9,000 test apartments",
      modele: "Model", mae: "Mean error (MAE)", rmse: "RMSE", r2: "R²",
      leadB: "A single neuron can only draw a straight line; hidden layers allow a curved boundary. Pick an architecture and train it live on the “two moons” (1,000 points, noise 0.2, 70% training).",
      archi: "Architecture", entrainer: "Train", pause: "Pause", reinit: "Reset",
      params: "parameters", epoque: "epoch", perte: "loss", accTrain: "train accuracy", accTest: "test accuracy",
      noteB: "Network retrained here in the browser (Adam): figures may vary slightly between runs. In the report: 0.84 for one neuron, 0.95 for (16, 16), 0.96 for (64, 64).",
      neurone: "1 neuron",
      leadC: "Same problem (price per m² in Warsaw) with a Keras network 14 → 64 → 32 → 1 (3,073 parameters). Without regularisation it overfits after epoch 33; with dropout 0.2 and early stopping, the curves no longer diverge.",
      sansReg: "No regularisation: validation loss rises after epoch 33", avecReg: "Dropout 0.2 + early stopping: stopped at epoch 224, best epoch 204",
      compC: "Comparison on the 9,000 test apartments (mean error, zł/m²)",
      leadD: "German Credit (1,000 clients, 30% bad payers). Change the tree depth: the training score keeps rising while the test score falls. That is overfitting.",
      jeu: "Dataset", credit: "Credit (AUC)", appart: "Apartments (error zł/m²)", profondeur: "Depth", sansLimite: "no limit",
      train: "Training", test: "Test", ecartTT: "Gap",
      tabD: "Final table (5-fold cross-validation, sorted by F1)", choix: "Chosen model: balanced logistic regression",
      choixTxt: "Best recall (72% of bad payers detected) and best F1, the smallest train-test gap (0.053), and readable coefficients to justify a decision. To be used to flag files for review, not to refuse automatically (precision 0.524).",
      regles: "Rules read from the tree (depth 4)",
      reglesL: ["Client with a checking account: 41.9% bad payers (11.7% without one)", "… and a loan over 22.5 months: 53.7%", "… and savings under €100: 61.9%", "Safest profile: no checking account, no other loan, over 30.5 years old: 8.2%"],
    },
  };

  const PERF = [["lin", 263, 283, 0.901], ["tree", 179, 250, 0.923], ["rf", 101, 154, 0.971]];
  const MLPCOMP = [["Linear regression", "Régression linéaire", 263], ["Decision tree", "Arbre de décision", 179], ["Random Forest", "Random Forest", 101], ["MLP, no regularisation", "MLP sans régularisation", 152], ["MLP + dropout + early stopping", "MLP + dropout + early stopping", 95]];
  const PROF_CREDIT = [[2, 0.725, 0.711], [3, 0.764, 0.694], [4, 0.809, 0.702], [5, 0.854, 0.668], [6, 0.894, 0.670], [8, 0.957, 0.650], [10, 0.987, 0.647], [null, 1.0, 0.615]];
  const PROF_APPART = [[3, 448, 464], [5, 339, 375], [7, 209, 277], [9, 99, 195], [10, 62, 179], [12, 23, 159], [15, 3, 147], [null, 0, 150]];
  const CREDIT = [
    ["Régression logistique (équilibrée)", "Logistic regression (balanced)", 0.524, 0.720, 0.606, 0.786, 0.053],
    ["Random Forest (équilibrée)", "Random Forest (balanced)", 0.549, 0.630, 0.586, 0.790, 0.171],
    ["XGBoost", "XGBoost", 0.645, 0.470, 0.544, 0.791, 0.178],
    ["Régression logistique", "Logistic regression", 0.605, 0.463, 0.525, 0.786, 0.052],
    ["Random Forest", "Random Forest", 0.714, 0.370, 0.487, 0.787, 0.213],
    ["Arbre (sans limite)", "Tree (no limit)", 0.450, 0.483, 0.464, 0.615, 0.385],
    ["Arbre (profondeur 4)", "Tree (depth 4)", 0.502, 0.407, 0.445, 0.702, 0.107],
  ];

  /* ---------- chargement : données + arbres binaires ---------- */
  let charge = null;
  function charger() {
    if (charge) return charge;
    const script = new Promise((ok, ko) => {
      if (window.VARSOVIE_DATA) return ok();
      const s = document.createElement("script"); s.src = "assets/varsovie-data.js";
      s.onload = ok; s.onerror = ko; document.head.appendChild(s);
    });
    // les arbres sont stockés en base64 dans des fichiers .js (lisibles partout, même sans serveur)
    const bin = (f, nom) => new Promise((ok, ko) => {
      const fin = () => { const b64 = window[nom], o = atob(b64), u = new Uint8Array(o.length); for (let i = 0; i < o.length; i++) u[i] = o.charCodeAt(i); ok(decoder(u.buffer)); };
      if (window[nom]) return fin();
      const s = document.createElement("script"); s.src = f; s.onload = fin; s.onerror = ko; document.head.appendChild(s);
    });
    charge = Promise.all([script, bin("assets/varsovie-tree.js", "VARSOVIE_TREE"), bin("assets/varsovie-rf.js", "VARSOVIE_RF")])
      .then(([, tree, rf]) => ({ D: window.VARSOVIE_DATA, tree, rf }))
      .catch((e) => { charge = null; throw e; });
    return charge;
  }
  // format : nb d'arbres, tailles, puis par noeud int8 variable (-1 = feuille) ;
  // noeud interne : int16 2×seuil + uint16 enfant droit (l'enfant gauche est le noeud suivant) ; feuille : int32 valeur×100
  function decoder(buf) {
    const v = new DataView(buf); const n = v.getUint32(0, true); const arbres = [];
    let off = 4 + 4 * n;
    for (let k = 0; k < n; k++) {
      const len = v.getUint32(4 + 4 * k, true), nb = len / 5;
      const f = new Int8Array(nb), x = new Float64Array(nb), r = new Uint16Array(nb);
      for (let i = 0, o = off; i < nb; i++, o += 5) {
        f[i] = v.getInt8(o);
        if (f[i] === -1) x[i] = v.getInt32(o + 1, true) / 100;
        else { x[i] = v.getInt16(o + 1, true) / 2; r[i] = v.getUint16(o + 3, true); }
      }
      arbres.push({ f, x, r }); off += len;
    }
    return arbres;
  }

  function mount(root, lang) {
    const T = TXT[lang] || TXT.fr, fr = lang !== "en", loc = fr ? "fr-FR" : "en-US";
    const nb = (v, d = 0) => v.toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d });
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    let onglet = 0, nettoyage = [];
    const stopAll = () => { nettoyage.forEach((f) => f()); nettoyage = []; };

    root.innerHTML = `<div class="ds-tabs" role="tablist">${T.tabs.map((t, i) => `<button type="button" role="tab" class="ds-tab" data-tab="${i}">${t}</button>`).join("")}</div><div class="ds-panel"></div>`;
    const panel = root.querySelector(".ds-panel");
    root.querySelector(".ds-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) { onglet = +b.dataset.tab; afficher(); } });
    function afficher() {
      stopAll();
      root.querySelectorAll(".ds-tab").forEach((b) => b.setAttribute("aria-selected", +b.dataset.tab === onglet));
      [ongletA, ongletB, ongletC, ongletD][onglet]();
    }

    /* =================== 1. Varsovie · DALEX =================== */
    function ongletA() {
      panel.innerHTML = `<p class="ds-loading">${T.loading}</p>`;
      charger().then((M) => construireA(M), () => (panel.innerHTML = `<p class="ds-loading">${T.fail}</p>`));
    }
    function construireA({ D, tree, rf }) {
      const ND = D.districts.length;
      // vecteur sklearn : 10 colonnes quartier (0/1) puis année, surface, étage, pièces
      const vec = (a) => { const v = new Float64Array(14); v[a[0]] = 1; v[10] = a[1]; v[11] = a[2]; v[12] = a[3]; v[13] = a[4]; return v; };
      const predArbres = (arbres, v) => { let s = 0; for (const t of arbres) { let i = 0; while (t.f[i] !== -1) i = v[t.f[i]] <= t.x[i] ? i + 1 : t.r[i]; s += t.x[i]; } return s / arbres.length; };
      const MOD = {
        lin: (v) => { let s = D.lin.intercept; for (let i = 0; i < 14; i++) s += D.lin.coef[i] * v[i]; return s; },
        tree: (v) => predArbres(tree, v),
        rf: (v) => predArbres(rf, v),
      };
      const c = D.client;
      const S = { app: [D.districts.indexOf(c.district), c.construction_year, c.surface, c.floor, c.no_rooms], reel: c.prix_reel, src: "client", modele: "rf", wiVar: "construction_year", bdJeton: 0 };

      panel.innerHTML = `
        <p class="ds-lead">${T.leadA}</p>
        <div class="ds-appart">
          <div class="ds-presets">
            <button type="button" class="btn btn-small" data-preset="client">${T.client}</button>
            <button type="button" class="btn btn-small" data-preset="hasard">${T.hasard}</button>
          </div>
          <div class="ds-inputs">
            <label>${T.vlab.district}<select id="ds-d">${D.districts.map((d, i) => `<option value="${i}">${d}</option>`).join("")}</select></label>
            <label>${T.vlab.surface} <b id="ds-v2"></b><input id="ds-s" type="range" min="20" max="150" step="1"></label>
            <label>${T.vlab.construction_year} <b id="ds-v1"></b><input id="ds-y" type="range" min="1920" max="2010" step="1"></label>
            <label>${T.vlab.floor} <b id="ds-v3"></b><input id="ds-f" type="range" min="1" max="10" step="1"></label>
            <label>${T.vlab.no_rooms} <b id="ds-v4"></b><input id="ds-r" type="range" min="1" max="6" step="1"></label>
          </div>
        </div>
        <div class="ds-preds" id="ds-preds"></div>
        <div class="ds-two">
          <section class="ds-box"><h5>${T.bd}</h5><p class="ds-small">${T.bdLead}</p>
            <div class="ds-pills" id="ds-mods">${["lin", "tree", "rf"].map((m) => `<button type="button" class="ds-pill" data-mod="${m}"><i style="background:${COUL[m]}"></i>${T.noms[m]}</button>`).join("")}</div>
            <div id="ds-bd"></div></section>
          <section class="ds-box"><h5>${T.wi}</h5><p class="ds-small">${T.wiLead}</p>
            <div class="ds-pills" id="ds-wiv">${VARS.map((v) => `<button type="button" class="ds-pill" data-wv="${v}">${T.vlab[v]}</button>`).join("")}</div>
            <div id="ds-wi"></div></section>
        </div>
        <div class="ds-two">
          <section class="ds-box"><h5>${T.imp}</h5><p class="ds-small">${T.impLead}</p><div id="ds-imp"></div></section>
          <section class="ds-box"><h5>${T.prof}</h5><p class="ds-small">${T.profLead}</p><div id="ds-prof"></div></section>
        </div>
        <section class="ds-box"><h5>${T.perf}</h5>
          <div class="ds-tablewrap"><table class="ds-table"><thead><tr><th>${T.modele}</th><th>${T.mae}</th><th>${T.rmse}</th><th>${T.r2}</th></tr></thead>
          <tbody>${PERF.map(([m, a, b, r]) => `<tr><th scope="row"><i style="background:${COUL[m]}"></i>${T.noms[m]}</th><td>${a} ${T.parM2}</td><td>${b}</td><td>${nb(r, 3)}</td></tr>`).join("")}</tbody></table></div></section>`;

      const q = (s) => panel.querySelector(s);
      const champs = { d: q("#ds-d"), y: q("#ds-y"), s: q("#ds-s"), f: q("#ds-f"), r: q("#ds-r") };
      function versChamps() { champs.d.value = S.app[0]; champs.y.value = S.app[1]; champs.s.value = S.app[2]; champs.f.value = S.app[3]; champs.r.value = S.app[4]; }
      function depuisChamps() { S.app = [+champs.d.value, +champs.y.value, +champs.s.value, +champs.f.value, +champs.r.value]; S.src = "libre"; S.reel = null; }
      Object.values(champs).forEach((el) => el.addEventListener("input", () => { depuisChamps(); majTout(); }));
      panel.addEventListener("click", (e) => {
        const p = e.target.closest("[data-preset]"), m = e.target.closest("[data-mod]"), w = e.target.closest("[data-wv]");
        if (p) {
          if (p.dataset.preset === "client") { S.app = [D.districts.indexOf(c.district), c.construction_year, c.surface, c.floor, c.no_rooms]; S.reel = c.prix_reel; S.src = "client"; }
          else { const i = Math.floor(Math.random() * D.ref.length); S.app = D.ref[i].slice(); S.reel = D.y[i]; S.src = "test"; }
          versChamps(); majTout();
        } else if (m) { S.modele = m.dataset.mod; majPills(); breakDown(); }
        else if (w) { S.wiVar = w.dataset.wv; majPills(); etSi(); }
      });
      function majPills() {
        panel.querySelectorAll("[data-mod]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.mod === S.modele));
        panel.querySelectorAll("[data-wv]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.wv === S.wiVar));
        panel.querySelectorAll("[data-preset]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.preset === S.src));
      }
      let attente = null;
      function majTout() {
        q("#ds-v1").textContent = S.app[1]; q("#ds-v2").textContent = S.app[2] + " m²"; q("#ds-v3").textContent = S.app[3]; q("#ds-v4").textContent = S.app[4];
        const v = vec(S.app);
        q("#ds-preds").innerHTML = ["lin", "tree", "rf"].map((m) => {
          const p = MOD[m](v), e = S.reel != null ? p - S.reel : null;
          return `<div class="ds-pred" style="--c:${COUL[m]}"><span>${T.noms[m]}</span><b>${nb(p)}</b><small>${T.parM2}${e != null ? ` · ${T.ecart} ${e > 0 ? "+" : ""}${nb(e)}` : ""}</small></div>`;
        }).join("") + (S.reel != null ? `<div class="ds-pred ds-reel"><span>${T.reel}</span><b>${nb(S.reel)}</b><small>${T.parM2}</small></div>` : "");
        majPills(); etSi();
        clearTimeout(attente); attente = setTimeout(breakDown, 120); // attend la fin du glissement du curseur
      }

      /* ----- Break Down : même algorithme que dalex (type "break_down", ordre par diff décroissante) ----- */
      const N = D.ref.length, base = D.ref.map(vec);
      const moyennes = {};
      function moyenne(m, fixe) {
        const f = MOD[m], v = new Float64Array(14); let s = 0;
        for (let k = 0; k < N; k++) {
          v.set(base[k]);
          for (const j of fixe) {
            if (j === 0) { for (let d = 0; d < ND; d++) v[d] = 0; v[S.app[0]] = 1; }
            else v[9 + j] = S.app[j];
          }
          s += f(v);
        }
        return s / N;
      }
      function breakDown() {
        const jeton = ++S.bdJeton, m = S.modele;
        q("#ds-bd").innerHTML = `<p class="ds-small">${T.calcul}</p>`;
        setTimeout(() => {
          if (jeton !== S.bdJeton) return;
          if (moyennes[m] == null) moyennes[m] = moyenne(m, []);
          const b0 = moyennes[m];
          const diff = [0, 1, 2, 3, 4].map((j) => moyenne(m, [j]) - b0);
          const ordre = [0, 1, 2, 3, 4].sort((a, b) => diff[b] - diff[a]);
          // même chemin que dalex ; on réutilise la 1re moyenne déjà calculée, et quand
          // toutes les variables sont fixées la moyenne est simplement la prédiction de l'appartement
          const etapes = []; let prec = b0; const fixe = [];
          ordre.forEach((j, k) => {
            fixe.push(j);
            const mo = k === 0 ? b0 + diff[j] : k === ordre.length - 1 ? MOD[m](vec(S.app)) : moyenne(m, fixe);
            etapes.push([j, mo - prec]); prec = mo;
          });
          if (jeton !== S.bdJeton) return;
          q("#ds-bd").innerHTML = cascade(b0, etapes, prec);
        }, 30);
      }
      function valeur(j) { return j === 0 ? D.districts[S.app[0]] : S.app[j]; }
      function cascade(b0, etapes, fin) {
        const W = 520, rowH = 30, L = 210, R = 70, H = (etapes.length + 2) * rowH + 30;
        const pts = [b0, fin]; let acc = b0; etapes.forEach(([, c]) => { acc += c; pts.push(acc); });
        const lo = Math.min(...pts) - 150, hi = Math.max(...pts) + 150;
        const X = (v) => L + ((v - lo) / (hi - lo)) * (W - L - R);
        let s = "", y = 8, cur = b0;
        const ligneTxt = (lab, val, yy) => `<text x="${L - 10}" y="${yy + 19}" text-anchor="end" class="ds-lab">${esc(lab)}</text><text x="${W - 4}" y="${yy + 19}" text-anchor="end" class="ds-val">${val}</text>`;
        s += ligneTxt(T.moyenne, nb(b0), y) + `<rect x="${X(lo + 150) - 0}" y="${y + 6}" width="0" height="0"/>`;
        s += `<line x1="${X(b0)}" x2="${X(b0)}" y1="${y + 4}" y2="${H - 26}" class="ds-ref"/>`;
        y += rowH;
        etapes.forEach(([j, c]) => {
          const x1 = X(cur), x2 = X(cur + c);
          s += ligneTxt(`${T.vlab[VARS[j]]} = ${valeur(j)}`, `${c >= 0 ? "+" : "−"}${nb(Math.abs(c))}`, y);
          s += `<rect x="${Math.min(x1, x2)}" y="${y + 6}" width="${Math.max(1.5, Math.abs(x2 - x1))}" height="${rowH - 12}" fill="${c >= 0 ? "#2F9E44" : "#E03131"}" rx="2"/>`;
          cur += c; y += rowH;
        });
        s += ligneTxt(T.prediction, nb(fin), y) + `<rect x="${Math.min(X(b0), X(fin))}" y="${y + 6}" width="${Math.abs(X(fin) - X(b0))}" height="${rowH - 12}" fill="${COUL[S.modele]}" rx="2"/>`;
        return `<svg viewBox="0 0 ${W} ${H}" class="ds-svg" role="img" aria-label="${esc(T.bd)}">${s}</svg>`;
      }

      /* ----- Et si ? (ceteris paribus) ----- */
      function etSi() {
        const j = VARS.indexOf(S.wiVar);
        const grille = j === 0 ? D.districts.map((_, i) => i) : j === 1 ? range(1920, 2010, 2) : j === 2 ? range(20, 150, 2) : j === 3 ? range(1, 10, 1) : range(1, 6, 1);
        const series = ["lin", "tree", "rf"].map((m) => ({ m, pts: grille.map((g) => { const a = S.app.slice(); a[j] = g; return [g, MOD[m](vec(a))]; }) }));
        q("#ds-wi").innerHTML = j === 0 ? barresQuartier(series) : courbes(series, T.vlab[VARS[j]], S.app[j], true);
      }
      const range = (a, b, p) => { const r = []; for (let v = a; v <= b; v += p) r.push(v); return r; };
      function courbes(series, axeX, actuel, avecPoint) {
        const W = 520, H = 250, L = 52, R = 12, Tp = 12, B = 36;
        const xs = series[0].pts.map((p) => p[0]), all = series.flatMap((s) => s.pts.map((p) => p[1]));
        const x0 = Math.min(...xs), x1 = Math.max(...xs);
        const pas = 500, y0 = Math.floor(Math.min(...all) / pas) * pas, y1 = Math.ceil(Math.max(...all) / pas) * pas;
        const X = (v) => L + ((v - x0) / (x1 - x0 || 1)) * (W - L - R), Y = (v) => H - B - ((v - y0) / (y1 - y0 || 1)) * (H - B - Tp);
        let s = "";
        for (let v = y0; v <= y1; v += pas) s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="ds-g"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${nb(v)}</text>`;
        const pasX = x1 - x0 > 60 ? 20 : x1 - x0 > 20 ? 10 : 1;
        for (let v = Math.ceil(x0 / pasX) * pasX; v <= x1; v += pasX) s += `<text x="${X(v)}" y="${H - B + 15}" text-anchor="middle">${v}</text>`;
        s += `<text x="${(L + W - R) / 2}" y="${H - 3}" text-anchor="middle" class="ds-ax">${esc(axeX)}</text>`;
        if (avecPoint) s += `<line x1="${X(actuel)}" x2="${X(actuel)}" y1="${Tp}" y2="${H - B}" class="ds-ref"/>`;
        series.forEach(({ m, pts }) => {
          s += `<path d="${pts.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1)).join("")}" fill="none" stroke="${COUL[m]}" stroke-width="2.2"/>`;
          if (avecPoint) { const p = pts.reduce((a, b) => (Math.abs(b[0] - actuel) < Math.abs(a[0] - actuel) ? b : a)); s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" fill="${COUL[m]}"/>`; }
        });
        return `<svg viewBox="0 0 ${W} ${H}" class="ds-svg" role="img">${s}</svg>${legende()}`;
      }
      function barresQuartier(series) {
        const W = 520, rowH = 22, L = 100, R = 50, H = D.districts.length * rowH + 10;
        const all = series.flatMap((s) => s.pts.map((p) => p[1])), mx = Math.max(...all);
        const X = (v) => L + (v / mx) * (W - L - R);
        let s = "";
        D.districts.forEach((d, i) => {
          const y = 4 + i * rowH, on = i === S.app[0];
          s += `<text x="${L - 8}" y="${y + 15}" text-anchor="end" class="ds-lab" ${on ? 'font-weight="700"' : ""}>${d}</text>`;
          series.forEach(({ m, pts }, k) => (s += `<rect x="${L}" y="${y + 2 + k * 6}" width="${X(pts[i][1]) - L}" height="5" fill="${COUL[m]}" opacity="${on ? 1 : 0.55}"><title>${T.noms[m]} : ${nb(pts[i][1])}</title></rect>`));
        });
        return `<svg viewBox="0 0 ${W} ${H}" class="ds-svg" role="img">${s}</svg>${legende()}`;
      }
      const legende = () => `<div class="ds-leg">${["lin", "tree", "rf"].map((m) => `<span><i style="background:${COUL[m]}"></i>${T.noms[m]}</span>`).join("")}</div>`;

      /* ----- importance et profil (calculés avec dalex) ----- */
      (function statiques() {
        const W = 520, rowH = 44, L = 150, R = 50, H = VARS.length * rowH + 6;
        const mx = Math.max(...["lin", "tree", "rf"].flatMap((m) => Object.values(D.importance[m].vars)));
        const X = (v) => L + (Math.max(0, v) / mx) * (W - L - R);
        const ordre = VARS.slice().sort((a, b) => D.importance.rf.vars[b] - D.importance.rf.vars[a]);
        let s = "";
        ordre.forEach((v, i) => {
          const y = 4 + i * rowH;
          s += `<text x="${L - 8}" y="${y + 24}" text-anchor="end" class="ds-lab">${T.vlab[v]}</text>`;
          ["lin", "tree", "rf"].forEach((m, k) => {
            const val = D.importance[m].vars[v];
            s += `<rect x="${L}" y="${y + 4 + k * 12}" width="${Math.max(1, X(val) - L)}" height="10" fill="${COUL[m]}"><title>${T.noms[m]} : +${nb(val)}</title></rect><text x="${X(val) + 4}" y="${y + 13 + k * 12}" class="ds-num">+${nb(val)}</text>`;
          });
        });
        q("#ds-imp").innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="ds-svg" role="img">${s}</svg>${legende()}`;
        q("#ds-prof").innerHTML = courbes(["lin", "tree", "rf"].map((m) => ({ m, pts: D.profil_annee[m] })), T.vlab.construction_year, 0, false);
      })();

      versChamps(); majTout();
    }

    /* =================== 2. Neurone vs MLP (make_moons) =================== */
    function ongletB() {
      const ARCHIS = [[[], T.neurone], [[2], "(2,)"], [[16, 16], "(16, 16)"], [[64, 64], "(64, 64)"]];
      const S = { a: 2, net: null, ep: 0, joue: false, pertes: [] };
      panel.innerHTML = `
        <p class="ds-lead">${T.leadB}</p>
        <div class="ds-ctrl"><span class="ds-small">${T.archi}</span>
          <div class="ds-pills">${ARCHIS.map(([, n], i) => `<button type="button" class="ds-pill" data-a="${i}">${n}</button>`).join("")}</div>
          <button type="button" class="btn btn-small btn-primary" id="ds-go">${T.entrainer}</button>
          <button type="button" class="btn btn-small" id="ds-reset">${T.reinit}</button></div>
        <div class="ds-two">
          <div class="ds-box"><canvas id="ds-cv" width="460" height="320" class="ds-canvas" role="img" aria-label="Frontière de décision"></canvas></div>
          <div class="ds-box"><div class="ds-kpis" id="ds-k"></div><div id="ds-loss"></div><p class="ds-small">${T.noteB}</p></div>
        </div>`;
      const q = (s) => panel.querySelector(s);
      // make_moons (même construction que scikit-learn), bruit 0,2, graine fixe
      let graine = 7; const rnd = () => { graine = (graine * 1664525 + 1013904223) >>> 0; return graine / 4294967296; };
      const gauss = () => { const u = rnd() || 1e-9, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
      const pts = [];
      for (let i = 0; i < 500; i++) { const t = (Math.PI * i) / 499; pts.push([Math.cos(t) + 0.2 * gauss(), Math.sin(t) + 0.2 * gauss(), 0]); pts.push([1 - Math.cos(t) + 0.2 * gauss(), 1 - Math.sin(t) - 0.5 + 0.2 * gauss(), 1]); }
      for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
      const trainP = pts.slice(0, 700), testP = pts.slice(700);

      function creer(couches) {
        const tailles = [2, ...couches, 1], W = [], B = [], mW = [], vW = [], mB = [], vB = [];
        let g = 11; const r = () => { g = (g * 1103515245 + 12345) >>> 0; return g / 4294967296; };
        for (let l = 0; l < tailles.length - 1; l++) {
          const a = tailles[l], b = tailles[l + 1], lim = Math.sqrt(6 / (a + b));
          W.push(Array.from({ length: a * b }, () => (r() * 2 - 1) * lim)); B.push(new Array(b).fill(0));
          mW.push(new Array(a * b).fill(0)); vW.push(new Array(a * b).fill(0)); mB.push(new Array(b).fill(0)); vB.push(new Array(b).fill(0));
        }
        return { tailles, W, B, mW, vW, mB, vB, t: 0, nParams: W.reduce((s, w) => s + w.length, 0) + B.reduce((s, b) => s + b.length, 0) };
      }
      function avant(net, x) {
        const acts = [x];
        for (let l = 0; l < net.W.length; l++) {
          const a = acts[l], nin = net.tailles[l], nout = net.tailles[l + 1], z = new Array(nout);
          for (let j = 0; j < nout; j++) { let s = net.B[l][j]; for (let i = 0; i < nin; i++) s += a[i] * net.W[l][i * nout + j]; z[j] = l === net.W.length - 1 ? 1 / (1 + Math.exp(-s)) : Math.max(0, s); }
          acts.push(z);
        }
        return acts;
      }
      function epoque(net, lr = 0.01, lot = 32) {
        const idx = trainP.map((_, i) => i).sort(() => Math.random() - 0.5); let perte = 0;
        for (let d = 0; d < idx.length; d += lot) {
          const gW = net.W.map((w) => new Array(w.length).fill(0)), gB = net.B.map((b) => new Array(b.length).fill(0));
          const batch = idx.slice(d, d + lot);
          for (const k of batch) {
            const [x0, x1, y] = trainP[k], acts = avant(net, [x0, x1]), p = acts[acts.length - 1][0];
            perte += -(y * Math.log(p + 1e-9) + (1 - y) * Math.log(1 - p + 1e-9));
            let delta = [p - y];
            for (let l = net.W.length - 1; l >= 0; l--) {
              const a = acts[l], nin = net.tailles[l], nout = net.tailles[l + 1], prev = new Array(nin).fill(0);
              for (let i = 0; i < nin; i++) for (let j = 0; j < nout; j++) { gW[l][i * nout + j] += a[i] * delta[j]; prev[i] += net.W[l][i * nout + j] * delta[j]; }
              for (let j = 0; j < nout; j++) gB[l][j] += delta[j];
              if (l > 0) delta = prev.map((v, i) => (a[i] > 0 ? v : 0));
            }
          }
          net.t++; const b1 = 0.9, b2 = 0.999, n = batch.length;
          const maj = (P, G, M, V) => { for (let i = 0; i < P.length; i++) { const g = G[i] / n; M[i] = b1 * M[i] + (1 - b1) * g; V[i] = b2 * V[i] + (1 - b2) * g * g; P[i] -= (lr * (M[i] / (1 - b1 ** net.t))) / (Math.sqrt(V[i] / (1 - b2 ** net.t)) + 1e-8); } };
          for (let l = 0; l < net.W.length; l++) { maj(net.W[l], gW[l], net.mW[l], net.vW[l]); maj(net.B[l], gB[l], net.mB[l], net.vB[l]); }
        }
        return perte / trainP.length;
      }
      const acc = (net, P) => P.filter(([a, b, y]) => (avant(net, [a, b]).pop()[0] > 0.5 ? 1 : 0) === y).length / P.length;
      const cv = q("#ds-cv"), ctx = cv.getContext("2d");
      const xr = [-1.5, 2.5], yr = [-1.0, 1.5];
      function dessiner() {
        const Wd = cv.width, Hd = cv.height, n = 70, cw = Wd / n, ch = Hd / n;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const x = xr[0] + ((i + 0.5) / n) * (xr[1] - xr[0]), y = yr[1] - ((j + 0.5) / n) * (yr[1] - yr[0]);
          const p = S.net ? avant(S.net, [x, y]).pop()[0] : 0.5;
          ctx.fillStyle = `rgba(${Math.round(47 + (224 - 47) * p)},${Math.round(158 + (49 - 158) * p)},${Math.round(68 + (49 - 68) * p)},${0.12 + Math.abs(p - 0.5) * 0.35})`;
          ctx.fillRect(i * cw, j * ch, cw + 1, ch + 1);
        }
        for (const [x, y, c] of testP) {
          ctx.beginPath(); ctx.arc(((x - xr[0]) / (xr[1] - xr[0])) * Wd, ((yr[1] - y) / (yr[1] - yr[0])) * Hd, 3.2, 0, 7);
          ctx.fillStyle = c ? "#E03131" : "#2F9E44"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
      function kpis() {
        const n = S.net, at = n ? acc(n, trainP) : 0, ae = n ? acc(n, testP) : 0;
        q("#ds-k").innerHTML = [[n ? n.nParams : "—", T.params], [S.ep, T.epoque], [S.pertes.length ? nb(S.pertes[S.pertes.length - 1], 3) : "—", T.perte], [n && S.ep ? nb(at, 2) : "—", T.accTrain], [n && S.ep ? nb(ae, 2) : "—", T.accTest]]
          .map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("");
        const W = 420, H = 140, L = 34, R = 8, Tp = 8, B = 20, pl = S.pertes, mx = Math.max(0.8, ...pl);
        const X = (i) => L + (i / Math.max(1, 200)) * (W - L - R), Y = (v) => H - B - (v / mx) * (H - B - Tp);
        let s = `<line x1="${L}" x2="${W - R}" y1="${Y(0)}" y2="${Y(0)}" class="ds-g"/><text x="${L - 4}" y="${Y(0) + 4}" text-anchor="end">0</text><text x="${L - 4}" y="${Y(mx) + 8}" text-anchor="end">${nb(mx, 1)}</text><text x="${W - R}" y="${H - 4}" text-anchor="end">${T.epoque}s</text>`;
        if (pl.length) s += `<path d="${pl.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join("")}" fill="none" stroke="var(--accent)" stroke-width="2"/>`;
        q("#ds-loss").innerHTML = `<p class="ds-small">${T.perte}</p><svg viewBox="0 0 ${W} ${H}" class="ds-svg">${s}</svg>`;
      }
      let timer = null;
      function reinit() { clearInterval(timer); S.joue = false; S.net = creer(ARCHIS[S.a][0]); S.ep = 0; S.pertes = []; q("#ds-go").textContent = T.entrainer; majPills(); dessiner(); kpis(); }
      function majPills() { panel.querySelectorAll("[data-a]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.a === S.a)); }
      function basculer() {
        if (S.joue) { clearInterval(timer); S.joue = false; q("#ds-go").textContent = T.entrainer; return; }
        S.joue = true; q("#ds-go").textContent = T.pause;
        timer = setInterval(() => {
          for (let k = 0; k < 2 && S.ep < 200; k++) { S.pertes.push(epoque(S.net)); S.ep++; }
          dessiner(); kpis();
          if (S.ep >= 200) { clearInterval(timer); S.joue = false; q("#ds-go").textContent = T.entrainer; }
        }, 40);
      }
      panel.addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (b) { S.a = +b.dataset.a; reinit(); } });
      q("#ds-go").onclick = basculer; q("#ds-reset").onclick = reinit;
      nettoyage.push(() => clearInterval(timer));
      reinit();
    }

    /* =================== 3. MLP régularisé =================== */
    function ongletC() {
      const mx = Math.max(...MLPCOMP.map((m) => m[2]));
      panel.innerHTML = `
        <p class="ds-lead">${T.leadC}</p>
        <div class="ds-two">
          <figure class="ds-box ds-fig"><img src="assets/mlp-courbes-sans.png" alt="${T.sansReg}" loading="lazy"><figcaption>${T.sansReg}</figcaption></figure>
          <figure class="ds-box ds-fig"><img src="assets/mlp-courbes-avec.png" alt="${T.avecReg}" loading="lazy"><figcaption>${T.avecReg}</figcaption></figure>
        </div>
        <section class="ds-box"><h5>${T.compC}</h5>
          <div class="ds-bars">${MLPCOMP.map(([en, f, v], i) => `<div class="ds-bar ${i === 4 ? "best" : ""}"><span>${fr ? f : en}</span><div><i style="width:${(v / mx) * 100}%"></i></div><b>${v}</b></div>`).join("")}</div>
        </section>`;
    }

    /* =================== 4. Scoring de crédit =================== */
    function ongletD() {
      const S = { jeu: "credit", i: 2, tri: 4 };
      panel.innerHTML = `
        <p class="ds-lead">${T.leadD}</p>
        <section class="ds-box">
          <div class="ds-ctrl"><span class="ds-small">${T.jeu}</span>
            <div class="ds-pills"><button type="button" class="ds-pill" data-jeu="credit">${T.credit}</button><button type="button" class="ds-pill" data-jeu="appart">${T.appart}</button></div></div>
          <label class="ds-slider">${T.profondeur} : <b id="ds-dv"></b><input id="ds-dep" type="range" min="0" max="7" step="1" value="2"></label>
          <div id="ds-depth"></div>
        </section>
        <section class="ds-box"><h5>${T.tabD}</h5><div class="ds-tablewrap"><table class="ds-table" id="ds-cred"></table></div>
          <p class="ds-choice"><b>${T.choix}</b> ${T.choixTxt}</p></section>
        <section class="ds-box"><h5>${T.regles}</h5><ul class="m-list">${T.reglesL.map((r) => `<li>${r}</li>`).join("")}</ul></section>`;
      const q = (s) => panel.querySelector(s);
      function rendu() {
        const P = S.jeu === "credit" ? PROF_CREDIT : PROF_APPART, credit = S.jeu === "credit";
        panel.querySelectorAll("[data-jeu]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.jeu === S.jeu));
        const [d, tr, te] = P[S.i];
        q("#ds-dv").textContent = d == null ? T.sansLimite : d;
        const W = 560, H = 220, L = 50, R = 14, Tp = 12, B = 32, n = P.length;
        const vals = P.flatMap((p) => [p[1], p[2]]), y0 = credit ? 0.55 : 0, y1 = credit ? 1.02 : 500;
        const X = (i) => L + (i / (n - 1)) * (W - L - R), Y = (v) => H - B - ((v - y0) / (y1 - y0)) * (H - B - Tp);
        let s = "";
        const ticks = credit ? [0.6, 0.7, 0.8, 0.9, 1.0] : [0, 100, 200, 300, 400, 500];
        ticks.forEach((v) => (s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="ds-g"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${credit ? nb(v, 1) : v}</text>`));
        P.forEach((p, i) => (s += `<text x="${X(i)}" y="${H - B + 16}" text-anchor="middle">${p[0] == null ? "∞" : p[0]}</text>`));
        s += `<line x1="${X(S.i)}" x2="${X(S.i)}" y1="${Tp}" y2="${H - B}" class="ds-ref"/>`;
        [[1, "#868E96", T.train], [2, "var(--accent)", T.test]].forEach(([k, col]) => {
          s += `<path d="${P.map((p, i) => (i ? "L" : "M") + X(i) + " " + Y(p[k])).join("")}" fill="none" stroke="${col}" stroke-width="2.4"/>`;
          P.forEach((p, i) => (s += `<circle cx="${X(i)}" cy="${Y(p[k])}" r="${i === S.i ? 5 : 3}" fill="${col}"/>`));
        });
        const fmt = (v) => (credit ? nb(v, 3) : nb(v) + " zł/m²");
        q("#ds-depth").innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="ds-svg" role="img">${s}</svg>
          <div class="ds-leg"><span><i style="background:#868E96"></i>${T.train} : <b>${fmt(tr)}</b></span><span><i style="background:var(--accent)"></i>${T.test} : <b>${fmt(te)}</b></span><span>${T.ecartTT} : <b>${credit ? nb(tr - te, 3) : nb(te - tr) + " zł/m²"}</b></span></div>`;
        const cols = ["Precision", "Recall", "F1", "AUC", fr ? "Écart train-test" : "Train-test gap"];
        const rows = CREDIT.slice().sort((a, b) => (S.tri === 6 ? a[6] - b[6] : b[S.tri] - a[S.tri]));
        const best = (k) => (k === 6 ? Math.min(...CREDIT.map((r) => r[6])) : Math.max(...CREDIT.map((r) => r[k])));
        q("#ds-cred").innerHTML = `<thead><tr><th>${T.modele}</th>${cols.map((c, i) => `<th><button type="button" data-tri="${i + 2}">${c}${S.tri === i + 2 ? " ▾" : ""}</button></th>`).join("")}</tr></thead><tbody>` +
          rows.map((r) => `<tr><th scope="row">${fr ? r[0] : r[1]}</th>${[2, 3, 4, 5, 6].map((k) => `<td class="${r[k] === best(k) ? "best" : ""}">${nb(r[k], 3)}</td>`).join("")}</tr>`).join("") + "</tbody>";
      }
      q("#ds-dep").addEventListener("input", (e) => { S.i = +e.target.value; rendu(); });
      panel.addEventListener("click", (e) => {
        const j = e.target.closest("[data-jeu]"), t = e.target.closest("[data-tri]");
        if (j) { S.jeu = j.dataset.jeu; rendu(); }
        if (t) { S.tri = +t.dataset.tri; rendu(); }
      });
      rendu();
    }

    afficher();
    return { destroy: stopAll };
  }

  window.LabsDS = { mount };
})();
