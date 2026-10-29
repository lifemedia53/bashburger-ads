# Local SEO - Servicios en GBP (Pressures Perfect) y checklists Apple Maps / Bing / Yelp (29-oct-2026)

Borrador interno para Max/Vero. No se publicó ni se editó nada en Google, Trello, Notion ni Meta; no se crearon cuentas ni fichas.

Fuentes usadas: agency/memoria/clientes-google.json (nombre oficial "Pressures Perfect", sin apóstrofo; Lighting impulsado oct-dic), data-clientes.json (hoja DATA CLIENTES, copia 12-oct), enlaces-perfiles-cartas.json, google-resultados.json (kw sept 2026), geo-aeo-2026.json, guías de voz en agency/memoria/voz/, y los posts ya subidos de Pressures (borradores 17-oct y 26-oct, que salieron del prompt de Trello GHa83Jm7).
Límite de la corrida: pressuresperfect.com y Google Maps no se pudieron abrir desde aquí (proxy 403) y la búsqueda web no encontró la ficha. Hoy NO releí el prompt de Trello (la tarea pedía no tocar Trello). Todo lo de "web del cliente" queda como [DATO] para que Max/Vero lo confirmen mirando la ficha y el sitio.

---

## PARTE 1 - Pressures Perfect: servicios para la ficha de Google (GBP)

Contexto: Huntsville AL, mercado USA, inglés. Sept 2026: 160 vistas, 3 interacciones (ago 213 / 12; jul 107 / 5): la ficha casi no convierte, así que los servicios cargados con texto son una palanca real. Keywords con datos: "pressure washing huntsville al" (2 meses), "power washing huntsville al" (jul), "window cleaning" (sept). Marca mal escrita ("pressure perfect llc alabama", "pressure clean shop huntsville") se ignora.

Datos NAP base:
- Nombre: Pressures Perfect
- Teléfono: (256) 558-8387 (coincide con WhatsApp wa.me/12565588387 de DATA CLIENTES)
- Web: https://pressuresperfect.com/
- Yelp: https://m.yelp.com/biz/pressures-perfect-owens-cross-roads (la URL sugiere Owens Cross Roads, AL)
- Dirección / tipo de ficha: [DATO: ¿ficha con dirección visible o negocio de área de servicio (dirección oculta)? Calle y ZIP]. DATA CLIENTES tampoco tiene link de Google Maps de este cliente.
- Áreas atendidas que ya usamos en posts: Huntsville, Meridianville, Athens, Hazel Green, Madison. [DATO: Vero confirma que cada una está cargada como área de servicio en la ficha; no inventar ciudades].
- Horario: [DATO]
- Veteran-owned: se usa en posts; [DATO: ¿atributo "Veteran-owned" activado en la ficha?]

### Lista de servicios (nombre / descripción corta)
Regla: sin precios. Descripciones en inglés, máx. 300 caracteres (límite de la ficha). Una keyword local por servicio, sin relleno. Los caracteres de abajo están contados con script.

| # | Nombre del servicio (ficha) | Descripción corta propuesta | Fuente del servicio |
|---|---|---|---|
| 1 | Pressure Washing | Pressure washing in Huntsville, AL for homes and businesses. We lift algae, mildew, dirt and grime from exterior surfaces. Call (256) 558-8387 for a free estimate. | Posts del lote 17-oct y 26-oct (residential pressure washing) |
| 2 | Driveway & Concrete Cleaning | Driveway and concrete cleaning in Huntsville, Meridianville and nearby areas. Removes dark algae streaks, slick spots, tire marks and oil stains. Free estimate. | Post 1 del lote 17-oct (prompt GHa83Jm7) |
| 3 | Roof Cleaning | Roof cleaning in Huntsville, Athens and Hazel Green. We remove the algae and mildew behind dark roof streaks with a method that fits your roof material. Free estimate. | Post 2 del lote 17-oct |
| 4 | Gutter Cleaning | Gutter cleaning in Huntsville and Athens. We clear leaves and debris so rain drains away from your siding, roofline and foundation. Free estimate. | Post 2 del lote 26-oct |
| 5 | Lighting Service | Holiday and exterior lighting for homes in Huntsville and Madison, AL. We hang and decorate your lights so you skip the ladder. Free estimate. | Post 1 del lote 26-oct; prioridad oct-dic 2026 (Laura, clientes-google.json) |
| 6 | Window Cleaning | [DATO: confirmar que ofrecen window cleaning. Aparece solo como búsqueda real en sept 2026 ("window cleaning"), no como servicio en nuestros posts. Si lo ofrecen: "Window cleaning in Huntsville, AL for homes and businesses. Clear, streak-free glass inside a free estimate."] | Solo keyword de Google (sept 2026) |
| 7 | Soft Washing / House & Siding Washing | [DATO: ¿ofrecen soft washing o lavado de fachada/siding como servicio propio? En posts solo aparece "residential pressure washing" y siding como superficie]. | Sin fuente |
| 8 | Servicios adicionales (deck, fence, patio, commercial) | [DATO: lista completa de servicios del sitio web / prompt]. No agregar ninguno sin confirmar. | Sin fuente |

