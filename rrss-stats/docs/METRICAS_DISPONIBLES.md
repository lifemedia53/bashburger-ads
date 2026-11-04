# Disponibilidad de métricas (Graph / Marketing API)

**Honestidad primero:** la columna "Verificada" está en **No** para todas porque en esta sesión no hubo token de Graph API. Lo que sí se comprobó con datos reales fue la identificación de cuentas y el listado de publicaciones (ver INFORME). Al ejecutar `probeMetrics()` la hoja DISPONIBILIDAD registra, por cuenta, qué métrica respondió OK / ERROR / NO DISPONIBLE. Los nombres de métrica salen de la documentación de Meta que conozco; **Meta renombra métricas con frecuencia** (p. ej. `impressions`/`plays` → `views`), por eso nada se da por bueno hasta que `probeMetrics()` lo confirme.

| Métrica solicitada | Plataforma | Vía oficial prevista | Verificada | Regla | Limitación / alternativa |
|---|---|---|---|---|---|
| Vistas totales | IG | `/{ig}/insights` `views` | No | Suma | Definición vs Business Suite: validar |
| Vistas totales | FB | Page Insights `page_media_view` | No | Suma | idem |
| Vistas orgánicas / pagadas | IG/FB | Sin split oficial a nivel cuenta | — | — | **Orgánico: NO DISPONIBLE** (no se calcula restando). Pagadas: Marketing API `impressions` (impresiones de anuncios, concepto distinto) |
| Alcance total | IG | `reach` | No | **No aditivo** (se consulta el mes completo) | Si la API rechaza el rango de 31 días queda NO DISPONIBLE; nunca se suman días |
| Alcance total | FB | `page_total_media_view_unique` | No | No aditivo | idem |
| Alcance pagado | IG/FB | Marketing API `reach` por `publisher_platform` | No | No aditivo | Solo anuncios |
| Interacciones | IG | `total_interactions` | No | Suma | — |
| Interacciones | FB | `page_post_engagements` | No | Suma | — |
| Clics en enlaces | IG | `profile_links_taps` | No | Suma | FB: sin métrica equivalente verificada |
| Visitas al perfil | IG / FB | `profile_views` / `page_views_total` | No | Suma | — |
| Seguidores totales (cierre) | IG | `followers_count` (solo valor actual) | No | **Saldo** | Cierre de mes pasado = actual − cambio neto diario posterior (`follower_count`, ≤30 días). Si no alcanza la ventana: NO DISPONIBLE. Recomendado: el diario guarda el saldo cada día |
| Seguidores totales (cierre) | FB | `followers_count` | No | Saldo | idem |
| Nuevos seguidores / bajas | IG | `follows_and_unfollows`, `follower_count` (neto) | No | Suma | Equivalencia con Business Suite sin verificar → PENDIENTE |
| Nuevos seguidores / bajas | FB | `page_daily_follows_unique`, `page_daily_unfollows_unique` | No | Suma | — |
| Cuentas involucradas | IG | `accounts_engaged` | No | No aditivo | — |
| Interacciones de publicaciones y reels | IG | `/{media}/insights` por contenido (CONTENIDOS) | No | Suma | Por contenido, no total de cuenta |
| Vistas e interacciones de historias | IG | `/{ig}/stories` + insights | No | — | **Solo 24 h de vida**: si el diario no corre, se pierde |
| Mensajes / contactos iniciados | IG/FB | Messaging API (`/conversations`) | No | — | Permisos extra; definición ≠ Business Suite → PENDIENTE |
| Horarios de mayor actividad | IG | `online_followers` | No | Texto | Instantánea reciente, no del mes. FB: sin equivalente verificado |
| Contenido con mejor rendimiento | IG | CONTENIDOS (vistas, o interacciones si no hay vistas) | No | — | Criterio registrado en CONTROL |

## Diferencias conocidas API vs Business Suite (a registrar en DIFERENCIAS_BSUITE)
- Zona horaria de los días: Business Suite usa la de la cuenta; algunas métricas de IG usan otro corte. Se consulta con medianoche de America/Santiago.
- "Alcance" de Business Suite puede incluir/excluir anuncios distinto a la API.
- Datos de las últimas 48 h pueden cambiar: el cierre mensual (día 2) reconsulta el mes completo.
