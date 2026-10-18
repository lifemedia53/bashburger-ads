# Pendientes (traspaso de sesión 2026-10-17, actualizado en la 2ª sesión del día)

Leer esto al iniciar una sesión nueva y seguir desde aquí.

## Hacer
1. Bombo: remedir el test CJ Delivery (120249348553550141, cuenta 362765604642572) el 2026-10-24 y cerrar como ganador si se mantiene. No tocar público, placements, puja, atribución ni presupuesto.
2. Hostel: estrategia nueva ejecutada el 2026-10-18 (ver sección abajo). Medir por WhatsApp (conversaciones de Meta) vs reservas de Little Hotelier por semana de reserva, cada lunes. Evaluar el 2026-10-31 con 2 semanas de datos. No proponer campañas nuevas (decisión de Laura 2026-10-10) hasta esa fecha.
3. Hostel (Laura, 2026-10-18: "seguiremos a ciegas", no sigue con esto): nadie anota "cómo nos conociste" en Little Hotelier (Laura, 2026-10-18: no ve ningún chat con esas palabras). Sin eso el cruce semanal es solo correlación. Pendiente: definir otra forma de atribuir (ej. preguntar al contestar el WhatsApp). El pixel de Little Hotelier sigue sin disparar Purchase (último 7-oct); Laura no sabe activarlo; sin CAPI.
4. Instagram (programar posts yo directo, sin herramientas de terceros): Laura lo ve la semana del 2026-10-19 (respuesta 2026-10-17); no avanzar antes. Decisiones abiertas abajo. Instagram no está conectado en Composio todavía (requiere que Laura autorice cada cuenta). Google Business: sin vía directa, queda manual (Trello).

## IG: lo que mostró el calendario (fuente: lectura de Laura con Claude en Chrome del Sheet "Calendario Contenido Octubre 2026", pestañas Bash Burger y Santerra By Bombo, 2026-10-17)
- Columnas: Publicacion, Dia, Formato, Pilar, Texto/Contenido, Enlaces, Estado, Fotografía, Diseñador, Notas/Base plantillas. No hay columna de hora ni de caption: la columna Texto es el concepto o el texto de las láminas, no el caption.
- Estados del desplegable: Entregado, Aprobación 1, Aprobacion 2, Programado, Pendiente. Programado = SUBIDO (alguien ya lo programó en otra herramienta, sin confirmar cuál). Aprobacion 2 no está definido por escrito (no asumir que es aprobación del cliente).
- La mayoría de las piezas son Historias (3 a 4 por día). Instagram no deja agregar stickers (link, encuesta), música ni reposteos por API, así que las Historias con sticker quedan manuales. Candidatos reales: Post, Carrusel y Reel.
- Los diseños aparecen como nombre de archivo (ej. BSH_C1_0210), sin URL. Hay duplicados reutilizados y celdas "Drive" sin link.
- Basura: 31 fórmulas =AI(...) en Bash; filas fechadas 1/11; una fila 4/10 dentro del bloque del 11/10; Santerra sin datos desde el 20-10.
- Al 17-oct ninguna pieza de feed futura tiene diseño y estado listos.
- Propuesta (sin aprobar): agregar al Sheet columnas Hora, Caption, Link Drive del diseño y Aprobado por cliente; yo publico solo Post/Carrusel/Reel con todo completo; primero en modo ensayo (preparo y muestro, sin publicar). Pendiente verificar si Composio Google Sheets lee rangos completos sin Chrome.
- Decisiones de Laura pendientes: dónde programan hoy (herramienta), qué estado significa aprobación del cliente, cliente de prueba (Bash Burger o Santerra), si agregan las columnas nuevas.

## Hostel: línea base de reservas (fuente: panel de Little Hotelier, copiado por Laura, actualizado 2026-10-17 19:51)
- Rango de reserva: 10-oct-2026 a 31-ene-2027. Ingresos habitaciones $541.880; ingresos totales $546.280; 5 reservas (sin cancelaciones); 11 pernoctaciones; ADR $49.262; estadía media 2,2 noches; 10,4 días entre reserva y llegada.
- Los porcentajes que acompañan cada cifra en el panel (96,2 %, 97,4 %, etc.) no están explicados: [DATO] preguntar a Laura qué comparan.
- [DATO] No se sabe si el rango es fecha de reserva o de estadía, ni si son solo reservas web (Laura dijo "reservas web"). Sin eso, las 5 reservas no se pueden atribuir a Meta: es el tope, no el resultado de la campaña.
- Cálculo (mío, no de la fuente): gasto Meta 10 al 17-oct $14.712 / 5 reservas = ~$2.942 por reserva si todas vinieran de Meta.

