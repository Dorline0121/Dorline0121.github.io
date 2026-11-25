/* =========================================================
   Tableau de bord « Analyse des ventes » interactif
   ---------------------------------------------------------
   Reproduit le rapport Power BI à partir des transactions
   extraites du fichier .pbix (assets/ventes-data.js).
   Comportement identique au rapport :
   - le segment « state » filtre tous les visuels ;
   - le segment « Mois » filtre tout SAUF la courbe « Evolution du C.A » ;
   - le camembert et le top 3 clients excluent les marques vides ;
   - en plus : un clic sur une part du camembert filtre les autres
     visuels par marque (comme le filtrage croisé de Power BI).
   ========================================================= */
(function () {
  const COLORS = {
    "Solex": "#118DFF", "WeareA2B": "#E66C37", "Giant Bicycles": "#6B007B",
    "Trek Bicycles": "#12239E", "OHM Cycles": "#E044A7", "Norco Bicycles": "#744EC2",
  };
  const TXT = {
    fr: {
      months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
      title: "Analyse des ventes", k1: "Chiffre d'affaires", k2: "Nombre de transactions", k3: "Taux de marge moyen", k4: "CA Solex",
      state: "État", month: "Mois", clear: "Effacer", reset: "Réinitialiser les filtres",
      line: "Evolution du C.A", pie: "Répartition selon les marques", funnel: "Top 3 clients (CA)", hist: "Distribution des ventes selon patrimoine",
      yLine: "Chiffre d'affaires", yHist: "Nombre de transactions", xHist: "property_valuation",
      lineNote: "Non filtré par le mois, comme dans le rapport", brandOn: "Marque filtrée :", empty: "Aucune donnée pour cette sélection",
      loading: "Chargement des données…", fail: "Impossible de charger les données du tableau de bord.",
      hint: "Cliquez sur un État, un ou plusieurs mois, ou une part du camembert : tous les visuels se recalculent.",
      client: "client",
    },
    en: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      title: "Sales analysis", k1: "Revenue", k2: "Transactions", k3: "Average margin rate", k4: "Solex revenue",
      state: "State", month: "Month", clear: "Clear", reset: "Reset filters",
      line: "Revenue trend", pie: "Revenue by brand", funnel: "Top 3 customers (revenue)", hist: "Sales by property valuation",
      yLine: "Revenue", yHist: "Transactions", xHist: "property_valuation",
      lineNote: "Not filtered by month, as in the report", brandOn: "Brand filter:", empty: "No data for this selection",
      loading: "Loading data…", fail: "The dashboard data could not be loaded.",
      hint: "Click a state, one or more months, or a pie slice: every visual recalculates.",
      client: "customer",
    },
  };

  /* ---------- chargement des données (une seule fois) ---------- */
  let dataPromise = null;
  function loadData() {
    if (window.VENTES_DATA) return Promise.resolve(window.VENTES_DATA);
    if (!dataPromise) {
      dataPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "assets/ventes-data.js";
        s.onload = () => (window.VENTES_DATA ? resolve(window.VENTES_DATA) : reject());
        s.onerror = () => { dataPromise = null; reject(); };
        document.head.appendChild(s);
      });
    }
    return dataPromise;
  }

  /* ---------- formats façon Power BI (unités auto) ---------- */
  function fmt(lang) {
    const dec = (v, d) => v.toFixed(d).replace(".", lang === "fr" ? "," : ".");
    return {
      auto(v) {
        if (Math.abs(v) >= 1e6) return dec(v / 1e6, 2) + "M";
        if (Math.abs(v) >= 1e3) return dec(v / 1e3, 2) + "K";
        return String(Math.round(v));
      },
      axis(v, step) {
        if (Math.abs(step) >= 1e5 || Math.abs(v) >= 1e6) return dec(v / 1e6, step >= 1e6 ? 0 : 1) + "M";
        if (Math.abs(v) >= 1e3) return dec(v / 1e3, step >= 1e3 ? 0 : 1) + "K";
        return String(Math.round(v));
      },
      pct(v, d = 2) { return dec(v, d) + (lang === "fr" ? " %" : "%"); },
      pctTight(v) { return dec(v, 2) + "%"; },
    };
  }
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const BIKE = `<svg viewBox="0 0 64 40" width="56" height="35" aria-hidden="true"><g fill="none" stroke="#1a1a1a" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="27" r="10"/><circle cx="51" cy="27" r="10"/><path d="M13 27 24 11h20L51 27M24 11l9 16 11-16M33 27l-6-20h-6M44 11l-2-6h6"/></g></svg>`;

  /* =========================================================
     Montage du tableau de bord dans un conteneur
     ========================================================= */
  function mount(root, lang) {
    const T = TXT[lang] || TXT.fr;
    const F = fmt(lang);
    root.innerHTML = `<p class="pbi-loading">${T.loading}</p>`;
    loadData().then((D) => build(root, D, T, F), () => (root.innerHTML = `<p class="pbi-loading">${T.fail}</p>`));
  }

  function build(root, D, T, F) {
    const N = D.s.length;
    const sel = { states: new Set(), months: new Set(), brand: null };

    root.innerHTML = `
      <div class="pbi-bar">
        <p class="pbi-hint">${T.hint}</p>
        <button type="button" class="pbi-reset" data-act="reset">${T.reset}</button>
      </div>
      <div class="pbi">
        <div class="pbi-logo">${BIKE}</div>
        <div class="pbi-kpis">
          <div class="pbi-kpi"><b data-k="ca"></b><span>${T.k1}</span></div>
          <div class="pbi-kpi"><b data-k="n"></b><span>${T.k2}</span></div>
          <h4 class="pbi-title">${T.title}</h4>
          <div class="pbi-kpi"><b data-k="tm"></b><span>${T.k3}</span></div>
          <div class="pbi-kpi"><b data-k="solex"></b><span>${T.k4}</span></div>
        </div>
        <div class="pbi-slicers">
          <div class="pbi-slicer">
            <div class="pbi-slicer-head"><span>state</span><button type="button" class="pbi-clear" data-act="clear-s" title="${T.clear}" aria-label="${T.clear} (${T.state})" hidden>✕</button></div>
            <div class="pbi-opts" role="group" aria-label="${T.state}">
              ${D.states.map((s, i) => `<button type="button" class="pbi-opt" data-s="${i}" aria-pressed="false"><i></i>${esc(s)}</button>`).join("")}
            </div>
          </div>
          <div class="pbi-slicer">
            <div class="pbi-slicer-head"><span>Mois</span><button type="button" class="pbi-clear" data-act="clear-m" title="${T.clear}" aria-label="${T.clear} (${T.month})" hidden>✕</button></div>
            <div class="pbi-opts pbi-months" role="group" aria-label="${T.month}">
              ${T.months.map((m, i) => `<button type="button" class="pbi-opt" data-m="${i + 1}" aria-pressed="false"><i></i>${m}</button>`).join("")}
            </div>
          </div>
        </div>
        <section class="pbi-card pbi-line"><h5>${T.line}</h5><div class="pbi-plot" data-v="line"></div></section>
        <section class="pbi-card pbi-pie"><h5>${T.pie}</h5><div class="pbi-plot" data-v="pie"></div></section>
        <section class="pbi-card pbi-funnel"><h5>${T.funnel}</h5><div class="pbi-plot" data-v="funnel"></div></section>
        <section class="pbi-card pbi-hist"><h5>${T.hist}</h5><div class="pbi-plot" data-v="hist"></div></section>
      </div>`;

    const q = (s) => root.querySelector(s);

    root.addEventListener("click", (e) => {
      const opt = e.target.closest(".pbi-opt");
      const act = e.target.closest("[data-act]");
      const slice = e.target.closest("[data-brand]");
      if (opt) {
        const set = opt.dataset.s !== undefined ? sel.states : sel.months;
        const v = Number(opt.dataset.s ?? opt.dataset.m);
        set.has(v) ? set.delete(v) : set.add(v);
      } else if (act) {
        const a = act.dataset.act;
        if (a === "clear-s") sel.states.clear();
        if (a === "clear-m") sel.months.clear();
        if (a === "reset") { sel.states.clear(); sel.months.clear(); sel.brand = null; }
      } else if (slice) {
        const b = Number(slice.dataset.brand);
        sel.brand = sel.brand === b ? null : b;
      } else return;
      render();
    });
    root.addEventListener("keydown", (e) => {
      const slice = e.target.closest("[data-brand]");
      if (slice && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); slice.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
    });

    function render() {
      // état des segments
      root.querySelectorAll("[data-s]").forEach((b) => b.setAttribute("aria-pressed", sel.states.has(Number(b.dataset.s))));
      root.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", sel.months.has(Number(b.dataset.m))));
      q('[data-act="clear-s"]').hidden = !sel.states.size;
      q('[data-act="clear-m"]').hidden = !sel.months.size;

      // un seul passage sur les 19 821 transactions
      let ca = 0, n = 0, tmSum = 0, tmN = 0, solex = 0;
      const months = new Array(12).fill(0);
      const brands = new Array(D.brands.length).fill(0);
      const cust = new Map();
      const hist = new Array(13).fill(0);
      const solexIdx = D.brands.indexOf("Solex");
      for (let i = 0; i < N; i++) {
        if (sel.states.size && !sel.states.has(D.s[i])) continue;
        const b = D.b[i], p = D.p[i] / 100;
        const brandOk = sel.brand === null || b === sel.brand;
        if (brandOk) months[D.m[i] - 1] += p;                       // courbe : ignore le mois
        if (sel.months.size && !sel.months.has(D.m[i])) continue;
        if (b !== 0) brands[b] += p;                                // camembert : sans marque vide
        if (!brandOk) continue;
        ca += p; n++;
        if (D.t[i] >= 0) { tmSum += D.t[i] / 1e5; tmN++; }
        if (b === solexIdx) solex += p;
        if (b !== 0) cust.set(D.c[i], (cust.get(D.c[i]) || 0) + p);   // top 3 : sans marque vide
        if (D.v[i]) hist[D.v[i]]++;
      }

      q('[data-k="ca"]').textContent = F.auto(ca);
      q('[data-k="n"]').textContent = n.toLocaleString(TXT.fr === T ? "fr-FR" : "en-US");
      q('[data-k="tm"]').textContent = tmN ? F.pct((tmSum / tmN) * 100) : "—";
      q('[data-k="solex"]').textContent = F.auto(solex);

      q('[data-v="line"]').innerHTML = lineSVG(months);
      q('[data-v="pie"]').innerHTML = pieSVG(brands);
      const top = [...cust.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
      q('[data-v="funnel"]').innerHTML = funnelSVG(top);
      q('[data-v="hist"]').innerHTML = histSVG(hist);
    }

    /* ---------- Courbe : évolution du CA par mois ---------- */
    function lineSVG(vals) {
      const W = 460, H = 230, L = 58, R = 14, Tp = 14, B = 64;
      const max = Math.max(...vals), min = Math.min(...vals);
      if (max <= 0) return emptySVG(W, H);
      let step = niceStep((max - min) / 2 || max / 2);
      let y0 = Math.floor(min / step) * step, y1 = Math.ceil(max / step) * step;
      if (y1 === y0) y1 = y0 + step;
      if (y0 > 0 && (y1 - y0) / step < 2) y0 -= step;
      const X = (i) => L + (i / 11) * (W - L - R);
      const Y = (v) => H - B - ((v - y0) / (y1 - y0)) * (H - B - Tp);
      let s = "";
      for (let v = y0; v <= y1 + 1e-6; v += step) {
        s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="g"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end">${F.axis(v, step)}</text>`;
      }
      s += `<path d="${vals.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ")}" fill="none" stroke="#AE5129" stroke-width="2.5" stroke-linejoin="round"/>`;
      vals.forEach((v, i) => {
        const on = sel.months.has(i + 1);
        s += `<circle cx="${X(i)}" cy="${Y(v)}" r="${on ? 5 : 3.2}" fill="${on ? "#1a1a1a" : "#AE5129"}"><title>${T.months[i]} : ${F.auto(v)}</title></circle>`;
        s += `<text transform="translate(${X(i) + 4} ${H - B + 14}) rotate(-38)" text-anchor="end">${T.months[i]}</text>`;
      });
      s += `<text transform="translate(14 ${(H - B + Tp) / 2}) rotate(-90)" text-anchor="middle" class="ax">${T.yLine}</text>`;
      s += `<text x="${(L + W - R) / 2}" y="${H - 4}" text-anchor="middle" class="ax">${T.month}</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T.line)}">${s}</svg>`;
    }

    /* ---------- Camembert : part de CA par marque ---------- */
    function pieSVG(vals) {
      const W = 460, H = 230, cx = 230, cy = 116, r = 78;
      const items = D.brands.map((name, i) => ({ name, i, v: vals[i] })).filter((d) => d.i !== 0 && d.v > 0).sort((a, b) => b.v - a.v);
      const tot = items.reduce((s, d) => s + d.v, 0);
      if (!tot) return emptySVG(W, H);
      let a = -Math.PI / 2, s = "";
      const labels = [];
      items.forEach((d) => {
        const da = (d.v / tot) * Math.PI * 2, a1 = a + da, mid = a + da / 2;
        const p0 = [cx + r * Math.cos(a), cy + r * Math.sin(a)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
        const dim = sel.brand !== null && sel.brand !== d.i;
        const path = items.length === 1
          ? `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
          : `M${cx} ${cy}L${p0[0].toFixed(2)} ${p0[1].toFixed(2)}A${r} ${r} 0 ${da > Math.PI ? 1 : 0} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}Z`;
        s += `<path d="${path}" fill="${COLORS[d.name] || "#999"}" fill-opacity="${dim ? 0.25 : 1}" stroke="#fff" stroke-width="1" class="slice" data-brand="${d.i}" tabindex="0" role="button" aria-pressed="${sel.brand === d.i}" aria-label="${esc(d.name)} ${F.pctTight((d.v / tot) * 100)}"><title>${esc(d.name)} : ${F.auto(d.v)}</title></path>`;
        labels.push({ d, mid, pct: (d.v / tot) * 100, dim });
        a = a1;
      });
      // étiquettes à gauche / à droite, écartées pour ne pas se chevaucher
      ["L", "R"].forEach((side) => {
        const group = labels.filter((l) => (Math.cos(l.mid) >= 0 ? "R" : "L") === side)
          .map((l) => ({ ...l, y: cy + (r + 14) * Math.sin(l.mid) })).sort((p, q) => p.y - q.y);
        for (let k = 1; k < group.length; k++) if (group[k].y - group[k - 1].y < 15) group[k].y = group[k - 1].y + 15;
        const over = group.length ? group[group.length - 1].y - (H - 8) : 0;
        if (over > 0) group.forEach((g) => (g.y -= over));
        group.forEach((l) => {
          const ex = cx + (r + 2) * Math.cos(l.mid), ey = cy + (r + 2) * Math.sin(l.mid);
          const kx = cx + (r + 16) * Math.cos(l.mid);
          const tx = side === "R" ? cx + r + 30 : cx - r - 30;
          s += `<polyline points="${ex.toFixed(1)},${ey.toFixed(1)} ${kx.toFixed(1)},${l.y.toFixed(1)} ${tx},${l.y.toFixed(1)}" fill="none" stroke="#999" stroke-width="1" opacity="${l.dim ? 0.4 : 1}"/>`;
          s += `<text x="${side === "R" ? tx + 4 : tx - 4}" y="${l.y + 4}" text-anchor="${side === "R" ? "start" : "end"}" opacity="${l.dim ? 0.45 : 1}">${esc(l.d.name)} ${F.pctTight(l.pct)}</text>`;
        });
      });
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T.pie)}">${s}</svg>`;
    }

    /* ---------- Entonnoir : top 3 clients ---------- */
    function funnelSVG(top) {
      const W = 460, H = 190, L = 62, R = 10;
      if (!top.length) return emptySVG(W, H);
      const max = top[0][1], full = W - L - R, rowH = 56;
      let s = "";
      top.forEach(([id, v], k) => {
        const w = Math.max(40, (v / max) * full), x = L + (full - w) / 2, y = 12 + k * rowH;
        s += `<text x="${L - 10}" y="${y + rowH / 2 + 2}" text-anchor="end">${id}</text>`;
        s += `<rect x="${x}" y="${y + 4}" width="${w}" height="${rowH - 10}" fill="#AE5129"><title>${T.client} ${id} : ${F.auto(v)}</title></rect>`;
        s += `<text x="${L + full / 2}" y="${y + rowH / 2 + 3}" text-anchor="middle" class="in">${F.auto(v)}</text>`;
      });
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T.funnel)}">${s}</svg>`;
    }

    /* ---------- Histogramme : ventes selon le patrimoine ---------- */
    function histSVG(counts) {
      const W = 460, H = 230, L = 58, R = 14, Tp = 12, B = 42;
      const max = Math.max(...counts.slice(1));
      if (!max) return emptySVG(W, H);
      const step = niceStep(max / 4), y1 = Math.ceil(max / step) * step;
      const X = (v) => L + (v / 12.6) * (W - L - R);
      const Y = (v) => H - B - (v / y1) * (H - B - Tp);
      let s = "";
      for (let v = 0; v <= y1 + 1e-6; v += step) s += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="g"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`;
      [0, 5, 10].forEach((v) => (s += `<line x1="${X(v)}" x2="${X(v)}" y1="${Tp}" y2="${H - B}" class="g"/><text x="${X(v)}" y="${H - B + 15}" text-anchor="middle">${v}</text>`));
      const bw = (X(1) - X(0)) * 0.8;
      for (let v = 1; v <= 12; v++) {
        if (!counts[v]) continue;
        s += `<rect x="${X(v) - bw / 2}" y="${Y(counts[v])}" width="${bw}" height="${H - B - Y(counts[v])}" fill="#AE5129"><title>property_valuation ${v} : ${counts[v]}</title></rect>`;
      }
      s += `<text transform="translate(14 ${(H - B + Tp) / 2}) rotate(-90)" text-anchor="middle" class="ax">${T.yHist}</text>`;
      s += `<text x="${(L + W - R) / 2}" y="${H - 4}" text-anchor="middle" class="ax">${T.xHist}</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T.hist)}">${s}</svg>`;
    }

    function emptySVG(W, H) {
      return `<svg viewBox="0 0 ${W} ${H}"><text x="${W / 2}" y="${H / 2}" text-anchor="middle">${T.empty}</text></svg>`;
    }

    render();
  }

  window.SalesDashboard = { mount };
})();
