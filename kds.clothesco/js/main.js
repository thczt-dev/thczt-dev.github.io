/* =========================================================
   NKS │ STREETWEAR — Demo ficticia · Interacciones
   Autor: Diego Alejandro Tellez Tellez (thc.dev)
   JavaScript vanilla, sin dependencias.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -------------------------------------------------------
     1. Referencias al DOM
     ------------------------------------------------------- */
  const header       = document.getElementById("siteHeader");
  const menuToggle   = document.getElementById("menuToggle");
  const mainNav      = document.getElementById("mainNav");
  const cartToggle   = document.getElementById("cartToggle");
  const cartClose    = document.getElementById("cartClose");
  const cartDrawer   = document.getElementById("cartDrawer");
  const cartOverlay  = document.getElementById("cartOverlay");
  const cartItemsEl  = document.getElementById("cartItems");
  const cartCountEl  = document.getElementById("cartCount");
  const cartCountTxt = document.getElementById("cartItemsCount");
  const cartTotalEl  = document.getElementById("cartTotal");
  const checkoutBtn  = document.getElementById("checkoutBtn");
  const filterBtns   = document.querySelectorAll(".filter");
  const products     = document.querySelectorAll(".product-card");
  const noResults    = document.getElementById("noResults");
  const newsletter   = document.getElementById("newsletterForm");
  const formMsg      = document.getElementById("formMsg");
  const toast        = document.getElementById("toast");
  const yearEl       = document.getElementById("year");

  // Formateador de moneda colombiana: 79000 -> "$ 79.000"
  const money = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });

  // El carrito se guarda en memoria: { nombre: { name, price, image, qty } }
  const cart = {};

  let toastTimer;

  /* -------------------------------------------------------
     2. Header: sombra al hacer scroll
     ------------------------------------------------------- */
  function handleHeaderScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }
  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  /* -------------------------------------------------------
     3. Menú móvil
     ------------------------------------------------------- */
  function setMenu(open) {
    mainNav.classList.toggle("is-open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  menuToggle.addEventListener("click", () => {
    setMenu(!mainNav.classList.contains("is-open"));
  });

  // Cerrar el menú al tocar un enlace
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  /* -------------------------------------------------------
     4. Carrito: abrir / cerrar
     ------------------------------------------------------- */
  function setCart(open) {
    cartDrawer.classList.toggle("is-open", open);
    cartOverlay.hidden = false;
    // Pequeño retraso para que la transición de opacity se vea
    requestAnimationFrame(() => cartOverlay.classList.toggle("is-visible", open));
    cartDrawer.setAttribute("aria-hidden", String(!open));
    cartToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);

    if (!open) {
      cartOverlay.addEventListener("transitionend", () => {
        if (!cartDrawer.classList.contains("is-open")) cartOverlay.hidden = true;
      }, { once: true });
    }

    if (open) {
      cartClose.focus();
    } else {
      cartToggle.focus();
    }
  }

  cartToggle.addEventListener("click", () => setCart(true));
  cartClose.addEventListener("click", () => setCart(false));
  cartOverlay.addEventListener("click", () => setCart(false));

  // Tecla Escape cierra carrito o menú
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (cartDrawer.classList.contains("is-open")) setCart(false);
    else if (mainNav.classList.contains("is-open")) setMenu(false);
  });

  /* -------------------------------------------------------
     5. Carrito: agregar, cambiar cantidad, eliminar
     ------------------------------------------------------- */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function addToCart(product) {
    const { name, price, image } = product.dataset;
    if (cart[name]) {
      cart[name].qty += 1;
    } else {
      cart[name] = { name, price: Number(price), image, qty: 1 };
    }
    renderCart();
    showToast(`${name} agregado al carrito`);
  }

  function updateQty(name, delta) {
    if (!cart[name]) return;
    cart[name].qty += delta;
    if (cart[name].qty <= 0) delete cart[name];
    renderCart();
  }

  function renderCart() {
    const items = Object.values(cart);
    const totalQty  = items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartCountEl.textContent  = totalQty;
    cartCountTxt.textContent = `(${totalQty})`;
    cartTotalEl.textContent  = money.format(totalPrice);
    checkoutBtn.disabled     = items.length === 0;
    checkoutBtn.style.opacity = items.length === 0 ? "0.5" : "1";

    if (items.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="cart-empty">
          <span aria-hidden="true">◯</span>
          <p>Tu carrito está vacío.</p>
          <small>¡Explora el catálogo y encuentra tu próxima prenda favorita!</small>
        </div>`;
      return;
    }

    cartItemsEl.innerHTML = items.map((item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="" />
        <div>
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">${money.format(item.price)}</div>
          <div class="cart-item__qty">
            <button type="button" data-qty="-1" data-name="${item.name.replace(/"/g, "&quot;")}" aria-label="Quitar una unidad de ${item.name}">−</button>
            <span>${item.qty}</span>
            <button type="button" data-qty="1" data-name="${item.name.replace(/"/g, "&quot;")}" aria-label="Agregar una unidad de ${item.name}">+</button>
          </div>
        </div>
        <button class="cart-item__remove" type="button" data-remove="${item.name.replace(/"/g, "&quot;")}" aria-label="Eliminar ${item.name} del carrito">&times;</button>
      </div>
    `).join("");
  }

  // Delegación de eventos: escuchamos los botones dentro del carrito
  cartItemsEl.addEventListener("click", (event) => {
    const qtyBtn = event.target.closest("[data-qty]");
    if (qtyBtn) {
      updateQty(qtyBtn.dataset.name, Number(qtyBtn.dataset.qty));
      return;
    }
    const removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) {
      delete cart[removeBtn.dataset.remove];
      renderCart();
      showToast("Producto eliminado del carrito");
    }
  });

  // Botones "+" de cada tarjeta
  products.forEach((card) => {
    const btn = card.querySelector("[data-add-to-cart]");
    btn.addEventListener("click", () => addToCart(card));
  });

  checkoutBtn.addEventListener("click", () => {
    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
    showToast(`Pedido de ${money.format(total)} listo (demo)`);
  });

  renderCart(); // estado inicial

  /* -------------------------------------------------------
     6. Filtros del catálogo
     ------------------------------------------------------- */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      let visibleCount = 0;

      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      products.forEach((card) => {
        const match = filter === "todo" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
        if (match) visibleCount++;
      });

      noResults.hidden = visibleCount > 0;
    });
  });

  /* -------------------------------------------------------
     7. Formulario de suscripción (validación sencilla)
     ------------------------------------------------------- */
  newsletter.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const value = emailInput.value.trim();
    // Expresión regular básica para correo
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    formMsg.className = "form-msg";
    emailInput.classList.remove("is-invalid");

    if (!isValid) {
      emailInput.classList.add("is-invalid");
      formMsg.textContent = "Por favor ingresa un correo válido.";
      formMsg.classList.add("is-error");
      emailInput.focus();
      return;
    }

    formMsg.textContent = "¡Listo! Ya estás en la lista del drop.";
    formMsg.classList.add("is-success");
    emailInput.value = "";
    showToast("¡Suscripción confirmada!");
  });

  /* -------------------------------------------------------
     8. Animaciones al hacer scroll (IntersectionObserver)
     ------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // se anima una sola vez
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    // Pequeño escalonamiento visual entre tarjetas hermanas
    revealElements.forEach((el, index) => {
      el.style.transitionDelay = `${(index % 4) * 70}ms`;
      observer.observe(el);
    });
  } else {
    // Navegadores muy antiguos: mostrar todo directamente
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* -------------------------------------------------------
     9. Resaltar enlace activo del menú según la sección
     ------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = mainNav.querySelectorAll("a");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.35 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* -------------------------------------------------------
     10. Año dinámico en el footer
     ------------------------------------------------------- */
  yearEl.textContent = new Date().getFullYear();
});
