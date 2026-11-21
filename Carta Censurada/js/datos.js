/* ==========================================================
   ELLA — CONTENIDO DEL SITIO
   Cartas, fotos y detalles de la página.
   ========================================================== */

const DATOS = {
  nombre: "ELLA",
  playlist: "",

  cartas: [
    {
      titulo: "ábreme cuando estés feliz :D",
      fecha: "carta I",
      resumen: "xq tan feliz??? jsjs",
      firma: "yo :3",
      texto: `Xq tan feliz??? Se nota hasta acá jsjs.

No preguntes nada, solo disfrútalo. Y si te acuerdas de quien te escribió, mejor.`,
    },
    {
      titulo: "ábreme cuando me extrañes jsjs",
      fecha: "carta II",
      resumen: "por si le hace falta una carta",
      firma: "tu persona favorita :>",
      texto: `Oiga, cómo así que me extrañas jsjs.

Aquí ando, escribiéndote cosas raras para que no te aburras. Si algún día hace falta una palabra, ahí va esta.`,
    },
    {
      titulo: "ábreme sin motivo",
      fecha: "carta III",
      resumen: "la más larga, no me juzgues",
      firma: "alguien q no sabe escribir :3",
      texto: `Hay cosas q no se dicen bien en voz alta y por eso se dejan escritas.

No busques un sentido escondido: quería dejar algo aquí y ya.

Si algún día vuelves a leerla, que te saque una sonrisa aunque sea.`,
    },
    {
      titulo: "ábreme antes de dormir",
      fecha: "carta IV",
      resumen: "para el final del día",
      firma: "quien te piensa :3",
      texto: `Que el día termine despacio.

Y que mañana tenga algo bueno, aunque sea pequeñito.`,
    },
    {
      titulo: "ábreme cuando dudes",
      fecha: "carta V",
      resumen: "una frase no más",
      firma: "✦",
      texto: `No hay q probar nada.

Con que esté escrito, ya es suficiente.`,
    },
    {
      titulo: "próximamente jsjs",
      fecha: "carta VI",
      resumen: "algún día",
      firma: "yo :3",
      texto: `Quedan más líneas para cuando haga sentido.

Hoy solo hay lugar para esto.`,
    },
  ],

  fotos: [
    { src: "fotos/web/01.webp", pie: "un instante cualquiera", ratio: "1.334" },
    { src: "fotos/web/02.webp", pie: "se ve bonito igual ✦", ratio: "0.562" },
    { src: "fotos/web/03.webp", pie: "de esos días q no se olvidan", ratio: "1.000" },
    { src: "fotos/web/04.webp", pie: "pixelado, pero cuenta igual", ratio: "0.750" },
    { src: "fotos/web/05.webp", pie: "foto del montón :3", ratio: "1.333" },
    { src: "fotos/web/06.webp", pie: "no se ve nada y aún así me gusta", ratio: "1.333" },
    { src: "fotos/web/07.webp", pie: "otro recuerdo más ✦", ratio: "0.562" },
    { src: "fotos/web/08.webp", pie: "esa tarde jsjs", ratio: "1.333" },
    { src: "fotos/web/09.webp", pie: "color y nada más", ratio: "0.562" },
    { src: "fotos/web/10.webp", pie: "guardadito aquí ♡", ratio: "0.562" },
    { src: "fotos/web/11.webp", pie: "no preguntes jsjs", ratio: "1.333" },
    { src: "fotos/web/12.webp", pie: "parte de la colección ✦", ratio: "1.334" },
    { src: "fotos/web/13.webp", pie: "un instante cualquiera", ratio: "0.562" },
    { src: "fotos/web/14.webp", pie: "se ve bonito igual ✦", ratio: "1.333" },
    { src: "fotos/web/15.webp", pie: "de esos días q no se olvidan", ratio: "1.334" },
    { src: "fotos/web/16.webp", pie: "pixelado, pero cuenta igual", ratio: "0.750" },
    { src: "fotos/web/17.webp", pie: "foto del montón :3", ratio: "0.562" },
    { src: "fotos/web/18.webp", pie: "no se ve nada y aún así me gusta", ratio: "0.562" },
    { src: "fotos/web/19.webp", pie: "otro recuerdo más ✦", ratio: "1.334" },
    { src: "fotos/web/20.webp", pie: "esa tarde jsjs", ratio: "4.538" },
    { src: "fotos/web/21.webp", pie: "color y nada más", ratio: "0.562" },
    { src: "fotos/web/22.webp", pie: "guardadito aquí ♡", ratio: "0.750" },
    { src: "fotos/web/23.webp", pie: "no preguntes jsjs", ratio: "1.333" },
    { src: "fotos/web/24.webp", pie: "parte de la colección ✦", ratio: "0.562" },
    { src: "fotos/web/25.webp", pie: "un instante cualquiera", ratio: "0.967" },
    { src: "fotos/web/26.webp", pie: "se ve bonito igual ✦", ratio: "0.791" },
    { src: "fotos/web/27.webp", pie: "de esos días q no se olvidan", ratio: "1.334" },
    { src: "fotos/web/28.webp", pie: "pixelado, pero cuenta igual", ratio: "0.750" },
    { src: "fotos/web/29.webp", pie: "foto del montón :3", ratio: "1.333" },
    { src: "fotos/web/30.webp", pie: "no se ve nada y aún así me gusta", ratio: "1.333" },
    { src: "fotos/web/31.webp", pie: "otro recuerdo más ✦", ratio: "0.864" },
    { src: "fotos/web/32.webp", pie: "esa tarde jsjs", ratio: "1.333" },
    { src: "fotos/web/33.webp", pie: "color y nada más", ratio: "0.562" },
    { src: "fotos/web/34.webp", pie: "guardadito aquí ♡", ratio: "0.750" },
    { src: "fotos/web/35.webp", pie: "no preguntes jsjs", ratio: "1.334" },
    { src: "fotos/web/36.webp", pie: "parte de la colección ✦", ratio: "0.750" },
    { src: "fotos/web/37.webp", pie: "un instante cualquiera", ratio: "1.334" },
    { src: "fotos/web/38.webp", pie: "se ve bonito igual ✦", ratio: "0.562" },
    { src: "fotos/web/39.webp", pie: "de esos días q no se olvidan", ratio: "0.562" },
    { src: "fotos/web/40.webp", pie: "pixelado, pero cuenta igual", ratio: "1.334" },
    { src: "fotos/web/41.webp", pie: "foto del montón :3", ratio: "0.562" },
    { src: "fotos/web/42.webp", pie: "no se ve nada y aún así me gusta", ratio: "0.562" },
    { src: "fotos/web/43.webp", pie: "otro recuerdo más ✦", ratio: "1.333" },
    { src: "fotos/web/44.webp", pie: "esa tarde jsjs", ratio: "0.562" },
    { src: "fotos/web/45.webp", pie: "color y nada más", ratio: "0.562" },
  ],
};
