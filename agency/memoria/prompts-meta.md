# Prompts de Meta Ads (aportados por Laura, 2026-10-18)

Plantillas reutilizables. Rellenar los [corchetes] con datos REALES del cliente (planes.json, clientes.json, voz/). Salida en español de Chile.

## 1. Estructura de creativos Andrómeda → agente: paid-media-lead (técnico de creativos)
Rol: experto en Meta Ads con foco en el algoritmo Andrómeda; el creativo ES el targeting.
Entrada: [qué vende el cliente, a quién y su diferencial].
Salida:
1. 3 a 5 buyer personas.
2. Por persona, mínimo 2 puntos de dolor.
3. Por dolor, mínimo 3 creativos:
   - BUYER PERSONA: perfil (quién es, qué hace, qué le importa), dolor, lo que desea.
   - CREATIVO N [video corto / imagen / carrusel / UGC]: ángulo (problema-solución / testimonial / educativo / comparación / urgencia), hook (3 segundos), mensaje central, CTA.
Reglas: formato distinto por creativo; ángulos distintos entre sí; tono adaptado a esa persona.
Cierre: tabla persona × dolor × formato × ángulo = mapa de producción.
Límite de la agencia: solo guiones y briefs; las piezas gráficas/video las hace el Creative Team humano.

## 2. Análisis de la Ad Library de una marca → agente: market-trends-analyst
Entrada: [MARCA] y [URL de su Ad Library]. Entregable: HTML bien diseñado con gráficos.
Analizar: formatos (video/imagen/carrusel y distribución); partnerships vs brand ads ("with" + handle); mensajes que repiten; a quién les hablan (inferido); top 10 anuncios con más impresiones; anuncios más longevos; velocidad creativa; conclusión estratégica (qué hacen bien, gaps, oportunidades).
Límite real (verificado 2026-10-18): la herramienta de Meta (ads_library_search) entrega id y fechas, sin texto ni impresiones; WebFetch no abre Instagram ni Maps. "Top 10 por impresiones" no se puede con las herramientas actuales: marcar [DATO]. La longevidad (fechas) sí se puede.

## 3. Diagnóstico de performance por rol en el funnel → agente: meta-ads-auditor (solo lectura) con paid-media-lead
Entrada: últimos 30 días mínimo (comparar con período anterior), negocio, ticket promedio, objetivo, CPA objetivo, ROAS objetivo, y datos por conjunto y anuncio (Spend, Impresiones, Alcance, Frecuencia, CPM, CTR, CPC, Conversiones, CPA, ROAS).
Criterio de roles:
- TOP OF FUNNEL: spend alto / frecuencia baja / CPM bajo / CPA alto. Crea atención; se juzga por CPM, CTR, alcance, frecuencia.
- BOTTOM OF FUNNEL: spend bajo / frecuencia alta / CPM alto / CPA bajo. Convierte; se juzga por CPA, ROAS, tasa de conversión.
Salida: (1) diagnóstico por conjunto (rol dominante, si cumple, anuncios fuera de rol); (2) análisis por anuncio (rol, si funciona y por qué, top y flojos); (3) balance del funnel (¿hay ToFu suficiente?, ¿dónde se rompe?); (4) plan priorizado: escalar (cuánto), mejorar (qué cambiar), pausar (por qué), top 3 acciones de la semana.
Reglas de la agencia: sin datos reales no se inventa; pausar/escalar solo lo ejecuta el Jefe con OK de Laura; no tocar fase de aprendizaje.
