/* =========================================================
   Aero Predict — démo interactive « Tester un moteur »
   ---------------------------------------------------------
   Reprend la page « Tester un moteur » de la démo Streamlit du
   projet, à partir des VRAIES prédictions des 6 modèles
   (assets/aero-data.js, généré avec le code du projet sur FD001).
   - les cycles arrivent un par un : à chaque cycle t, chaque
     modèle n'a vu que les mesures 1 à t ;
   - alerte si la RUL prédite est <= au seuil (30 par défaut) ;
   - la vraie RUL reste cachée jusqu'à ce qu'on la révèle ;
   - comparaison des 6 modèles sur les 100 moteurs test,
     recalculée quand on change le seuil.
   ========================================================= */
(function () {
  const MODELES = [
    { key: "reference_naive", nom: "Référence naïve", nomEn: "Naive baseline", couleur: "#B7791F" },
    { key: "random_forest", nom: "Random Forest", nomEn: "Random Forest", couleur: "#2B6CB0" },
    { key: "xgboost_phase3", nom: "XGBoost", nomEn: "XGBoost", couleur: "#38A3D6" },
    { key: "lightgbm", nom: "LightGBM", nomEn: "LightGBM", couleur: "#DD8A1A" },
    { key: "lstm", nom: "LSTM", nomEn: "LSTM", couleur: "#8E44AD" },
    { key: "cnn1d", nom: "CNN 1D", nomEn: "1D CNN", couleur: "#16A085" },
  ];
  const PLAFOND = 125;
  const VITESSES = [5, 15, 40]; // cycles par seconde

  const TXT = {
    fr: {
      loading: "Chargement des prédictions…", fail: "Impossible de charger les données de la démo.",
      kpiTitle: "Résultats présentés en soutenance (novembre 2026)",
      kpis: [
        ["11,16", "RMSE test FD001", "Ensemble de 5 LSTM · objectif < 18,91"],
        ["227,2", "Score NASA", "852,9 en septembre (÷ 3,75)"],
        ["4 / 100", "Surestimés de + 20 cycles", "9 en septembre"],
        ["0 / 100", "Alerte manquée à 30 cycles", "7 en septembre"],
        ["÷ 3,9", "Contre la baseline", "43,07 pour « toujours la moyenne »"],
        ["1 à 15 ms", "Par prédiction", "Sur CPU seul"],
      ],
      demoTitle: "Tester un moteur jamais vu",
      demoLead: "Les modèles ne voient que les vols reçus jusqu'ici ; la vraie RUL reste cachée jusqu'à ce que vous la révéliez.",
      moteur: "Moteur test", hasard: "Moteur au hasard", seuil: "Seuil d'alerte", cycles: "cycles", modeles: "Modèles",
      debut: "Début", lecture: "Lecture", pause: "Pause", vitesse: "Vitesse", reveler: "Révéler la vraie RUL", cacher: "Cacher la vraie RUL",
      cycle: "Cycle", sur: "sur", rulPred: "RUL prédite", alerte: "ALERTE", ok: "RAS", alerteDepuis: "1re alerte au cycle",
      vraie: "vraie RUL", erreur: "écart", correcte: "alerte correcte", manquee: "alerte manquée", fausse: "fausse alerte", rasOk: "pas d'alerte, correct",
      vraieRul: "RUL vraie", vraieCap: "RUL vraie plafonnée à 125 (la cible apprise)", seuilLeg: "seuil d'alerte",
      axeX: "cycle (vol) observé", axeY: "RUL (cycles restants)", aucun: "Choisissez au moins un modèle.",
      capteurs: "Ce que voient les modèles : 2 des 21 capteurs bruts", s4: "T50 · température sortie turbine BP (°R)", s11: "Ps30 · pression statique sortie compresseur HP (psia)",
      fin: "Dernier cycle reçu : en vrai, il restait", finSuite: "cycles avant la panne.",
      compTitle: "Comparer les 6 modèles sur les 100 moteurs test",
      compLead: "Erreur au dernier cycle connu de chaque moteur. Les colonnes d'alertes suivent le seuil choisi plus haut.",
      thModele: "Modèle", thRmse: "RMSE", thNasa: "Score NASA", thSur: "Surestimés > 20", thManq: "Alertes manquées", thFausse: "Fausses alertes",
      compNote: "XGBoost a été recalculé sur une autre machine que celle de l'équipe : 12,44 ici contre 12,73 en soutenance (écart connu, lié à la machine). Les 5 autres modèles retrouvent les chiffres publiés.",
      preuveTitle: "Ce que la démo prouve",
      preuves: [
        "Le modèle ne lit jamais le futur : changer les cycles après t ne change pas la prédiction en t (31 tests automatisés).",
        "Prédiction en direct = prédiction hors ligne : écart de 1,4e-14 sur les 24 couples sous-jeu × modèle.",
        "Une alerte se déclenche quand la RUL prédite passe sous le seuil ; 30 cycles reste une hypothèse de travail à valider.",
      ],
      archiTitle: "Comment le prototype est construit",
      archi: [
        ["Données", "NASA C-MAPSS, FD001 à FD004 : 26 colonnes par moteur et par cycle."],
        ["Préparation", "6 capteurs constants retirés, normalisation min-max par régime de vol, apprise sur le train seulement."],
        ["Variables", "Capteurs lissés, n° de cycle et « écart à l'état neuf » ; fenêtres de 20 à 30 cycles pour les réseaux."],
        ["Modèles", "Random Forest, XGBoost, LightGBM, LSTM et CNN 1D (PyTorch), réglés avec Optuna."],
        ["Évaluation", "Validation croisée en 5 plis par moteur, RMSE et score NASA ; le test n'est lu qu'une fois."],
        ["Démo", "Streamlit : les cycles arrivent un par un, inférence en 1 à 15 ms, alerte sous le seuil."],
      ],
      escTitle: "Ce qui a changé depuis septembre",
      esc: [
        ["Modèles", "XGBoost seul → 6 modèles, puis ensemble de 5 LSTM", "Test FD001 : 19,70 → 11,16"],
        ["Variables", "45 variables glissantes → 31, dont l'écart à l'état neuf", "Validation XGBoost : 16,87 → 9,36"],
        ["Normalisation", "Globale → par régime de vol (K-Means, 6 régimes)", "Validation FD002 : 19,48 → 16,41"],
        ["Réglages", "À la main → Optuna, confirmé sur 3 découpages neufs", "LSTM : − 1,49 cycle (p = 9,4e-7)"],
      ],
      escNote: "La représentation des données pèse plus que l'optimisation : l'écart à l'état neuf apporte 6,60 des 6,97 cycles gagnés par XGBoost, Optuna 0,37.",
      roleTitle: "Mon rôle dans l'équipe (6 personnes)",
      role: "Référente « tableau de bord et alertes » : tests de la démo Streamlit (« Tester un moteur »), vérification du comportement des alertes, relecture des supports de soutenance.",
      suiteTitle: "La suite, jusqu'en décembre",
      suite: ["Valider le seuil d'alerte et tester un historique incomplet", "Une version de démonstration plus aboutie", "API, base de données et Docker", "Explicabilité (SHAP) et intervalle de confiance"],
      source: "Prédictions réelles des modèles du projet, générées avec son code sur FD001 ; ici rejouées dans le navigateur, sans serveur.",
    },
    en: {
      loading: "Loading predictions…", fail: "The demo data could not be loaded.",
      kpiTitle: "Results presented at the project review (November 2026)",
      kpis: [
        ["11.16", "FD001 test RMSE", "Ensemble of 5 LSTMs · target < 18.91"],
        ["227.2", "NASA score", "852.9 in September (÷ 3.75)"],
        ["4 / 100", "Overestimated by 20+ cycles", "9 in September"],
        ["0 / 100", "Missed alerts at 30 cycles", "7 in September"],
        ["÷ 3.9", "Against the baseline", "43.07 for “always the mean”"],
        ["1–15 ms", "Per prediction", "CPU only"],
      ],
      demoTitle: "Test an unseen engine",
      demoLead: "The models only see the flights received so far; the true RUL stays hidden until you reveal it.",
      moteur: "Test engine", hasard: "Random engine", seuil: "Alert threshold", cycles: "cycles", modeles: "Models",
      debut: "Start", lecture: "Play", pause: "Pause", vitesse: "Speed", reveler: "Reveal the true RUL", cacher: "Hide the true RUL",
      cycle: "Cycle", sur: "of", rulPred: "Predicted RUL", alerte: "ALERT", ok: "OK", alerteDepuis: "first alert at cycle",
      vraie: "true RUL", erreur: "error", correcte: "correct alert", manquee: "missed alert", fausse: "false alert", rasOk: "no alert, correct",
      vraieRul: "True RUL", vraieCap: "True RUL capped at 125 (the learned target)", seuilLeg: "alert threshold",
      axeX: "observed cycle (flight)", axeY: "RUL (cycles left)", aucun: "Pick at least one model.",
      capteurs: "What the models see: 2 of the 21 raw sensors", s4: "T50 · LPT outlet temperature (°R)", s11: "Ps30 · HPC outlet static pressure (psia)",
      fin: "Last cycle received: in reality there were", finSuite: "cycles left before failure.",
      compTitle: "Compare the 6 models on the 100 test engines",
      compLead: "Error at each engine's last known cycle. The alert columns follow the threshold chosen above.",
      thModele: "Model", thRmse: "RMSE", thNasa: "NASA score", thSur: "Overestimated > 20", thManq: "Missed alerts", thFausse: "False alerts",
      compNote: "XGBoost was recomputed on a different machine from the team's: 12.44 here against 12.73 at the review (a known machine-dependent gap). The other 5 models match the published figures.",
      preuveTitle: "What the demo proves",
      preuves: [
        "The model never reads the future: changing cycles after t does not change the prediction at t (31 automated tests).",
        "Live prediction = offline prediction: a 1.4e-14 gap across all 24 subset × model pairs.",
        "An alert fires when the predicted RUL drops below the threshold; 30 cycles is still a working assumption.",
      ],
      archiTitle: "How the prototype is built",
      archi: [
        ["Data", "NASA C-MAPSS, FD001 to FD004: 26 columns per engine and cycle."],
        ["Preparation", "6 constant sensors removed, min-max scaling per flight regime, learned on the training set only."],
        ["Features", "Smoothed sensors, cycle number and “gap to new condition”; 20–30 cycle windows for the networks."],
        ["Models", "Random Forest, XGBoost, LightGBM, LSTM and 1D CNN (PyTorch), tuned with Optuna."],
        ["Evaluation", "5-fold cross-validation grouped by engine, RMSE and NASA score; the test set is read once."],
        ["Demo", "Streamlit: cycles arrive one by one, inference in 1–15 ms, alert below the threshold."],
      ],
      escTitle: "What changed since September",
      esc: [
        ["Models", "XGBoost only → 6 models, then an ensemble of 5 LSTMs", "FD001 test: 19.70 → 11.16"],
        ["Features", "45 rolling features → 31, including the gap to new condition", "XGBoost validation: 16.87 → 9.36"],
        ["Scaling", "Global → per flight regime (K-Means, 6 regimes)", "FD002 validation: 19.48 → 16.41"],
        ["Tuning", "By hand → Optuna, confirmed on 3 fresh splits", "LSTM: − 1.49 cycles (p = 9.4e-7)"],
      ],
      escNote: "Data representation matters more than tuning: the gap to new condition brings 6.60 of the 6.97 cycles XGBoost gained, Optuna 0.37.",
      roleTitle: "My role in the team (6 people)",
      role: "Lead for “dashboard and alerts”: testing the Streamlit demo (“Test an engine”), checking alert behaviour, reviewing the review slides.",
      suiteTitle: "Next steps, until December",
      suite: ["Validate the alert threshold and test incomplete histories", "A more polished demo version", "API, database and Docker", "Explainability (SHAP) and confidence intervals"],
      source: "Real predictions from the project's models, generated with its code on FD001; replayed here in the browser, with no server.",
    },
  };

  /* ---------- chargement des données ---------- */
  let promesse = null;
  function charger() {
    if (window.AERO_DATA) return Promise.resolve(window.AERO_DATA);
    if (!promesse) {
      promesse = new Promise((ok, ko) => {
        const s = document.createElement("script");
        s.src = "assets/aero-data.js";
        s.onload = () => (window.AERO_DATA ? ok(window.AERO_DATA) : ko());
        s.onerror = () => { promesse = null; ko(); };
        document.head.appendChild(s);
      });
    }
    return promesse;
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nasa = (e) => (e < 0 ? Math.exp(-e / 13) - 1 : Math.exp(e / 10) - 1);

  function mount(root, lang) {
    const T = TXT[lang] || TXT.fr;
    const fr = lang !== "en";
    const nb = (v, d = 1) => v.toLocaleString(fr ? "fr-FR" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
    root.innerHTML = `<p class="ae-loading">${T.loading}</p>`;
    let timer = null;
    charger().then((D) => construire(D), () => (root.innerHTML = `<p class="ae-loading">${T.fail}</p>`));

    function construire(D) {
      const idx = {}; D.modeles.forEach((k, i) => (idx[k] = i));
      const S = { m: 33, t: D.moteurs[33].n, seuil: 30, actifs: new Set(["xgboost_phase3", "lstm", "cnn1d"]), revele: false, joue: false, vit: 1 };

      root.innerHTML = `
        <section class="ae-block">
          <p class="m-h">${T.kpiTitle}</p>
          <div class="ae-kpis">${T.kpis.map(([v, l, s]) => `<div><b>${v}</b><span>${l}</span><small>${s}</small></div>`).join("")}</div>
        </section>

        <section class="ae-block ae-demo">
          <h4 class="ae-h">${T.demoTitle}</h4>
          <p class="ae-lead">${T.demoLead}</p>
          <div class="ae-ctrls">
            <div class="ae-field"><label for="ae-moteur">${T.moteur}</label>
              <div class="ae-inline"><select id="ae-moteur">${D.moteurs.map((m, i) => `<option value="${i}">n° ${m.u} · ${m.n} ${T.cycles}</option>`).join("")}</select>
              <button type="button" class="btn btn-small" data-a="hasard">${T.hasard}</button></div></div>
            <div class="ae-field"><label for="ae-seuil">${T.seuil} : <b id="ae-seuil-v">30</b> ${T.cycles}</label>
              <input id="ae-seuil" type="range" min="5" max="100" step="5" value="30"></div>
            <div class="ae-field ae-wide"><span class="ae-lab">${T.modeles}</span>
              <div class="ae-chips" role="group" aria-label="${T.modeles}">${MODELES.map((m) => `<button type="button" class="ae-chip" data-mod="${m.key}" aria-pressed="false"><i style="background:${m.couleur}"></i>${fr ? m.nom : m.nomEn}</button>`).join("")}</div></div>
          </div>
          <div class="ae-play">
            <button type="button" class="btn btn-small" data-a="debut" aria-label="${T.debut}">⏮ ${T.debut}</button>
            <button type="button" class="btn btn-small" data-a="moins" aria-label="-1">−1</button>
            <button type="button" class="btn btn-small btn-primary ae-lecture" data-a="lecture">▶ ${T.lecture}</button>
            <button type="button" class="btn btn-small" data-a="plus" aria-label="+1">+1</button>
            <label class="ae-vit" for="ae-vit">${T.vitesse}
              <select id="ae-vit">${VITESSES.map((v, i) => `<option value="${i}" ${i === 1 ? "selected" : ""}>×${[1, 3, 8][i]}</option>`).join("")}</select></label>
            <input id="ae-t" class="ae-t" type="range" min="1" value="1" aria-label="${T.cycle}">
            <span class="ae-tlab" id="ae-tlab"></span>
            <button type="button" class="btn btn-small" data-a="reveler" id="ae-rev"></button>
          </div>
          <div class="ae-chart" id="ae-chart"></div>
          <p class="ae-fin" id="ae-fin" hidden></p>
          <div class="ae-cards" id="ae-cards"></div>
          <p class="m-h">${T.capteurs}</p>
          <div class="ae-sensors"><div id="ae-s4"></div><div id="ae-s11"></div></div>
        </section>

        <section class="ae-block">
          <h4 class="ae-h">${T.compTitle}</h4>
          <p class="ae-lead">${T.compLead}</p>
          <div class="ae-tablewrap"><table class="ae-table" id="ae-table"></table></div>
          <p class="ae-note">${T.compNote}</p>
        </section>

        <section class="ae-block ae-two">
          <div><h4 class="ae-h">${T.preuveTitle}</h4><ul class="m-list">${T.preuves.map((p) => `<li>${p}</li>`).join("")}</ul></div>
          <div><h4 class="ae-h">${T.roleTitle}</h4><p class="ae-lead">${T.role}</p>
            <h4 class="ae-h">${T.suiteTitle}</h4><ul class="m-list">${T.suite.map((p) => `<li>${p}</li>`).join("")}</ul></div>
        </section>

        <section class="ae-block">
          <h4 class="ae-h">${T.archiTitle}</h4>
          <ol class="ae-pipe">${T.archi.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join("")}</ol>
        </section>

        <section class="ae-block">
          <h4 class="ae-h">${T.escTitle}</h4>
          <div class="ae-esc">${T.esc.map(([a, b, c]) => `<div><span class="ae-esc-k">${a}</span><p>${b}</p><b>${c}</b></div>`).join("")}</div>
          <p class="ae-note">${T.escNote}</p>
          <p class="ae-note">${T.source}</p>
        </section>`;

      const q = (s) => root.querySelector(s);
      const sel = q("#ae-moteur"), seuil = q("#ae-seuil"), tIn = q("#ae-t"), vit = q("#ae-vit");
      sel.value = String(S.m);

      function changerMoteur(i) { S.m = i; S.revele = false; S.t = Math.min(S.t, D.moteurs[i].n); stop(); S.t = 1; sel.value = String(i); render(); demarrer(); }
      function stop() { S.joue = false; clearInterval(timer); timer = null; }
      function demarrer() {
        const mo = D.moteurs[S.m];
        if (S.t >= mo.n) S.t = 1;
        S.joue = true; clearInterval(timer);
        timer = setInterval(() => {
          if (S.t >= D.moteurs[S.m].n) { stop(); render(); return; }
          S.t++; render();
        }, 1000 / VITESSES[S.vit]);
        render();
      }

      root.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-mod]");
        if (chip) { const k = chip.dataset.mod; S.actifs.has(k) ? S.actifs.delete(k) : S.actifs.add(k); return render(); }
        const b = e.target.closest("[data-a]"); if (!b) return;
        const a = b.dataset.a, mo = D.moteurs[S.m];
        if (a === "hasard") { let i; do { i = Math.floor(Math.random() * D.moteurs.length); } while (i === S.m); return changerMoteur(i); }
        if (a === "lecture") { S.joue ? stop() : demarrer(); return render(); }
        if (a === "debut") { stop(); S.t = 1; }
        if (a === "moins") { stop(); S.t = Math.max(1, S.t - 1); }
        if (a === "plus") { stop(); S.t = Math.min(mo.n, S.t + 1); }
        if (a === "reveler") S.revele = !S.revele;
        render();
      });
      sel.addEventListener("change", () => changerMoteur(+sel.value));
      seuil.addEventListener("input", () => { S.seuil = +seuil.value; render(); });
      tIn.addEventListener("input", () => { stop(); S.t = +tIn.value; render(); });
      vit.addEventListener("change", () => { S.vit = +vit.value; if (S.joue) demarrer(); });

      const modelesActifs = () => MODELES.filter((m) => S.actifs.has(m.key));
      const vraieEn = (mo, t) => mo.rul + mo.n - t;

      function render() {
        const mo = D.moteurs[S.m], t = S.t;
        q("#ae-seuil-v").textContent = S.seuil;
        tIn.max = String(mo.n); tIn.value = String(t);
        q("#ae-tlab").textContent = `${T.cycle} ${t} ${T.sur} ${mo.n}`;
        const lec = q(".ae-lecture"); lec.textContent = S.joue ? `❚❚ ${T.pause}` : `▶ ${T.lecture}`;
        q("#ae-rev").textContent = S.revele ? T.cacher : T.reveler;
        q("#ae-rev").setAttribute("aria-pressed", S.revele);
        root.querySelectorAll("[data-mod]").forEach((c) => c.setAttribute("aria-pressed", S.actifs.has(c.dataset.mod)));
        q("#ae-chart").innerHTML = graphique(mo, t);
        q("#ae-cards").innerHTML = cartes(mo, t);
        const fin = q("#ae-fin");
        fin.hidden = !(S.revele && t === mo.n);
        fin.innerHTML = `${T.fin} <b>${mo.rul}</b> ${T.finSuite}`;
        q("#ae-s4").innerHTML = capteur(mo.s4, t, T.s4, 2);
        q("#ae-s11").innerHTML = capteur(mo.s11, t, T.s11, 2);
        q("#ae-table").innerHTML = tableau();
      }

      /* ---------- graphique principal ---------- */
      function graphique(mo, t) {
        const W = 760, H = 330, L = 48, R = 14, Tp = 14, B = 40;
        const actifs = modelesActifs();
        let yMax = 140;
        actifs.forEach((m) => { for (let i = 0; i < t; i++) yMax = Math.max(yMax, mo.p[idx[m.key]][i]); });
        if (S.revele) yMax = Math.max(yMax, vraieEn(mo, 1));
        yMax = Math.ceil(yMax / 20) * 20;
        const X = (c) => L + ((c - 1) / Math.max(1, mo.n - 1)) * (W - L - R);
        const Y = (v) => H - B - (Math.max(0, v) / yMax) * (H - B - Tp);
        let s = `<rect x="${L}" y="${Y(S.seuil)}" width="${W - L - R}" height="${H - B - Y(S.seuil)}" class="ae-zone"/>`;
        for (let v = 0; v <= yMax; v += yMax > 160 ? 40 : 20) s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="ae-grid"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
        const pas = mo.n > 250 ? 50 : mo.n > 120 ? 25 : 10;
        for (let c = pas; c <= mo.n; c += pas) s += `<text x="${X(c)}" y="${H - B + 16}" text-anchor="middle">${c}</text>`;
        s += `<text x="${(L + W - R) / 2}" y="${H - 4}" text-anchor="middle" class="ae-ax">${T.axeX}</text>`;
        s += `<text transform="translate(12 ${(H - B + Tp) / 2}) rotate(-90)" text-anchor="middle" class="ae-ax">${T.axeY}</text>`;
        s += `<line x1="${L}" x2="${W - R}" y1="${Y(S.seuil)}" y2="${Y(S.seuil)}" class="ae-seuil"/>`;
        if (S.revele) {
          let d1 = "", d2 = "";
          for (let c = 1; c <= mo.n; c++) {
            const v = vraieEn(mo, c);
            d1 += (c > 1 ? "L" : "M") + X(c).toFixed(1) + " " + Y(v).toFixed(1);
            d2 += (c > 1 ? "L" : "M") + X(c).toFixed(1) + " " + Y(Math.min(PLAFOND, v)).toFixed(1);
          }
          s += `<path d="${d2}" class="ae-cap"/><path d="${d1}" class="ae-true"/>`;
        }
        if (!actifs.length) s += `<text x="${(L + W) / 2}" y="${H / 2}" text-anchor="middle">${T.aucun}</text>`;
        actifs.forEach((m) => {
          const arr = mo.p[idx[m.key]];
          let d = "";
          for (let c = 1; c <= t; c++) d += (c > 1 ? "L" : "M") + X(c).toFixed(1) + " " + Y(arr[c - 1]).toFixed(1);
          s += `<path d="${d}" fill="none" stroke="${m.couleur}" stroke-width="2" stroke-linejoin="round"/>`;
          s += `<circle cx="${X(t)}" cy="${Y(arr[t - 1])}" r="4" fill="${m.couleur}"><title>${fr ? m.nom : m.nomEn} : ${nb(arr[t - 1])}</title></circle>`;
        });
        s += `<line x1="${X(t)}" x2="${X(t)}" y1="${Tp}" y2="${H - B}" class="ae-now"/>`;
        // légende
        const leg = [[`<line x1="0" x2="18" y1="0" y2="0" class="ae-seuil"/>`, `${T.seuilLeg} (${S.seuil})`]];
        if (S.revele) leg.push([`<line x1="0" x2="18" y1="0" y2="0" class="ae-true"/>`, T.vraieRul], [`<line x1="0" x2="18" y1="0" y2="0" class="ae-cap"/>`, T.vraieCap]);
        const legend = leg.map(([sym, lab]) => `<span><svg width="18" height="6" viewBox="0 -3 18 6" aria-hidden="true">${sym}</svg>${esc(lab)}</span>`).join("");
        return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T.demoTitle)}">${s}</svg><div class="ae-legend">${legend}</div>`;
      }

      /* ---------- une carte par modèle ---------- */
      function cartes(mo, t) {
        const vraie = vraieEn(mo, t);
        return modelesActifs().map((m) => {
          const arr = mo.p[idx[m.key]], v = arr[t - 1], alerte = v <= S.seuil;
          let debut = 0; for (let c = 1; c <= t; c++) if (arr[c - 1] <= S.seuil) { debut = c; break; }
          let verdict = "";
          if (S.revele) {
            const doit = vraie <= S.seuil;
            const [cls, txt] = alerte && doit ? ["ok", T.correcte] : !alerte && doit ? ["bad", T.manquee] : alerte && !doit ? ["warn", T.fausse] : ["ok", T.rasOk];
            const e = v - vraie;
            verdict = `<p class="ae-v"><span>${T.vraie} : <b>${vraie}</b> · ${T.erreur} ${e > 0 ? "+" : ""}${nb(e)}</span><span class="ae-tag ${cls}">${txt}</span></p>`;
          }
          return `<div class="ae-card" style="--c:${m.couleur}">
            <div class="ae-card-h"><span><i></i>${fr ? m.nom : m.nomEn}</span><span class="ae-pill ${alerte ? "on" : ""}">${alerte ? T.alerte : T.ok}</span></div>
            <b class="ae-big">${nb(v)}</b><span class="ae-sub">${T.rulPred}${debut ? ` · ${T.alerteDepuis} ${debut}` : ""}</span>${verdict}
          </div>`;
        }).join("");
      }

      /* ---------- mini-graphiques capteurs ---------- */
      function capteur(vals, t, titre, d) {
        const W = 360, H = 90, L = 4, R = 4, Tp = 8, B = 8;
        const mn = Math.min(...vals), mx = Math.max(...vals), n = vals.length;
        const X = (c) => L + ((c - 1) / Math.max(1, n - 1)) * (W - L - R);
        const Y = (v) => H - B - ((v - mn) / (mx - mn || 1)) * (H - B - Tp);
        let dd = "";
        for (let c = 1; c <= t; c++) dd += (c > 1 ? "L" : "M") + X(c).toFixed(1) + " " + Y(vals[c - 1]).toFixed(1);
        return `<p class="ae-sens-t"><span>${esc(titre)}</span><b>${nb(vals[t - 1], d)}</b></p>
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="ae-spark" aria-hidden="true"><path d="${dd}" fill="none" stroke="var(--data)" stroke-width="1.4"/></svg>`;
      }

      /* ---------- comparaison sur les 100 moteurs ---------- */
      function tableau() {
        const lignes = MODELES.map((m) => {
          let se = 0, sn = 0, sur = 0, manq = 0, fausse = 0;
          D.moteurs.forEach((mo, i) => {
            const p = D.fin ? D.fin[idx[m.key]][i] : mo.p[idx[m.key]][mo.n - 1], v = mo.rul, e = p - v; // pleine précision
            se += e * e; sn += nasa(e); if (e > 20) sur++;
            if (v <= S.seuil && p > S.seuil) manq++;
            if (v > S.seuil && p <= S.seuil) fausse++;
          });
          return { m, rmse: Math.sqrt(se / D.moteurs.length), nasa: sn, sur, manq, fausse };
        }).sort((a, b) => a.rmse - b.rmse);
        const best = (k) => Math.min(...lignes.map((l) => l[k]));
        const maxR = Math.max(...lignes.map((l) => l.rmse));
        const cell = (l, k, txt) => `<td class="${l[k] === best(k) ? "best" : ""}">${txt}</td>`;
        return `<thead><tr><th>${T.thModele}</th><th>${T.thRmse}</th><th>${T.thNasa}</th><th>${T.thSur}</th><th>${T.thManq} (${S.seuil})</th><th>${T.thFausse} (${S.seuil})</th></tr></thead><tbody>` +
          lignes.map((l) => `<tr><th scope="row"><i style="background:${l.m.couleur}"></i>${fr ? l.m.nom : l.m.nomEn}</th>
            <td class="${l.rmse === best("rmse") ? "best" : ""}"><span class="ae-bar"><span style="width:${(l.rmse / maxR) * 100}%;background:${l.m.couleur}"></span></span>${nb(l.rmse, 2)}</td>
            ${cell(l, "nasa", nb(l.nasa, 1))}${cell(l, "sur", l.sur)}${cell(l, "manq", l.manq)}${cell(l, "fausse", l.fausse)}</tr>`).join("") + "</tbody>";
      }

      render();
    }

    return { destroy() { clearInterval(timer); timer = null; } };
  }

  window.AeroDemo = { mount };
})();
