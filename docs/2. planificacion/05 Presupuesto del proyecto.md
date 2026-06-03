  # Presupuesto del Proyecto  
  
**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Resumen Ejecutivo

El presente documento constituye el análisis económico integral del proyecto SGOHA, un sistema web de generación automática de horarios académicos basado en un modelo de satisfacción de restricciones (CSP).

El presupuesto cubre los 4 Sprints del ciclo de desarrollo Scrum, desde la gestión de datos maestros hasta la implementación del motor algorítmico y las interfaces de visualización.

El proyecto involucra 42 tareas distribuidas en 11 Historias de Usuario, con un total de 58 días laborables y 371 Story Points. El equipo está compuesto por 5 desarrolladores con roles diferenciados y un Scrum Master.

### Resumen de Costos del Proyecto

| Categoría | Monto (S/) | % |
|------------|-----------|----|
| Recursos Humanos | S/ 17,400 | 79.71% |
| Infraestructura | S/ 260 | 1.19% |
| Costos Indirectos | S/ 4,170 | 19.10% |
| **TOTAL PROYECTO** | **S/ 21,830** | **100%** |

---

## 2. Recursos Humanos: Costos por Rol

Los costos de recursos humanos constituyen el componente principal del presupuesto. Las tarifas se expresan en soles peruanos (PEN) por hora, considerando el perfil técnico requerido dentro de la arquitectura MERN y la complejidad del motor CSP.

### 2.1 Tabla de Roles, Horas y Costos (Orden alfabético por nombre)

| Nombre Completo | Rol en Scrum | Horas | Tarifa (S/) | Total (S/) | Perfil Técnico |
|----------------|-------------|------|-------------|------------|----------------|
| Contreras Infanzón Alexandra Mirella | Developer – Backend | 120 | 35 | 4,200 | API REST (Node.js + Express.js), MongoDB y motor CSP |
| Espinoza Zárate Juan Carlos | Scrum Master | 100 | 30 | 3,000 | Gestión Agile y diseño del modelo CSP |
| Huamán Raymundo Yenifer Nicole | Product Owner | 90 | 20 | 1,800 | Gestión de backlog y validación de entregables |
| Olivera Paredes Talita Keren | Developer – Frontend | 120 | 35 | 4,200 | SPA en React.js y visualización de horarios |
| Vega Carhuallanqui Tatiana | Developer – Full Stack / QA | 120 | 35 | 4,200 | Desarrollo full-stack, pruebas e integración |

**TOTAL RRHH: S/ 17,400**

---

### 2.2 Justificación de Tarifas

Las tarifas reflejan el nivel de especialización requerido para el stack MERN y el modelo CSP.

- El Scrum Master lidera la gestión del proceso Agile y coordinación del equipo.
- El Product Owner se enfoca en la validación funcional del sistema.
- Los desarrolladores Full Stack concentran la mayor carga técnica del sistema.
- El componente más crítico es el motor CSP, responsable de la generación de horarios.

---

## 3. Infraestructura Tecnológica

La infraestructura se basa en servicios cloud (PaaS/BaaS) para reducir costos operativos.

| Componente | Tipo | Costo | Meses | Total |
|------------|------|-------|-------|-------|
| MongoDB Atlas (Free Tier) | BaaS | Gratuito | 4 | 0 |
| Vercel Pro | Hosting | S/ 20 | 4 | 80 |
| Railway / Render | Backend Hosting | S/ 20 | 4 | 80 |
| Dominio (.com / .edu.pe) | Dominio | S/ 100 | 1 | 100 |
| GitHub Actions | CI/CD | Gratuito | 4 | 0 |
| SendGrid | SaaS | Gratuito | 4 | 0 |

**TOTAL INFRAESTRUCTURA: S/ 260**

---

## 4. Costos Indirectos

Incluyen gastos complementarios del proyecto.

| Concepto | Monto (S/) |
|----------|------------|
| Licencias de herramientas | 120 |
| Capacitación técnica | 200 |
| Documentación | 80 |
| Contingencia técnica (15% RRHH) | 2,610 |
| Coordinación y reuniones | 800 |
| Pruebas de carga | 60 |
| Soporte post-entrega | 300 |

**TOTAL COSTOS INDIRECTOS: S/ 4,170**

---

## 5. Evolución del Proyecto por Sprint (Referencia de esfuerzo, NO costo adicional)

La siguiente distribución representa únicamente la planificación del esfuerzo del proyecto y NO genera costos adicionales sobre el total.

| Sprint | Duración | HU | Story Points | Descripción |
|--------|----------|----|-------------|-------------|
| Sprint 1 | 21 días | HU-01, HU-02 | 72 | Setup inicial y modelos de datos |
| Sprint 2 | 15 días | HU-03 a HU-06 | 148 | Desarrollo backend y frontend base |
| Sprint 3 | 12 días | HU-07 | 56 | Motor CSP y generación de horarios |
| Sprint 4 | 10 días | HU-08 a HU-11 | 95 | Visualización y cierre del sistema |

**Importante:**  
Estos valores NO se suman al presupuesto económico, ya están incluidos dentro de los costos de recursos humanos globales (S/ 17,400). Representan únicamente la distribución del trabajo.

---

## 6. Conclusión Económica

El proyecto SGOHA presenta una estructura de costos equilibrada donde:

- El 79.71% corresponde a recursos humanos (principal componente).
- El 19.10% corresponde a costos indirectos de soporte.
- El 1.19% corresponde a infraestructura cloud.

El modelo económico es viable dentro de un entorno académico, con uso intensivo de herramientas gratuitas y optimización de recursos mediante arquitectura cloud moderna.

El costo total del proyecto asciende a:

**S/ 21,830**