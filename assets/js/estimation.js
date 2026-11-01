/* Prestige Habitat — formulaire d'estimation en étapes */
(function () {
  "use strict";
  var form = document.getElementById("form-estimation");
  if (!form) return;
  var etapes = Array.prototype.slice.call(form.querySelectorAll(".bloc-etape"));
  var jalons = Array.prototype.slice.call(document.querySelectorAll("#etapes-estimation li"));
  var btnSuivant = document.getElementById("btn-suivant");
  var btnRetour = document.getElementById("btn-retour");
  var nav = document.getElementById("nav-estimation");
  var courante = 1;

  function validerEtape(n) {
    var bloc = form.querySelector('[data-etape="' + n + '"]');
    var ok = true, premier = null;
    bloc.querySelectorAll("input, select, textarea").forEach(function (champ) {
      var msg = "";
      var val = champ.value.trim();
      if (champ.required && champ.type === "checkbox" && !champ.checked) msg = "Ce champ est obligatoire.";
      else if (champ.required && !val) msg = "Ce champ est obligatoire.";
      else if (val && champ.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) msg = "Adresse e-mail invalide.";
      else if (val && champ.pattern) { var re = new RegExp("^(?:" + champ.pattern + ")$"); if (!re.test(val)) msg = "Format invalide."; }
      var cible = form.querySelector('[data-erreur-for="' + champ.id + '"]');
      if (cible) cible.textContent = msg;
      champ.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { ok = false; if (!premier) premier = champ; }
    });
    if (premier) premier.focus();
    return ok;
  }

  function majEtapes() {
    etapes.forEach(function (b) {
      b.classList.toggle("actif", Number(b.getAttribute("data-etape")) === courante);
    });
    jalons.forEach(function (j, i) {
      var n = i + 1;
      j.classList.toggle("passee", n < courante);
      if (n === courante) j.setAttribute("aria-current", "step"); else j.removeAttribute("aria-current");
    });
    btnRetour.hidden = courante === 1;
    btnSuivant.textContent = courante === 2 ? "Envoyer ma demande" : "Continuer";
    if (courante === 3) nav.hidden = true;
  }

  btnSuivant.addEventListener("click", function () {
    if (courante === 1) { if (validerEtape(1)) { courante = 2; majEtapes(); } }
    else if (courante === 2) {
      if (validerEtape(2)) {
        courante = 3; majEtapes();
        var conf = form.querySelector('[data-etape="3"]');
        conf.setAttribute("tabindex", "-1"); conf.focus();
      }
    }
  });
  btnRetour.addEventListener("click", function () {
    if (courante > 1) { courante--; majEtapes(); }
  });
  majEtapes();
})();
