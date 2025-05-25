# 🎓 Gestor Escolar

**Sistema de gestión escolar con autenticación de usuarios y administración académica completa.**

[![JavaScript](https://img.shields.io/badge/JavaScript-62%25-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-36.9%25-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML](https://img.shields.io/badge/HTML-1.1%25-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)

## 📋 Descripción

El **Gestor Escolar** es una plataforma web integral diseñada para la administración académica de instituciones educativas. Permite gestionar carreras, materias, salones, horarios y facilita la inscripción de estudiantes con un sistema robusto de autenticación por roles.

## ✨ Características Principales

### 👨‍💼 Panel de Administrador
- ✅ **Gestión de Carreras**: Registro y administración de programas académicos
- ✅ **Gestión de Materias**: Asignación de materias por carrera con control de cupos
- ✅ **Gestión de Salones**: Configuración de espacios físicos (aulas, laboratorios, auditorios)
- ✅ **Generación de Grupos**: Creación automática de grupos académicos por carrera
- ✅ **Asignación de Horarios**: Configuración de horarios sin conflictos

### 👨‍🎓 Panel de Estudiante
- ✅ **Selección de Materias**: Inscripción en materias disponibles con validación de cupos
- ✅ **Visualización de Horarios**: Calendario semanal personalizado
- ✅ **Confirmación de Inscripción**: Sistema de confirmación de materias seleccionadas
- ✅ **Exportación de Horarios**: Descarga de horarios en formato PDF

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express.js
- **MySQL** como base de datos
- **Autenticación JWT** para seguridad
- **Bcrypt** para encriptación de contraseñas

### Frontend
- **React** con React Router DOM
- **Axios** para comunicación con API
- **CSS3** con diseño responsivo
- **jsPDF** para exportación de documentos

## 📚 Historias de Usuario

### Sprint 2 

| ID | Historia de Usuario | Prioridad | Estado |
|---|---|---|---|
| **HU-01** | Como administrador, quiero registrar carreras para organizar las materias | Alta | ✅ |
| **HU-02** | Como administrador, quiero registrar materias y asociarlas a una carrera | Alta | ✅ |
| **HU-03** | Como administrador, quiero registrar salones para asignarlos a las materias | Media | ✅ |
| **HU-04** | Como administrador, quiero generar grupos de materias automáticamente | Media | ✅ |
| **HU-05** | Como administrador, quiero asignar horarios a las materias | Baja | ✅ |

### Sprint 3 

| ID | Historia de Usuario | Prioridad | Estado |
|---|---|---|---|
| **HU-06** | Como administrador, quiero visualizar horarios de un grupo | Baja | 🔄 |
| **HU-07** | Selección de materias por alumno | Media | ✅ |
| **HU-08** | Visualización del horario seleccionado | Media | ✅ |
| **HU-09** | Como administrador restringir cupo de materias | Alta | ✅ |
| **HU-10** | Inscripción de alumnos en materias | Alta | ✅ |

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (v16 o superior)
- **MySQL** (v8.0 o superior)
- **npm** o **yarn**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/maxitodev/GestorEscolar.git
   cd GestorEscolar
   ```

2. **Configurar la base de datos**
   - Crear una base de datos MySQL
   - Configurar las credenciales en `backend/.env`
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=gestor_escolar
   JWT_SECRET=tu_clave_secreta
   ```

3. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

4. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Inicializar la base de datos**
   ```bash
   cd ../backend
   node initDb.js
   ```

6. **Poblar con datos de prueba**
   ```bash
   node seed.js
   ```

## 🏃‍♂️ Ejecución

### Desarrollo

1. **Iniciar el backend**
   ```bash
   cd backend
   npm start
   ```
   > Servidor disponible en: `http://localhost:3001`

2. **Iniciar el frontend** (en otra terminal)
   ```bash
   cd frontend
   npm start
   ```
   > Aplicación disponible en: `http://localhost:3000`

### Producción
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run serve
```

## 🔐 Credenciales de Prueba

| Rol | Correo | Contraseña | Descripción |
|-----|--------|------------|-------------|
| **Admin** | ejemplo@ejemplo.com | ejemplo | Acceso completo al sistema |
| **Alumno** | ejemplo2@ejemplo2.com | ejemplo2 | Panel de estudiante (Carrera ID: 1) |

> ⚠️ **Nota**: Asegúrate de que exista la carrera con ID `1` en la base de datos.

## 📊 Estructura de la Base de Datos

```
Carreras
├── ID_carrera (PK)
├── nombre_carrera
└── codigo_carrera

Materia
├── ID_materia (PK)
├── nombre_materia
├── carrera_fk (FK)
└── capacidad

Salones
├── ID_salon (PK)
├── identificador
├── capacidad
└── tipo

Grupos
├── ID_grupos (PK)
├── carrera_fk (FK)
├── materia1_fk (FK)
├── materia2_fk (FK)
├── materia3_fk (FK)
└── materia4_fk (FK)

Inscripcion
├── ID_inscripcion (PK)
├── ID_materia (FK)
└── ID_alumno (FK)
```

## 🎯 Funcionalidades Detalladas

### Administrador
- **Gestión de Carreras**: Crear y listar programas académicos
- **Gestión de Materias**: Asignar materias con cupos limitados
- **Gestión de Salones**: Configurar espacios por tipo y capacidad
- **Creación de Grupos**: Generar automáticamente grupos de 4 materias
- **Asignación de Horarios**: Configurar horarios sin conflictos

### Estudiante
- **Selección de Materias**: Inscribirse respetando cupos disponibles
- **Visualización de Horarios**: Ver calendario semanal organizado
- **Confirmación de Inscripción**: Finalizar proceso de inscripción
- **Exportación PDF**: Descargar horario personal

## 🔧 Estructura del Proyecto

```
GestorEscolar/
├── backend/
│   ├── routes/          # Rutas de la API
│   ├── models/          # Modelos de datos
│   ├── middleware/      # Middlewares de autenticación
│   ├── initDb.js        # Inicialización de BD
│   ├── seed.js          # Datos de prueba
│   └── server.js        # Servidor principal
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dashboards/
│   │   │   │   ├── Admin/    # Componentes del admin
│   │   │   │   └── Alumno/   # Componentes del estudiante
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   └── public/
└── README.md
```

## 🐛 Resolución de Problemas

### Problemas Comunes

1. **Error de conexión a la base de datos**
   ```bash
   # Verificar credenciales en backend/.env
   # Asegurarse de que MySQL esté ejecutándose
   ```

2. **Puertos ocupados**
   ```bash
   # Backend (puerto 3001)
   lsof -ti:3001 | xargs kill -9
   
   # Frontend (puerto 3000)
   lsof -ti:3000 | xargs kill -9
   ```

3. **Problemas de CORS**
   ```javascript
   // Verificar configuración en backend/server.js
   app.use(cors({
     origin: 'http://localhost:3000'
   }));
   ```

## 👨‍💻 Equipo de Desarrollo

- **Desarrollador Principal**: [@maxitodev](https://github.com/maxitodev)

---
