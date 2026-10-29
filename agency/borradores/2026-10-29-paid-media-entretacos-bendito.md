# Paid Media: Entre Tacos y Bendito Completo (2026-10-29)

Meta solo lectura, releído en vivo hoy 29-oct (ads_get_ad_entities campaña/conjunto/anuncio con rangos 1-29 oct, 7d y 90d; log de actividad; datasets; públicos; errores). Nada creado, pausado ni editado. Cifras marcadas "(calc.)" las calculé yo. Justo POS no disponible: cruces con ventas = [DATO]. Presupuesto de noviembre = [DATO] (asumo igual al de octubre, $100.000 cada uno, según presupuestos-ads.json de Laura 23-oct).
Fuentes leídas: CLAUDE.md, planes.json, playbook, clientes.json (sin decisiones previas de estos dos), presupuestos-ads.json, voz/entre-tacos.json y voz/bendito-completo.json (son guías de posts de Google, no de copys de ads: no hay copys en este informe), pendientes.md sesiones 7-13, informes 23-oct. Bitácora de Notion: solo leí títulos y claves de las entradas (no el cuerpo).

## Semáforo de presupuesto octubre (1-29 oct, Meta)
| Cuenta | Gasto | Presupuesto | % | Alerta |
|---|---|---|---|---|
| Entre Tacos | $106.158 (Promociones $44.897 + boost "8 de Octubre" $29.469 + boost "Nadie se resiste" $31.792) | $100.000 | 106% | ROJA |
| Bendito | $224.585 (Delivery $137.758 + boost $86.827) | $100.000 | 225% | ROJA |

Entre Tacos cerrará octubre sobre $110.000 (calc.: el boost sigue gastando ~$2.100/día). En Bendito la tarea de "gastó $170.606 al 23-oct" quedó corta: al 29-oct ya van $224.585. Lo que se pasó no se recupera; el punto es no repetirlo en noviembre.

---

## Tarea 1. Entre Tacos: "Interacción Delivery activa pero con fecha de fin vencida (30-sep) y $0" [Urgent]
**Estado hoy (Meta, 29-oct):** la campaña (120247556844870252) está PAUSADA desde el 14-oct 22:43 (log: Laura Millán, Power Editor). La fecha de fin 30-sep sigue ahí, pero ya no importa: está pausada a propósito. Gasto en octubre: $0 (terminó el 30-sep antes de la pausa). La tarea quedó desactualizada.

**Análisis de resultados que Laura necesitaba (90d, Meta):**
- Gasto $249.823, 3.548 visitas a página de destino (LPV) a $70, CTR 2,95%, frecuencia 3,01 (acumulada 90d, no 7d). Sin dato 7d útil: no gasta desde el 30-sep.
- Destino: Uber Eats / PedidosYa (inferido en la auditoría del 23-oct; el link no lo devuelve la API). Sin pixel (0 datasets, confirmado hoy): no se mide ningún pedido. Pedidos por plataforma = [DATO]; ventas = [DATO].
- Comparación (calc.): $70 por LPV a un tercero vs $25 por visita al perfil en Promociones. No son el mismo resultado, pero ninguno mide venta.
- Costo: a $4.000/día serían $120.000/mes, más que todo el presupuesto de la cuenta ($100.000).

**Recomendación única:** mantenerla PAUSADA y no reactivarla en noviembre. Dejar la tarea en Follow up/cerrada con la nota "pausada a propósito 14-oct; sin medición de pedidos; no cabe en $100.000". Si Laura quiere delivery, se rehace después como campaña nueva con fecha de fin real y destino confirmado, no reactivando esta.
**OK que se necesita de Laura:** (a) confirmar que Delivery no vuelve en noviembre; (b) si lo quiere, pasar el link real de Uber Eats/PedidosYa y de qué presupuesto sale.
**Qué ejecutaría el Jefe:** nada en Meta. Solo actualizar la tarea en Notion con OK.

---

## Tarea 2. Entre Tacos: "9 boosts vencidos figuran ACTIVE y 0 boosts vivos (contratado 1)"
**Estado hoy:** resuelta. De las 17 campañas leídas, solo 1 está ACTIVE: el boost "Nadie se resiste a..." (120249498507390252, creado 13-oct 11:28 por la página "Entretacos" desde la app de Instagram, lifetime $57.000, termina 12-nov). Los 9 boosts vencidos más "Promociones", "Delivery" y el boost del 8-oct los pausó Laura el 14-oct (10:42 y 10:43 pm). Contrato: 1 boost = 1 boost vivo. Cumple.

