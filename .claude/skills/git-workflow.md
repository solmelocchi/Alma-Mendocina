# Skill: Flujo de Trabajo Git

## Repositorio
- GitHub: repositorio de Alma Mendocina
- Branch principal: `main`
- Deploy: GitHub Pages desde `main`

## Flujo de Trabajo
Siempre trabajar en branches separadas, nunca commitear directo a main.

```bash
# 1. Antes de empezar cualquier feature
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo

# 2. Durante el trabajo — commits frecuentes y descriptivos
git add .
git commit -m "feat: descripción de lo que hace"

# 3. Al terminar — push y merge
git push origin feature/nombre-descriptivo
# Luego merge a main desde GitHub o localmente
```

## Convención de Commits
Usar prefijos descriptivos en español:
- `feat:` — nueva funcionalidad
- `fix:` — corrección de bug
- `style:` — cambios de CSS/diseño (sin cambios de lógica)
- `refactor:` — mejora de código sin cambiar funcionalidad
- `content:` — agregar/editar contenido (listings, textos)
- `config:` — cambios de configuración
- `docs:` — documentación

### Ejemplos
```
feat: agregar slide-in de detalle para alojamientos
fix: corregir selector de idioma en mobile
style: ajustar espaciado de cards en tablet
content: agregar 5 nuevos listings de viñedos
config: configurar Firebase Storage rules
```

## Branches Comunes del Proyecto
- `main` — producción
- `feature/firebase-backend` — integración Firebase
- `feature/chat-ia` — chat planificador con IA
- `feature/panel-admin` — panel de administración

## Archivos que NUNCA van al repo
El `.gitignore` debe incluir:
```
.env
.env.local
firebase-config.js   # si tiene credenciales
node_modules/
*.log
.DS_Store
```
