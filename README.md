# Gestor Escolar

Sistema de gestión escolar con autenticación de usuarios.

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd GestorEscolar
```

2. Configurar la base de datos:
   - Crear un usuario MySQL con los permisos necesarios
   - Copiar el archivo `.env.example` a `.env` en la carpeta backend
   - Actualizar las credenciales de la base de datos en el archivo `.env`

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

## Credenciales por defecto

Para probar el sistema, puedes registrar un nuevo usuario desde la interfaz de registro.
