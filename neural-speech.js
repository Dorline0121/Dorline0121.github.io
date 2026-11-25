/* =========================================================
   Neural Speech — reconnaissance vocale embarquée (ECE ING3)
   ---------------------------------------------------------
   - Vidéo du résultat final (bouton → « Paris » → Google Earth)
   - Rejouer la reconnaissance : vrais enregistrements du dataset
     (8 kHz, 1 s, captés par l'Arduino Due), MFCC calculés ici avec
     exactement l'algorithme de audio_utils.py, puis le MLP
     416 → 64 → 32 → 4 exporté depuis modele_final.joblib.
   - Essai au micro (expérimental) et preuves de validation FP1-FP6.
   Données : assets/neural-speech-data.js
   ========================================================= */
(function () {
  const COUL = ["#1C7ED6", "#E03131", "#2F9E44", "#F08C00"];
  const DEST = [
    { nom: "ILE_DE_FRANCE", q: "Ile-de-France", c: "48.8499,2.6370" },
    { nom: "TOGO", q: "Togo", c: "8.6195,0.8248" },
    { nom: "CAMEROUN", q: "Cameroun", c: "7.3697,12.3547" },
    { nom: "COTE_DIVOIRE", q: "Cote d'Ivoire", c: "7.5400,-5.5471" },
  ];
  const TXT = {
    fr: {
      loading: "Chargement du modèle…", fail: "Impossible de charger le modèle.",
      video: "Résultat final", videoCap: "On appuie sur le bouton, on dit « Paris » : l'Arduino Due enregistre, le modèle reconnaît le mot et Google Earth s'envole vers l'Île-de-France.",
      chaine: "La chaîne complète, validée étape par étape",
      fp: [
        ["FP1", "Acquisition à 32 kHz", "Timer + ADC 12 bits, signal restitué par le DAC : les deux courbes se superposent à l'oscilloscope."],
        ["FP2", "Filtre passe-bas anti-repliement", "Biquad IIR : −73,6 dB vers 3,8 kHz (exigence : −30 dB à 4 kHz)."],
        ["FP3", "Décimation 32 → 8 kHz", "Un échantillon sur 4 après filtrage : 4 fois moins de mémoire et de calcul."],
        ["FP4", "MFCC", "Trames de 512 points, pas de 256, 13 coefficients × 32 trames = vecteur de 416 valeurs."],
        ["FP5", "Classification (MLP)", "Réseau 416 → 64 → 32 → 4, poids exportés en C dans model.h pour l'Arduino."],
        ["FP6", "Intégration", "Bouton + LED sur l'Arduino, liaison série vers Python, navigation Google Earth avec Selenium."],
      ],
      rejouer: "Rejouer la reconnaissance", rejouerLead: "Choisissez un vrai enregistrement du dataset (1 seconde à 8 kHz, capté par notre montage). Les MFCC et le réseau de neurones sont recalculés ici, avec le même algorithme et les mêmes poids que sur le projet.",
      ecouter: "▶ Écouter", onde: "Signal (8 kHz, 1 s)", mfcc: "MFCC : 13 coefficients × 32 trames (= 416 entrées du réseau)",
      proba: "Sortie du réseau (softmax)", terminal: "Ce qu'affiche alors application.py", ouvrir: "Ouvrir dans Google Earth ↗",
      micro: "🎙 Essayer avec ma voix", microNote: "Expérimental : le modèle a appris sur nos voix, avec le micro MAX9814 de l'Arduino. Un autre micro et une autre voix peuvent le tromper. Cliquez, puis dites un des 4 mots dans la seconde qui suit.",
      parlez: "Parlez maintenant…", microKo: "Micro indisponible ici (autorisation refusée ou non prise en charge par cette page).", votreVoix: "votre voix",
      noteData: "Ces enregistrements font partie des 200 du dataset (50 par mot, dont 36 augmentés), qui ont servi à entraîner le modèle final. En validation croisée à 5 plis sur ces 200 enregistrements, le même réseau reconnaît le bon mot dans environ 93 % des cas.",
      preuves: "Preuves de validation", caps: [
        "Montage : Arduino Due, micro MAX9814, bouton et LED",
        "FP1 : signal d'origine et signal reconstruit (ADC → DAC) superposés",
        "FP2 : spectre Audacity après filtrage, −73 dB vers 3,8 kHz",
        "FP2 : test à 8 000 Hz, le signal est quasiment éteint",
        "FP4 : enregistrements du dataset dans Audacity",
      ],
      mots: ["PARIS", "TOGO", "CAMEROUN", "IVOIRE"],
    },
    en: {
      loading: "Loading the model…", fail: "The model could not be loaded.",
      video: "Final result", videoCap: "Press the button, say “Paris”: the Arduino Due records, the model recognises the word and Google Earth flies to Île-de-France.",
      chaine: "The full chain, validated step by step",
      fp: [
        ["FP1", "Capture at 32 kHz", "Timer + 12-bit ADC, signal played back by the DAC: both curves overlap on the oscilloscope."],
        ["FP2", "Anti-aliasing low-pass filter", "IIR biquad: −73.6 dB around 3.8 kHz (requirement: −30 dB at 4 kHz)."],
        ["FP3", "Decimation 32 → 8 kHz", "One sample in 4 after filtering: 4 times less memory and computation."],
        ["FP4", "MFCC", "512-point frames, hop of 256, 13 coefficients × 32 frames = a 416-value vector."],
        ["FP5", "Classification (MLP)", "416 → 64 → 32 → 4 network, weights exported to C in model.h for the Arduino."],
        ["FP6", "Integration", "Button + LED on the Arduino, serial link to Python, Google Earth navigation with Selenium."],
      ],
      rejouer: "Replay the recognition", rejouerLead: "Pick a real recording from the dataset (1 second at 8 kHz, captured by our circuit). The MFCCs and the neural network are recomputed here, with the same algorithm and the same weights as in the project.",
      ecouter: "▶ Listen", onde: "Signal (8 kHz, 1 s)", mfcc: "MFCC: 13 coefficients × 32 frames (= the network's 416 inputs)",
      proba: "Network output (softmax)", terminal: "What application.py then prints", ouvrir: "Open in Google Earth ↗",
      micro: "🎙 Try with my voice", microNote: "Experimental: the model learned from our voices, through the Arduino's MAX9814 microphone. Another microphone and another voice can fool it. Click, then say one of the 4 words within a second.",
      parlez: "Speak now…", microKo: "Microphone unavailable here (permission denied or not supported by this page).", votreVoix: "your voice",
      noteData: "These recordings are part of the 200 in the dataset (50 per word, 36 of them augmented), which were used to train the final model. In 5-fold cross-validation on these 200 recordings, the same network recognises the right word about 93% of the time.",
      preuves: "Validation evidence", caps: [
        "Circuit: Arduino Due, MAX9814 microphone, button and LED",
        "FP1: original and reconstructed (ADC → DAC) signals overlapping",
        "FP2: Audacity spectrum after filtering, −73 dB around 3.8 kHz",
        "FP2: test at 8,000 Hz, the signal is almost gone",
        "FP4: dataset recordings in Audacity",
      ],
      mots: ["PARIS", "TOGO", "CAMEROUN", "IVOIRE"],
    },
  };
  const PHOTOS = ["ns-montage.jpg", "ns-fp1-oscillo.jpg", "ns-fp2-spectre.jpg", "ns-fp2-8khz.jpg", "ns-fp4-dataset.jpg"];

  let charge = null;
  function charger() {
    if (charge) return charge;
    charge = new Promise((ok, ko) => {
      if (window.NEURAL_SPEECH) return ok();
      const s = document.createElement("script"); s.src = "assets/neural-speech-data.js"; s.onload = ok; s.onerror = ko; document.head.appendChild(s);
    }).then(() => prep(window.NEURAL_SPEECH)).catch((e) => { charge = null; throw e; });
    return charge;
  }
  const b64 = (s) => { const o = atob(s), u = new Uint8Array(o.length); for (let i = 0; i < o.length; i++) u[i] = o.charCodeAt(i); return u.buffer; };
  function prep(D) {
    const pcm = new Int16Array(b64(D.pcm)), w = new Float32Array(b64(D.w));
    let o = 0; const L = [];
    D.shapes.forEach(([a, b]) => { L.push({ W: w.subarray(o, o + a * b), b: w.subarray(o + a * b, o + a * b + b), a, n: b }); o += a * b + b; });
    return { D, L, rec: (i) => pcm.subarray(i * 8000, (i + 1) * 8000) };
  }

  /* ---------- MFCC : même algorithme que audio_utils.py ---------- */
  const N_FFT = 512, HOP = 256, NF = 32, NM = 26, NC = 13, SR = 8000;
  const f32 = Math.fround;
  const HAM = Float32Array.from({ length: N_FFT }, (_, n) => 0.54 - 0.46 * Math.cos(2 * Math.PI * n / (N_FFT - 1)));
  const MEL = (() => {
    const mlo = 2595 * Math.log10(1 + 150 / 700), mhi = 2595 * Math.log10(1 + (SR / 2) / 700);
    const hz = Array.from({ length: NM + 2 }, (_, i) => { const m = f32(mlo + (mhi - mlo) * i / (NM + 1)); return f32(700 * (10 ** (m / 2595) - 1)); });
    const nb = N_FFT / 2, fr = Array.from({ length: nb }, (_, k) => f32(k * (SR / N_FFT)));
    return Array.from({ length: NM }, (_, i) => {
      const [l, c, r] = [hz[i], hz[i + 1], hz[i + 2]], row = new Float32Array(nb);
      for (let k = 0; k < nb; k++) { const f = fr[k]; if (f >= l && f < c && c > l) row[k] = (f - l) / (c - l); else if (f >= c && f <= r && r > c) row[k] = (r - f) / (r - c); }
      return row;
    });
  })();
  const DCT = Array.from({ length: NC }, (_, i) => Float32Array.from({ length: NM }, (_, j) => Math.cos(Math.PI * i * (j + 0.5) / NC)));
  function fftMag(x) {
    const n = x.length, re = Float64Array.from(x), im = new Float64Array(n);
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; } }
    for (let len = 2; len <= n; len <<= 1) {
      const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
          re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
    const m = new Float32Array(n / 2); for (let k = 0; k < n / 2; k++) m[k] = Math.hypot(re[k], im[k]); return m;
  }
  function features(audio) {
    let mx = 0; for (const v of audio) mx = Math.max(mx, Math.abs(v));
    const need = N_FFT + (NF - 1) * HOP, a = new Float32Array(Math.max(need, audio.length));
    for (let i = 0; i < audio.length; i++) a[i] = mx > 0 ? audio[i] / mx : audio[i];
    const out = new Float32Array(NF * NC);
    for (let w = 0; w < NF; w++) {
      const fr = a.slice(w * HOP, w * HOP + N_FFT);
      for (let j = 1; j < N_FFT; j++) fr[j] = fr[j] - 0.95 * fr[j - 1];
      let s = 0; for (let j = 0; j < N_FFT; j++) { fr[j] *= HAM[j]; s += fr[j]; }
      const mu = s / N_FFT; for (let j = 0; j < N_FFT; j++) fr[j] -= mu;
      const mag = fftMag(fr);
      const ml = MEL.map((row) => { let e = 0; for (let k = 0; k < row.length; k++) e += row[k] * mag[k]; return Math.log10(Math.max(e, 1e-12)); });
      for (let i = 0; i < NC; i++) { let d = 0; for (let j = 0; j < NM; j++) d += DCT[i][j] * ml[j]; out[w * NC + i] = d; }
    }
    let m = 0; for (const v of out) m += v; m /= out.length;
    let sd = 0; for (const v of out) sd += (v - m) ** 2; sd = Math.sqrt(sd / out.length);
    const vec = out.map((v) => (v - m) / (sd + 1e-6));
    return { vec, raw: out };
  }
  function mlp(L, x) {
    let h = x;
    L.forEach((l, k) => {
      const o = new Float64Array(l.n);
      for (let j = 0; j < l.n; j++) { let s = l.b[j]; for (let i = 0; i < l.a; i++) s += h[i] * l.W[i * l.n + j]; o[j] = k < L.length - 1 ? Math.max(0, s) : s; }
      h = o;
    });
    const mx = Math.max(...h), e = Array.from(h, (v) => Math.exp(v - mx)), t = e.reduce((a, b) => a + b, 0);
    return e.map((v) => v / t);
  }

  function mount(root, lang) {
    const T = TXT[lang] || TXT.fr, loc = lang === "en" ? "en-US" : "fr-FR";
    const nb = (v, d = 0) => v.toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d });
    let detruit = false, ctx = null, flux = null;
    root.innerHTML = `<p class="ds-loading">${T.loading}</p>`;
    charger().then((M) => { if (!detruit) construire(M); }).catch(() => { if (!detruit) root.innerHTML = `<p class="ds-loading">${T.fail}</p>`; });

    function construire(M) {
      const D = M.D;
      root.innerHTML = `
        <div class="ns-top">
          <figure class="ds-box ns-video"><h5>${T.video}</h5>
            <video controls playsinline preload="metadata" poster="assets/neural-speech-poster.jpg"><source src="assets/neural-speech-demo.mp4" type="video/mp4"></video>
            <figcaption class="ds-small">${T.videoCap}</figcaption></figure>
          <div class="ds-box"><h5>${T.chaine}</h5><ol class="ns-fp">${T.fp.map(([a, b, c]) => `<li><b>${a}</b><div><strong>${b}</strong><span>${c}</span></div></li>`).join("")}</ol></div>
        </div>
        <div class="ds-box"><h5>${T.rejouer}</h5><p class="ds-small">${T.rejouerLead}</p>
          <div class="ns-recs">${T.mots.map((m, c) => `<div><span class="ns-mot" style="--c:${COUL[c]}">${m}</span>${D.recs.map((r, i) => (r[0] === c ? `<button class="ds-pill" data-r="${i}">${r[1].replace(".wav", "").replace(/^[A-Z]+_/, "#")}</button>` : "")).join("")}</div>`).join("")}</div>
          <div class="ds-ctrl"><button class="btn" id="ns-play">${T.ecouter}</button><button class="btn btn-ghost" id="ns-mic">${T.micro}</button><span class="ds-small" id="ns-etat"></span></div>
          <p class="ds-small">${T.microNote}</p>
          <div class="ns-grid">
            <div class="ns-col"><span class="im-lab">${T.onde}</span><div id="ns-onde"></div><span class="im-lab">${T.mfcc}</span><div id="ns-mfcc"></div></div>
            <div class="ns-col"><span class="im-lab">${T.proba}</span><div id="ns-proba"></div><span class="im-lab">${T.terminal}</span><pre class="ns-term" id="ns-term"></pre><a class="btn" id="ns-earth" target="_blank" rel="noopener">${T.ouvrir}</a></div>
          </div>
          <p class="ds-small">${T.noteData}</p>
        </div>
        <div class="ds-box"><h5>${T.preuves}</h5><div class="ns-gal">${PHOTOS.map((p, i) => `<figure><a href="assets/${p}" target="_blank" rel="noopener"><img src="assets/${p}" alt="${T.caps[i]}" loading="lazy"></a><figcaption>${T.caps[i]}</figcaption></figure>`).join("")}</div></div>`;
      const q = (s) => root.querySelector(s);
      let courant = { audio: null, label: null, nom: "" };

      function analyser(audio, label, nom) {
        courant = { audio, label, nom };
        // forme d'onde
        const W = 560, H = 90, pas = audio.length / W; let d = "", amax = 1e-9;
        for (const v of audio) amax = Math.max(amax, Math.abs(v));
        audio = Float32Array.from(audio, (v) => v / amax * 0.95);
        for (let x = 0; x < W; x++) { let lo = 0, hi = 0; for (let i = Math.floor(x * pas); i < Math.floor((x + 1) * pas); i++) { lo = Math.min(lo, audio[i]); hi = Math.max(hi, audio[i]); } d += `M${x} ${(H / 2 - hi * H / 2).toFixed(1)}V${(H / 2 - lo * H / 2 + 0.5).toFixed(1)}`; }
        const col = label === null ? "var(--accent)" : COUL[label];
        q("#ns-onde").innerHTML = `<svg class="ds-svg ns-onde" viewBox="0 0 ${W} ${H}"><line x1="0" x2="${W}" y1="${H / 2}" y2="${H / 2}" class="ds-g"/><path d="${d}" stroke="${col}" stroke-width="1"/></svg>`;
        const { vec, raw } = features(audio);
        // MFCC (13 lignes × 32 colonnes), couleurs normalisées coefficient par coefficient
        const cw = 17, ch = 9; let r = "";
        for (let c = 0; c < NC; c++) {
          let mn = Infinity, mx = -Infinity; for (let f = 0; f < NF; f++) { const v = vec[f * NC + c]; mn = Math.min(mn, v); mx = Math.max(mx, v); }
          for (let f = 0; f < NF; f++) { const t = (vec[f * NC + c] - mn) / (mx - mn || 1); r += `<rect x="${f * cw}" y="${c * ch}" width="${cw + 0.5}" height="${ch + 0.5}" fill="hsl(${250 - t * 210} 70% ${22 + t * 48}%)"/>`; }
        }
        q("#ns-mfcc").innerHTML = `<svg class="ds-svg" viewBox="0 0 ${NF * cw} ${NC * ch}">${r}</svg>`;
        void raw;
        const p = mlp(M.L, vec), k = p.indexOf(Math.max(...p));
        q("#ns-proba").innerHTML = T.mots.map((m, c) => `<div class="im-pbar ns-pbar${c === k ? " on" : ""}"><span>${m}</span><div><i style="width:${(p[c] * 100).toFixed(1)}%;background:${COUL[c]}"></i></div><b>${nb(p[c] * 100, 1)} %</b></div>`).join("");
        const conf = p[k], dst = DEST[k];
        q("#ns-term").textContent = [`Log Arduino: RESULT:${k}`, `✈️ Direction : ${dst.nom} (${dst.c})`].join("\n");
        q("#ns-earth").href = `https://earth.google.com/web/search/${encodeURIComponent(dst.q)}`;
        q("#ns-etat").textContent = nom + (label === null ? "" : ` · ${T.mots[label]}`) + (label === null ? "" : k === label ? " ✓" : " ✗");
      }
      const choisir = (i) => {
        root.querySelectorAll("[data-r]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.r === i));
        const pcm = M.rec(i), a = Float32Array.from(pcm, (v) => v / 32768);
        analyser(a, D.recs[i][0], D.recs[i][1]);
      };
      root.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => { choisir(+b.dataset.r); jouer(); }));
      function jouer() {
        if (!courant.audio) return;
        try {
          ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
          const buf = ctx.createBuffer(1, courant.audio.length, SR); buf.copyToChannel(Float32Array.from(courant.audio), 0);
          const s = ctx.createBufferSource(); s.buffer = buf; s.connect(ctx.destination); s.start();
        } catch (e) { /* lecture audio indisponible */ }
      }
      q("#ns-play").addEventListener("click", jouer);
      q("#ns-mic").addEventListener("click", async () => {
        const etat = q("#ns-etat");
        try {
          flux = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
          const mc = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: SR });
          const src = mc.createMediaStreamSource(flux), proc = mc.createScriptProcessor(1024, 1, 1), acc = new Float32Array(SR); let n = 0;
          etat.textContent = T.parlez;
          proc.onaudioprocess = (e) => {
            const x = e.inputBuffer.getChannelData(0);
            for (let i = 0; i < x.length && n < SR; i++) acc[n++] = x[i];
            if (n >= SR) {
              proc.disconnect(); src.disconnect(); flux.getTracks().forEach((t) => t.stop()); mc.close();
              root.querySelectorAll("[data-r]").forEach((b) => b.setAttribute("aria-pressed", false));
              if (!detruit) analyser(acc, null, T.votreVoix);
            }
          };
          src.connect(proc); proc.connect(mc.destination);
        } catch (e) { etat.textContent = T.microKo; }
      });
      choisir(0);
    }
    return { destroy() { detruit = true; if (flux) flux.getTracks().forEach((t) => t.stop()); if (ctx) ctx.close(); root.querySelectorAll("video").forEach((v) => v.pause()); root.innerHTML = ""; } };
  }
  window.NeuralSpeech = { mount, _core: { features, mlp, prep } };
})();
