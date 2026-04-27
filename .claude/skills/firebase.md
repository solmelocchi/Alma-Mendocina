# Skill: Firebase — Alma Mendocina

## Configuración
- Usar Firebase v9+ (modular syntax — NO compat)
- Las credenciales van SOLO en variables de entorno o archivo `.env` (nunca en el código)
- El archivo de config es `js/firebase.js`

## Estructura de Firestore

### Colección: `listings`
```javascript
{
  id: string,                    // Auto-generado
  tipo: "alojamiento" | "experiencia" | "restaurante",
  nombre: string,
  descripcion: { es: string, en: string, pt: string },
  descripcionCorta: { es: string, en: string, pt: string },
  precio: {
    desde: number,
    moneda: "ARS" | "USD",
    periodo: "noche" | "persona" | "grupo"
  },
  ubicacion: {
    barrio: string,
    ciudad: string,             // "Mendoza", "Luján de Cuyo", etc.
    coordenadas: GeoPoint
  },
  imagenes: string[],           // URLs de Firebase Storage
  imagenPrincipal: string,
  categorias: string[],         // ["viñedo", "montaña", "ciudad", etc.]
  tiposViajero: string[],       // ["familias", "parejas", "solos", "grupos", "corporativo"]
  presupuesto: "economico" | "moderado" | "premium",
  contacto: {
    whatsapp: string,
    email: string,
    instagram: string
  },
  destacado: boolean,
  activo: boolean,
  creadoEn: Timestamp,
  actualizadoEn: Timestamp
}
```

### Colección: `usuarios`
```javascript
{
  id: string,                   // UID de Firebase Auth
  email: string,
  nombre: string,
  tipo: "turista" | "proveedor" | "admin",
  favoritos: string[],          // IDs de listings
  creadoEn: Timestamp
}
```

### Colección: `reseñas`
```javascript
{
  id: string,
  listingId: string,
  usuarioId: string,
  usuarioNombre: string,
  calificacion: number,         // 1-5
  comentario: string,
  idioma: "es" | "en" | "pt",
  aprobada: boolean,
  creadaEn: Timestamp
}
```

### Colección: `consultas`
```javascript
{
  id: string,
  nombre: string,
  email: string,
  whatsapp: string,
  mensaje: string,
  listingId: string | null,
  estado: "nueva" | "respondida" | "cerrada",
  creadaEn: Timestamp
}
```

## Helpers Firebase (en js/firebase.js)
```javascript
// Obtener listings con filtros
async function obtenerListings({ tipo, tipoViajero, presupuesto, limite = 12 })

// Obtener listing por ID con reseñas
async function obtenerListingDetalle(id)

// Guardar consulta de contacto
async function guardarConsulta(datos)

// Agregar/quitar favorito
async function toggleFavorito(usuarioId, listingId)
```

## Reglas de Seguridad Firestore
- Listings: lectura pública, escritura solo admin
- Usuarios: lectura/escritura solo el propio usuario
- Reseñas: lectura pública, escritura solo usuarios autenticados
- Consultas: escritura pública (formulario contacto), lectura solo admin

## Firebase Storage
- Carpeta `/listings/{id}/` para imágenes de cada listing
- Carpeta `/usuarios/{id}/` para fotos de perfil
- Imágenes: máximo 2MB, formatos jpg/webp
- Siempre subir versión optimizada (máx 1200px ancho)
