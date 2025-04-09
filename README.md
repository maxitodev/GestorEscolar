
# Gestor Escolar

Sistema de gestión escolar con autenticación de usuarios.

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Maxuriel/GestorEscolar.git
cd GestorEscolar
```

2. Configurar la base de datos:
   - Crear un usuario MySQL con los permisos necesarios.
   - Crear el archivo `.env` dentro de `backend/` con las siguientes variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=gestor_escolar
PORT=3001
```

3. Instalar dependencias:
```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

4. Inicializar la base de datos:
```bash
cd backend
node initDb.js
```

5. Sembrar la base de datos con datos de prueba:
```bash
node seed.js
```

## Ejecución

1. Iniciar el backend:
```bash
cd backend
npm start
```

2. Iniciar el frontend (en otra terminal):
```bash
cd frontend
npm start
```

El frontend estará disponible en `http://localhost:3000`  
El backend estará disponible en `http://localhost:3001`

---

## Funcionalidades

### Backend
- **Autenticación**: Registro y login de usuarios con roles (`admin` y `alumno`).
- **Gestión de Carreras**: Crear y listar carreras académicas.
- **Gestión de Materias**: Asignar materias a carreras con capacidad definida.
- **Gestión de Horarios**: Configurar horarios para materias.
- **Gestión de Grupos**: Crear grupos académicos por carrera.

### Frontend
- **Login**: Autenticación de usuarios con redirección según rol.
- **Registro**: Registro de usuarios con selección de carrera para alumnos.
- **Panel de Administrador**: Gestión de carreras, materias, salones, grupos y horarios.
- **Panel de Alumno**: Selección de materias y visualización de horarios.

---

## Credenciales de prueba

Puedes registrar tus propios usuarios desde `/register`, o bien usar estos usuarios para pruebas rápidas:

| Rol     | Correo                  | Contraseña |
|---------|-------------------------|------------|
| Admin   | ejemplo@ejemplo.com     | ejemplo    |
| Alumno  | ejemplo2@ejemplo2.com   | ejemplo2   |

> ⚠️ El alumno está asociado a la carrera con ID `1`. Asegúrate de que esa carrera exista en la base.

---

## Notas Adicionales

- Asegúrate de que los puertos `3000` (frontend) y `3001` (backend) estén disponibles.
- Usa `git pull` para actualizar tu repositorio local.
- Para contribuciones, se recomienda trabajar en ramas por HU (`HU-01`, `HU-02`, etc.).
