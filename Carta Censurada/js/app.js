/* ==========================================================
   ELLA — funciones compartidas
   ========================================================== */

(() => {
  "use strict";

  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Cielo de estrellas ---------- */

  const lienzo = document.getElementById("estrellas");

  if (lienzo) {
    const ctx = lienzo.getContext("2d");
    let ancho = 0;
    let alto = 0;
    let dpr = 1;
    let estrellas = [];
    let meteoros = [];
    let frame = null;
    let ultimo = 0;

    const crearEstrella = () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: Math.random() * 1.1 + .25,
      base: Math.random() * .45 + .22,
      fase: Math.random() * Math.PI * 2,
      vel: Math.random() * .7 + .2,
    });

    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = window.innerWidth;
      alto = window.innerHeight;
      lienzo.width = Math.floor(ancho * dpr);
      lienzo.height = Math.floor(alto * dpr);
      lienzo.style.width = ancho + "px";
      lienzo.style.height = alto + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cantidad = Math.min(window.innerWidth < 500 ? 60 : 150, Math.round((ancho * alto) / 14000));
      estrellas = Array.from({ length: cantidad }, crearEstrella);
    };

    const dibujarEstrellas = (t) => {
      ctx.clearRect(0, 0, ancho, alto);

      for (const e of estrellas) {
        const alfa = Math.max(.06, e.base + Math.sin(t * .001 * e.vel + e.fase) * .3);
        ctx.beginPath();
        ctx.fillStyle = `rgba(198, 214, 236, ${alfa.toFixed(3)})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = meteoros.length - 1; i >= 0; i--) {
        const m = meteoros[i];
        m.x += m.vx;
        m.y += m.vy;
        m.vida -= .014;

        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
        grad.addColorStop(0, `rgba(210, 226, 246, ${Math.max(0, m.vida).toFixed(2)})`);
        grad.addColorStop(1, "rgba(80, 120, 180, 0)");

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
        ctx.stroke();

        if (m.vida <= 0 || m.x < -80 || m.y > alto + 80) meteoros.splice(i, 1);
      }
    };

    const animar = (t) => {
      if (!ultimo) ultimo = t;
      ultimo = t;

      if (!reducir && Math.random() < (window.innerWidth < 500 ? .0008 : .0022) && meteoros.length < 2) {
        meteoros.push({
          x: Math.random() * ancho * .85 + ancho * .1,
          y: Math.random() * alto * .4,
          vx: -(3.4 + Math.random() * 3.4),
          vy: 1.8 + Math.random() * 1.8,
          vida: 1,
        });
      }
      dibujarEstrellas(t);
      frame = requestAnimationFrame(animar);
    };

    medir();

    if (reducir) {
      dibujarEstrellas(0);
    } else {
      frame = requestAnimationFrame(animar);
    }

    let temporizador;
    window.addEventListener("resize", () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        medir();
        if (reducir) dibujarEstrellas(0);
      }, 160);
    });

    document.addEventListener("visibilitychange", () => {
      if (reducir) return;
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = null;
      } else if (!frame) {
        ultimo = 0;
        frame = requestAnimationFrame(animar);
      }
    });
  }

  /* ---------- Año del pie ---------- */

  document.querySelectorAll("[data-anio]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Contador de días juntos ---------- */
  document.querySelectorAll(".dias-juntos").forEach((el) => {
    const inicio = el.getAttribute("data-inicio");
    if (!inicio) return;
    const desde = new Date(inicio);
    const actualizar = () => {
      const hoy = new Date();
      if (hoy < desde) {
        el.textContent = "faltan " + Math.ceil((desde - hoy) / 1000) + " s para el gran día";
        return;
      }
      let y = hoy.getFullYear() - desde.getFullYear();
      let m = hoy.getMonth() - desde.getMonth();
      let d = hoy.getDate() - desde.getDate();
      let h = hoy.getHours() - desde.getHours();
      let min = hoy.getMinutes() - desde.getMinutes();
      let sec = hoy.getSeconds() - desde.getSeconds();
      if (sec < 0) { sec += 60; min -= 1; }
      if (min < 0) { min += 60; h -= 1; }
      if (h < 0) { h += 24; d -= 1; }
      if (d < 0) {
        const diasMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
        d += diasMesAnterior;
        m -= 1;
      }
      if (m < 0) { m += 12; y -= 1; }
      const meses = y * 12 + m;
      el.textContent =
        "llevamos " + meses + " mes" + (meses === 1 ? "" : "es") + ", " +
        d + " día" + (d === 1 ? "" : "s") + ", " +
        h + " hora" + (h === 1 ? "" : "s") + ", " +
        min + " minuto" + (min === 1 ? "" : "s") + " y " +
        sec + " segundo" + (sec === 1 ? "" : "s") + " juntos ♡";
    };
    actualizar();
    setInterval(actualizar, 1000);
  });

  /* ---------- Aparición de elementos ---------- */

  const animados = document.querySelectorAll("[data-anima]");

  if (!animados.length) {
    // nada
  } else if (reducir || !("IntersectionObserver" in window)) {
    animados.forEach((el) => el.classList.add("visible"));
  } else {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        });
      },
      { threshold: .12, rootMargin: "0px 0px -40px 0px" }
    );

    animados.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 70 + "ms";
      observador.observe(el);
    });
  }

  /* ---------- Mensaje sorpresa ---------- */

  /* ---------- Mensajes del botón ✦ ---------- */
  const frases = [
    "ps no sé q decir, así que hola :3",
    "se me ocurrió escribirte y ya jsjs",
    "esta página quedó más cursi de lo esperado :3",
    "no sé programar bien, pero lo intenté jsjs",
    "gracias por leerme hasta aquí ♡",
    "un mensaje al azar, como las canciones ✦",
    "si esto apareció, fue el botón ✦, no yo jsjs",
    "sin poesía: eres genial :3",
    "aquí ando, inventando frases para ELLA",
    "no sé q poner, pero que tengas buen día",
    "esto fue lo único q se me ocurrió jsjs",
    "va un abrazo en forma de estrella ✦",
    "si te aburres, vuelve a pulsar ✦",
    "mi persona favorita, sin competencia :3",
    "fin del mensaje, vuelve cuando quieras",
  ];

  const botonSuerte = document.querySelector("[data-suerte]");

  if (botonSuerte) {
    let indice = Math.floor(Math.random() * frases.length);
    let temporizadorBrindis = null;

    const brindis = document.createElement("div");
    brindis.className = "brindis";
    brindis.setAttribute("role", "status");
    brindis.setAttribute("aria-live", "polite");
    brindis.innerHTML = '<span class="brindis-estrella">✦ un mensaje para ELLA ✦</span><span class="brindis-texto"></span>';
    document.body.appendChild(brindis);
    const textoBrindis = brindis.querySelector(".brindis-texto");

    botonSuerte.addEventListener("click", () => {
      indice = (indice + 1 + Math.floor(Math.random() * (frases.length - 1))) % frases.length;
      textoBrindis.textContent = frases[indice];

      clearTimeout(temporizadorBrindis);
      brindis.classList.add("visible");
      temporizadorBrindis = setTimeout(() => brindis.classList.remove("visible"), 5200);

      if (!reducir) {
        for (let i = 0; i < 10; i++) {
          const chispa = document.createElement("span");
          chispa.className = "chispa";
          chispa.textContent = "✦";
          chispa.style.left = (window.innerWidth - 60) + "px";
          chispa.style.top = (window.innerHeight - 60) + "px";
          chispa.style.fontSize = 8 + Math.random() * 10 + "px";
          chispa.style.animationDuration = .7 + Math.random() * .6 + "s";
          chispa.style.setProperty("--dx", (Math.random() * 180 - 150) + "px");
          chispa.style.setProperty("--dy", (-Math.random() * 120) + "px");
          document.body.appendChild(chispa);
          setTimeout(() => chispa.remove(), 1400);
        }
      }
    });
  }
})();
