---
name: gasto-ads-semanal
description: Reporte semanal de gasto en Meta Ads por cliente contra su presupuesto mensual, con alertas si se pasan. Úsalo cuando Laura pida el dashboard de gastos de ads, "cómo vamos de gasto", el resumen semanal de ads o cuando haga clic en este skill.
---

# Gasto semanal de Ads por cliente (Life Media)

Solo lectura. Nunca pausar, activar ni editar nada en Meta desde este skill.

## Pasos
1. Leer `agency/memoria/presupuestos-ads.json` (marcas, cuentas, moneda, presupuesto mensual y noviembre). Si el mes en curso es noviembre y existe `presupuesto_noviembre`, usar ese. Sin presupuesto = `[DATO]`: no inventar.
2. Para cada cuenta con id que sea legible por Meta (Ads MCP): una sola lectura a nivel cuenta (`ads_get_ad_entities`, level `ad_account`, solo `amount_spent`), dos veces: `date_preset=this_month` y `date_preset=last_7d`. Una cuenta a la vez, sin repetir lecturas, sin traer campañas ni anuncios. Si una cuenta no se puede consultar (Ads MCP no habilitado, UNSETTLED, CLOSED), dejarla en la tabla marcada "sin lectura" y decir por qué.
3. Calcular por cliente: gasto del mes, % del presupuesto, gasto de los últimos 7 días, y proyección a fin de mes = gasto del mes / día del mes x días del mes (marcarla "proyección", es cálculo propio, no dato de Meta).
4. Alertas (reglas en el json): 🟡 80% o más, 🔴 100% o más, 🟠 la proyección supera el 100%. Los clientes pausados a propósito (Hostel, Steakhouse) se muestran como "pausado por orden de Laura" sin alerta, con la fecha de reactivación.
5. No sumar monedas distintas (CLP, ARS, USD): totales por moneda.

## Cómo responderle a Laura
- Español de Chile, tono amistoso, corto (ella tiene TDAH): máx. 3 bloques.
- Bloque 1: alertas primero (quién se pasó o va a pasarse, con cifras).
- Bloque 2: tabla marca | gasto mes | presupuesto | % | últimos 7 días | proyección | alerta.
- Bloque 3: totales por moneda y los [DATO] pendientes (presupuestos que faltan), como decisiones numeradas.
- Citar la fuente: "Meta, lectura de <fecha>, 1 al <día> del mes".
- Si Laura da un presupuesto nuevo, anotarlo en `agency/memoria/presupuestos-ads.json` con la fecha y de dónde viene.

## Costo
Es una lectura liviana (1 llamada por cuenta y ventana). Si hay que leer más de 8 cuentas, usar el agente `meta-ads-auditor` en Sonnet.
