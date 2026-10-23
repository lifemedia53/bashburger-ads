# Auditoría Meta Ads 90 días — Bombo Comercializadora / Distri Comer Bombo
Cuenta 1447851609427252 (CLP) · Fecha: 2026-10-23 · Modo: solo lectura (Meta, Notion). Nada fue modificado.
Tarea Notion #35 (3e7673eb9c568147b30dddb0dcc18015). Relacionadas: #34 (3f7673eb9c5681c99ea1e96bb88f47bd), #37 (3f7673eb9c56816aa1aaeee04bcbc08a), "Bloquear Santiago de Comer" (3d1673eb9c568079a863f48b52762f78).

## 1. Semáforo: AMARILLO/NARANJA
Cuenta sana (ACTIVE, con método de pago, consultable) y entregando desde el 20-oct, pero estuvo 20 días muerta (30-sep a 20-oct) y el conjunto Tráfico vuelve a vencer el 31-oct. Mide conversaciones, no ventas; no hay pixel/dataset.

## 2. Cuenta, pagos, verificación (fuente: Meta, ads_get_ad_accounts + log de actividad)
- Estado ACTIVE, has_payment_method = true, is_queryable = true, moneda CLP.
- Bloqueo por pago (Payment Needed) resuelto el 10-oct 06:16 con cobro $72.136. Nuevo cobro $55.345 el 22-oct 15:02. Sin bloqueo vigente.
- Verificación de negocio / calidad de cuenta: [DATO] no hay herramienta de lectura; no se pudo revisar.

## 3. Inventario 90 días (nivel campaña, last_90d)
| Campaña | Estado | Gasto 90d | KPI 90d | Destino / CTA | Clasificación | Motivo |
|---|---|---|---|---|---|---|
| Tráfico (120242998584370680) | ACTIVE | $369.912 | 262 conversaciones a $1.412; CTR 1,30%; frec. 4,39 | WhatsApp (CTA WHATSAPP_MESSAGE) | MANTENER + renovar fecha | 7d: $35.000, 46 conv a $761, CTR 2,39%, frec. 1,5. Fin del conjunto 31-oct |
| Reconocimiento (120244871751860680) | ACTIVE | $127.977 | 8.380 recordadores a $15; CTR 0,88%; frec. 4,59 | LOCACION: WATCH_MORE (dato Notion 10-oct, no re-verificado); ENVIOS: WHATSAPP_MESSAGE | REHACER (creativo) / mantener presupuesto | Alcance sin venta medible, frecuencia 90d sobre 3,5 (7d: 1,7) |
| Publicación de Instagram "En Bombo..." (120209687024830680) | PAUSED | $0 | sin entrega | n/a (2024) | LIMPIAR | Campaña de sept-2024 |
| Publicación "En Bombo Distribuidores..." (120209686985180680) | PAUSED | $0 | sin entrega | n/a (2024) | LIMPIAR | Contiene el único anuncio con error |

Total 90d: $497.889. Últimos 30d: $60.642 (Tráfico $35.000 + Reconocimiento $25.642; calza con los $60.643 del encargo). Últimos 7d: $47.871.

## 4. Conjuntos y anuncios (90d)
Conjuntos:
- Conjunto Tráfico 120242998584350680: ACTIVE, $10.000/día, optimiza a CONVERSATIONS, fin 31-oct-2026 14:00 (Laura lo extendió el 20-oct desde 30-sep; log de actividad). Gasto $343.627, 227 conv a $1.514.
- Conjunto Tráfico Carnes Parrilleras 120245880716560680: ACTIVE pero con FECHA DE FIN VENCIDA (31-jul-2026), $4.000/día. Gasto $26.285, 35 conv a $751. No entrega.
- Conjunto Reconocimiento 120244871751880680: ACTIVE, $1.850/día, sin fecha de fin, AD_RECALL_LIFT. $127.977.
- Dos conjuntos de 2024 pausados, fin 18-sep-2024, $0.

