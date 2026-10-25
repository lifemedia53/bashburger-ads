# Propuesta de automatización de agentes — 2026-10-25

Fuentes: docs oficiales de Claude Code ([tareas programadas](https://code.claude.com/docs/en/routines), [subagentes](https://code.claude.com/docs/en/sub-agents)), ayuda de Google Business Profile ([crear posts](https://support.google.com/business/answer/7342169)), ayuda de Meta para empresas. Lo que dicen: un agente automático necesita un prompt autocontenido y permisos mínimos; los subagentes sirven para aislar contexto, no para trabajar solos; Meta recomienda dejar correr ≥7 días y no cambiar mucho en aprendizaje. Los docs de Meta/GBP consultados no traen novedades 2026 (no confirmado).

## Regla de oro
Un agente "trabaja solo" únicamente si hay una **rutina** que lo despierte. Las rutinas que yo creo desde una sesión **no traen conectores** (Meta, Drive, Notion, Trello). Para que tengan datos hay que crearlas en **Cowork** (como la de revisión Meta que ya funciona).

## Qué automatizar (por agente)
| Agente | Rutina propuesta | Cuándo | Conectores | Tocar dinero | Estado |
|---|---|---|---|---|---|
| paid-media / auditor Meta | Revisión Meta Ads (solo lectura) | lun, mié, sáb 8:40 | Meta, Drive | No | YA EXISTE en Cowork |
| paid-media | Carga de anuncios desde Sheet (crea en PAUSA, avisa) | lun a vie 9:00; solo si hay filas LISTO | Meta, Drive | No (pausa; activa el Jefe con OK) | Propuesta |
| local-seo-lead | Posts del mes a Trello | días 28 y 6 | Trello (Composio), Drive | No | YA EXISTE |
| local-seo-lead | Resultados de Google | día 7 | Drive | No | YA EXISTE |
| local-seo-lead | Correcciones de Vero → aprendizaje | lunes 9:00 | Trello | No | Propuesta (hoy va dentro del día 28/6) |
| local-seo-lead | Borradores de respuestas a reseñas (no publica) | miércoles | Google Business / Drive | No | Propuesta, depende de acceso a reseñas [DATO] |
| token-controller | Aviso de tokens + fila en token-log.csv | lunes 8:47 | repo | No | EXISTE; falla si se acaba el límite |
| stack-auditor | Chequeo de conectores rotos | día 1 | ninguno (lee config) | No | Propuesta |
| Jefe | Cierre de mes: facturas, cifras Meta+Justo | días 27, 30, 2 | Drive, Meta, Justo | No | YA EXISTEN (Cowork) |

## Prioridad (mi opinión)
1. **Carga de anuncios desde Sheet** — la que más tiempo te ahorra. Probarla primero a mano con paid-media-lead.
2. **Correcciones de Vero → aprendizaje semanal** — mejora a local-seo-lead cada semana.
3. El resto, solo si ves valor tras 2–3 semanas.

## Reglas para todas
- Solo lectura o "crear en pausa". Nunca pausar/activar/cambiar presupuestos sin OK de Laura.
- Informe siempre al final (Drive + mensaje corto, máx. 3 bloques).
- Si falla un conector: avisar en una línea y terminar, sin inventar.
- Usar Sonnet (Haiku para extracción). Costo estimado por corrida: US$0,10–0,40 (según token-log.csv).
- Una rutina nueva por vez; mirar 1 semana de resultados antes de sumar otra.

## Capacitación por agente (mensual, pedida por Laura)
- **paid-media-lead:** leer Ayuda de Meta (aprendizaje ≥7 días, cambios de presupuesto, fatiga creativa) → actualizar meta-ads-2026.json; 1 prueba A/B por mes; re-test: el caso Lotus (crear anuncio IG Direct inline) y el de topes que pausan campañas.
- **local-seo-lead:** reglas oficiales de posts de GBP (sin teléfonos/emails en el texto, Offers/Eventos con fechas, hoteles sin Offers) → geo-aeo-2026.json; aprender de las ediciones de Vero (borrador vs final); re-test: Steakhouse (carta correcta) y Bash ($13.990).
- **token-controller:** actualizar token-pricing.md; reporte por agente y por cliente cada lunes.
- **stack-auditor:** re-auditar conectores el día 1 y comparar con 2026-10-16-stack.json.
