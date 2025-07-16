# Panel de Administración - Team Balancer

## Descripción
El panel de administración permite gestionar todos los grupos del sistema Team Balancer desde una interfaz centralizada protegida con contraseña.

## Características

### 🔐 Autenticación
- Acceso protegido con contraseña
- Sesión segura para la administración
- Contraseña configurable mediante variables de entorno

### 📊 Panel de Estadísticas
- Resumen general del sistema
- Número total de grupos y jugadores
- Estadísticas de grupos y jugadores activos
- Vista de grupos recientes

### 🎯 Gestión de Grupos
- Visualización de todos los grupos del sistema
- Activación/desactivación de grupos
- Eliminación de grupos
- Información detallada de cada grupo
- Lista de jugadores por grupo

### ➕ Creación de Grupos
- Crear nuevos grupos con nombre personalizado
- Selección de iconos y colores
- Configuración visual intuitiva

## Acceso al Panel

### Desde la Aplicación Principal
1. **Pantalla de Login**: Enlace discreto en la parte inferior
2. **Panel de Configuración**: Botón "Abrir Panel de Administración"
3. **URL Directa**: `/admin`

### Credenciales por Defecto
- **Contraseña**: `admin123`
- **Configurable en**: `.env.local` → `ADMIN_PASSWORD`

## Configuración

### Variables de Entorno
```env
# Contraseña del panel de administración
ADMIN_PASSWORD=tu_contraseña_personalizada
```

### Estructura de Archivos
```
app/
├── admin/
│   └── page.tsx                 # Página principal del panel
├── api/
│   └── admin/
│       ├── auth/
│       │   └── route.ts         # Autenticación
│       ├── groups/
│       │   ├── route.ts         # CRUD de grupos
│       │   └── [groupId]/
│       │       └── route.ts     # Gestión de grupo individual
│       └── stats/
│           └── route.ts         # Estadísticas del sistema
```

## Funcionalidades Técnicas

### API Endpoints
- `POST /api/admin/auth` - Autenticación
- `GET /api/admin/groups` - Obtener todos los grupos
- `POST /api/admin/groups` - Crear nuevo grupo
- `PUT /api/admin/groups/[id]` - Actualizar grupo
- `DELETE /api/admin/groups/[id]` - Eliminar grupo
- `GET /api/admin/stats` - Obtener estadísticas

### Seguridad
- Validación de contraseña en el servidor
- Sesión temporal (no persistente)
- Protección CSRF automática de Next.js
- Validación de entrada en todos los endpoints

## Uso

### Iniciar Sesión
1. Navegar a `/admin`
2. Ingresar la contraseña de administrador
3. Hacer clic en "Acceder"

### Gestionar Grupos
1. **Ver Resumen**: Pestaña "Resumen" para estadísticas generales
2. **Administrar**: Pestaña "Grupos" para gestionar grupos existentes
3. **Crear**: Pestaña "Crear Grupo" para añadir nuevos grupos

### Crear Nuevo Grupo
1. Ir a la pestaña "Crear Grupo"
2. Ingresar nombre del grupo
3. Seleccionar icono y color
4. Hacer clic en "Crear Grupo"

## Notificaciones
El panel utiliza el sistema de notificaciones toast integrado para mostrar:
- ✅ Confirmaciones de acciones exitosas
- ❌ Errores y validaciones
- ⚠️ Advertencias importantes
- ℹ️ Información general

## Consideraciones de Seguridad

### Recomendaciones
1. **Cambiar la contraseña por defecto** en producción
2. **Usar HTTPS** en entornos de producción
3. **Restringir acceso por IP** si es necesario
4. **Monitorear logs** de acceso al panel

### Implementación Segura
```env
# Ejemplo de configuración segura
ADMIN_PASSWORD=Mi_Contraseña_Súper_Segura_2024!
```

## Troubleshooting

### Problemas Comunes
1. **"Contraseña incorrecta"**: Verificar variable de entorno `ADMIN_PASSWORD`
2. **Error 500**: Comprobar conexión a la base de datos
3. **Grupos no se cargan**: Verificar esquema de la base de datos

### Logs de Depuración
Los errores se registran en la consola del servidor con el prefijo:
- `Error in admin auth:`
- `Error getting groups:`
- `Error creating group:`

## Próximas Mejoras
- [ ] Gestión de jugadores individuales
- [ ] Exportación de datos
- [ ] Logs de auditoría
- [ ] Autenticación con JWT
- [ ] Roles de usuario múltiples
