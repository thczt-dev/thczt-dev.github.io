# ELLA ☾ hice esto para ti (no me juzgues)

Sitio web personal con estética **gótica** en azul y negro y textos informalmente espontáneos (`q`, `xq`, `jsjs`, `:3`…). El contenido es inventado: se le menciona solo como ELLA y las cartas, frases y pistas no corresponden a nadie real.

> Las fotos están muy pixeladas y difuminadas a propósito; los originales y las copias de seguridad no forman parte del proyecto.

## Partes

- **Inicio:** portada y menú principal.
- **Cartas:** seis cartas que se abren en un sobre con sello de cera.
- **Música:** tocadiscos decorativo con pistas locales en aleatorio.
- **Galería:** 45 marcos con imágenes muy pixeladas y visor para ampliarlas.

## Dónde se edita

| Archivo | Contenido |
| --- | --- |
| `js/datos.js` | Cartas, textos de los marcos y proporciones de las fotos |
| `js/app.js` | Estrellas, animaciones y mensajes del botón ✦ |
| `js/canciones.js` | Lista de pistas locales (`musica/pista-001.mp3` …) |
| `css/estilo.css` | Colores y estilos |
| `fotos/web/` | Las 45 copias pixeladas que usa la galería |

## Cómo abrirlo

```bash
cd ~/Documentos/Portafolio\ ThcDev/Carta\ Censurada
./abrir.sh
```

O manualmente:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Notas

- Las pistas se reproducen desde `musica/` en aleatorio; no hay enlaces externos.
- Si una imagen no carga, el marco muestra un placeholder decorativo.
