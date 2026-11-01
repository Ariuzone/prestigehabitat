/* Prestige Habitat — fiche bien : galerie, visionneuse, mini-carte */
(function () {
  "use strict";
  var donnees = document.getElementById("donnees-fiche");
  if (!donnees) return;
  var D = JSON.parse(donnees.textContent);
  var slides = Array.prototype.slice.call(document.querySelectorAll(".galerie-slide"));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-thumb]"));
  var compteur = document.querySelector("[data-compteur]");
  var index = 1;

  function afficher(i) {
    index = ((i - 1 + slides.length) % slides.length) + 1;
    slides.forEach(function (s) {
      if (Number(s.getAttribute("data-index")) === index) s.removeAttribute("hidden");
      else s.setAttribute("hidden", "");
    });
    thumbs.forEach(function (t) {
      if (Number(t.getAttribute("data-thumb")) === index) t.setAttribute("aria-current", "true");
      else t.removeAttribute("aria-current");
    });
    if (compteur) compteur.textContent = String(index);
  }
  document.querySelectorAll(".galerie-nav").forEach(function (b) {
    b.addEventListener("click", function () { afficher(index + Number(b.getAttribute("data-dir"))); });
  });
  thumbs.forEach(function (t) {
    t.addEventListener("click", function () { afficher(Number(t.getAttribute("data-thumb"))); });
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowLeft") afficher(index - 1);
    if (ev.key === "ArrowRight") afficher(index + 1);
  });

  /* Visionneuse */
  var lumbox = document.getElementById("lumbox");
  var lumboxImg = lumbox ? lumbox.querySelector("img") : null;
  function ouvrir(i) {
    afficher(i);
    lumboxImg.src = D.slides[index - 1] + ".webp";
    lumboxImg.alt = "Photo " + index + " — " + D.titre;
    lumbox.removeAttribute("hidden");
    lumbox.classList.add("ouverte");
    document.body.style.overflow = "hidden";
    lumbox.querySelector(".fermer").focus();
  }
  function fermer() {
    lumbox.classList.remove("ouverte");
    lumbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }
  var principale = document.getElementById("galerie-principale");
  principale.addEventListener("click", function (ev) {
    if (ev.target.closest(".galerie-nav") || ev.target.closest(".favori-bouton")) return;
    ouvrir(index);
  });
  if (lumbox) {
    lumbox.querySelector(".fermer").addEventListener("click", fermer);
    lumbox.addEventListener("click", function (ev) { if (ev.target === lumbox) fermer(); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && lumbox.classList.contains("ouverte")) fermer();
    });
  }

  /* Mini-carte Leaflet */
  var div = document.getElementById("carte-bien");
  if (div && window.L) {
    var carte = L.map(div, { scrollWheelZoom: false, dragging: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carte);
    var lat = Number(div.getAttribute("data-lat")), lng = Number(div.getAttribute("data-lng"));
    var icone = L.divIcon({ className: "", iconSize: [34, 44], iconAnchor: [17, 42],
      html: '<div class="marqueur-pin"><svg viewBox="0 0 34 44"><path d="M17 1C8.2 1 1 8.2 1 17c0 11 16 26 16 26s16-15 16-26C33 8.2 25.8 1 17 1z" fill="#171510"/><circle cx="17" cy="16" r="6.5" fill="#c9a96a"/></svg></div>' });
    L.marker([lat, lng], { icon: icone }).addTo(carte)
      .bindPopup(div.getAttribute("data-titre") + " — position indicative");
    carte.setView([lat, lng], 13);
  }
})();
