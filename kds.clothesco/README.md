# KDS │ Moda Streetwear ⚡⛓️

Página de ejemplo para la tienda de ropa urbana **KDS**, creada como pieza de portafolio para **thc.dev**.

**Desarrollador:** Diego Alejandro Tellez Tellez — Bucaramanga, Colombia  
**IG de la marca:** [@kds.clothesco](https://www.instagram.com/kds.clothesco/)  
**Tecnologías:** HTML5, CSS3 y JavaScript vanilla (sin frameworks ni dependencias)

## Identidad visual

El diseño se construyó a partir del feed real de [@kds.clothesco](https://www.instagram.com/kds.clothesco/):

- **Color base:** negros cálidos (`#11110E`, `#171916`) y crema (`#EBE4E0`).
- **Acento:** dorado/mostaza (`#E9B93F`, `#947A30`), en lugar de un neón, para igualar el tono de los rayos ⚡ del feed.
- **Motivos:** ⚡ y ⛓️, presentes en la bio y en las portadas de los *highlights*.
- **Wordmark:** `KDS│` con barra vertical, seguido de "MODA STREETWEAR".
- **Voz de marca:** frases de la bio —"Nuevos en el mercado, veteranos en calidad", "Streetwear con sello nacional", "Personaliza tu estampado".

## Vista previa

El proyecto es una *landing page* de una sola página con:

- Header sticky con menú responsive y carrito.
- Hero con imagen destacada, estadísticas y llamadas a la acción.
- Ticker animado con las frases de la bio.
- Catálogo de 8 productos con filtros por categoría.
- Sección de **estampado personalizado** con CTA directo a WhatsApp.
- Sección de drop/edición limitada.
- Sobre la marca, frase de marca y formulario de suscripción.
- Footer con Instagram real y créditos del desarrollador.

**Contacto real de la marca:** WhatsApp [+57 310 705 6031](https://wa.me/573170576031) · Instagram [@kds.clothesco](https://www.instagram.com/kds.clothesco/)

## Funcionalidades en JavaScript

| Función | Archivo |
| --- | --- |
| Menú móvil (hamburger) | `js/main.js` |
| Carrito lateral: agregar, cambiar cantidad, eliminar y total | `js/main.js` |
| Filtros del catálogo | `js/main.js` |
| Validación del formulario | `js/main.js` |
| Animaciones de entrada con `IntersectionObserver` | `js/main.js` |
| Resaltado del enlace activo del menú | `js/main.js` |

> El carrito y el formulario son **demostrativos**: no guardan datos ni procesan pagos. Están pensados para mostrar lógica de front-end en el portafolio.

## Cómo ejecutarlo

No requiere instalación. Puedes abrir `index.html` directamente en el navegador.

Si prefieres servirlo localmente (recomendado):

```bash
cd "kds.clothesco"
python3 -m http.server 8000
```

Luego visita <http://localhost:8000>.

## Estructura

```
kds.clothesco/
├── index.html        # Estructura y contenido
├── css/
│   └── styles.css    # Diseño, responsive y animaciones
├── js/
│   └── main.js       # Interacciones
└── README.md
```

## Notas

- Las imágenes se cargan desde Unsplash, por lo que se necesita conexión a internet para verlas. Si fallan, los contenedores tienen un degradado de respaldo.
- **Las fotos de producto son provisionales**: reemplázalas por fotos reales de KDS cuando tu amigo te las pase. No se usaron imágenes del CDN de Instagram porque esos enlaces expiran.
- Las fuentes (Anton e Inter) vienen de Google Fonts, con fuentes del sistema como alternativa.
- El correo `hola@kdsclothesco.com` sigue siendo un ejemplo: confírmalo con la marca antes de publicar.