**Boost vivo, salud (Meta):**
- 13-28 oct: $31.792, 449 visitas al perfil a $71, CTR 3,30%, frecuencia 1,46 (acumulada del boost, baja), fatigue_score 0,11.
- 7d (22-28 oct, calc.): 194 visitas por $13.808 = $71. El costo sube: CPM de $2.052 (20-oct) a $3.078 (28-oct) y el 28-oct cayó a 11 visitas a $155. El 29-oct va en $0 (día parcial).
- Es ~3 veces más caro por visita que Promociones ($22 en 1-14 oct; $25 en 90d).

**Recomendación única:** dejarlo correr hasta el 12-nov sin tocarlo (tiene tope de $57.000, quedan ~$25.200, calc.; no puede pasarse) y no crear otro boost en noviembre salvo que Laura lo pida. Cerrar la tarea.
**Riesgo para avisar:** la página "Entretacos" crea boosts directo desde Instagram (así nacieron $61.261 de octubre, 58% del gasto, calc., fuera del plan). Laura decide si se le pide al cliente que no impulse desde la app.
**OK de Laura:** cerrar la tarea; decidir lo de los boosts desde la app. **Jefe:** nada en Meta.

---

## Tarea 3. Entre Tacos: "Promociones paga visitas al perfil ($25) sin medir reservas ni mensajes"
**Estado hoy:** Promociones (120246477974100252, Tráfico, $3.200/día, sin fin) PAUSADA desde 14-oct, por decisión de Laura para analizar.
**Resultados (Meta):** 90d $230.824, 9.278 visitas al perfil a $25, CTR 3,79%, frecuencia 2,64 (acumulada 90d). Octubre 1-14: $44.897, 2.003 visitas a $22, CTR 5,17%, frecuencia 1,71. Fatigue_score del conjunto 0,20 (bajo). Es lo más barato y estable de la cuenta.
**Lo que no se puede probar:** 0 datasets y 0 públicos propios (confirmado hoy) y no hay campaña de Mensajes. Reservas por WhatsApp, mensajes y ventas = [DATO]. Los 9.278 visitas son tráfico al perfil, no reservas. El copy dice "Contáctanos por WhatsApp" pero el CTA lleva al perfil (visto en la auditoría del 23-oct; no re-leído hoy).

**Recomendación única:** reactivar Promociones tal cual (mismo destino, público y creativos; un cambio a la vez) desde el 1-nov, con presupuesto bajado a $2.500/día para caber en $100.000: $75.000 (30 días) + ~$21.000 del boost hasta el 12-nov = ~$96.000 (calc.). Frecuencia sana y sin fase de aprendizaje que proteger (ya es campaña madura); el recorte de 22% es chico. La medición de reservas va como paso siguiente y aparte: primero Laura define si el cliente prefiere WhatsApp o DM (los números de reserva por sede están en memoria, pero no sé quién responde), y recién entonces se arma la campaña de Mensajes con A-005 (visitó perfil 30d) cuando exista el público.
**OK de Laura:** reactivar el 1-nov con $2.500/día (o dejar $3.200 si sube el presupuesto de noviembre). Confirmar presupuesto de noviembre.
**Qué ejecutaría el Jefe (con ese OK):** `ads_update_entity` budget del conjunto "Conjunto Promociones" (120246477974110252) de $3.200 a $2.500 y activar la campaña; verificar `status_forced_to_paused` y el estado final.

---

## Tarea 4. Bendito: "pauta incompleta (1 de 2 campañas), sin pixel ni públicos, boost vencido figura activo"
**Estado hoy (Meta):**
- Boost "¿Buscando dónde comer completos en Peñuelas?" (120252225398960286): conjunto con fin 26-oct 22:07, pero sigue figurando ACTIVE. Gasto $0 desde el 27-oct (27, 28 y 29-oct en $0): es un estado fantasma, no gasta. Rindió bien: $86.827 en octubre, 2.642 clics a $33 (octubre) y 3.267 clics a $31 (anuncio, 90d), CTR 2,87%, frecuencia 2,04. Destino web, CTA WATCH_MORE, URL [DATO].
- Pauta vigente: 1 campaña (Delivery) de las 2 contratadas. Sin pixel ni públicos (0 y 0, confirmado hoy). Segundo boost del 13-oct sigue pausado, nunca gastó.
- Cuenta: entró 2 veces en "período de gracia" de pago (24-oct 22:24 y 28-oct 18:29) y se resolvió en minutos cada vez. Conviene que Laura revise el método de pago.

