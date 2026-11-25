/* =========================================================
   JAVAZIC — version web utilisable
   ---------------------------------------------------------
   Portage en JavaScript du projet Java (MVC, interface Swing) :
   - model/domain  : Track, Album, Group, Playlist, Rating, User…
   - model/service : AuthService, CatalogService, PlaylistService,
                     PlaybackService, AdminService, StatsService,
                     DemoDataFactory (mêmes données de démonstration)
   - view/gui/MainFrame : mêmes écrans, onglets, boutons et couleurs
   Différences assumées :
   - la sauvegarde (data/javazic.ser) devient le stockage du navigateur ;
   - les JOptionPane deviennent des boîtes de dialogue dans la page ;
   - une barre « lecture en cours » montre la progression (sans audio).
   ========================================================= */
(function () {
  const STORE_KEY = "javazic.state.v1";
  const VISITOR_LIMIT = 3;

  class BusinessException extends Error {}
  const javaCmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0); // ordre naturel de String en Java
  const lower = (s) => String(s).toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt2 = (x) => x.toFixed(2).replace(".", ",");

  /* ---------- model/domain : toString() identiques au Java ---------- */
  const avgRating = (t) => (t.ratings.length ? t.ratings.reduce((s, r) => s + r.score, 0) / t.ratings.length : 0);
  const trackStr = (t) => `${t.title} - ${t.artist} (${t.genre}, ${t.releaseYear}, ${t.durationSeconds}s, note: ${fmt2(avgRating(t))})`;
  const groupStr = (g) => `${g.name} (${g.albumIds.length} albums)`;
  const albumStr = (a) => `${a.title} (${a.releaseYear}, ${a.trackIds.length} titres)`;
  const roleName = { VISITOR: "VISITOR", SUBSCRIBER: "SUBSCRIBER", ADMIN: "ADMIN" };

  /* ---------- DemoDataFactory ---------- */
  function createDefaultState() {
    const s = { users: {}, tracks: {}, groups: {}, albums: {}, playlists: [], listenCount: {} };
    s.users.guest = { username: "guest", password: "guest", role: "VISITOR" };
    s.users.alice = { username: "alice", password: "alice", role: "SUBSCRIBER", suspended: false, history: [] };
    s.users.bob = { username: "bob", password: "bob", role: "SUBSCRIBER", suspended: false, history: [] };
    s.users.admin = { username: "admin", password: "admin", role: "ADMIN" };
    enrichCatalog(s);
    return s;
  }
  function addGroup(s, id, name) { if (!s.groups[id]) s.groups[id] = { id, name, albumIds: [] }; }
  function addAlbum(s, id, title, groupId, releaseYear) {
    if (!s.albums[id]) s.albums[id] = { id, title, groupId, releaseYear, trackIds: [] };
    const g = s.groups[groupId];
    if (g && !g.albumIds.includes(id)) g.albumIds.push(id);
  }
  function linkTrackToAlbum(s, albumId, trackId) {
    const a = s.albums[albumId];
    if (a && s.tracks[trackId] && !a.trackIds.includes(trackId)) a.trackIds.push(trackId);
  }
  function addTrack(s, id, title, artist, genre, releaseYear, durationSeconds) {
    if (!s.tracks[id]) s.tracks[id] = { id, title, artist, genre, releaseYear, durationSeconds, ratings: [] };
  }
  const BASE_TRACKS = [
    ["T001", "Sunrise", "Nova", "Pop", 2022, 187], ["T002", "Noir et Or", "Helix", "Rap", 2021, 202],
    ["T003", "Ocean Drive", "Mira", "Electro", 2024, 230], ["T004", "Riverline", "Atlas", "Rock", 2019, 198],
    ["T005", "Arcade", "Pixel Dust", "Synthwave", 2020, 244], ["T006", "Lune Rouge", "Velour", "Jazz", 2018, 261],
    ["T007", "Breathe Slow", "Northbound", "Indie", 2017, 219], ["T008", "Midnight Metro", "Circuit", "Electro", 2023, 236],
    ["T009", "Parallels", "Iris Vale", "Pop", 2016, 205], ["T010", "Rebound", "Quanta", "Rap", 2020, 194],
    ["T011", "Dust and Rain", "Harbor", "Folk", 2014, 228], ["T012", "Blue Station", "Monkline", "Blues", 2013, 247],
    ["T013", "Shadows", "Frostline", "Metal", 2015, 254], ["T014", "Rendezvous", "Aster", "Pop", 2025, 176],
    ["T015", "Static Hearts", "Dusk Club", "Synthwave", 2019, 233], ["T016", "Terra Nova", "Orionis", "Classical", 2008, 312],
    ["T017", "Road 77", "Gold Lane", "Country", 2011, 215], ["T018", "Old Vinyl", "Blue Harbor", "Soul", 1998, 242],
    ["T019", "Cafe de Minuit", "Plume", "Chanson", 2005, 201], ["T020", "Moon Drums", "Kora Sky", "World", 2010, 229],
    ["T021", "Heatwave", "Pulse", "Dance", 2022, 209], ["T022", "Checkpoint", "MTRX", "Techno", 2024, 258],
    ["T023", "Cloud Highway", "Aerial", "Ambient", 2016, 341], ["T024", "Sierra", "Vale of Pines", "Acoustic", 2012, 223],
    ["T025", "Downtown Story", "Kingston 9", "Reggae", 2019, 212], ["T026", "Copper Line", "East Loop", "R&B", 2021, 207],
    ["T027", "Infinite Skin", "Parallel Dawn", "Drum&Bass", 2023, 246], ["T028", "Nazar", "Safi", "Rai", 2017, 214],
    ["T029", "Horizon Nord", "Mistral", "House", 2020, 238], ["T030", "Temple Run", "Karava", "Instrumental", 2015, 289],
    ["T031", "Lighthouse", "Mila June", "Pop", 2018, 193], ["T032", "Smoke Alley", "Raven", "Rock", 2009, 221],
    ["T033", "Crash Course", "Burn Unit", "Punk", 2007, 171], ["T034", "Delta Sleep", "Neon Bloom", "Dream Pop", 2024, 226],
    ["T035", "Low Tide", "Grey Coast", "LoFi", 2022, 195], ["T036", "Monochrome", "Fringe", "Alternative", 2013, 232],
    ["T037", "Open Fields", "Tristan Vale", "Classical", 1993, 364], ["T038", "Night Bus", "Apex", "HipHop", 2021, 204],
    ["T039", "Lava", "Boreal", "Electro", 2019, 240], ["T040", "Cinema Scope", "Motive", "Soundtrack", 2011, 277],
    ["T041", "Sirocco", "Nomad", "World", 2004, 249], ["T042", "Mirage", "Sable", "Rai", 2016, 218],
    ["T043", "Atlas 2AM", "Westline", "House", 2025, 234], ["T044", "Green Tape", "Waffle Beat", "LoFi", 2023, 182],
    ["T045", "Opal", "Eden", "Indie", 2020, 213], ["T046", "Tilt", "Ground Zero", "Metal", 2012, 267],
    ["T047", "Cabaret 88", "Velvet Hour", "Jazz", 1988, 256], ["T048", "Signal Lost", "Kite", "Techno", 2018, 251],
    ["T049", "Blue Motel", "Dust Motel", "Country", 2014, 226], ["T050", "Plein Soleil", "Ariane", "Chanson", 2022, 206],
    ["B001", "Come Together", "The Beatles", "Rock", 1969, 259], ["B002", "Something", "The Beatles", "Rock", 1969, 183],
    ["B003", "Here Comes the Sun", "The Beatles", "Rock", 1969, 185], ["B004", "Let It Be", "The Beatles", "Rock", 1970, 243],
    ["B005", "Across the Universe", "The Beatles", "Rock", 1970, 229], ["B006", "The Long and Winding Road", "The Beatles", "Rock", 1970, 218],
  ];
  function enrichCatalog(s) {
    addGroup(s, "G-BEA", "The Beatles");
    addAlbum(s, "A-BEA-AR", "Abbey Road", "G-BEA", 1969);
    addAlbum(s, "A-BEA-LIB", "Let It Be", "G-BEA", 1970);
    BASE_TRACKS.forEach((t) => addTrack(s, ...t));
    [["A-BEA-AR", "B001"], ["A-BEA-AR", "B002"], ["A-BEA-AR", "B003"], ["A-BEA-LIB", "B004"], ["A-BEA-LIB", "B005"], ["A-BEA-LIB", "B006"]]
      .forEach(([a, t]) => linkTrackToAlbum(s, a, t));
    // addBulkGeneratedTracks(state, 220)
    const adj = ["Neon", "Golden", "Silent", "Echo", "Crystal", "Velvet", "Electric", "Solar", "Arctic", "Urban"];
    const nouns = ["Sky", "Pulse", "Road", "Wave", "Lights", "Dream", "Signal", "Garden", "Storm", "Memory"];
    const artists = ["Echo Unit", "Northern Tide", "Blue Halo", "Orbit Lane", "Vista Noir", "Mono Drive", "Atlas Club", "Silver Frame"];
    const genres = ["Pop", "Rock", "Electro", "Rap", "House", "Techno", "Jazz", "Indie", "Rai", "LoFi", "Soul", "World"];
    for (let i = 1; i <= 220; i++) {
      addTrack(s, "X" + String(i).padStart(3, "0"), `${adj[(i - 1) % 10]} ${nouns[(i - 1) % 10]} ${i}`,
        artists[(i - 1) % 8], genres[(i - 1) % 12], 1990 + (i % 36), 160 + ((i * 7) % 180));
    }
    // seedBulkGroupsAndAlbums(state, 18, 8)
    const albumIds = [];
    for (let g = 1; g <= 18; g++) {
      const gid = "G-AUTO-" + String(g).padStart(2, "0");
      addGroup(s, gid, "Collectif " + g);
      for (let a = 1; a <= 8; a++) {
        const aid = `A-AUTO-${String(g).padStart(2, "0")}-${String(a).padStart(2, "0")}`;
        addAlbum(s, aid, `Volume ${g}.${a}`, gid, 1995 + ((g * 3 + a) % 30));
        albumIds.push(aid);
      }
    }
    albumIds.sort(javaCmp);
    // distributeUnassignedTracksAcrossAlbums
    const assigned = new Set();
    Object.values(s.albums).forEach((a) => a.trackIds.forEach((t) => assigned.add(t)));
    let index = 0;
    Object.keys(s.tracks).sort(javaCmp).forEach((tid) => {
      if (assigned.has(tid)) return;
      linkTrackToAlbum(s, albumIds[index % albumIds.length], tid);
      index++;
    });
  }

  /* ---------- PersistenceService (stockage du navigateur) ---------- */
  const persistence = {
    load() {
      try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
    },
    save(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* indisponible */ } },
    clear() { try { localStorage.removeItem(STORE_KEY); } catch { /* indisponible */ } },
  };

  /* ---------- Services (mêmes règles métier que le Java) ---------- */
  function services(state) {
    let visitorPlayCount = 0;
    const byTitle = (a, b) => javaCmp(a.title, b.title);
    const S = {
      login(username, password) {
        const u = state.users[username];
        if (!u || u.password !== password) throw new BusinessException("Identifiants invalides.");
        if (u.role === "SUBSCRIBER" && u.suspended) throw new BusinessException("Ce compte abonne est suspendu.");
        return u;
      },
      registerSubscriber(username, password) {
        if (!username) throw new BusinessException("Nom d'utilisateur requis.");
        if (state.users[username]) throw new BusinessException("Nom d'utilisateur deja utilise.");
        state.users[username] = { username, password, role: "SUBSCRIBER", suspended: false, history: [] };
      },
      getAllTracks() { return Object.values(state.tracks).sort(byTitle); },
      getTrackById(id) { const t = state.tracks[id]; if (!t) throw new BusinessException("Morceau introuvable."); return t; },
      search(q) {
        q = lower(q);
        return Object.values(state.tracks).filter((t) => [t.title, t.artist, t.genre, t.id].some((f) => lower(f).includes(q))).sort(byTitle);
      },
      advancedSearch(genre, minYear, maxYear) {
        return Object.values(state.tracks).filter((t) =>
          (!genre || lower(t.genre) === lower(genre)) && (minYear == null || t.releaseYear >= minYear) && (maxYear == null || t.releaseYear <= maxYear)
        ).sort(byTitle);
      },
      addRating(trackId, username, score, review) {
        if (!(score >= 1 && score <= 5)) throw new BusinessException("La note doit etre comprise entre 1 et 5.");
        S.getTrackById(trackId).ratings.push({ username, score, review });
      },
      searchGroups(q) { q = lower(q); return Object.values(state.groups).filter((g) => lower(g.name).includes(q)).sort((a, b) => javaCmp(a.name, b.name)); },
      getAlbumsByGroup(gid) {
        const g = state.groups[gid]; if (!g) throw new BusinessException("Groupe introuvable.");
        return g.albumIds.map((id) => state.albums[id]).filter(Boolean)
          .sort((a, b) => a.releaseYear - b.releaseYear || javaCmp(a.title, b.title));
      },
      getTracksByAlbum(aid) {
        const a = state.albums[aid]; if (!a) throw new BusinessException("Album introuvable.");
        return a.trackIds.map((id) => state.tracks[id]).filter(Boolean);
      },
      getUserPlaylists(u) { return state.playlists.filter((p) => p.owner === u); },
      findOwned(u, name) {
        const p = state.playlists.find((x) => x.owner === u && lower(x.name) === lower(name));
        if (!p) throw new BusinessException("Playlist introuvable.");
        return p;
      },
      createPlaylist(u, name) {
        if (state.playlists.some((p) => p.owner === u && lower(p.name) === lower(name))) throw new BusinessException("Une playlist avec ce nom existe deja.");
        state.playlists.push({ name, owner: u, trackIds: [] });
      },
      renamePlaylist(u, oldName, newName) { S.findOwned(u, oldName).name = newName; },
      deletePlaylist(u, name) { const p = S.findOwned(u, name); state.playlists.splice(state.playlists.indexOf(p), 1); },
      addTrackToPlaylist(u, name, tid) {
        const p = S.findOwned(u, name);
        if (p.trackIds.includes(tid)) throw new BusinessException("Le morceau est deja dans la playlist.");
        p.trackIds.push(tid);
      },
      removeTrackFromPlaylist(u, name, tid) {
        const p = S.findOwned(u, name), i = p.trackIds.indexOf(tid);
        if (i < 0) throw new BusinessException("Le morceau n'est pas dans la playlist.");
        p.trackIds.splice(i, 1);
      },
      playTrack(user, tid) {
        const t = state.tracks[tid];
        if (!t) throw new BusinessException("Morceau introuvable.");
        if (user.role === "VISITOR") {
          if (visitorPlayCount >= VISITOR_LIMIT) throw new BusinessException("Limite visiteur atteinte. Connectez-vous en tant qu'abonne.");
          visitorPlayCount++;
        }
        if (user.role === "SUBSCRIBER") user.history.push(tid);
        state.listenCount[tid] = (state.listenCount[tid] || 0) + 1;
        return t;
      },
      remainingVisitorPlays() { return VISITOR_LIMIT - visitorPlayCount; },
      addTrack(t) {
        if (state.tracks[t.id]) throw new BusinessException("Un morceau avec cet identifiant existe deja.");
        state.tracks[t.id] = { ...t, ratings: [] };
      },
      removeTrack(id) { if (!state.tracks[id]) throw new BusinessException("Morceau introuvable."); delete state.tracks[id]; },
      suspendSubscriber(u) {
        const x = state.users[u]; if (!x || x.role !== "SUBSCRIBER") throw new BusinessException("Abonne introuvable.");
        x.suspended = true;
      },
      deleteSubscriber(u) {
        const x = state.users[u]; if (!x || x.role !== "SUBSCRIBER") throw new BusinessException("Abonne introuvable.");
        delete state.users[u];
        state.playlists = state.playlists.filter((p) => p.owner !== u);
      },
      topTracks(n) {
        return Object.entries(state.listenCount).filter(([id]) => state.tracks[id]).sort((a, b) => b[1] - a[1]).slice(0, n)
          .map(([id, c]) => [`${state.tracks[id].title} - ${state.tracks[id].artist}`, c]);
      },
      topGenres(n) {
        const g = {};
        Object.entries(state.listenCount).forEach(([id, c]) => { const t = state.tracks[id]; if (t) g[t.genre] = (g[t.genre] || 0) + c; });
        return Object.entries(g).sort((a, b) => b[1] - a[1]).slice(0, n);
      },
    };
    return S;
  }

  /* =========================================================
     view/gui/MainFrame : l'interface
     ========================================================= */
  function mount(root) {
    let state = persistence.load();
    if (!state || !state.tracks) state = createDefaultState(); else enrichCatalog(state);
    let svc = services(state);
    const save = () => persistence.save(state);

    let currentUser = null;
    let groups = [], albums = [], tracks = [];
    let selGroup = -1, selAlbum = -1, selTrack = -1, selPlaylist = 0;
    let activeTab = "Catalogue";
    let player = null;

    root.innerHTML = `
      <div class="jz-win" role="application" aria-label="JAVAZIC, interface graphique">
        <div class="jz-title"><span class="jz-cup" aria-hidden="true"></span>JAVAZIC - Interface Graphique<span class="jz-ctrls" aria-hidden="true"><i></i><i></i><i></i></span></div>
        <div class="jz-body"></div>
        <div class="jz-overlay" hidden></div>
      </div>`;
    const body = root.querySelector(".jz-body");
    const overlay = root.querySelector(".jz-overlay");

    /* ----- JOptionPane : boîtes de dialogue dans la page ----- */
    function dialog({ title, message, input = false, value = "", kind = "info" }) {
      return new Promise((resolve) => {
        overlay.hidden = false;
        overlay.innerHTML = `
          <div class="jz-dlg" role="dialog" aria-modal="true" aria-label="${esc(title)}">
            <div class="jz-dlg-title">${esc(title)}</div>
            <div class="jz-dlg-body">
              <span class="jz-ico ${kind}" aria-hidden="true">${kind === "error" ? "!" : kind === "question" ? "?" : "i"}</span>
              <div class="jz-dlg-main">
                <p>${esc(message)}</p>
                ${input ? `<input class="jz-input" type="text" value="${esc(value)}" aria-label="${esc(message)}">` : ""}
              </div>
            </div>
            <div class="jz-dlg-btns">
              <button type="button" class="jz-btn primary" data-r="ok">OK</button>
              ${input ? `<button type="button" class="jz-btn" data-r="cancel">Annuler</button>` : ""}
            </div>
          </div>`;
        const field = overlay.querySelector(".jz-input");
        const close = (r) => { overlay.hidden = true; overlay.innerHTML = ""; resolve(r); };
        overlay.querySelector('[data-r="ok"]').onclick = () => close(input ? field.value : true);
        const c = overlay.querySelector('[data-r="cancel"]'); if (c) c.onclick = () => close(null);
        overlay.querySelector(".jz-dlg").addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); close(input ? field.value : true); }
          if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(input ? null : true); }
        });
        setTimeout(() => (field || overlay.querySelector('[data-r="ok"]')).focus(), 20);
      });
    }
    const showInfo = (m) => dialog({ title: "Information", message: m });
    const showError = (e) => dialog({ title: "Erreur", message: e instanceof Error ? e.message : String(e), kind: "error" });
    const ask = (m, v = "") => dialog({ title: "Entrée", message: m, input: true, value: v, kind: "question" });

    /* ----- écran de connexion ----- */
    function renderLogin() {
      body.innerHTML = `
        <form class="jz-login" autocomplete="off">
          <p class="jz-login-h">Connexion JAVAZIC</p>
          <label for="jz-user">Nom d'utilisateur</label>
          <input id="jz-user" class="jz-input" type="text" autocapitalize="off" spellcheck="false">
          <label for="jz-pass">Mot de passe</label>
          <input id="jz-pass" class="jz-input" type="password">
          <button type="submit" class="jz-btn primary">Se connecter</button>
          <button type="button" class="jz-btn" data-act="register">Creer un compte abonne</button>
          <p class="jz-hint">Comptes demo: guest/guest, alice/alice, bob/bob, admin/admin</p>
          <p class="jz-quick">Connexion rapide :
            <button type="button" class="jz-link" data-demo="guest">Visiteur</button>
            <button type="button" class="jz-link" data-demo="alice">Abonnée (alice)</button>
            <button type="button" class="jz-link" data-demo="admin">Administrateur</button>
          </p>
          <p class="jz-reset"><button type="button" class="jz-link" data-act="reset">Réinitialiser les données de démo</button></p>
        </form>`;
      const f = body.querySelector("form");
      f.addEventListener("submit", (e) => { e.preventDefault(); login(f["jz-user"].value.trim(), f["jz-pass"].value); });
      f.addEventListener("click", async (e) => {
        const d = e.target.closest("[data-demo]");
        if (d) return login(d.dataset.demo, d.dataset.demo);
        const a = e.target.closest("[data-act]");
        if (!a) return;
        if (a.dataset.act === "register") {
          try { svc.registerSubscriber(f["jz-user"].value.trim(), f["jz-pass"].value); save(); showInfo("Compte abonne cree. Vous pouvez vous connecter."); }
          catch (err) { showError(err); }
        } else if (a.dataset.act === "reset") {
          persistence.clear(); state = createDefaultState(); svc = services(state);
          showInfo("Données de démonstration rechargées.");
        }
      });
      setTimeout(() => f["jz-user"].focus({ preventScroll: true }), 30);
    }
    function login(u, p) {
      try {
        currentUser = svc.login(u, p);
        activeTab = "Catalogue";
        refreshGroups(); renderApp();
      } catch (err) { showError(err); }
    }
    function logout() { currentUser = null; stopPlayer(); renderLogin(); }

    /* ----- application : barre de session + onglets selon le rôle ----- */
    function tabsForRole() {
      const t = ["Catalogue"];
      if (currentUser.role === "SUBSCRIBER") t.push("Playlists", "Historique", "Statistiques");
      if (currentUser.role === "ADMIN") t.push("Administration", "Statistiques");
      return t;
    }
    function renderApp() {
      const tabs = tabsForRole();
      if (!tabs.includes(activeTab)) activeTab = "Catalogue";
      body.innerHTML = `
        <div class="jz-app">
          <div class="jz-top"><b>Connecte: ${esc(currentUser.username)} / ${roleName[currentUser.role]}</b>
            <button type="button" class="jz-btn" data-act="logout">Deconnexion</button></div>
          <div class="jz-tabs" role="tablist">${tabs.map((t) => `<button type="button" role="tab" class="jz-tab" aria-selected="${t === activeTab}" data-tab="${t}">${t}</button>`).join("")}</div>
          <div class="jz-panel" role="tabpanel"></div>
          <div class="jz-player" ${player ? "" : "hidden"}></div>
        </div>`;
      body.querySelector('[data-act="logout"]').onclick = logout;
      body.querySelector(".jz-tabs").onclick = (e) => {
        const b = e.target.closest("[data-tab]"); if (!b) return;
        activeTab = b.dataset.tab; renderApp();
      };
      const panel = body.querySelector(".jz-panel");
      ({ Catalogue: renderCatalog, Playlists: renderPlaylists, Historique: renderHistory, Statistiques: renderStats, Administration: renderAdmin })[activeTab](panel);
      renderPlayer();
    }

    /* ----- onglet Catalogue ----- */
    let catalogContext = "Selectionnez un groupe puis un album.", albumDetails = "";
    let fields = { group: "", search: "", genre: "", min: "", max: "" };
    function refreshGroups() {
      groups = svc.searchGroups(""); selGroup = groups.length ? 0 : -1;
      if (selGroup >= 0) renderAlbumsForSelectedGroup();
      else { albums = []; tracks = []; albumDetails = ""; catalogContext = "Aucun groupe disponible."; }
    }
    function renderAlbumsForSelectedGroup() {
      const g = groups[selGroup]; albums = []; tracks = []; selTrack = -1;
      if (!g) { catalogContext = "Selectionnez un groupe."; albumDetails = ""; return; }
      catalogContext = `Groupe: ${g.name} | Choisissez un album pour voir ses titres.`;
      albums = svc.getAlbumsByGroup(g.id);
      albumDetails = `Albums du groupe ${g.name}\n------------------------------\n` + albums.map((a) => `${a.id} - ${a.title} (${a.releaseYear})`).join("\n");
      selAlbum = albums.length ? 0 : -1;
      if (selAlbum >= 0) renderTracksForSelectedAlbum(); else albumDetails += "\nAucun album disponible pour ce groupe.";
    }
    function renderTracksForSelectedAlbum() {
      const a = albums[selAlbum]; tracks = []; selTrack = -1;
      if (!a) { albumDetails = "Aucun album selectionne."; return; }
      tracks = svc.getTracksByAlbum(a.id);
      albumDetails = `Album: ${a.title}\nAnnee: ${a.releaseYear}\nID: ${a.id}\n------------------------------\n` + tracks.map((t) => `${t.title} - ${t.artist}`).join("\n");
    }
    const list = (name, items, sel, toStr) => `
      <div class="jz-list" role="listbox" tabindex="0" data-list="${name}" aria-label="${name}">
        ${items.map((it, i) => `<div role="option" class="jz-opt" aria-selected="${i === sel}" data-i="${i}">${esc(toStr(it))}</div>`).join("") || ""}
      </div>`;
    function renderCatalog(panel) {
      const visitor = currentUser.role === "VISITOR";
      panel.innerHTML = `
        <div class="jz-search">
          <div class="jz-row"><label for="jz-g">Groupe</label><input id="jz-g" class="jz-input" value="${esc(fields.group)}" size="16">
            <button type="button" class="jz-btn" data-act="gsearch">Chercher groupe</button>
            <button type="button" class="jz-btn" data-act="gall">Tout les groupes</button></div>
          <div class="jz-row"><label for="jz-s">Recherche</label><input id="jz-s" class="jz-input" value="${esc(fields.search)}" size="16">
            <button type="button" class="jz-btn primary" data-act="search">Chercher</button></div>
          <div class="jz-row"><label for="jz-ge">Genre</label><input id="jz-ge" class="jz-input" value="${esc(fields.genre)}" size="8">
            <label for="jz-mi">Annee min</label><input id="jz-mi" class="jz-input" value="${esc(fields.min)}" size="4" inputmode="numeric">
            <label for="jz-ma">Annee max</label><input id="jz-ma" class="jz-input" value="${esc(fields.max)}" size="4" inputmode="numeric">
            <button type="button" class="jz-btn" data-act="adv">Recherche avancee</button>
            <button type="button" class="jz-btn" data-act="all">Tout afficher</button></div>
        </div>
        <div class="jz-context"><b>${esc(catalogContext)}</b><pre class="jz-area">${esc(albumDetails)}</pre></div>
        <div class="jz-three">
          <fieldset><legend>Groupes</legend>${list("groups", groups, selGroup, groupStr)}</fieldset>
          <fieldset><legend>Albums</legend>${list("albums", albums, selAlbum, albumStr)}</fieldset>
          <fieldset><legend>Titres</legend>${list("tracks", tracks, selTrack, trackStr)}</fieldset>
        </div>
        <div class="jz-row jz-actions">
          <button type="button" class="jz-btn primary" data-act="play">Lire le morceau selectionne</button>
          <button type="button" class="jz-btn" data-act="play">Lecture rapide</button>
          <button type="button" class="jz-btn" data-act="rate">Noter</button>
          <span class="jz-counter">${visitor ? `Ecoutes restantes: ${svc.remainingVisitorPlays()}` : ""}</span>
        </div>`;
      const v = (id) => panel.querySelector(id).value;
      const keep = () => { fields = { group: v("#jz-g"), search: v("#jz-s"), genre: v("#jz-ge"), min: v("#jz-mi"), max: v("#jz-ma") }; };
      panel.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.matches("input")) {
          e.preventDefault();
          const id = e.target.id;
          panel.querySelector(id === "jz-g" ? '[data-act="gsearch"]' : id === "jz-s" ? '[data-act="search"]' : '[data-act="adv"]').click();
        }
        const lst = e.target.closest(".jz-list");
        if (lst && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          const n = lst.querySelectorAll(".jz-opt").length; if (!n) return;
          const cur = { groups: selGroup, albums: selAlbum, tracks: selTrack }[lst.dataset.list];
          selectIn(lst.dataset.list, Math.max(0, Math.min(n - 1, cur + (e.key === "ArrowDown" ? 1 : -1))), true);
        }
        if (lst && e.key === "Enter" && lst.dataset.list === "tracks") { e.preventDefault(); play(); }
      });
      panel.addEventListener("click", async (e) => {
        const opt = e.target.closest(".jz-opt");
        if (opt) return selectIn(opt.closest(".jz-list").dataset.list, +opt.dataset.i);
        const b = e.target.closest("[data-act]"); if (!b) return;
        keep();
        const act = b.dataset.act;
        try {
          if (act === "gsearch") {
            groups = svc.searchGroups(fields.group.trim()); albums = []; tracks = []; albumDetails = "";
            selGroup = groups.length ? 0 : -1;
            if (selGroup >= 0) renderAlbumsForSelectedGroup(); else catalogContext = "Aucun groupe trouve pour: " + fields.group.trim();
          } else if (act === "gall") refreshGroups();
          else if (act === "search") { groups = []; albums = []; selGroup = selAlbum = -1; tracks = svc.search(fields.search.trim()); selTrack = -1; }
          else if (act === "adv") {
            const p = (x) => { x = x.trim(); if (!x) return null; if (!/^-?\d+$/.test(x)) throw new BusinessException(`For input string: "${x}"`); return +x; };
            const mi = p(fields.min), ma = p(fields.max);
            groups = []; albums = []; selGroup = selAlbum = -1; tracks = svc.advancedSearch(fields.genre.trim(), mi, ma); selTrack = -1;
          } else if (act === "all") { tracks = svc.getAllTracks(); selTrack = -1; }
          else if (act === "play") return play();
          else if (act === "rate") return rate();
        } catch (err) { showError(err); }
        renderApp();
      });
      // garde la ligne sélectionnée visible
      panel.querySelectorAll('.jz-opt[aria-selected="true"]').forEach((o) => o.scrollIntoView({ block: "nearest" }));
    }
    function selectIn(listName, i, focus) {
      if (listName === "groups") { selGroup = i; renderAlbumsForSelectedGroup(); }
      else if (listName === "albums") { selAlbum = i; renderTracksForSelectedAlbum(); }
      else selTrack = i;
      renderApp();
      if (focus) body.querySelector(`[data-list="${listName}"]`)?.focus({ preventScroll: true });
    }
    async function play() {
      const t = tracks[selTrack];
      if (!t) return showInfo("Selectionnez un morceau.");
      try {
        svc.playTrack(currentUser, t.id); save();
        startPlayer(t);
        renderApp();
        await showInfo("Lecture en cours: " + trackStr(t));
      } catch (err) { showError(err); }
    }
    async function rate() {
      if (currentUser.role !== "SUBSCRIBER") return showInfo("Seuls les abonnes peuvent noter.");
      const t = tracks[selTrack];
      if (!t) return showInfo("Selectionnez un morceau.");
      const scoreRaw = await ask("Note (1-5)"); if (scoreRaw === null) return;
      let review = await ask("Avis"); if (review === null) review = "";
      try {
        const n = scoreRaw.trim();
        if (!/^-?\d+$/.test(n)) throw new BusinessException(`For input string: "${n}"`);
        svc.addRating(t.id, currentUser.username, +n, review); save();
        renderApp();
        showInfo("Avis enregistre.");
      } catch (err) { showError(err); }
    }

    /* ----- lecture : barre de progression (pas de fichiers audio dans le projet) ----- */
    function startPlayer(t) { stopPlayer(); player = { t, start: Date.now(), paused: false, offset: 0 }; player.timer = setInterval(renderPlayer, 500); }
    function stopPlayer() { if (player) clearInterval(player.timer); player = null; }
    function renderPlayer() {
      const el = body.querySelector(".jz-player"); if (!el) return;
      if (!player) { el.hidden = true; return; }
      const d = player.t.durationSeconds;
      const pos = Math.min(d, Math.floor(((player.paused ? 0 : Date.now() - player.start) + player.offset) / 1000));
      if (pos >= d) { stopPlayer(); el.hidden = true; return; }
      const mm = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      el.hidden = false;
      el.innerHTML = `
        <button type="button" class="jz-pp" aria-label="${player.paused ? "Reprendre" : "Pause"}">${player.paused ? "▶" : "❚❚"}</button>
        <div class="jz-np"><b>${esc(player.t.title)}</b><span>${esc(player.t.artist)} · ${esc(player.t.genre)}</span></div>
        <span class="jz-time">${mm(pos)}</span><div class="jz-prog"><i style="width:${(pos / d) * 100}%"></i></div><span class="jz-time">${mm(d)}</span>
        <button type="button" class="jz-x" aria-label="Arrêter">✕</button>`;
      el.querySelector(".jz-pp").onclick = () => {
        if (player.paused) { player.start = Date.now(); player.paused = false; } else { player.offset += Date.now() - player.start; player.paused = true; }
        renderPlayer();
      };
      el.querySelector(".jz-x").onclick = () => { stopPlayer(); renderPlayer(); };
    }

    /* ----- onglet Playlists ----- */
    function renderPlaylists(panel) {
      const pls = svc.getUserPlaylists(currentUser.username);
      if (selPlaylist >= pls.length) selPlaylist = Math.max(0, pls.length - 1);
      const p = pls[selPlaylist];
      const details = !p ? "Aucune playlist selectionnee." :
        `Playlist: ${p.name}\n------------------------------\n` + p.trackIds.map((id) => {
          const t = state.tracks[id]; return t ? `- ${t.title} / ${t.artist}  [${id}]` : `- ${id} (introuvable)`;
        }).join("\n");
      const t = tracks[selTrack];
      panel.innerHTML = `
        <div class="jz-row">
          <label for="jz-pl">Playlist</label>
          <select id="jz-pl" class="jz-input">${pls.map((x, i) => `<option value="${i}" ${i === selPlaylist ? "selected" : ""}>${esc(`${x.name} (${x.trackIds.length} morceaux)`)}</option>`).join("")}</select>
          <button type="button" class="jz-btn" data-act="refresh">Actualiser</button>
          <button type="button" class="jz-btn primary" data-act="create">Creer</button>
          <button type="button" class="jz-btn" data-act="rename">Renommer</button>
          <button type="button" class="jz-btn" data-act="delete">Supprimer</button>
        </div>
        <pre class="jz-area big">${esc(details)}</pre>
        <div class="jz-row">
          <button type="button" class="jz-btn primary" data-act="add">Ajouter morceau</button>
          <button type="button" class="jz-btn" data-act="remove">Retirer morceau</button>
          <button type="button" class="jz-btn" data-act="show">Afficher contenu</button>
          <span class="jz-counter">${t ? "Morceau sélectionné dans le catalogue : " + esc(t.title) : "Sélectionnez d'abord un morceau dans l'onglet Catalogue."}</span>
        </div>`;
      panel.querySelector("#jz-pl").onchange = (e) => { selPlaylist = +e.target.value; renderApp(); };
      panel.addEventListener("click", async (e) => {
        const b = e.target.closest("[data-act]"); if (!b) return;
        const u = currentUser.username, act = b.dataset.act;
        try {
          if (act === "create") {
            const name = await ask("Nom de la playlist"); if (!name || !name.trim()) return;
            svc.createPlaylist(u, name.trim()); save(); selPlaylist = svc.getUserPlaylists(u).length - 1; renderApp(); return showInfo("Playlist creee.");
          }
          if (act === "refresh" || act === "show") return renderApp();
          if (!p) return showInfo("Aucune playlist selectionnee.");
          if (act === "rename") {
            const nn = await ask("Nouveau nom", p.name); if (!nn || !nn.trim()) return;
            svc.renamePlaylist(u, p.name, nn.trim()); save(); renderApp(); return showInfo("Playlist renommee.");
          }
          if (act === "delete") { svc.deletePlaylist(u, p.name); save(); selPlaylist = 0; renderApp(); return showInfo("Playlist supprimee."); }
          if (act === "add") {
            if (!t) return showInfo("Selectionnez un morceau dans le catalogue.");
            svc.addTrackToPlaylist(u, p.name, t.id); save(); renderApp(); return showInfo("Morceau ajoute a la playlist.");
          }
          if (act === "remove") {
            const id = await ask("ID du morceau a retirer"); if (!id || !id.trim()) return;
            svc.removeTrackFromPlaylist(u, p.name, id.trim()); save(); renderApp(); return showInfo("Morceau retire de la playlist.");
          }
        } catch (err) { showError(err); }
      });
    }

    /* ----- onglet Historique ----- */
    function renderHistory(panel) {
      const h = currentUser.history.map((id) => { const t = state.tracks[id]; return t ? `- ${t.title} / ${t.artist}` : `- ${id} (introuvable)`; });
      panel.innerHTML = `<button type="button" class="jz-btn jz-wide" data-act="r">Actualiser historique</button>
        <pre class="jz-area big">${esc("Historique d'ecoute\n------------------------------\n" + h.join("\n"))}</pre>`;
      panel.querySelector('[data-act="r"]').onclick = () => renderApp();
    }

    /* ----- onglet Statistiques ----- */
    function renderStats(panel) {
      const tt = svc.topTracks(5).map(([k, v]) => `${k} : ${v}`).join("\n");
      const tg = svc.topGenres(5).map(([k, v]) => `${k} : ${v}`).join("\n");
      panel.innerHTML = `<button type="button" class="jz-btn jz-wide" data-act="r">Actualiser statistiques</button>
        <pre class="jz-area big">${esc(`Top 5 morceaux\n------------------------------\n${tt}\n\nTop 5 genres\n------------------------------\n${tg}`)}</pre>`;
      panel.querySelector('[data-act="r"]').onclick = () => renderApp();
    }

    /* ----- onglet Administration ----- */
    function renderAdmin(panel) {
      const subs = Object.values(state.users).filter((u) => u.role === "SUBSCRIBER");
      panel.innerHTML = `
        <div class="jz-admin">
          <div class="jz-row">
            <label for="jz-a-id">ID</label><input id="jz-a-id" class="jz-input" size="8">
            <label for="jz-a-t">Titre</label><input id="jz-a-t" class="jz-input" size="12">
            <label for="jz-a-ar">Artiste</label><input id="jz-a-ar" class="jz-input" size="10">
            <label for="jz-a-g">Genre</label><input id="jz-a-g" class="jz-input" size="8">
            <label for="jz-a-y">Annee</label><input id="jz-a-y" class="jz-input" size="6" inputmode="numeric">
            <label for="jz-a-d">Duree</label><input id="jz-a-d" class="jz-input" size="6" inputmode="numeric">
            <button type="button" class="jz-btn primary" data-act="add">Ajouter morceau</button>
          </div>
          <div class="jz-row">
            <label for="jz-a-rm">ID morceau a supprimer</label><input id="jz-a-rm" class="jz-input" size="10">
            <button type="button" class="jz-btn" data-act="rm">Supprimer morceau</button>
          </div>
          <div class="jz-row">
            <label for="jz-a-u">Abonne</label><input id="jz-a-u" class="jz-input" size="12" list="jz-subs">
            <datalist id="jz-subs">${subs.map((u) => `<option value="${esc(u.username)}">`).join("")}</datalist>
            <button type="button" class="jz-btn" data-act="susp">Suspendre</button>
            <button type="button" class="jz-btn" data-act="del">Supprimer</button>
          </div>
          <pre class="jz-area">${esc("Abonnes\n------------------------------\n" + subs.map((u) => `${u.username}${u.suspended ? "  (suspendu)" : ""}`).join("\n"))}</pre>
        </div>`;
      const v = (id) => panel.querySelector(id).value.trim();
      panel.addEventListener("click", (e) => {
        const b = e.target.closest("[data-act]"); if (!b) return;
        try {
          if (b.dataset.act === "add") {
            const num = (x) => { if (!/^-?\d+$/.test(x)) throw new BusinessException(`For input string: "${x}"`); return +x; };
            svc.addTrack({ id: v("#jz-a-id"), title: v("#jz-a-t"), artist: v("#jz-a-ar"), genre: v("#jz-a-g"), releaseYear: num(v("#jz-a-y")), durationSeconds: num(v("#jz-a-d")) });
            save(); renderApp(); showInfo("Morceau ajoute.");
          } else if (b.dataset.act === "rm") { svc.removeTrack(v("#jz-a-rm")); save(); renderApp(); showInfo("Morceau supprime."); }
          else if (b.dataset.act === "susp") { svc.suspendSubscriber(v("#jz-a-u")); save(); renderApp(); showInfo("Abonne suspendu."); }
          else if (b.dataset.act === "del") { svc.deleteSubscriber(v("#jz-a-u")); save(); renderApp(); showInfo("Abonne supprime."); }
        } catch (err) { showError(err); }
      });
    }

    renderLogin();
    return { destroy() { stopPlayer(); save(); } };
  }

  window.Javazic = { mount };
})();