Por cada servicio en la ficha: categoría de servicio exacta del menú de Google (si no existe, dejar como "Servicio personalizado"), precio vacío o "Free estimate" en la descripción, nunca montos.

Categorías de la ficha: [DATO: leer categoría principal y secundarias actuales; la nota de geo-aeo-2026.json dice que no están revisadas]. Sugerencia a validar: principal "Pressure washing service"; secundarias solo si son reales (Roofing contractor no; Gutter cleaning service, Window cleaning service y Christmas light installation service solo si los hacen).

---

## PARTE 2 - Esquema de página por servicio (pressuresperfect.com)

Idea principal: una URL por servicio, cada una responde la pregunta que alguien teclea o dicta, con datos en texto plano (dirección/áreas, teléfono, "free estimate"). Según geo-aeo-2026.json el sitio pesa más que la ficha para IA; FAQPage ya no da rich results, así que las preguntas van como contenido normal, no como truco. Un solo texto para personas.

Slugs sugeridos (a validar con la estructura real del sitio, [DATO: ¿WordPress? ¿ya existen páginas de servicio? hay una tarea previa "Páginas de servicios de Pressures" en Notion para no duplicar]):
/services/pressure-washing-huntsville-al/ , /services/driveway-concrete-cleaning-huntsville-al/ , /services/roof-cleaning-huntsville-al/ , /services/gutter-cleaning-huntsville-al/ , /services/holiday-lighting-huntsville-al/ , /services/window-cleaning-huntsville-al/ (solo si lo ofrecen).

### Plantilla (se repite por servicio)
- Title (≤58 car.): "[Servicio] in Huntsville, AL | Pressures Perfect"
- H1: "[Servicio] in Huntsville, AL" (una sola vez)
- Meta description (≤155 car.): qué hace el servicio + áreas + "free estimate" + teléfono. Sin precios.
- Primer bloque (40-60 palabras, respuesta directa): qué es el servicio, dónde (Huntsville + áreas confirmadas), para quién (casas y negocios [DATO si atienden comerciales]), cómo pedir estimate.
- Secciones H2: 1) Qué incluye / qué superficies; 2) Señales de que lo necesitas (lista); 3) Cómo trabajamos (método por material [DATO: método de techo]); 4) Áreas que atendemos (solo las confirmadas); 5) Preguntas frecuentes (frecuencia, seguridad, cuánto dura, ¿necesito estar en casa?) con respuestas reales [DATO] donde falte dato; 6) Free estimate: teléfono (256) 558-8387 + formulario; 7) Enlaces internos a servicios relacionados (techo <-> canaletas; limpieza antes de luces).
- Fotos reales antes/después con alt descriptivo [DATO: material del cliente].
- Reseñas: solo reseñas reales de Google/Yelp, con link a la reseña. Nada inventado.
- Precio: sin precio ("free estimate"). Garantías, seguros, licencia: [DATO] si se quieren mencionar.

### Ejemplo completo: Roof Cleaning
- Title: "Roof Cleaning in Huntsville, AL | Pressures Perfect" (51 car.)
- H1: "Roof Cleaning in Huntsville, AL"
- Meta: "Roof cleaning in Huntsville, Athens and Hazel Green. Safe removal of algae streaks and mildew. Call (256) 558-8387 for a free estimate." (revisar largo al publicar)
- Intro: "Roof cleaning removes the algae and mildew that cause dark streaks, using a method that fits your roof material. Pressures Perfect, a veteran-owned company, cleans roofs for homeowners in Huntsville, Athens and Hazel Green. Ask for a free estimate." (el "veteran-owned" va si Vero confirma el atributo)
- H2s: What roof cleaning includes / Signs your roof needs it / Which method we use [DATO: método] / Areas we serve / Roof and gutter cleaning in one visit (link a Gutter Cleaning) / Get your free estimate.

