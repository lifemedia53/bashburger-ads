# Próxima sesión (actualizado el 2026-10-18, cierre de la sesión 6)

Abrir la sesión en **Sonnet** (ver `modelos.json`). Sesión corta: cada turno relee todo.

## Prompt para pegar al abrir la sesión

```
Hola Jefe. Sesión nueva en Sonnet. Lee agency/memoria/pendientes.md, agency/memoria/proxima-sesion.md, agency/memoria/criterios-prioridad.json y agency/memoria/prompts-meta.md y parte desde ahí.

Tema de hoy: seguir ordenando prioridades de All Tasks en Notion. Ya están aplicadas las tareas 1 a 100 (ver estado_proceso en agency/memoria/prioridades-propuesta.json). Sin releer las tareas ya hechas.
1. Mostrarme los lotes de ~10 desde #101 hasta #138 (la tabla ya está en el json; no relanzar a ops-coordinator). Yo apruebo, tú cambias Priority en Notion (tengo permiso de Laura para Priority; nunca borrar) y verificas por muestra.
2. Al final: las 9 tareas [DATO] sin responder y las de septiembre abiertas (#64, #65, #80, #86, #87, #98, #99, #100 y el resto del json con flag_septiembre): marcarlas 'posible hecha sin cerrar' en bloque aparte y preguntarme; no cerrar.
3. Luego fechas por lotes aprobados.
4. Después: mapa de procesos + oficina isométrica web (tarea en Notion).
Cierra según CLAUDE.md (incluye anotar en la Bitácora todo cambio en Meta). Decisiones pendientes al final, en lista numerada. Respuestas cortas.
```

## Otros pendientes (decisión de Laura, 2026-10-18)
- **Funnel por cliente** (conversión por ubicación + secuencia de eventos del pixel por etapa): se hace a inicio de mes. Muestra con The Cool Hostel y Bombo Burger. Tarea en Notion creada. Puede costar >US$1: avisar antes.
- **Subida de anuncios en pausa desde Drive + Sheet**: agente nuevo `ad-uploader` (`.claude/agents/ad-uploader.md`), siempre en pausa, ensayo primero. Para que corra solo cada día hay que crear una rutina en claude.ai (no desde la sesión: la herramienta no puede darle conectores en esta organización) con los conectores Google Drive y Meta y el modelo Sonnet. Mientras tanto se ejecuta a pedido. Falta: Sheet por cliente con columnas título, variaciones de copy, CTA, cuenta de Ads Manager, conjunto, carpeta de Drive; cliente del ensayo.
- **Lotus Estilistas**: REMARKETING MENSAJES sigue activa sin mensajes medidos; se pausó solo el ad 1.C de CJ 2. Subir presupuesto solo si llegan mensajes; confirmar que mide mensajes.
- **Lullaby**: post de perfil/grupos y rediseño del hotsheet (presentar lunes 19-oct); Laura define la fecha de publicación el lunes.
- **Tiki House**: falta ID de la cuenta Meta (no está en memoria) para leer sus 2 anuncios. Instagram de competidores sin verificar.
- Tareas nuevas en Notion (sin hacer): Apple Maps, Bing Places y Yelp, Preferred Sources de Google, Instagram en Search Console (después), servicios en GBP + página por servicio (Pressures Perfect, local-seo-lead).
- Hostel: Laura no quiere seguir con la medición por ahora ("seguiremos a ciegas"); las 4 entradas P2 del Hostel en la Bitácora siguen "En seguimiento": decidir si pasan a Descartado.
- Fechas vencidas y campañas sin entrega de Entre Tacos, Steakhouse, Tiki y Comercializadora (P1 Bitácora, 10-oct), una cuenta a la vez con OK.
- Bash Burger, Reel Delivery UberEats: refrescar creativo y bajar presupuesto sin pausar en seco. Mare, Steakhouse, Bendito, Tiki: boosts de mensajes a campaña estructurada (fuente: auditoría del 16-oct en Notion).
- Bombo, test CJ Delivery: remedir el 2026-10-24 (120249348553550141, cuenta 362765604642572).

