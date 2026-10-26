# Auditoría Meta Ads 90 días: Lullaby Rentals, cuenta real 10201332475268991 (USD)
Fecha: 2026-10-27 (consultas con la fecha de sesión 2026-10-26). Solo lectura. Fuente: Meta Ads MCP (ads_get_ad_accounts, ads_get_ad_entities campaña/conjunto/anuncio con last_90d y this_month, ads_get_creatives, ads_get_errors, ads_get_datasets, ads_get_dataset_stats, ads_get_ad_account_custom_audiences), planes.json, presupuestos-ads.json, clientes.json, playbook-life-media.json, informe previo 2026-10-27-lullaby-90d.md. Notion/Trello no consultados ni escritos. Las 24 campañas archivadas el 27-oct no se auditan (orden del Jefe).

## Semáforo: NARANJA
- Cuenta ACTIVE, consultable, con método de pago, USD, sin business asociado. 0 errores de entrega en las 2 campañas con gasto (ads_get_errors vacío).
- Octubre: $127,11 de $200 (63,6%) al 26-oct. Solo 1 de las 2 campañas contratadas está activa; la otra (AWFIT) está pausada y sin fecha de reactivación.
- Tracking débil: el único pixel no ha disparado desde el 30-abr y las campañas optimizan a Landing Page Views, con destinos fuera de la web propia (Airbnb).

## Gasto de octubre (this_month) vs $200 USD
Fuente del presupuesto: presupuestos-ads.json, "dicho por Laura 2026-10-23".
| Campaña | Estado | Gasto octubre | Imp | Clics | CTR | Frec |
|---|---|---|---|---|---|---|
| Trafic to ST Bliss (6963147947948) | ACTIVE | $65,10 | 7.438 | 901 | 12,11% | 1,13 |
| Traffic / Convertion AWFIT ST (6890269094548) | PAUSED | $62,01 | 3.839 | 438 | 11,41% | 1,07 |
| Total | | **$127,11** (63,6%) | | | | |
- Quedan $72,89. Proyección lineal al 31-oct sobre el total: 127,11 / 26 x 31 = $151,6 (76%). Pero AWFIT ya está pausada (su conjunto "ST TLL Nov - June" terminó el 22-oct), así que el gasto real futuro es solo el de Bliss: aprox. $2,50/día x 5 días restantes = ~$12 más, cierre estimado ~$140 (70%). Sin alerta de sobregasto. Subgasto: ~$60 sin usar.
- Nota: la campaña pausada gastó $62 en octubre (hasta el 22-oct), lo que significa que el mes se repartió casi 50/50 entre Bliss y AWFIT, aunque el foco del contrato es "vender Bliss sobre todo y Lobster".

## Inventario por campaña (90d, solo las que tienen gasto o están activas)
| Campaña | Estado | Gasto 90d | KPI | Destino | Clasificación | Motivo |
|---|---|---|---|---|---|---|
| Trafic to ST Bliss 6963147947948 | ACTIVE | $219,62 | 29.490 imp, 3.152 clics, CTR 10,69%, costo por clic ~$0,07, frec 1,13 a 1,49 | Ver detalle abajo | MANTENER y mejorar tracking | 3 conjuntos activos con fin 31-dic-2026 y 31-ene-2027 |
| Traffic / Convertion AWFIT ST (Spring-Summer) 6890269094548 | PAUSED | $477,28 | 50.527 imp, 2.410 clics, CTR 4,77% | LPV (sin destino legible) | MANTENER pausada hasta confirmar pago | Ver AWFIT |
| 3 viejas: 6632996901748 "TLL (Summer)", 6628408505948 "Aqua Vista Traffic Link", 6017360123948 "[05/14/2014] Speech & Swallowing" | PAUSED | $0 en 90d | sin entrega | n/a | LIMPIAR (cuando se arregle el creativo) | No se pudieron archivar por creativo roto (página/reel no disponible). Sin gasto, sin riesgo. 6017360123948 es ajena al cliente (2014) |

