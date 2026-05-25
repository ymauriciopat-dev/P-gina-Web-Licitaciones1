#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extractor_secop.py — Extractor de oportunidades de obra civil desde SECOP II
============================================================================
Consulta el dataset oficial de datos.gov.co (API Socrata) y guarda en un JSON
los procesos VIGENTES de obra civil con presentación de ofertas abierta.

Este es el componente que se ejecuta por LÍNEA DE COMANDOS (cmd / terminal).
Su salida (opportunities.json) es la que alimenta la pestaña "Oportunidades"
de la página web cuando se quiere un pipeline de backend (en lugar de la
consulta en vivo que ya hace el navegador).

USO BÁSICO (cmd):
    python extractor_secop.py
    python extractor_secop.py --app-token TU_TOKEN --limit 200 --out opportunities.json

Requisitos:
    pip install requests
"""

import argparse
import datetime as dt
import json
import sys

try:
    import requests
except ImportError:
    print("Falta la librería 'requests'. Instálala con:  pip install requests")
    sys.exit(1)

# Dataset oficial verificado: SECOP II - Procesos de Contratación
DATASET = "p6dx-8zbt"
BASE = f"https://www.datos.gov.co/resource/{DATASET}.json"

# Campos reales del dataset (verificados)
SELECT = ",".join([
    "id_del_proceso", "referencia_del_proceso", "entidad", "nit_entidad",
    "departamento_entidad", "ciudad_entidad",
    "nombre_del_procedimiento", "descripci_n_del_procedimiento",
    "modalidad_de_contratacion", "tipo_de_contrato",
    "codigo_principal_de_categoria",
    "precio_base", "duracion", "unidad_de_duracion",
    "fecha_de_publicacion_del_proceso", "fecha_de_recepcion_de_respuestas",
    "conteo_de_respuestas_a_ofertas", "urlproceso",
    "estado_del_procedimiento", "estado_de_apertura_del_proceso", "fase",
])

# Prefijos UNSPSC de obra civil (clase). 72 = construcción/edificación,
# 81101500 = ingeniería civil, 95121 = edificios y estructuras, 83101500 = acueducto.
UNSPSC_PREFIXES = ["V1.72", "V1.81101500", "V1.95121", "V1.83101500", "V1.30"]


def build_where():
    """Construye el filtro SoQL para procesos de obra con ofertas abiertas."""
    ahora = dt.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    unspsc = " OR ".join(
        f"starts_with(codigo_principal_de_categoria,'{p}')" for p in UNSPSC_PREFIXES
    )
    return (
        "fase='Presentación de oferta' "
        "AND estado_de_apertura_del_proceso='Abierto' "
        f"AND fecha_de_recepcion_de_respuestas > '{ahora}' "
        "AND tipo_de_contrato in('Obra','Consultoría') "
        f"AND ({unspsc})"
    )


def fetch(app_token=None, limit=200, page_size=1000):
    """Pagina el dataset y devuelve la lista de procesos."""
    headers = {"X-App-Token": app_token} if app_token else {}
    where = build_where()
    rows, offset = [], 0
    while len(rows) < limit:
        batch = min(page_size, limit - len(rows))
        params = {
            "$select": SELECT,
            "$where": where,
            "$order": "fecha_de_recepcion_de_respuestas ASC",
            "$limit": batch,
            "$offset": offset,
        }
        r = requests.get(BASE, params=params, headers=headers, timeout=30)
        r.raise_for_status()
        data = r.json()
        if not data:
            break
        rows.extend(data)
        offset += batch
        if len(data) < batch:
            break
    return rows


def normalizar(rows):
    """Calcula días para cierre y deja una estructura limpia para la web."""
    hoy = dt.date.today()
    out = []
    for r in rows:
        cierre = (r.get("fecha_de_recepcion_de_respuestas") or "")[:10]
        dias = None
        if cierre:
            try:
                dias = (dt.date.fromisoformat(cierre) - hoy).days
            except ValueError:
                dias = None
        out.append({
            "id": r.get("id_del_proceso"),
            "referencia": r.get("referencia_del_proceso"),
            "entidad": r.get("entidad"),
            "departamento": r.get("departamento_entidad"),
            "ciudad": r.get("ciudad_entidad"),
            "objeto": r.get("nombre_del_procedimiento"),
            "modalidad": r.get("modalidad_de_contratacion"),
            "tipo": r.get("tipo_de_contrato"),
            "unspsc": r.get("codigo_principal_de_categoria"),
            "valor_cop": float(r.get("precio_base") or 0),
            "cierre": r.get("fecha_de_recepcion_de_respuestas"),
            "dias_para_cierre": dias,
            "respuestas": r.get("conteo_de_respuestas_a_ofertas"),
            "url": r.get("urlproceso"),
            # Campos que NO vienen en el dataset y se llenan en el análisis del pliego:
            "anticipo_pct": None,
            "num_oferentes": None,
            "municipio_ejecucion": None,
        })
    return out


def main():
    ap = argparse.ArgumentParser(description="Extractor SECOP II - obra civil vigente")
    ap.add_argument("--app-token", default=None, help="App Token de Socrata (recomendado)")
    ap.add_argument("--limit", type=int, default=200, help="Máximo de procesos a traer")
    ap.add_argument("--out", default="opportunities.json", help="Archivo JSON de salida")
    args = ap.parse_args()

    print(f"Consultando SECOP II (dataset {DATASET})…")
    try:
        rows = fetch(app_token=args.app_token, limit=args.limit)
    except requests.HTTPError as e:
        print(f"Error HTTP: {e}. Verifica el filtro o usa un --app-token.")
        sys.exit(1)
    except requests.RequestException as e:
        print(f"Error de red: {e}")
        sys.exit(1)

    limpio = normalizar(rows)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(limpio, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(limpio)} procesos vigentes de obra civil guardados en {args.out}")
    if limpio:
        p = limpio[0]
        print(f"  Ejemplo: {p['entidad']} — {p['objeto']} — ${p['valor_cop']:,.0f} — cierra en {p['dias_para_cierre']} días")


if __name__ == "__main__":
    main()
