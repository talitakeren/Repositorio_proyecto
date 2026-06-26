# Documentación de Capacitación
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)
---

## 1. Descripción del Sistema

SGOHA es una aplicación web que automatiza la generación de horarios académicos universitarios utilizando un algoritmo de Satisfacción de Restricciones (CSP). Está construida sobre el stack MERN (MongoDB, Express.js, React.js, Node.js) y opera con dos tipos de usuarios:

| Rol | Capacidades |
|-----|-------------|
| **Administrador** (coordinador académico) | Gestionar cursos, docentes, aulas y estudiantes. Generar horarios. Visualizar y exportar resultados. |
| **Visualizador** (docente / estudiante) | Consultar el horario generado según su perfil. Solo lectura. |

---

## 2. Acceso al Sistema

### 2.1 URL de acceso

| Servicio | URL |
|----------|-----|
| Frontend (producción) | Desplegado en Vercel (ver README del repositorio) |
| Backend API | Desplegado en Render (ver README del repositorio) |
| Frontend (local) | http://localhost:5173 |
| Backend API (local) | http://localhost:5050 |

### 2.2 Inicio de sesión

1. Ingresar a la URL del sistema.
2. Introducir **correo electrónico** y **contraseña** en el formulario de login.
3. El sistema redirige automáticamente al panel correspondiente al rol del usuario.

> **Nota de seguridad:** El sistema usa tokens JWT con expiración. Si la sesión expira, el sistema solicitará iniciar sesión nuevamente. No compartir credenciales.

---

## 3. Guía de Uso para Administradores

### 3.1 Gestión de Docentes

**Registrar un docente:**
1. Ir al menú lateral → **Docentes**.
2. Hacer clic en **Nuevo docente**.
3. Completar: nombre, correo electrónico, especialidad.
4. En la sección **Disponibilidad**, marcar los días y franjas horarias en que el docente puede dictar clases.
5. Hacer clic en **Guardar**.

**Editar o eliminar un docente:**
1. En la lista de docentes, hacer clic en el ícono de edición (lápiz) o eliminación (papelera).
2. Para editar: modificar los campos y guardar.
3. Para eliminar: confirmar la acción en el diálogo de confirmación.

> **Importante:** Eliminar un docente con asignaciones activas puede afectar los horarios generados. Se recomienda reasignar sus cursos antes de eliminar.

### 3.2 Gestión de Cursos

**Registrar un curso:**
1. Ir al menú lateral → **Cursos**.
2. Hacer clic en **Nuevo curso**.
3. Completar: nombre, código, créditos, prerrequisitos (seleccionar de la lista de cursos existentes).
4. Guardar.

> **Validación automática:** El sistema no permitirá registrar dos cursos con el mismo código. Se mostrará un error descriptivo si se intenta.

### 3.3 Gestión de Aulas

1. Ir a **Aulas** en el menú lateral.
2. Registrar: nombre del aula, capacidad (número de estudiantes), tipo (teoría / laboratorio).
3. El sistema usará esta información para asignar aulas que cumplan con el tamaño del grupo.

### 3.4 Gestión de Estudiantes

1. Ir a **Estudiantes**.
2. Registrar: nombre, código de estudiante, correo, historial de cursos aprobados.
3. El historial de cursos aprobados es fundamental para que el motor de validación de prerrequisitos funcione correctamente.

### 3.5 Generación de Horarios

1. Ir a **Generar Horario** en el menú lateral.
2. Seleccionar el semestre y los cursos a incluir.
3. Hacer clic en **Generar**.
4. El sistema ejecutará el algoritmo CSP. El proceso toma menos de 10 segundos para hasta 30 cursos, 15 docentes y 10 aulas.
5. El horario generado se mostrará en una grilla semanal.
6. Los conflictos (si los hubiera) aparecerán resaltados en rojo con una descripción del problema.

> **Nota:** Si el algoritmo no encuentra solución (por restricciones muy rígidas), el sistema mostrará un mensaje indicando que no existe un horario válido para la configuración actual. En ese caso, revisar la disponibilidad de docentes o aulas.

### 3.6 Validación de Matrícula

