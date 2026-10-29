/* Portal CTR TEAM: lógica común y de cada página. Lee las constantes de config.js. */
(function () {
  "use strict";
  var C = window.CTR || {};
  var body = document.body;
  var ROOT = body.getAttribute("data-root") || "";
  var PAGE = body.getAttribute("data-page") || "";

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function yt(id, title) {
    return '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(id) + '?rel=0" title="' + esc(title) + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  }

  /* Chips de "qué te frena" -> clase puesta primero */
  var FRENOS = {
    poco: { label: "Como poco y no pierdo grasa", clase: 3 },
    energia: { label: "Tengo baja energía, voy apagado", clase: 4 },
    rebote: { label: "Pierdo grasa y luego reboto", clase: 2 },
    mas: { label: "Como más por mi cuenta y no sé si lo hago bien", clase: 1 }
  };
  function freno() { var f = store("ctr_freno"); return FRENOS[f] ? f : null; }
  function claseFirst() { var f = freno(); return f ? FRENOS[f].clase : 1; }

  /* Calendly en todos los enlaces marcados */
  $$("[data-calendly]").forEach(function (a) { a.setAttribute("href", C.CALENDLY_URL); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); });

  /* Nombre en la barra superior */
  var who = $("#who-name");
  if (who) {
    var nm = store("ctr_nombre");
    who.textContent = nm ? nm : "";
    var hola = $("#who-hola");
    if (hola && !nm) hola.style.display = "none";
    var av = $("#who-av");
    if (av) av.textContent = nm ? nm.trim().charAt(0).toUpperCase() : "C";
  }

  /* Recursos (rejilla compartida por /portal y /guias) */
  var RES = [
    { tag: "Calculadora", ic: "∑", t: "Calculadora: ¿cuánto podrías estar comiendo?", d: "Te llevas tu cifra de comida y lo que te separa de lo que comes hoy", m: "1 min", href: "calculadora", nuevo: true },
    { tag: "Test", ic: "10", t: "Test de señales del metabolismo apagado", d: "Te llevas en qué estado está tu metabolismo y por qué", m: "5 min", href: "test-senales" },
    { tag: "Test", ic: "15", t: "Test metabólico de 15 preguntas", d: "Te llevas tu perfil metabólico de un vistazo", m: "3 min", href: "test-metabolico" },
    { tag: "Vídeo", ic: "6", t: "Las 6 clases del método", d: "Te llevas el método de principio a fin, en el orden en que hay que verlo", m: "6 vídeos", href: "metodo" },
    { tag: "Vídeo", ic: "1h", t: "Clase larga: pierde grasa comiendo más", d: "Te llevas la explicación entera de una sentada", m: "1 h", href: "clase-larga" },
    { tag: "Vídeo", ic: "3", t: "Testimonios", d: "Te llevas tres casos contados por ellos mismos", m: "3 vídeos", href: "testimonios" },
    { tag: "Guía", ic: "G", t: "Lo que hicimos con tres clientes que comían cada vez menos", d: "Te llevas qué cambió en tres personas que comían cada vez menos", m: "8 min", href: "guias/lo-que-hicimos-con-tres-clientes", prod: true },
    { tag: "Checklist", ic: "✓", t: "10 señales de cortisol alto", d: "Te llevas una lista para ponerle nombre a lo que notas", m: "3 min", href: "guias/10-senales-de-cortisol-alto", prod: true },
    { tag: "Guía", ic: "Z", t: "10 señales de que tu descanso te frena", d: "Te llevas qué parte de tu descanso está frenando tu metabolismo", m: "6 min", href: "guias/10-senales-de-que-tu-descanso-te-frena", prod: true },
    { tag: "Test", ic: "?", t: "¿Grasa o inflamación?", d: "Te llevas saber qué parte de lo que ves en el espejo es grasa", m: "3 min", href: "guias/grasa-o-inflamacion", prod: true }
  ];
  function resCard(r) {
    return '<a class="res' + (r.prod ? " off" : "") + '" href="' + ROOT + r.href + '.html">' +
      '<div class="hd"><div class="ic" aria-hidden="true">' + esc(r.ic) + '</div><div class="tags"><span class="pill' + (r.nuevo ? " red" : "") + '">' + esc(r.tag) + '</span>' +
      (r.prod ? '<span class="pill">En producción</span>' : "") + (r.nuevo ? '<span class="pill red">Nuevo</span>' : "") + '</div></div>' +
      '<h3>' + esc(r.t) + '</h3><p>' + esc(r.d) + '</p><div class="inc"><b>' + esc(r.m) + '</b></div>' +
      '<span class="open' + (r.prod ? " dim" : "") + '">' + (r.prod ? "Ver ficha" : "Abrir") + ' →</span></a>';
  }
  var g1 = $("#res-grid");
  if (g1) { g1.innerHTML = RES.map(resCard).join(""); }
  var cnt = $("#res-count"); if (cnt) cnt.textContent = RES.filter(function (r) { return !r.prod; }).length + " activos · " + RES.filter(function (r) { return r.prod; }).length + " en producción";
  var g2 = $("#res-grid-guias");
  if (g2) { g2.innerHTML = RES.filter(function (r) { return /^(Guía|Checklist|Test)$/.test(r.tag); }).map(resCard).join(""); }

  /* En producción (portal) */
  var prodG = $("#prod-grid");
  if (prodG) {
    var prod = RES.filter(function (r) { return r.prod && (r.href.indexOf("tres-clientes") > -1 || r.href.indexOf("cortisol") > -1); });
    prodG.innerHTML = prod.map(function (r) {
      return '<a class="res off" href="' + ROOT + r.href + '.html"><div class="hd"><div class="ic" aria-hidden="true">' + esc(r.ic) + '</div><span class="pill">En producción</span></div><h3>' + esc(r.t) + '</h3><p>Aparece en tu cuenta al salir.</p></a>';
    }).join("") + '<a class="res" href="' + ROOT + 'pide-un-recurso.html"><div class="hd"><div class="ic" aria-hidden="true">+</div><span class="pill red">Pide un recurso</span></div><h3>¿Te falta algo?</h3><p>Dime qué recurso quieres que haga y lo ponemos en la lista.</p><span class="open">Pedirlo →</span></a>';
  }

  /* Destacado "te lo hemos puesto primero" */
  var ft = $("#feature-title");
  if (ft && C.CLASSES) {
    var n = claseFirst(), cl = C.CLASSES[n - 1];
    ft.textContent = "Clase " + pad(n) + ": " + cl.title;
    var fs = $("#feature-sub"); if (fs) fs.textContent = freno() ? "Según lo que más te frena ahora mismo: «" + FRENOS[freno()].label + "»." : "Por aquí empieza todo el método.";
    var fb = $("#feature-btn"); if (fb) fb.setAttribute("href", ROOT + "metodo.html#clase-" + pad(n));
  }

  /* Resumen del método en portal */
  var mr = $("#metodo-resumen");
  if (mr && C.CLASSES) {
    mr.innerHTML = C.CLASSES.map(function (c, i) {
      return '<a class="les" href="' + ROOT + 'metodo.html#clase-' + pad(i + 1) + '"><div class="n">' + pad(i + 1) + '</div><div class="t"><b>' + esc(c.title) + '</b></div><div class="pl" aria-hidden="true"></div></a>';
    }).join("");
  }

  /* ---- /bienvenida ---- */
  if (PAGE === "bienvenida") {
    var vb = $("#welcome-video");
    if (C.WELCOME_VIDEO_ID) { vb.className = "video"; vb.innerHTML = yt(C.WELCOME_VIDEO_ID, "Vídeo de bienvenida de Rafa"); }
    var chips = $$("#chips .opt");
    function mark() { var f = freno(); chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-f") === f)); }); var fp = $("#first-pick"); if (f) { fp.hidden = false; $("#first-pick-title").textContent = "Clase " + pad(FRENOS[f].clase) + ": " + C.CLASSES[FRENOS[f].clase - 1].title; } else { fp.hidden = true; } }
    chips.forEach(function (c) { c.addEventListener("click", function () { store("ctr_freno", c.getAttribute("data-f")); mark(); }); });
    mark();
  }

  /* ---- /metodo ---- */
  if (PAGE === "metodo") {
    var first = claseFirst();
    $("#vlist").innerHTML = C.CLASSES.map(function (c, i) {
      var n = i + 1;
      return '<article class="vitem' + (freno() && n === first ? " first-pick" : "") + '" id="clase-' + pad(n) + '"><div class="hd"><div class="n">' + pad(n) + '</div><div><h3>' + esc(c.title) + '</h3><p>' + esc(c.line) + '</p></div></div><div class="video">' + yt(c.id, c.title) + '</div></article>';
    }).join("");
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
  }
  /* ---- /clase-larga ---- */
  if (PAGE === "clase-larga") { $("#cl-video").innerHTML = yt(C.CLASE_LARGA.id, C.CLASE_LARGA.title); $("#cl-title").textContent = C.CLASE_LARGA.title; }
  /* ---- /testimonios ---- */
  if (PAGE === "testimonios") {
    $("#tvlist").innerHTML = C.TESTIMONIALS.map(function (t) {
      return '<article class="vitem"><div><h3>' + esc(t.name) + '</h3><p>' + esc(t.line) + '</p></div><div class="video">' + yt(t.id, "Entrevista con " + t.name) + '</div></article>';
    }).join("");
  }
  /* ---- Formularios ---- */
  var f1 = $("#airtable-form"); if (f1) f1.setAttribute("src", C.AIRTABLE_FORM_URL);
  var f2 = $("#airtable-request"); if (f2) f2.setAttribute("src", C.AIRTABLE_REQUEST_FORM_URL);
  var tm = $("#test-metabolico-btn"); if (tm) { tm.setAttribute("href", C.TEST_METABOLICO_URL); tm.setAttribute("target", "_blank"); tm.setAttribute("rel", "noopener"); }
  /* ---- /entra: vídeo ---- */
  var ev = $("#entra-video");
  if (ev && C.ENTRA_VIDEO_ID) { ev.className = "video"; ev.innerHTML = yt(C.ENTRA_VIDEO_ID, "Vídeo del método"); }

  /* ---- /calculadora ---- */
  if (PAGE === "calculadora") {
    var FACT = { sentado: 1.45, pie: 1.6, fisico: 1.75, autonomo: 1.5, negocio: 1.5, estudio: 1.4, nada: 1.35 };
    var FR = {
      poco: "No comes poco: comes lo justo para ir justo. Tu cuerpo ha aprendido a gastar lo que le das, y por eso el peso no se mueve.",
      energia: "Esa diferencia es la energía que te falta a las cinco de la tarde.",
      rebote: "Cuando sueltas la dieta, tu cuerpo corre a llenar esa diferencia de golpe. No es falta de disciplina.",
      mas: "Vas por el buen camino: la pregunta no es cuánto, es en qué orden y a qué ritmo."
    };
    var ids = ["c-age", "c-sex", "c-w", "c-h", "c-act", "c-train", "c-now"];
    function num(id) { var v = parseFloat(String($("#" + id).value).replace(",", ".")); return isFinite(v) ? v : NaN; }
    function calc() {
      var age = num("c-age"), w = num("c-w"), h = num("c-h"), now = num("c-now"), sex = $("#c-sex").value;
      var act = $("#c-act").value, tr = parseFloat($("#c-train").value) || 0;
      var ok = age >= 14 && age <= 90 && w >= 35 && w <= 250 && h >= 130 && h <= 230 && now >= 500 && now <= 8000 && FACT[act];
      var out = $("#calc-out");
      if (!ok) { out.hidden = true; $("#calc-empty").hidden = false; return; }
      var bmr = 10 * w + 6.25 * h - 5 * age + (sex === "m" ? 5 : -161);
      var tdee = Math.round(bmr * (FACT[act] + tr) / 50) * 50;
      var diff = tdee - now;
      $("#k-now").innerHTML = fmt(now) + "<small>kcal</small>";
      $("#k-tdee").innerHTML = fmt(tdee) + "<small>kcal</small>";
      $("#k-diff").innerHTML = (diff > 0 ? "+" : diff < 0 ? "−" : "") + fmt(Math.abs(diff)) + "<small>kcal</small>";
      var pct = Math.max(0, Math.min(100, tdee ? (now / tdee) * 100 : 0));
      $("#gap-bar").style.width = pct + "%";
      var f = freno(); var v = $("#verdict");
      if (f) { v.textContent = FR[f]; v.hidden = false; } else { v.hidden = true; }
      out.hidden = false; $("#calc-empty").hidden = true;
    }
    ids.forEach(function (id) { $("#" + id).addEventListener("input", calc); $("#" + id).addEventListener("change", calc); });
    calc();
  }

  /* ---- /test-senales ---- */
  if (PAGE === "test-senales") {
    var Q = [
      "Te levantas cansado aunque hayas dormido 7-8 horas.",
      "Tienes las manos o los pies fríos a menudo.",
      "Te despiertas entre las 3 y las 5 de la mañana sin saber por qué.",
      "A las cinco de la tarde te apagas y tiras de café.",
      "Después de comer tienes frío o sueño en vez de calor y energía.",
      "Te hinchas con facilidad o tus digestiones son pesadas.",
      "Tienes antojo de dulce por la tarde o por la noche.",
      "Llevas más de seis meses comiendo menos de lo que crees que necesitas.",
      "Tu libido ha bajado en el último año.",
      "Entrenas igual o más que antes y rindes menos."
    ];
    var R = [
      { max: 3, t: "Motor encendido", s: "Te sobra base. Si estás estancado, es cuestión de orden, no de restringir más.", m: "Tu cuerpo todavía reparte calor con soltura y el cortisol no tiene que salir a compensar. En consecuencia, el estancamiento no viene de que comas demasiado, sino del orden en que haces las cosas. Apretar más ahora sería gastar la base que te sobra." },
      { max: 6, t: "A medio gas", s: "Tu cuerpo ya está ahorrando. Es el momento en que subir comida funciona rápido, y también el momento en que la mayoría aprieta más.", m: "Cuando llevas tiempo comiendo por debajo de lo que gastas, el cuerpo baja la temperatura para ahorrar, como el móvil cuando entra en modo ahorro. Para sostenerte, el cortisol sube a tirar de ti, y de ahí salen el café de las cinco y el sueño ligero. En consecuencia, subir comida ahora enciende el metabolismo con rapidez. Pero la mayoría hace lo contrario: recorta más, y el motor se apaga un poco más." },
      { max: 10, t: "Apagado", s: "No es disciplina ni genética. Tu cuerpo lleva tiempo mandando señales de escasez y ha respondido ahorrando. Esto no se arregla recortando más.", m: "Tu cuerpo funciona como un móvil al 10 %: apaga lo que no es imprescindible. Baja la temperatura, se ralentiza la digestión, cae la libido y el cortisol se queda alto para mantenerte en pie, por eso te despiertas de madrugada. En consecuencia, un metabolismo apagado no quema aunque comas poco, y cada recorte lo apaga un poco más. Se arregla encendiendo el motor, no quitándole gasolina." }
    ];
    var i = 0, score = 0, hist = [];
    var qbox = $("#q-box"), rbox = $("#r-box");
    function show() {
      $("#q-n").textContent = "Pregunta " + (i + 1) + " de " + Q.length;
      $("#q-t").textContent = Q[i];
      $("#prog").style.width = (i / Q.length * 100) + "%";
      $("#prog-wrap").setAttribute("aria-valuenow", String(i));
      $("#q-back").hidden = i === 0;
    }
    function done() {
      var r = R.filter(function (x) { return score <= x.max; })[0];
      qbox.hidden = true; rbox.hidden = false;
      $("#r-score").innerHTML = score + '<small style="font-size:18px;color:var(--muted)"> / 10 señales</small>';
      $("#r-title").textContent = r.t;
      $("#r-sum").textContent = r.s;
      $("#r-mech").textContent = r.m;
      $("#prog").style.width = "100%";
      rbox.scrollIntoView({ block: "start" });
    }
    function answer(yes) { hist.push(yes ? 1 : 0); score += yes ? 1 : 0; i++; if (i >= Q.length) done(); else show(); }
    $("#q-yes").addEventListener("click", function () { answer(true); });
    $("#q-no").addEventListener("click", function () { answer(false); });
    $("#q-back").addEventListener("click", function () { if (i > 0) { i--; score -= hist.pop(); show(); } });
    $("#r-again").addEventListener("click", function () { i = 0; score = 0; hist = []; rbox.hidden = true; qbox.hidden = false; show(); });
    show();
  }

  /* ---- /mi-cuenta ---- */
  if (PAGE === "mi-cuenta") {
    var inp = $("#acc-name"), msg = $("#acc-msg");
    inp.value = store("ctr_nombre") || "";
    $("#acc-save").addEventListener("click", function () {
      var v = inp.value.trim(); if (!v) { msg.textContent = "Escribe tu nombre."; return; }
      store("ctr_nombre", v); msg.textContent = "Guardado."; var w = $("#who-name"); if (w) { w.textContent = v; $("#who-hola").style.display = ""; $("#who-av").textContent = v.charAt(0).toUpperCase(); }
    });
    $("#acc-del").addEventListener("click", function () {
      store("ctr_nombre", null); store("ctr_freno", null); inp.value = ""; msg.textContent = "Listo. Tu acceso se ha borrado de este navegador.";
      var w = $("#who-name"); if (w) { w.textContent = ""; $("#who-hola").style.display = "none"; $("#who-av").textContent = "C"; }
    });
  }
})();