## Rutinas programadas (crearlas desde claude.ai, no desde la sesión)
Aprobadas por Laura el 2026-10-18; sin conectores no leen Meta, Notion ni Trello. Crearlas en la pantalla de rutinas de claude.ai activando el conector indicado y poniendo el modelo a mano.

| Rutina | Cuándo | Conector | Modelo |
|---|---|---|---|
| Auditoría de agentes | cada 5 días, 09:17 (Chile) | Notion, Composio (Trello) | Sonnet |
| Seguimiento Paid Media (Hostel + test Bombo) | cada 3 días, 09:23 | Meta | Sonnet |
| Revisión semanal de Notion (ops-coordinator) | lunes 08:12 | Notion | Haiku |
| Subidor de anuncios en pausa (`ad-uploader`), después del ensayo | diaria | Google Drive, Meta | Sonnet |

Prompts de las 3 primeras (pegar tal cual):

**Auditoría de agentes**
> Eres el Jefe de la agencia Life Media (repo lifemedia53/bashburger-ads; si no está en tu directorio, agrégalo con add_repo y clónalo). Lee CLAUDE.md, agency/memoria/pendientes.md y agency/memoria/modelos.json. Audita a paid-media-lead, local-seo-lead, meta-ads-auditor, ops-coordinator, token-controller, market-trends-analyst y ad-uploader con la rúbrica de agency/capacitacion/plan.json y los KPI de agency/memoria/agentes.json, con evidencia real de los últimos 5 días: Trello (solo lectura, vía Composio; ids en agency/memoria/trello.json), Notion (Bitácora de hallazgos Ads y All Tasks, solo lectura) y agency/logs/*.csv. Si un agente no trabajó, anótalo como "sin actividad" y di por qué. Sin fuente, [DATO]. Guarda el resultado en agency/auditorias/<fecha>-ciclo.json, actualiza nota_ultima_auditoria en agency/memoria/agentes.json, commit, push a rama nueva, PR y merge a main. No modifiques Meta, Notion ni Trello. Entrega a Laura (push) máx. 5 líneas: nota por agente, el error más importante y 1 decisión pendiente. Español de Chile, tono amistoso.

**Seguimiento Paid Media**
> Eres el Jefe de la agencia Life Media (repo lifemedia53/bashburger-ads; si no está en tu directorio, agrégalo con add_repo y clónalo). Lee CLAUDE.md y agency/memoria/pendientes.md. Seguimiento de Meta SOLO LECTURA. (1) Hostel: campaña 120249343804190575, cuenta 1428593511882773: gasto, impresiones, clics y eventos Purchase del pixel 1487303793186321 desde el 10-oct y la estrategia vigente del Hostel según pendientes.md. (2) Bombo test CJ Delivery 120249348553550141, cuenta 362765604642572: costo por Iniciar pago vs base $2.165; cierre 2026-10-24. (3) Lotus Estilistas, cuenta 2150099018564052: campaña REMARKETING MENSAJES, gasto, impresiones y si mide mensajes. No actives, pauses ni edites nada en Meta, Notion ni Trello. Si algo importante cambió, actualiza pendientes.md con fuente y fecha (commit, push, PR, merge). Entrega a Laura (push) máx. 3 líneas con números y, si corresponde, 1 decisión. Español de Chile, tono amistoso.

**Revisión semanal de Notion**
> Es lunes. Usa el agente ops-coordinator del repo lifemedia53/bashburger-ads (si no está en tu directorio, agrégalo con add_repo y clónalo; definición en .claude/agents/ops-coordinator.md). Revisa en Notion, SOLO LECTURA: All Tasks (vencidas, y hechas sin cerrar) y la Bitácora de hallazgos Ads (P1 y P2 abiertos). No modifiques nada. Entrega a Laura (push) la lista corta de prioridades de la semana: máx. 5 ítems con cliente, qué falta y fecha. Si no hay nada vencido, dilo en 1 línea. Español de Chile, breve.
