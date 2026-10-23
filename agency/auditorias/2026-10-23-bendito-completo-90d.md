# Auditoría Meta Ads 90 días — Bendito Completo (cuenta 1411268713631255, CLP)

Fecha: 2026-10-23. Solo lectura. Fuente: Meta (ads_get_ad_accounts, ads_get_ad_entities campaña/conjunto/anuncio con last_90d, last_30d, last_7d; ads_get_datasets; ads_get_ad_account_custom_audiences; ads_get_creatives; ads_get_errors) y Notion tareas #9, #10, #11. Contrato: planes.json (ESTÁNDAR, "2 campañas Meta + 1 boost IG").

Semáforo: AMARILLO/NARANJA (cuenta sana, pauta incompleta y sin medición).

## 1. Cuenta
- ACTIVE, método de pago OK, is_queryable true. Business: "Bombo Burger" (1375422837000614).
- 0 datasets/pixel y 0 públicos personalizados (confirmado hoy).

## 2. Inventario 90d (17 campañas, gasto total 90d $758.091)
| Campaña | Estado | Objetivo | Gasto 90d | KPI | Destino | Clasificación | Motivo |
|---|---|---|---|---|---|---|---|
| Delivery (120249519389250286) | ACTIVE | Tráfico→LPV | $471.424 | 6.073 LPV a $78; CTR 2,59%; frec 5,03 | Inferido Uber Eats/PedidosYa por copy/CTA (link_url no disponible) [DATO] | Mantener y rehacer creativos | Única campaña estructurada; 7d $26.010, 352 LPV a $74, frec 1,65; 30d $147.617, LPV a $88, frec 2,99. Ppto $5.500/día sin fecha fin. AD 2 concentra el 100% del gasto |
| Boost "¿Buscando dónde comer completos en Peñuelas?" (120252225398960286) | ACTIVE | Clics | $81.946 | 2.675 clics a $31; CTR 3,09%; frec 2,13 | Sitio web (destination WEBSITE), CTA WATCH_MORE; URL no visible [DATO] | Mantener hasta el fin | Mejor costo de la cuenta. 7d $18.974 (700 clics a $27). TERMINA 26-oct 22:07 (en 3 días) |
| Boost "El mejor completo se disfruta..." (120252489880510286) | PAUSED (anuncio WITH_ISSUES) | Visitas perfil | $0 | Sin entrega | Perfil IG | Limpiar | Error: "Boosted post editing only allowed in Instagram app". Creado 13-oct, nunca gastó |
| Boost Chacarero (120251676575250286) | PAUSED | Clics | $36.874 | 602 clics a $61 | Web, CTA SHOP_NOW | Limpiar (archivar) | Venció 3-sep; ya está pausado (la tarea #10 lo daba como activo: desactualizado) |
| Boost Día de la chorrillana (…440879720286) | PAUSED | Visitas perfil | $26.159 | 371 visitas a $71 | Perfil | Limpiar | Vencido ago |
| Boost sopaipillas (…413846860286) | PAUSED | Clics | $12.783 | 197 clics a $65 | Web | Limpiar | Vencido ago |
| Boost promo 2x1 (…281224750286) | PAUSED | Visitas perfil | $13.092 | 241 a $54 | Perfil | Limpiar | Vencido ago |
| Boost sanguchito miércoles (…241420640286) | PAUSED | Visitas perfil | $8.234 | 167 a $49 | Perfil | Limpiar | Vencido ago |
| Boost antojad@ 2x1 (…153079390286) | PAUSED | Visitas perfil | $40.603 | 696 a $58 | Perfil | Limpiar | Vencido ago |
| Boost sin título 30-jul (…073499590286) | PAUSED | Clics | $15.945 | 347 a $46 | Web | Limpiar | Vencido jul |
| Boost "¿No alcanzaste la promo?" (…027672570286) | PAUSED | Visitas perfil | $22.578 | 562 a $40 | Perfil | Limpiar | Vencido jul |
| Boost "¡Haaaay promo!" (…995502270286) | PAUSED | Visitas perfil | $28.453 | 604 a $47 | Perfil | Limpiar | Vencido jul |
| Boost Día del Mojito (…533295460286), Barros luco (…567292860286), Este martes (…545130060286), Completito (…363737630286) | PAUSED | varios | $0 | Sin entrega | - | Limpiar | $0 y vencidos |
| Promociones (…125471320286), Reconocimiento (…121887280286) | PAUSED | Tráfico / Alcance | $0 | Sin entrega | - | Limpiar | Campañas vacías, nombres genéricos |

Nada se borra: limpiar = archivar con OK de Laura.

## 3. Anuncios activos y destino
- AD 2 "UberEats Enrrollado" (120249519389290286): ACTIVE, $471.424, CTA ORDER_NOW, copy "Pide por Uber Eats". Destino de tercero, sin conversión medible.
- AD 1 "Peya Sandwich o Completo" (120249519389280286): ACTIVE pero $0 y 0 impresiones en 90d. CTA GET_PROMOTIONS. Causa no determinada [DATO] (revisar puja/solapamiento/revisión).
- Boost activo: CTA WATCH_MORE hacia web; sin link visible.
- Conjunto Delivery: destination UNDEFINED, optimiza LANDING_PAGE_VIEWS sin fecha de fin (no hay fecha vencida). Único conjunto con fecha vencida: boost Chacarero (ya pausado).

## 4. Tracking
- 0 datasets: no hay píxel ni CAPI. LPV es el único resultado, pero el destino real es Uber Eats/PedidosYa, así que no se mide pedido ni venta. No hay públicos (ni A-001..A-007) ni remarketing.

## 5. Contrato vs. realidad
- Contratado: 2 campañas + 1 boost. Vivo: 1 campaña + 1 boost real. Falta 1 campaña (propuesta: Mensajes, como en el roadmap del playbook fase 3, nov-2026).
- Presupuesto mensual contratado: [DATO], no está en memoria. Gasto real: 30d $229.563 (Delivery $147.617 + boost $81.946); 1-23 oct $170.606 según Jefe.
- Boosts históricos: pauta hecha por la propia página desde IG, nombres genéricos, incumple nomenclatura del playbook.

## 6. Actualización de tareas Notion
- #10: el boost Chacarero ya no figura activo (PAUSED). El pendiente real es archivar vencidos y la 2da campaña; el boost nuevo del 13-oct nunca entregó.
- #11: la frecuencia 5,3 es acumulada 90d (hoy 5,03); en 7d es 1,65 y LPV a $74, mejor que el promedio, no peor. Sigue valido: un solo anuncio lleva todo y AD 1 está en $0.

## 7. Hallazgos priorizados
- P1: Sin píxel/públicos y Delivery mide solo LPV hacia plataformas de terceros (no hay forma de medir ventas). Falta la 2da campaña contratada.
- P1: Boost ganador ($31/clic, CTR 3,09%) termina el 26-oct; decidir renovar/duplicar.
- P2: AD 1 Peya activo con $0 y AD 2 concentra todo el gasto (frecuencia 90d 5,03). Falta creativo nuevo (Creative Team).
- P3: 16 campañas/boosts viejos a $0 o vencidos para archivar; el boost del 13-oct con error; nomenclatura genérica.

## 8. Recomendación principal (una sola)
Montar campaña estructurada de MENSAJES (WhatsApp o IG DM, según dónde respondan) en la fecha del contrato, usando el boost ganador como creativo base, y renovar solo ese boost si Laura aprueba. Lo ejecuta el Jefe con OK de Laura. Mantener Delivery sin tocar (7d en buen nivel). Mientras tanto, pedir a Laura datos faltantes.

## 9. [DATO] para Laura
1. Presupuesto mensual contratado de Bendito Completo.
2. Canal de mensajes preferido (WhatsApp o IG DM) y quién responde.
3. URL real de destino del boost activo y del anuncio Delivery (Uber Eats / PedidosYa / web propia).
4. ¿Renovar el boost ganador que termina el 26-oct?
5. ¿OK para archivar los 16 elementos vencidos/en $0?
6. Resultado real por canal de delivery (pedidos Uber/PedidosYa) para cruzar con gasto.
7. Corrección: el QR/fidelidad compartido con Entre Tacos no es de Meta (excluido).
