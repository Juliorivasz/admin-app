# Foodstore - Panel Admin (Frontend)

Video trabajo Integrador Final:

https://drive.google.com/file/d/1WWHz56UHx-c8zXCPJy8df2C2pilhEvHS/view?usp=sharing

Este proyecto es el panel de administración para la plataforma Foodstore. Desarrollado con React, TypeScript y Vite, permite a los administradores y empleados gestionar productos, categorías, stock y el flujo de pedidos en tiempo real.

## Arquitectura

El proyecto sigue una arquitectura fuertemente modularizada basada en **Feature-Sliced Design (FSD)**, lo cual garantiza escalabilidad, mantenibilidad y evitar *cross-imports* problemáticos.

### Estructura de Directorios

```text
src/
├── api/          # Configuración global de Axios e interceptores
├── components/   # Componentes compartidos de UI (botones, modales, layouts)
├── features/     # Módulos funcionales de la aplicación
│   ├── auth/         # Autenticación y Login
│   ├── categorias/   # CRUD de Categorías
│   ├── dashboard/    # KPIs y Gráficos (Recharts)
│   ├── ingredientes/ # Gestión de Ingredientes
│   ├── pedidos/      # Feed en tiempo real y FSM de estados
│   ├── productos/    # CRUD de Productos e Integración Cloudinary
│   └── usuarios/     # Gestión de Empleados
├── hooks/        # Hooks globales (ej. useAdminOrdersFeed)
├── router/       # Configuración de React Router y Guardias de Rutas
├── store/        # Repositorios de estado global (Zustand)
└── types/        # Definiciones de TypeScript compartidas
```

## Stack Tecnológico

- **Framework**: React 19 + Vite
- **Lenguaje**: TypeScript (Strict Mode)
- **Estado Global**: Zustand (AuthStore, WsStore, ThemeStore, etc.)
- **Data Fetching & Caché**: TanStack Query v5
- **Enrutamiento**: React Router DOM v7
- **Estilos**: Tailwind CSS v4
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Notificaciones**: Sonner (Toasts)

## Características Principales

1. **Gestión de Pedidos en Tiempo Real**: Integración mediante WebSockets (`useAdminOrdersFeed`) con reconexión exponencial. El feed se actualiza globalmente usando `refetchType: 'all'` de TanStack Query para evitar datos obsoletos al cambiar de vista.
2. **Dashboard de Estadísticas**: KPIs dinámicos y 4 gráficos interactivos generados con Recharts (Ventas, Ingresos, Distribución de Estados, Top Productos).
3. **Manejo de Sesión Seguro**: Tokens JWT almacenados en cookies HttpOnly. El interceptor de Axios renueva automáticamente el Access Token (401) sin interrumpir la experiencia del usuario.
4. **Roles y Permisos**: Guardia de rutas (`RoleRoute.tsx`) que redirecciona a empleados y administradores a sus respectivas áreas permitidas.
5. **Máquina de Estados Finita (FSM)**: Transición controlada de los pedidos (`PENDIENTE -> EN_PREP -> LISTO -> ENTREGADO`).

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `localhost:5173`.
- `npm run build`: Compila la aplicación para producción (TypeScript + Vite).
- `npm run preview`: Previsualiza la versión compilada.

## Despliegue y Variables de Entorno

Crear un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:8000/api
```
*(Nota: Las credenciales de Cloudinary se manejan directamente desde el Backend por razones de seguridad).*
