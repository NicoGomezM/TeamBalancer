# ⚽ TeamBalancer

Una aplicación web para balancear equipos de fútbol basada en votaciones y estadísticas de jugadores.

## 🚀 Características

- 🎯 **Sistema de Votación**: Los jugadores pueden votar por sus compañeros de equipo
- ⚖️ **Balanceo Inteligente**: Algoritmo que balancea equipos basado en estadísticas
- 🎲 **Equipos Aleatorios**: Opción para generar equipos completamente aleatorios
- 👥 **Gestión de Grupos**: Administra múltiples grupos de jugadores
- 📊 **Estadísticas**: Seguimiento de puntuaciones y rendimiento
- 🔧 **Panel de Administración**: Gestión completa del sistema
- 🎨 **Interfaz Moderna**: Diseño responsivo con Tailwind CSS
- ⚡ **Favicon Dinámico**: Icono de pelota de fútbol que cambia de color
- 🔄 **Estados de Carga**: Indicadores visuales para todas las operaciones

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: Sistema personalizado
- **Notificaciones**: Sistema de toast personalizado

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/NicoGomezM/TeamBalancer.git
cd TeamBalancer
```

2. **Instala las dependencias**
```bash
npm install
# o
pnpm install
# o
yarn install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:
```env
MONGODB_URI=mongodb://localhost:27017/team-balancer
ADMIN_PASSWORD=tu-contraseña-admin
```

4. **Inicia la aplicación**
```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🎮 Uso

### Para Jugadores
1. **Registro**: Crea una cuenta con tu nombre y únete a un grupo
2. **Votación**: Evalúa a tus compañeros de equipo (1-10 puntos)
3. **Selección**: Marca quién está presente para jugar
4. **Equipos**: Genera equipos balanceados o aleatorios

### Para Administradores
1. **Panel Admin**: Accede en `/admin` con la contraseña configurada
2. **Gestión**: Administra grupos, jugadores y estadísticas
3. **Configuración**: Resetea puntuaciones y gestiona el sistema

## 🏗️ Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/                # Componentes de UI (Shadcn)
│   ├── soccer-field.tsx   # Campo de fútbol visual
│   └── team-balancer.tsx  # Componente principal
├── contexts/              # Context providers
├── hooks/                 # Custom hooks
├── lib/                   # Utilidades y configuraciones
├── models/                # Modelos de MongoDB
└── public/                # Archivos estáticos
```

## 🎯 Características Principales

### Sistema de Votación
- Los jugadores votan por sus compañeros (1-10 puntos)
- Cálculo automático de promedios
- Seguimiento de votos dados y recibidos

### Balanceo de Equipos
- **Algoritmo Inteligente**: Balancea equipos basado en estadísticas
- **Distribución Aleatoria**: Opción para equipos completamente aleatorios
- **Visualización**: Campo de fútbol interactivo mostrando los equipos

### Gestión de Grupos
- Múltiples grupos independientes
- Agregar/eliminar jugadores
- Configuración de perfiles personalizados

### Panel de Administración
- Gestión completa de grupos y jugadores
- Estadísticas detalladas
- Reseteo de puntuaciones
- Configuración del sistema

## 🎨 Características Visuales

### Favicon Dinámico
- Pelota de fútbol animada que cambia de color
- 7 colores diferentes en rotación
- Actualización cada 3 segundos

### Estados de Carga
- Indicadores visuales para todas las operaciones
- Spinners personalizados con temática de fútbol
- Overlays de carga para mejor UX

### Notificaciones
- Sistema de toast personalizado
- 4 tipos: éxito, error, advertencia, información
- Animaciones suaves y diseño moderno

## 🔧 Configuración

### Variables de Entorno
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/team-balancer

# Administración
ADMIN_PASSWORD=tu-contraseña-segura

# Aplicación
NODE_ENV=development
```

### Personalización
- Modifica `availableEmojis` en `team-balancer.tsx` para cambiar avatares
- Ajusta colores en `use-dynamic-favicon.ts` para el favicon
- Personaliza estilos en `globals.css` y configuración de Tailwind

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Shadcn/ui](https://ui.shadcn.com/) por los componentes de UI
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos
- [Next.js](https://nextjs.org/) por el framework de React
- [MongoDB](https://www.mongodb.com/) por la base de datos

## 📞 Contacto

- **GitHub**: [@NicoGomezM](https://github.com/NicoGomezM)
- **Proyecto**: [TeamBalancer](https://github.com/NicoGomezM/TeamBalancer)

---

¡Desarrollado con ❤️ para la comunidad futbolística! ⚽
