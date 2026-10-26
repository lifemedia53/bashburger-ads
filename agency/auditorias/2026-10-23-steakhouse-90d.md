# Auditoría Meta Ads 90 días: Steakhouse by Bombo (cuenta 1642000733624651, CLP)
Fecha: 2026-10-23. Solo lectura. Fuente: Meta Ads MCP (campañas, conjuntos, anuncios, creativos, errores, logs, datasets, públicos), Notion tarea #126, planes.json, playbook-life-media.json. Ventana: last_90d.

## Semáforo: ROJO
- Cuenta ACTIVE, con método de pago, consultable. Hoy 0 ACTIVE (Laura pausó 4 el 23-oct 00:52, log de actividad).
- Se gastaron $881.797 en 90 días: Tráfico Promo $500.179 (57%), boosts $277.168 (31%), Reconocimiento $104.450 (12%). Contrato: 1 campaña, 0 boosts.
- Sin pixel/dataset, sin públicos útiles, y los dos conjuntos estructurados tienen la fecha de fin vencida.

## Inventario por campaña (90d)
| Campaña | Estado | Gasto | KPI | Clasificación | Motivo |
|---|---|---|---|---|---|
| Trafico Promo 120244039095640559 | PAUSED | $500.179 | 463.351 imp, 20.790 clics, CTR 4,49%, CPC $24, 10.735 LPV a $47, frec 2,46 | REHACER (conjunto) y mantener como la campaña del contrato | Funciona en clics pero el conjunto terminó el 30-sep; 48% de los clics no llega a cargar la página |
| Reconocimiento 120244166321040559 | PAUSED | $104.450 | 434.215 imp, alcance 205.131 a $509, CTR 0,10%, frec 2,12 | PAUSAR / no reactivar | Conjunto venció 5-sep; el 93% fue a Reel 2; no hay eventos para medir recuerdo; 2ª campaña no está en contrato |
| Boost "Cinco paraderos" 120250214469130559 (+ copia 120250197577900559) | PAUSED | $35.834 + $4.545 | 12 y 1 conversaciones a $2.986 y $4.545 | LIMPIAR | Boost fuera de contrato; anuncio con error de edición |
| Boost "Instagram Post" 120250080017690559 | PAUSED | $11.760 | 154 clics a $76 | LIMPIAR | Boost fuera de contrato |
| Boost "Este jueves 15" 120250057299830559 | PAUSED | $25.524 | 644 visitas al perfil a $40 | LIMPIAR | Boost fuera de contrato; se usó por alcance |
| Boost "¿Qué hace que una buena...?" 120250197702430559 | PAUSED | $8.760 | 79 visitas al perfil a $111 | LIMPIAR | Boost fuera de contrato |
| Boost "Todos los jueves de..." 120248982399830559 | PAUSED | $64.028 | 1.683 visitas al perfil a $38 | LIMPIAR | El más caro de los boosts, antiguo |
| Boost "Agosto tiene un mejor..." 120248954206010559 | PAUSED | $51.514 | 863 visitas al perfil a $60 | LIMPIAR | Antiguo |
| Boost "Cuando la carne está..." 120249329456710559 | PAUSED | $39.951 | 1.680 clics a $24 | LIMPIAR | Antiguo, fue el más barato por clic |
| Boost "Todo comienza con una..." 120249133798570559 | PAUSED | $27.507 | 584 clics a $47 | LIMPIAR | Antiguo |
| Boost "Julio sabe mejor con..." 120248374798140559 | PAUSED | $7.745 | 237 clics a $33 | LIMPIAR | Antiguo |
| ~20 campañas/boosts con $0 (incl. "Tráfico Abril - Diciembre", "Prueba: Reconocimiento 1", "Reconocimiento 1 Enero - Marzo") | PAUSED | $0 | sin entrega | LIMPIAR | Ruido en la cuenta |

Total de boosts con gasto: 10 registros por $277.168. Nota: la suma de "Cinco paraderos" aquí ($35.834 + copia $4.545) difiere de los $36.682 del contexto; se informa lo que devuelve la API.

## Hallazgos priorizados
**P1**
1. Tráfico Promo está pausada Y su conjunto "Conjunto Promos" tiene fin 30-sep-2026 (daily $10.000, budget_remaining 0). Reactivar la campaña sola no entrega. Reconocimiento igual (fin 5-sep, daily $2.500).
2. Sin pixel/dataset (0 datasets). Solo se puede optimizar a clics/LPV; no hay medición de reservas ni funnel. El 48% de los clics (20.790 clics vs 10.735 LPV) no carga la página: posible problema de velocidad/destino o clics accidentales.
3. Gasto fuera de contrato: 10 boosts ($277.168 = 31%) cuando el plan ESENCIAL contrata 1 campaña Meta y 0 boosts; además una 2ª campaña (Reconocimiento) de $104.450.

