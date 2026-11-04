# Informe de estado — Estadísticas RRSS (piloto Tony's Pasta) · 2026-11-04

## Verificado con datos reales (solo lectura)
| Hecho | Fuente |
|---|---|
| Página Facebook *Tony's Pasta* ID `1235804806272995` | Meta (ads_get_ad_account_pages) |
| Instagram `@tonys.pasta` ID `17841459832773317`, vinculado a la cuenta publicitaria | Meta (ads_get_ig_accounts) |
| Cuenta publicitaria "Tonys Pasta LM" `1032681759334136`, ACTIVE, CLP, Business Manager "Tony's Pasta" | Meta (ads_get_ad_accounts) |
| Se pueden listar las publicaciones de IG (17+ items, la última 2026-11-03, con likes y comentarios) | Meta (ads_get_ig_media) |
| El Sheet central existe, con las 9 hojas descritas; CONFIG tiene `ID Meta` vacío y `Conexión API = PENDIENTE` | Google Drive (lectura) |

## NO verificado (bloqueado por falta de acceso)
- **Insights reales** (vistas, alcance, seguidores, etc.): no hay token de Graph API en esta sesión; el conector de Meta disponible es solo de anuncios y no expone insights de cuenta. → **Etapa D (extracción real de octubre y cotejo con Business Suite) NO realizada.**
- Permisos efectivos del token y si hace falta *Advanced Access*.
- Versión vigente de la API y nombres exactos de métricas (ver METRICAS_DISPONIBLES.md).
- **El Sheet NO fue modificado.** El conector de Drive de esta sesión es de solo lectura sobre celdas (`canEdit:false`); todo el código escribe desde dentro de Apps Script una vez instalado.
- **El proyecto de Apps Script NO está desplegado** (no hay sesión de `clasp` ni acceso a script.google.com). El código está listo para pegar/`clasp push`.

## Código desarrollado (rrss-stats/src)
Config (catálogo de métricas y limitaciones) · Util (fechas America/Santiago, claves, scrub) · MetaApi (reintentos exponenciales, token por cabecera) · Extractors (IG, FB, Ads, contenido, seguidores, horarios) · Normalize (estados CERO/NO DISPONIBLE/ERROR/PENDIENTE) · Store (upsert idempotente, bloqueo de histórico/validado) · Summary (RESUMEN, DASHBOARD, variaciones) · Main (diario, cierre mensual, piloto, validación, diferencias vs Business Suite) · Diagnostics (diagnose, probeMetrics) · Triggers (activadores + recuperación).

## Probado (simulado, `node rrss-stats/tests/run-tests.js` → 46/46 OK)
Fechas y zona horaria · cero vs nulo vs error · alcance nunca sumado · reintentos y clasificación de errores · token fuera de URLs, hojas y mensajes · upsert idempotente (repetir no duplica; corregir actualiza la misma fila) · histórico/VALIDADO no se sobrescriben y la diferencia queda en CONTROL · lectura fallida no pisa valor bueno · RESUMEN/DASHBOARD solo con períodos validados · variación abs/% (sin % si el anterior es 0) · dashboard no pisa fórmulas · cuenta sin ID queda PENDIENTE · falla total no aborta.
**Son pruebas con datos simulados y un Sheet en memoria; no prueban la API real ni el comportamiento real de SpreadsheetApp/ScriptApp.**

## Pendiente
1. Laura: crear app + usuario del sistema + token (docs/SETUP.md) y completar IDs en CONFIG.
2. Instalar el proyecto, correr `diagnose()` y `probeMetrics()`; ajustar nombres de métricas según DISPONIBILIDAD.
3. Etapa D: octubre 2026, cotejo con Business Suite, `validateMonth()`.
4. Probar triggers reales (`setupTriggers()` no se pudo ejecutar aquí).
5. Mensajes/contactos (Messaging API), Nuevos seguidores/Bajas de IG y FB: equivalencias por validar.
6. Facebook: contenido (posts) aún no extraído; solo métricas de página.
7. Posible mejora: guardar saldo de seguidores diario en hoja propia para cierres exactos.

