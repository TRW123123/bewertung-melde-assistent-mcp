# Changelog

## 0.1.0 – 2026-11-12
- Erste Version: Tools `check_bewertung_meldung` und `get_antwort_vorlage`.
- Inhalte live geprüft am 12.11.2026 in der offiziellen Google-Hilfe: Rezensionen melden (4596773), Richtlinien für Maps-Nutzerbeiträge (7400114), Kundenrezensionen verwalten (3474050), Tipps zu Antworten (3474122), Erpressungsversuche melden (16404809) samt Formular.
- Statische Regeln und Vorlagen: kein Google-API, kein LLM, keine Abrufe, nichts gespeichert. Grußzeile lehnt Links, E-Mail-Adressen und Telefonnummern ab.
- Streamable-HTTP-JSON-RPC nach dem Muster von impressum-check/passbild-regel-check; Vitest, Typecheck, Secret-Scan, lokaler Wrangler-Smoke.
