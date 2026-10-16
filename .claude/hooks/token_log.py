#!/usr/bin/env python3
"""Stop hook: registra el consumo de tokens de la sesión (incluye subagentes) en agency/logs/session-usage.csv."""
import csv, glob, json, os, sys
from datetime import datetime

# USD por millón de tokens: (entrada, salida). Cache: lectura 0.1x, escritura 1.25x de la entrada.
PRECIOS = {"opus": (4.0, 20.0), "sonnet": (2.0, 10.0), "haiku": (0.10, 0.50), "fable": (4.0, 20.0)}

def precio(modelo):
    for k, v in PRECIOS.items():
        if k in (modelo or ""):
            return v
    return PRECIOS["opus"]

def sumar(path, totales, vistos):
    try:
        with open(path) as f:
            for linea in f:
                if '"usage"' not in linea:
                    continue
                try:
                    ev = json.loads(linea)
                except ValueError:
                    continue
                msg = ev.get("message") or {}
                u = msg.get("usage")
                if not u:
                    continue
                mid = msg.get("id") or ev.get("uuid")
                if mid in vistos:
                    continue
                vistos.add(mid)
                if msg.get("model") == "<synthetic>":
                    continue
                t = totales.setdefault(msg.get("model", "?"), [0, 0, 0, 0])
                t[0] += u.get("input_tokens", 0) or 0
                t[1] += u.get("cache_creation_input_tokens", 0) or 0
                t[2] += u.get("cache_read_input_tokens", 0) or 0
                t[3] += u.get("output_tokens", 0) or 0
    except OSError:
        pass

def main():
    data = json.load(sys.stdin)
    tp, sid = data.get("transcript_path"), data.get("session_id", "?")
    if not tp:
        return
    totales, vistos = {}, set()
    sumar(tp, totales, vistos)
    for sub in glob.glob(os.path.join(os.path.splitext(tp)[0], "subagents", "*.jsonl")):
        sumar(sub, totales, vistos)
    raiz = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    ruta = os.path.join(raiz, "agency", "logs", "session-usage.csv")
    filas = []
    if os.path.exists(ruta):
        with open(ruta) as f:
            filas = [r for r in csv.DictReader(f) if r["session_id"] != sid]
    hoy = datetime.now().strftime("%Y-%m-%d")
    for modelo, (inp, cw, cr, out) in totales.items():
        pi, po = precio(modelo)
        usd = (inp * pi + cw * pi * 1.25 + cr * pi * 0.1 + out * po) / 1e6
        filas.append({"session_id": sid, "fecha": hoy, "modelo": modelo, "entrada": inp,
                      "cache_escritura": cw, "cache_lectura": cr, "salida": out, "usd": round(usd, 4)})
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    campos = ["session_id", "fecha", "modelo", "entrada", "cache_escritura", "cache_lectura", "salida", "usd"]
    with open(ruta, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=campos)
        w.writeheader()
        w.writerows(filas)

def guardar_en_git():
    """Commit + push solo del CSV para que el registro no se pierda al reciclar el contenedor."""
    import subprocess
    raiz = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    rel = "agency/logs/session-usage.csv"
    def git(*a):
        return subprocess.run(["git", "-C", raiz, *a], capture_output=True, text=True)
    if not git("status", "--porcelain", "--", rel).stdout.strip():
        return
    git("commit", "-q", "-m", "Token log automático", "--", rel) if git("add", "--", rel).returncode == 0 else None
    rama = git("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
    if rama and rama != "HEAD":
        git("push", "-q", "origin", rama)

if __name__ == "__main__":
    main()
    guardar_en_git()
