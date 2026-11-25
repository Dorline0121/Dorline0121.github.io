/* =====================================================================
   Démo statique de SECEL Commandes (projet de Lauwa Lesly)
   Les pages de ce dossier sont celles produites par l'application PHP en
   local (mêmes HTML, CSS et JS). Ce script remplace seulement le serveur :
   connexion par rôle, inscription, commande, suivi et étapes de livraison.
   L'état (commandes, livraisons) est gardé pendant la session du navigateur.
   ===================================================================== */
(function () {
  const SEED = {"livraisons":[{"id":4,"code":"SEC-0004-E85A","commande":4,"client":"Samuel Eto","produit":"Casque VR Immersif (x1), Enceinte Holographique (x1)","montant":137500,"destination":"Kribi","statut":"En préparation","etape":0,"livreur":"","km":192,"prevue":"2025-03-18","maj":"2025-03-16 09:00:00","itineraire":[{"ville":"Douala","lat":4.0511,"lng":9.7679},{"ville":"Edéa","lat":3.8,"lng":10.1333},{"ville":"Kribi","lat":2.94,"lng":9.91}],"historique":[{"statut":"Confirmée","ville":"Douala","commentaire":"Commande enregistrée, prise en charge par l'entrepôt de Douala","date_evenement":"2025-03-15 18:30:00"},{"statut":"En préparation","ville":"Douala","commentaire":"Colis préparé à l'entrepôt","date_evenement":"2025-03-16 09:00:00"}]},{"id":3,"code":"SEC-0003-B41E","commande":3,"client":"Lycée de Deido","produit":"Projecteur Laser 4K (x2)","montant":620000,"destination":"Garoua","statut":"En transit","etape":4,"livreur":"Moussa Abdoulaye","km":1187,"prevue":"2025-03-18","maj":"2025-03-15 17:45:00","itineraire":[{"ville":"Douala","lat":4.0511,"lng":9.7679},{"ville":"Edéa","lat":3.8,"lng":10.1333},{"ville":"Yaoundé","lat":3.848,"lng":11.5021},{"ville":"Bafia","lat":4.75,"lng":11.2333},{"ville":"Ngaoundéré","lat":7.327,"lng":13.5847},{"ville":"Garoua","lat":9.3011,"lng":13.3921}],"historique":[{"statut":"Confirmée","ville":"Douala","commentaire":"Commande enregistrée, prise en charge par l'entrepôt de Douala","date_evenement":"2025-03-12 09:30:00"},{"statut":"En préparation","ville":"Douala","commentaire":"Colis préparé à l'entrepôt","date_evenement":"2025-03-12 14:00:00"},{"statut":"Expédiée","ville":"Douala","commentaire":"Départ du camion de Douala","date_evenement":"2025-03-13 05:45:00"},{"statut":"En transit","ville":"Edéa","commentaire":"Passage à Edéa","date_evenement":"2025-03-13 07:50:00"},{"statut":"En transit","ville":"Yaoundé","commentaire":"Passage à Yaoundé","date_evenement":"2025-03-13 12:30:00"},{"statut":"En transit","ville":"Bafia","commentaire":"Passage à Bafia","date_evenement":"2025-03-14 08:10:00"},{"statut":"En transit","ville":"Ngaoundéré","commentaire":"Passage à Ngaoundéré","date_evenement":"2025-03-15 17:45:00"}]},{"id":2,"code":"SEC-0002-3C9D","commande":2,"client":"Marie Ngo","produit":"Montre Connectée Pro (x1)","montant":85000,"destination":"Yaoundé","statut":"En transit","etape":1,"livreur":"Rodrigue Ekane","km":262,"prevue":"2025-03-13","maj":"2025-03-11 15:20:00","itineraire":[{"ville":"Douala","lat":4.0511,"lng":9.7679},{"ville":"Edéa","lat":3.8,"lng":10.1333},{"ville":"Yaoundé","lat":3.848,"lng":11.5021}],"historique":[{"statut":"Confirmée","ville":"Douala","commentaire":"Commande enregistrée, prise en charge par l'entrepôt de Douala","date_evenement":"2025-03-10 17:00:00"},{"statut":"En préparation","ville":"Douala","commentaire":"Colis préparé à l'entrepôt","date_evenement":"2025-03-11 08:30:00"},{"statut":"Expédiée","ville":"Douala","commentaire":"Départ du camion de Douala","date_evenement":"2025-03-11 13:00:00"},{"statut":"En transit","ville":"Edéa","commentaire":"Passage à Edéa","date_evenement":"2025-03-11 15:20:00"}]},{"id":1,"code":"SEC-0001-A7F2","commande":1,"client":"Boutique Akwa Tech","produit":"Smartphone Futuristic X (x5)","montant":149500,"destination":"Bafoussam","statut":"Livrée","etape":3,"livreur":"Jean-Paul Mbida","km":236,"prevue":"2025-03-06","maj":"2025-03-05 15:10:00","itineraire":[{"ville":"Douala","lat":4.0511,"lng":9.7679},{"ville":"Nkongsamba","lat":4.9547,"lng":9.9404},{"ville":"Bafang","lat":5.15,"lng":10.1833},{"ville":"Bafoussam","lat":5.4778,"lng":10.4176}],"historique":[{"statut":"Confirmée","ville":"Douala","commentaire":"Commande enregistrée, prise en charge par l'entrepôt de Douala","date_evenement":"2025-03-03 10:30:00"},{"statut":"En préparation","ville":"Douala","commentaire":"Colis préparé à l'entrepôt","date_evenement":"2025-03-03 16:00:00"},{"statut":"Expédiée","ville":"Douala","commentaire":"Départ du camion de Douala","date_evenement":"2025-03-04 06:30:00"},{"statut":"En transit","ville":"Nkongsamba","commentaire":"Passage à Nkongsamba","date_evenement":"2025-03-04 10:15:00"},{"statut":"En transit","ville":"Bafang","commentaire":"Passage à Bafang","date_evenement":"2025-03-04 14:40:00"},{"statut":"Arrivée en ville","ville":"Bafoussam","commentaire":"Arrivée à Bafoussam","date_evenement":"2025-03-05 09:00:00"},{"statut":"Livrée","ville":"Bafoussam","commentaire":"Colis remis au client","date_evenement":"2025-03-05 15:10:00"}]}],"villes":{"Douala":[4.0511,9.7679,"Littoral"],"Edéa":[3.8,10.1333,"Littoral"],"Nkongsamba":[4.9547,9.9404,"Littoral"],"Yaoundé":[3.848,11.5021,"Centre"],"Mbalmayo":[3.5167,11.5,"Centre"],"Bafia":[4.75,11.2333,"Centre"],"Kribi":[2.94,9.91,"Sud"],"Ebolowa":[2.9,11.15,"Sud"],"Sangmélima":[2.9333,11.9833,"Sud"],"Limbé":[4.0167,9.2,"Sud-Ouest"],"Buea":[4.1527,9.241,"Sud-Ouest"],"Kumba":[4.6333,9.45,"Sud-Ouest"],"Bafang":[5.15,10.1833,"Ouest"],"Dschang":[5.45,10.0667,"Ouest"],"Bafoussam":[5.4778,10.4176,"Ouest"],"Foumban":[5.7267,10.9,"Ouest"],"Bamenda":[5.9631,10.1591,"Nord-Ouest"],"Bertoua":[4.5772,13.6846,"Est"],"Ngaoundéré":[7.327,13.5847,"Adamaoua"],"Garoua":[9.3011,13.3921,"Nord"],"Maroua":[10.5956,14.3247,"Extrême-Nord"],"Kousseri":[12.0769,15.0306,"Extrême-Nord"]},"itineraires":{"Douala":["Douala"],"Edéa":["Douala","Edéa"],"Yaoundé":["Douala","Edéa","Yaoundé"],"Mbalmayo":["Douala","Edéa","Yaoundé","Mbalmayo"],"Ebolowa":["Douala","Edéa","Yaoundé","Mbalmayo","Ebolowa"],"Sangmélima":["Douala","Edéa","Yaoundé","Mbalmayo","Sangmélima"],"Bafia":["Douala","Edéa","Yaoundé","Bafia"],"Bertoua":["Douala","Edéa","Yaoundé","Bertoua"],"Ngaoundéré":["Douala","Edéa","Yaoundé","Bafia","Ngaoundéré"],"Garoua":["Douala","Edéa","Yaoundé","Bafia","Ngaoundéré","Garoua"],"Maroua":["Douala","Edéa","Yaoundé","Bafia","Ngaoundéré","Garoua","Maroua"],"Kousseri":["Douala","Edéa","Yaoundé","Bafia","Ngaoundéré","Garoua","Maroua","Kousseri"],"Kribi":["Douala","Edéa","Kribi"],"Limbé":["Douala","Limbé"],"Buea":["Douala","Buea"],"Kumba":["Douala","Kumba"],"Nkongsamba":["Douala","Nkongsamba"],"Bafang":["Douala","Nkongsamba","Bafang"],"Dschang":["Douala","Nkongsamba","Dschang"],"Bafoussam":["Douala","Nkongsamba","Bafang","Bafoussam"],"Foumban":["Douala","Nkongsamba","Bafang","Bafoussam","Foumban"],"Bamenda":["Douala","Nkongsamba","Bafang","Bafoussam","Bamenda"]},"clients":[{"num_client":1,"nom_client":"Boutique Akwa Tech","ville":"Douala","adresse":"Rue Joss","adr_client":"Rue Joss"},{"num_client":2,"nom_client":"Marie Ngo","ville":"Douala","adresse":"Bonapriso","adr_client":"Bonapriso"},{"num_client":3,"nom_client":"Lycée de Deido","ville":"Douala","adresse":"Deido","adr_client":"Deido"},{"num_client":4,"nom_client":"Samuel Eto","ville":"Yaoundé","adresse":"Bastos","adr_client":"Bastos"}],"produits":[{"id":1,"nom":"Smartphone Futuristic X","prix_unitaire":"29900.00"},{"id":2,"nom":"Montre Connectée Pro","prix_unitaire":"85000.00"},{"id":3,"nom":"Casque VR Immersif","prix_unitaire":"17500.00"},{"id":4,"nom":"Drone Caméra 8K","prix_unitaire":"230000.00"},{"id":5,"nom":"Enceinte Holographique","prix_unitaire":"120000.00"},{"id":6,"nom":"Ordinateur Portable Quantum","prix_unitaire":"450000.00"},{"id":7,"nom":"Projecteur Laser 4K","prix_unitaire":"310000.00"}],"comptes":{"admin@secel.cm":["admin123","admin"],"client@secel.cm":["client123","user"]}};
  const SS = window.sessionStorage;
  const lire = (k, d) => { try { const v = SS.getItem("lauwa:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const ecrire = (k, v) => { try { SS.setItem("lauwa:" + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } };
  const etat = lire("etat", null) || { livraisons: SEED.livraisons, prochaine: Math.max(...SEED.livraisons.map((l) => l.commande)) + 1 };
  const sauver = () => ecrire("etat", etat);

  const chemin = location.pathname, page = (chemin.split("/").pop() || "index.html").replace(/\.html$/, "");
  const dossier = /\/admin\//.test(chemin) ? "admin" : /\/project\//.test(chemin) ? "project" : "";
  const params = new URLSearchParams(location.search);

  /* ---------- URL : x.php?a=b -> x__a-b.html ---------- */
  function statique(url) {
    const [p, q = ""] = String(url).split("?");
    if (!/\.(php|html)$/.test(p) || !q || /^https?:/.test(p)) return url.replace(/\.php(?=$|\?)/, ".html");
    const suf = q.split("&").filter(Boolean).map((kv) => { const [k, v = ""] = kv.split("="); return "__" + k.replace(/[^A-Za-z0-9-]/g, "") + "-" + decodeURIComponent(v).replace(/[^A-Za-z0-9-]/g, ""); }).join("");
    return p.replace(/\.(php|html)$/, "") + suf + ".html";
  }
  const F = window.fetch; window.fetch = (u, o) => F(typeof u === "string" ? statique(u) : u, o && o.method === "POST" ? { ...o, method: "GET", body: undefined } : o);
  const XO = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function (m, u, ...r) { return XO.call(this, "GET", statique(u), ...r); };

  /* ---------- rôle (session PHP) ---------- */
  const role = lire("role", null);
  if (dossier === "admin" && role !== "admin") location.replace("../index.html");

  /* ---------- règles de livraison (portage de livraison_lib.php) ---------- */
  const STATUTS = ["Confirmée", "En préparation", "Expédiée", "En transit", "Arrivée en ville", "Livrée"];
  const maintenant = () => { const d = new Date(), z = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`; };
  const histo = (l, statut, ville, commentaire) => l.historique.push({ statut, ville, commentaire, date_evenement: maintenant() });
  function avancer(l) {
    if (!l || l.statut === "Livrée") return;
    const it = l.itineraire.map((p) => p.ville), der = it.length - 1; let msg;
    switch (l.statut) {
      case "Confirmée": l.statut = "En préparation"; msg = "Colis préparé à l'entrepôt"; break;
      case "En préparation": l.statut = der === 0 ? "Arrivée en ville" : "Expédiée"; msg = der === 0 ? "Livraison locale à Douala" : "Départ du camion de Douala"; break;
      case "Expédiée": case "En transit": l.etape++; l.statut = l.etape >= der ? "Arrivée en ville" : "En transit"; msg = l.etape >= der ? "Arrivée à " + it[der] : "Passage à " + it[l.etape]; break;
      default: l.statut = "Livrée"; msg = "Colis remis au client";
    }
    l.etape = Math.min(l.etape, der); l.maj = maintenant();
    histo(l, l.statut, it[l.etape], msg);
  }
  function km(a, b) { const [la1, lo1] = SEED.villes[a], [la2, lo2] = SEED.villes[b], r = Math.PI / 180, h = Math.sin((la2 - la1) * r / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin((lo2 - lo1) * r / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(h)); }
  function detecterVille(t) {
    const s = String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return Object.keys(SEED.villes).find((v) => s.includes(v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""))) || "Douala";
  }
  function creerLivraison(client, produit, montant, ville) {
    const dest = SEED.itineraires[ville] ? ville : "Douala", it = SEED.itineraires[dest];
    const kmT = Math.round(it.slice(1).reduce((s, v, i) => s + km(it[i], v), 0) * 1.3), jours = Math.max(1, Math.ceil(kmT / 350)) + 1;
    const cmd = etat.prochaine++, code = `SEC-${String(cmd).padStart(4, "0")}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
    const prevue = new Date(); prevue.setDate(prevue.getDate() + jours);
    const l = { id: Math.max(...etat.livraisons.map((x) => x.id)) + 1, code, commande: cmd, client, produit, montant, destination: dest, statut: "Confirmée", etape: 0, livreur: "", km: kmT, prevue: prevue.toISOString().slice(0, 10), maj: maintenant(), itineraire: it.map((v) => ({ ville: v, lat: SEED.villes[v][0], lng: SEED.villes[v][1] })), historique: [] };
    histo(l, "Confirmée", "Douala", "Commande enregistrée, prise en charge par l'entrepôt de Douala");
    etat.livraisons.unshift(l); sauver();
    return l;
  }

  // données lues par les scripts des pages (dash2 et suivi), avant qu'ils s'exécutent
  window.DEMO_LIVRAISONS = etat.livraisons.slice().sort((a, b) => (b.maj > a.maj ? 1 : -1));
  if (page === "suivi__resultat") window.DEMO_LIVRAISON = etat.livraisons.find((l) => l.code === (params.get("code") || "").toUpperCase()) || null;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const dfr = (d) => (d ? d.slice(0, 10).split("-").reverse().join("/") : "");
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- tableau de bord : section Livraisons recalculée depuis l'état ---------- */
  function rendreSectionLivraisons() {
    const tb = $("#liv-tbody"), kp = $("#liv-kpis");
    const L = window.DEMO_LIVRAISONS, n = (st) => L.filter((l) => st.includes(l.statut)).length;
    if (kp) [n(["Confirmée", "En préparation"]), n(["Expédiée", "En transit"]), n(["Arrivée en ville"]), n(["Livrée"])].forEach((v, i) => { const b = kp.children[i] && kp.children[i].querySelector(".text-2xl"); if (b) b.textContent = v; });
    const tot = $("#livraisons-section .deliveries-total"); if (tot) tot.textContent = L.length;
    if (!tb) return;
    tb.innerHTML = L.map((l) => {
      const pos = l.itineraire[Math.min(l.etape, l.itineraire.length - 1)].ville;
      return `<tr class="delivery-row cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-100" data-status="${esc(l.statut)}" data-liv="${l.id}">
        <td class="px-4 py-3 whitespace-nowrap text-sm font-mono">${esc(l.code)}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm"><span>${esc(l.client || "")}</span></td>
        <td class="px-4 py-3 whitespace-nowrap text-sm">Douala → ${esc(l.destination)} <span class="text-gray-400">(${l.km} km)</span></td>
        <td class="px-4 py-3 whitespace-nowrap text-sm">${esc(pos)}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm">${dfr(l.prevue)}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm"><span class="px-2 py-1 text-xs rounded-full text-white liv-badge" data-s="${esc(l.statut)}">${esc(l.statut)}</span></td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-right">${l.statut !== "Livrée" ? `<form method="post" action="livraison_action.html" class="inline"><input type="hidden" name="action" value="avancer"><input type="hidden" name="id" value="${l.id}"><button class="px-2 py-1 bg-primary text-white rounded text-xs" title="Passer à l'étape suivante"><i class="fas fa-forward mr-1"></i>Étape suivante</button></form>` : `<span class="text-green-600 text-xs"><i class="fas fa-check"></i> terminée</span>`}
        <a class="ml-2 text-gray-500 hover:text-primary" href="../project/suivi__resultat.html?code=${encodeURIComponent(l.code)}" target="_blank" title="Page de suivi client"><i class="fas fa-external-link-alt"></i></a></td></tr>`;
    }).join("");
    const msg = lire("flash", null);
    if (msg) { ecrire("flash", null); const d = document.createElement("div"); d.className = "mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-800 text-sm"; d.textContent = msg; kp && kp.before(d); }
  }
  if (dossier === "admin" && page === "dash2") {
    // dès que le tableau est entièrement lu par le navigateur (avant le script de la carte)
    const obs = new MutationObserver(() => { if ($("#invoice-preview")) { obs.disconnect(); rendreSectionLivraisons(); } });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  /* ---------- formulaires et liens qui allaient au serveur ---------- */
  document.addEventListener("submit", (e) => {
    const f = e.target, act = (f.getAttribute("action") || "").split("/").pop();
    const v = (n) => (f.elements[n] ? f.elements[n].value : "");
    const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    // connexion (traitement2.php)
    if (/^traitement2\./.test(act)) {
      stop();
      const em = v("email2").trim().toLowerCase(), comptes = { ...SEED.comptes, ...lire("inscrits", {}) }, c = comptes[em];
      if (!c || c[0] !== v("mot_de_passe2")) { document.body.innerHTML = "Email ou mot de passe incorrect."; return; }
      ecrire("role", c[1]); location.href = c[1] === "admin" ? "admin/dash2.html" : "project/index.html"; return;
    }
    // inscription (traitement.php)
    if (/^traitement\./.test(act)) {
      stop();
      const em = v("email").trim().toLowerCase(), ins = lire("inscrits", {});
      if (SEED.comptes[em] || ins[em]) { location.href = "traitement__deja.html"; return; }
      ins[em] = [v("mot_de_passe"), v("role") || "user"]; ecrire("inscrits", ins); location.href = "traitement__ok.html"; return;
    }
    // étapes de livraison et livreur (admin/livraison_action.php)
    if (/^livraison_action\./.test(act)) {
      stop();
      const id = +v("id"), l = etat.livraisons.find((x) => x.id === id);
      if (v("action") === "avancer" && l) { avancer(l); ecrire("flash", `${l.code} : ${l.statut}`); }
      if (v("action") === "livreur" && l) { l.livreur = v("livreur").trim(); l.maj = maintenant(); ecrire("flash", "Livreur attribué"); }
      sauver(); location.href = `dash2.html?section=livraisons&liv=${id}`; return;
    }
    // nouvelle commande depuis le tableau de bord (admin/add_commande.php)
    if (/^add_commande\./.test(act)) {
      stop();
      const cl = SEED.clients.find((c) => String(c.num_client) === v("client_id"));
      if (!cl) { location.href = "dash2.html?erreur=commande"; return; }
      const prods = $$('[name="products[]"]', f).map((s) => s.value), qs = $$('[name="quantities[]"]', f).map((q) => Math.max(1, +q.value || 1));
      let total = 0; const lignes = [];
      prods.forEach((id, i) => { const p = SEED.produits.find((x) => String(x.id) === id); if (p) { lignes.push(`${p.nom} (x${qs[i]})`); total += qs[i] * p.prix_unitaire; } });
      creerLivraison(cl.nom_client, lignes.join(", "), total, detecterVille(`${cl.ville} ${cl.adresse} ${cl.adr_client}`));
      location.href = "dash2.html?succes=commande"; return;
    }
    // commande depuis la boutique (project/order.php)
    if (/^order\./.test(act)) {
      stop();
      let panier = []; try { panier = JSON.parse(v("order_data") || "[]"); } catch (x) { panier = []; }
      const total = panier.reduce((s, x) => s + x.price * x.quantity, 0), prod = panier.map((x) => `${x.name} (x${x.quantity})`).join(", ");
      const ville = SEED.itineraires[v("ville")] ? v("ville") : detecterVille(v("address"));
      const l = creerLivraison(v("name"), prod, total, ville);
      location.href = `suivi__resultat.html?nouvelle=1&code=${encodeURIComponent(l.code)}`; return;
    }
    // recherche d'un code de suivi (project/suivi.php, méthode GET)
    if (dossier === "project" && f.elements.code && !act) {
      stop();
      const code = v("code").trim().toUpperCase();
      location.href = etat.livraisons.some((l) => l.code === code) ? `suivi__resultat.html?code=${encodeURIComponent(code)}` : `suivi.html?code=${encodeURIComponent(code)}`; return;
    }
    // autres formulaires du tableau de bord : le serveur enregistrait puis revenait au tableau de bord
    if (dossier === "admin" && /\.(html|php)$/.test(act)) { stop(); location.href = "dash2.html"; }
  }, true);
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a"); if (!a) return;
    const h = a.getAttribute("href") || "";
    if (/logout\.html$/.test(h)) { e.preventDefault(); ecrire("role", null); location.href = dossier ? "../index.html" : "index.html"; }
    const m = /suivi__code-([A-Za-z0-9-]+)\.html/.exec(h);
    if (m) { e.preventDefault(); location.href = `suivi__resultat.html?code=${m[1]}`; }
    if (/suppression__/.test(h)) { e.preventDefault(); location.href = "dash2.html"; }
  }, true);

  /* ---------- pages de suivi : textes rendus par PHP recalculés ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (page === "suivi" && params.get("code")) {
      const code = params.get("code").toUpperCase(), inp = $('input[name="code"]'); if (inp) inp.value = code;
      const d = document.createElement("div"); d.className = "suivi-alerte ko"; d.textContent = `Aucune livraison ne correspond au code « ${code} ».`;
      const f = $(".suivi-form"); if (f) f.after(d);
    }
    if (page === "suivi__resultat") {
      const l = window.DEMO_LIVRAISON;
      if (!l) { location.replace("suivi.html?code=" + encodeURIComponent(params.get("code") || "")); return; }
      const inp = $('input[name="code"]'); if (inp) inp.value = l.code;
      const h3 = $(".suivi-info h3"); if (h3) h3.textContent = "Colis " + l.code;
      const dd = $$(".suivi-kv dd");
      if (dd.length >= 5) { dd[0].textContent = `Douala → ${l.destination} (≈ ${l.km} km)`; dd[2].textContent = dfr(l.prevue); dd[3].textContent = l.livreur || "bientôt attribué"; dd[4].textContent = l.produit || ""; }
      $$(".suivi-alerte.ok").forEach((x) => x.remove());
      if (params.get("nouvelle")) {
        const d = document.createElement("div"); d.className = "suivi-alerte ok";
        d.innerHTML = `Merci ! Votre commande n° ${l.commande} est enregistrée. Gardez votre code de suivi : <b>${esc(l.code)}</b>`;
        const f = $(".suivi-form"); if (f) f.after(d);
      }
    }
  });
})();
