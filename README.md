# Sistema de Generación Óptima de Horarios Académicos

## Tabla de Contenido
1. Integrantes del equipo  
2. Problemática abordada  
3. Justificación del PMV  
4. Tecnologías utilizadas  
5. Arquitectura del sistema  
6. Instrucciones de instalación  
7. Instrucciones de build  
8. Instrucciones de despliegue  
9. Video explicativo  
10. Documentación  

---

## Integrantes del equipo
- Contreras Infanzón Alexandra Mirella
- Espinoza Zarate Juan Carlos
- Huaman Raymundo Yenifer Nicole  
- Olivera Paredes Talita Keren
- Vega Carhuallanqui Tatiana

---

## Problemática abordada
Las universidades con currículo flexible enfrentan dificultades en la generación de horarios académicos debido a múltiples factores como:

- Alta variabilidad en la matrícula estudiantil  
- Disponibilidad limitada de docentes y aulas  
- Restricciones académicas (prerrequisitos, créditos)  
- Conflictos de horarios entre cursos  
- Necesidad de optimización  

Este problema es considerado un problema complejo de ingeniería, ya que involucra múltiples variables interdependientes y no posee una solución única o trivial.

---

## Justificación del PMV
El desarrollo de un Producto Mínimo Viable (PMV) permitirá:

- Validar una solución inicial al problema de generación de horarios  
- Reducir la complejidad mediante un enfoque incremental  
- Evaluar la viabilidad técnica del sistema  
- Obtener retroalimentación temprana de usuarios  
- Implementar funcionalidades clave como:
  - Registro de entidades (estudiantes, docentes, cursos, aulas)
  - Validación de restricciones
  - Generación automática de horarios

---

## Tecnologías utilizadas
El proyecto se desarrolla utilizando el stack MERN:

- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Base de datos:** MongoDB  
- **Control de versiones:** Git y GitHub  
- **Metodología:** Scrum  

---

## Arquitectura del sistema
El sistema sigue una arquitectura basada en:

- **SPA (Single Page Application)** para el frontend  
- **API REST** para la comunicación entre cliente y servidor  

### Capas del sistema:
- **Frontend:** Interfaz de usuario (UI/UX)  
- **Backend:** Lógica de negocio  
- **Base de datos:** Persistencia de información  

### Características:
- Separación de responsabilidades  
- Escalabilidad  
- Mantenibilidad  

---

## Instrucciones de instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/talitakeren/Repositorio_proyecto.git
```

### 2. Ingresar al proyecto
```bash
cd Repositorio_proyecto
```

### 3. Instalar dependencias

**Backend:**
```bash
cd backend
npm install mongodb express cors
```

**Frontend:**
```bash
cd frontend
npm create vite@latest client -- --template react
npm install -D tailwindcss postcss autoprefixer
npm install -D react-router-dom
```

---

## Instrucciones de despliegue

**Backend:**
```bash
node --env-file=config.env server
```

**Frontend:**
```bash
npm run dev
```

El sistema estará disponible en:

```
http://localhost:5050
```

---

## Video explicativo

🔗 [Ver video del proyecto (máx. 5 minutos)](#)

---

## Documentación

La documentación completa del proyecto se encuentra en la carpeta:

```
/docs
```

**Estructura:**
- Inicio
- Planificación
- Ejecución
- Seguimiento y control
- Cierre

🔗 Enlace directo: https://github.com/talitakeren/Repositorio_proyecto.git
