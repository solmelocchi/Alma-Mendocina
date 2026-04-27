# Skill: Contenido e Internacionalización (i18n)

## Sistema de Idiomas
Alma Mendocina soporta 3 idiomas: **ES** (principal), **EN**, **PT**.

## Cómo Funciona el i18n
Los textos de la UI están en un objeto global `traducciones` en `js/main.js`:

```javascript
const traducciones = {
  es: {
    nav: {
      inicio: "Inicio",
      alojamientos: "Alojamientos",
      experiencias: "Experiencias",
      planificador: "Planificador",
      contacto: "Contacto"
    },
    hero: {
      titulo: "Descubrí Mendoza como un local",
      subtitulo: "Sin intermediarios. Sin engaños. Pura alma mendocina.",
      buscar: "¿A dónde querés ir?"
    }
    // ... más secciones
  },
  en: { /* mismo esquema en inglés */ },
  pt: { /* mismo esquema en portugués */ }
}
```

Los elementos HTML usan `data-i18n="clave.anidada"`:
```html
<h1 data-i18n="hero.titulo">Descubrí Mendoza como un local</h1>
```

La función `aplicarIdioma(codigo)` recorre todos los elementos con `data-i18n` y actualiza el texto.

## Tono de Voz
- **Cálido y local**: como si una mendocina te estuviera recomendando
- **Honesto**: sin exagerar, sin frases de folleto turístico genérico
- **Cercano**: tuteo en español, tono conversacional
- **Orgulloso**: Mendoza es especial, el tono lo refleja

## Frases que SÍ usamos
- "Como los mendocinos sabemos"
- "Lejos del circuito turístico habitual"
- "Lo que no te van a contar en la agencia"
- "Un rincón que los locales adoramos"
- "El Mendoza de verdad"

## Frases que NO usamos
- "Paraíso"
- "Mágico" / "Inolvidable" (si es genérico)
- "Los mejores precios"
- "Oferta imperdible"
- Cualquier cosa que suene a folleto de los 90s

## Categorías de Listings
```javascript
const categorias = [
  "viñedos-y-vino",
  "montaña-y-trekking",
  "gastronomia-local",
  "spa-y-relax",
  "cultura-e-historia",
  "aventura",
  "ciudad",
  "campo-y-naturaleza"
]
```

## Tipos de Viajero (tabs del planificador)
```javascript
const tiposViajero = [
  { id: "familias",    icono: "👨‍👩‍👧‍👦", label: "Familias" },
  { id: "parejas",     icono: "💑",      label: "Parejas" },
  { id: "despedidas",  icono: "🥂",      label: "Despedidas" },
  { id: "solos",       icono: "🎒",      label: "Viajeros Solos" },
  { id: "corporativo", icono: "💼",      label: "Grupos Corporativos" }
]
```

## Tiers de Presupuesto (Chat IA)
```javascript
const tiers = {
  economico: {
    label: "Económico",
    descripcion: "Hasta USD 50/noche",
    color: "#3D6B4F"  // verde-vid
  },
  moderado: {
    label: "Moderado",
    descripcion: "USD 50-150/noche",
    color: "#C4956A"  // tierra
  },
  premium: {
    label: "Premium",
    descripcion: "Más de USD 150/noche",
    color: "#8B1A2E"  // vino
  }
}
```
