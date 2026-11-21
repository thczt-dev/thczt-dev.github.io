/* ==========================================================
   ELLA — galería de fotos
   ========================================================== */

(() => {
  "use strict";

  const mosaico = document.getElementById("mosaico");
  const visor = document.getElementById("visor");
  if (!mosaico || !visor) return;

  const datos = typeof DATOS !== "undefined" ? DATOS : {};
  const ratios = ["1", "0.8", "1.2", "0.75", "1", "0.9", "1.1", "0.85"];
  const errores = new Set();

  let fotos = Array.isArray(datos.fotos) ? datos.fotos.filter(Boolean) : [];
  if (!fotos.length) {
    fotos = Array.from({ length: 6 }, (_, i) => ({
      src: "",
      pie: "aquí va una foto",
      ratio: ratios[i % ratios.length],
    }));
  }

  const visorFoto = document.getElementById("visor-foto");
  const visorPie = document.getElementById("visor-pie");
  const visorContador = document.getElementById("visor-contador");
  const visorCerrar = document.getElementById("visor-cerrar");
  const visorAnterior = document.getElementById("visor-anterior");
  const visorSiguiente = document.getElementById("visor-siguiente");
  const conteo = document.getElementById("conteo-fotos");

  let actual = 0;
  let ultimoFoco = null;

  const pad = (n) => String(n).padStart(2, "0");

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

  const ratioDe = (foto, i) => {
    const base = Number.parseFloat(foto.ratio) || Number.parseFloat(ratios[i % ratios.length]) || 1;
    return Math.min(1.55, Math.max(0.62, base));
  };

  const crearPlaceholder = (indice) => {
    const caja = crear("div", "polaroid-sin");
    const estrella = crear("span", "estrella", "☾");
    estrella.setAttribute("aria-hidden", "true");
    const nombre = crear("span", "", `foto ${pad(indice + 1)}`);
    const nota = crear("small", "", "aquí va una foto");
    caja.append(estrella, nombre, nota);
    return caja;
  };

  const actualizarConteo = () => {
    const reales = fotos.reduce((total, foto, i) => total + (foto.src && !errores.has(i) ? 1 : 0), 0);
    if (!conteo) return;
    conteo.textContent = reales
      ? `${reales} fotico${reales === 1 ? "" : "s"} (por ahora)`
      : `${fotos.length} espacios libres`;
  };

  /* ---------- Construir el mural ---------- */

  const pintarMural = () => {
    mosaico.innerHTML = "";

    fotos.forEach((foto, i) => {
      const pie = foto.pie || "";
      const ratio = ratioDe(foto, i);
      const giro = (i % 2 === 0 ? -1 : 1) * (0.4 + (i % 3) * 0.4);

      const figura = crear("figure", "polaroid");
      figura.style.setProperty("--giro", giro.toFixed(2) + "deg");
      figura.style.setProperty("--ratio", String(ratio));
      figura.setAttribute("data-anima", "");

      const boton = crear("button", "");
      boton.type = "button";
      boton.setAttribute(
        "aria-label",
        pie ? `Ampliar foto ${romano(i + 1)}: ${pie}` : `Ampliar foto ${romano(i + 1)}`
      );

      const marco = crear("div", "polaroid-foto");

      if (foto.src && !errores.has(i)) {
        const img = document.createElement("img");
        img.src = foto.src;
        img.alt = pie || `Foto ${romano(i + 1)}`;
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("error", () => {
          errores.add(i);
          img.remove();
          marco.appendChild(crearPlaceholder(i));
          actualizarConteo();
          if (!visor.hidden && actual === i) renderVisor(i);
        });
        marco.appendChild(img);
      } else {
        marco.appendChild(crearPlaceholder(i));
      }

      boton.appendChild(marco);
      boton.addEventListener("click", () => abrirVisor(i));

      const caption = document.createElement("figcaption");
      const num = crear("span", "num", romano(i + 1));
      if (pie) caption.append(crear("span", "", pie), num);
      else caption.append(num);

      figura.append(boton, caption);
      mosaico.appendChild(figura);
    });

    // Aparición suave de los marcos
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        });
      }, { threshold: .08 });

      mosaico.querySelectorAll("[data-anima]").forEach((nodo, i) => {
        nodo.style.transitionDelay = (i % 3) * 60 + "ms";
        observador.observe(nodo);
      });
    } else {
      mosaico.querySelectorAll("[data-anima]").forEach((nodo) => nodo.classList.add("visible"));
    }

    actualizarConteo();
  };

  /* ---------- Visor ---------- */

  const renderVisor = (i) => {
    const foto = fotos[i];
    if (!foto) return;

    const reducirMov = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const aplicar = () => {
      actual = i;
      const pie = foto.pie || "";

      visorPie.textContent = pie;
      visorContador.textContent = `${romano(i + 1)} / ${romano(fotos.length)}`;
      visorFoto.innerHTML = "";

      if (foto.src && !errores.has(i)) {
        const img = document.createElement("img");
        img.src = foto.src;
        img.alt = pie || `Foto ${romano(i + 1)}`;
        img.addEventListener("error", () => {
          errores.add(i);
          renderVisor(i);
          actualizarConteo();
        });
        visorFoto.appendChild(img);
      } else {
        visorFoto.appendChild(crearPlaceholder(i));
      }

      const unica = fotos.length <= 1;
      if (visorAnterior) visorAnterior.disabled = unica;
      if (visorSiguiente) visorSiguiente.disabled = unica;
    };

    if (reducirMov || !visorFoto.children.length) {
      aplicar();
      return;
    }

    visorFoto.classList.add("saliendo");
    setTimeout(() => {
      aplicar();
      visorFoto.classList.remove("saliendo");
    }, 180);
  };

  const abrirVisor = (i) => {
    renderVisor(i);
    ultimoFoco = document.activeElement;
    visor.hidden = false;
    document.body.classList.add("sin-scroll");
    requestAnimationFrame(() => visorCerrar.focus());
  };

  const cerrarVisor = () => {
    visor.hidden = true;
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco && typeof ultimoFoco.focus === "function") ultimoFoco.focus();
  };

  const mover = (paso) => {
    if (fotos.length < 2) return;
    renderVisor((actual + paso + fotos.length) % fotos.length);
  };

  visorCerrar.addEventListener("click", cerrarVisor);
  visorAnterior.addEventListener("click", () => mover(-1));
  visorSiguiente.addEventListener("click", () => mover(1));
  visor.querySelectorAll("[data-cerrar-visor]").forEach((nodo) => nodo.addEventListener("click", cerrarVisor));

  document.addEventListener("keydown", (e) => {
    if (visor.hidden) return;
    if (e.key === "Escape") cerrarVisor();
    if (e.key === "ArrowLeft") mover(-1);
    if (e.key === "ArrowRight") mover(1);
  });

  visor.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const enfocables = Array.from(visor.querySelectorAll("button:not(:disabled)"))
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

  /* ---------- Swipe en el visor (móvil) ---------- */
  let toqueInicio = null;
  visor.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    toqueInicio = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  visor.addEventListener("touchend", (e) => {
    if (!toqueInicio || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - toqueInicio.x;
    const dy = e.changedTouches[0].clientY - toqueInicio.y;
    toqueInicio = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) mover(1);
    else mover(-1);
  }, { passive: true });

  /* ---------- Volver arriba ---------- */
  const volverArriba = document.querySelector(".volver-arriba");
  if (volverArriba) {
    window.addEventListener("scroll", () => {
      volverArriba.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    volverArriba.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  pintarMural();
})();
