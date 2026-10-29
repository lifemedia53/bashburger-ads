# Paid Media · Bash Burger y Steakhouse by Bombo · 2026-10-29

Solo lectura. No se creó, editó, activó ni pausó nada en Meta, Notion ni Trello.
Fuentes: Meta lectura 2026-10-29 (cuentas 1753718285299909 y 1642000733624651), Notion lectura (3 tareas), planes.json, presupuestos-ads.json, clientes.json, playbook-life-media.json, voz/bash-burger.json, voz/steakhouse-by-bombo.json, pendientes.md (Sesión 11 y 12).
Justo POS: el conector falló hoy (ERR_PROXY_TUNNEL). Todo cruce con ventas = [DATO].

---

## Tarea 1 · Bash Burger · Tráfico Delivery (frecuencia 4,5 y sin medición)

**Hallazgo (Meta lectura 29-oct)**
- La frecuencia 4,5 de la tarea es acumulada de 90 días: 4,41 (reach 108.971; gasto $314.009; 481.050 impresiones; 10.003 clics). Con ventana corta no hay emergencia: 7 días 2,08 (CTR 2,03%, $38/clic, gasto $49.023); octubre 3,59; 28 días del anuncio 'Reel Delivery UberEats' 3,03 (CTR 2,06%, $40/clic, $199.642). El reel se acerca a 3,5 pero aún no lo pasa, y el CTR no cae.
- Campaña activa: 'Tráfico Delivery' (120245826099520019), $7.142/día, objetivo LINK_CLICKS, destino Uber Eats. Sin pixel ni dataset en la cuenta (0 datasets, Meta lectura 29-oct): los pedidos no se miden en Meta, solo clics.
- **Alerta de presupuesto:** gasto de octubre $230.781 de $200.000 contratado (115%, ROJA según presupuestos-ads.json). Composición: Tráfico Delivery $199.692 + boost nuevo '¿ENSALADA DE POLLO...' $31.089 (campaña 120253724430440019, ACTIVA, 28 días $29.338, CTR 1,77%, $66/clic, destino WEBSITE). Quién lo creó y su tope: [DATO] (Laura hace boosts desde el celular, clientes.json). Hasta el 31-oct, solo Delivery suma unos $14.000 más: cierre estimado sobre $245.000 (proyección mía, no dato de Meta).
- Contrato: 2 campañas Meta + 1 boost (planes.json). Hoy hay 1 campaña activa + 1 boost: dentro de lo contratado. Las otras 2 ('Tírate una paya', 'Reconocimiento Jul-Sep') están PAUSED en $0.
- Ventas / ROAS: [DATO]. Justo no respondió, y además Uber Eats puede no pasar por Justo; hay que confirmar con Laura de dónde sale el dato de pedidos Uber.

**Recomendación única (propuesta para OK de Laura; no ejecutada)**
Para noviembre, ajustar Tráfico Delivery de $7.142/día a unos $5.000/día (~$150.000/mes) y dejar los ~$50.000 restantes como tope para el boost, para calzar con los $200.000. Un reel nuevo (pedir a Creative Team vía Notion) entra cuando el actual toque frecuencia 3,5 en 7 días. No subir presupuesto antes de tener ventas Uber vs Justo de la semana. Mientras no haya pixel, medir por comparación semanal de pedidos Uber Eats contra clics de Meta.

**OK que necesita Laura:** (a) bajar el diario de Delivery a ~$5.000 desde el 1-nov (lo ejecuta el Jefe); (b) confirmar el tope del boost de ensalada y si lo dejó ella; (c) de dónde saco las ventas Uber para el cruce.

---

## Tarea 2 · Audiencias A-001 a A-005 (Bash y Steakhouse)

**Estado actual (Meta lectura 29-oct, creadas el 25-oct) vs 28-oct**

| Audiencia | Bash 29-oct | Steakhouse 29-oct | 28-oct |
|---|---|---|---|
| A-001 Mensajes IG 30d | ACTIVE, 1.000 | INACTIVE, 1.000 | Bash 1.000 / Steak inactiva: igual |
| A-002 Mensajes IG 180d | ACTIVE, 1.000 | ACTIVE, 1.000 | igual |
| A-003 Video 95% 30d | INACTIVE, 1.000 | INACTIVE, 1.000 | igual |
| A-004 Guardaron IG 30d | INACTIVE, 1.000 | INACTIVE, 1.000 | igual |
| A-005 Visitó perfil 30d | ACTIVE, 2.900-3.400 | ACTIVE, 1.200-1.400 | Bash 3.000-3.500 (leve baja; el 27-oct figuraba 2.300-2.700); Steak 1.000-1.100 (sube) |

