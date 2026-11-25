/* =========================================================
   Démos SECEL Formation et SECEL Commandes
   ---------------------------------------------------------
   Les pages affichées sont celles que les applications PHP produisent en
   local (XAMPP) : mêmes HTML, CSS, images et scripts, enregistrées dans
   demos/gestion et demos/lauwa. Un petit script (demo-shim.js) y remplace
   le serveur (connexion, formulaires, livraisons) pour qu'on puisse les
   tester sur un site statique comme GitHub Pages.
   ========================================================= */
(function () {
  const APPS = {
    gestion: {
      dossier: "demos/gestion/", depart: "index.html", prefixe: "gestion:",
      comptes: [
        { role: "Administrator", email: "admin@secel.cm", mdp: "Password@123" },
        { role: "ClassTeacher", email: "teacher@secel.cm", mdp: "pass123" },
      ],
      remplir(doc, c) {
        const f = doc.querySelector("form.user"); if (!f) return false;
        f.userType.value = c.role; f.username.value = c.email; f.password.value = c.mdp; return true;
      },
    },
    lauwa: {
      dossier: "demos/lauwa/", depart: "index.html", prefixe: "lauwa:",
      comptes: [
        { role: "admin", email: "admin@secel.cm", mdp: "admin123" },
        { role: "user", email: "client@secel.cm", mdp: "client123" },
      ],
      remplir(doc, c) {
        const e = doc.getElementById("login-email"), p = doc.getElementById("login-password"); if (!e || !p) return false;
        e.value = c.email; p.value = c.mdp; return true;
      },
    },
  };
  const TXT = {
    fr: { intro: "Ce sont les vraies pages de l'application, enregistrées depuis XAMPP : même code HTML, CSS et JavaScript qu'en localhost. Seul le serveur PHP / MySQL est remplacé par un petit script, pour pouvoir la tester ici avec chaque rôle.", comptes: "Comptes de démonstration", remplir: "Remplir", reset: "↺ Réinitialiser", onglet: "Ouvrir dans un onglet ↗", retour: "←", pasLogin: "Revenez à la page de connexion pour utiliser ce compte." },
    en: { intro: "These are the application's real pages, saved from XAMPP: the same HTML, CSS and JavaScript as on localhost. Only the PHP / MySQL server is replaced by a small script, so you can try it here with each role.", comptes: "Demo accounts", remplir: "Fill in", reset: "↺ Reset", onglet: "Open in a tab ↗", retour: "←", pasLogin: "Go back to the login page to use this account." },
  };

  // demos/gestion/Admin/createClass__action-edit__Id-2.html -> localhost/gestion/Admin/createClass.php?action=edit&Id=2
  function adresse(app, href) {
    const u = new URL(href), rel = decodeURIComponent(u.pathname.split("/demos/" + app + "/")[1] || "index.html");
    let [base, ...q] = rel.replace(/\.html$/, "").split("__");
    q = q.filter((x) => !/^POST/.test(x) && x !== "resultat").map((x) => x.replace("-", "="));
    const qs = (q.length ? "?" + q.join("&") : "") + (u.search ? (q.length ? "&" : "?") + u.search.slice(1) : "");
    // racine : localhost/gestion/ ; boutique Lauwa : la connexion redirige vers ./project/
    if (!qs && (base === "index" || (app === "lauwa" && base === "project/index"))) base = base.replace(/index$/, "");
    return `localhost/${app}/${base}${base && !base.endsWith("/") ? ".php" : ""}${qs}`;
  }

  function monter(app) {
    return function mount(root, lang) {
      const A = APPS[app], T = TXT[lang] || TXT.fr, src = A.dossier + A.depart;
      root.innerHTML = `<p class="sa-intro">${T.intro}</p>
        <p class="sa-comptes"><b>${T.comptes} :</b> ${A.comptes.map((c, i) => `<span><code>${c.role}</code> ${c.email} / ${c.mdp} <button type="button" data-c="${i}">${T.remplir}</button></span>`).join("")}</p>
        <div class="sa-win"><div class="sa-bar"><i></i><i></i><i></i><button class="sa-nav" data-act="retour" title="Back">${T.retour}</button><span class="sa-url"></span>
          <button class="sa-reset" data-act="reset">${T.reset}</button><a class="sa-reset" data-act="onglet" target="_blank" rel="noopener" href="${src}">${T.onglet}</a></div>
          <iframe class="sa-frame" src="${src}" title="${app}"></iframe></div>`;
      const fr = root.querySelector("iframe"), url = root.querySelector(".sa-url"), onglet = root.querySelector('[data-act="onglet"]');
      fr.addEventListener("load", () => {
        try { const h = fr.contentWindow.location.href; url.textContent = adresse(app, h); onglet.href = h; } catch (e) { url.textContent = "localhost/" + app + "/"; }
      });
      root.querySelector('[data-act="retour"]').addEventListener("click", () => { try { fr.contentWindow.history.back(); } catch (e) { /* rien */ } });
      root.querySelector('[data-act="reset"]').addEventListener("click", () => {
        try { Object.keys(sessionStorage).filter((k) => k.startsWith(A.prefixe)).forEach((k) => sessionStorage.removeItem(k)); } catch (e) { /* stockage indisponible */ }
        try { if (app === "lauwa") localStorage.removeItem("cart"); } catch (e) { /* idem */ }
        fr.src = src + "?" + Date.now();
      });
      root.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => {
        const c = A.comptes[+b.dataset.c];
        let ok = false; try { ok = A.remplir(fr.contentDocument, c); } catch (e) { ok = false; }
        if (!ok) { fr.src = src; fr.addEventListener("load", function f() { fr.removeEventListener("load", f); try { A.remplir(fr.contentDocument, c); } catch (e) { /* rien */ } }); }
      }));
      return { destroy() { root.innerHTML = ""; } };
    };
  }
  window.SecelFormation = { mount: monter("gestion") };
  window.SecelCommandes = { mount: monter("lauwa") };
})();
