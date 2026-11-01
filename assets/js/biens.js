/* Prestige Habitat — catalogue : filtres, tri, carte, favoris, comparaison */
(function () {
  "use strict";
  if (!document.getElementById("donnees-biens")) return;

  var BIENS = JSON.parse(document.getElementById("donnees-biens").textContent);
  var PREFIX = document.body.classList.contains("") ? "" : ""; // jamais utilisé ; chemins relatifs racine
  var liste = document.getElementById("liste-biens");
  var compteur = document.getElementById("compteur-resultats");
  var aucun = document.getElementById("aucun-resultat");
  var blocCarte = document.getElementById("bloc-carte");
  var carteDiv = document.getElementById("carte-biens");
  var form = document.getElementById("form-filtres");
  var tri = document.getElementById("tri");
  var btnGrille = document.getElementById("vue-grille");
  var btnCarte = document.getElementById("vue-carte");

  var carte = null;
  var marqueurs = [];
  var modeVue = "grille";
  var _fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); };

  /* ---------- rendu des cartes ---------- */
  function carteHTML(p) {
    var badge = p.transaction === "vente"
      ? '<span class="badge badge-vente">Vente</span>'
      : '<span class="badge badge-location">Location</span>';
    var ext = p.terrain || p.terrasse || 0;
    var prix = p.transaction === "vente"
      ? _fmt(p.prix) + "\u202f€"
      : _fmt(p.loyer) + "\u202f€ <small>/ " + (p.periode || "mois") + "</small>";
    return '<article class="carte-bien" data-bien="' + p.id + '" data-transaction="' + p.transaction + '">' +
      '<div class="carte-media">' +
        '<span class="badges">' + badge + "</span>" +
        '<button class="favori-bouton" data-favori="' + p.id + '" aria-pressed="' + window.PH.estFavori(p.id) + '" aria-label="Ajouter ' + p.titre + ' aux favoris">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-4.8-3.6-8-6.6-8-10.2C4 7.6 6.2 5.5 8.8 5.5c1.3 0 2.5.6 3.2 1.7.7-1.1 1.9-1.7 3.2-1.7 2.6 0 4.8 2.1 4.8 5.3 0 3.6-3.2 6.6-8 10.2z"/></svg>' +
        "</button>" +
        '<picture><source type="image/webp" srcset="assets/img/biens/' + p.id + '/1-card.webp"><img src="assets/img/biens/' + p.id + '/1-card.jpg" alt="' + p.titre + " — " + p.type + " à " + p.commune + '" loading="lazy" decoding="async"></picture>' +
        '<label class="comparaison-bouton" title="Ajouter au comparateur">' +
          '<input type="checkbox" data-compare="' + p.id + '" aria-label="Comparer ' + p.titre + '"' + (window.PH.estCompare(p.id) ? " checked" : "") + ">Comparer</label>" +
      "</div>" +
      '<div class="carte-corps">' +
        '<span class="carte-lieu">' + p.quartier + " · " + p.commune + "</span>" +
        '<h3 class="carte-titre"><a href="biens/' + p.id + '.html">' + p.titre + "</a></h3>" +
        '<ul class="carte-caracs">' +
          '<li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 14l10-10M8 20L20 8"/></svg>' + p.surface + "\u202fm²</li>" +
          '<li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>' + p.pieces + "\u202fpièces</li>" +
          '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2m18-2v2M6 10V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3"/></svg>' + p.chambres + "\u202fch.</li>" +
          (ext ? '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3 4 5 6.5 5 9.5A5 5 0 0 1 7 12.5C7 9.5 9 7 12 3zM12 12v9"/></svg>' + _fmt(ext) + "\u202fm² d'extérieur</li>" : "") +
        "</ul>" +
        '<p class="carte-prix">' + prix + "</p>" +
      "</div></article>";
  }

  /* ---------- filtres ---------- */
  var TYPES_FILTRE = {
    "Villa": "Villa", "Penthouse": "Penthouse", "Appartement": "Appartement",
    "Mas": "Mas", "Duplex": "Duplex", "Loft": "Loft"
  };

  function lireFiltres() {
    var f = new FormData(form);
    return {
      transaction: f.get("transaction") || "",
      type: f.get("type") || "",
      quartier: f.get("quartier") || "",
      commune: f.get("commune") || "",
      budget: Number(f.get("budget")) || 0,
      surface: Number(f.get("surface")) || 0,
      chambres: Number(f.get("chambres")) || 0,
      crits: Array.prototype.slice.call(form.querySelectorAll("input[name='crit']:checked")).map(function (c) { return c.value; }),
      favorisSeuls: form.querySelector("#f-favoris").checked
    };
  }

  function correspond(p, f) {
    if (f.transaction && p.transaction !== f.transaction) return false;
    if (f.type) {
      var nomType = p.type;
      if (f.type === "Mas" && !/Mas|Propriété/.test(nomType)) return false;
      if (f.type !== "Mas" && nomType.toLowerCase().indexOf(f.type.toLowerCase()) === -1) return false;
    }
    if (f.quartier && p.quartier_ref !== f.quartier) return false;
    if (f.commune && p.commune !== f.commune) return false;
    var prix = p.transaction === "vente" ? p.prix : p.loyer;
    if (f.budget && prix > f.budget) return false;
    if (f.surface && p.surface < f.surface) return false;
    if (f.chambres && p.chambres < f.chambres) return false;
    for (var i = 0; i < f.crits.length; i++) {
      var crit = f.crits[i];
      var texte = p.particularites.join(" ");
      if (crit === "Piscine" && !/piscine|pool/i.test(texte)) return false;
      if (crit === "Vue mer" && !/vue mer|vue baie|panoramique|frontale/i.test(texte)) return false;
      if (crit === "Bord de mer" && !/mer|crique|ponton/i.test(texte)) return false;
      if (crit === "Terrain" && !(p.terrain && p.terrain >= 1500)) return false;
      if (crit === "Spa" && !/spa|hammam/i.test(texte)) return false;
    }
    if (f.favorisSeuls && window.PH.favoris.indexOf(p.id) === -1) return false;
    return true;
  }

  function trier(biens, cle) {
    var t = biens.slice();
    switch (cle) {
      case "prix-asc": t.sort(function (a, b) { return prixB(a) - prixB(b); }); break;
      case "prix-desc": t.sort(function (a, b) { return prixB(b) - prixB(a); }); break;
      case "surface-desc": t.sort(function (a, b) { return b.surface - a.surface; }); break;
      case "chambres-desc": t.sort(function (a, b) { return b.chambres - a.chambres; }); break;
    }
    return t;
  }
  function prixB(p) { return p.transaction === "vente" ? p.prix : p.loyer; }

  function appliquer() {
    var f = lireFiltres();
    var resultats = trier(BIENS.filter(function (p) { return correspond(p, f); }), tri.value);
    liste.innerHTML = resultats.map(carteHTML).join("");
    compteur.textContent = String(resultats.length);
    aucun.hidden = resultats.length !== 0;
    afficherVue(modeVue);
    // synchronise l'URL
    var params = new URLSearchParams();
    if (f.transaction) params.set("transaction", f.transaction);
    if (f.type) params.set("type", f.type);
    if (f.quartier) params.set("quartier", f.quartier);
    if (f.chambres) params.set("chambres", f.chambres);
    if (f.budget) params.set("budget", f.budget);
    var qs = params.toString();
    history.replaceState(null, "", qs ? "?" + qs + "#resultats" : location.pathname);
  }

  /* ---------- carte ---------- */
  function iconePin() {
    return '<div class="marqueur-pin"><svg viewBox="0 0 34 44" aria-hidden="true">' +
      '<path d="M17 1C8.2 1 1 8.2 1 17c0 11 16 26 16 26s16-15 16-26C33 8.2 25.8 1 17 1z" fill="#171510"/>' +
      '<circle cx="17" cy="16" r="6.5" fill="#c9a96a"/></svg></div>';
  }

  function initCarte() {
    if (carte || !window.L) return;
    carte = L.map(carteDiv, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carte);
    carte.fitBounds(L.latLngBounds(BIENS.map(function (p) { return [p.coords.lat, p.coords.lng]; })),
      { padding: [40, 40] });
  }

  function majCarte(biens) {
    if (!blocCarte.hidden && window.L) {
      initCarte();
      marqueurs.forEach(function (m) { carte.removeLayer(m); });
      marqueurs = biens.map(function (p) {
        var m = L.marker([p.coords.lat, p.coords.lng], {
          icon: L.divIcon({ className: "", html: iconePin(), iconSize: [34, 44], iconAnchor: [17, 42] })
        }).addTo(carte);
        m.bindPopup(
          '<a class="popup-bien" href="biens/' + p.id + '.html">' +
          '<img src="assets/img/biens/' + p.id + '/1-card.jpg" alt="">' +
          '<span class="popup-bien-corps"><strong>' + p.titre + "</strong>" +
          "<span>" + p.quartier + " · " +
          (p.transaction === "vente" ? _fmt(p.prix) + "\u202f€" : _fmt(p.loyer) + "\u202f€ / " + (p.periode || "mois")) +
          "</span></span></a>");
        return m;
      });
      if (biens.length) {
        carte.fitBounds(L.latLngBounds(biens.map(function (p) { return [p.coords.lat, p.coords.lng]; })),
          { padding: [40, 40], maxZoom: 14 });
      }
    }
  }

  /* ---------- vues ---------- */
  function afficherVue(mode) {
    var grille = mode === "grille";
    btnGrille.setAttribute("aria-pressed", grille ? "true" : "false");
    btnCarte.setAttribute("aria-pressed", grille ? "false" : "true");
    blocCarte.hidden = grille;
    liste.hidden = !grille;
    if (!grille) { majCarte(trier(BIENS.filter(function (p) { return correspond(p, lireFiltres()); }), tri.value)); }
  }
  btnGrille.addEventListener("click", function () { afficherVue("grille"); });
  btnCarte.addEventListener("click", function () { afficherVue("carte"); });

  /* ---------- événements ---------- */
  form.addEventListener("submit", function (ev) { ev.preventDefault(); appliquer(); });
  form.addEventListener("reset", function () {
    window.setTimeout(function () { appliquer(); }, 0);
  });
  tri.addEventListener("change", appliquer);
  var debonce = null;
  form.querySelectorAll("select, input[type='number'], input[name='crit'], input[name='transaction']").forEach(function (el) {
    el.addEventListener("change", appliquer);
    if (el.tagName === "INPUT" && (el.type === "number" || el.type === "text")) {
      el.addEventListener("input", function () {
        clearTimeout(debonce);
        debonce = setTimeout(appliquer, 250);
      });
    }
  });
  form.querySelector("#f-favoris").addEventListener("change", appliquer);

  window.PH.onFavorisChange = function () {
    if (document.getElementById("f-favoris") && document.getElementById("f-favoris").checked) appliquer();
  };

  /* ---------- barre de comparaison ---------- */
  var barre = document.getElementById("barre-comparaison");
  var PAR_ID = {};
  BIENS.forEach(function (p) { PAR_ID[p.id] = p; });
  function majBarre() {
    if (!barre) return;
    var ids = window.PH.comparaison.filter(function (id) { return PAR_ID[id]; });
    var texte = document.getElementById("barre-comparaison-texte");
    var minis = document.getElementById("barre-miniatures");
    if (texte) texte.textContent = ids.length === 0
      ? "Comparateur vide"
      : ids.length + (ids.length === 1 ? " bien sélectionné" : " biens sélectionnés") + " sur 3";
    if (minis) minis.innerHTML = ids.map(function (id) {
      return '<img src="assets/img/biens/' + id + '/1-card.jpg" alt="' + PAR_ID[id].titre + '" width="52" height="40">';
    }).join("");
    barre.classList.toggle("visible", ids.length > 0);
  }
  window.PH.onComparaisonChange = majBarre;
  majBarre();
  var btnVider = document.getElementById("effacer-comparaison");
  if (btnVider) btnVider.addEventListener("click", function () {
    window.PH.comparaison = [];
    try { localStorage.setItem("ph-comparaison", "[]"); } catch (e) {}
    document.querySelectorAll("[data-compare]").forEach(function (c) {
      c.checked = false;
      var label = c.closest(".comparaison-bouton");
      if (label) label.setAttribute("aria-pressed", "false");
    });
    majBarre();
  });

  /* ---------- initialisation depuis l'URL ---------- */
  (function initDepuisURL() {
    var q = new URLSearchParams(location.search);
    if (q.get("transaction")) {
      var radio = form.querySelector("input[name='transaction'][value='" + q.get("transaction") + "']");
      if (radio) radio.checked = true;
    }
    if (q.get("type")) {
      var valType = q.get("type").toLowerCase();
      Array.prototype.forEach.call(form.querySelector("#f-type").options, function (o) {
        if (o.value.toLowerCase() === valType) form.querySelector("#f-type").value = o.value;
      });
    }
    if (q.get("quartier")) form.querySelector("#f-quartier").value = q.get("quartier");
    if (q.get("chambres")) form.querySelector("#f-chambres").value = q.get("chambres");
    if (q.get("budget")) form.querySelector("#f-budget").value = q.get("budget");
  })();

  appliquer();
})();
