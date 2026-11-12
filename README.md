# Bewertungs-Melde-Assistent (MCP-Server)

Remote-MCP-Server für lokale Betriebe: Lohnt es sich, eine Google-Rezension bei Google zu melden? Und wie antworte ich neutral, ohne Schuldeingeständnis und ohne Gegenvorwurf? Grundlage ist ausschließlich die offizielle Google-Hilfe (Stand 12.11.2026).

**Keine Rechtsberatung, keine Garantie, dass Google etwas entfernt.** Kein Google-API, kein LLM, keine Abrufe, nichts wird gespeichert oder gepostet.

- Registry-Name (vorbereitet, nicht eingereicht): `de.ki-automatisieren/bewertung-melde-assistent`
- Website: https://www.ki-automatisieren.de
- Entwickler: KI-Automatisieren (Safak Tepecik)
- Lizenz: MIT
- Transport: Streamable HTTP, JSON-RPC 2.0 auf `POST /mcp`; `GET /health`; Protokollversionen 2025-03-26, 2025-06-18, 2025-11-25

## Status

**Öffentliche Preview (kostenlos, Netlify Function, gleicher Code):** `https://bewertung-melde-assistent-mcp.netlify.app/mcp` – am 12.11.2026 per curl geprüft (health, initialize, tools/list, tools/call positiv und negativ). Manueller Deploy, nicht mit GitHub verknüpft.

Version 0.1.0, gebaut und getestet am 12.11.2026, lokal mit `wrangler dev` geprüft. **Noch kein Production-Deploy**; die URL in `server.json` (`https://bewertung-mcp.ki-automatisieren.de/mcp`) ist nur ein Vorschlag.

## Tools

| Tool | Zweck |
|---|---|
| `check_bewertung_meldung` | Eingabe `merkmale` (Liste): `kein_kundenkontakt`, `mitbewerber_oder_interessenkonflikt`, `anreiz_oder_gekauft`, `spam_werbung_links`, `beleidigung_vulgaer`, `hassrede`, `drohung_belaestigung`, `persoenliche_daten`, `unbelegte_straftat_vorwuerfe`, `off_topic`, `falschdarstellung`, `erpressung`, `sachlich_negativ`. Ausgabe: `einschaetzung` (`meldung_kann_sinn_haben` / `meldung_eher_nicht_sinnvoll` / `erpressung_sonderweg`), Google-Richtlinienkategorie je Merkmal, Meldeschritte (inkl. Tool zum Verwalten von Bewertungen und einmaligem Einspruch), was man nicht tun sollte, Quellen, Stand. |
| `get_antwort_vorlage` | Eingabe `situation` (`positiv`, `negativ_ungeklaert`, `negativ_unzufrieden`, `kein_kunde_gefunden`, `unsachlich_beleidigend`, `erpressung_verdacht`), optional `betrieb_name`, `unterzeichner`. Ausgabe: feste deutsche Vorlage(n), Empfehlung, Antwort-Tipps nach Google, Quellen. |

## Quellen (live geprüft am 12.11.2026)

- Unangemessene Rezensionen melden: https://support.google.com/business/answer/4596773?hl=de
- Verbotene und eingeschränkt zulässige Inhalte (Maps): https://support.google.com/contributionpolicy/answer/7400114?hl=de
- Tool zum Verwalten von Bewertungen: https://support.google.com/business/workflow/9945796?hl=de
- Kundenrezensionen verwalten: https://support.google.com/business/answer/3474050?hl=de
- Tipps für Rezensionen und Antworten: https://support.google.com/business/answer/3474122?hl=de
- Erpressungsversuche melden: https://support.google.com/business/answer/16404809?hl=de
- Formular Erpressung: https://support.google.com/business/contact/merchant_extortion?hl=de

## Datenschutz

Keine Abrufe, keine Speicherung. Geloggt werden nur Tool-Name, Erfolg und Dauer. Rate-Limit best-effort 120 Anfragen/Minute/IP, IPs werden nicht geloggt.

## Entwicklung

```bash
npm install && npm run typecheck && npm test && npm run secret-scan
npm run dev     # 127.0.0.1:8795
npm run smoke
```
