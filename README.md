# Modo Campaña

Mis objetivos como un videojuego: campañas por niveles, misiones con XP, peso, entrenos y rutinas con progresión. El protagonista es AXIS en pixel art.

## Estructura

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Solo carga estilos y script. |
| `styles.css` | Todo el diseño (tokens de color arriba, modo claro y oscuro). |
| `app.js` | La app, por bloques: constantes, datos por defecto y migraciones, cálculos, guardado, vistas, acciones y eventos. |
| `sw.js` | Hace que se pueda instalar y abrir sin conexión. Sube `VERSION` al cambiar archivos. |
| `manifest.webmanifest` | Nombre, colores e iconos de la app instalada. |
| `assets/` | AXIS y los objetos del inventario en pixel art. |
| `icons/` | Iconos de la app. |

## Datos

De momento se guardan en el propio dispositivo (`localStorage`). La sincronización entre móvil y PC va después, con Supabase.

## Instalar

Abre la web en el móvil y elige "Añadir a pantalla de inicio" (Safari: botón compartir; Chrome: menú ⋮).
