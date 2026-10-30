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
  /* Vídeo de YouTube con carga al tocar: miniatura + play; el iframe solo se crea al pulsar. */
  function yt(id, title) {
    return '<button type="button" class="yt" data-yt="' + esc(id) + '" data-title="' + esc(title) + '">' +
      '<img src="https://i.ytimg.com/vi/' + esc(id) + '/maxresdefault.jpg" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg\'" alt="' + esc(title) + '" loading="lazy">' +
      '<span class="yt-play" aria-hidden="true"></span></button>';
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button.yt") : null;
    if (!b) return;
    var box = b.parentNode;
    box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(b.getAttribute("data-yt")) + '?rel=0&autoplay=1" title="' + esc(b.getAttribute("data-title")) + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    var f = box.firstChild; if (f && f.focus) f.focus();
  });

  /* Chips de "qué te frena" -> clase puesta primero */
  var FRENOS = {
    poco: { label: "Como poco y no pierdo grasa", clase: "calorias" },
    energia: { label: "Tengo baja energía, voy apagado", clase: "energia" },
    rebote: { label: "Pierdo grasa y luego reboto", clase: "rebote" },
    mas: { label: "Como más por mi cuenta y no sé si lo hago bien", clase: "mecanismo" }
  };
  function freno() { var f = store("ctr_freno"); return FRENOS[f] ? f : null; }
  /* Número (1..n) de la clase que se pone primero según el freno; sin freno, la primera. */
  function claseFirst() {
    var f = freno(), k = f ? FRENOS[f].clase : "mecanismo", L = C.CLASSES || [];
    for (var i = 0; i < L.length; i++) if (L[i].key === k) return i + 1;
    return 1;
  }

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
    { tag: "Vídeo", ic: "7", t: "Las 7 clases del método", d: "Te llevas el método de principio a fin, en tres secciones: grasa, energía y cabeza", m: "7 vídeos", href: "metodo" },
    { tag: "Vídeo", ic: "1h", t: "Clase larga: pierde grasa comiendo más", d: "Te llevas la explicación entera de una sentada", m: "1 h", href: "clase-larga" },
    { tag: "Vídeo", ic: "3", t: "Testimonios", d: "Te llevas tres casos contados por ellos mismos", m: "3 vídeos", href: "testimonios" },
    { tag: "Test", ic: "?", t: "¿Grasa o inflamación?", d: "Te llevas saber qué parte de lo que ves en el espejo es grasa", m: "3 min", href: "guias/grasa-o-inflamacion" },
    { tag: "Checklist", ic: "⚡", t: "10 señales de que vas con energía prestada", d: "Te llevas por qué te apagas a las cinco y qué dice eso de tu metabolismo", m: "4 min", href: "guias/10-senales-de-energia-prestada" },
    { tag: "Checklist", ic: "✓", t: "10 señales de cortisol alto", d: "Te llevas una lista para ponerle nombre a lo que notas", m: "3 min", href: "guias/10-senales-de-cortisol-alto" },
    { tag: "Checklist", ic: "Z", t: "10 señales de que tu descanso te frena", d: "Te llevas qué parte de tu descanso está frenando tu metabolismo", m: "4 min", href: "guias/10-senales-de-que-tu-descanso-te-frena" },
    { tag: "Checklist", ic: "?", t: "Niebla mental: ¿falta de foco o de combustible?", d: "Te llevas por qué la cabeza se arregla por el cuerpo", m: "4 min", href: "guias/niebla-mental" }
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
  var cnt = $("#res-count"); if (cnt) cnt.textContent = RES.length + " recursos, todos abiertos";
  var g2 = $("#res-grid-guias");
  if (g2) { g2.innerHTML = RES.filter(function (r) { return /^(Guía|Checklist|Test)$/.test(r.tag); }).map(resCard).join(""); }

  /* ¿Te falta algo? (portal) */
  var prodG = $("#prod-grid");
  if (prodG) {
    prodG.innerHTML = '<a class="res" href="' + ROOT + 'pide-un-recurso.html"><div class="hd"><div class="ic" aria-hidden="true">+</div><span class="pill red">Pide un recurso</span></div><h3>¿Te falta algo?</h3><p>Dime qué recurso quieres que haga y lo ponemos en la lista.</p><span class="open">Pedirlo →</span></a>';
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
      return '<a class="les" href="' + ROOT + 'metodo.html#clase-' + pad(i + 1) + '"><div class="n">' + pad(i + 1) + '</div><div class="t"><b>' + esc(c.title) + '</b></div><div class="pl" aria-hidden="true"></div><img class="th" src="https://i.ytimg.com/vi/' + esc(c.id) + '/hqdefault.jpg" alt="" loading="lazy"></a>';
    }).join("");
  }


  /* ---- Landing: formulario propio en pasos ---- */
  if (PAGE === "landing") {
    var form = $("#reg-form");
    var qs = $$(".q", form), cur = 0, ans = {}, t0 = Date.now(), sending = false;
    var FKEY = { "Como poco y no pierdo grasa": "poco", "Tengo baja energía, voy apagado": "energia", "Pierdo grasa y luego reboto": "rebote", "Como más por mi cuenta y no sé si lo hago bien": "mas" };
    var track = $("#q-track"), errEl = $("#reg-err"), nextB = $("#reg-next"), backB = $("#reg-back"), fine = $("#reg-fine");
    track.innerHTML = qs.map(function () { return "<b></b>"; }).join("");
    function err(m) { errEl.textContent = m || ""; }
    function show(i, focus) {
      cur = i; err("");
      qs.forEach(function (q, k) { q.classList.toggle("on", k === i); });
      $$("b", track).forEach(function (b, k) { b.className = k <= i ? "on" : ""; });
      $("#q-step").textContent = "Paso " + (i + 1) + " de " + qs.length;
      var last = i === qs.length - 1, auto = qs[i].querySelector(".opts") && !last;
      nextB.hidden = !!auto; nextB.textContent = last ? "Quiero mi acceso" : "Continuar →";
      fine.hidden = !last; backB.hidden = i === 0;
      if (focus) { var f = qs[i].querySelector("input,select"); if (f) f.focus({ preventScroll: true }); }
    }
    $$(".q", form).forEach(function (q) {
      var key = q.getAttribute("data-q");
      $$(".opt", q).forEach(function (b) {
        b.addEventListener("click", function () {
          ans[key] = b.getAttribute("data-v");
          $$(".opt", q).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
          err("");
          if (key !== "fuente") setTimeout(function () { show(cur + 1, true); }, 160);
        });
      });
    });
    var prefix = $("#f-prefix"), pais = $("#f-pais");
    function paisDe(p) { return p === "+34" ? "España" : /^\+(41|43|31|44)$/.test(p) ? "Otro país de Europa" : /^\+(54|57|52|56|51|58)$/.test(p) ? "Latinoamérica" : "Otro"; }
    var paisTocado = false;
    pais.addEventListener("change", function () { paisTocado = true; });
    prefix.addEventListener("change", function () { if (!paisTocado) pais.value = paisDe(prefix.value); });
    pais.value = paisDe(prefix.value);
    function val(i) {
      var k = qs[i].getAttribute("data-q"), v;
      if (k === "frena") return ans.frena ? "" : "Elige una opción para seguir.";
      if (k === "probado") return ans.probado ? "" : "Elige una opción para seguir.";
      if (k === "dia_a_dia") return ans.dia_a_dia ? "" : "Elige una opción para seguir.";
      if (k === "datos") {
        if ($("#f-nombre").value.trim().length < 2) return "Escribe tu nombre.";
        if (!/^\d{6,12}$/.test($("#f-phone").value.replace(/[\s.\-()]/g, ""))) return "Revisa tu WhatsApp: solo el número, sin el prefijo.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($("#f-email").value.trim())) return "Revisa tu email, parece que falta algo.";
        v = $("#f-edad").value.trim();
        if (!/^\d{1,3}$/.test(v) || +v < 14 || +v > 100) return "Escribe tu edad en números (entre 14 y 100).";
        if (!pais.value) return "Dinos dónde vives.";
        return "";
      }
      if (k === "fuente") return ans.fuente ? "" : "Elige por dónde has llegado.";
      return "";
    }
    function payload() {
      return {
        nombre: $("#f-nombre").value.trim(),
        whatsapp: prefix.value + " " + $("#f-phone").value.replace(/[\s.\-()]/g, ""),
        email: $("#f-email").value.trim(),
        pais: pais.value,
        frena: ans.frena, probado: ans.probado, dia_a_dia: ans.dia_a_dia,
        edad: parseInt($("#f-edad").value, 10),
        fuente: ans.fuente, pieza: $("#f-pieza").value.trim(),
        origen_url: document.referrer || "", pagina: location.href
      };
    }
    function submit() {
      if (sending) return;
      if ($("#f-web").value) return;                       /* honeypot: bot, no se envía */
      if (Date.now() - t0 < 5000) { err("Un momento, estamos preparando tu acceso. Vuelve a pulsar en unos segundos."); return; }
      var data = payload(), url = C.RELAY_URL;
      sending = true; nextB.disabled = true; nextB.textContent = "Enviando…"; err("");
      function fail() {
        store("ctr_pending_lead", JSON.stringify(data));
        sending = false; nextB.disabled = false; nextB.textContent = "Quiero mi acceso";
        err("No hemos podido guardar tus datos; vuelve a intentarlo.");
      }
      if (!url) { fail(); return; }
      var ctl = window.AbortController ? new AbortController() : null;
      var to = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: ctl ? ctl.signal : undefined })
        .then(function (r) {
          clearTimeout(to);
          if (!r.ok) throw new Error("http " + r.status);
          store("ctr_freno", FKEY[data.frena] || ""); store("ctr_nombre", data.nombre); store("ctr_pending_lead", null);
          location.href = "bienvenida.html";
        })
        .catch(function () { clearTimeout(to); fail(); });
    }
    nextB.addEventListener("click", function () {
      var m = val(cur); if (m) { err(m); return; }
      if (cur === qs.length - 1) submit(); else show(cur + 1, true);
    });
    backB.addEventListener("click", function (e) { e.preventDefault(); if (cur > 0) show(cur - 1); });
    form.addEventListener("submit", function (e) { e.preventDefault(); nextB.hidden || nextB.click(); });
    var hc = $("#hero-cta");
    if (hc) hc.addEventListener("click", function (e) { e.preventDefault(); $("#registro").scrollIntoView({ behavior: "smooth", block: "start" }); });
    show(0);
  }

  /* ---- /bienvenida ---- */
  if (PAGE === "bienvenida") {
    var vb = $("#welcome-video");
    if (C.WELCOME_LOOM_ID) {
      vb.className = "video loom";
      vb.innerHTML = '<iframe src="https://www.loom.com/embed/' + esc(C.WELCOME_LOOM_ID) + '?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true" title="Vídeo de bienvenida de Rafa" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    } else if (C.WELCOME_VIDEO_ID) { vb.className = "video"; vb.innerHTML = yt(C.WELCOME_VIDEO_ID, "Vídeo de bienvenida de Rafa"); }
    var chips = $$("#chips .opt");
    function mark() { var f = freno(); chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-f") === f)); }); var fp = $("#first-pick"); if (f) { fp.hidden = false; $("#first-pick-title").textContent = "Clase " + pad(FRENOS[f].clase) + ": " + C.CLASSES[FRENOS[f].clase - 1].title; } else { fp.hidden = true; } }
    if (freno()) { var cw = $("#chips"); if (cw && cw.parentNode) cw.parentNode.hidden = true; }
    chips.forEach(function (c) { c.addEventListener("click", function () { store("ctr_freno", c.getAttribute("data-f")); mark(); }); });
    mark();
  }

  /* ---- /metodo ---- */
  if (PAGE === "metodo") {
    var first = claseFirst();
    var html = "", lastSec = null;
    C.CLASSES.forEach(function (c, i) {
      var n = i + 1;
      if (c.sec !== lastSec) {
        var sInfo = (C.SECTIONS || []).filter(function (s) { return s.id === c.sec; })[0] || { title: c.sec, line: "" };
        html += '<div class="sec-h mh"><div><span class="eyebrow">Sección</span><h2>' + esc(sInfo.title) + '</h2>' + (sInfo.line ? '<p>' + esc(sInfo.line) + '</p>' : "") + '</div></div>';
        lastSec = c.sec;
      }
      html += '<article class="vitem' + (freno() && n === first ? " first-pick" : "") + '" id="clase-' + pad(n) + '"><div class="hd"><div class="n">' + pad(n) + '</div><div><h3>' + esc(c.title) + '</h3><p>' + esc(c.line) + '</p></div></div><div class="video">' + yt(c.id, c.title) + '</div></article>';
    });
    $("#vlist").innerHTML = html;
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
  /* ---- /pide-un-recurso: formulario propio → puente → Airtable (💡 Peticiones del portal) ---- */
  if (PAGE === "pide") {
    var rf = $("#req-form"), rErr = $("#req-err"), rBtn = $("#req-send"), rOk = $("#req-ok"), r0 = Date.now(), rSending = false;
    var rn = $("#r-nombre"); if (rn && store("ctr_nombre")) rn.value = store("ctr_nombre");
    if (rf) rf.addEventListener("submit", function (e) {
      e.preventDefault(); if (rSending) return;
      var data = { tipo: "peticion", nombre: $("#r-nombre").value.trim(), email: $("#r-email").value.trim(), recurso: $("#r-texto").value.trim(), website: $("#r-web").value };
      if (data.website) return;
      if (!data.recurso) { rErr.textContent = "Cuéntame qué recurso te gustaría."; return; }
      if (!data.nombre) { rErr.textContent = "Dime tu nombre para saber a quién avisar."; return; }
      if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { rErr.textContent = "Ese email no parece correcto."; return; }
      if (Date.now() - r0 < 3000) { rErr.textContent = "Un momento, vuelve a pulsar en unos segundos."; return; }
      if (!C.RELAY_URL) { rErr.textContent = "Ahora mismo no se puede enviar; inténtalo más tarde."; return; }
      rSending = true; rBtn.disabled = true; rBtn.textContent = "Enviando…"; rErr.textContent = "";
      fetch(C.RELAY_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error("http " + r.status); rf.hidden = true; rOk.hidden = false; })
        .catch(function () { rSending = false; rBtn.disabled = false; rBtn.textContent = "Pedirlo"; rErr.textContent = "No hemos podido guardarlo; vuelve a intentarlo."; });
    });
  }
  var tm = $("#test-metabolico-btn"); if (tm) { tm.setAttribute("href", C.TEST_METABOLICO_URL); tm.setAttribute("target", "_blank"); tm.setAttribute("rel", "noopener"); }
  /* ---- /entra: vídeo ---- */
  var ev = $("#entra-video");
  if (ev && C.ENTRA_VIDEO_ID) { ev.className = "video"; ev.removeAttribute("aria-hidden"); ev.innerHTML = yt(C.ENTRA_VIDEO_ID, "Vídeo del método"); }
  else if (ev) ev.classList.add("is-empty");

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
