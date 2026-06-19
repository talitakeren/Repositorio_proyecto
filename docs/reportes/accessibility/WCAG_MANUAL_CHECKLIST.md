# Checklist manual WCAG 2.2 — SGOHA

> 🧑‍💻 **Validación humana** — completar durante sesión moderada con participante y hoja de registro.

## Leyenda

| Símbolo | Significado |
| ------- | ----------- |
| 🟢 | Conforme |
| 🟡 | Observación menor |
| 🟠 | Requiere corrección |
| 🔵 | No evaluado aún |

| ID | Criterio | Nivel | Pantalla | Técnica | Resultado | Hallazgo | Mejora | Evidencia |
| -- | -------- | ----- | -------- | ------- | --------- | -------- | ------ | --------- |
| M-01 | 1.1.1 Contenido no textual | A | Login | Inspección | 🔵 | — | Verificar iconos decorativos | A11Y-M-01 |
| M-02 | 1.3.1 Info y relaciones | A | Dashboard | Lector pantalla | 🔵 | — | Landmarks `main`, `nav` | A11Y-M-02 |
| M-03 | 1.4.3 Contraste mínimo | AA | Formularios | Herramienta color | 🟡 | Algunos textos `slate-400` | Revisar ratio 4.5:1 | A11Y-M-03 |
| M-04 | 2.1.1 Teclado | A | Matrícula alumno | Solo Tab/Enter | 🔵 | — | Probar selección de cursos | A11Y-M-04 |
| M-05 | 2.4.3 Orden de foco | A | Modales | Tab / Shift+Tab | 🟢 | Modal con trap básico | Retorno de foco al cerrar | A11Y-M-05 |
| M-06 | 2.4.7 Foco visible | AA | Global | Navegación teclado | 🟢 | Tailwind `focus-visible` en botones | Uniformizar en tablas | A11Y-M-06 |
| M-07 | 2.5.3 Etiqueta en nombre | A | Botones icono | Inspección | 🟡 | Algunos `title` sin `aria-label` | Añadir `aria-label` en IconBtn | A11Y-M-07 |
| M-08 | 3.3.1 Identificación errores | A | Login | Envío vacío | 🟢 | Mensajes bajo campos | — | A11Y-M-08 |
| M-09 | 3.3.2 Etiquetas | A | Usuarios | Inspección DOM | 🟢 | `Input` con label | — | A11Y-M-09 |
| M-10 | 4.1.2 Nombre, rol, valor | A | Disponibilidad | Grilla interactiva | 🔵 | — | Celdas con estado anunciado | A11Y-M-10 |
| M-11 | Zoom 200 % | AA | Horarios | Browser zoom | 🔵 | — | Sin pérdida de funcionalidad | A11Y-M-11 |
| M-12 | Escape cierra modal | A | Cursos | Tecla Escape | 🟢 | `Modal.jsx` | — | A11Y-M-12 |

## Procedimiento de prueba manual

1. **Teclado:** Desconectar ratón; recorrer login → dashboard → matrícula con Tab, Shift+Tab, Enter, Space, Escape.
2. **Lector de pantalla:** VoiceOver (macOS) o NVDA (Windows) en login y formulario de curso.
3. **Contraste:** DevTools o Colour Contrast Analyser en textos de error y badges.
4. **Zoom:** 200 % en Chrome; verificar scroll horizontal en tablas de horarios.

## Registro

Anotar fecha, evaluador y navegador en [`REGISTRO_PRUEBAS.md`](../plantillas/REGISTRO_PRUEBAS.md).
