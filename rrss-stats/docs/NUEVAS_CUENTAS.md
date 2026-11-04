# Incorporar una cuenta nueva (sin tocar el código)

1. En Business Manager asigna al usuario `lm-stats-reader` la Página, la cuenta de Instagram y (si hay pauta) la cuenta publicitaria del cliente.
2. En **CONFIG** agrega **una fila por plataforma**:
   - `Cliente` (el nombre exacto que se usará como Marca), `Plataforma` (`Instagram` o `Facebook`), `Activo` = `Sí`.
   - `ID Meta`: Instagram = ID de la cuenta profesional (ig-user-id); Facebook = ID de la Página.
   - `Cuenta publicitaria (act_)`: el número de la cuenta de anuncios (opcional; sin él "Vistas Ads/Alcance Ads" quedan PENDIENTE).
3. Ejecuta `diagnose()` y `probeMetrics("<Cliente>")`; revisa CONTROL y DISPONIBILIDAD.
4. Carga el histórico del cliente en REGISTROS con estado `HISTÓRICO` (bloqueado) si existe.
5. El diario del día siguiente la toma sola. Cuentas con `Activo` ≠ `Sí` se ignoran; cuentas sin `ID Meta` quedan `PENDIENTE` en CONTROL.

No se crean hojas ni proyectos por cliente: todo vive en REGISTROS/RESUMEN/CONTENIDOS con la columna Marca.
