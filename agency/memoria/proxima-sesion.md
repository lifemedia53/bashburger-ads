# Próxima sesión (actualizado el 2026-10-23, cierre de la sesión 7)

Abrir la sesión en **Sonnet** (ver `modelos.json`). Sesión corta: cada turno relee todo.

## Prompt para pegar al abrir la sesión

```
Hola Jefe. Sesión nueva en Sonnet. Lee agency/memoria/pendientes.md (sección 'Sesión 7'), agency/memoria/proxima-sesion.md y agency/memoria/presupuestos-ads.json y parte desde ahí.
Primero lo urgente de Meta (con mi OK, una cuenta a la vez): 1) Comercializadora: el conjunto Tráfico (120242998584350680) vence el 31-oct, extenderlo (Meta bloquea por el reel roto de un anuncio). 2) Bendito: boost ganador termina el 26-oct. 3) Lotus Estilistas: lunes 26-oct contar DMs y decidir. 4) Bombo Burger #14: crear 4 anuncios nuevos en pausa con vigencia hasta fines de octubre.
Luego: correr /gasto-ads-semanal, mapa de procesos + oficina isométrica web, y las auditorías que faltan (Lullaby, Lemarc, La Siciliana, Santerra).
Decisiones pendientes al final, en lista numerada. Respuestas cortas.
```

## Pendientes de la sesión 7 (fuente: Laura, Meta, Notion; 2026-10-23)
- **Comercializadora**: extender el fin del Conjunto Tráfico (120242998584350680, hoy 31-oct) a fines de noviembre. Meta lo rechaza por 'Ad Creative Is Incomplete: reel no disponible' en un anuncio del conjunto. Opciones: Laura lo hace en Ads Manager o autoriza archivar el anuncio roto. Presupuesto $200.000.
- **Bendito**: boost ganador termina 26-oct 22:07; falta decidir renovarlo, campaña de Mensajes (WhatsApp o DM), URL real de destino y OK para archivar 16 elementos. Presupuesto $100.000 (gastó $170.606 en 1-23 oct).
- **Entre Tacos**: Promociones e Interacción Delivery pausadas a propósito el 14-oct; Laura necesita análisis de resultados antes de reactivar. Presupuesto $100.000.
- **Tiki**: extender el boost de mensajes desde la app de Instagram (fin 18-oct); vincular @bombotikihouse al Business Manager para crear audiencias de IG; campaña `MENSAJES 2026 - TIKI HOUSE WHATSAPP` (solo House, $160.000/mes) pendiente del video de Carlos (tarea creada) y copy.
- **Mare**: guardar Maridaje WA para el próximo maridaje; noviembre $300.000; tarea creada para dataset/Cover Manager y cruzar conversaciones con reservas.
- **Steakhouse**: todo pausado/archivado; reactivar en noviembre con $150.000: UNA campaña de Tráfico (Tráfico Promo, conjunto nuevo, destino verificado, pixel). Faltan destino del botón Reservar y página desactivada.
- **Hostel**: pausado hasta noviembre; reactivar con $2.000/día ($60.000/mes).
- **Lotus Estilistas**: lunes 26-oct contar DMs (14 hasta hoy, sin WhatsApp), duplicar a objetivo Conversaciones cuando reconecte WhatsApp. Presupuesto ARS 300.000.
- **Lullaby**: cerrado, se deja como está. Presupuesto mensual [DATO].
- **Bombo Burger**: #13 se mide el 29-oct; #14 crear 4 anuncios nuevos en pausa; presupuesto $600.000 (gastó $689.861 en 1-23 oct).
- **Auditorías que faltan**: Lullaby (#89), Lemarc (#54), La Siciliana (#47), Santerra (#120); Meta no deja leer las 3 últimas.
- **Notion**: Follow up agregado; Resource Required nuevo; Laura corrige estados a mano. Fechas Deadline nuevas puestas (85 tareas). Tareas sin revisar: #1 Bash, #34 Comercializadora, #39/#41/#42 Entre Tacos (probablemente resueltas por la pausa del 14-oct), #104 Mare, #119 Santerra, #136 Tony's, 'Bloquear Santiago de Comer' (ya resuelto en la configuración actual), 'The Smile Mission', 'Crear ad: promo martes $11.990 Bombo Burger'.
- **Mapa de procesos + oficina isométrica web** (tarea en Notion): sin hacer.
- **Rutina semanal del gasto en ads**: crear en claude.ai con conector de Meta (Sonnet) que corra el skill `gasto-ads-semanal` cada lunes.
- **Meta, aprendizaje**: Meta bloquea editar boosts por API (solo app de Instagram) y publicar cambios en conjuntos con un anuncio roto; los informes de auditoría pueden llamar 'campaña' a un conjunto: verificar el tipo del id antes de actuar.

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
