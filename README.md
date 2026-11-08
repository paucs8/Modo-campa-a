# Modo Campaña

Mis objetivos como un videojuego: campañas por niveles, misiones con XP, peso, entrenos y rutinas con progresión. El protagonista es AXIS en pixel art.

## Estructura

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Solo carga estilos y script. |
| `styles.css` | Todo el diseño (tokens de color arriba, modo claro y oscuro). |
| `app.js` | La app, por bloques: constantes, datos por defecto y migraciones, cálculos, guardado, vistas, acciones y eventos. |
| `config.js` | URL y clave pública de Supabase. |
| `supabase.sql` | Tabla y reglas de acceso para Supabase. |
| `sw.js` | Hace que se pueda instalar y abrir sin conexión. Sube `VERSION` al cambiar archivos. |
| `manifest.webmanifest` | Nombre, colores e iconos de la app instalada. |
| `assets/` | AXIS por capas (`assets/axis/`), objetos, cofre, moneda y jefe en pixel art. |
| `icons/` | Iconos de la app. |

## Cómo motiva

- **Misiones de hoy**: 3 al día (entrenar, avanzar en una campaña y un hábito). Al completarlas se abre el cofre con monedas y XP.
- **Tienda**: las monedas se canjean por premios reales que defines tú.
- **AXIS**: cambia de ánimo según lo que hayas hecho estos días y se pone los objetos que desbloqueas.
- **Jefe final**: el último nivel de cada campaña tiene vida, y cada misión de los niveles anteriores se la quita.

## Datos y sincronización

Todo se guarda primero en el dispositivo (`localStorage`). Con sesión iniciada, se sube a Supabase y se sincroniza entre móvil y PC (gana la versión más reciente, y los cambios llegan en directo).

Configuración, una sola vez:
1. Crear un proyecto en Supabase.
2. SQL Editor → pegar `supabase.sql` → Run.
3. Poner la URL y la clave `anon` del proyecto en `config.js`.
4. Authentication → URL Configuration → Site URL: la dirección de GitHub Pages.

## Instalar

Abre la web en el móvil y elige "Añadir a pantalla de inicio" (Safari: botón compartir; Chrome: menú ⋮).