**P2**
4. Destino del anuncio principal ("Trafico a reserva + informativos", $419.157 = 84% de la campaña, CTA BOOK_TRAVEL "Reservar", creativo SHARE sobre post de IG): link_url vacío en la API. **[DATO]** no se puede leer el destino real (web, WhatsApp, perfil). No diagnosticar CTR ni reactivar sin verlo en Ads Manager (preview: https://www.facebook.com/adsmanager/manage/ads/edit?act=1642000733624651&selected_ad_ids=120248271481950559).
5. 6 anuncios con error: 5 "edición de boost solo desde la app de Instagram" (campañas 120242964786840559, 120242781127040559, 120240934990320559, 120240587006570559, 120240186530140559) y 1 por página asociada desactivada (campaña 120239061093920559). Son boosts antiguos con $0: se limpian, no se arreglan.
6. Públicos: solo 1 lookalike "Similar (CL, 1%) - Instagram Automatic Audience" (120238977972290559), INACTIVE, ~1.000 personas. Ninguno de A-001..A-007 existe.
7. Fatiga: frecuencia 2,46 en Promo y 2,12 en Reconocimiento (bajo el umbral de 3,5). Sin fatiga por ahora. Creativo principal desde jul-2026.

**P3**
8. Nomenclatura fuera de playbook ("Trafico Promo", "Reconocimiento", "Publicación de Instagram: ..."): playbook pide "[TIPO] [AÑO] - DESCRIPCIÓN" y CJ/AD X.Y.
9. Tres creativos de la campaña (Lunes a Jueves, Lunes a Jueves - 20%, Descuento 20% duplicado) casi sin gasto: ruido. Promoción "20% OFF agosto" sigue en el anuncio de mayor volumen secundario ($81.016); está vencida.

## Pagos / tracking
- Pago: has_payment_method = true, account_status ACTIVE. Misma business (Bombo Burger SpA) que Entre Tacos y Santerra.
- Tracking: 0 datasets, no hay eventos que revisar. Los resultados de la cuenta son de plataforma (LPV, clics, visitas al perfil, conversaciones).

## Costo por resultado según objetivo
- Tráfico (Promo): $24 por clic, $47 por LPV. Muy barato; el problema es la calidad del clic, no el costo.
- Reconocimiento: $509 por persona alcanzada (CPM ~ $240). Sin referencia en playbook para alcance.
- Boosts: $40 a $111 por visita al perfil; $24 a $76 por clic; $2.986 a $4.545 por conversación (playbook: $2.000-$4.000 aceptable).

## Clasificación vs contrato (1 campaña Meta, 0 boosts)
- Mantener: Tráfico Promo (es la campaña contratada), tras corregir conjunto y destino.
- Rehacer: su conjunto (nueva fecha de fin, nombre playbook, públicos).
- Pausar: Reconocimiento (no reactivar).
- Limpiar: los 10 boosts con gasto y las ~20 campañas en $0 (archivar solo con OK de Laura; nunca borrar).
- Escalar: nada.

## Plan de reactivación de noviembre (Tráfico Promo)
Revisar antes:
1. Abrir el anuncio principal en Ads Manager y confirmar destino y CTA (hoy ilegible por API). Probar que la web carga rápido y que reservar funciona en móvil. [DATO]
2. Decidir fecha de fin del conjunto (hoy 30-sep, vencida) y promoción vigente: "20% OFF agosto" ya no aplica, no reutilizar ese creativo.
3. Presupuesto: el conjunto tenía $10.000 CLP diarios (leído, daily_budget). Gasto real ~$500.179 en ~5 meses (promedio ~$3.300/día), por lo que no gastaba el tope. [DATO] qué presupuesto mensual aprueba Laura para noviembre.
4. Verificar que la página asociada de IG/Facebook esté activa y los anuncios sin error (ads_get_errors).
5. Crear pixel/dataset y evento de reserva antes de pasar a optimización por conversión; mientras no exista, mantener Tráfico + LPV (regla del playbook).
6. Atribución según playbook: web/tráfico 7d clic + 1d vista.
7. Revisar el log de actividad al reactivar (cambios de terceros).

Públicos del playbook a crear (según existan fuentes): A-005 Visitó perfil 30d (la más útil), A-003 Video 95% 30d, A-004 Guardaron IG 30d, A-001/A-002 Mensajes IG 30d/180d, A-006 LAL 1% de A-002. A-007 requiere lista de clientes con valor (no existe) [DATO]. Ninguna se crea sin OK de Laura.

## Recomendación principal
Mantener todo pausado hasta noviembre y, antes de reactivar, que el Jefe (con OK de Laura) deje UNA sola campaña de Tráfico con conjunto nuevo (nueva fecha de fin, $10.000 diarios o lo que Laura apruebe), destino de reserva verificado y pixel instalado; los boosts y Reconocimiento no se reactivan.

## [DATO] para Laura
1. Presupuesto de noviembre para Steakhouse (tope diario/mensual).
2. Destino real del botón "Reservar" (web de reservas, WhatsApp o perfil) y quién puede instalar el pixel en esa web.
3. Reactivar la página asociada desactivada o dar por perdido el boost de "Bienvenidos a Steak...".
4. OK para archivar los boosts y campañas en $0.
5. Si se quiere mantener algún boost de alcance (contrato dice 0).

Herramientas llamadas en Meta: 10 (accounts, campaign, adset, ad, datasets, custom audiences, errors, creativos x2, logs x2, preview). Notion: 1.
