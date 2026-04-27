# CLAUDE.md — Alma Mendocina

Bienvenido al proyecto Alma Mendocina. Antes de hacer cualquier cosa, leé esto.

## ¿Qué es este proyecto?
Plataforma web de turismo auténtico para Mendoza, Argentina. Creada por Sol, mendocina, para que los turistas descubran la provincia de verdad — como la viven los locales, sin intermediarios ni engaños.

## Cómo trabajar en este proyecto

### 1. Siempre leé los skills primero
Los skills en `.claude/skills/` definen TODO sobre el proyecto:
- `proyecto.md` — estructura de archivos y stack
- `diseno-visual.md` — colores, tipografía, componentes UI
- `firebase.md` — estructura de datos y reglas
- `contenido-i18n.md` — sistema de idiomas y tono de voz
- `git-workflow.md` — cómo hacer commits y branches

### 2. Usá el agent correcto según la tarea
Los agents en `.claude/agents/` definen el rol a adoptar:
- `desarrollador.md` — para tareas de código
- `redactor-contenido.md` — para tareas de contenido/textos
- `revisor.md` — para revisar antes de pushear a main

### 3. Reglas de oro
- **Español siempre** — código comentado en español, comunicación en español
- **Mobile-first siempre** — verificar en mobile antes de dar por terminado
- **Nunca credenciales en el código** — usar .env
- **Commits descriptivos** — siguiendo la convención del skill git-workflow

## Stack resumido
- HTML + CSS + JavaScript vanilla
- Firebase v9 (Firestore, Auth, Storage)
- GitHub Pages (deploy)

## Contacto del proyecto
Proyecto personal de Sol — mendocina, creadora de Alma Mendocina.