## Actualización 2026-11-04 (noche) — prueba real con token
- Verificado con datos reales: `diagnose()` OK (token, permisos, Tony's IG y FB). `probeMetrics()`: IG views, total_interactions, profile_views, profile_links_taps, followers_count, online_followers y Marketing API (impressions, reach) OK; FB page_media_view, page_total_media_view_unique, page_post_engagements, page_views_total, follows/unfollows OK.
- Hallazgo: IG `reach` y `accounts_engaged` fallan en rangos >30 días (error #100). Meses de 31 días → NO DISPONIBLE (no se suma); ingreso con `setManualValue()`.
- Seguidores de cierre en meses cerrados: PENDIENTE (la API solo da saldo actual).
- Pruebas simuladas: 52/52.

## Informe final — 2026-11-04 (piloto Tony's Pasta, sep y oct 2026)

### Verificado con datos reales
- Conexión: token de usuario del sistema, permisos concedidos y cuentas de Tony's (IG, FB, anuncios) respondiendo OK (`diagnose`).
- Extracción real de **septiembre y octubre 2026** (IG + FB + Marketing API), validada y bloqueada (`VALIDADO`) por Laura; RESUMEN y DASHBOARD alimentados y funcionando.
- Cotejo octubre vs Business Suite: IG vistas 147.512 = 147.512 (exacto); IG nuevos seguidores 572 = 572 (exacto); IG interacciones 1.327 ≈ 1,3 mil; IG visitas 2.738 ≈ 2,7 mil; IG alcance 38.047 (días 1-30) vs 39,9 mil (mes completo, coherente); FB vistas 14.296 ≈ 14,3 mil; FB alcance 4.734 ≈ 4,7 mil; FB visitas 42 = 42; FB nuevos seguidores 1 = 1.
- Clics en enlaces: Marketing API `inline_link_clicks` vs Business Suite: IG 619 vs 638 (-3%), FB 211 vs 209 (+1%). Decisión de Laura: usarlo como "Clics en enlaces" rotulado APROXIMADO.
- Activadores creados (CONTROL registra `ACTIVADORES`: runDaily, runMonthlyClose, retryFailed).

### Probado solo con datos simulados (76 pruebas, `node rrss-stats/tests/run-tests.js`)
Cálculos, claves, duplicados, estados del dato, reintentos, seguridad del token, upsert idempotente, bloqueo de histórico/validado, manejo de zona horaria del Spreadsheet, conversión de fechas de Sheets, fórmulas del DASHBOARD, `setupTriggers` (mock de ScriptApp).
**Aún sin observar en producción:** la primera ejecución automática de `runDaily` (06:00) y la creación de la hoja `SALDOS_SEGUIDORES`; el cierre automático del día 2.

### Errores propios encontrados en el Sheet real (las pruebas simuladas no los vieron) y corregidos
1. Google Sheets convertía "2026-10" en fecha → la clave no coincidía → filas duplicadas. (Mock ahora reproduce la conversión.)
2. `repararDuplicados` leyó fechas con la zona del script y el Spreadsheet usa otra → 11 filas corridas a septiembre. (Ahora usa la zona del Spreadsheet y restaura el mes desde la Clave.)
3. Fórmula con comas fallaba (#ERROR!) en el formato regional es-CL; "" vale 0 en una resta; fórmulas previas del DASHBOARD mostraban 0 donde no hay dato. (Corregido con `repararDashboard`.)
Lección: toda lógica que toca el Sheet debe verificarse contra el Sheet real (descargar y revisar) antes de darla por terminada.

### Límites conocidos de la API (documentados)
- IG `reach`/`accounts_engaged`: máximo 30 días por consulta → en meses de 31 días se usa la ventana días 1-30, rotulada; nunca se suman alcances.
- Seguidores al cierre: meses con cierre fuera de los últimos 30 días y sin snapshot → NO DISPONIBLE (septiembre). Octubre es DERIVADO (±1 día de cambio neto). Desde el 5-nov el saldo diario permite cierres exactos.
- Sin split orgánico/pago a nivel de cuenta: Vistas/Alcance orgánicos NO DISPONIBLE; los de anuncios van aparte (Marketing API).

### Pendiente
1. Confirmar la primera corrida diaria (hoja `SALDOS_SEGUIDORES`, filas nuevas en REGISTROS del mes en curso) y el cierre del día 2.
2. FB "Interacciones con el contenido" (BS=5; la API a nivel página solo da 2 reacciones): sin equivalente verificado → PENDIENTE.
3. Mensajes / contactos iniciados (Messaging API, permisos extra) y vistas/interacciones de historias (se capturan solo en vivo; revisar que el diario las guarde).
4. Contenido de Facebook (posts) no extraído; solo IG en CONTENIDOS.
5. Comparar el cierre de seguidores derivado de octubre con Business Suite.
6. Incorporar las demás marcas (docs/NUEVAS_CUENTAS.md): cada cliente con portfolio propio debe compartir activos con Life Media.
7. Rotación/vigencia del token; revisar permisos de la app si Meta cambia métricas (`probeMetrics` / `probeCandidates` sirven de diagnóstico).
