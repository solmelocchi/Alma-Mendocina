# Skill: Estructura del Proyecto Alma Mendocina

## ¿Qué es Alma Mendocina?
Plataforma de turismo para Mendoza, Argentina. Conecta a turistas con experiencias auténticas locales, sin intermediarios. Fue creada por Sol, mendocina, con orgullo local.

## Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript vanilla (sin frameworks)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Deploy**: GitHub Pages (por ahora)
- **Control de versiones**: GitHub

## Estructura de Archivos
```
alma-mendocina/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos globales
│   └── components.css      # Componentes reutilizables
├── js/
│   ├── main.js             # Lógica principal
│   ├── firebase.js         # Configuración y helpers Firebase
│   ├── planner.js          # Planificador de viaje
│   ├── listings.js         # Lógica de alojamientos/experiencias
│   └── chat.js             # Chat IA planificador
├── assets/
│   ├── images/
│   └── icons/
├── components/             # HTML parciales reutilizables
└── .claude/                # Skills y agents de Claude Code
```

## Convenciones de Código
- Comentarios en **español**
- Nombres de variables y funciones en **camelCase** en español descriptivo
- IDs y clases CSS en **kebab-case**
- Siempre comentar funciones con qué hace, parámetros y qué retorna
- Nunca hardcodear textos: usar el sistema de i18n (ES/EN/PT)

## Secciones del Sitio
1. **Hero** - Bienvenida con búsqueda
2. **Planificador de viaje** - Tabs por tipo de viajero (familias, parejas, despedidas, solos, grupos corporativos)
3. **Alojamientos** - Cards con slide-in de detalle
4. **Experiencias** - Actividades locales auténticas
5. **Chat IA** - Planificador con tiers de presupuesto
6. **Reseñas** - Testimonios reales
7. **Contacto** - WhatsApp + formulario

## Idiomas Soportados
- ES (español) — idioma principal
- EN (inglés)
- PT (portugués)

## Reglas Importantes
- Mobile-first siempre
- Performance: imágenes optimizadas, lazy loading
- Accesibilidad: alt texts, contraste, semántica HTML
- Nunca guardar credenciales en el código
- Cada feature nueva en rama separada de Git
