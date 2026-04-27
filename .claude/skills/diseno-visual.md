# Skill: Diseño Visual — Alma Mendocina

## Identidad Visual
Alma Mendocina es cálida, auténtica, local. El diseño evoca los colores de Mendoza: el vino, las montañas, los viñedos, el sol. Nunca genérico, nunca turístico-corporativo.

## Paleta de Colores
```css
/* Colores principales */
--color-vino:        #8B1A2E;   /* Borgoña — color identidad */
--color-vino-claro:  #C0394E;   /* Acento hover */
--color-tierra:      #C4956A;   /* Tierra mendocina */
--color-arena:       #F5EDD6;   /* Fondo cálido */
--color-montana:     #4A5568;   /* Gris montaña — texto secundario */
--color-cielo:       #E8F4FD;   /* Azul cielo suave */
--color-verde-vid:   #3D6B4F;   /* Verde viñedo */

/* Neutros */
--color-blanco:      #FFFFFF;
--color-gris-claro:  #F7F7F7;
--color-gris-medio:  #E2E2E2;
--color-texto:       #1A1A2E;   /* Casi negro — texto principal */
```

## Tipografía
```css
/* Títulos: elegante, con personalidad */
--font-titulo: 'Playfair Display', serif;

/* Cuerpo: legible, amigable */
--font-cuerpo: 'Inter', sans-serif;

/* Tamaños */
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  1.875rem;
--text-4xl:  2.25rem;
```

## Espaciado y Layout
```css
--espacio-xs:  4px;
--espacio-sm:  8px;
--espacio-md:  16px;
--espacio-lg:  24px;
--espacio-xl:  40px;
--espacio-2xl: 64px;

--radio-sm:  8px;
--radio-md:  16px;
--radio-lg:  24px;
--radio-xl:  32px;
--radio-full: 9999px;  /* Pills */

--sombra-card: 0 4px 20px rgba(0,0,0,0.08);
--sombra-hover: 0 8px 30px rgba(0,0,0,0.15);
```

## Componentes UI

### Cards de Alojamiento/Experiencia
- Imagen arriba (aspect-ratio 4:3), con overlay gradiente sutil en hover
- Badge de categoría arriba izquierda (color --color-vino)
- Título en Playfair Display
- Descripción corta en Inter
- Precio destacado
- Botón "Ver más" en --color-vino con hover --color-vino-claro
- Al click: slide-in panel desde la derecha (no modal)

### Botones
- **Primario**: fondo --color-vino, texto blanco, radio-full, padding 12px 24px
- **Secundario**: borde --color-vino, texto --color-vino, fondo transparente
- **WhatsApp**: verde #25D366, ícono WhatsApp, siempre visible en mobile

### Tabs del Planificador
- Íconos + texto
- Tab activa: fondo --color-vino, texto blanco
- Tab inactiva: fondo --color-gris-claro, texto --color-montana

### Slide-in de Detalle
- Aparece desde la derecha, 480px de ancho en desktop, full en mobile
- Overlay oscuro detrás (opacity 0.5)
- Cierre con X arriba derecha o click en overlay
- Transición suave: 300ms ease

## Reglas de Diseño
- Siempre mobile-first
- Imágenes con lazy loading y placeholder de color --color-arena
- Animaciones suaves (no flashy): 200-300ms ease
- Nunca usar sombras muy pesadas — el diseño es limpio y cálido
- Espaciado generoso — no apretar contenido
- Los títulos de sección siempre en Playfair Display, centrads
