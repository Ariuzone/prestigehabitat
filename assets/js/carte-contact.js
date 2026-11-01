/* Prestige Habitat — carte de la page contact */
(function () {
  "use strict";
  var div = document.getElementById("carte-contact");
  if (!div || !window.L) return;
  var carte = L.map(div, { scrollWheelZoom: false });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(carte);
  var lat = Number(div.getAttribute("data-lat")), lng = Number(div.getAttribute("data-lng"));
  var icone = L.divIcon({ className: "", iconSize: [34, 44], iconAnchor: [17, 42],
    html: '<div class="marqueur-pin"><svg viewBox="0 0 34 44"><path d="M17 1C8.2 1 1 8.2 1 17c0 11 16 26 16 26s16-15 16-26C33 8.2 25.8 1 17 1z" fill="#171510"/><circle cx="17" cy="16" r="6.5" fill="#c9a96a"/></svg></div>' });
  L.marker([lat, lng], { icon: icone }).addTo(carte).bindPopup(div.getAttribute("data-titre"));
  carte.setView([lat, lng], 15);
})();