Anuncios (90d):
| Anuncio | Estado | Gasto | Resultado | Clasificación |
|---|---|---|---|---|
| Tráfico Huevos (120248010543120680) | ACTIVE (desde 20-oct) | $33.617 | 45 conv a $747, CTR 2,36%, frec. 1,49 | ESCALAR (cuando haya más datos) |
| Tráfico Alacena (120247046862500680) | ACTIVE | $232.152 | 155 conv a $1.498, CTR 1,20%, frec. 4,17 | REHACER (fatiga) |
| Tráfico Queso Crema (120247046823940680) | PAUSED (Laura, 22-oct) | $57.878 | 17 conv a $3.405 | PAUSAR (ya hecho) |
| Tráfico Sushi (120244052524430680) | PAUSED | $19.980 | 10 conv a $1.998 | LIMPIAR |
| Carnes (Grupo A), Repostería, Gauda, Cheddar | PAUSED | $0 | sin entrega | LIMPIAR |
| Nuevas carnes (120245880725570680) | ACTIVE, en conjunto vencido | $26.285 | 35 conv a $751, CTR 1,81% | Reutilizar en conjunto vigente o limpiar (decide Laura) |
| Reconocimiento LOCACION (120244871751870680) | ACTIVE | $100.764 | 7.550 recordadores a $13, frec. 4,20 | REHACER (fatiga) |
| Reconocimiento ENVIOS (120245810601550680) | ACTIVE | $27.213 | 3.010 recordadores a $9, CTR 0,36% | PAUSAR candidato (CTR bajo; Notion 16-oct lo marcó para revisar) |
| Anuncio 2024 (120209686985590680) | WITH_ISSUES | $0 | "Invalid ad create parameters" | LIMPIAR |
Además la lectura de creativos muestra un creativo de Huevos (1128860382820236) en WITH_ISSUES; no está asociado a un anuncio activo en la lectura. [DATO] revisar si es un borrador huérfano.

## 5. Entrega y gasto reciente
- 30-sep a 20-oct: Tráfico sin entrega por fecha de fin vencida (y bloqueo de pago hasta el 10-oct). Solo Reconocimiento gastó (~$1.850/día).
- Desde el 20-oct 15:13 Laura extendió la fecha, reactivó el conjunto y cargó 18+ creativos nuevos (Huevos, Queso Cheddar, Queso Crema, aceite, fideos, arroz). Tráfico gastó $35.000 en 3 días (~$11.700/día, ritmo algo sobre el tope de $10.000).
- Ritmo mensual implícito con presupuestos actuales: ~$355.500/mes ($11.850/día). [DATO] presupuesto mensual contratado: no está en planes.json.

## 6. Costo por resultado según objetivo
- Tráfico (conversaciones iniciadas): 90d $1.412; 7d $761. Mejora atribuible a la oferta concreta de Huevos (playbook: promo con precio gana a marca). Solo 3 días de datos: no es tendencia confirmada. Objetivo playbook mensajes: $2.000-4.000 (Bombo Burger logró 506-570): este costo está dentro de lo esperado.
- Reconocimiento (recordadores estimados): $15 (90d), $6 (7d). Métrica de alcance, sin vínculo a ventas.
- CPC / CPM calculados (mis cálculos): Tráfico 90d CPC $174, CPM $2.267; 7d CPC $84, CPM $2.002. Reconocimiento 90d CPC $44, CPM $385.

## 7. Tracking y destinos
- ads_get_datasets: 0 datasets/pixel en la cuenta. No hay eventos web ni CAPI.
- Todos los creativos leídos (hasta 25 de la primera página) usan CTA WHATSAPP_MESSAGE hacia WhatsApp +56 9 8804 1572. Optimización: CONVERSATIONS. Se mide conversación iniciada, no pedido ni venta. Segunda página de creativos no leída.
- Conclusión: el CTR de Tráfico es interpretable porque el destino es WhatsApp; no se puede medir venta sin registrar pedidos de WhatsApp (CAPI de mensajería o conteo manual). Coincide con la tarea #37.

## 8. Fechas de fin vencidas (tarea #34)
- Conjunto Tráfico (30-sep): RESUELTO por Laura el 20-oct, ahora vence el 31-oct 14:00. Riesgo de repetir el hueco en 8 días.
- Carnes Parrilleras (31-jul): sigue ACTIVE y vencido. Pendiente de decisión de Laura.
- Reconocimiento: sin fecha de fin, sin riesgo.
- Conclusión: el texto de #34 (escrito con corte 10-oct) quedó desactualizado en su primera mitad.

## 9. Bloquear Santiago (tarea Urgent, cambio en Meta NO ejecutado por esta auditoría)
Hallazgo: según la configuración actual, Santiago ya está bloqueado.
- Reconocimiento: excluye la Región Metropolitana de Santiago completa (home + recent).
- Tráfico: inclusión solo de ciudades de la Región de Coquimbo; exclusión "Santiago Centro (+2 km)" agregada por Laura el 20-oct 15:13 (log de actividad).
- Desglose por región 90d: 100% del gasto de ambos conjuntos en Coquimbo Region (solo $1 en "Unknown"). Cero gasto en Santiago.
- La nota del 16-oct sobre "Reconocimiento Santiago (Patio Bella Vista) $56.810" no calza con esta cuenta; probablemente es de otra cuenta Bombo. [DATO] confirmar.
- Propuesta (no ejecutada, con OK de Laura): endurecer Tráfico cambiando la exclusión "Santiago Centro +2 km" por la Región Metropolitana completa, igual que Reconocimiento; luego marcar la tarea como cumplida.

