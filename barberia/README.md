# NAVAJA NEGRA — Demo de barbería de garage

Sitio multipágina de barbería hecho con HTML, CSS y JavaScript puro. Identidad darker: negro profundo, acero, latón oscuro y rojo oxblood, con motos y ambiente de garage. Sin frameworks ni imágenes externas: la galería usa ilustraciones SVG creadas para esta demo.

## Páginas

| Archivo | Qué muestra |
| --- | --- |
| `index.html` | Portada: identidad, servicios destacados, pasos de la reserva y llamadas a la acción. |
| `servicios.html` | Catálogo de 9 recortes y tratamientos con filtros, precio y duración. |
| `galeria.html` | 10 ilustraciones SVG (cortes, barbas, moto y casco) con visor, flechas y cierre con `Esc`. |
| `citas.html` | Solicitud de citas: formulario, validación, confirmación y lista de reservas. |

## Estructura

```
barberia/
├── index.html
├── servicios.html
├── galeria.html
├── citas.html
├── css/estilo.css        ← identidad visual compartida
├── js/main.js            ← cabecera, pie, filtros, galería y reservas
├── assets/*.svg          ← 10 ilustraciones locales (incluye moto y casco)
├── proyecto.json         ← ficha para el hub thc.dev
└── README.md
```

## Reservas

El formulario guarda cada solicitud en `localStorage` con la clave `navajanegra_citas`. Los datos no viajan a ningún servidor: es una demo local. Desde `citas.html` se pueden ver y cancelar las solicitudes guardadas.

Los botones «Reservar» llevan a `citas.html?servicio=<id>` y el formulario preselecciona ese servicio automáticamente.

## Datos que son ejemplos

Antes de usar este sitio para un negocio real, cambiar en `js/main.js` y en las páginas:

- Número de WhatsApp: `573000000000` (marcador de posición en `body[data-whatsapp]` y en `js/main.js`).
- Dirección y horario: `Cra. 15 # 12-34, Centro · Bucaramanga`, `9:00 a.m. – 7:00 p.m.`.
- Precios de `SERVICES` en `js/main.js` (tarifas de referencia).
- Textos de `GALLERY`: las imágenes son ilustraciones, no fotos de clientes.

## Verla

Desde `Portafolio Pagina/`, ejecutar `./servir.sh` y abrir `http://localhost:8000/barberia/`.
