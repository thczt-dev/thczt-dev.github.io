/* ==========================================================
   ELLA — tocadiscos + audio local (aleatorio)
   El tocadiscos suena con las pistas de js/canciones.js.
   ========================================================== */

(() => {
  "use strict";

  const audio = document.getElementById("audio-local");
  const btnPlay = document.getElementById("btn-play");
  const btnAnterior = document.getElementById("btn-anterior");
  const btnSiguiente = document.getElementById("btn-siguiente");
  const estadoTexto = document.getElementById("estado-texto");
  const textoEstado = document.getElementById("texto-estado");
  const pistaSub = document.getElementById("pista-sub");
  const barra = document.getElementById("barra-progreso");
  const progreso = document.getElementById("progreso");
  const tiempoActual = document.getElementById("tiempo-actual");
  const tiempoTotal = document.getElementById("tiempo-total");
  const nota = document.getElementById("nota-conexion");
  const vacio = document.getElementById("spotify-vacio");
  const pistaNombre = document.querySelector(".pista-nombre");

  if (!audio) return;

  /* ---------- Lista de canciones (aleatoria) ---------- */
  const originales = (typeof CANCIONES !== "undefined" && Array.isArray(CANCIONES))
    ? CANCIONES.slice()
    : [];

  // Fisher-Yates
  const mezclar = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  let lista = mezclar(originales);
  let actual = 0;

  /* ---------- Helpers ---------- */
  const formato = (seg) => {
    seg = Math.max(0, Math.floor(seg || 0));
    return Math.floor(seg / 60) + ":" + String(seg % 60).padStart(2, "0");
  };

  const nombreLimpio = (ruta) => {
    let n = String(ruta).split("/").pop() || "";
    n = n.replace(/\.mp3$/i, "");
    n = n.replace(/^\d+\.\s*/, "");
    n = n.replace(/^pista-/i, "pista ");
    return n.trim() || "pista";
  };

  const setEstado = (t) => {
    if (estadoTexto) estadoTexto.textContent = t;
    if (textoEstado) textoEstado.textContent = t;
  };

  const setNota = (t) => { if (nota) nota.textContent = t; };

  const marcarSonando = (activo) => {
    document.body.classList.toggle("sonando", activo);
    if (btnPlay) btnPlay.setAttribute("aria-label", activo ? "Pausar" : "Reproducir");
  };

  const actualizarTiempos = () => {
    const dur = audio.duration || 0;
    const pos = audio.currentTime || 0;
    const pct = dur > 0 ? Math.min(100, (pos / dur) * 100) : 0;
    if (barra) barra.style.width = pct.toFixed(2) + "%";
    if (progreso) progreso.setAttribute("aria-valuenow", Math.round(pct));
    if (tiempoActual) tiempoActual.textContent = formato(pos);
    if (tiempoTotal) tiempoTotal.textContent = formato(dur);
  };

  const cargar = (i) => {
    if (!lista.length) return;
    actual = ((i % lista.length) + lista.length) % lista.length;
    const ruta = lista[actual];
    audio.src = encodeURI(ruta);
    audio.load();
    if (pistaNombre) pistaNombre.textContent = nombreLimpio(ruta);
    if (pistaSub) pistaSub.textContent = (actual + 1) + " / " + lista.length;
    actualizarTiempos();
    setEstado("en pausa");
    marcarSonando(false);
  };

  const reproducir = () => {
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => { setEstado("reproduciendo"); marcarSonando(true); })
       .catch(() => { setEstado("en pausa"); setNota("Toca la página para permitir el audio."); });
    } else {
      setEstado("reproduciendo"); marcarSonando(true);
    }
  };

  const pausar = () => { audio.pause(); setEstado("en pausa"); marcarSonando(false); };

  const toggle = () => { audio.paused ? reproducir() : pausar(); };

  const siguiente = () => { cargar(actual + 1); reproducir(); };
  const anterior = () => { cargar(actual - 1); reproducir(); };

  /* ---------- Eventos del audio ---------- */
  audio.addEventListener("timeupdate", actualizarTiempos);
  audio.addEventListener("loadedmetadata", actualizarTiempos);
  audio.addEventListener("ended", () => { siguiente(); });
  audio.addEventListener("error", () => {
    setNota("No se pudo cargar la canción. Revisa la carpeta musica/.");
    setEstado("sin conexión");
  });

  /* ---------- Botones ---------- */
  if (btnPlay) btnPlay.addEventListener("click", toggle);
  if (btnAnterior) btnAnterior.addEventListener("click", anterior);
  if (btnSiguiente) btnSiguiente.addEventListener("click", siguiente);

  /* ---------- Inicio ---------- */
  if (!lista.length) {
    setEstado("sin canciones");
    setNota("No hay canciones. Revisa js/canciones.js.");
    if (btnPlay) btnPlay.disabled = true;
    if (btnAnterior) btnAnterior.disabled = true;
    if (btnSiguiente) btnSiguiente.disabled = true;
    return;
  }

  if (vacio) vacio.hidden = true;
  if (btnAnterior) btnAnterior.disabled = false;
  if (btnSiguiente) btnSiguiente.disabled = false;
  cargar(0);
  setNota("Dale play y sube el volumen. Las canciones suenan en aleatorio.");
  setEstado("en pausa");
  if (pistaSub && !pistaSub.textContent.trim()) pistaSub.textContent = "listo para sonar";
})();