El sistema valida automáticamente al momento de registrar una matrícula:
- Que el estudiante haya aprobado todos los **prerrequisitos** del curso.
- Que la suma de créditos esté entre **20 y 22 créditos** por semestre.

Si alguna condición no se cumple, el sistema mostrará un mensaje de error descriptivo indicando el motivo del rechazo.

---

## 4. Guía de Uso para Visualizadores (Docentes / Estudiantes)

1. Iniciar sesión con las credenciales proporcionadas por el administrador.
2. El panel principal muestra el horario asignado para el semestre actual.
3. La grilla semanal muestra día, franja horaria, curso y aula asignada.
4. No es posible realizar modificaciones desde este rol.

---

## 5. Instalación y Despliegue (Para el Equipo de Operaciones)

### 5.1 Requisitos previos

| Requisito | Versión mínima |
|-----------|---------------|
| Node.js | v18 o superior |
| MongoDB | Atlas (free tier) o instancia local |
| Git | Cualquier versión reciente |

### 5.2 Clonar el repositorio

```bash
git clone https://github.com/talitakeren/Repositorio_proyecto.git
cd Repositorio_proyecto
```

### 5.3 Configurar variables de entorno del backend

```bash
cd backend
cp config.env.example config.env
```

Editar `config.env` con los valores correspondientes:

```env
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/sgoha
JWT_SECRET=<clave-secreta-larga-y-aleatoria>
PORT=5050
NODE_ENV=production
```

### 5.4 Instalar dependencias e iniciar

```bash
# Backend
cd backend
npm install
npm run dev        # Desarrollo
# ó
npm start          # Producción

# Frontend
cd ../frontend
npm install
npm run dev        # Desarrollo
# ó
npm run build      # Generar build de producción (en /frontend/dist)
```

### 5.5 URLs del sistema en ejecución local

| Servicio | URL |
|----------|-----|
| API Backend | http://localhost:5050 |
| Frontend React | http://localhost:5173 |

### 5.6 Verificar que el sistema esté operativo

```bash
# Verificar backend
curl http://localhost:5050/health

# Respuesta esperada
{ "status": "OK" }
```

---

## 6. Mantenimiento del Sistema

### 6.1 Backups de la base de datos

MongoDB Atlas incluye backups automáticos en el plan free tier. Para exportar datos manualmente:

```bash
mongodump --uri="mongodb+srv://<usuario>:<password>@cluster/sgoha" --out=./backup
```

### 6.2 Actualización de dependencias

```bash
# Backend
cd backend
npm audit
npm update

# Frontend
cd ../frontend
npm audit
npm update
```

### 6.3 Ejecución de pruebas

```bash
cd backend
npm test                    # Ejecutar todas las pruebas (208 tests)
npm run test:coverage       # Ejecutar con reporte de cobertura
```

### 6.4 Análisis de calidad de código (SonarQube local)

```bash
# Iniciar stack SonarQube
docker compose -f docker-compose.sonar.yml up -d

# Acceder al dashboard
# http://localhost:9000 (usuario: admin, contraseña: admin en primer inicio)
```

---

## 7. Solución de Problemas Frecuentes

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| El sistema no carga (pantalla en blanco) | Frontend sin configurar o backend caído | Verificar que ambos servicios estén corriendo. Revisar consola del navegador |
| Error "Cannot connect to MongoDB" | URI de MongoDB incorrecta o sin acceso a red | Verificar `MONGO_URI` en `config.env`. Verificar whitelist de IPs en MongoDB Atlas |
| Generación de horario no termina | Restricciones muy rígidas para el conjunto de datos | Revisar disponibilidad de docentes y aulas; añadir más opciones o reducir los cursos a incluir |
| Error 401 al acceder | Token JWT expirado | Cerrar sesión e iniciar nuevamente |
| Error 409 al registrar | Dato duplicado (código de curso, correo de docente, etc.) | Verificar que el registro no exista ya en el sistema |

---

## 8. Contacto y Soporte

Para soporte técnico sobre el sistema, contactar al equipo de desarrollo a través del repositorio en GitHub:  
https://github.com/talitakeren/Repositorio_proyecto/issues
