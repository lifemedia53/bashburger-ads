# Configuración de credenciales (lo que debe hacer Laura)

El sistema **no tiene ni guarda tokens**. Nunca pegues un token en el chat, en el Sheet ni en el repo.

## 1. App de Meta (una sola para todas las marcas)
1. https://developers.facebook.com → **Mis apps → Crear app** → tipo **Empresa** (Business). Nombre: `Life Media Stats`. Vincúlala al Business Manager de Life Media.
2. Agrega los productos **Instagram Graph API** y **API de Marketing**. (No hace falta Facebook Login.)
3. Permisos que necesita el token: `instagram_basic`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`, `read_insights`, `ads_read`, `business_management`. Opcionales (mensajes, etapa posterior): `instagram_manage_messages`, `pages_messaging`.
   - Solo lectura: **no** pidas permisos de escritura (`ads_management`, `pages_manage_posts`…).
4. Acceso: con activos de clientes, Meta puede exigir *Advanced Access* (revisión de app) o que cada cliente asigne sus activos a tu Business Manager. **[A verificar con Meta]**; Tony's Pasta ya figura en el Business Manager "Tony's Pasta" (cuenta publicitaria `1032681759334136`).

## 2. Usuario del sistema (token que no vence)
1. Business Settings → **Usuarios → Usuarios del sistema → Agregar** (rol *Empleado*). Nombre: `lm-stats-reader`.
2. **Asignar activos**: la Página *Tony's Pasta* (`1235804806272995`, control parcial/"ver estadísticas"), la cuenta de Instagram `@tonys.pasta` (`17841459832773317`) y la cuenta publicitaria `1032681759334136` (solo *Ver rendimiento*).
3. **Generar token** para la app `Life Media Stats` con los permisos del punto 1.3 y caducidad **Nunca**. Cópialo una sola vez.

## 3. Guardar el token en Apps Script
Proyecto de Apps Script → ⚙ **Configuración del proyecto → Propiedades de la secuencia de comandos → Agregar**:

| Propiedad | Valor |
|---|---|
| `META_ACCESS_TOKEN` | el token del usuario del sistema |
| `META_API_VERSION` | opcional, p. ej. `v23.0` (confirmar la vigente en developers.facebook.com/docs/graph-api/changelog) |
| `INCLUIR_NO_VALIDADOS` | opcional, `true` para que RESUMEN/DASHBOARD muestren meses aún sin validar |
| `META_TOKEN_<MARCA>` | opcional, solo si un cliente exige su propio token (ej. `META_TOKEN_TONY_S_PASTA`) |

## 4. Instalar el proyecto
Opción A (más simple): abre el Sheet → **Extensiones → Apps Script** → crea un archivo por cada `.gs` de `rrss-stats/src/` (mismo nombre) y reemplaza `appsscript.json` (Configuración → "Mostrar archivo de manifiesto").
Opción B: `clasp login` + `clasp create --type sheets --parentId 10fF2P9B7SjubbRau4x4P8zUpcL3EJ_u_ELZdL17W2-8 --rootDir rrss-stats/src`.

## 5. Orden de ejecución (primera vez)
1. `setupSheets()` — crea hojas/columnas nuevas **a la derecha**; no toca datos.
2. En **CONFIG** completa `ID Meta` de Tony's: Instagram `17841459832773317`, Facebook `1235804806272995`; y `Cuenta publicitaria (act_)` = `1032681759334136` en ambas filas.
3. `diagnose()` — revisa token, permisos y que cada ID responda. Resultado en CONTROL.
4. `probeMetrics("Tony's Pasta")` — prueba cada métrica contra la API real y la anota en **DISPONIBILIDAD**.
5. `runPilotTonysOctubre2026()` — hace **respaldo** del Sheet y extrae octubre 2026 a REGISTROS (estado `EXTRAÍDO`, RESUMEN y DASHBOARD no cambian).
6. Compara con Business Suite; registra diferencias con `recordBsuiteDifference(...)`.
7. `validateMonth("Tony's Pasta","Instagram","2026-10")` (y Facebook) — marca `VALIDADO` (queda bloqueado) y actualiza RESUMEN + DASHBOARD.
8. `setupTriggers()` — diario 06:00, cierre mensual día 2 a las 07:00 (America/Santiago), reintento cada 6 h.

## Seguridad
- Token solo en Propiedades del script; viaja por cabecera `Authorization`, no en URLs; todo mensaje de error pasa por `scrub_()`.
- Solo lectura: el código no usa ningún endpoint de escritura de Meta.
- Rotación: si el token se filtra, revócalo en Business Settings y genera otro; basta cambiar la propiedad.