## Hecho el 2026-10-17
- Bombo remedido (Meta, solo lectura, 11 al 17-oct, 2da lectura del día): $168.301 gastados, 120 Iniciar pago, $1.403 por Iniciar pago vs base $2.165 (-35%; la base tenía solo 20 eventos). Anotado en la Bitácora (campo Resultado confirmado, estado En seguimiento).
- Hostel remedido (Meta, 10 al 17-oct): $14.712 gastados, 14.685 impresiones, 1.541 clics, sin compras medidas. Nueva entrada en la Bitácora: https://app.notion.com/p/3fc673eb9c5681a995d2fca08cc0bfad
- Rama pasada a main con el PR https://github.com/lifemedia53/bashburger-ads/pull/2 (orden de Laura: hacerlo siempre al cerrar).
- Pressures Perfect: ya estaba corregido en Trello (prompt GHa83Jm7, 2 posts de Lighting y descripción de la tarjeta 6qK2FXfi). Fuente: lectura de Trello el 17-oct. No requiere cambios.
- Aviso semanal de tokens activado: lunes 08:47 (hora de Chile), tarea programada "Aviso semanal de tokens (lunes)" (trig_0136M5Q31usuL71Twpjphuvi). Primer aviso: 2026-10-19. Lee `agency/logs/` y avisa por push.

## Sesión 3 del 2026-10-17: pixel Hostel, agentes, modelos
- Pixel Hostel (fuente: Meta, solo lectura, 17-oct): "Datos de The Cool Hostel" (1487303793186321) activo, último disparo 2026-10-07; Purchase solo el 23-sep, 30-sep, 1-oct, 6-oct y 7-oct; ninguno desde el 8-oct; sin PageView; sin calidad de datos web; server_last_fired 2026-05-30. Little Hotelier muestra la app "Seguimiento de conversiones con el píxel de Meta" ACTIVADA con ese ID (captura de Laura, sin fecha). Ya figuraba en la auditoría del 16-oct (Notion, "Pausas ejecutadas tras auditoría"). Hay 5 reservas desde el 10-oct y 0 Purchase en Meta: la app no está disparando en la confirmación. [DATO] cuándo se activó la app.
- Próximo paso Hostel: reserva de prueba en la web de reservas y revisar Purchase en Meta (Pixel Helper o Test Events); si no llega, escribir a soporte de Little Hotelier con el ID.
- Trello (fuente: lectura vía Composio, 17-oct): además de Halloween hay tarjetas "Eventos octubre" (Día del Chef / Pasta / Churrasco / Gin&Tonic) en todas las marcas del Centro Bombo, creadas 16-17 oct, y "SEO octubre" en Pressures, Lotus Estilistas, Lemarc, Comercializadora Bombo y The Cool Hostel. Hostel también tiene "Publicaciones Hostel Octubre 2026". [DATO] contenido y N° de posts por tarjeta no revisado; Lullaby sin tarjetas nuevas en los tableros revisados.
- Modelos: nueva guía `agency/memoria/modelos.json`; el hook de inicio avisa si Opus pasa del 50 % del gasto; token-controller ahora recomienda cambios de modelo (no los ejecuta).
- Respuestas de Laura (2026-10-18): aprobó darles conectores a las rutinas y la revisión semanal de ops-coordinator en Haiku; NO quiere reserva de prueba en el Hostel y pidió cambiar la estrategia. La herramienta de sesión no puede dar conectores en esta organización (error al crear), así que las 3 rutinas NO existen: se borraron las 2 desactivadas. Prompts y pasos para crearlas desde claude.ai en `agency/memoria/proxima-sesion.md`.
- Estrategia Hostel: pendiente. Prompt de la próxima sesión (Sonnet) en `agency/memoria/proxima-sesion.md`. Hipótesis a validar: medir por conversaciones de WhatsApp + reservas de Little Hotelier, no por Purchase del pixel. Dato de apoyo: anuncio "Cris+Rawy WhatsApp" con 14 leads a $924 (fuente: auditoría del 16-oct en Notion, 14 días).

## Datos útiles
- Trello se maneja con Composio (cuenta conectada, ya activa). Se usa solo para Local SEO.
- Rutinas creadas: día 7 (resultados de Google y clientes) y días 28 y 6 (correcciones de Vero, Eventos del Año y posts del mes).
- Halloween 2026: tarjetas listas en Trello para todos los clientes activos (ver `clientes-google.json`).
- Pendientes que confirma Vero: horario del 31-oct (Bombo Ulriksen), tomahawk en Steakhouse, tenedor libre en Tiki House y links de PedidosYa/Uber Eats.