**Presupuesto vs contrato (calc.):** con mínimos del playbook ($1.700/día por conjunto) y Delivery a ~$3.000/día, 2 campañas + 1 boost cuestan ~$150.000 a $200.000/mes. Con $100.000 no caben. Hoy el contrato y el presupuesto no calzan, y eso hay que decidirlo antes de crear una segunda campaña.

**Recomendación única:** NO renovar el boost y pausar el boost vencido para limpiar el estado ACTIVE (acción sin gasto; no se borra ni se archiva nada). Noviembre queda con Delivery recortada (tarea 5) como única pauta. La campaña de Mensajes, el pixel y los públicos (A-001, A-002, A-005) se arman cuando Laura decida presupuesto, canal (WhatsApp o DM) y URL real. Los $100.000 no alcanzan para renovar el boost y sostener Delivery.
**OK de Laura:** (1) no renovar el boost (ganó en clics, pero lleva a una web sin URL conocida y la cuenta va al 225%); (2) pasar la URL real; (3) decidir subir presupuesto o bajar el contrato; (4) archivar los 16 elementos viejos: sigue sin decidir, no lo propongo ahora.
**Qué ejecutaría el Jefe (con OK):** `ads_update_entity` pausar la campaña 120252225398960286 y verificar PAUSED.

---

## Tarea 5. Bendito: "Delivery con frecuencia 5,3 y un solo anuncio llevando todo el gasto"
**Corrección del dato:** el 5,3 es frecuencia acumulada 90d (hoy 5,05 en el anuncio). En 7d la frecuencia es 1,89 y en octubre 2,85 a nivel conjunto. CTR 7d 2,65% vs 2,60% en 90d, LPV a $77 vs $78: no hay fatiga hoy. Es el mismo error del lote anterior; no es motivo para cambiar creativos.
**El problema real es plata (Meta, Delivery 120249519389250286):**
- Conjunto "Conjunto Trafico a Delivery": $5.500/día, sin fin, optimiza LPV. Octubre $137.758 (138% del presupuesto de toda la cuenta), 1.610 LPV a $86. Últimos 7 días (22-28 oct, calc.): $41.097 = ~$5.870/día (Meta puede pasarse hasta 25% diario). En noviembre, solo Delivery a este ritmo serían ~$176.000.
- Concentración: AD 2 "UberEats Enrrollado" gasta todo ($42.184 en 7d; $473.597 en 90d). AD 1 "Peya Sandwich o Completo" está ACTIVE con $0 y 0 impresiones en 90d; no tiene errores de entrega (ads_get_errors vacío). Es Meta repartiendo todo al anuncio con mejor señal, no un fallo.
- Destino: tercero (Uber Eats/PedidosYa); sin pixel no hay pedidos medidos. Pedidos por plataforma = [DATO].

**Recomendación única:** bajar el presupuesto diario de Delivery de $5.500 a $3.000 desde el 1-nov (~$90.000/mes; deja margen al sobregasto diario de Meta y respeta $100.000). El recorte es de 45% pero la campaña saca ~370 resultados semanales (calc.), muy sobre los 50 del aprendizaje; se acepta una pasada corta de re-aprendizaje. Si Laura quiere diversificar anuncio, eso requiere un creativo nuevo del Creative Team (tarea en Notion; yo no diseño): propongo pedirlo para diciembre, no para este mes.
**OK de Laura:** presupuesto de Delivery a $3.000/día desde el 1-nov (acción sobre campaña en marcha: la ejecuta el Jefe, no Paid Media).
**Qué ejecutaría el Jefe (con OK):** `ads_update_entity` budget del conjunto 120249519389300286 de $5.500 a $3.000; revisar `status_forced_to_paused` y verificar ACTIVE al terminar.

---

## Resumen de decisiones para Laura (en orden)
1. Entre Tacos Delivery: confirmar que sigue pausada en noviembre.
2. Entre Tacos Promociones: OK para reactivar 1-nov a $2.500/día.
3. Presupuesto de noviembre de ambas cuentas: confirmar $100.000 cada una.
4. Bendito: OK para no renovar el boost y pausar el estado vencido.
5. Bendito Delivery: OK para bajar de $5.500 a $3.000/día el 1-nov.
6. Bendito: decidir si sube presupuesto o baja el contrato (2 campañas + boost no caben en $100.000); URL real y método de pago.

Técnicos usados: Optimización + Reportes | Herramientas llamadas: ~24
