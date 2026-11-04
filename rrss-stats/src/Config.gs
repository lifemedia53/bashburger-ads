/**
 * Life Media | Estadísticas RRSS — configuración central.
 * NINGÚN secreto aquí. Tokens: Propiedades del script (ver docs/SETUP.md).
 */
var LM = {
  TZ: 'America/Santiago',
  GRAPH_BASE: 'https://graph.facebook.com/',
  DEFAULT_API_VERSION: 'v23.0', // se puede cambiar con la propiedad META_API_VERSION
  SPREADSHEET_ID: '10fF2P9B7SjubbRau4x4P8zUpcL3EJ_u_ELZdL17W2-8', // no es secreto
  MAX_RETRIES: 4,
  RETRY_BASE_MS: 1000,
  RETRYABLE_CODES: [1, 2, 4, 17, 32, 341, 613], // errores transitorios de Graph
  SHEETS: {
    DASHBOARD: 'DASHBOARD', RESUMEN: 'RESUMEN', REGISTROS: 'REGISTROS',
    CONTENIDOS: 'CONTENIDOS', CONFIG: 'CONFIG', CONTROL: 'CONTROL',
    DICCIONARIO: 'DICCIONARIO', DISPONIBILIDAD: 'DISPONIBILIDAD', DIFERENCIAS: 'DIFERENCIAS_BSUITE', MANUALES: 'MANUALES', SALDOS: 'SALDOS_SEGUIDORES'
  },
  // Columnas existentes primero (no se reordenan); las nuevas se agregan a la derecha.
  HEADERS: {
    REGISTROS: ['Marca', 'Plataforma', 'Mes', 'Inicio', 'Fin', 'Métrica', 'Valor', 'Fuente', 'Estado',
      'Regla', 'Fila original', 'Observaciones', 'Fecha extracción', 'Clave', 'Estado dato', 'Detalle técnico'],
    CONTROL: ['Marca', 'Plataforma', 'Mes', 'Estado', 'Motivo', 'Origen', 'Revisión', 'Fecha', 'Nivel'],
    CONFIG_EXTRA: ['Cuenta publicitaria (act_)', 'Page ID vinculado', 'Última extracción OK', 'Último error'],
    CONTENIDOS: ['Marca', 'Plataforma', 'Mes', 'Formato', 'Fecha de publicación', 'ID contenido', 'URL', 'Vistas',
      'Alcance', 'Interacciones', 'Guardados', 'Compartidos', 'Comentarios', 'Reacciones', 'Origen', 'Estado',
      'Fecha extracción'],
    SALDOS: ['Marca', 'Plataforma', 'Fecha', 'Seguidores', 'Fuente', 'Fecha extracción'],
    MANUALES: ['Marca', 'Plataforma', 'Mes', 'Métrica', 'Valor', 'Fuente', 'Estado'],
    DISPONIBILIDAD: ['Fecha', 'Marca', 'Plataforma', 'Métrica API', 'Resultado', 'Detalle'],
    DIFERENCIAS: ['Marca', 'Plataforma', 'Mes', 'Métrica', 'Valor API', 'Valor Business Suite', 'Diferencia',
      'Diferencia %', 'Nota', 'Fecha']
  },
  // Estados del PERÍODO (columna "Estado" de REGISTROS). Los bloqueados jamás se sobrescriben.
  LOCKED_STATES: ['HISTÓRICO', 'VALIDADO'],
  PERIOD_STATES: { PARTIAL: 'PARCIAL', EXTRACTED: 'EXTRAÍDO', VALIDATED: 'VALIDADO', HISTORIC: 'HISTÓRICO' },
  // Estados del DATO (columna "Estado dato"): nunca confundir cero con falta de dato.
  DATA: { OK: 'OK', ZERO: 'CERO', NA: 'NO DISPONIBLE', ERROR: 'ERROR', PENDING: 'PENDIENTE' }
};

/**
 * Catálogo de métricas. `verificada:false` = documentada pero no comprobada con datos reales;
 * la función probeMetrics() registra la disponibilidad real en la hoja DISPONIBILIDAD.
 * regla: SUMA | NO_ADITIVO (reconsultar mes completo) | SALDO (cierre) | TEXTO
 * concepto: TOTAL (orgánico+pago según definición Meta) | ADS (solo Marketing API) — nunca se mezclan.
 */
