/* ==========================================================
   ELLA — cartas digitales
   ========================================================== */

(() => {
  "use strict";

  const grid = document.getElementById("cartas-grid");
  const modal = document.getElementById("modal-carta");
  if (!grid || !modal) return;

  const datos = typeof DATOS !== "undefined" ? DATOS : { cartas: [] };
  const cartas = Array.isArray(datos.cartas) ? datos.cartas : [];

  const elTitulo = document.getElementById("carta-titulo");
  const elFecha = document.getElementById("carta-fecha");
  const elTexto = document.getElementById("carta-texto");
  const elFirma = document.getElementById("carta-firma");
  const elContador = document.getElementById("carta-contador");
  const btnCerrar = modal.querySelector(".modal-cerrar");
  const btnAnterior = document.getElementById("carta-anterior");
  const btnSiguiente = document.getElementById("carta-siguiente");

  let actual = 0;
  let ultimoFoco = null;

  const romano = (num) => {
    const tabla = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];
    let n = Math.max(1, Math.floor(num));
    let salida = "";
    for (const [valor, letra] of tabla) {
      while (n >= valor) {
        salida += letra;
        n -= valor;
      }
    }
    return salida;
  };

  const crear = (etiqueta, clase, texto) => {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  };

  /* ---------- Construir los sobres ---------- */

  const pintarSobres = () => {
    grid.innerHTML = "";

    if (!cartas.length) {
      const aviso = crear("p", "texto-intro", "Todavía no hay cartas. Se agregan en js/datos.js ♡");
      grid.appendChild(aviso);
      return;
    }

    cartas.forEach((carta, i) => {
      const boton = crear("button", "carta-mini");
      boton.type = "button";
      boton.style.setProperty("--giro", ((i % 2 === 0 ? -1 : 1) * (0.35 + (i % 3) * 0.45)).toFixed(2) + "deg");
      boton.setAttribute("aria-label", `Abrir carta: ${carta.titulo || "carta " + (i + 1)}`);
      boton.dataset.indice = String(i);
      boton.setAttribute("data-anima", "");

      const estampilla = crear("span", "estampilla", "✦");
      estampilla.setAttribute("aria-hidden", "true");

      const num = crear("p", "carta-num", `carta ${romano(i + 1)}`);
      const titulo = crear("h2", "", carta.titulo || "Carta para ti");
      const resumen = crear("p", "", carta.resumen || "Ábreme cuando quieras.");
      const abrir = crear("span", "carta-abrir");
      abrir.appendChild(crear("span", "", "abrir carta"));
      abrir.appendChild(crear("span", "", "→"));

      const sello = crear("span", "sello-cera", "♡");
      sello.setAttribute("aria-hidden", "true");

      boton.append(estampilla, num, titulo, resumen, abrir, sello);
      boton.addEventListener("click", () => abrirCarta(i));
      grid.appendChild(boton);
    });

    // animación de aparición para los sobres recién creados
    if ("IntersectionObserver" in window) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        });
      }, { threshold: .1 });

      grid.querySelectorAll("[data-anima]").forEach((nodo, i) => {
        nodo.style.transitionDelay = (i % 3) * 60 + "ms";
        observador.observe(nodo);
      });
    } else {
      grid.querySelectorAll("[data-anima]").forEach((nodo) => nodo.classList.add("visible"));
    }
  };

  /* ---------- Abrir / pintar carta ---------- */

  const pintarCarta = (i) => {
    const carta = cartas[i];
    if (!carta) return;

    actual = i;
    elTitulo.textContent = carta.titulo || "Carta para ti";
    elFecha.textContent = carta.fecha || `carta ${romano(i + 1)}`;
    elFirma.textContent = carta.firma || "yo :3";
    elContador.textContent = `${romano(i + 1)} / ${romano(cartas.length)}`;

    elTexto.innerHTML = "";
    const parrafos = String(carta.texto || "").split(/\n\s*\n/);
    parrafos.forEach((texto) => {
      const parrafo = document.createElement("p");
      parrafo.textContent = texto.trim();
      elTexto.appendChild(parrafo);
    });

    const unica = cartas.length <= 1;
    btnAnterior.disabled = unica;
    btnSiguiente.disabled = unica;

    if (!modal.hidden) {
      const papel = modal.querySelector(".carta-papel");
      if (papel) papel.scrollTop = 0;
    }
  };

  const abrirCarta = (i) => {
    pintarCarta(i);
    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("sin-scroll");
    requestAnimationFrame(() => btnCerrar.focus());
  };

  const cerrarCarta = () => {
    modal.hidden = true;
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco && typeof ultimoFoco.focus === "function") ultimoFoco.focus();
  };

  const mover = (paso) => {
    if (!cartas.length) return;
    const siguiente = (actual + paso + cartas.length) % cartas.length;
    pintarCarta(siguiente);
  };

  btnAnterior.addEventListener("click", () => mover(-1));
  btnSiguiente.addEventListener("click", () => mover(1));
  modal.querySelectorAll("[data-cerrar]").forEach((nodo) => nodo.addEventListener("click", cerrarCarta));

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") cerrarCarta();
    if (e.key === "ArrowLeft") mover(-1);
    if (e.key === "ArrowRight") mover(1);
  });

  // Evitar que el tabulador se escape del modal abierto.
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const enfocables = Array.from(modal.querySelectorAll("button:not(:disabled), [href], input, [tabindex]:not([tabindex='-1'])"))
      .filter((nodo) => nodo.offsetParent !== null);
    if (!enfocables.length) return;

    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];

    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  });

  pintarSobres();
})();
