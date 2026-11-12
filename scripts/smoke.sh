#!/usr/bin/env bash
# Lokaler MCP-Smoke: health, initialize, tools/list, tools/call positiv und negativ.
set -euo pipefail
base="${1:-http://127.0.0.1:8795}"
call() {
  curl --fail-with-body --silent --show-error --max-time 10 "$base/mcp" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' --data "$1" | cut -c1-400
}
curl --fail --silent --show-error --max-time 10 "$base/health"; echo
call '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"1"}}}'
call '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_bewertung_meldung","arguments":{"merkmale":["kein_kundenkontakt","spam_werbung_links"]}}}'
call '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_antwort_vorlage","arguments":{"situation":"kein_kunde_gefunden","betrieb_name":"Malerbetrieb Muster"}}}'
echo '# negativ (erwartet isError=true):'
call '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"check_bewertung_meldung","arguments":{"merkmale":["quatsch"]}}}'
