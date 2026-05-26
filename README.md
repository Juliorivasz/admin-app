# 🍔 Foodstore - Panel de Administración (Frontend)

Este es el repositorio del frontend para el **Módulo de Administración y Cajeros** del Parcial 2. Está construido con **React + Vite**, utilizando **TypeScript** y **Tailwind CSS**.

## 🎥 Demostración en Video

> **https://drive.google.com/drive/folders/1VX5V1lqaQgTj-3K96T0uXAvy79Q_gjZd?usp=drive_link**

## 🚀 Tecnologías Principales

- **React 18** (UI)
- **Vite** (Bundler)
- **TypeScript** (Tipado estricto e interfaces)
- **Tailwind CSS** (Estilos y diseño responsive)
- **React Router Dom** (Navegación, Rutas protegidas y Guards)
- **TanStack Query (React Query)** (Server State, Manejo de caché y mutaciones)
- **Axios** (Cliente HTTP con interceptores y manejo de cookies `HttpOnly`)

## ✨ Características Principales (Parcial 2)

### 1. Seguridad y Autenticación
- Protección de rutas (`PrivateRoute`) que bloquea a usuarios no autenticados.
- Protección por Roles (`RoleRoute`) que aplica el sistema RBAC (Ej: Un Cajero solo ve pedidos, el Admin ve todo).
- El JWT se maneja mediante cookies seguras (`HttpOnly`) gracias a `withCredentials: true` en Axios.

### 2. Panel Kanban de Pedidos (TanStack Query)
- Uso de `useQuery` para traer datos en tiempo real de la base de datos (eliminación de "mocks").
- Uso de `useMutation` para que los empleados avancen los estados del pedido (`CONFIRMADO` -> `EN_PREPARACION` -> `LISTO` -> `ENTREGADO`).
- Invalidación de caché (`queryClient.invalidateQueries`) para actualizar las columnas al instante sin recargar la página.

### 3. Catálogo y Relaciones Complejas
- Muestra los datos anidados de productos y categorías (Parcial 1 mejorado).
- Formularios interactivos que validan campos requeridos antes del envío (integrado con los errores HTTP lanzados por Pydantic en el backend).
- CRUD interactivo (Crear, Editar, Eliminar lógicamente).

## 🛠️ Instalación y Uso

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno (Crear archivo `.env`):
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
4. Ejecutar el entorno de desarrollo:
   ```bash
   npm run dev
   ```

## 👥 Integrantes del Grupo
- [Tu Nombre / Integrante 1]
- [Integrante 2]
- [Integrante 3]
- [Integrante 4]
