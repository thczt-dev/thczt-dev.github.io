/* =========================================================
   SABOR & PUNTO — Sitio multipágina
   Cabecera, pie y pedido se inyectan comocomponentes compartidos.
   El pedido se guarda en localStorage y viaja entre páginas.
   Autor: Diego Alejandro Tellez Tellez (thc.dev)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -------------------------------------------------------
     1. Configuración compartida
     ------------------------------------------------------- */
  const WHATSAPP = document.body.dataset.whatsapp || "573000000000";
  const NOMBRE   = document.body.dataset.whatsappName || "Sabor & Punto";
  const PAGINA   = document.body.dataset.page || "inicio";
  const waUrl = (mensaje) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  const money = new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  });

  /* -------------------------------------------------------
     2. Componentes compartidos (cabecera, pie, pedido)
     ------------------------------------------------------- */
  const HEADER = `
  <div class="demo-notice" role="note">DEMO FICTICIA · Negocio y datos de ejemplo, solo demostrativos. No es un restaurante real.</div>
  <header class="site-header" id="siteHeader">
    <div class="header__inner">
      <a href="index.html" class="brand" aria-label="Sabor & Punto — inicio">
        <span class="brand__mark" aria-hidden="true">✳</span>
        <span class="brand__name">Sabor <em>&amp;</em> Punto</span>
        <span class="brand__sub">COCINA DE MESA · BUCARAMANGA</span>
      </a>
      <nav class="nav-pill" id="mainNav" aria-label="Navegación principal">
        <a href="index.html" data-nav="inicio">Inicio</a>
        <a href="carta.html" data-nav="carta">Carta</a>
        <a href="historia.html" data-nav="historia">Historia</a>
        <a href="ubicacion.html" data-nav="ubicacion">Encontranos</a>
        <a href="contacto.html" data-nav="contacto">Contacto</a>
        <a class="nav-pill__wa js-wa" data-wa-message="¡Hola Sabor &amp; Punto! Quiero hacer un pedido 🍽️" href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer">Pedir</a>
      </nav>
      <button class="menu-btn" id="menuToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="mainNav">
        <span></span><span></span>
      </button>
    </div>
  </header>`;

  const FOOTER = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer__mark" aria-hidden="true">✳</div>
      <a href="index.html" class="footer__brand">Sabor <em>&amp;</em> Punto</a>
      <p class="footer__tagline">Cocina de mesa · Bucaramanga, Colombia</p>
      <nav class="footer__links" aria-label="Enlaces del pie">
        <a href="index.html">Inicio</a>
        <a href="carta.html">Carta</a>
        <a href="historia.html">Historia</a>
        <a href="ubicacion.html">Encontranos</a>
        <a href="contacto.html">Contacto</a>
      </nav>
      <p class="footer__credit">© <span id="year">2026</span> Sabor &amp; Punto · Diseñado por <strong>Diego Alejandro Tellez Tellez</strong> · <a href="https://thc.dev" target="_blank" rel="noopener noreferrer">thc.dev</a></p>
    </div>
  </footer>`;

  const ORDER_UI = `
  <div class="order-bar" id="orderBar" hidden>
    <div class="order-bar__pill">
      <span class="order-bar__count" id="orderCount">0 platos</span>
      <span class="order-bar__total" id="orderTotal">$ 0</span>
      <a class="order-bar__view" href="carta.html" id="orderView">Ver carta</a>
      <button class="btn btn--solid btn--sm" id="orderWhatsapp" type="button">Enviar por WhatsApp ↗</button>
    </div>
  </div>
  <div class="overlay" id="sheetOverlay" hidden></div>
  <div class="order-modal" id="orderSheet" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Tu pedido">
    <button class="order-modal__close" id="sheetClose" type="button" aria-label="Cerrar pedido">&times;</button>
    <span class="ornament" aria-hidden="true">✳</span>
    <h2>Tu pedido</h2>
    <p class="order-modal__sub">Revisa lo que elegiste antes de enviarlo.</p>
    <div class="order-modal__body" id="orderItems"></div>
    <div class="order-modal__foot">
      <div class="cart-total"><span>Total</span><strong id="sheetTotal">$ 0</strong></div>
      <button class="btn btn--solid btn--block" id="sheetWhatsapp" type="button">Enviar por WhatsApp ↗</button>
      <small>Se abrirá WhatsApp con tu pedido listo para enviar.</small>
    </div>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  const montar = (selector, html) =>
    document.querySelectorAll(selector).forEach((el) => { el.innerHTML = html; });

  montar("[data-site-header]", HEADER);
  montar("[data-site-footer]", FOOTER);
  montar("[data-site-order]", ORDER_UI);

  document.querySelectorAll("#mainNav a[data-nav]").forEach((a) => {
    a.classList.toggle("is-active", a.dataset.nav === PAGINA);
  });

  /* -------------------------------------------------------
     3. Enlaces externos de WhatsApp
     ------------------------------------------------------- */
  document.querySelectorAll(".js-wa").forEach((enlace) => {
    enlace.href = waUrl(enlace.dataset.waMessage || `¡Hola ${NOMBRE}!`);
  });

  /* -------------------------------------------------------
     4. Datos de la carta
     ------------------------------------------------------- */
  const PLATOS = [
    { id: "empanadas",  nombre: "Empanadas santandereanas", categoria: "entradas",    precio: 18000,  imagen: "photo-1601050690597-df0568f70950", descripcion: "Tres unidades rellenas de carne mechada con ají dulce casero." },
    { id: "arepa",      nombre: "Arepa de huevo",            categoria: "entradas",    precio: 16000,  imagen: "photo-1509440159596-0249088772ff", descripcion: "Frita con huevo, queso costeño y nuestra salsa de la casa." },
    { id: "sopa",       nombre: "Sopa de patacón",           categoria: "entradas",    precio: 22000,  imagen: "photo-1547592180-85f173990554", descripcion: "Caldo criollo con patacón, queso fresco, cilantro y aguacate." },
    { id: "bandeja",    nombre: "Bandeja Punto",             categoria: "principales", precio: 45000,  imagen: "photo-1546069901-ba9599a7e63c", descripcion: "Carne a la parrilla, fríjol, arroz, plátano, arepa y aguacate." },
    { id: "pollo",      nombre: "Pollo a la brasa",          categoria: "principales", precio: 39000,  imagen: "photo-1544025162-d76694265947", descripcion: "Marinado 12 horas, con papa rústica y ensalada fresca." },
    { id: "pizza",      nombre: "Pizza Margarita",           categoria: "principales", precio: 42000,  imagen: "photo-1565299624946-b28f40a0ae38", descripcion: "Tomate, mozzarella fresca, albahaca y aceite de oliva." },
    { id: "pasta",      nombre: "Pasta al pesto",            categoria: "principales", precio: 38000,  imagen: "photo-1473093295043-cdd812d0e601", descripcion: "Pasta fresca con pesto de albahaca, parmesano y piñones." },
    { id: "burger",     nombre: "Hamburguesa Doble",         categoria: "principales", precio: 41000,  imagen: "photo-1568901346375-23c9450c58cd", descripcion: "Doble carne, cheddar, tocineta, lechuga y salsa de la casa." },
    { id: "tresleches", nombre: "Tres leches",               categoria: "postres",     precio: 16000,  imagen: "photo-1488477181946-6428a0291777", descripcion: "Bizcocho bañado en tres leches, crema batida y canela." },
    { id: "flan",       nombre: "Flan de caramelo",          categoria: "postres",     precio: 15000,  imagen: "photo-1551024506-0bccd828d307", descripcion: "Cremoso flan con caramelo casero. La receta de la abuela." },
    { id: "limonada",   nombre: "Limonada de coco",          categoria: "bebidas",     precio: 12000,  imagen: "photo-1544145945-f90425340c7e", descripcion: "Limón con leche de coco y hielo. Ideal para el clima." },
    { id: "cafe",       nombre: "Café colombiano",           categoria: "bebidas",     precio: 8000,   imagen: "photo-1501339847302-ac426a4a7cbb", descripcion: "Origen colombiano recién molido. Con leche o negro." }
  ];

  const imgUrl = (id, ancho = 400) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${ancho}&q=80`;

  /* -------------------------------------------------------
     5. Referencias al DOM (ya inyectado)
     ------------------------------------------------------- */
  const header       = document.getElementById("siteHeader");
  const menuToggle   = document.getElementById("menuToggle");
  const mainNav      = document.getElementById("mainNav");
  const dishGrid     = document.getElementById("dishGrid");
  const filterBtns   = document.querySelectorAll(".filter");
  const orderBar     = document.getElementById("orderBar");
  const orderCount   = document.getElementById("orderCount");
  const orderTotal   = document.getElementById("orderTotal");
  const orderView    = document.getElementById("orderView");
  const orderWA      = document.getElementById("orderWhatsapp");
  const modal        = document.getElementById("orderSheet");
  const overlay      = document.getElementById("sheetOverlay");
  const modalClose   = document.getElementById("sheetClose");
  const orderItems   = document.getElementById("orderItems");
  const sheetTotal   = document.getElementById("sheetTotal");
  const sheetWA      = document.getElementById("sheetWhatsapp");
  const openStatus   = document.getElementById("openStatus");
  const contactForm  = document.getElementById("contactForm");
  const toast        = document.getElementById("toast");
  const yearEl       = document.getElementById("year");

  /* -------------------------------------------------------
     6. Pedido persistente entre páginas
     ------------------------------------------------------- */
  const STORAGE_KEY = "saborpunto_pedido";

  function cargarPedido() {
    try {
      const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return guardado && typeof guardado === "object" ? guardado : {};
    } catch (error) {
      return {};
    }
  }

  const pedido = cargarPedido();
  let toastTimer;

  function guardarPedido() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pedido)); }
    catch (error) { /* almacenamiento no disponible */ }
  }

  function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  /* -------------------------------------------------------
     7. Carta dinámica (solo existe en carta.html)
     ------------------------------------------------------- */
  function renderMenu(filtro = "todo") {
    if (!dishGrid) return;
    const visibles = PLATOS.filter((p) => filtro === "todo" || p.categoria === filtro);

    dishGrid.innerHTML = visibles.map((plato) => `
      <article class="dish" data-id="${plato.id}">
        <img class="dish__img" src="${imgUrl(plato.imagen)}" alt="${plato.nombre}" loading="lazy" />
        <h3 class="dish__name">${plato.nombre}</h3>
        <span class="dish__price">${money.format(plato.precio)}</span>
        <p class="dish__desc">${plato.descripcion}</p>
        <span class="dish__rule" aria-hidden="true"></span>
        <button class="dish__add" type="button" data-add="${plato.id}" aria-label="Agregar ${plato.nombre} al pedido">+</button>
      </article>`).join("");
  }

  renderMenu();

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      renderMenu(btn.dataset.filter);
    });
  });

  /* -------------------------------------------------------
     8. Estado del pedido
     ------------------------------------------------------- */
  function agregar(id) {
    pedido[id] = (pedido[id] || 0) + 1;
    renderPedido();
    mostrarToast(`${PLATOS.find((p) => p.id === id).nombre} se sumó a tu pedido`);
  }

  function cambiarCantidad(id, delta) {
    if (!pedido[id]) return;
    pedido[id] += delta;
    if (pedido[id] <= 0) delete pedido[id];
    renderPedido();
  }

  function resumenPedido() {
    return Object.entries(pedido).map(([id, cantidad]) => ({
      ...PLATOS.find((p) => p.id === id), cantidad
    }));
  }

  function renderPedido() {
    const items = resumenPedido();
    const unidades = items.reduce((s, i) => s + i.cantidad, 0);
    const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

    orderCount.textContent = `${unidades} ${unidades === 1 ? "plato" : "platos"}`;
    orderTotal.textContent = money.format(total);
    sheetTotal.textContent = money.format(total);
    orderBar.classList.toggle("is-visible", items.length > 0);
    guardarPedido();

    document.querySelectorAll("[data-add]").forEach((btn) => {
      const activo = pedido[btn.dataset.add] > 0;
      btn.classList.toggle("is-added", activo);
      btn.textContent = activo ? "✓" : "+";
    });

    if (items.length === 0) {
      orderItems.innerHTML = `<p class="order-empty">Todavía no elegiste nada. ¡Explora la carta!</p>`;
      return;
    }

    orderItems.innerHTML = items.map((item) => `
      <div class="order-item">
        <img src="${imgUrl(item.imagen, 160)}" alt="" />
        <div>
          <div class="order-item__name">${item.nombre}</div>
          <div class="order-item__price">${money.format(item.precio)} c/u</div>
          <div class="order-item__qty">
            <button type="button" data-qty="-1" data-id="${item.id}" aria-label="Quitar ${item.nombre}">−</button>
            <span>${item.cantidad}</span>
            <button type="button" data-qty="1" data-id="${item.id}" aria-label="Agregar ${item.nombre}">+</button>
          </div>
        </div>
        <button class="order-item__remove" type="button" data-remove="${item.id}" aria-label="Eliminar ${item.nombre}">&times;</button>
      </div>`).join("");
  }

  if (dishGrid) {
    dishGrid.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-add]");
      if (btn) agregar(btn.dataset.add);
    });
  }

  orderItems.addEventListener("click", (event) => {
    const qty = event.target.closest("[data-qty]");
    if (qty) { cambiarCantidad(qty.dataset.id, Number(qty.dataset.qty)); return; }
    const remove = event.target.closest("[data-remove]");
    if (remove) { delete pedido[remove.dataset.remove]; renderPedido(); }
  });

  /* -------------------------------------------------------
     9. WhatsApp
     ------------------------------------------------------- */
  function mensajePedido() {
    const items = resumenPedido();
    const lineas = items.map((i) => `• ${i.cantidad}x ${i.nombre} — ${money.format(i.precio * i.cantidad)}`);
    const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    return `¡Hola ${NOMBRE}! Quiero pedir:\n\n${lineas.join("\n")}\n\n*Total: ${money.format(total)}*\n\n¿Lo pueden confirmar? ¡Gracias!`;
  }

  function enviarPedido() {
    if (resumenPedido().length === 0) {
      mostrarToast("Agrega algo a tu pedido primero");
      return;
    }
    window.open(waUrl(mensajePedido()), "_blank", "noopener,noreferrer");
  }

  orderWA.addEventListener("click", enviarPedido);
  sheetWA.addEventListener("click", enviarPedido);

  /* -------------------------------------------------------
     10. Modal centrado
     ------------------------------------------------------- */
  function setModal(open) {
    modal.classList.toggle("is-open", open);
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.toggle("is-visible", open));
    modal.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
    if (!open) {
      overlay.addEventListener("transitionend", () => {
        if (!modal.classList.contains("is-open")) overlay.hidden = true;
      }, { once: true });
      orderView.focus();
    } else {
      modalClose.focus();
    }
  }

  // En carta.html el enlace abre el modal; en las demás va a la carta
  if (PAGINA === "carta") {
    orderView.setAttribute("role", "button");
    orderView.setAttribute("tabindex", "0");
    orderView.addEventListener("click", (event) => { event.preventDefault(); setModal(true); });
    orderView.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setModal(true); }
    });
  }

  modalClose.addEventListener("click", () => setModal(false));
  overlay.addEventListener("click", () => setModal(false));

  /* -------------------------------------------------------
     11. Horarios en vivo (ubicación)
     ------------------------------------------------------- */
  if (openStatus) {
    const HORARIOS = [
      { dias: [1, 2, 3, 4], apertura: 11, cierre: 22 },
      { dias: [5, 6],       apertura: 11, cierre: 23 },
      { dias: [0],          apertura: 11, cierre: 21 }
    ];
    const actualizarEstado = () => {
      const ahora = new Date();
      const dia = HORARIOS.find((h) => h.dias.includes(ahora.getDay()));
      const hora = ahora.getHours() + ahora.getMinutes() / 60;
      const abierto = dia && hora >= dia.apertura && hora < dia.cierre;
      openStatus.textContent = abierto ? "● Abierto ahora" : `● Cerrado · abre a las ${dia ? dia.apertura : 11}:00`;
      openStatus.classList.toggle("is-closed", !abierto);
    };
    actualizarEstado();
    setInterval(actualizarEstado, 60000);
  }

  /* -------------------------------------------------------
     12. Formulario de contacto → WhatsApp
     ------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre  = contactForm.querySelector("#contactoNombre").value.trim();
      const correo  = contactForm.querySelector("#contactoCorreo").value.trim();
      const mensaje = contactForm.querySelector("#contactoMensaje").value.trim();
      const respuesta = document.getElementById("contactoRespuesta");

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
      if (!nombre || !emailValido || !mensaje) {
        respuesta.textContent = "Completa tu nombre, un correo válido y el mensaje.";
        respuesta.className = "form-msg is-error";
        return;
      }

      const texto = `¡Hola ${NOMBRE}! Me escribe ${nombre} (${correo}):\n\n${mensaje}`;
      window.open(waUrl(texto), "_blank", "noopener,noreferrer");
      respuesta.textContent = "¡Listo! Abrimos WhatsApp con tu mensaje.";
      respuesta.className = "form-msg is-success";
      contactForm.reset();
    });
  }

  /* -------------------------------------------------------
     13. Navegación y UI
     ------------------------------------------------------- */
  function setMenu(open) {
    mainNav.classList.toggle("is-open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("is-open")));
  mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (modal.classList.contains("is-open")) setModal(false);
    else if (mainNav.classList.contains("is-open")) setMenu(false);
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  yearEl.textContent = new Date().getFullYear();
  renderPedido();
});
