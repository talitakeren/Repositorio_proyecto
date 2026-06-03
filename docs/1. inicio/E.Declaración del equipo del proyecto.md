# Declaración del Equipo del Proyecto  
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Integrantes del Equipo y Roles

| Nombre Completo | Rol en Scrum | Responsabilidades Principales |
|----------------|-------------|-------------------------------|
| Contreras Infanzón Alexandra Mirella | Developer – Backend | Diseñar e implementar la API REST (Node.js + Express.js), modelo de datos (MongoDB) y motor CSP. |
| Espinoza Zárate Juan Carlos | Scrum Master | Facilitar ceremonias Scrum, eliminar impedimentos y monitorear el tablero de GitHub Projects. |
| Huamán Raymundo Yenifer Nicole | Product Owner | Gestionar y priorizar el backlog, validar entregables según criterios de aceptación. |
| Olivera Paredes Talita Keren | Developer – Frontend | Diseñar e implementar la SPA (React.js), vistas de gestión y visualización de horarios. |
| Vega Carhuallanqui Tatiana | Developer – Full Stack / QA | Soporte en desarrollo, pruebas unitarias, integración y documentación técnica. |

---

## 2. Ceremonias Scrum del Equipo

| Ceremonia | Frecuencia | Duración Máxima | Responsable |
|-----------|-----------|----------------|-------------|
| Sprint Planning | Inicio de sprint | 1 hora | Scrum Master + Product Owner |
| Daily Standup | Semanal | 15 minutos | Scrum Master |
| Sprint Review | Fin de sprint | 30 minutos | Product Owner + equipo |
| Retrospectiva | Fin de sprint | 30 minutos | Scrum Master + equipo |

---

## 3. Normas de Trabajo del Equipo

### 3.1 Normas de Comunicación

- El canal oficial de comunicación es WhatsApp o Discord (grupo del equipo).  
- Las decisiones técnicas relevantes deben documentarse en la wiki del repositorio GitHub.  
- Los impedimentos deben reportarse al Scrum Master en un plazo máximo de 24 horas desde su detección.  

---

### 3.2 Normas de Desarrollo

- No se permite realizar *push* directo a la rama `main`. Todo cambio debe pasar por Pull Request.  
- Cada Pull Request debe ser revisado y aprobado por al menos un integrante distinto al autor.  
- Los commits deben seguir el estándar de commits convencionales:  
  `tipo(alcance): descripción`  
  Ejemplo: `feat(auth): add login endpoint`  
- Toda tarea del backlog debe contar con un issue en GitHub antes de iniciar su desarrollo.  

---

### 3.3 Normas de Calidad

- Cada componente o endpoint debe incluir al menos una prueba unitaria.  
- El código final debe estar libre de `console.log` innecesarios y comentarios de depuración.  
- La documentación en la carpeta `docs/` debe actualizarse en cada sprint (no al final del proyecto).  

---

### 3.4 Definición de Terminado (Definition of Done)

Una historia de usuario o tarea se considera terminada cuando:

- El código está integrado mediante Pull Request aprobado.  
- Las pruebas unitarias asociadas pasan correctamente.  
- La funcionalidad ha sido validada por el Product Owner.  
- La documentación correspondiente ha sido actualizada en `docs/`.  

---

## 4. Compromisos del Equipo

Los integrantes del equipo se comprometen a:

- Participar activamente en todas las ceremonias Scrum.  
- Cumplir con las fechas de entrega establecidas en cada Sprint Planning.  
- Comunicar oportunamente cualquier impedimento que afecte el desarrollo.  
- Respetar las normas de desarrollo, comunicación y calidad definidas en este documento.  

---