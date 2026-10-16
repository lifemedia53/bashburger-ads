# Precios de referencia (USD por 1M tokens, API Anthropic, cache 2026-10-06)

| Modelo | Entrada | Salida | Uso en la agencia |
|---|---|---|---|
| Opus 5.5 | $4.00 | $20.00 | Jefe: coordinación y estrategia |
| Sonnet 5.5 | $2.00 | $10.00 | Seniors |
| Haiku 5.5 | $0.10 | $0.50 | Técnicos repetitivos y Token Controller |

Haiku es ~20x más barato que Sonnet y ~40x más que Opus. Ante duda, usar el más barato que cumpla.
Estimación cuando solo hay total de tokens de un subagente: asumir ~95% entrada / ~5% salida (la mayoría es contexto: sistema, herramientas, lecturas). Un entregable de texto típico son 2–4k tokens de salida.