### Schema sugerido (JSON-LD, coincidir con el texto visible)
- En todas las páginas: LocalBusiness (o subtipo más específico que valide, [DATO: Vero elige tipo]) con name "Pressures Perfect", url, telephone "+1-256-558-8387", sameAs [Yelp, Instagram https://www.instagram.com/pressuresperfect/, Facebook https://web.facebook.com/pressuresperfect], areaServed (las ciudades confirmadas). address: [DATO] (si es negocio de área de servicio, no publicar dirección falsa).
- Por página: Service con serviceType (ej. "Roof Cleaning"), provider (el LocalBusiness anterior), areaServed, description igual al texto visible. Sin "offers" ni precio.
- BreadcrumbList en cada página de servicio.
- aggregateRating / Review: solo si son reales y visibles en la página [DATO]. Si no, omitir.
- FAQPage: opcional, solo para ordenar; no esperar rich result (Google lo dejó de mostrar el 7-may-2026).
- Skill recomendada para generar el JSON final cuando estén los datos: searchfit-seo:generate-schema.

---

## PARTE 3 - Checklists NAP por cuenta: Apple Maps (Business Connect, 11-nov), Bing Places y Yelp (12-nov)

Fuente de los datos: DATA CLIENTES (teléfonos = números wa.me de WhatsApp, copia 12-oct), guías de voz y borradores ya subidos. El teléfono de la ficha de Google puede ser distinto del de WhatsApp: [DATO] a verificar con la ficha. Regla de oro (geo-aeo-2026.json): nombre, dirección y teléfono escritos idénticos en todas las plataformas. Categoría de TODAS las fichas: [DATO: copiar la categoría principal que tiene hoy la ficha de Google; no están revisadas en memoria]. Nombres oficiales: copiar tal cual los de la ficha de Google.

Para cada cuenta completar en Apple Maps / Bing Places / Yelp: nombre, dirección, teléfono, categoría, horario (incl. feriados), web/carta, fotos reales, descripción corta y link a Instagram. Verificación (llamada/código/postal) la hace quien tenga acceso al teléfono del negocio [DATO: quién].

| Cuenta (ficha) | Dirección | Teléfono (WhatsApp en DATA CLIENTES) | Horario | Web / carta |
|---|---|---|---|---|
| Bombo Burger Beach | Av. del Mar 994, La Serena | +56 9 3522 5080 | [DATO] | bomboburger.cl/pedir |
| Bombo Burger Mall Plaza | Terraza Mall Plaza, Alberto Solari 1400, La Serena | +56 9 5792 7693 | [DATO: horario mall] | bomboburger.cl/pedir |
| Bombo Burger Balmaceda | Av. Balmaceda 3039, La Serena | +56 9 5792 7693 | [DATO] | bomboburger.cl/pedir |
| Bombo Burger Ulriksen | Av. Guillermo Ulriksen 2965, La Serena | +56 9 5792 7693 | [DATO] | bomboburger.cl/pedir |
| Bombo Burger Santiago | Constitución 58, Local 72, Patio Bellavista, Santiago | +56 9 8993 6724 | [DATO] | bomboburger.cl/pedir |
| Entre Tacos Av. del Mar | Avenida del Mar 900, La Serena | +56 9 3928 8409 | [DATO] | spleatweb.app (carta, ver enlaces-perfiles-cartas.json) |
| Entre Tacos Peñuelas | Av. Los Pescadores 5050, Peñuelas, Coquimbo | +56 9 8813 0160 | [DATO] | spleatweb.app |
| Bendito Completo Av. del Mar | Avenida del Mar 900, La Serena | +56 9 3928 8409 | [DATO] | spleatweb.app |
| Bendito Completo Peñuelas | Av. Los Pescadores 5050, Peñuelas, Coquimbo | +56 9 8813 0160 | [DATO] | spleatweb.app |
| Tony's Pasta Centro | Gregorio Cordovez 391, La Serena | [DATO: sin teléfono en DATA CLIENTES] | [DATO] | [DATO: sin carta en el enlace de DATA CLIENTES] |
| Mare by Bombo | Av. Las Higueras 0670, La Serena | +56 9 5515 4464 | Lun-Dom 12:00-23:00 (prompt 14-jul; feriados [DATO]) | qrfy.com carta + reservas CoverManager |
| Steakhouse by Bombo | Av. Las Higueras 0670, La Serena [DATO: misma dirección que Mare, confirmar] | +56 9 5515 4464 | [DATO] | spleatweb.app |
| Santerra by Bombo | Peñuelas Nte. 21, dentro de Enjoy Coquimbo (decir siempre "dentro de") | +56 9 6666 1861 | [DATO: "12:30-23:30 variable" sin confirmar; desayuno 8:00-11:00 [DATO] vigente] | spleatweb.app |
| Bombo Comercializadora (Distribuidora Bombo) | Talca Sur 101, Bodega 21, Coquimbo | +56 9 8804 1572 | [DATO] | sin web |
| La Siciliana Trattoria | Av. del Mar 1300, La Serena | +56 9 8128 5155 | [DATO] | spleatweb.app |
| The Cool Hostel | Av. Los Pescadores 5050, Peñuelas, Coquimbo (misma dirección que Entre Tacos/Bendito Peñuelas: [DATO] confirmar) | +56 9 4846 5248 | [DATO: recepción/check-in] | sin web; Booking/Airbnb como fuentes |
| Bash Burger | Peñuelas Nte. 167, Coquimbo | +56 9 2779 3675 | Lun-Dom 12:00-00:00 (voz; feriados [DATO]) | spleatweb.app y bashburger.cl |
| Bombo Tiki House | Av. Pacífico 3494, Coquimbo | +56 9 7369 6461 | [DATO: el prompt dice "agregar horario oficial"] | spleatweb.app |
| Bombo Tiki Beach | Av. Costanera 5623, Coquimbo (no 5611) | +56 9 4356 9600 | Lun-Dom 12:00-00:00; delivery hasta 23:00 (feriados [DATO]) | spleatweb.app |
| Lemarc Eusebio Lillo | Eusebio Lillo 616, La Serena | +56 9 6156 6310 | [DATO] | sin web |
| Lotus Estilistas | Defensa 1213, San Telmo, Buenos Aires (NO Chacabuco 1025) | +54 9 11 3571 1148 | [DATO] | sin web. Mercado AR: Apple Maps y Bing sí; Yelp casi no se usa en AR, [DATO] decidir |
| Pressures Perfect | [DATO: calle/ZIP o área de servicio], Owens Cross Roads/Huntsville, AL | +1 256 558 8387 | [DATO] | pressuresperfect.com. Yelp YA existe (m.yelp.com/biz/pressures-perfect-owens-cross-roads): reclamar/actualizar, no crear |
| Lullaby Rentals | Sin perfil de Google ni NAP en DATA CLIENTES. Propiedades: Okaloosa Island FL y Fort Walton Beach FL (no son negocios con local público) | [DATO] | n/a | Airbnb. [DATO: Laura decide si Lullaby va a Apple/Bing/Yelp; probablemente no aplica] |

Inactivos que no entran hoy: Lemarc Los Albañiles 1261, Lotus Casa Cultural, Tony's Pasta Milagro (fila inactiva en DATA CLIENTES; Tony's 4 Esquinas cerró).

