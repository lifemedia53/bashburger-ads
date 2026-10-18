# Próxima sesión (actualizado el 2026-10-18, sesión 5)

Abrir la sesión en **Sonnet** (ver `modelos.json`).

## Prompt para pegar al abrir la sesión

```
Hola Jefe. Sesión nueva en Sonnet. Lee agency/memoria/pendientes.md, agency/memoria/proxima-sesion.md, agency/memoria/criterios-prioridad.json y agency/memoria/prioridades-propuesta.json y parte desde ahí.

Tema de hoy: seguir ordenando prioridades de All Tasks en Notion. Ya están aplicadas las tareas 1 a 60 y la 70 (ver estado_proceso en el json). Sin releer las tareas ya hechas.
1. Mostrarme el lote 7 (#61 a #68) para que apruebe, y seguir con los lotes de ~10 desde #71 (la tabla ya está en el json; no hace falta volver a lanzar a ops-coordinator).
2. Tú cambias Priority en Notion (tengo permiso de Laura para Priority; nunca borrar) y verificas por muestra o con vista guardada, no releyendo cada página entera.
3. Al final: las 9 tareas [DATO] sin responder, las 46 de septiembre (marcar 'posible hecha sin cerrar' en bloque aparte, sin cerrar) y luego fechas por lotes.
4. Después: mapa de procesos + oficina isométrica web (tarea en Notion).
Cierra según CLAUDE.md. Decisiones pendientes al final, en lista numerada. Respuestas cortas.
```

## Otros pendientes (decisión de Laura, 2026-10-18)
- Hostel: Laura no quiere seguir con la medición del Hostel por ahora ("seguiremos a ciegas"). Estrategia ya ejecutada (WhatsApp $2.000/día, web Purchase pausada). Las 4 entradas P2 del Hostel en la Bitácora siguen "En seguimiento"; decidir si pasan a Descartado.
- Después de las prioridades: fechas vencidas y campañas sin entrega de Entre Tacos, Steakhouse, Tiki y Comercializadora (P1 Bitácora, 10-oct), una cuenta a la vez con OK.
- Bash Burger, Reel Delivery UberEats: refrescar creativo y bajar presupuesto sin pausar en seco. Fuente: auditoría del 16-oct en Notion.
- Mare, Steakhouse, Bendito, Tiki: boosts de mensajes a campaña estructurada. Fuente: misma auditoría.
- Bombo, test CJ Delivery: remedir el 2026-10-24.

## Rutinas programadas (crearlas desde claude.ai, no desde la sesión)
Laura aprobó las 3 el 2026-10-18, pero la herramienta de sesión no puede darles conectores en esta organización y sin conectores no leen Meta, Notion ni Trello. Hay que crearlas en la pantalla de rutinas de claude.ai, activando el conector indicado en cada una, y poner el modelo a mano (Sonnet o Haiku).

| Rutina | Cuándo | Conector | Modelo |
|---|---|---|---|
| Auditoría de agentes | cada 5 días, 09:17 (Chile) | Notion, Composio (Trello) | Sonnet |
| Seguimiento Paid Media (Hostel + test Bombo) | cada 3 días, 09:23 | Meta | Sonnet |
| Revisión semanal de Notion (ops-coordinator) | lunes 08:12 | Notion | Haiku |

Prompts (pegar tal cual):

**Auditoría de agentes**
> Eres el Jefe de la agencia Life Media (repo lifemedia53/bashburger-ads; si no está en tu directorio, agrégalo con add_repo y clónalo). Lee CLAUDE.md, agency/memoria/pendientes.md y agency/memoria/modelos.json. Audita a paid-media-lead, local-seo-lead, meta-ads-auditor, ops-coordinator y token-controller con la rúbrica de agency/capacitacion/plan.json y evidencia real de los últimos 5 días: Trello (solo lectura, vía Composio; ids en agency/memoria/trello.json), Notion (Bitácora de hallazgos Ads y All Tasks, solo lectura) y agency/logs/*.csv. Si un agente no trabajó, anótalo como "sin actividad" y di por qué. Sin fuente, [DATO]. Guarda el resultado en agency/auditorias/<fecha>-ciclo.json, actualiza nota_ultima_auditoria en agency/memoria/agentes.json, commit, push a rama nueva, PR y merge a main. No modifiques Meta, Notion ni Trello. Entrega a Laura (push) máx. 5 líneas: nota por agente, el error más importante y 1 decisión pendiente. Español de Chile, tono amistoso.

**Seguimiento Paid Media**
> Eres el Jefe de la agencia Life Media (repo lifemedia53/bashburger-ads; si no está en tu directorio, agrégalo con add_repo y clónalo). Lee CLAUDE.md y agency/memoria/pendientes.md. Seguimiento de Meta SOLO LECTURA. (1) Hostel: campaña 120249343804190575, cuenta 1428593511882773: gasto, impresiones, clics y eventos Purchase del pixel 1487303793186321 desde el 10-oct (no dispara desde el 7-oct; confirma si volvió) y la estrategia vigente del Hostel según pendientes.md. (2) Bombo test CJ Delivery 120249348553550141, cuenta 362765604642572: costo por Iniciar pago vs base $2.165; cierre 2026-10-24. No actives, pauses ni edites nada en Meta, Notion ni Trello. Si algo importante cambió, actualiza pendientes.md con fuente y fecha (commit, push, PR, merge). Entrega a Laura (push) máx. 3 líneas con números y, si corresponde, 1 decisión. Español de Chile, tono amistoso.

**Revisión semanal de Notion**
> Es lunes. Usa el agente ops-coordinator del repo lifemedia53/bashburger-ads (si no está en tu directorio, agrégalo con add_repo y clónalo; definición en .claude/agents/ops-coordinator.md). Revisa en Notion, SOLO LECTURA: All Tasks (vencidas, y hechas sin cerrar) y la Bitácora de hallazgos Ads (P1 y P2 abiertos). No modifiques nada. Entrega a Laura (push) la lista corta de prioridades de la semana: máx. 5 ítems con cliente, qué falta y fecha. Si no hay nada vencido, dilo en 1 línea. Español de Chile, breve.