## Campaña activa "Trafic to ST Bliss" (6963147947948)
Conjuntos y anuncios (last_90d), todos objetivo de optimización LANDING_PAGE_VIEWS:
| Conjunto | Estado | Fin | Gasto | CTR | Anuncio / CTA / destino |
|---|---|---|---|---|---|
| ST Bliss - Reel (52552080185952) | ACTIVE | 31-dic-2026 | $155,64 | 14,79%, frec 1,49 | "ST Bliss - Reel" (creativo 1395813202059938, SHARE de post existente de la página, nombre "{{product.name}}"). CTA: [DATO] no devuelto. Destino: [DATO] no devuelto |
| ST Bliss - MT (52566478945152) | ACTIVE | 31-ene-2027 | $26,81 | 10,83%, frec 1,05 | "MT Bliss Sept - Dec Reel" (creativo 28332853086385253, video 1630401595347361). CTA: SEE_DETAILS. Destino: [DATO] link no devuelto. Texto: casa amoblada de invierno, Okaloosa Island (mid-term) |
| ST Bliss - Sept Dec Post ST (52562310485152) | ACTIVE | 31-dic-2026 | $9,82 | 1,86%, frec 1,08 | "ST Bliss Sept Dec Post ST" (creativo 2245518966304771). CTA: BOOK_TRAVEL. Destino en el texto: airbnb.com/h/okaloosaislandbliss |
| ST Bliss - Apr Jun - Post (6963147947548) | PAUSED | 30-sep-2026 | $27,35 | 2,01% | "AD Bliss ST Aug Sep Post", vencido |

Lectura:
- Frecuencia 1,05 a 1,49: sin fatiga (umbral 3,5). Todos los anuncios sobre 1.000 imp salvo ninguno bajo ese umbral.
- Errores: ninguno. Fechas: ningún conjunto activo vencido.
- El conjunto Reel concentra el 71% del gasto de la campaña ($155,64 de $219,62) y tiene el mejor CTR. El post con CTA BOOK_TRAVEL hacia Airbnb tiene CTR 1,86% (peor) y es el patrón de los posts estáticos de abril a septiembre (2,0%).
- CTR de 10 a 15% es alto para tráfico: probablemente cuenta todos los clics (reacciones, perfil, "ver más") y no solo clics al enlace. No sacar conclusión de costo por visita sin Landing Page Views reales: [DATO] landing_page_views/costo por LPV no consultado.
- Destino y CTA: solo confirmado 1 de 3 anuncios activos (Airbnb). Los otros 2 [DATO] (pendiente heredado en clientes.json: "Confirmar URL de destino por anuncio (Airbnb/Furnished Finder/sitio)"). El conjunto "MT" parece mid-term (Furnished Finder según el pendiente); sin confirmar.
- Nomenclatura fuera de playbook ("Trafic to ST Bliss", sin "[TIPO] [AÑO] -" ni CJ/AD X.Y).

## Tracking / pixel
- Un solo dataset: "Shannon Leach Amos - Píxel" (1079068034152930), creado 2025-07-08, is_active=true, **último disparo 2026-04-30**. ads_get_dataset_stats del 14 al 25-oct: 0 eventos. Nombre de otra persona, probablemente heredado [DATO].
- Si el destino es Airbnb/Furnished Finder (terceros), no se puede instalar pixel: no hay conversiones medibles (reservas) y LPV depende de que Meta mida la carga. La única medida real es clics. Sin eventos Purchase/Lead: el playbook indica conversión = Tráfico+LPV, que es lo que ya se hace.
- Propuesta (no ejecutada): si el cliente tiene web propia, enviar tráfico ahí con pixel; si no, aceptar solo clics.

## AWFIT pausada (6890269094548)
- Campaña PAUSED. Gasto 90d $477,28, octubre $62,01. Conjuntos: "ST TLL Nov - June" CAMPAIGN_PAUSED, fin 22-oct (venció, $3/día, $352,28 en 90d); "ST AWIFT Oct" PAUSED, fin 29-nov-2026, $3/día, **sin gasto ni impresiones**; "ST AWIFT Apr - June" PAUSED, venció 19-ago ($125). Anuncios: "Traffic ST AWFIT" y "Traffic ST AWFIT Video" (versiones nuevas del conjunto Oct, sin entrega), el mejor histórico fue "Traffic ST TLL Video 2" ($274,07, CTR 8,39%).
- Motivo de pausa: pago pendiente (prioridades-propuesta.json: "No activar AWFIT hasta confirmar el pago", tarjeta vencida 17-oct). Hoy la cuenta muestra has_payment_method=true: [DATO] si ya se resolvió el pago.
- Para reactivar: el conjunto vigente es "ST AWIFT Oct" (fin 29-nov); el de TLL venció y no entrega. Reactivar solo con OK de Laura (lo ejecuta el Jefe). El nombre mezcla TLL y AWFIT/AWIFT: [DATO] si TLL = Lobster (pendiente en clientes.json).

## Contrato PRO = 2 campañas Meta: qué falta
Fuente: planes.json ("pauta: 2 campañas Meta", foco "vender Bliss sobre todo y Lobster").
- Activas hoy: 1 (Bliss). Falta la segunda.
- Candidata: AWFIT (pausada, sin pago confirmado). No existe ninguna campaña identificada como Lobster [DATO] (TLL = Lobster sin confirmar).
- Sin fuente: no está claro si AWFIT es Lobster. Por foco del contrato, la segunda campaña activa debería ser Lobster; hoy no hay evidencia de que exista.
- Decisión vigente de Laura (2026-10-23): "dejar Lullaby como está". Esta auditoría no propone campañas nuevas; lo anotado es pregunta para Laura.

