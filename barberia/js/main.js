/* =========================================================
   NAVAJA NEGRA — Barbería (demo de portafolio)
   Sitio multipágina: cabecera, pie y comportamiento compartidos.
   Las solicitudes de cita se guardan en localStorage.
   Autor: Diego Alejandro Tellez Tellez (thc.dev)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -------------------------------------------------------
     1. Configuración
     ------------------------------------------------------- */
  const PAGINA = document.body.dataset.page || "inicio";
  const NOMBRE = "NAVAJA NEGRA";
  const WHATSAPP = document.body.dataset.whatsapp || "573000000000";
  const STORAGE_KEY = "navajanegra_citas";

  const waUrl = (mensaje) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  const money = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });

  const SERVICES = [
    { id: "clasico",    nombre: "Corte clásico",       categoria: "clasicos", precio: 25000, duracion: 30, descripcion: "Líneas limpias y acabado tradicional con tijera y peine. Ideal para ir a trabajar todos los días.", badge: "" },
    { id: "fade",       nombre: "Fade / degradado",    categoria: "modernos", precio: 30000, duracion: 35, descripcion: "Degradado progresivo con transición suave y nuca definida. Acabado en espejo.", badge: "" },
    { id: "undercut",   nombre: "Undercut",            categoria: "modernos", precio: 32000, duracion: 35, descripcion: "Contraste entre laterales rapados y parte superior larga. Se peina hacia atrás o al lado.", badge: "" },
    { id: "pompadour",  nombre: "Pompadour",           categoria: "modernos", precio: 35000, duracion: 40, descripcion: "Volumen arriba, laterales limpios y fijación con cera mate para que dure el día.", badge: "ESTILO" },
    { id: "barba",      nombre: "Barba tallada",       categoria: "barba",    precio: 18000, duracion: 25, descripcion: "Diseño de línea, simetría e hidratación final. También disponible sin corte de cabello.", badge: "" },
    { id: "navaja",     nombre: "Afeitado a navaja",    categoria: "barba",    precio: 22000, duracion: 30, descripcion: "Ritual con toalla caliente, espuma y navaja. Termina con bálsamo y polvo talco.", badge: "" },
    { id: "corte-barba", nombre: "Corte + barba",      categoria: "combos",   precio: 42000, duracion: 50, descripcion: "El servicio completo: corte a elección más barba tallada con acabado a navaja.", badge: "MÁS PEDIDO" },
    { id: "infantil",   nombre: "Corte infantil",      categoria: "clasicos", precio: 20000, duracion: 25, descripcion: "Corte cómodo para los más pequeños, con paciencia y sin apuros. Hasta los 10 años.", badge: "" },
    { id: "textura",    nombre: "Texturizado",         categoria: "modernos", precio: 28000, duracion: 30, descripcion: "Se quita peso y se crea movimiento. Perfecto para cabello grueso o corto que se aplana.", badge: "" }
  ];

  const GALLERY = [
    { src: "assets/fade.svg",      titulo: "Fade limpio",        meta: "Degradado · 35 min",  alt: "Ilustración de un corte fade degradado" },
    { src: "assets/undercut.svg",  titulo: "Undercut",           meta: "Contraste · 35 min",  alt: "Ilustración de un corte undercut" },
    { src: "assets/clasico.svg",   titulo: "Clásico",            meta: "Tijera · 30 min",     alt: "Ilustración de un corte clásico" },
    { src: "assets/pompadour.svg", titulo: "Pompadour",          meta: "Volumen · 40 min",    alt: "Ilustración de un corte pompadour" },
    { src: "assets/barba.svg",     titulo: "Barba tallada",       meta: "Detalle · 25 min",    alt: "Ilustración de una barba tallada" },
    { src: "assets/navaja.svg",    titulo: "Afeitado a navaja",   meta: "Ritual · 30 min",     alt: "Ilustración de una navaja barbera" },
    { src: "assets/tijeras.svg",   titulo: "Tijeras de oficio",   meta: "Herramientas",        alt: "Ilustración de unas tijeras de barbería" },
    { src: "assets/pole.svg",      titulo: "El poste de la casa", meta: "Símbolo",             alt: "Ilustración de un poste de barbería" },
    { src: "assets/moto.svg",      titulo: "Café racer",          meta: "El garage · motor",   alt: "Ilustración de una moto café racer de perfil" },
    { src: "assets/casco.svg",     titulo: "Casco y visera",      meta: "El garage · estilo",  alt: "Ilustración de un casco de moto con visera" }
  ];

  const CAT_LABEL = {
    clasicos: "Clásicos",
    modernos: "Modernos",
    barba: "Barba",
    combos: "Combos"
  };

  /* -------------------------------------------------------
     2. Componentes compartidos
     ------------------------------------------------------- */
  const HEADER = `
  <div class="demo-notice" role="note">DEMO FICTICIA · Negocio y datos de ejemplo, solo demostrativos. No es una barbería real.</div>
  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      <a href="index.html" class="brand" aria-label="NAVAJA NEGRA — volver al inicio">
        <span class="brand__mark" aria-hidden="true">✦</span>
        <span class="brand__text">NAVAJA NEGRA<small>Barbería de garage · Bucaramanga</small></span>
      </a>
      <nav class="nav" id="mainNav" aria-label="Navegación principal">
        <a href="index.html" data-nav="inicio">Inicio</a>
        <a href="servicios.html" data-nav="servicios">Catálogo y tarifas</a>
        <a href="galeria.html" data-nav="galeria">Galería</a>
        <a href="citas.html" data-nav="citas">Citas</a>
      </nav>
      <button class="nav-toggle" id="navToggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="mainNav">☰</button>
    </div>
  </header>`;

  const FOOTER = `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <h3>NAVAJA NEGRA</h3>
          <p>Barbería de garage con filo de ciudad. Cortes, barbas, motos y citas sin complicaciones.</p>
        </div>
        <div>
          <h3>Explora</h3>
          <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="servicios.html">Catálogo y tarifas</a></li>
            <li><a href="galeria.html">Galería</a></li>
            <li><a href="citas.html">Reservar cita</a></li>
          </ul>
        </div>
        <div>
          <h3>Contacto de ejemplo</h3>
          <p>WhatsApp: +57 300 000 0000</p>
          <p>Cra. 15 # 12-34, Centro · Bucaramanga</p>
          <p>Lunes a sábado · 9:00 a.m. – 7:00 p.m.</p>
        </div>
      </div>
      <p class="footer__bottom">© <span data-year>2026</span> ${NOMBRE} · Demo de portafolio · Diseñado por <strong>Diego Alejandro Tellez Tellez</strong> · thc.dev · Teléfono y dirección son marcadores de posición.</p>
    </div>
  </footer>`;

  function montar(selector, html) {
    document.querySelectorAll(selector).forEach((el) => { el.innerHTML = html; });
  }

  montar("[data-site-header]", HEADER);
  montar("[data-site-footer]", FOOTER);

  /* Navegación activa */
  document.querySelectorAll("#mainNav a[data-nav]").forEach((a) => {
    if (a.dataset.nav === PAGINA) a.setAttribute("aria-current", "page");
  });

  /* Menú móvil */
  const nav = document.getElementById("mainNav");
  const navToggle = document.getElementById("navToggle");
  function cerrarMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
    navToggle.textContent = "☰";
  }
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const abierto = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(abierto));
      navToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      navToggle.textContent = abierto ? "×" : "☰";
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) cerrarMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 640) cerrarMenu(); });
  }

  /* Enlaces de WhatsApp */
  document.querySelectorAll(".js-wa").forEach((enlace) => {
    enlace.href = waUrl(enlace.dataset.waMessage || `¡Hola ${NOMBRE}!`);
  });

  /* Año del pie */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* Animación de entrada */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  function esc(valor) {
    return String(valor == null ? "" : valor).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  /* -------------------------------------------------------
     3. Catálogo y tarifas (servicios.html)
     ------------------------------------------------------- */
  const serviceGrid = document.getElementById("serviceGrid");
  if (serviceGrid) {
    function renderServicios(filtro) {
      const lista = SERVICES.filter((s) => filtro === "all" || s.categoria === filtro);
      if (!lista.length) {
        serviceGrid.innerHTML = '<p class="empty">No hay servicios en esta categoría.</p>';
        return;
      }
      serviceGrid.innerHTML = lista.map((s) => `
        <article class="service-card reveal visible">
          <div class="service-card__top">
            <span class="service-card__tag">${esc(CAT_LABEL[s.categoria])} · ${s.duracion} min</span>
            ${s.badge ? `<span class="service-card__badge">${esc(s.badge)}</span>` : ""}
          </div>
          <h3>${esc(s.nombre)}</h3>
          <p>${esc(s.descripcion)}</p>
          <div class="service-card__meta"><span>Duración <b>${s.duracion} min</b></span><span>Categoría <b>${esc(CAT_LABEL[s.categoria])}</b></span></div>
          <div class="service-card__foot">
            <span class="service-card__price">${money.format(s.precio)}<small>por servicio</small></span>
            <a class="btn btn--gold btn--small" href="citas.html?servicio=${encodeURIComponent(s.id)}">Reservar →</a>
          </div>
        </article>`).join("");
    }

    renderServicios("all");

    document.querySelectorAll(".filters .filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filters .filter").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderServicios(btn.dataset.filter);
      });
    });
  }

  /* -------------------------------------------------------
     4. Galería y visor (galeria.html)
     ------------------------------------------------------- */
  const galleryGrid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");

  if (galleryGrid && lightbox) {
    let indice = 0;
    let ultimoFoco = null;

    galleryGrid.innerHTML = GALLERY.map((g, i) => `
      <button class="gallery-item reveal visible" type="button" data-index="${i}" aria-label="Ampliar ${esc(g.titulo)}">
        <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" />
        <span>${esc(g.titulo)}<small>${esc(g.meta)}</small></span>
      </button>`).join("");

    const lbImg = document.getElementById("lightboxImg");
    const lbTitle = document.getElementById("lightboxTitle");
    const lbMeta = document.getElementById("lightboxMeta");
    const lbClose = document.getElementById("lightboxClose");
    const lbPrev = document.getElementById("lightboxPrev");
    const lbNext = document.getElementById("lightboxNext");

    function mostrar(i) {
      indice = (i + GALLERY.length) % GALLERY.length;
      const g = GALLERY[indice];
      lbImg.src = g.src;
      lbImg.alt = g.alt;
      lbTitle.textContent = g.titulo;
      lbMeta.textContent = g.meta + " · ilustración SVG";
    }

    function abrir(i) {
      ultimoFoco = document.activeElement;
      mostrar(i);
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }

    function cerrar() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    galleryGrid.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (item) abrir(Number(item.dataset.index));
    });

    lbClose.addEventListener("click", cerrar);
    lightbox.querySelector("[data-close]").addEventListener("click", cerrar);
    lbPrev.addEventListener("click", () => mostrar(indice - 1));
    lbNext.addEventListener("click", () => mostrar(indice + 1));
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowLeft") mostrar(indice - 1);
      if (e.key === "ArrowRight") mostrar(indice + 1);
    });
  }

  /* -------------------------------------------------------
     5. Reserva de citas (citas.html)
     ------------------------------------------------------- */
  const form = document.getElementById("bookingForm");
  if (form) {
    const campos = {
      nombre: document.getElementById("bookingNombre"),
      whatsapp: document.getElementById("bookingWhatsapp"),
      correo: document.getElementById("bookingCorreo"),
      servicio: document.getElementById("bookingServicio"),
      fecha: document.getElementById("bookingFecha"),
      hora: document.getElementById("bookingHora"),
      nota: document.getElementById("bookingNota")
    };
    const errorEl = document.getElementById("bookingError");
    const successEl = document.getElementById("bookingSuccess");
    const successText = document.getElementById("bookingSuccessText");
    const waLink = document.getElementById("bookingWhatsappLink");
    const listaEl = document.getElementById("bookingList");
    const btnOtra = document.getElementById("bookingAgain");

    const hoy = new Date();
    const hoyISO = [hoy.getFullYear(), String(hoy.getMonth() + 1).padStart(2, "0"), String(hoy.getDate()).padStart(2, "0")].join("-");
    campos.fecha.min = hoyISO;

    campos.servicio.innerHTML =
      '<option value="">Selecciona un servicio</option>' +
      SERVICES.map((s) => `<option value="${esc(s.id)}">${esc(s.nombre)} — ${money.format(s.precio)}</option>`).join("");

    /* Pre-selección desde tarjetas: citas.html?servicio=fade */
    const parametros = new URLSearchParams(window.location.search);
    const servicioParametro = parametros.get("servicio");
    if (servicioParametro && SERVICES.some((s) => s.id === servicioParametro)) {
      campos.servicio.value = servicioParametro;
    }

    function leerCitas() {
      try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(datos) ? datos : [];
      } catch (e) {
        return [];
      }
    }

    function guardarCitas(citas) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
        return true;
      } catch (e) {
        return false;
      }
    }

    function nombreServicio(id) {
      const s = SERVICES.find((x) => x.id === id);
      return s ? s.nombre : "Servicio no especificado";
    }

    function fechaLegible(iso) {
      const partes = String(iso).split("-").map(Number);
      if (partes.length !== 3) return iso;
      const f = new Date(partes[0], partes[1] - 1, partes[2]);
      if (Number.isNaN(f.getTime())) return iso;
      return new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(f);
    }

    function mostrarError(mensaje, campo) {
      errorEl.textContent = mensaje;
      errorEl.hidden = false;
      if (campo) campo.focus();
    }

    function limpiarError() {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }

    function renderLista() {
      const citas = leerCitas();
      if (!citas.length) {
        listaEl.innerHTML = '<li class="booking__item"><div><strong>Aún no hay solicitudes guardadas.</strong><small>Cuando reserves una cita, aparecerá aquí.</small></div></li>';
        return;
      }
      listaEl.innerHTML = citas.map((c) => `
        <li class="booking__item">
          <div>
            <strong>${esc(c.nombre)} · ${esc(nombreServicio(c.servicio))}</strong>
            <small>${esc(fechaLegible(c.fecha))} · ${esc(c.hora)} · WhatsApp ${esc(c.whatsapp)}${c.nota ? " · " + esc(c.nota) : ""}</small>
          </div>
          <button type="button" data-cancelar="${esc(c.id)}" aria-label="Cancelar la cita de ${esc(c.nombre)}">Cancelar</button>
        </li>`).join("");
    }

    function validar() {
      const nombre = campos.nombre.value.trim();
      const whatsapp = campos.whatsapp.value.replace(/\D/g, "");
      const correo = campos.correo.value.trim();
      const servicio = campos.servicio.value;
      const fecha = campos.fecha.value;
      const hora = campos.hora.value;

      if (nombre.length < 2) return { ok: false, msg: "Escribe tu nombre (al menos 2 caracteres).", campo: campos.nombre };
      if (whatsapp.length < 7 || whatsapp.length > 15) return { ok: false, msg: "Escribe un número de WhatsApp válido, solo dígitos.", campo: campos.whatsapp };
      if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { ok: false, msg: "El correo no parece válido. Revísalo o déjalo vacío.", campo: campos.correo };
      if (!SERVICES.some((s) => s.id === servicio)) return { ok: false, msg: "Selecciona un servicio del catálogo.", campo: campos.servicio };
      if (!fecha || fecha < hoyISO) return { ok: false, msg: "Selecciona una fecha de hoy en adelante.", campo: campos.fecha };
      if (!hora) return { ok: false, msg: "Selecciona una hora disponible.", campo: campos.hora };
      return { ok: true, datos: { nombre, whatsapp, correo, servicio, fecha, hora, nota: campos.nota.value.trim() } };
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      limpiarError();
      const resultado = validar();
      if (!resultado.ok) {
        mostrarError(resultado.msg, resultado.campo);
        return;
      }

      const d = resultado.datos;
      const cita = {
        id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 7),
        nombre: d.nombre,
        whatsapp: d.whatsapp,
        correo: d.correo,
        servicio: d.servicio,
        fecha: d.fecha,
        hora: d.hora,
        nota: d.nota,
        creado: new Date().toISOString()
      };

      const citas = leerCitas();
      citas.unshift(cita);
      if (!guardarCitas(citas)) {
        mostrarError("No se pudo guardar en este navegador. Revisa que el almacenamiento local esté activo.");
        return;
      }

      successText.textContent = `${d.nombre}, tu solicitud para ${nombreServicio(d.servicio)} el ${fechaLegible(d.fecha)} a las ${d.hora} quedó guardada en este navegador.`;
      waLink.href = waUrl(`¡Hola ${NOMBRE}! Quiero confirmar una cita.\nNombre: ${d.nombre}\nServicio: ${nombreServicio(d.servicio)}\nFecha: ${d.fecha}\nHora: ${d.hora}${d.nota ? "\nNota: " + d.nota : ""}`);
      successEl.hidden = false;
      form.reset();
      campos.fecha.min = hoyISO;
      renderLista();
      successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    form.addEventListener("reset", () => {
      limpiarError();
      successEl.hidden = true;
    });

    btnOtra.addEventListener("click", () => {
      successEl.hidden = true;
      campos.nombre.focus();
    });

    listaEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cancelar]");
      if (!btn) return;
      const restantes = leerCitas().filter((c) => c.id !== btn.dataset.cancelar);
      guardarCitas(restantes);
      renderLista();
    });

    renderLista();
  }
});
