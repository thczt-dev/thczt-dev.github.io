# Sabor & Punto — Restaurante

Sitio **multipágina** de demostración para un restaurante, creado como pieza del portafolio **thc.dev**.

**Diseño propio y centrado:** paleta crema/terracota, tipografía editorial Fraunces, cabecera en píldora, retratos con arco, carta en tarjetas circulares y pedidos en un modal centrado. No comparte lenguaje visual con el proyecto KDS.

**Desarrollador:** Diego Alejandro Tellez Tellez — Bucaramanga, Colombia  
**Tecnologías:** HTML5, CSS3 y JavaScript vanilla

## Páginas

| Archivo | Ruta | Contenido |
| --- | --- | --- |
| `index.html` | `/Restaurante/` | Inicio: hero, accesos a las demás páginas y galería |
| `carta.html` | `/Restaurante/carta.html` | Carta dinámica con filtros, 12 platos y cómo pedir |
| `historia.html` | `/Restaurante/historia.html` | Relato, línea de tiempo y fotografías |
| `ubicacion.html` | `/Restaurante/ubicacion.html` | Dirección, horarios en vivo, mapa y cómo llegar |
| `contacto.html` | `/Restaurante/contacto.html` | Formulario que abre WhatsApp y canales de contacto |

La navegación cambia de página de verdad: cada enlace carga un HTML distinto y marca el menú activo según `data-page` del `<body>`.

## Componentes compartidos

`js/main.js` inyecta la **cabecera**, el **pie**, la **barra de pedido** y el **modal** en estos contenedores de cada página:

```html
<div data-site-header></div>
<main id="main">…contenido de la página…</main>
<div data-site-order></div>
<div data-site-footer></div>
```

No dupliques ese marcado a mano en los HTML. El pedido se guarda en `localStorage` con la clave `saborpunto_pedido`, así que se conserva al cambiar de página. En `carta.html`, "Ver pedido" abre el modal; en las demás páginas enlaza a la carta.

## Qué construye

- Cinco páginas conectadas, con diseño responsive y menú hamburguesa.
- Menú digital con **categorías, precios y descripción** de 12 platos.
- Botones para **pedir por WhatsApp**, incluyendo un pedido armado con varios platos.
- Formulario de contacto que valida los datos y abre WhatsApp con el mensaje listo.
- Ubicación con mapa embebido, enlace a Google Maps y horarios con estado "Abierto/Cerrado" en vivo.

## Qué demuestra

| Requisito | Dónde se ve |
| --- | --- |
| Multipágina | 5 HTML independientes con navegación y enlace activo |
| Diseño responsive | Breakpoints en `css/styles.css` (900 y 620 px) |
| Componentes dinámicos | Cabecera/pie inyectados por JS; platos desde `PLATOS`, filtros, pedido persistente y modal |
| Enlaces externos | WhatsApp (`wa.me`), Instagram, Google Maps y `thc.dev` |

## Cómo funciona el pedido

1. En **Carta**, filtra por categoría y pulsa **+** en los platos que quieras.
2. Aparece una barra inferior con la cantidad y el total; se mantiene al navegar.
3. **Ver pedido** abre el modal para cambiar cantidades o eliminar platos.
4. **Enviar por WhatsApp** abre `wa.me` con el pedido y el total ya escritos en el mensaje.

## Datos que debes personalizar

Antes de entregarlo al restaurante, cambia estos valores de ejemplo:

1. **WhatsApp:** el atributo `data-whatsapp` del `<body>` en **las cinco páginas** (hoy `573000000000`). Todos los botones se generan desde ahí.
2. **Dirección:** bloque `<!-- CAMBIAR: dirección real -->` en `ubicacion.html` y el texto de `contacto.html`.
3. **Mapa:** el `iframe` de `ubicacion.html` apunta a una búsqueda genérica de Bucaramanga; reemplaza la URL `https://www.google.com/maps?q=...&output=embed`.
4. **Instagram y horarios:** enlace en `contacto.html` y listado en `ubicacion.html`.

## Estructura

```
Restaurante/
├── index.html        ← Inicio
├── carta.html
├── historia.html
├── ubicacion.html
├── contacto.html
├── css/styles.css
├── js/main.js        ← componentes compartidos + interacciones
├── proyecto.json     ← metadatos para el índice del portafolio
└── README.md
```

> Las fotos se cargan desde Unsplash (requieren internet). Los contenedores tienen un fondo de respaldo si alguna falla.