### Notas por plataforma
- Apple Maps (Business Connect, 11-nov): una ficha por local; ojo con Bombo Burger (5) y los pares Entre Tacos/Bendito (4 fichas, 2 direcciones). Aprovechar fotos y horarios; Apple pide verificar por llamada o mensaje al teléfono del local.
- Bing Places (12-nov): se puede importar desde la ficha de Google, pero conviene cargar manual para respetar el NAP idéntico. Cuidar que no duplique fichas ya existentes.
- Yelp (12-nov): mi opinión, solo vale la pena en Pressures Perfect (USA, ya tiene ficha) y quizás Lullaby; en Chile casi no se usa. Para los locales chilenos priorizar Apple y Bing y decidir con Laura si se crea Yelp. Esto es recomendación, no hay dato de uso de Yelp en Chile en memoria.

---

## Pendientes para Max / Vero (resumen)
1. Pressures Perfect: leer la ficha de Google (dirección o área de servicio, categorías, horario, atributo veteran-owned, servicios ya cargados) y el sitio (lista real de servicios, window cleaning, soft washing, áreas, método de techo).
2. Confirmar si existen páginas de servicio en pressuresperfect.com y qué CMS usa.
3. Bajar de la ficha de Google, local por local: categoría principal, horario y teléfono publicado, para llenar las checklists.
4. Confirmar si Steakhouse (misma dirección que Mare), Hostel y Entre Tacos/Bendito Peñuelas (misma dirección 5050) están bien.
5. Decidir con Laura Yelp para locales chilenos y si Lullaby entra.
