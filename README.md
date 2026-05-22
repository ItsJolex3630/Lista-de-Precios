# Panel de Control de Perfumes

Panel de control profesional para la gestión de inventario y precios de perfumes. Desarrollado con Next.js 16, TypeScript, Tailwind CSS y shadcn/ui.

## Características

- **Dashboard de métricas**: Total de perfumes, cotizados, sin cotizar y costo promedio mayorista
- **Tabla interactiva tipo Excel**: Edición en línea de nombres, volúmenes, géneros y precios
- **Calculadora de márgenes dinámica**: Ajusta el porcentaje de margen sugerido en tiempo real
- **Filtros avanzados**: Búsqueda por nombre y filtro por género (Dama, Caballero, Unisex)
- **Filtro de sin precio**: Visualiza rápidamente los perfumes que necesitan cotización
- **Exportar a CSV**: Exporta el inventario completo compatible con Excel
- **Agregar y eliminar perfumes**: Gestión completa del inventario
- **Persistencia local**: Los datos se guardan automáticamente en el navegador
- **Paginación**: Navega cómodamente con 25, 50, 100 items o ver todos
- **Diseño responsivo**: Funciona perfectamente en móvil, tablet y escritorio

## Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Estado**: Zustand con persistencia
- **Iconos**: Lucide React

## Estructura del Proyecto

```
src/
  app/
    layout.tsx           # Layout raíz con metadata SEO
    page.tsx             # Página principal
    globals.css          # Estilos globales
  components/
    perfume/
      PerfumeDashboard.tsx  # Dashboard principal orquestador
      MetricCards.tsx       # Tarjetas de métricas
      FilterControls.tsx    # Controles de búsqueda y filtros
      PerfumeTable.tsx      # Tabla interactiva con paginación
      AddPerfumeForm.tsx    # Formulario para agregar perfumes
    ui/                    # Componentes shadcn/ui
  data/
    perfumes.ts            # Datos iniciales y tipos
  hooks/
    usePerfumeStore.ts     # Store Zustand con persistencia
```

## Comenzando

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Despliegue en Vercel

1. Sube este repositorio a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio desde GitHub
4. Vercel detectará automáticamente la configuración de Next.js
5. Haz clic en "Deploy"

¡Eso es todo! Tu panel de control estará disponible en minutos.

## Licencia

MIT
