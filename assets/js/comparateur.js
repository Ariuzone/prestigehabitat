/* Prestige Habitat — comparateur de biens */
(function () {
  "use strict";
  var zone = document.getElementById("zone-comparaison");
  var donnees = document.getElementById("donnees-biens");
  if (!zone || !donnees || !window.PH) return;
  var BIENS = JSON.parse(donnees.textContent);
  var PAR_ID = {};
  BIENS.forEach(function (p) { PAR_ID[p.id] = p; });
  var _fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); };

  function ligne(titre, cellules) {
    return '<tr><th scope="row">' + titre + "</th>" + cellules + "</tr>";
  }

  function rendu() {
    var ids = (window.PH.comparaison || []).filter(function (id) { return PAR_ID[id]; });
    if (!ids.length) {
      zone.innerHTML = '<div class="vide-comparaison"><p class="grosse-citation" style="font-size:1.5rem;">Votre comparaison est vide.</p>' +
        "<p>Rendez-vous dans le catalogue et cochez «&nbsp;Comparer&nbsp;» sur les biens qui vous intéressent.</p>" +
        '<p><a class="bouton bouton-fleche" href="biens.html">Parcourir les biens</a></p></div>';
      return;
    }
    var biens = ids.map(function (id) { return PAR_ID[id]; });
    var html = '<table class="tableau-comparaison"><thead><tr><th scope="col"><span class="sr-only">Critère</span></th>';
    biens.forEach(function (p) {
      html += '<th scope="col"><a href="biens/' + p.id + '.html"><img src="assets/img/biens/' + p.id + '/1-card.jpg" alt="' + p.titre + '" loading="lazy">' +
        '<strong style="display:block;margin-top:.5rem;">' + p.titre + "</strong></a>" +
        '<span class="mention-note">' + p.quartier + " · " + p.commune + "</span>" +
        '<button class="effacer-comparaison" type="button" data-retirer="' + p.id + '">Retirer</button></th>';
    });
    html += "</tr></thead><tbody>";
    html += ligne("Transaction", biens.map(function (p) { return "<td>" + (p.transaction === "vente" ? "Vente" : "Location") + "</td>"; }).join(""));
    html += ligne("Type", biens.map(function (p) { return "<td>" + p.type + "</td>"; }).join(""));
    html += ligne("Prix", biens.map(function (p) {
      return "<td><strong>" + (p.transaction === "vente" ? _fmt(p.prix) + "\u202f€" : _fmt(p.loyer) + "\u202f€ / " + (p.periode || "mois")) + "</strong></td>";
    }).join(""));
    html += ligne("Surface", biens.map(function (p) { return "<td>" + p.surface + "\u202fm²</td>"; }).join(""));
    html += ligne("Pièces", biens.map(function (p) { return "<td>" + p.pieces + "</td>"; }).join(""));
    html += ligne("Chambres", biens.map(function (p) { return "<td>" + p.chambres + "</td>"; }).join(""));
    html += ligne("Salles de bain", biens.map(function (p) { return "<td>" + p.salles_bain + "</td>"; }).join(""));
    html += ligne("Extérieur", biens.map(function (p) {
      var ext = p.terrain || p.terrasse || 0;
      return "<td>" + (ext ? _fmt(ext) + "\u202fm²" : "—") + "</td>";
    }).join(""));
    html += ligne("DPE", biens.map(function (p) {
      return "<td>Classe <strong>" + p.dpe.lettre + "</strong> (" + p.dpe.valeur + "\u202fkWh/m²·an)</td>";
    }).join(""));
    html += ligne("GES", biens.map(function (p) {
      return "<td>Classe <strong>" + p.dpe.ges_lettre + "</strong> (" + p.dpe.ges + "\u202fkg CO₂)</td>";
    }).join(""));
    html += ligne("Atouts", biens.map(function (p) {
      return "<td>" + p.particularites.map(function (x) { return "· " + x; }).join("<br>") + "</td>";
    }).join(""));
    html += "</tbody></table>";
    zone.innerHTML = html;
    zone.querySelectorAll("[data-retirer]").forEach(function (b) {
      b.addEventListener("click", function () {
        window.PH.basculerComparaison(b.getAttribute("data-retirer"));
        rendu();
      });
    });
  }
  rendu();
})();