## Sesión 4 del 2026-10-18: estrategia Hostel (fuente: Meta, lectura y cambios con OK de Laura, 18-oct)
- Hallazgo: Laura creó el 11-oct la campaña MENSAJES CONSULTAS COOL HOSTEL 2026 (120249359954760575, conjunto CJ 1 - Viajeros La Serena 120249359954750575, anuncio Cris + Rawy Whatsapp 120249359954740575; log de actividad de Meta). Corría a $3.000/día junto a la campaña web de $2.000/día = $5.000/día, no los $2.000 que se creían.
- Medido 10 al 18-oct: WhatsApp $18.255, 9.549 impresiones, 29 conversaciones a $629 (los 14 leads a $924 de la auditoría del 16-oct eran de otra ventana). Campaña web Purchase: $15.177, 1.608 clics, 0 compras medidas. Pixel 1487303793186321: solo 3 Purchase en octubre (1, 6 y 7-oct), ninguno después hasta el 17-oct.
- Ejecutado con OK de Laura y verificado en vivo: campaña "Reservas Hotelier - Purchase" (120249343804190575) PAUSADA; conjunto CJ 1 bajado de $3.000 a $2.000/día ($60.000/mes, lo contratado). WhatsApp queda como única campaña activa. Cambio de presupuesto quedó primero en borrador y se publicó; lectura posterior confirma $2.000 y ACTIVE.
- Riesgo asumido: la campaña web podía traer parte de las 5 reservas desde el 10-oct (sin atribución). Si bajan las reservas de Little Hotelier en 2 semanas, reactivar la web.
- A $2.000/día y $629 salen ~3 conversaciones al día (~22 por semana): bajo las 50 por semana para salir del aprendizaje; se acepta porque el canal vende por mensaje.

## Sesión 5 del 2026-10-18: prioridades de All Tasks en Notion (fuente: Notion, lectura y cambios de Priority con OK de Laura, 18-oct)
- Subagente ops-coordinator (Sonnet) leyó 138 tareas (113 abiertas + 25 Published/Reprogram; excluye 59 Complete) con su cuerpo. Tabla completa y estado de cada una: `agency/memoria/prioridades-propuesta.json` (campo `estado_proceso`: aplicado / propuesto_sin_aprobar / pendiente).
- Aplicado y verificado (releyendo cada página) con aprobación de Laura por lotes de 10: tareas 1 a 60, más #69 (queda Urgent) y #70 (pasa a Urgent). Pendiente de aprobación: lote 7 (#61 a #68). Faltan #71 a #138.
- Cerradas por orden explícita de Laura (Status Complete + Low): #24, #26, #28, #43, #46, #55, #56. #27 Promo nombres reprogramada: Scheduled For 2026-10-21, sigue Published/Reprogram.
- Respuestas de Laura a los [DATO]: #25 video Tiki (Urgent, necesario para ads); #33 tarjeta de ads de Tiki es un diseño (Medium); #38 Bloquear Santiago = excluir Santiago de los ads de Comercializadora (Urgent; cambio en Meta NO ejecutado, requiere OK); #49 dispositivos de La Siciliana = seguridad, ver dispositivos y cambiar clave (Medium); #69 Catlos debe pasarle el documento con la propuesta de redes de The Smile Mission (Urgent); #70 The Smile Mission es prospecto real, muy urgente: Laura debe auditar sus cuentas de Meta Ads (16 clínicas).
- Quedan 9 [DATO] sin responder del agente (ver json: cuerpo vacío o título críptico) y 46 tareas con deadline de septiembre aún abiertas para marcar 'posible hecha sin cerrar' y mostrar en bloque aparte, sin cerrar (decisión de Laura).
- Posibles duplicadas: 3 tareas de QR/fidelidad Bendito y Entre Tacos; #29 y #30 (Auditoría Tiki P1 29-sep y Reconocimiento vencido). Posibles obsoletas: Lotus Casa Cultural Remarketing (cuerpo dice EJECUTADA 06-oct), Lotus Estilistas refresh AD 2, Gestión de Campaña AD (Hostel), Auditoría Comercializadora (P1 de pago regularizado 10-oct).
- Mapa de procesos de la agencia + oficina virtual isométrica (web, no imagen): para DESPUÉS de prioridades y fechas. Anotado como tarea en Notion: https://app.notion.com/p/3fd673eb9c568177beb0d0e2e1cee0e1. Los agentes no tienen carpeta propia: cada uno es un archivo en `.claude/agents/` y comparten `agency/memoria/`.
- Notion: consultas SQL/rows agotadas por cupo (se reinicia en ~60 min); se trabajó con fetch por página. Verificar releyendo cada página cuesta ~3,5k tokens: para próximos lotes verificar por muestra o con vista guardada (view mode).
- Pendiente de Meta con OK de Laura: excluir Santiago de la segmentación de Comercializadora (#38); auditoría de cuentas de The Smile Mission (#70).