## Públicos (cuenta oficial)
Playbook pide A-001..A-007 (basados en mensajes/IG/video/LAL): ninguno existe con ese nombre. Hay 6 públicos de plataforma:
| Público | Estado | Tamaño |
|---|---|---|
| Trafico ADS desde Enero 2026 | ACTIVE | 3.200-3.800 |
| Consideracion / Engagement | ACTIVE | 4.000-4.700 |
| Remarketing o Conversion | ACTIVE | 4.000-4.700 |
| Testing Aud I | ACTIVE | 1.000 (mínimo) |
| Retargeting (AI) | INACTIVE | 1.000 |
| Saved ad or post <180 days> | INACTIVE | 1.000 |
- Son públicos creados por Meta/plataforma (subtipo PLATFORM); sirven como base de remarketing pero no equivalen a A-001..A-007. Sin lookalikes ni listas de clientes. [DATO] qué públicos usan los conjuntos activos (no consultado a nivel de targeting).
- Sin IG DM/mensajes en el objetivo de tráfico, no aplican A-001/A-002.

## Hallazgos priorizados
**P1**
1. Sin segunda campaña activa: el contrato PRO exige 2 y solo corre Bliss. AWFIT/Lobster depende de confirmar el pago y de que Laura quiera reactivar. Con $72,89 sin gastar en octubre hay holgura de presupuesto.
2. Destino y CTA no verificados en 2 de 3 anuncios activos. Sin eso no se puede evaluar si el CTR de 10 a 15% se convierte en reservas.

**P2**
3. Pixel inactivo desde el 30-abr, nombre ajeno, 0 eventos en 28 días. Los destinos son de terceros, así que no habrá conversiones medibles hasta tener web propia.
4. Presupuesto: 63,6% usado; el mes cierra ~70% porque AWFIT ya no gasta. Subgasto, no sobregasto.
5. Conjunto vencido "ST TLL Nov - June" (22-oct) y "ST AWIFT Apr - June"/"ST Bliss Apr-Jun" vencidos: quedan como ruido.
6. Las 3 campañas viejas (6632996901748, 6628408505948, 6017360123948): PAUSED, $0, creativo roto. No hay riesgo de gasto. Opciones para Laura: dejarlas, o arreglar/reemplazar el creativo (acción de escritura) y archivarlas; no borrar.

**P3**
7. Nomenclatura fuera de playbook.
8. Públicos A-001..A-007 inexistentes; 2 públicos INACTIVOS.
9. Costo por clic ~$0,07 es bajo porque el conteo de clics es amplio; usar LPV/clics en enlace para decidir.

## Clasificación
- Mantener: Trafic to ST Bliss (conjunto Reel como principal).
- Escalar: nada hasta tener destino y tracking claros.
- Pausar: nada (el conjunto "Sept Dec Post ST", CTR 1,86% y $9,82 en octubre, es el candidato si Laura quiere concentrar en el Reel; solo con OK de Laura).
- Rehacer: nada.
- Limpiar (solo con OK de Laura, archivar y nunca borrar): 3 campañas viejas $0 cuando se arregle el creativo; conjuntos vencidos de AWFIT/Bliss quedan dentro de sus campañas.

## Una recomendación
Con OK de Laura, confirmar el pago y reactivar AWFIT con su conjunto vigente "ST AWIFT Oct" (fin 29-nov, $3/día) para cumplir las 2 campañas contratadas sin pasarse del presupuesto (3 x 5 días de octubre + noviembre dentro de los $200), y antes verificar destino/CTA de los 2 anuncios sin dato. Si Laura mantiene "dejar como está", no se toca nada.

## [DATO] para Laura
1. ¿Se resolvió el pago (tarjeta vencida 17-oct) y reactivamos AWFIT?
2. ¿AWFIT/TLL es Lobster? ¿Cuál es la segunda campaña contratada?
3. URL de destino de los anuncios "ST Bliss - Reel" y "MT Bliss" (Airbnb, Furnished Finder o web propia).
4. ¿Quién administra el pixel "Shannon Leach Amos" y hay web propia donde instalarlo?
5. ¿Arreglamos el creativo de las 3 campañas viejas para archivarlas, o se dejan?

Herramientas llamadas en Meta: 12 (cuentas, campañas this_month, conjuntos 90d, anuncios 90d, errores, datasets, stats de dataset x2, creativos, públicos, 3 campañas viejas, campañas 90d). Notion: 0.
