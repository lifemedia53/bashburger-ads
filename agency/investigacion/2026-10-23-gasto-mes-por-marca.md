# Gasto Meta Ads por marca, 1-23 oct 2026

Fuente: Meta (mcp__Meta__ads_get_ad_accounts y ads_get_ad_entities nivel cuenta, time_range 2026-10-01 a 2026-10-23, leído 2026-10-23). Contratado: `agency/memoria/planes.json` (solo trae cantidad de campañas, sin monto) y `clientes.json` (presupuesto CLP solo para The Cool Hostel). Solo lectura.

| Marca | Cuenta (id) | Gasto 1-23 oct | Moneda | Contratado al mes | Nota |
|---|---|---|---|---|---|
| Bombo Burger / Bombo Burger SpA | 362765604642572 | 689.861 | CLP | [DATO] monto; planes: 3 campañas + 1 boost | 942.937 impr. El business "Bombo Burger SpA" agrupa varias cuentas |
| Mare By Bombo | 4197093347202081 | 615.107 | CLP | [DATO] monto; planes: 2 campañas | 345.186 impr. |
| Bash Burger | 1753718285299909 | 175.928 | CLP | [DATO] monto; planes: 2 campañas + 1 boost | 264.874 impr. |
| Bendito Completo | 1411268713631255 | 170.606 | CLP | [DATO] monto; planes: 2 campañas + 1 boost | 184.919 impr. |
| The Cool Hostel | 1428593511882773 (oficial) | 147.241 | CLP | 60.000 (clientes.json, presupuesto_mensual_clp) | Gasto sobre lo registrado (2,5x); revisar |
| The Cool Hostel (no usar) | 3079760962193758 | sin dato devuelto | CLP | n/a | Meta no devolvió gasto ni impresiones |
| Entre Tacos | 1542868017355716 | 93.926 | CLP | [DATO] monto; planes: 2 campañas + 1 boost | 67.131 impr. |
| Steakhouse by Bombo | 1642000733624651 | 86.519 | CLP | [DATO] monto; planes: 1 campaña | 48.561 impr. |
| Comercializadora Bombo | 1447851609427252 | 60.643 | CLP | [DATO] monto; planes: 2 campañas + 1 boost | 81.777 impr. |
| Tony's Pasta | 1032681759334136 | 40.171 | CLP | [DATO] monto; planes: 2 boost IG | 51.660 impr. |
| Cuenta sin nombre | 1802064240289181 | 95.884 | CLP | [DATO] marca no identificada | 77.054 impr. No figura en clientes.json |
| Picanha Rodizio (ex cliente) | 1856416768406342 | sin dato devuelto | CLP | n/a | Ex cliente desde 2026-10-10 |
| Picanha Rodizio Grill | 874798138783606 | 0 | CLP | n/a | Sin método de pago, sin entrega |
| Lullaby Rentals (oficial) | 10201332475268991 | 112,49 | USD | [DATO] monto; planes: 2 campañas | 9.544 impr. Nombre de cuenta = su id |
| Lullaby Rentals (no usar) | 894994272588936 | 0 | USD | n/a | Vacía, sin método de pago |
| Lotus Estilistas | 2150099018564052 | 232.023,35 | ARS | [DATO] monto; planes: 2 campañas + 1 boost | 252.029 impr. |
| Lotus Casa Cultural | 701985235103370 | 192.740,01 | ARS | [DATO] monto; planes: 1 campaña + 1 boost | 247.597 impr. |
| Somos Casa Lotus | 1158795777045841 | 27.677,06 | ARS | [DATO] monto; planes: 1 campaña + 1 boost | 20.486 impr. |
| Casa Lotus | 1412751867673464 | 0 | ARS | [DATO] | Sin método de pago, sin entrega |

## No leídas

- Santerra By Bombo (3361702410655763): Ads MCP no habilitado en esa cuenta (rollout gradual de Meta). [DATO] gasto.
- La Siciliana Trattoria LM (2023056398578641): igual, Ads MCP no habilitado. [DATO] gasto.
- Lemarc Importadora (2819592505082598): estado UNSETTLED, no consultable ("Unknown error"). [DATO] gasto.
- Lotus - Cuenta publicitaria (613358050804789): CLOSED, no consultable.
- Bombo Tiki House y Beach, Lighthouse: sin cuenta identificada en Meta ni en memoria. [DATO]

## Totales (solo lo leído; monedas no se suman entre sí)

- CLP: 2.175.886 (suma de las 10 cuentas CLP con gasto: 362765604642572, 4197093347202081, 1753718285299909, 1411268713631255, 1428593511882773, 1542868017355716, 1642000733624651, 1447851609427252, 1032681759334136, 1802064240289181)
- USD: 112,49
- ARS: 452.440,42
- El total CLP es mínimo: faltan Santerra, La Siciliana y Lemarc (sin lectura).