var CATALOG = [
  // ---- Instagram (Graph API /{ig-user-id}/insights, metric_type=total_value) ----
  { key: 'ig_views', plat: 'Instagram', metrica: 'Vistas', api: 'views', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_reach', plat: 'Instagram', metrica: 'Alcance', api: 'reach', regla: 'NO_ADITIVO', concepto: 'TOTAL', verificada: false },
  { key: 'ig_interactions', plat: 'Instagram', metrica: 'Interacciones', api: 'total_interactions', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_engaged', plat: 'Instagram', metrica: 'Cuentas involucradas', api: 'accounts_engaged', regla: 'NO_ADITIVO', concepto: 'TOTAL', verificada: false },
  { key: 'ig_profile_views', plat: 'Instagram', metrica: 'Visitas al perfil', api: 'profile_views', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_link_taps', plat: 'Instagram', metrica: 'Toques en enlaces del perfil (API)', api: 'profile_links_taps', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_new_follows', plat: 'Instagram', metrica: 'Nuevos seguidores', api: 'follows_and_unfollows', breakdown: 'follow_type', pick: 'FOLLOWER', regla: 'SUMA', concepto: 'TOTAL', verificada: false,
    nota: 'Mapeo FOLLOWER=nuevos inferido (557 en días 1-30 vs 572 en Business Suite mes completo); validar.' },
  { key: 'ig_unfollows', plat: 'Instagram', metrica: 'Bajas', api: 'follows_and_unfollows', breakdown: 'follow_type', pick: 'NON_FOLLOWER', regla: 'SUMA', concepto: 'TOTAL', verificada: false,
    nota: 'Mapeo NON_FOLLOWER=bajas inferido por magnitud (agosto: 1024 bajas); validar contra seguidores netos.' },
  // ---- Facebook (Graph API /{page-id}/insights) ----
  { key: 'fb_views', plat: 'Facebook', metrica: 'Vistas', api: 'page_media_view', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_reach', plat: 'Facebook', metrica: 'Alcance', api: 'page_total_media_view_unique', regla: 'NO_ADITIVO', concepto: 'TOTAL', verificada: false },
  { key: 'fb_interactions', plat: 'Facebook', metrica: 'Acciones en publicaciones (API)', api: 'page_post_engagements', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_profile_views', plat: 'Facebook', metrica: 'Visitas al perfil', api: 'page_views_total', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_new_follows', plat: 'Facebook', metrica: 'Nuevos seguidores', api: 'page_daily_follows_unique', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_unfollows', plat: 'Facebook', metrica: 'Bajas', api: 'page_daily_unfollows_unique', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  // ---- Publicidad (Marketing API /act_{id}/insights, SOLO lectura; concepto distinto) ----
  { key: 'ads_impressions', plat: '*', metrica: 'Vistas Ads', api: 'impressions', regla: 'SUMA', concepto: 'ADS', verificada: false },
  { key: 'ads_link_clicks', plat: '*', metrica: 'Clics en enlaces Ads', api: 'inline_link_clicks', regla: 'SUMA', concepto: 'ADS', verificada: false },
  { key: 'ads_reach', plat: '*', metrica: 'Alcance Ads', api: 'reach', regla: 'NO_ADITIVO', concepto: 'ADS', verificada: false }
];

/** Métricas SIN equivalente oficial verificado: se registran como NO DISPONIBLE con su alternativa. */
var LIMITATIONS = [
  { plat: 'Instagram', metrica: 'Vistas orgánicas / Alcance orgánico', motivo: 'El endpoint de insights de cuenta no separa orgánico y pago. Alternativa: Marketing API entrega la parte de anuncios (Vistas Ads / Alcance Ads) como concepto aparte; no se resta para "inventar" el orgánico.' },
  { plat: 'Instagram', metrica: 'Nuevos seguidores / Bajas', motivo: 'La API da el cambio neto diario (follower_count, últimos 30 días) y follows_and_unfollows por tipo; equivalencia con Business Suite sin verificar. Alternativa: saldo diario (snapshot) y cambio neto.' },
  { plat: 'Ambas', metrica: 'Mensajes / Contactos iniciados', motivo: 'Requiere Messaging API (instagram_manage_messages / pages_messaging) y su definición difiere de "contactos iniciados" de Business Suite. Alternativa: contar conversaciones nuevas por /conversations; registrar como PENDIENTE hasta validar.' },
  { plat: 'Instagram', metrica: 'Historias', motivo: 'Los insights de historias solo existen mientras están activas (24 h). La extracción diaria las captura en CONTENIDOS; si un día no corre, ese dato se pierde.' }
];
