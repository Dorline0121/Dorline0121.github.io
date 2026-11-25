/* =====================================================================
   Carte de suivi des livraisons au Cameroun (Leaflet + OpenStreetMap)
   Utilisée par project/suivi.php (client) et admin/dash2.php (admin).
   Chaque livraison = itinéraire depuis Douala, partie parcourue en couleur,
   camion à la ville actuelle, drapeau à la destination.
   ===================================================================== */
window.SuiviCarte = (function () {
    const COULEURS = {
        'Confirmée': '#6b7280',
        'En préparation': '#3b82f6',
        'Expédiée': '#f59e0b',
        'En transit': '#29ADE4',
        'Arrivée en ville': '#8b5cf6',
        'Livrée': '#16a34a',
    };
    const ORDRE = ['Confirmée', 'En préparation', 'Expédiée', 'En transit', 'Arrivée en ville', 'Livrée'];
    const CENTRE_CAMEROUN = [6.2, 12.4];

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const fcfa = (v) => Number(v || 0).toLocaleString('fr-FR') + ' FCFA';

    function creerCarte(idElement) {
        const carte = L.map(idElement, { scrollWheelZoom: false }).setView(CENTRE_CAMEROUN, 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; contributeurs OpenStreetMap',
        }).addTo(carte);
        return carte;
    }

    function icone(emoji, couleur, taille = 34) {
        return L.divIcon({
            className: 'suivi-icone',
            html: `<div style="width:${taille}px;height:${taille}px;border-radius:50%;background:${couleur};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:${Math.round(taille * 0.5)}px">${emoji}</div>`,
            iconSize: [taille, taille],
            iconAnchor: [taille / 2, taille / 2],
            popupAnchor: [0, -taille / 2],
        });
    }

    /** Position actuelle du colis (ville de l'étape en cours). */
    function position(l) {
        const p = l.itineraire[Math.min(l.etape, l.itineraire.length - 1)];
        return [p.lat, p.lng];
    }

    /** Progression en % (statuts + villes traversées). */
    function progression(l) {
        if (l.statut === 'Livrée') return 100;
        const n = l.itineraire.length - 1;
        const base = { 'Confirmée': 5, 'En préparation': 15, 'Expédiée': 25 }[l.statut];
        if (base !== undefined) return base;
        if (l.statut === 'Arrivée en ville') return 92;
        return Math.round(25 + (n ? l.etape / n : 1) * 65);
    }

    /** Dessine une livraison ; renvoie les couches créées (pour pouvoir les effacer). */
    function dessiner(carte, l, opts = {}) {
        const couleur = COULEURS[l.statut] || '#29ADE4';
        const pts = l.itineraire.map((p) => [p.lat, p.lng]);
        const fait = pts.slice(0, Math.min(l.etape, pts.length - 1) + 1);
        const couches = [];
        // itinéraire complet en pointillés, partie parcourue en trait plein
        if (pts.length > 1) {
            couches.push(L.polyline(pts, { color: couleur, weight: opts.epais ? 5 : 3, opacity: 0.35, dashArray: '8 8' }).addTo(carte));
            if (fait.length > 1) couches.push(L.polyline(fait, { color: couleur, weight: opts.epais ? 6 : 4, opacity: 0.95 }).addTo(carte));
        }
        // villes de passage
        if (opts.villes) {
            l.itineraire.forEach((p, i) => {
                const passee = i <= l.etape;
                couches.push(L.circleMarker([p.lat, p.lng], { radius: 6, color: '#fff', weight: 2, fillColor: passee ? couleur : '#cbd5e1', fillOpacity: 1 })
                    .bindTooltip(p.ville, { direction: 'top', offset: [0, -6] }).addTo(carte));
            });
        }
        // destination
        const dest = pts[pts.length - 1];
        if (l.statut !== 'Livrée' && pts.length > 1) couches.push(L.marker(dest, { icon: icone('🏁', '#111827', 28) }).bindTooltip('Destination : ' + esc(l.destination)).addTo(carte));
        // camion (ou colis livré)
        const popup = `<b>${esc(l.code)}</b><br>${esc(l.client || '')}<br>${esc(l.statut)} · ${esc(l.itineraire[Math.min(l.etape, pts.length - 1)].ville)} → ${esc(l.destination)}<br>${l.km} km · prévue le ${esc(l.prevue || '')}`;
        const m = L.marker(position(l), { icon: icone(l.statut === 'Livrée' ? '✅' : l.etape === 0 && !['Expédiée', 'En transit'].includes(l.statut) ? '📦' : '🚚', couleur, opts.epais ? 40 : 32), zIndexOffset: 1000 })
            .bindPopup(popup).addTo(carte);
        if (opts.onClick) m.on('click', () => opts.onClick(l));
        couches.push(m);
        return couches;
    }

    function cadrer(carte, livraisons) {
        const pts = livraisons.flatMap((l) => l.itineraire.map((p) => [p.lat, p.lng]));
        if (pts.length > 1) carte.fitBounds(pts, { padding: [30, 30], maxZoom: 9 });
        else if (pts.length === 1) carte.setView(pts[0], 10);
    }

    function legende(carte) {
        const c = L.control({ position: 'bottomleft' });
        c.onAdd = () => {
            const d = L.DomUtil.create('div');
            d.style.cssText = 'background:rgba(255,255,255,.92);padding:6px 10px;border-radius:8px;font:12px/1.6 sans-serif;color:#111;box-shadow:0 1px 4px rgba(0,0,0,.25)';
            d.innerHTML = ORDRE.map((s) => `<div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${COULEURS[s]};margin-right:6px"></span>${s}</div>`).join('');
            return d;
        };
        c.addTo(carte);
    }

    /** Frise des étapes (HTML) pour le suivi client et le détail admin. */
    function frise(l) {
        const idx = ORDRE.indexOf(l.statut);
        return `<div class="suivi-frise">${ORDRE.map((s, i) => `<div class="suivi-etape${i <= idx ? ' ok' : ''}${i === idx ? ' actuel' : ''}" style="--c:${COULEURS[s]}"><span></span><small>${s}</small></div>`).join('')}</div>`;
    }

    function historique(l) {
        return `<ol class="suivi-histo">${l.historique.slice().reverse().map((h) => `<li style="--c:${COULEURS[h.statut] || '#29ADE4'}"><b>${esc(h.statut)} · ${esc(h.ville)}</b><span>${esc(h.commentaire)}</span><time>${esc(new Date(h.date_evenement.replace(' ', 'T')).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }))}</time></li>`).join('')}</ol>`;
    }

    return { COULEURS, ORDRE, creerCarte, dessiner, cadrer, legende, frise, historique, progression, esc, fcfa };
})();