- "1.000" es el piso que muestra Meta (rango 1.000-1.000), no una cifra exacta: puede haber menos de 1.000 reales.
- Las reglas están bien armadas (A-001 = `ig_business_profile_user_messaged` en el IG de cada cuenta; A-003 Bash = `video_completed` de 3 videos de la página). No hay error de evento: el problema es volumen. Las cuentas casi no reciben DMs (señal de mensajes baja) y los videos 95% se alimentan con campañas de video/Reconocimiento, que hoy están pausadas.
- Código de operación 441 en las tres que leí en detalle (Bash A-001, A-003, Steakhouse A-001): su significado exacto lo dejo como [DATO], no lo asumo.

**Recomendación única:** no recrear ni "corregir eventos" ahora (no hay evento roto). Usar solo A-005 como público de remarketing mientras las demás sigan en el piso, y volver a leer todo el 5-nov (dos semanas desde la creación; Meta puede tardar). Si A-001..A-004 siguen en 1.000 en esa fecha, aceptar que no tienen volumen y no armar campañas que dependan de ellas. Para que A-003 crezca haría falta un Reconocimiento de video, fuera de contrato y de presupuesto hoy: no lo propongo.

**OK que necesita Laura:** ninguno hoy. Solo confirmar la relectura del 5-nov (la hace Paid Media en lectura).

---

## Tarea 3 · Steakhouse by Bombo · sin pixel ni públicos, 6 anuncios WITH_ISSUES, nomenclatura

**Hallazgo (Meta lectura 29-oct)**
- Públicos: ya no son 0 (el hallazgo del 10-oct quedó viejo). Existen A-001..A-005 desde el 25-oct (ver tarea 2) más 1 LAL 1% inactivo.
- Pixel/dataset: sigue en 0 datasets (ads_get_datasets).
- WITH_ISSUES: hoy no aparece ninguno. De 17 anuncios, ninguno con ese estado; 4 PAUSED y 13 CAMPAIGN_PAUSED/ADSET_PAUSED. Los 6 del 10-oct ya no se reproducen: [DATO] si Laura los arregló o Meta cambió el estado.
- Estructura: 6 campañas, todas PAUSED, ninguna activa (decisión de Laura 23-oct). Gasto 90d: Tráfico Promo $487.986, Reconocimiento $96.377, boost 'Agosto tiene un mejor...' $51.514; 'Tráfico Abril - Diciembre', 'Reconocimiento 1 Enero-Marzo' y 'Prueba: Reconocimiento 1' sin gasto en 90d y aún PAUSED (no archivadas).
- Nomenclatura: todo genérico ('Reconocimiento', 'Trafico Promo', 'Conjunto Promos', 'Reel 2 Reconocimiento'), fuera del estándar [TIPO] [AÑO] / CJ X.Y / AD X.Y.LETRA del playbook. El CTA BOOK_TRAVEL que anotó el auditor el 10-oct no lo releí hoy: [DATO].
- Contrato: ESENCIAL, 1 campaña Meta (planes.json). Noviembre: $150.000 en UNA campaña de Tráfico, con OK de Laura (clientes.json y presupuestos-ads.json, 23-oct). No reactivar Tráfico Promo.

**Recomendación única (propuesta; no ejecutada)**
No crear pixel. Los destinos posibles (Uber Eats, carta spleatweb, CoverManager que es el de Mare) son sitios externos, así que un pixel no mediría nada. En noviembre crear UNA campaña nueva con nombre estándar ('TRAFICO 2026 - Steakhouse', CJ 1.1, AD 1.1.A), presupuesto por conjunto ~$5.000/día (= $150.000 en 30 días), optimizando a clics, y dejar las 6 viejas sin tocar o archivadas (nunca borradas) con tu OK. Los copys salen de la Biblioteca (Cowork) sin nombrar platos ni tomahawk (voz/steakhouse-by-bombo.json).

**Bloqueos antes de lanzar ([DATO])**
destino del tráfico (Uber, carta o reserva; el link de reserva es el de Mare); horario y días; carta vigente; gráfica del Creative Team.

**OK que necesita Laura:** (a) aprobar la campaña única de Tráfico de $150.000 con inicio en noviembre (fecha de inicio a definir); (b) decidir el destino; (c) autorizar archivar las 3 campañas sin gasto (opcional, tarea Low con deadline 12-nov).
