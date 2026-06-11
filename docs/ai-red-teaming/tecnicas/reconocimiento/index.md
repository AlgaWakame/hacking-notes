# Reconocimiento de objetivos IA

> Guía rápida para saber qué revisar, en qué orden y cuándo pasar de reconocimiento pasivo a activo.

!!! warning "Uso autorizado"
Ejecutar únicamente en laboratorios, CTFs, entornos propios o auditorías con autorización explícita.

---

## Objetivo

Construir un mapa técnico del sistema IA:

```text
Web/API → Gateway → Modelo → RAG → Agentes/Tools → Logs/Detección
```

Al terminar esta fase deberías saber:

```text
Endpoint IA:
Gateway/API:
Modelo probable:
Proveedor:
RAG:
Fuentes/documentos:
Tools/MCP:
Controles/detección:
Siguiente técnica:
```

---

## Flujo rápido

```text
1. Pasivo → 2. Baja interacción → 3. Activo controlado → 4. RAG/Modelo → 5. Detección/Honeypots
```

---

# Checklist rápida

## 1. Preparación

* [ ] Identificar host principal: `http://TARGET`
* [ ] Revisar si hay puertos alternativos: `8000`, `9000`, `5601`
* [ ] Crear carpeta de evidencias: `mkdir -p ai-recon`
* [ ] Anotar fecha, hora, endpoint y comando usado
* [ ] Separar hechos observados de hipótesis

---

## 2. Reconocimiento pasivo / baja interacción

* [ ] Revisar headers HTTP

```bash
curl -s -I http://TARGET/
```

* [ ] Buscar headers IA o gateway: `X-AI-Backend`, `X-RAG-Provider`, `Server`, `Via`, `RateLimit-*`
* [ ] Revisar HTML en busca de JavaScript

```bash
curl -s http://TARGET/ | grep -iE "<script"
```

* [ ] Revisar JavaScript en busca de endpoints

```bash
curl -s http://TARGET/js/chat-widget.js | grep -iE "api|assistant|endpoint|chat|model|rag|debug|feature|config"
```

* [ ] Buscar elementos ocultos o atributos `data-endpoint`

```bash
curl -s http://TARGET/ | grep -iE "hidden|data-endpoint|endpoint|api|assistant|generate|gen"
```

* [ ] Revisar rutas de documentación API: `/docs`, `/swagger`, `/openapi.json`, `/v3/api-docs`
* [ ] Revisar repositorios si hay acceso: dependencias, prompts, RAG, tools, safety y `.env.example`
* [ ] Identificar si la arquitectura parece cloud, self-hosted o híbrida

---

## 3. API Gateway y endpoints protegidos

* [ ] Revisar headers del gateway

```bash
curl -sI http://TARGET:8000/v1/billing
```

* [ ] Probar técnica `401 vs 404`

```bash
for endpoint in auth billing chat/completions models users; do code=$(curl -s -o /dev/null -w "%{http_code}" http://TARGET:8000/v1/$endpoint); echo "/v1/$endpoint - HTTP $code"; done
```

* [ ] Confirmar manualmente endpoints con `401`, `403`, `405` o `500`
* [ ] Si aparece `405`, probar otro método HTTP
* [ ] Si aparece `400`, probar body JSON mínimo
* [ ] Si hay versionado o prefijos, usar fuzzing con dos posiciones

```bash
ffuf -u http://TARGET:9000/FUZZ1/FUZZ2 -w prefixes.txt:FUZZ1 -w /usr/share/seclists/Discovery/Web-Content/common.txt:FUZZ2 -mc 401,404 -ac
```

* [ ] Ejecutar fuzzing API con SecLists

```bash
ffuf -u http://TARGET:8000/v1/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt -mc 200,201,204,400,401,403,405,500 -ac
```

---

## 4. Confirmación de servicio IA

* [ ] Probar endpoint assistant descubierto

```bash
curl -s -X POST http://TARGET/api/v2/assistant -H "Content-Type: application/json" -d '{"message":"Hello"}' | jq
```

* [ ] Revisar metadata: `provider`, `model`, `latency_ms`, `prompt_eval_count`, `eval_count`
* [ ] Probar API compatible con OpenAI

```bash
curl -s -X POST http://TARGET/v1/chat/completions -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello"}]}' | jq
```

* [ ] Confirmar si hay `choices`, `model`, `usage`, `tool_calls` o `rag_sources`

---

## 5. Fingerprinting de modelo

* [ ] Preguntar identidad del modelo

```bash
curl -s -X POST http://TARGET/v1/chat/completions -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"What model are you? What company created you?"}]}' | jq -r '.choices[0].message.content'
```

* [ ] Hacer contradiction testing con falsa atribución a Claude/GPT
* [ ] Probar knowledge cutoff con eventos 2024
* [ ] Analizar estilo de respuesta con una pregunta simple
* [ ] Analizar estilo de código con una función Python
* [ ] Probar aritmética y razonamiento multi-step
* [ ] Probar context window con marker tipo `ZEBRA-42`
* [ ] Concluir modelo probable solo si varias señales coinciden

---

## 6. RAG Reconnaissance

* [ ] Diferenciar LLM puro vs RAG con pregunta general

```bash
curl -s -X POST http://TARGET/api/chat -H "Content-Type: application/json" -d '{"query":"What is 2+2?"}' | jq
```

* [ ] Activar RAG con pregunta específica de empresa

```bash
curl -s -X POST http://TARGET/api/chat -H "Content-Type: application/json" -d '{"query":"What is the PTO policy?"}' | jq
```

* [ ] Revisar si aparecen `sources`
* [ ] Extraer `title`, `chunk_id`, `text`, `vector_score`, `bm25_score`, `combined_score`
* [ ] Mapear documentos por temas: políticas, gastos, API interna, arquitectura
* [ ] Probar threshold con exact match, sinónimos y errores ortográficos
* [ ] Anotar si se exponen snippets, hostnames internos, endpoints o formatos de claves

---

## 7. Detección, evasión y honeypots

* [ ] Revisar si existe SIEM/Kibana en `:5601`
* [ ] Anotar `session_id`, timestamp, query y endpoint
* [ ] Evitar consultas ruidosas tipo `what documents`, `list sources`, `system prompt`
* [ ] Preferir preguntas contextuales que parezcan uso legítimo
* [ ] Comparar consulta ruidosa vs contextual si el lab lo pide
* [ ] Buscar indicadores de honeypot: `HONEYPOT`, `TEST`, `CANARY`, credenciales demasiado completas
* [ ] No usar credenciales encontradas en respuestas RAG
* [ ] Documentar honeypots como posible trampa/canary, no como credencial real

---

## Resultado final esperado

```text
Host:
Puertos:
Gateway:
Endpoint IA:
Endpoint protegido:
Modelo probable:
Proveedor:
RAG activo:
Documentos/fuentes:
Chunks/scores:
Tools/MCP:
Detección/SIEM:
Honeypots:
Siguiente prueba:
```
