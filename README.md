# thc.dev

Portafolio de Diego (thc.dev): hub Y2K underground/sk8 con demos de negocios, comunidades y la app de contabilidad en construcción.

**Sitio en vivo:** https://thczt-dev.github.io

## Qué hay aquí

- `index.html` — hub (textos ya horneados desde `textos.txt`).
- `ThcFoto.webp` — retrato de la portada (WebP optimizado).
- `Ayni/`, `Restaurante/`, `barberia/`, `kds.clothesco/`, `la-oveja-negra/` — demos (la última es privada).

`Sabor & Punto`, `NAVAJA NEGRA`, `NKS │ Streetwear` y `La Oveja Negra` son marcas ficticias; sus datos son de ejemplo y solo demostrativos.

El código de `THC Contabilidad` está en https://github.com/thczt-dev/thc-contabilidad

## Actualizar los textos

Los textos públicos se editan en `Portafolio Pagina/textos.txt` del proyecto original. Después de cambiarlos:

```bash
cd "/home/thczt/Documentos/Portafolio ThcDev/Portafolio Pagina"
python3 actualizar_textos.py
cp index.html "../thczt-dev.github.io/index.html"
cd ../thczt-dev.github.io
git add index.html && git commit -m "Actualizar textos" && git push
```

GitHub Pages sirve archivos estáticos: no ejecuta `servir.py`, así que el hub usa los datos de respaldo incluidos en `index.html` y no recarga automáticamente al editar `textos.txt`. Por eso hay que hornear y volver a subir.
