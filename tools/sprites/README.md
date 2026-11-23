# Personajes por piezas (ComfyUI)

1. Maniquí base generado con Z-Image Turbo (calvo, camiseta de tirantes y shorts grises, fondo magenta).
2. Cada pieza (pelo, gorro, gafas, arriba, abajo, zapatos) se genera con inpainting sobre el maniquí,
   usando una máscara por zona, en blanco o gris claro para poder recolorearla.
3. `layers.py` recorta todo con la misma caja, lo reduce a una cuadrícula de 72 px de alto y guarda
   solo los píxeles que cambian respecto al maniquí (sin piel).
4. `compose.py` monta personajes: recolorea cada capa por luminancia, estira filas para las alturas
   (bajo / medio / alto) y añade el contorno exterior.
