/* Prestige Habitat — comportements globaux (en-tête, favoris, révélations, formulaires) */
(function () {
  "use strict";

  var PH = (window.PH = {});
  var CLE_FAVORIS = "ph-favoris";
  var CLE_COMPARAISON = "ph-comparaison";

  function lireStockage(cle) {
    try {
      var brut = localStorage.getItem(cle);
      return brut ? JSON.parse(brut) : [];
    } catch (e) { return []; }
  }
  function ecrireStockage(cle, valeur) {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) { /* stockage indisponible */ }
  }
  PH.favoris = lireStockage(CLE_FAVORIS);
  PH.comparaison = lireStockage(CLE_COMPARAISON);

  PH.estFavori = function (id) { return PH.favoris.indexOf(id) !== -1; };
  PH.basculerFavori = function (id) {
    var i = PH.favoris.indexOf(id);
    if (i === -1) { PH.favoris.push(id); } else { PH.favoris.splice(i, 1); }
    ecrireStockage(CLE_FAVORIS, PH.favoris);
    majBoutonsFavoris();
    majCompteur();
    if (window.PH.onFavorisChange) window.PH.onFavorisChange(PH.favoris);
  };
  PH.estCompare = function (id) { return PH.comparaison.indexOf(id) !== -1; };
  PH.basculerComparaison = function (id) {
    var i = PH.comparaison.indexOf(id);
    if (i === -1) {
      if (PH.comparaison.length >= 3) return false;
      PH.comparaison.push(id);
    } else { PH.comparaison.splice(i, 1); }
    ecrireStockage(CLE_COMPARAISON, PH.comparaison);
    majBoutonsComparaison();
    if (window.PH.onComparaisonChange) window.PH.onComparaisonChange(PH.comparaison);
    return true;
  };

  function majBoutonsFavoris() {
    document.querySelectorAll("[data-favori]").forEach(function (b) {
      var actif = PH.estFavori(b.getAttribute("data-favori"));
      b.setAttribute("aria-pressed", actif ? "true" : "false");
    });
  }
  function majBoutonsComparaison() {
    document.querySelectorAll("[data-compare]").forEach(function (c) {
      c.checked = PH.estCompare(c.getAttribute("data-compare"));
      var label = c.closest(".comparaison-bouton");
      if (label) label.setAttribute("aria-pressed", c.checked ? "true" : "false");
    });
  }
  function majCompteur() {
    var lien = document.getElementById("lien-favoris");
    if (lien) {
      lien.setAttribute("data-nb", String(PH.favoris.length));
      var nb = PH.favoris.length;
      lien.title = nb === 0 ? "Aucun favori enregistré" : nb + " bien(s) en favori";
    }
  }

  /* Délégation globale : favoris + comparaison */
  document.addEventListener("click", function (ev) {
    var fav = ev.target.closest("[data-favori]");
    if (fav) { PH.basculerFavori(fav.getAttribute("data-favori")); return; }
    var comp = ev.target.closest("[data-compare]");
    if (comp && (comp.type === "checkbox")) {
      var ok = PH.basculerComparaison(comp.getAttribute("data-compare"));
      if (!ok) {
        comp.checked = false;
        alert("Le comparateur accepte trois biens au maximum. Retirez un bien pour en ajouter un autre.");
      }
    }
  });

  /* En-tête : état roulé */
  var entete = document.getElementById("entete");
  function surRoulement() {
    if (!entete) return;
    entete.classList.toggle("roulee", window.scrollY > 40);
  }
  window.addEventListener("scroll", surRoulement, { passive: true });
  surRoulement();

  /* Menu mobile */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("navigation");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouverte");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      burger.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
      document.body.style.overflow = ouvert ? "hidden" : "";
    });
    nav.addEventListener("click", function (ev) {
      if (ev.target.closest("a")) {
        nav.classList.remove("ouverte");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* Lien courant */
  var chemin = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navigation a").forEach(function (a) {
    var cible = a.getAttribute("href").split("/").pop();
    if (cible === chemin) a.setAttribute("aria-current", "page");
  });

  /* Apparitions au défilement */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* Formulaires : validation + confirmation */
  var MESSAGES = {
    requis: "Ce champ est obligatoire.",
    email: "Merci de saisir une adresse e-mail valide (ex. nom@domaine.fr).",
    pattern: "Le format saisi n'est pas valide.",
    minlength: function (n) { return "Merci de saisir au moins " + n + " caractères."; }
  };

  function erreurPour(champ) {
    var valeur = champ.value.trim();
    if (champ.required && champ.type === "checkbox") return champ.checked ? "" : MESSAGES.requis;
    if (champ.required && !valeur) return MESSAGES.requis;
    if (!valeur) return "";
    if (champ.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur)) return MESSAGES.email;
    if (champ.pattern) {
      var re = new RegExp("^(?:" + champ.pattern + ")$");
      if (!re.test(valeur)) return MESSAGES.pattern;
    }
    if (champ.minLength > 0 && valeur.length < champ.minLength) return MESSAGES.minlength(champ.minLength);
    return "";
  }

  function initFormulaire(form) {
    var globale = form.querySelector(".formulaire-erreur-globale");
    var confirmation = form.querySelector("[data-confirmation]");
    var champs = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"))
      .filter(function (c) { return c.type !== "submit" && c.type !== "button"; });

    function afficherErreur(champ, message) {
      var cible = form.querySelector('[data-erreur-for="' + champ.id + '"]');
      if (cible) cible.textContent = message;
      champ.setAttribute("aria-invalid", message ? "true" : "false");
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var premierErreur = null;
      var nbErreurs = 0;
      champs.forEach(function (champ) {
        var msg = erreurPour(champ);
        afficherErreur(champ, msg);
        if (msg) { nbErreurs++; if (!premierErreur) premierErreur = champ; }
      });
      if (nbErreurs) {
        if (globale) { globale.hidden = false; globale.classList.add("visible"); }
        if (premierErreur) premierErreur.focus();
        return;
      }
      if (globale) { globale.hidden = true; }
      // Confirmation
      if (form.getAttribute("data-formulaire") === "estimation") {
        return; // géré par estimation.js (étapes)
      }
      Array.prototype.forEach.call(form.children, function (enfant) {
        if (enfant !== confirmation) enfant.hidden = true;
      });
      if (confirmation) {
        confirmation.classList.add("visible");
        confirmation.setAttribute("tabindex", "-1");
        confirmation.focus();
      }
    });

    champs.forEach(function (champ) {
      champ.addEventListener("blur", function () {
        if (champ.getAttribute("aria-invalid") === "true") afficherErreur(champ, erreurPour(champ));
      });
      champ.addEventListener("input", function () {
        if (champ.getAttribute("aria-invalid") === "true") afficherErreur(champ, erreurPour(champ));
      });
    });
  }

  document.querySelectorAll("form[data-formulaire]").forEach(initFormulaire);

  majBoutonsFavoris();
  majBoutonsComparaison();
  majCompteur();
})();
