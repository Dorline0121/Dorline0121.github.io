/* =========================================================
   LAB 7 Power BI — tableau de bord SuperStore (version web)
   ---------------------------------------------------------
   Reproduit le fichier lAB7_SuperStore.pbix :
   - Rapport, page 1 : titre, carte Revenue, segments Region et
     Vendeur, histogramme Revenue par Categorie, courbe Total
     Margin par Mois (positions reprises du .pbix) ;
   - Rapport, page 2 : treemap Total Margin par Region avec le
     dégradé conditionnel (-900 rouge, 0 gris, max vert) et le
     texte d'analyse ;
   - Vue Données (table Feuil1 nettoyée, 50 lignes) ;
   - Power Query : les étapes appliquées, rejouées sur le fichier
     brut, avec les deux pièges rencontrés pendant le lab ;
   - Mesures DAX : Revenue et Total Margin.
   Les données viennent de SuperStore_Sales.xlsx (feuille Feuil1).
   ========================================================= */
(function () {
  // Fichier brut : chaque ligne est stockée dans UNE seule cellule (Column1)
  const BRUT = [ "Date_Commande,ID_Produit,Categorie,Region,Vendeur,Ventes,Profit,Quantite", "2023-01-15,P001,Informatique,Nord,Alice,1200.50,150.20,2", "2023-01-20,P002,Accessoire,Sud,Bob,45.00,5.00,1", "2023-01-25,P003,Bureau,Est,Charlie,350.00,-20.00,1", "2023-02-05,P004,Informatique,Ouest,Alice,899.99,100.50,1", "2023-02-10,P005,Audio,Nord,Bob,79.90,12.00,1", "2023-02-15,P006,Informatique,Sud,Charlie,1500.00,200.00,2", "2023-02-20,P007,Accessoire,Est,Alice,29.99,3.50,1", "2023-03-01,P008,Bureau,Ouest,Bob,450.00,-50.00,2", "2023-03-05,P009,Informatique,Nord,Charlie,299.00,40.00,1", "2023-03-12,P010,Audio,Sud,Alice,129.00,15.00,1", "2023-03-18,P011,Informatique,Est,Bob,1200.50,150.20,1", "2023-03-25,P012,Accessoire,Ouest,Charlie,89.99,10.00,2", "2023-04-02,P013,Bureau,Nord,Alice,199.00,-10.00,1", "2023-04-10,P014,Informatique,Sud,Bob,899.99,100.50,1", "2023-04-15,P015,Audio,Est,Charlie,45.00,5.00,1", "2023-04-22,P016,Informatique,Ouest,Alice,1500.00,200.00,2", "2023-04-28,P017,Accessoire,Nord,Bob,29.99,3.50,1", "2023-05-05,P018,Bureau,Sud,Charlie,350.00,-20.00,1", "2023-05-12,P019,Informatique,Est,Alice,299.00,40.00,1", "2023-05-20,P020,Audio,Ouest,Bob,129.00,15.00,1", "2023-05-25,P021,Informatique,Nord,Charlie,1200.50,150.20,2", "2023-06-01,P022,Accessoire,Sud,Alice,89.99,10.00,2", "2023-06-08,P023,Bureau,Est,Bob,199.00,-10.00,1", "2023-06-15,P024,Informatique,Ouest,Charlie,899.99,100.50,1", "2023-06-22,P025,Audio,Nord,Alice,45.00,5.00,1", "2023-06-28,P026,Informatique,Sud,Bob,1500.00,200.00,2", "2023-07-05,P027,Accessoire,Est,Charlie,29.99,3.50,1", "2023-07-12,P028,Bureau,Ouest,Alice,350.00,-20.00,1", "2023-07-18,P029,Informatique,Nord,Bob,299.00,40.00,1", "2023-07-25,P030,Audio,Sud,Charlie,129.00,15.00,1", "2023-08-02,P031,Informatique,Est,Alice,1200.50,150.20,1", "2023-08-10,P032,Accessoire,Ouest,Bob,89.99,10.00,2", "2023-08-15,P033,Bureau,Nord,Charlie,199.00,-10.00,1", "2023-08-22,P034,Informatique,Sud,Alice,899.99,100.50,1", "2023-08-29,P035,Audio,Est,Bob,45.00,5.00,1", "2023-09-05,P036,Informatique,Ouest,Charlie,1500.00,200.00,2", "2023-09-12,P037,Accessoire,Nord,Alice,29.99,3.50,1", "2023-09-20,P038,Bureau,Sud,Bob,350.00,-20.00,1", "2023-09-27,P039,Informatique,Est,Charlie,299.00,40.00,1", "2023-10-04,P040,Audio,Ouest,Alice,129.00,15.00,1", "2023-10-11,P041,Informatique,Nord,Bob,1200.50,150.20,2", "2023-10-18,P042,Accessoire,Sud,Charlie,89.99,10.00,2", "2023-10-25,P043,Bureau,Est,Alice,199.00,-10.00,1", "2023-11-02,P044,Informatique,Ouest,Bob,899.99,100.50,1", "2023-11-09,P045,Audio,Nord,Charlie,45.00,5.00,1", "2023-11-16,P046,Informatique,Sud,Alice,1500.00,200.00,2", "2023-11-23,P047,Accessoire,Est,Bob,29.99,3.50,1", "2023-11-30,P048,Bureau,Ouest,Charlie,350.00,-20.00,1", "2023-12-07,P049,Informatique,Nord,Alice,299.00,40.00,1", "2023-12-14,P050,Audio,Sud,Bob,129.00,15.00,1"
];

  const COLS = ["Date_Commande", "ID_Produit", "Categorie", "Region", "Vendeur", "Ventes", "Profit", "Quantite"];
  const TYPES = { Date_Commande: "date", ID_Produit: "texte", Categorie: "texte", Region: "texte", Vendeur: "texte", Ventes: "decimal", Profit: "decimal", Quantite: "entier" };
  const PBI_BLEU = "#118DFF";

  const TXT = {
    fr: {
      vues: { rapport: "Rapport", donnees: "Données", pq: "Power Query", dax: "Mesures DAX" },
      page: "Page", titre: " Tableau de bord des ventes - SuperStore 2023",
      revenueCat: "Revenue par Categorie", marginMois: "Total Margin par Mois", marginRegion: "Total Margin par Region",
      mois: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
      moisAxe: "Mois", categorie: "Categorie", effacer: "Effacer les sélections",
      aide: "Cliquez sur un segment, une colonne ou un point de la courbe : les autres visuels se recalculent, comme dans Power BI.",
      aide2: "Cliquez sur un bloc pour le mettre en avant. Couleur : dégradé conditionnel sur Total Margin (−900 rouge, 0 gris, valeur la plus élevée vert).",
      analyseTitre: "Analyse de la marge par région :",
      analyse: " Le Treemap montre que toutes les régions sont rentables (aucune en rouge). La région Sud est la plus profitable (831 €, vert foncé), suivie de l’Ouest (661,5 €) et du Nord (579,6 €). La région Est est la moins performante (360,9 €, vert clair) : elle reste positive mais demande une action commerciale pour améliorer sa marge. À noter : la catégorie Bureau génère des pertes (-190 €), ce qui pèse sur les résultats.",
      lignes: "lignes", colonnes: "colonnes", table: "Table : Feuil1",
      etapes: "Étapes appliquées", apercu: "Aperçu à cette étape",
      steps: [
        ["Source", "Classeur Excel SuperStore_Sales.xlsx."],
        ["Navigation", "Feuille Feuil1 : une seule colonne (Column1), 51 lignes. Toutes les valeurs d'une commande sont collées, séparées par des virgules."],
        ["Fractionner la colonne par délimiteur", "Column1 fractionnée sur la virgule, à chaque occurrence : 8 colonnes."],
        ["En-têtes promus", "La première ligne devient l'en-tête : 8 colonnes nommées, 50 lignes."],
        ["Type modifié avec paramètres régionaux", "Ventes et Profit en nombre décimal, paramètres régionaux Anglais (États-Unis) : 1200.50 est lu 1200,5."],
        ["Type modifié", "Date_Commande en Date, Quantite en Nombre entier."],
      ],
      piege1: "Simuler l'erreur : promouvoir les en-têtes deux fois",
      piege1Txt: "Erreur rencontrée : la première commande devient l'en-tête, il ne reste que 49 lignes. Corrigé en supprimant l'étape en trop dans « Étapes appliquées ».",
      piege2: "Simuler l'erreur : convertir sans paramètres régionaux anglais",
      piege2Txt: "Erreur évitée : Power BI est configuré en français (virgule décimale), le point est ignoré et 1200.50 devient 120050. Le chiffre d'affaires serait faux d'un facteur 100.",
      daxTitre: "Mesures créées sur la table Feuil1", daxLead: "Des mesures plutôt que des colonnes brutes : elles se recalculent selon les filtres actifs (segments, clics sur les visuels).",
      valeurActuelle: "Valeur sans filtre",
      type: { date: "Date", texte: "Texte", decimal: "Nombre décimal", entier: "Nombre entier" },
    },
    en: {
      vues: { rapport: "Report", donnees: "Data", pq: "Power Query", dax: "DAX measures" },
      page: "Page", titre: " Sales dashboard - SuperStore 2023",
      revenueCat: "Revenue by Categorie", marginMois: "Total Margin by Month", marginRegion: "Total Margin by Region",
      mois: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      moisAxe: "Month", categorie: "Categorie", effacer: "Clear selections",
      aide: "Click a slicer, a column or a point on the line: the other visuals recalculate, just like in Power BI.",
      aide2: "Click a block to highlight it. Colour: conditional gradient on Total Margin (−900 red, 0 grey, highest value green).",
      analyseTitre: "Margin analysis by region:",
      analyse: " The Treemap shows that every region is profitable (none in red). The South is the most profitable region (€831, dark green), followed by the West (€661.5) and the North (€579.6). The East performs worst (€360.9, light green): it stays positive but needs a commercial action to improve its margin. Note: the Bureau (office) category makes a loss (−€190), which weighs on the results.",
      lignes: "rows", colonnes: "columns", table: "Table: Feuil1",
      etapes: "Applied steps", apercu: "Preview at this step",
      steps: [
        ["Source", "Excel workbook SuperStore_Sales.xlsx."],
        ["Navigation", "Sheet Feuil1: a single column (Column1), 51 rows. All the values of an order are stuck together, separated by commas."],
        ["Split column by delimiter", "Column1 split on the comma, at each occurrence: 8 columns."],
        ["Promoted headers", "The first row becomes the header: 8 named columns, 50 rows."],
        ["Changed type with locale", "Ventes and Profit as decimal numbers, locale English (United States): 1200.50 is read as 1200.5."],
        ["Changed type", "Date_Commande as Date, Quantite as Whole number."],
      ],
      piege1: "Simulate the mistake: promote headers twice",
      piege1Txt: "Mistake made during the lab: the first order becomes the header and only 49 rows remain. Fixed by deleting the extra step in “Applied steps”.",
      piege2: "Simulate the mistake: convert without the English locale",
      piege2Txt: "Mistake avoided: Power BI runs with French settings (decimal comma), so the dot is ignored and 1200.50 becomes 120050. Revenue would be wrong by a factor of 100.",
      daxTitre: "Measures created on table Feuil1", daxLead: "Measures rather than raw columns: they recalculate with the active filters (slicers, clicks on visuals).",
      valeurActuelle: "Value with no filter",
      type: { date: "Date", texte: "Text", decimal: "Decimal number", entier: "Whole number" },
    },
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Power Query : les étapes, rejouées sur le fichier brut ---------- */
  function etapes(piegeEntetes, piegeLocale) {
    const res = [];
    const t0 = BRUT.map((l) => [l]);
    res.push({ cols: ["Column1"], rows: t0 });                                    // Source
    res.push({ cols: ["Column1"], rows: t0 });                                    // Navigation
    const t2 = BRUT.map((l) => l.split(","));                                     // Fractionner
    res.push({ cols: COLS.map((_, i) => `Column1.${i + 1}`), rows: t2 });
    let cols = t2[0], rows = t2.slice(1);                                          // En-têtes promus
    if (piegeEntetes) { cols = rows[0]; rows = rows.slice(1); }                    // ... deux fois
    res.push({ cols, rows });
    const num = (s) => (piegeLocale ? parseFloat(s.replace(".", "")) : parseFloat(s));
    const iV = cols.indexOf("Ventes") >= 0 ? cols.indexOf("Ventes") : 5, iP = cols.indexOf("Profit") >= 0 ? cols.indexOf("Profit") : 6;
    const rows4 = rows.map((r) => r.map((v, i) => (i === iV || i === iP ? num(v) : v)));
    res.push({ cols, rows: rows4, num: [iV, iP] });
    const rows5 = rows4.map((r) => r.map((v, i) => (i === 7 ? parseInt(v, 10) : v)));
    res.push({ cols, rows: rows5, num: [iV, iP, 7], date: 0 });
    return res;
  }
  const TABLE = etapes(false, false)[5].rows.map((r) => ({
    Date_Commande: r[0], ID_Produit: r[1], Categorie: r[2], Region: r[3], Vendeur: r[4], Ventes: r[5], Profit: r[6], Quantite: r[7], mois: +r[0].slice(5, 7),
  }));

  function mount(root, lang) {
    const T = TXT[lang] || TXT.fr;
    const fr = lang !== "en";
    const loc = fr ? "fr-FR" : "en-US";
    const nb = (v, d = 2) => v.toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d });
    const k = (v) => (Math.abs(v) >= 1000 ? nb(v / 1000, 2) + "K" : nb(v, Math.abs(v) % 1 ? 1 : 0));
    const ax = (v) => (Math.abs(v) >= 1000 ? (v / 1000).toLocaleString(loc, { maximumFractionDigits: 1 }) + "K" : String(Math.round(v)));
    const dateFr = (s) => { const [y, m, d] = s.split("-"); return fr ? `${d}/${m}/${y}` : `${m}/${d}/${y}`; };

    const S = { vue: "rapport", page: 1, regions: new Set(), vendeurs: new Set(), cat: null, mois: null, bloc: null, step: 5, p1: false, p2: false, tri: null };
    const CATS = ["Informatique", "Bureau", "Audio", "Accessoire"];
    const REGIONS = ["Est", "Nord", "Ouest", "Sud"], VENDEURS = ["Alice", "Bob", "Charlie"];

    root.innerHTML = `
      <div class="ss-app">
        <div class="ss-rail" role="tablist" aria-label="Vues">
          ${["rapport", "donnees", "pq", "dax"].map((v) => `<button type="button" role="tab" class="ss-vue" data-vue="${v}">${T.vues[v]}</button>`).join("")}
        </div>
        <div class="ss-main"></div>
      </div>`;
    const main = root.querySelector(".ss-main");

    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-vue],[data-page],[data-reg],[data-ven],[data-cat],[data-mois],[data-bloc],[data-act],[data-step],[data-tri]");
      if (!t) {
        // clic dans le vide d'un visuel : efface la sélection croisée
        if (e.target.closest(".ss-visual")) { S.cat = null; S.mois = null; S.bloc = null; render(); }
        return;
      }
      const d = t.dataset;
      if (d.vue) S.vue = d.vue;
      else if (d.page) S.page = +d.page;
      else if (d.reg) toggle(S.regions, d.reg);
      else if (d.ven) toggle(S.vendeurs, d.ven);
      else if (d.cat) { S.cat = S.cat === d.cat ? null : d.cat; S.mois = null; }
      else if (d.mois) { S.mois = S.mois === +d.mois ? null : +d.mois; S.cat = null; }
      else if (d.bloc) S.bloc = S.bloc === d.bloc ? null : d.bloc;
      else if (d.step) S.step = +d.step;
      else if (d.tri) S.tri = S.tri && S.tri.col === d.tri ? { col: d.tri, asc: !S.tri.asc } : { col: d.tri, asc: true };
      else if (d.act === "clear-reg") S.regions.clear();
      else if (d.act === "clear-ven") S.vendeurs.clear();
      else if (d.act === "clear-all") { S.regions.clear(); S.vendeurs.clear(); S.cat = null; S.mois = null; }
      render();
    });
    root.addEventListener("change", (e) => {
      if (e.target.id === "ss-p1") S.p1 = e.target.checked;
      if (e.target.id === "ss-p2") S.p2 = e.target.checked;
      render();
    });
    root.addEventListener("keydown", (e) => {
      const t = e.target.closest("[data-cat],[data-mois],[data-bloc]");
      if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); t.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
    });
    const toggle = (set, v) => (set.has(v) ? set.delete(v) : set.add(v));

    /* ----- filtres : segments + filtrage croisé ----- */
    const parSegments = (r) => (!S.regions.size || S.regions.has(r.Region)) && (!S.vendeurs.size || S.vendeurs.has(r.Vendeur));
    const somme = (rows, f) => rows.reduce((s, r) => s + r[f], 0);

    function render() {
      root.querySelectorAll("[data-vue]").forEach((b) => b.setAttribute("aria-selected", b.dataset.vue === S.vue));
      if (S.vue === "rapport") main.innerHTML = rapport();
      else if (S.vue === "donnees") main.innerHTML = donnees();
      else if (S.vue === "pq") main.innerHTML = powerQuery();
      else main.innerHTML = dax();
    }

    /* =================== Vue Rapport =================== */
    function rapport() {
      const page = S.page === 1 ? page1() : page2();
      return `
        <p class="ss-aide">${S.page === 1 ? T.aide : T.aide2}
          ${S.page === 1 && (S.regions.size || S.vendeurs.size || S.cat || S.mois) ? `<button type="button" class="ss-link" data-act="clear-all">${T.effacer}</button>` : ""}</p>
        <div class="ss-canvas">${page}</div>
        <div class="ss-tabs">${[1, 2].map((p) => `<button type="button" class="ss-tab" data-page="${p}" aria-selected="${S.page === p}">${T.page} ${p}</button>`).join("")}</div>`;
    }

    function page1() {
      const base = TABLE.filter(parSegments);
      const pourCarte = base.filter((r) => (!S.cat || r.Categorie === S.cat) && (!S.mois || r.mois === S.mois));
      const pourColonnes = base.filter((r) => !S.mois || r.mois === S.mois);
      const pourLigne = base.filter((r) => !S.cat || r.Categorie === S.cat);
      const pos = (x, y, w, h) => `style="left:${(x / 1920) * 100}%;top:${(y / 1080) * 100}%;width:${(w / 1920) * 100}%;height:${(h / 1080) * 100}%"`;
      const segment = (titre, valeurs, set, attr, clear) => `
        <div class="ss-visual ss-slicer" ${pos(...titre.pos)}>
          <div class="ss-slicer-h"><span>${titre.nom}</span>${set.size ? `<button type="button" class="ss-x" data-act="${clear}" aria-label="${T.effacer}">⌫</button>` : ""}</div>
          ${valeurs.map((v) => `<button type="button" class="ss-opt" data-${attr}="${v}" aria-pressed="${set.has(v)}"><i></i>${v}</button>`).join("")}
        </div>`;
      return `
        <div class="ss-visual ss-titre" ${pos(367, 0, 1052, 87)}><b>${T.titre}</b></div>
        <div class="ss-visual ss-card" ${pos(10, 130, 381, 196)}><b>${k(somme(pourCarte, "Ventes"))}</b><span>Revenue</span></div>
        ${segment({ nom: "Region", pos: [698, 130, 379, 196] }, REGIONS, S.regions, "reg", "clear-reg")}
        ${segment({ nom: "Vendeur", pos: [1405, 130, 354, 196] }, VENDEURS, S.vendeurs, "ven", "clear-ven")}
        <div class="ss-visual ss-chart" ${pos(10, 405, 1016, 610)}><p class="ss-vt">${T.revenueCat}</p>${colonnes(pourColonnes, base)}</div>
        <div class="ss-visual ss-chart" ${pos(1047, 405, 872, 610)}><p class="ss-vt">${T.marginMois}</p>${ligne(pourLigne)}</div>`;
    }

    function colonnes(rows, tousSansMois) {
      const W = 600, H = 330, L = 44, R = 10, Tp = 12, B = 46;
      const vals = CATS.map((c) => somme(rows.filter((r) => r.Categorie === c), "Ventes"));
      const max = Math.max(1, ...vals);
      const pas = max > 10000 ? 4000 : max > 4000 ? 2000 : max > 1000 ? 500 : 100;
      const top = Math.ceil(max / pas) * pas;
      const Y = (v) => H - B - (v / top) * (H - B - Tp);
      const bw = (W - L - R) / CATS.length;
      let s = "";
      for (let v = 0; v <= top + 1e-9; v += pas) s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="ss-g"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${ax(v)}</text>`;
      CATS.forEach((c, i) => {
        const v = vals[i], x = L + i * bw + bw * 0.18, w = bw * 0.64, dim = S.cat && S.cat !== c;
        s += `<rect x="${x}" y="${Y(Math.max(0, v))}" width="${w}" height="${Math.max(0, Y(0) - Y(Math.max(0, v)))}" fill="${PBI_BLEU}" opacity="${dim ? 0.3 : 1}" class="ss-hit" data-cat="${c}" tabindex="0" role="button" aria-pressed="${S.cat === c}" aria-label="${c} ${nb(v)}"><title>${c} · Revenue ${nb(v)} €</title></rect>`;
        s += `<text x="${x + w / 2}" y="${H - B + 16}" text-anchor="middle">${c}</text>`;
      });
      s += `<text x="${(L + W - R) / 2}" y="${H - 6}" text-anchor="middle" class="ss-ax">${T.categorie}</text>`;
      s += `<text transform="translate(11 ${(H - B + Tp) / 2}) rotate(-90)" text-anchor="middle" class="ss-ax">Revenue</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${T.revenueCat}">${s}</svg>`;
    }

    function ligne(rows) {
      const W = 520, H = 330, L = 44, R = 12, Tp = 14, B = 62;
      const vals = T.mois.map((_, i) => somme(rows.filter((r) => r.mois === i + 1), "Profit"));
      const mn = Math.min(0, ...vals), mx = Math.max(1, ...vals);
      const pas = mx - mn > 600 ? 200 : mx - mn > 250 ? 100 : 50;
      const y0 = Math.floor(mn / pas) * pas, y1 = Math.ceil(mx / pas) * pas;
      const X = (i) => L + (i / 11) * (W - L - R);
      const Y = (v) => H - B - ((v - y0) / (y1 - y0 || 1)) * (H - B - Tp);
      let s = "";
      for (let v = y0; v <= y1 + 1e-9; v += pas) s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="ss-g"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${ax(v)}</text>`;
      // courbe lissée sans dépassement (interpolation monotone de Fritsch-Carlson)
      const pts = vals.map((v, i) => [X(i), Y(v)]);
      const n = pts.length, dx = [], m = [], tg = new Array(n).fill(0);
      for (let i = 0; i < n - 1; i++) { dx.push(pts[i + 1][0] - pts[i][0]); m.push((pts[i + 1][1] - pts[i][1]) / dx[i]); }
      tg[0] = m[0]; tg[n - 1] = m[n - 2];
      for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 0; i < n - 1; i++) {
        const h = dx[i] / 3;
        d += ` C${pts[i][0] + h} ${pts[i][1] + tg[i] * h} ${pts[i + 1][0] - h} ${pts[i + 1][1] - tg[i + 1] * h} ${pts[i + 1][0]} ${pts[i + 1][1]}`;
      }
      s += `<path d="${d}" fill="none" stroke="${PBI_BLEU}" stroke-width="2.5"/>`;
      vals.forEach((v, i) => {
        const on = S.mois === i + 1;
        s += `<circle cx="${X(i)}" cy="${Y(v)}" r="${on ? 6 : 4}" fill="${on ? "#0B5CAD" : PBI_BLEU}" opacity="${S.mois && !on ? 0.4 : 1}" class="ss-hit" data-mois="${i + 1}" tabindex="0" role="button" aria-pressed="${on}" aria-label="${T.mois[i]} ${nb(v, 1)}"><title>${T.mois[i]} · Total Margin ${nb(v, 1)} €</title></circle>`;
        s += `<text transform="translate(${X(i) + 3} ${H - B + 12}) rotate(-40)" text-anchor="end">${T.mois[i]}</text>`;
      });
      s += `<text x="${(L + W - R) / 2}" y="${H - 4}" text-anchor="middle" class="ss-ax">${T.moisAxe}</text>`;
      s += `<text transform="translate(11 ${(H - B + Tp) / 2}) rotate(-90)" text-anchor="middle" class="ss-ax">Total Margin</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${T.marginMois}">${s}</svg>`;
    }

    /* ----- page 2 : treemap + analyse ----- */
    function couleur(v, max) {
      // dégradé à 3 points du .pbix : -900 #D64545, 0 #E0E0E0, max #2E9E4F
      const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      const mix = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * Math.min(1, Math.max(0, t))));
      const c = v < 0 ? mix(hex("#E0E0E0"), hex("#D64545"), v / -900) : mix(hex("#E0E0E0"), hex("#2E9E4F"), v / max);
      return `rgb(${c.join(",")})`;
    }
    function squarify(items, x, y, w, h) {
      // algorithme « squarified » (Bruls et al.) pour des rectangles proches du carré
      const out = [], tot = items.reduce((s, i) => s + i.v, 0);
      let rest = items.map((i) => ({ ...i, a: (i.v / tot) * w * h }));
      while (rest.length) {
        const court = Math.min(w, h);
        let row = [rest[0]], i = 1;
        const pire = (r) => { const s = r.reduce((a, b) => a + b.a, 0); return Math.max(...r.map((b) => Math.max((court * court * b.a) / (s * s), (s * s) / (court * court * b.a)))); };
        while (i < rest.length && pire([...row, rest[i]]) <= pire(row)) { row.push(rest[i]); i++; }
        const s = row.reduce((a, b) => a + b.a, 0);
        if (w >= h) { const cw = s / h; let yy = y; row.forEach((b) => { const bh = b.a / cw; out.push({ ...b, x, y: yy, w: cw, h: bh }); yy += bh; }); x += cw; w -= cw; }
        else { const ch = s / w; let xx = x; row.forEach((b) => { const bw = b.a / ch; out.push({ ...b, x: xx, y, w: bw, h: ch }); xx += bw; }); y += ch; h -= ch; }
        rest = rest.slice(row.length);
      }
      return out;
    }
    function page2() {
      const items = REGIONS.map((r) => ({ n: r, v: somme(TABLE.filter((x) => x.Region === r), "Profit") })).sort((a, b) => b.v - a.v);
      const max = Math.max(...items.map((i) => i.v));
      const W = 949, H = 718;
      const rects = squarify(items, 0, 0, W, H);
      const s = rects.map((r) => `<g class="ss-hit" data-bloc="${r.n}" tabindex="0" role="button" aria-pressed="${S.bloc === r.n}" aria-label="${r.n} ${nb(r.v, 1)}" opacity="${S.bloc && S.bloc !== r.n ? 0.35 : 1}">
          <rect x="${r.x + 1}" y="${r.y + 1}" width="${r.w - 2}" height="${r.h - 2}" fill="${couleur(r.v, max)}"><title>Region ${r.n} · Total Margin ${nb(r.v, 1)} €</title></rect>
          <text x="${r.x + 12}" y="${r.y + 30}" class="ss-tm-l">${r.n}</text>
          <text x="${r.x + 12}" y="${r.y + 56}" class="ss-tm-v">${nb(r.v, 1)} €</text></g>`).join("");
      const pos = (x, y, w, h) => `style="left:${(x / 1920) * 100}%;top:${(y / 1080) * 100}%;width:${(w / 1920) * 100}%;height:${(h / 1080) * 100}%"`;
      return `
        <div class="ss-visual ss-chart ss-tree" ${pos(10, 0, 949, 718)}><p class="ss-vt">${T.marginRegion}</p>
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${T.marginRegion}">${s}</svg></div>
        <div class="ss-visual ss-texte" ${pos(1118, 27, 767, 1000)}><p><b>${T.analyseTitre}</b>${T.analyse}</p></div>`;
    }

    /* =================== Vue Données =================== */
    function donnees() {
      let rows = TABLE.slice();
      if (S.tri) rows.sort((a, b) => (a[S.tri.col] < b[S.tri.col] ? -1 : a[S.tri.col] > b[S.tri.col] ? 1 : 0) * (S.tri.asc ? 1 : -1));
      const ico = (c) => (TYPES[c] === "date" ? "📅" : TYPES[c] === "texte" ? "ABC" : "Σ");
      const cell = (r, c) => (c === "Date_Commande" ? dateFr(r[c]) : TYPES[c] === "decimal" ? nb(r[c], r[c] % 1 ? 2 : 0).replace(/,00$/, "") : r[c]);
      return `
        <p class="ss-aide">${T.table} · ${COLS.length} ${T.colonnes} · ${rows.length} ${T.lignes}</p>
        <div class="ss-grid-wrap"><table class="ss-grid">
          <thead><tr>${COLS.map((c) => `<th class="${TYPES[c] !== "texte" && TYPES[c] !== "date" ? "num" : ""}"><button type="button" data-tri="${c}" title="${T.type[TYPES[c]]}"><span class="ss-ico">${ico(c)}</span>${c}${S.tri && S.tri.col === c ? (S.tri.asc ? " ▲" : " ▼") : ""}</button></th>`).join("")}</tr></thead>
          <tbody>${rows.map((r) => `<tr>${COLS.map((c) => `<td class="${TYPES[c] !== "texte" && TYPES[c] !== "date" ? "num" : ""}">${esc(cell(r, c))}</td>`).join("")}</tr>`).join("")}</tbody>
        </table></div>`;
    }

    /* =================== Vue Power Query =================== */
    function powerQuery() {
      const all = etapes(S.p1, S.p2), st = all[S.step];
      const apercu = st.rows.slice(0, 12);
      const fmt = (v, i) => {
        if (typeof v === "number") return nb(v, Number.isInteger(v) ? 0 : 2).replace(/,00$|\.00$/, "");
        if (st.date === 0 && i === 0) return dateFr(v);
        return v;
      };
      const piege = (S.step === 3 && S.p1) || (S.step >= 4 && S.p2);
      return `
        <div class="ss-pq">
          <div class="ss-pq-steps"><p class="ss-pq-h">${T.etapes}</p>
            <ol>${T.steps.map(([n], i) => `<li><button type="button" data-step="${i}" aria-pressed="${S.step === i}">${n}</button></li>`).join("")}</ol>
            <label class="ss-chk"><input type="checkbox" id="ss-p1" ${S.p1 ? "checked" : ""}> ${T.piege1}</label>
            <label class="ss-chk"><input type="checkbox" id="ss-p2" ${S.p2 ? "checked" : ""}> ${T.piege2}</label>
          </div>
          <div class="ss-pq-main">
            <p class="ss-pq-h">${T.apercu} · ${st.cols.length} ${T.colonnes}, ${st.rows.length} ${T.lignes}</p>
            <p class="ss-aide">${T.steps[S.step][1]}</p>
            ${S.p1 && S.step >= 3 ? `<p class="ss-warn">${T.piege1Txt}</p>` : ""}
            ${S.p2 && S.step >= 4 ? `<p class="ss-warn">${T.piege2Txt}</p>` : ""}
            <div class="ss-grid-wrap"><table class="ss-grid ${piege ? "bad" : ""}">
              <thead><tr><th class="idx"></th>${st.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
              <tbody>${apercu.map((r, n) => `<tr><td class="idx">${n + 1}</td>${r.map((v, i) => `<td class="${typeof v === "number" ? "num" : ""}">${esc(fmt(v, i))}</td>`).join("")}</tr>`).join("")}</tbody>
            </table></div>
          </div>
        </div>`;
    }

    /* =================== Vue Mesures DAX =================== */
    function dax() {
      const m = [["Revenue", "SUM(Feuil1[Ventes])", somme(TABLE, "Ventes")], ["Total Margin", "SUM(Feuil1[Profit])", somme(TABLE, "Profit")]];
      return `
        <p class="ss-pq-h">${T.daxTitre}</p><p class="ss-aide">${T.daxLead}</p>
        <div class="ss-dax">${m.map(([n, f, v]) => `<div><pre><code><span class="kw">${n}</span> = <span class="fn">${f.split("(")[0]}</span>(${f.split("(")[1]}</code></pre>
          <p>${T.valeurActuelle} : <b>${nb(v)} €</b></p></div>`).join("")}</div>`;
    }

    render();
    return { destroy() {} };
  }

  window.SuperStoreDemo = { mount };
})();