## 10. Cumplimiento vs contrato (planes.json: ESTÁNDAR, "2 campañas Meta + 1 boost IG")
- Campañas activas: 2 (Tráfico, Reconocimiento). Cumple.
- Boost IG: no hay ninguno visible en la cuenta (las únicas "Publicación de Instagram" son de 2024 y están pausadas). Faltaría 1. [DATO] si se hacen boosts desde la app de Instagram en otra cuenta.
- Foco del mes (planes.json): "claridad B2B; pilar confianza (casos + operación)". Las ofertas de huevos y queso son directas y de producto; Reconocimiento no habla de casos ni confianza.

## 11. Cumplimiento del playbook (solo observado, no se aplica todavía)
- Nomenclatura: campañas "Tráfico" y "Reconocimiento" sin formato [TIPO] AÑO - Descripción; conjuntos "Conjunto ..." sin "CJ X.Y"; anuncios sin "AD X.Y.LETRA". No cumple.
- Placements: Tráfico y Reconocimiento incluyen Search, Marketplace search y Notificaciones/WhatsApp Status; el playbook pide manual solo IG + FB (Feed/Reels/Stories). Revisar.
- Audiencias A-001..A-007: no usadas; Tráfico usa intereses + Base Clientes + LAL 1% y 1-2% con Advantage+ audience ON.
- Revisión de fechas de fin: falló dos veces (julio y septiembre); regla del playbook "revisar fin de conjuntos cada inicio de mes".

## 12. Prioridades
P1
1. Renovar la fecha de fin del Conjunto Tráfico (hoy 31-oct 14:00) antes de esa fecha; si no, repite el hueco de 20 días (-$0 de entrega).
2. Decidir Carnes Parrilleras (vencido jul): pausar el conjunto o reutilizar "Nuevas carnes" ($751/conv) en un conjunto vigente. No gastar más sin fecha vigente.
P2
3. Confirmar y cerrar "Bloquear Santiago": ya bloqueado; endurecer Tráfico a Región Metropolitana.
4. Refrescar creativos con fatiga: Alacena (frec. 4,17) y Reconocimiento LOCACION (4,20); evaluar pausar ENVIOS (CTR 0,36%).
5. Definir cómo contar ventas por WhatsApp (sin pixel; mide solo conversaciones).
P3
6. Limpiar campañas/conjuntos/anuncios de 2024 y el anuncio WITH_ISSUES (archivar, sin borrar); creativo Huevos con issues.
7. Nomenclatura y placements según playbook; boost IG faltante vs contrato.

## 13. Recomendación principal (la ejecuta el Jefe con OK de Laura)
Extender la fecha de fin del Conjunto Tráfico (120242998584350680) desde el 31-oct a fin de noviembre sin tocar público, presupuesto ni creativos (el conjunto está en reaprendizaje desde el 20-oct y la oferta de Huevos recién entrega a $747/conv), y pausar el conjunto vencido Carnes Parrilleras (120245880716560680). Luego remedir el 30-oct. No escalar presupuesto hasta tener 7 días limpios.

## 14. [DATO] para Laura
1. Presupuesto mensual contratado de Comercializadora en CLP (no está en planes.json).
2. Carnes Parrilleras: ¿reactivar con fecha vigente o limpiar?
3. ¿Hay boost de Instagram corriendo desde la app, en otra cuenta?
4. ¿Cuántos pedidos/ventas reales llegan de las ~46 conversaciones semanales? Sin eso solo medimos conversaciones.
5. ¿"Reconocimiento Santiago $56.810" del 16-oct es de esta cuenta o de otra Bombo?
6. Verificación de negocio / calidad de cuenta: no medible con las herramientas de lectura.
7. Segunda página de creativos (cursor) y destino de LOCACION (WATCH_MORE) no re-verificados hoy.

Fuentes: Meta (ads_get_ad_accounts, ads_get_ad_entities campaña/conjunto/anuncio/región/targeting, ads_get_datasets, ads_get_creatives, ads_get_errors, ads_account_get_activity_logs desde 9-oct); Notion (#35, #34, #37, "Bloquear Santiago", Bitácora 3f5673eb9c5681979e9bf399a5a62d5b); memoria planes.json, playbook-life-media.json, clientes.json, flujo-ads.json.
