/* =====================================================================
   Démo statique de SECEL Formation
   Les pages HTML de ce dossier sont les pages réellement produites par
   l'application PHP en local (mêmes HTML, CSS et JS). Ce script remplace
   uniquement le serveur : connexion par rôle, formulaires, suppressions,
   appels AJAX. Les ajouts sont gardés pendant la session du navigateur.
   ===================================================================== */
(function () {
  const SS = window.sessionStorage;
  const lire = (k, d) => { try { return JSON.parse(SS.getItem("gestion:" + k)) ?? d; } catch (e) { return d; } };
  const ecrire = (k, v) => { try { SS.setItem("gestion:" + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } };
  const chemin = location.pathname;
  const dossier = /\/Admin\//.test(chemin) ? "Admin" : /\/ClassTeacher\//.test(chemin) ? "ClassTeacher" : "";
  const page = (chemin.split("/").pop() || "index.html").replace(/\.html$/, "");
  const base = page.split("__")[0];

  // nom statique d'une URL PHP : x.php?a=b -> x__a-b.html
  function statique(url) {
    const [p, q = ""] = url.split("?");
    if (!/\.php$/.test(p)) return url;
    const suf = q ? q.split("&").filter(Boolean).map((kv) => { const [k, v = ""] = kv.split("="); return "__" + k.replace(/[^A-Za-z0-9-]/g, "") + "-" + decodeURIComponent(v).replace(/[^A-Za-z0-9-]/g, ""); }).join("") : "";
    return p.replace(/\.php$/, "") + suf + ".html";
  }
  const XO = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, url, ...r) { return XO.call(this, "GET", statique(String(url)), ...r); };

  // ---------- rôles (équivalent de Includes/session.php) ----------
  const role = lire("role", null);
  if (dossier === "Admin" && role !== "Administrator") location.replace("../index.html");
  if (dossier === "ClassTeacher" && role !== "ClassTeacher") location.replace("../index.html");

  window.DemoShim = {
    logout() { ecrire("role", null); location.replace("../index.html"); },
  };

  const pret = (f) => (document.readyState === "complete" ? setTimeout(f, 0) : window.addEventListener("load", () => setTimeout(f, 0)));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const texteOption = (sel) => (sel && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].text.trim() : "");
  const auj = new Date().toISOString().slice(0, 10);
  function messageAvant(form, html) {
    $$(".demo-msg").forEach((x) => x.remove());
    const d = document.createElement("div"); d.className = "demo-msg"; d.innerHTML = html;
    form.parentNode.insertBefore(d, form);
  }

  // ---------- connexion (index.php) ----------
  function pageConnexion() {
    const f = $('form.user'); if (!f || !f.userType) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const r = f.userType.value, u = f.username.value.trim().toLowerCase(), p = f.password.value;
      if (r === "Administrator" && u === "admin@secel.cm" && p === "Password@123") { ecrire("role", r); location.href = "Admin/index.html"; return; }
      if (r === "ClassTeacher" && u === "teacher@secel.cm" && p === "pass123") { ecrire("role", r); location.href = "ClassTeacher/index.html"; return; }
      $$(".demo-err").forEach((x) => x.remove());
      const d = document.createElement("div"); d.className = "demo-err";
      d.innerHTML = "<div class='alert alert-danger' role='alert'>\n        Invalid Username/Password!\n        </div>";
      f.after(d);
    });
  }

  // ---------- pages d'administration (tables) ----------
  // colonnes de chaque tableau après le n° : champ du formulaire, texte d'une liste, ou valeur fixe
  const COLONNES = {
    createClass: [["v", "className"]],
    createClassArms: [["t", "classId"], ["v", "classArmName"], ["f", "UnAssigned"]],
    createClassTeacher: [["v", "firstName"], ["v", "formationName"], ["v", "emailAddress"], ["v", "phoneNo"], ["t", "classId"], ["t", "classArmId"], ["f", auj]],
    createStudents: [["v", "firstName"], ["v", "lastName"], ["v", "formationName"], ["v", "admissionNumber"], ["t", "classId"], ["t", "classArmId"], ["f", auj]],
    createSessionTerm: [["v", "sessionName"], ["t", "termId"], ["f", "InActive"], ["f", auj]],
    createFormation: [["v", "name"], ["v", "description"], ["v", "price"], ["v", "duration"], ["t", "classId"], ["t", "classArmId"], ["f", auj]],
    sessionplanning: [["v", "start_date"], ["v", "end_date"], ["v", "start_time"], ["v", "end_time"], ["v", "firstName"], ["t", "classId"], ["t", "classArmId"], ["v", "subject"]],
  };
  const UNIQUE = { createStudents: ["admissionNumber", "This admission number Already Exists!"], createClassTeacher: ["emailAddress", "This Email Address Already Exists!"], createClass: ["className", "This Class Already Exists!"] };

  function tableDT() {
    const t = $("#dataTableHover") || $("table");
    const dt = window.jQuery && jQuery.fn.dataTable && jQuery.fn.dataTable.isDataTable(t) ? jQuery(t).DataTable() : null;
    return { t, dt };
  }
  function cellulesAction(id) {
    // reprend les icônes Edit / Delete / Activate d'une ligne existante
    const { t } = tableDT(), ref = t.querySelector("tbody tr");
    if (!ref) return [];
    return [...ref.querySelectorAll("td")].filter((td) => td.querySelector("a")).map((td) => {
      const c = td.cloneNode(true);
      c.querySelectorAll("a").forEach((a) => { const act = /action-(\w+)/.exec(a.getAttribute("href") || "") || ["", "edit"]; a.setAttribute("href", "#"); a.dataset.demo = act[1] + ":" + id; });
      return c.innerHTML;
    });
  }
  function ajouterLigne(ligne) {
    const { t, dt } = tableDT(), n = t.querySelectorAll("tbody tr").length + 1;
    const cells = [String(n), ...ligne.cols.map((x) => x.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))), ...cellulesAction(ligne.id)];
    if (dt) { const node = dt.row.add(cells).draw(false).node(); node.dataset.demoId = ligne.id; }
    else { const tr = document.createElement("tr"); tr.dataset.demoId = ligne.id; tr.innerHTML = cells.map((c) => `<td>${c}</td>`).join(""); t.querySelector("tbody").appendChild(tr); }
  }
  function supprimerLigne(tr) {
    const { dt } = tableDT();
    if (dt) dt.row(tr).remove().draw(false); else tr.remove();
  }
  function idLigne(tr) {
    if (tr.dataset.demoId) return tr.dataset.demoId;
    const a = tr.querySelector('a[href*="action-delete"], a[href*="action-edit"]');
    const m = a && /Id-(\d+)/.exec(a.getAttribute("href"));
    return m ? m[1] : null;
  }
  function pageTable() {
    const cols = COLONNES[base]; if (!cols) return;
    const etat = lire(base, { ajouts: [], suppr: [], modifs: {} });
    const { t } = tableDT(); if (!t) return;
    const ecrireEtat = () => ecrire(base, etat);
    // état enregistré : suppressions, modifications, ajouts
    $$("tbody tr", t).forEach((tr) => {
      const id = idLigne(tr);
      if (id && etat.suppr.includes(id)) supprimerLigne(tr);
      else if (id && etat.modifs[id]) etat.modifs[id].forEach((v, i) => { const td = tr.children[i + 1]; if (td && v !== null) td.textContent = v; });
    });
    etat.ajouts.filter((l) => !etat.suppr.includes(l.id)).forEach(ajouterLigne);
    const msgs = lire("flash", null); if (msgs && msgs.page === base) { const f = $('form[method="post"], form[method="POST"]'); if (f) messageAvant(f, msgs.html); ecrire("flash", null); }

    const valeurs = (f) => cols.map(([k, n]) => (k === "v" ? (f.elements[n] ? f.elements[n].value.trim() : "") : k === "t" ? texteOption(f.elements[n]) : n));
    const form = $$("form").find((f) => f.querySelector('[name="save"], [name="update"]'));
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bouton = e.submitter || form.querySelector('[name="save"], [name="update"]');
      const edition = page.includes("action-edit") || form.dataset.demoEdit;
      const v = valeurs(form);
      if (edition) {
        const id = form.dataset.demoEdit || (/Id-(\w+)/.exec(page) || [])[1];
        const aj = etat.ajouts.find((l) => l.id === id);
        if (aj) aj.cols = v; else etat.modifs[id] = v;
        ecrireEtat();
        ecrire("flash", { page: base, html: "<div class='alert alert-success'  style='margin-right:700px;'>Updated Successfully!</div>" });
        location.href = base + ".html"; return;
      }
      const u = UNIQUE[base];
      if (u) {
        const val = (form.elements[u[0]] || {}).value || "", idx = cols.findIndex(([, n]) => n === u[0]) + 1;
        if ($$("tbody tr", t).some((tr) => tr.children[idx] && tr.children[idx].textContent.trim().toLowerCase() === val.trim().toLowerCase())) {
          messageAvant(form, `<div class='alert alert-danger' style='margin-right:700px;'>${u[1]}</div>`); return;
        }
      }
      const ligne = { id: "n" + Date.now(), cols: v };
      etat.ajouts.push(ligne); ecrireEtat(); ajouterLigne(ligne);
      messageAvant(form, `<div class='alert alert-success'  style='margin-right:700px;'>${base === "sessionplanning" ? "Planification ajoutée avec succès!" : "Created Successfully!"}</div>`);
      form.reset(); void bouton;
    });
    // suppression / modification / activation depuis les icônes du tableau
    t.addEventListener("click", (e) => {
      const a = e.target.closest("a"); if (!a) return;
      const href = a.getAttribute("href") || "";
      const demo = a.dataset.demo, m = /action-(\w+)__Id-(\d+)/.exec(href);
      const [act, id] = demo ? demo.split(":") : m ? [m[1], m[2]] : [null, null];
      if (!act) return;
      if (act === "delete") { e.preventDefault(); etat.suppr.push(id); ecrireEtat(); supprimerLigne(a.closest("tr")); }
      else if (act === "activate") {
        e.preventDefault();
        $$("tbody tr", t).forEach((tr) => { const td = tr.children[3]; if (td && /Active/i.test(td.textContent)) td.textContent = tr === a.closest("tr") ? "Active" : "InActive"; });
      } else if (act === "edit" && demo) {
        // ligne ajoutée pendant la démo : le formulaire de la page passe en modification
        e.preventDefault();
        const l = etat.ajouts.find((x) => x.id === id); if (!l) return;
        cols.forEach(([k, n], i) => { if (k === "v" && form.elements[n]) form.elements[n].value = l.cols[i]; });
        form.dataset.demoEdit = id; form.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ---------- attestation ----------
  function pageAttestation() {
    const prec = lire("attestation", null);
    if (page.startsWith("attestation__POST") && prec) {
      // la page générée ne dépend que de l'apprenant ; les autres choix sont repris du formulaire
      const R = { "Formation:": prec.formation, "Classe:": prec.classe, "Lieu:": prec.lieu, "Enseignant:": prec.enseignant, "Session:": prec.session, "Mention obtenue:": prec.mention };
      $$("p > strong").forEach((s) => { const k = s.textContent.trim(); if (R[k] !== undefined && s.nextSibling) s.nextSibling.textContent = " " + R[k]; });
    }
    const f = $$("form").find((x) => x.elements.studentId); if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const sel = {}; ["studentId", "formationId", "classId", "classArmId", "teacherId", "sessionId", "mention"].forEach((n) => { sel[n] = f.elements[n].value; });
      ecrire("attestation", { sel, formation: texteOption(f.elements.formationId), classe: texteOption(f.elements.classId), lieu: texteOption(f.elements.classArmId), enseignant: texteOption(f.elements.teacherId), session: texteOption(f.elements.sessionId), mention: f.elements.mention.value });
      location.href = "attestation__POST-" + f.elements.studentId.value + ".html";
    });
  }

  // ---------- formateur ----------
  function pagesFormateur() {
    // date du jour (la copie a été faite un autre jour)
    $$("h1, h6").forEach((h) => { h.innerHTML = h.innerHTML.replace(/Today's Date : [\d-]+/, "Today's Date : " + new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, "-")); });
    if (base === "takeAttendance") {
      if (page === "takeAttendance__POST" || page === "takeAttendance__POST-deja") document.title = document.title;
      const f = $$("form").find((x) => x.querySelector('[name="save"]'));
      if (f) f.addEventListener("submit", (e) => {
        e.preventDefault();
        // 1er appel du jour : succès ; ensuite : « Attendance has been taken for today! » (comme le serveur)
        const deja = lire("appelFait", null) === new Date().toISOString().slice(0, 10);
        ecrire("appelFait", new Date().toISOString().slice(0, 10));
        location.href = deja ? "takeAttendance__POST-deja.html" : "takeAttendance__POST.html";
      });
    }
    if (base === "viewAttendance") {
      const f = $$("form").find((x) => x.elements.dateTaken);
      if (f) f.addEventListener("submit", (e) => {
        e.preventDefault();
        const d = f.elements.dateTaken.value, connues = ["2024-10-07", "2024-10-08"];
        ecrire("dateVue", d);
        location.href = "viewAttendance__POST-" + (connues.includes(d) ? d : "vide") + ".html";
      });
    }
    if (base === "viewStudentAttendance") {
      const f = $$("form").find((x) => x.elements.admissionNumber);
      const filtre = lire("filtreEleve", null);
      if (page.includes("__POST") && filtre) {
        // type 2 (une date) et 3 (période) : on filtre l'historique complet
        const { dt } = tableDT(), lignes = $$("tbody tr", tableDT().t);
        lignes.forEach((tr) => {
          const d = (tr.lastElementChild || {}).textContent || "";
          const ok = filtre.type === "2" ? d.startsWith(filtre.d1) : filtre.type === "3" ? d >= filtre.d1 && d <= filtre.d2 + "~" : true;
          if (!ok) { if (dt) dt.row(tr).remove(); else tr.remove(); }
        });
        if (dt) dt.draw(false);
      }
      if (f) f.addEventListener("submit", (e) => {
        e.preventDefault();
        const typ = f.elements.type.value;
        ecrire("filtreEleve", { type: typ, d1: (f.elements.singleDate || f.elements.fromDate || {}).value || "", d2: (f.elements.toDate || {}).value || "" });
        location.href = "viewStudentAttendance__POST-" + f.elements.admissionNumber.value + ".html";
      });
    }
  }

  // ---------- liens et formulaires restants : pas de POST possible sur un site statique ----------
  function generique() {
    document.addEventListener("submit", (e) => {
      if (e.defaultPrevented) return;
      const f = e.target, act = f.getAttribute("action");
      if (act && /\.html/.test(act)) { e.preventDefault(); location.href = act; }
    });
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a"); if (!a) return;
      const h = a.getAttribute("href") || "";
      if (/downloadRecord\.html$/.test(h)) { e.preventDefault(); const l = document.createElement("a"); l.href = "downloadRecord.xls"; l.download = "Attendance list.xls"; l.click(); }
    });
  }

  pret(() => {
    generique();
    if (!dossier && (page === "index" || page === "")) pageConnexion();
    if (dossier === "Admin") { pageTable(); if (base.startsWith("attestation")) pageAttestation(); }
    if (dossier === "ClassTeacher") pagesFormateur();
  });
})();
