/* =========================================================
   PLANTAMITZ — version web jouable
   ---------------------------------------------------------
   Portage en JavaScript du jeu écrit en C (main.c, sousP.c,
   curseur.c, gestion_contrats.c, items_speciaux.c,
   progression.c, musique.c). Mêmes règles, mêmes contrats,
   mêmes touches, même affichage « console ».
   Différences assumées avec la version C :
   - les items spéciaux (Bombe, Étoile, Éclair, Arc-en-ciel)
     appliquent réellement leur effet ;
   - un alignement de 4 ou plus supprime aussi ses items ;
   - la sauvegarde utilise le stockage du navigateur au lieu
     du fichier plantamitz.txt ;
   - la musique (musique.wav) est convertie en .mp3 pour le web.
   ========================================================= */
(function () {
  const L = 25, C = 45;
  const BOMBE = "B", ETOILE = "E", ECLAIR = "L", ARC = "R";
  const SPECIAUX = "BELR";
  const ITEMS = ["S", "F", "P", "O", "M"];
  const SAVE_KEY = "plantamitz.save";

  // Palette de la console Windows (Campbell), comme dans les captures
  const PAL = { 0: "#0C0C0C", 4: "#C50F1F", 8: "#767676", 10: "#16C60C", 11: "#61D6D6", 12: "#E74856", 13: "#B4009E", 14: "#F9F1A5", 15: "#F2F2F2" };
  const COUL = { S: 14, F: 12, P: 10, O: 8, M: 13, B: 4, E: 11, L: 14, R: 13 };

  const rnd = (n) => Math.floor(Math.random() * n);
  const genererItem = () => ITEMS[rnd(5)];
  const estSpecial = (x) => x !== " " && SPECIAUX.includes(x);
  const grille = (v) => Array.from({ length: L }, () => new Array(C).fill(v));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");

  const store = {
    load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch { return null; } },
    save(o) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(o)); } catch { /* indisponible */ } },
    clear() { try { localStorage.removeItem(SAVE_KEY); } catch { /* indisponible */ } },
  };

  /* ---------- sousP.c : remplir_plateau (aucun alignement au départ) ---------- */
  function remplirPlateau() {
    const t = grille(" ");
    for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) {
      let c, valide = false;
      while (!valide) {
        c = genererItem(); valide = true;
        if (j >= 2 && t[i][j - 1] === c && t[i][j - 2] === c) valide = false;
        if (valide && i >= 2 && t[i - 1][j] === c && t[i - 2][j] === c) valide = false;
        if (valide && i >= 1 && j >= 1 && t[i - 1][j] === c && t[i][j - 1] === c && t[i - 1][j - 1] === c) valide = false;
        if (valide && i >= 2 && j >= 2 && t[i][j - 2] === c && t[i - 1][j - 2] === c && t[i - 1][j - 1] === c &&
            t[i - 1][j] === c && t[i - 2][j - 2] === c && t[i - 2][j] === c) valide = false;
      }
      t[i][j] = c;
    }
    return t;
  }

  /* ---------- items_speciaux.c : suppression_special ---------- */
  function genererItemSpecial(longueur, horizontal) {
    if (longueur === 4) return BOMBE;
    if (longueur === 5) return horizontal ? ETOILE : ECLAIR;
    if (longueur >= 6) return ARC;
    return " ";
  }
  function suppressionSpecial(tab) {
    const marque = grille(0);
    let total = 0, si = -1, sj = -1, type = " ";
    for (let i = 0; i < L; i++) for (let j = 0; j < C - 2; j++) {
      const item = tab[i][j];
      if (item === " " || estSpecial(item)) continue;
      let lg = 1;
      while (j + lg < C && tab[i][j + lg] === item) lg++;
      if (lg >= 3) {
        for (let k = 0; k < lg; k++) if (!marque[i][j + k]) { marque[i][j + k] = 1; total++; }
        if (lg >= 4 && type === " ") { si = i; sj = j + (lg >> 1); type = genererItemSpecial(lg, 1); }
      }
      j += lg - 1;
    }
    for (let j = 0; j < C; j++) for (let i = 0; i < L - 2; i++) {
      const item = tab[i][j];
      if (item === " " || estSpecial(item)) continue;
      let lg = 1;
      while (i + lg < L && tab[i + lg][j] === item) lg++;
      if (lg >= 3) {
        for (let k = 0; k < lg; k++) if (!marque[i + k][j]) { marque[i + k][j] = 1; total++; }
        if (lg >= 4 && type === " ") { si = i + (lg >> 1); sj = j; type = genererItemSpecial(lg, 0); }
      }
      i += lg - 1;
    }
    // carré 2x2 et figure en H (sousP.c : suppression)
    for (let i = 0; i < L - 1; i++) for (let j = 0; j < C - 1; j++) {
      const x = tab[i][j];
      if (x === " " || estSpecial(x)) continue;
      if (tab[i][j + 1] === x && tab[i + 1][j] === x && tab[i + 1][j + 1] === x)
        [[i, j], [i, j + 1], [i + 1, j], [i + 1, j + 1]].forEach(([a, b]) => { if (!marque[a][b]) { marque[a][b] = 1; total++; } });
    }
    for (let i = 0; i < L - 2; i++) for (let j = 0; j < C - 2; j++) {
      const x = tab[i][j];
      if (x === " " || estSpecial(x)) continue;
      const H = [[i, j], [i, j + 2], [i + 1, j], [i + 1, j + 1], [i + 1, j + 2], [i + 2, j], [i + 2, j + 2]];
      if (H.every(([a, b]) => tab[a][b] === x)) H.forEach(([a, b]) => { if (!marque[a][b]) { marque[a][b] = 1; total++; } });
    }
    return { marque, total, special: type !== " " ? { i: si, j: sj, type } : null };
  }

  /* ---------- items_speciaux.c : activer_item_special ---------- */
  function activerItemSpecial(tab, marque, i, j) {
    const item = tab[i][j];
    if (item === BOMBE) {
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
        const a = i + di, b = j + dj;
        if (a >= 0 && a < L && b >= 0 && b < C) marque[a][b] = 1;
      }
    } else if (item === ETOILE) {
      for (let b = 0; b < C; b++) marque[i][b] = 1;
    } else if (item === ECLAIR) {
      for (let a = 0; a < L; a++) marque[a][j] = 1;
    } else if (item === ARC) {
      const voisins = [[i, j - 1], [i, j + 1], [i + 1, j], [i - 1, j]];
      let cible = " ";
      for (const [a, b] of voisins) {
        if (a >= 0 && a < L && b >= 0 && b < C && tab[a][b] !== " " && !estSpecial(tab[a][b])) { cible = tab[a][b]; break; }
      }
      if (cible !== " ") for (let a = 0; a < L; a++) for (let b = 0; b < C; b++) if (tab[a][b] === cible) marque[a][b] = 1;
    }
    marque[i][j] = 1;
  }
  // Un item spécial touché par une explosion se déclenche à son tour
  function reactionEnChaine(tab, marque, deja = new Set()) {
    let encore = true;
    while (encore) {
      encore = false;
      for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) {
        const k = i * C + j;
        if (marque[i][j] && estSpecial(tab[i][j]) && !deja.has(k)) { deja.add(k); activerItemSpecial(tab, marque, i, j); encore = true; }
      }
    }
  }

  /* ---------- gestion_contrats.c : calculer_points (porté tel quel) ---------- */
  function calculerPoints(tab, marque) {
    let points = 0;
    const visite = grille(0);
    const toutLeType = (item) => {
      let n = 0;
      for (let a = 0; a < L; a++) for (let b = 0; b < C; b++) if (tab[a][b] === item) { marque[a][b] = 1; n++; }
      return n;
    };
    for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) {
      if (marque[i][j] && !visite[i][j]) {
        const item = tab[i][j]; let lg = 0;
        while (j + lg < C && tab[i][j + lg] === item && marque[i][j + lg]) { visite[i][j + lg] = 1; lg++; }
        if (lg === 6) points += toutLeType(item); else if (lg >= 3) points += lg;
      }
    }
    for (let j = 0; j < C; j++) for (let i = 0; i < L; i++) {
      if (marque[i][j] && !visite[i][j]) {
        const item = tab[i][j]; let lg = 0;
        while (i + lg < L && tab[i + lg][j] === item && marque[i + lg][j]) { visite[i + lg][j] = 1; lg++; }
        if (lg === 6) points += toutLeType(item); else if (lg >= 3) points += lg;
      }
    }
    for (let i = 0; i < L - 1; i++) for (let j = 0; j < C - 1; j++) {
      if (marque[i][j] && !visite[i][j]) {
        const item = tab[i][j];
        let h = 1; while (i + h < L && tab[i + h][j] === item && marque[i + h][j]) h++;
        let w = 1; while (j + w < C && tab[i][j + w] === item && marque[i][j + w]) w++;
        let rect = true;
        for (let a = i; a < i + h && rect; a++) for (let b = j; b < j + w && rect; b++) if (tab[a][b] !== item || !marque[a][b]) rect = false;
        if (rect && h >= 2 && w >= 2) {
          points += 2 * h * w;
          for (let a = i; a < i + h; a++) for (let b = j; b < j + w; b++) visite[a][b] = 1;
        }
      }
    }
    for (let i = 0; i < L - 2; i++) for (let j = 0; j < C - 2; j++) {
      if (marque[i][j] && !visite[i][j]) {
        const x = tab[i][j];
        const H = [[i, j], [i, j + 2], [i + 1, j], [i + 1, j + 1], [i + 1, j + 2], [i + 2, j], [i + 2, j + 2]];
        if (H.every(([a, b]) => tab[a][b] === x && marque[a][b])) { points += 14; H.forEach(([a, b]) => (visite[a][b] = 1)); }
      }
    }
    // points des cases détruites par un item spécial (non comptées ci-dessus)
    for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) if (marque[i][j] && !visite[i][j]) points += 1;
    return points;
  }

  /* ---------- gestion_contrats.c : initialiser_contrat ---------- */
  const CONTRATS = {
    1: { S: 10, F: 9, P: 10, O: 10, M: 10, coups: 20, temps: 340 },
    2: { S: 55, F: 35, P: 30, O: 35, M: 20, coups: 45, temps: 240 },
    3: { S: 40, F: 40, P: 35, O: 45, M: 40, coups: 50, temps: 300 },
  };
  function initialiserContrat(niveau) {
    const d = CONTRATS[niveau] || { S: 25, F: 25, P: 25, O: 25, M: 25, coups: 30, temps: 180 };
    return {
      niveau, requis: { S: d.S, F: d.F, P: d.P, O: d.O, M: d.M }, actuel: { S: 0, F: 0, P: 0, O: 0, M: 0 },
      coupsMax: d.coups, coups: d.coups, score: 0, debut: Date.now(), limite: d.temps, pause: 0,
    };
  }
  const contratRempli = (c) => ITEMS.every((k) => !(c.requis[k] > 0 && c.actuel[k] < c.requis[k]));
  function tempsRestant(c) {
    const ecoule = Math.floor((Date.now() - c.debut - c.pause) / 1000);
    return Math.max(0, c.limite - ecoule);
  }
  function compterItemsSupprimes(tab, marque, c) {
    for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) {
      const it = tab[i][j];
      if (marque[i][j] && c.requis[it] !== undefined && c.actuel[it] < c.requis[it]) c.actuel[it]++;
    }
  }

  /* ---------- musique.c : la musique du jeu (musique.wav, en boucle) ----------
     Si le fichier ne peut pas être lu, une petite mélodie générée prend le relais. */
  const MUSIQUE_SRC = "assets/plantamitz-musique.mp3";
  function creerMusique() {
    let audio = null, ctx = null, timer = null, step = 0, secours = false;
    const NOTES = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587];
    function bip(f) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "square"; o.frequency.value = f;
      g.gain.setValueAtTime(0.025, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.24);
    }
    function melodie() {
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        if (!timer) timer = setInterval(() => bip(NOTES[step++ % NOTES.length]), 260);
      } catch { /* son indisponible */ }
    }
    return {
      on: false,
      start() {
        this.on = true;
        if (secours) return melodie();
        try {
          if (!audio) { audio = new Audio(MUSIQUE_SRC); audio.loop = true; audio.volume = 0.45; }
          const p = audio.play();
          if (p && p.catch) p.catch((err) => {
            // lecture bloquée faute d'interaction : on réessaiera à la prochaine touche
            if (err && err.name === "NotAllowedError") { this.on = false; return; }
            secours = true; if (this.on) melodie();
          });
        } catch { secours = true; melodie(); }
      },
      stop() {
        if (audio) audio.pause();
        clearInterval(timer); timer = null; this.on = false;
      },
    };
  }

  /* =========================================================
     Le jeu : écrans, clavier, souris/tactile, affichage
     ========================================================= */
  function mount(root) {
    root.innerHTML = `
      <div class="pz-term" tabindex="0" role="application" aria-label="Jeu Plantamitz : cliquez ici puis jouez au clavier">
        <div class="pz-bar"><span class="pz-dot"></span><span>C:\\Users\\dorli\\Documents\\Plantamitz.exe</span></div>
        <div class="pz-screen" aria-live="polite"></div>
      </div>
      <div class="pz-pad" aria-label="Commandes tactiles">
        <button type="button" data-k="z" aria-label="Haut">▲</button>
        <button type="button" data-k="q" aria-label="Gauche">◀</button>
        <button type="button" data-k="s" aria-label="Bas">▼</button>
        <button type="button" data-k="d" aria-label="Droite">▶</button>
        <button type="button" data-k="space" class="wide">Sélection</button>
        <button type="button" data-k="m">Musique</button>
        <button type="button" data-k="esc">Échap</button>
      </div>`;
    const term = root.querySelector(".pz-term");
    const screen = root.querySelector(".pz-screen");
    const musique = creerMusique();

    const S = {
      ecran: "", nom: "", niveau: 1, total: 0, vies: 5,
      plateau: null, contrat: null, cur: { l: 0, c: 0, sel: false, si: 0, sj: 0 },
      flash: null, occupe: false, msg: [], suite: null, info: "", nomSaisi: "",
    };
    let tick = null, pauseDebut = 0;

    /* ----- écrans ----- */
    function ecranDemarrage() {
      const sv = store.load();
      if (sv && sv.nom) {
        S.nom = sv.nom; S.niveau = sv.niveau || 1; S.total = sv.score || 0;
        message(["", " Sauvegarde trouvée", `Joueur : ${S.nom}`, `Niveau atteint : ${S.niveau}`, `Score : ${S.total}`, "", "Appuyer sur une touche..."], ecranMenu);
      } else {
        S.ecran = "nom"; S.nomSaisi = ""; render();
      }
    }
    function ecranMenu() { S.ecran = "menu"; render(); }
    function ecranRegles() {
      message([
        "OBJECTIF :", "Collectez les items demandés dans le contrat", "en un nombre limité de coups", "",
        "COMMANDES :", "z/q/s/d ou les flèches : déplacer le curseur", "ESPACE : sélectionner un item",
        "z/q/s/d ou les flèches : permuter avec un autre item", "M : activer / désactiver la musique",
        "ÉCHAP : quitter le niveau (progression sauvegardée)", "Souris / doigt : cliquez une case, puis une case voisine", "",
        "ITEMS SPÉCIAUX", "B (Bombe) : alignez 4 items - détruit 3x3",
        "E (Étoile) : alignez 5 items horizontaux - détruit la ligne",
        "L (Éclair) : alignez 5 items verticaux - détruit la colonne",
        "R (Arc-en-ciel) : alignez 6 items - détruit tous les items voisins du même type",
        "Permutez un item spécial pour le déclencher.", "", "Appuyer sur une touche...",
      ], ecranMenu);
    }
    function lancerNiveau(garderVies) {
      S.plateau = remplirPlateau();
      S.contrat = initialiserContrat(S.niveau);
      if (!garderVies) S.vies = 5;
      S.cur = { l: 0, c: 0, sel: false, si: 0, sj: 0 };
      S.ecran = "jeu"; S.msg = []; S.suite = null;
      render();
    }
    function message(lignes, suite) { S.ecran = "msg"; S.msg = lignes; S.suite = suite; render(); }
    function invite(lignes, suite) { S.msg = lignes; S.suite = suite; pauseDebut = Date.now(); render(); }
    function sauver() { store.save({ nom: S.nom, niveau: S.niveau, score: S.total }); }

    /* ----- vérifications après chaque action (ordre de main.c) ----- */
    function verifier() {
      if (S.ecran !== "jeu" || S.suite || S.occupe) return;
      const c = S.contrat;
      if (contratRempli(c)) {
        S.total += c.score;
        const lignes = ["", " NIVEAU TERMINÉ ", "", `Score du niveau : ${c.score} pts`, `Score total : ${S.total} pts`];
        if (S.niveau < 3) {
          S.niveau++; sauver();
          invite([...lignes, "", ` Passage au niveau ${S.niveau} ! `, "", "Appuyer sur une touche..."], () => lancerNiveau(false));
        } else {
          store.clear(); S.niveau = 1;
          invite([...lignes, "", " NIVEAUX TERMINÉS, FÉLICITATIONS !!! ", "", "Appuyer sur une touche..."], ecranMenu);
        }
        return;
      }
      const raison = tempsRestant(c) <= 0 ? " TEMPS ÉCOULÉ " : c.coups <= 0 ? " PLUS DE COUPS " : null;
      if (!raison) return;
      S.vies--;
      if (S.vies <= 0) {
        sauver();
        invite(["", raison, "", `Vies : ${S.vies}/5`, "", ">>> VOUS AVEZ PERDU ! <<<", "", "Appuyer sur une touche..."], () => { S.vies = 5; ecranMenu(); });
      } else {
        invite(["", raison, "", `Vies : ${S.vies}/5`, "", "(R)ecommencer le niveau | (Q)uitter"], (k) => {
          if (k === "r") lancerNiveau(true);
          else if (k === "q" || k === "esc") { sauver(); ecranMenu(); }
          else return false;
        });
      }
    }

    /* ----- un coup : permutation, suppressions, chute, remplissage ----- */
    async function permuter(di, dj) {
      const { si, sj } = S.cur, t = S.plateau, c = S.contrat;
      const ti = si + di, tj = sj + dj;
      if (ti < 0 || ti >= L || tj < 0 || tj >= C) { S.cur.sel = false; return render(); }
      const a = t[si][sj], b = t[ti][tj];
      t[si][sj] = b; t[ti][tj] = a;
      let res = suppressionSpecial(t);
      const special = estSpecial(a) || estSpecial(b);
      if (!res.total && !special) {          // pas d'alignement : on annule
        t[si][sj] = a; t[ti][tj] = b; S.cur.sel = false; return render();
      }
      S.cur.sel = false; S.occupe = true;
      c.coups--;
      if (estSpecial(b)) activerItemSpecial(t, res.marque, si, sj);
      if (estSpecial(a)) activerItemSpecial(t, res.marque, ti, tj);
      // stabiliser_plateau : on répète tant qu'il y a des alignements
      let tour = 0;
      while (res && (res.total || tour === 0)) {
        reactionEnChaine(t, res.marque);
        if (res.special) res.marque[res.special.i][res.special.j] = 0;
        c.score += calculerPoints(t, res.marque);
        compterItemsSupprimes(t, res.marque, c);
        S.flash = res.marque; render(); await wait(170);
        for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) if (res.marque[i][j]) t[i][j] = " ";
        if (res.special) t[res.special.i][res.special.j] = res.special.type;
        S.flash = null;
        // faire_tomber_item + remplir_vide
        for (let j = 0; j < C; j++) {
          let dest = L - 1;
          for (let i = L - 1; i >= 0; i--) if (t[i][j] !== " ") { if (i !== dest) { t[dest][j] = t[i][j]; t[i][j] = " "; } dest--; }
        }
        for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) if (t[i][j] === " ") t[i][j] = genererItem();
        render(); await wait(110);
        res = suppressionSpecial(t); tour++;
        if (tour > 40) break;
      }
      S.occupe = false;
      render(); verifier();
    }

    /* ----- clavier ----- */
    const DIRS = { z: [-1, 0], s: [1, 0], q: [0, -1], d: [0, 1] };
    function touche(k) {
      if (musique.on === false && S.musiqueVoulue && k !== "m") musique.start();
      if (S.occupe) return;
      if (S.ecran === "nom") return;
      if (S.ecran === "msg" || (S.ecran === "jeu" && S.suite)) {
        const suite = S.suite;
        if (S.ecran === "jeu" && pauseDebut) { S.contrat.pause += Date.now() - pauseDebut; pauseDebut = 0; }
        S.suite = null;
        if (suite && suite(k) === false) { S.suite = suite; pauseDebut = pauseDebut || Date.now(); }
        return render();
      }
      if (S.ecran === "menu") {
        if (k === "1") lancerNiveau(false);
        else if (k === "2") ecranRegles();
        else if (k === "3") message(["", "Merci d'avoir joué à PLANTAMITZ !", "", "Appuyer sur une touche pour revenir au menu..."], ecranMenu);
        return;
      }
      if (S.ecran !== "jeu") return;
      if (k === "m") { basculerMusique(); return; }
      if (k === "esc") {
        sauver();
        return message(["", " Progression sauvegardée ! ", "", "Appuyer sur une touche..."], ecranMenu);
      }
      if (k === "space") {
        if (S.cur.sel) S.cur.sel = false; else Object.assign(S.cur, { sel: true, si: S.cur.l, sj: S.cur.c });
        return render();
      }
      const d = DIRS[k];
      if (!d) { if (S.cur.sel) { S.cur.sel = false; render(); } return; }
      if (S.cur.sel) return void permuter(d[0], d[1]);
      S.cur.l = Math.min(L - 1, Math.max(0, S.cur.l + d[0]));
      S.cur.c = Math.min(C - 1, Math.max(0, S.cur.c + d[1]));
      render();
    }
    function basculerMusique() {
      S.musiqueVoulue = !S.musiqueVoulue;
      S.musiqueVoulue ? musique.start() : musique.stop();
      S.info = S.musiqueVoulue ? "Musique activée" : "Musique désactivée";
      render();
    }

    const KEYMAP = { ArrowUp: "z", ArrowDown: "s", ArrowLeft: "q", ArrowRight: "d", " ": "space", Spacebar: "space", Escape: "esc", Enter: "enter" };
    term.addEventListener("keydown", (e) => {
      if (S.ecran === "nom") {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); }
        if (e.key === "Enter") {
          e.preventDefault();
          const champ = screen.querySelector(".pz-input");
          const nom = (champ ? champ.value : "").trim().split(/\s+/)[0];
          if (nom) { S.nom = nom.slice(0, 49); S.niveau = 1; S.total = 0; ecranMenu(); term.focus({ preventScroll: true }); }
        }
        return;
      }
      const k = KEYMAP[e.key] || (e.key.length === 1 ? e.key.toLowerCase() : null);
      if (!k) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault(); e.stopPropagation();
      touche(k);
    });

    /* ----- souris / tactile ----- */
    term.addEventListener("click", (e) => {
      if (S.ecran === "nom") { screen.querySelector(".pz-input")?.focus(); return; }
      term.focus({ preventScroll: true });
      const opt = e.target.closest("[data-opt]");
      if (opt) return touche(opt.dataset.opt);
      const cell = e.target.closest("[data-r]");
      if (cell && S.ecran === "jeu" && !S.suite && !S.occupe) {
        const r = +cell.dataset.r, c = +cell.dataset.c, cur = S.cur;
        if (cur.sel && Math.abs(r - cur.si) + Math.abs(c - cur.sj) === 1) return void permuter(r - cur.si, c - cur.sj);
        if (cur.l === r && cur.c === c) return touche("space");
        Object.assign(cur, { l: r, c, sel: false }); return render();
      }
      if (S.ecran === "msg" || S.suite) {
        if (S.suite && S.msg.some((m) => m.includes("(R)ecommencer"))) return;
        touche("enter");
      }
    });
    root.querySelector(".pz-pad").addEventListener("click", (e) => {
      const b = e.target.closest("[data-k]");
      if (!b) return;
      if (S.ecran === "nom") return term.focus();
      touche(b.dataset.k);
      term.focus({ preventScroll: true });
    });

    /* ----- affichage façon console ----- */
    const col = (n, txt) => `<span style="color:${PAL[n]}">${esc(txt)}</span>`;
    function render() {
      let h = "";
      if (S.ecran === "nom") {
        if (screen.querySelector(".pz-input")) return;      // ne pas effacer la saisie en cours
        h = `${col(15, " Bienvenue dans PLANTAMITZ ! ")}\n\n${col(15, "Entrez votre nom: ")}<input class="pz-input" maxlength="49" autocomplete="off" spellcheck="false" aria-label="Votre nom" enterkeyhint="go">\n\n` +
            col(8, "(Tapez votre prénom puis Entrée)");
        screen.innerHTML = h;
        setTimeout(() => screen.querySelector(".pz-input")?.focus({ preventScroll: true }), 30);
        return;
      } else if (S.ecran === "menu") {
        h = `${col(15, "    PLANTAMITZ 2026  ")}\n${col(15, "Joueur : " + S.nom)}\n\n` +
            `<span class="pz-opt" data-opt="1">${col(15, `1.Jouer (Niveau ${S.niveau})`)}</span>\n` +
            `<span class="pz-opt" data-opt="2">${col(15, "2.Règles du jeu")}</span>\n` +
            `<span class="pz-opt" data-opt="3">${col(15, "3.Quitter")}</span>\n${col(15, "Votre choix")}<span class="pz-caret">_</span>`;
      } else if (S.ecran === "msg") {
        h = S.msg.map((m) => col(/PERDU|ÉCOULÉ/.test(m) ? 12 : /TERMIN|FÉLICIT|Passage/.test(m) ? 10 : 15, m)).join("\n");
      } else if (S.ecran === "jeu") {
        h = renderJeu();
      }
      if (S.info) h += `\n${col(15, " " + S.info)}`;
      screen.innerHTML = h;
    }
    function renderJeu() {
      const c = S.contrat, t = S.plateau, cur = S.cur;
      const tr = tempsRestant(c);
      const tc = tr < 30 ? 12 : tr < 60 ? 14 : 10;
      let h = col(15, "============== CONTRAT =============") + "\n";
      h += col(tc, `== NIVEAU ${c.niveau} == Score: ${c.score} pts  vies: ${S.vies}/5  Temps:${pad2(Math.floor(tr / 60))}:${pad2(tr % 60)}`) + "\n";
      h += ITEMS.filter((k) => c.requis[k] > 0).map((k) => col(COUL[k], `${k}:${c.actuel[k]}/${c.requis[k]}`)).join(" ") + "\n";
      h += col(15, `Coups : ${c.coups} / ${c.coupsMax}`) + "\n";
      h += col(15, "=====================================") + "\n";
      for (let i = 0; i < L; i++) {
        let row = "  ";
        for (let j = 0; j < C; j++) {
          let it = t[i][j];
          const sel = cur.sel && i === cur.si && j === cur.sj;
          if (sel) it = it.toLowerCase();
          const isCur = i === cur.l && j === cur.c;
          const fl = S.flash && S.flash[i][j];
          const style = isCur ? `background:${PAL[15]};color:${PAL[0]}` :
                        fl ? `background:#3a3a3a;color:${PAL[COUL[t[i][j]] || 15]}` :
                        sel ? `background:#1f4f8f;color:${PAL[15]}` : `color:${PAL[COUL[t[i][j]] || 15]}`;
          row += `<span class="pz-c" data-r="${i}" data-c="${j}" style="${style}">${esc(it)} </span>`;
        }
        h += row + "\n";
      }
      if (S.suite) h += S.msg.map((m) => m.includes("(R)ecommencer")
        ? `<span class="pz-opt" data-opt="r">${col(14, "(R)ecommencer le niveau")}</span>${col(15, " | ")}<span class="pz-opt" data-opt="q">${col(14, "(Q)uitter")}</span>`
        : col(/PERDU|ÉCOULÉ|PLUS DE/.test(m) ? 12 : /TERMIN|FÉLICIT|Passage/.test(m) ? 10 : 15, m)).join("\n");
      return h;
    }

    tick = setInterval(() => {
      if (S.ecran === "jeu" && !S.suite) { render(); verifier(); }
    }, 1000);

    ecranDemarrage();
    S.musiqueVoulue = true; S.info = "Musique activée";
    render();
    setTimeout(() => (screen.querySelector(".pz-input") || term).focus({ preventScroll: true }), 50);

    return {
      destroy() { clearInterval(tick); musique.stop(); if (S.ecran === "jeu") sauver(); },
      hasFocus() { return root.contains(document.activeElement); },
    };
  }

  window.Plantamitz = { mount };
})();
