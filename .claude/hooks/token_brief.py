#!/usr/bin/env python3
"""SessionStart hook: inyecta el consumo de los últimos 7 días y las reglas de ahorro."""
import csv, json, os
from datetime import datetime, timedelta

raiz = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
ruta = os.path.join(raiz, "agency", "logs", "session-usage.csv")
desde = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
semana, por_modelo = 0.0, {}
if os.path.exists(ruta):
    with open(ruta) as f:
        for r in csv.DictReader(f):
            if r["fecha"] >= desde:
                usd = float(r["usd"] or 0)
                semana += usd
                por_modelo[r["modelo"]] = por_modelo.get(r["modelo"], 0) + usd
detalle = ", ".join(f"{m}: US${v:.2f}" for m, v in sorted(por_modelo.items(), key=lambda x: -x[1])) or "sin datos"
opus = sum(v for m, v in por_modelo.items() if "opus" in m)
aviso_modelo = (
    f" ALERTA DE MODELO: Opus es {opus / semana:.0%} del gasto de 7 días. Decirle a Laura al inicio que abra la próxima sesión en Sonnet (ver agency/memoria/modelos.json); Opus solo para auditorías o decisiones grandes de dinero."
    if semana and opus / semana > 0.5 else ""
)
texto = (
    f"TOKEN CONTROLLER (automático): consumo últimos 7 días ≈ US${semana:.2f} ({detalle}).{aviso_modelo} "
    "Reglas de ahorro obligatorias: (1) extracciones y tareas mecánicas en Haiku; (2) lotes de máx. 2 clientes, con muestra aprobada antes del resto; "
    "(3) sesiones cortas: si la conversación es muy larga, sugerir a Laura abrir una nueva (cada turno relee todo el historial); "
    "(4) no releer archivos ya leídos ni traer cuentas completas; (5) avisar a Laura si una tarea grande puede gastar >US$1 antes de lanzarla."
)
print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": texto},
                  "systemMessage": f"Consumo de la semana ≈ US${semana:.2f}"}))
