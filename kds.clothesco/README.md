# NKS │ Streetwear ⚡⛓️ — demo ficticia

Landing page de ejemplo para una marca de ropa urbana inventada, creada como pieza de portafolio para **thc.dev**.

> **Aviso:** NKS no es una tienda real. El nombre, el WhatsApp, el Instagram y el correo son datos de ejemplo. La compra cancelada por el interesado original no se usa: esta demo no representa a ese negocio ni a esa persona.

**Desarrollador:** Diego Alejandro Tellez Tellez — Bucaramanga, Colombia  
**Tecnologías:** HTML5, CSS3 y JavaScript vanilla (sin frameworks ni dependencias)

La carpeta sigue llamándose `kds.clothesco/` para no romper los enlaces publicados; todo el contenido visible usa la marca ficticia **NKS │ Streetwear**.

## Identidad visual

La estética es una interpretación libre de streetwear nacional, con:

- **Color base:** negros cálidos (`#11110E`, `#171916`) y crema (`#EBE4E0`).
- **Acento:** dorado/mostaza (`#E9B93F`, `#947A30`) en lugar de un neón, para acompañar los rayos ⚡.
- **Motivos:** ⚡ y ⛓️, usados como gestos gráficos del falso *branding*.
- **Wordmark:** `NKS│` con barra vertical, seguido de "MODA STREETWEAR".
- **Voz de marca:** "Nuevos en el mercado, veteranos en calidad", "Streetwear con sello nacional" y "Personaliza tu estampado".

## Vista previa

La demo es una *landing page* de una sola página con:

- Aviso visible de **DEMO FICTICIA** y header sticky con menú responsive y carrito.
- Hero con imagen destacada, estadísticas y llamadas a la acción.
- Ticker animado con frases de la marca ficticia.
- Catálogo de 8 productos con filtros por categoría.
- Sección de **estampado personalizado** con CTA de ejemplo a WhatsApp.
- Sección de drop/edición limitada.
- Sobre la marca, frase de marca y formulario de suscripción demostrativo.
- Footer con datos falsos y créditos del desarrollador.

**Contactos de ejemplo:** WhatsApp `+57 300 000 0000` · Instagram `@nks.streetwear` · Correo `hola@nksstreetwear.example`. Ninguno pertenece a un negocio real.

## Funcionalidades en JavaScript

| Función | Archivo |
| --- | --- |
| Menú móvil (hamburger) | `js/main.js` |
| Carrito lateral: agregar, cambiar cantidad, eliminar y total | `js/main.js` |
| Filtros del catálogo | `js/main.js` |
| Validación del formulario | `js/main.js` |
| Animaciones de entrada con `IntersectionObserver` | `js/main.js` |
| Resaltado del enlace activo del menú | `js/main.js` |

> El carrito y el formulario son **demostrativos**: no guardan datos, no envían correos ni procesan pagos.

## Cómo ejecutarla

No requiere instalación. Puedes abrir `index.html` directamente en el navegador.

Si prefieres servirla localmente:

```bash
cd "kds.clothesco"
python3 -m http.server 8000
```

Luego visita <http://localhost:8000>.

## Estructura

```
kds.clothesco/
├── index.html        # Estructura, textos y aviso de demo
├── css/
│   └── styles.css    # Diseño, responsive y animaciones
├── js/
│   └── main.js       # Interacciones
├── proyecto.json     # Ficha usada por el hub
└── README.md
```

## Notas

- Las imágenes se cargan desde Unsplash, por lo que se necesita conexión a internet para verlas. Si fallan, los contenedores tienen un degradado de respaldo.
- Las fotos de producto son ilustrativas, no pertenecen a ninguna marca real.
- Las fuentes (Anton e Inter) vienen de Google Fonts, con fuentes del sistema como alternativa.
- El dominio `.example` en el correo es reservado y no corresponde a un correo real.
