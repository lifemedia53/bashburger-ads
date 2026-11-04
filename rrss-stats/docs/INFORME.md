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
