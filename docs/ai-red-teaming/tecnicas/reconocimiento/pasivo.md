# Reconocimiento pasivo / baja interacción

> Objetivo: extraer información de infraestructura, endpoints, documentación y configuración sin interactuar directamente con el modelo.

!!! note "Nota"
    En pruebas reales, algunas acciones como `curl -I` o consultar `/api/health` pueden generar logs. Se consideran de baja interacción porque no manipulan el comportamiento del modelo ni ejecutan prompts.

---

## Objetivo

Identificar:

- servidor web/proxy;
- headers personalizados IA;
- health/status endpoints;
- documentación API;
- rutas OpenAPI/Swagger;
- endpoints candidatos;
- repositorios/configuración;
- señales de RAG, MCP o modelo;
- IDs de correlación para SIEM.

---

## Objetivo de ejemplo

```text
http://192.168.50.21
```

Los comandos están listos para copiar y pegar. Cambia la IP/URL por la del laboratorio.

---

# 1. Headers HTTP

## Solo cabeceras

```bash
curl -s -I http://192.168.50.21/
```

## Guardar cabeceras

```bash
mkdir -p ai-recon/headers && curl -s -I http://192.168.50.21/ | tee ai-recon/headers/root-headers.txt
```

## Response completo

```bash
mkdir -p ai-recon/headers && curl -s -i http://192.168.50.21/ | tee ai-recon/headers/root-response.txt
```

## Headers interesantes

```text
Server
X-Powered-By
X-AI-Backend
X-RAG-Provider
X-Model
X-LLM-Provider
X-Inference-Server
X-Vector-DB
X-Orchestrator
X-Request-ID
X-Trace-ID
X-Correlation-ID
Via
X-Cache
```

## Interpretación

| Header | Qué indica | Siguiente paso |
|---|---|---|
| `X-AI-Backend` | Proveedor/modelo filtrado | Confirmar con endpoint activo |
| `X-RAG-Provider` | Vector DB/RAG | Buscar rutas RAG |
| `X-Powered-By` | App/framework/versión | Buscar repo/config |
| `X-Request-ID` | Correlación | Revisar SIEM/logs |
| `Server` | Proxy/web server | Revisar rutas estándar |

---

# 2. Health / status endpoints

## Endpoint principal

```bash
curl -s http://192.168.50.21/api/health | jq
```

## Guardar evidencia

```bash
mkdir -p ai-recon/endpoints && curl -s http://192.168.50.21/api/health | jq | tee ai-recon/endpoints/api-health.json
```

## Probar rutas comunes

```bash
mkdir -p ai-recon/endpoints && for path in /api/health /api/status /-/health /health /status /ready /live /metrics /debug /api/debug /api/info /info /version /api/version; do echo "== $path =="; curl -sk -o /dev/null -w "%{http_code} %{content_type} %{size_download} http://192.168.50.21$path\n" "http://192.168.50.21$path"; done | tee ai-recon/endpoints/health-status-results.txt
```

## Guardar respuestas interesantes

```bash
mkdir -p ai-recon/endpoints/responses && for path in /api/health /api/status /-/health /health /status /ready /live /metrics /debug /api/debug /api/info /info /version /api/version; do code=$(curl -sk -o /dev/null -w "%{http_code}" "http://192.168.50.21$path"); if [ "$code" = "200" ] || [ "$code" = "401" ] || [ "$code" = "403" ] || [ "$code" = "500" ]; then safe_name=$(echo "$path" | sed 's#/#_#g'); curl -sk "http://192.168.50.21$path" | tee "ai-recon/endpoints/responses/${safe_name}.txt"; fi; done
```

## Campos interesantes

```text
model
model_name
model_id
provider
rag_enabled
rag_provider
mcp_enabled
tools_enabled
service
version
environment
debug
vector_db
embedding_model
inference_server
orchestrator
```

## Interpretación

| Campo | Siguiente paso |
|---|---|
| `model` | Confirmar modelo con `/v1/models` o chat completions |
| `rag_enabled: true` | Buscar fuentes, documentos y chunks |
| `mcp_enabled: true` | Enumerar herramientas |
| `debug: true` | Revisar errores y endpoints internos |
| `service` | Mapear componente |
| `version` | Buscar repositorio/config |

---

# 3. Documentación API

## Probar rutas comunes

```bash
mkdir -p ai-recon/docs && for path in /api /api/docs /docs /swagger /swagger/ /swagger/index.html /swagger-ui /swagger-ui.html /swagger-ui/index.html /openapi.json /openapi.yaml /api/openapi.json /api/openapi.yaml /v3/api-docs /redoc /redocly; do echo "== $path =="; curl -sk -o /dev/null -w "%{http_code} %{content_type} %{size_download} http://192.168.50.21$path\n" "http://192.168.50.21$path"; done | tee ai-recon/docs/api-docs-results.txt
```

## Descargar OpenAPI

```bash
mkdir -p ai-recon/docs && curl -sk http://192.168.50.21/openapi.json -o ai-recon/docs/openapi.json
```

## Descargar Swagger

```bash
mkdir -p ai-recon/docs && curl -sk http://192.168.50.21/swagger.json -o ai-recon/docs/swagger.json
```

## Extraer rutas

```bash
jq '.paths | keys[]' ai-recon/docs/openapi.json 2>/dev/null | tee ai-recon/docs/openapi-paths.txt
```

## Buscar rutas IA

```bash
jq '.paths | keys[]' ai-recon/docs/openapi.json 2>/dev/null | grep -Ei "chat|model|completion|embedding|rag|document|source|tool|agent|mcp|vector|search" | tee ai-recon/docs/openapi-ai-paths.txt
```

---

# 4. Wordlists útiles

## Wordlist IA local

```bash
mkdir -p ai-recon/wordlists && printf "%s\n" api api/health api/status health status ready live metrics debug info version v1 v1/models v1/chat/completions v1/completions v1/embeddings v1/moderations v1/responses models model chat chat/completions completions embeddings rag api/rag rag/search rag/query rag/sources rag/documents documents sources knowledge knowledge-base kb api/kb vector vectors vector/search retrieval retrieve search mcp api/mcp mcp/tools mcp/list_tools mcp/schema tools api/tools agents api/agents agent a2a api/a2a .well-known/ai-plugin.json .well-known/mcp .well-known/agent.json .well-known/a2a.json swagger swagger/index.html swagger-ui swagger-ui.html openapi.json openapi.yaml v3/api-docs docs redoc > ai-recon/wordlists/ai-endpoints.txt
```

## SecLists recomendadas

```text
/usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt
/usr/share/seclists/Discovery/Web-Content/api/api-endpoints-res.txt
/usr/share/seclists/Discovery/Web-Content/api/api-seen-in-wild.txt
/usr/share/seclists/Discovery/Web-Content/api/actions.txt
/usr/share/seclists/Discovery/Web-Content/api/objects.txt
/usr/share/seclists/Discovery/Web-Content/common.txt
/usr/share/seclists/Discovery/Web-Content/raft-small-words.txt
/usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt
/usr/share/seclists/Discovery/Web-Content/graphql.txt
/usr/share/seclists/Discovery/Web-Content/mcp-server.txt
```

---

# 5. Fuzzing controlado

## Fuzzing con wordlist IA propia

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/FUZZ -w ai-recon/wordlists/ai-endpoints.txt -mc 200,201,204,301,302,307,308,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-ai-endpoints.json
```

## Fuzzing sobre `/api/FUZZ`

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/api/FUZZ -w ai-recon/wordlists/ai-endpoints.txt -mc 200,201,204,301,302,307,308,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-api-ai-endpoints.json
```

## Fuzzing con extensiones

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/FUZZ -w ai-recon/wordlists/ai-endpoints.txt -e .json,.yaml,.yml -mc 200,201,204,301,302,307,308,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-ai-endpoints-ext.json
```

## SecLists API endpoints

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt -mc 200,201,204,301,302,307,308,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-seclists-api-endpoints.json
```

## SecLists API endpoints combinada

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints-res.txt -mc 200,201,204,301,302,307,308,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-seclists-api-endpoints-res.json
```

## API seen in wild

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/api-seen-in-wild.txt -mc 200,201,204,301,302,307,308,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-seclists-api-seen-in-wild.json
```

## Actions sobre recurso conocido

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/api/user/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/actions.txt -mc 200,201,204,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-api-user-actions.json
```

## Objects API

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/api/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/objects.txt -mc 200,201,204,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-api-objects.json
```

## MCP wordlist

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/FUZZ -w /usr/share/seclists/Discovery/Web-Content/mcp-server.txt -mc 200,201,204,301,302,307,308,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-mcp-server.json
```

## GraphQL wordlist

```bash
mkdir -p ai-recon/fuzzing && ffuf -u http://192.168.50.21/FUZZ -w /usr/share/seclists/Discovery/Web-Content/graphql.txt -mc 200,201,204,301,302,400,401,403,405,500 -o ai-recon/fuzzing/ffuf-graphql.json
```

## Revisar resultados ffuf con jq

```bash
jq '.results[] | {status, length, url}' ai-recon/fuzzing/ffuf-ai-endpoints.json
```

## Filtrar resultados interesantes

```bash
jq '.results[] | select(.status==200 or .status==401 or .status==403 or .status==405 or .status==500) | {status, length, url}' ai-recon/fuzzing/ffuf-ai-endpoints.json
```

---

# 6. Repositorios y configuración

## Patrones importantes

```text
OPENAI_API_KEY
ANTHROPIC_API_KEY
GOOGLE_API_KEY
AZURE_OPENAI
LANGCHAIN
LANGGRAPH
CREWAI
AUTOGEN
OLLAMA
VLLM
TGI
CHROMA
PINECONE
WEAVIATE
QDRANT
FAISS
MILVUS
EMBEDDING_MODEL
VECTOR_DB
MCP
MODEL_CONTEXT_PROTOCOL
A2A
PROMPT_TEMPLATE
SYSTEM_PROMPT
```

## Grep local de stack IA

```bash
grep -RniE "openai|anthropic|azure_openai|langchain|langgraph|crewai|autogen|ollama|vllm|tgi|chroma|pinecone|weaviate|qdrant|faiss|milvus|embedding|vector|mcp|system_prompt|prompt_template" . | tee ai-recon/repos/ai-code-grep.txt
```

## Grep de secretos

```bash
grep -RniE "api[_-]?key|secret|token|password|bearer|sk-[a-zA-Z0-9]|OPENAI_API_KEY|ANTHROPIC_API_KEY" . | tee ai-recon/repos/secrets-grep.txt
```

---

## Evidencia mínima

```text
URL:
Headers:
Health/status:
Docs API:
Endpoints encontrados:
Wordlist usada:
Fuzzing output:
Repos/config:
IDs de correlación:
Siguientes hipótesis:
```
---

# 7. Minería de repositorios de código

> Objetivo: extraer información de arquitectura IA desde código fuente, dependencias, configuración, prompts, herramientas, RAG, guardrails y despliegue.

## Cuándo usar

- Hay acceso a GitLab, GitHub, Gitea, repositorios internos o código fuente.
- El objetivo es una evaluación de caja gris.
- Hay sospecha de aplicaciones con LLM, RAG, agentes o herramientas.
- Se quiere diferenciar arquitectura cloud vs self-hosted.
- Se quieren identificar prompts, tools, modelos, embeddings y vector DB.

---

## Clonar repositorios de ejemplo

```bash
git clone http://192.168.50.22/aurora/support-assistant.git
```

```bash
git clone http://192.168.50.22/phoenix/code-reviewer.git
```

Crear carpeta de evidencias:

```bash
mkdir -p ai-recon/repos
```

---

## 7.1 Dependencias y stack IA

### Revisar `requirements.txt`

```bash
cat support-assistant/requirements.txt
```

```bash
cat code-reviewer/requirements.txt
```

### Guardar evidencias

```bash
cat support-assistant/requirements.txt | tee ai-recon/repos/aurora-requirements.txt
```

```bash
cat code-reviewer/requirements.txt | tee ai-recon/repos/phoenix-requirements.txt
```

### Buscar dependencias IA en todo el código

```bash
grep -RniE "openai|anthropic|google-generativeai|gemini|azure-openai|langchain|langgraph|crewai|autogen|pyautogen|ollama|vllm|tgi|text-generation-inference|transformers|huggingface|sentence-transformers|chroma|pinecone|weaviate|qdrant|faiss|milvus|pymilvus|embedding|reranker|tree-sitter|mcp|a2a" . | tee ai-recon/repos/ai-dependencies-grep.txt
```

### Dependencias a reconocer

| Indicador | Qué revela |
|---|---|
| `google-generativeai` | Uso de Gemini API |
| `openai` | Uso de OpenAI o API compatible |
| `anthropic` | Uso de Claude API |
| `crewai` | Framework de agentes CrewAI |
| `pyautogen` / `autogen` | Framework de agentes AutoGen |
| `langchain` | Orquestación, chains, tools, RAG |
| `langgraph` | Orquestación tipo grafo/agentes |
| `vllm` | Inferencia self-hosted |
| `text-generation-inference` / `tgi` | Servidor HuggingFace TGI |
| `ollama` | Inferencia local/Ollama |
| `pinecone-client` | Vector DB gestionada |
| `pymilvus` | Vector DB Milvus self-hosted |
| `chromadb` | ChromaDB local o gestionado |
| `qdrant-client` | Qdrant vector DB |
| `sentence-transformers` | Embeddings self-hosted |
| `tree-sitter` | Análisis AST/código |
| `autoawq` | Cuantización AWQ |

---

## 7.2 Cloud vs self-hosted

### Señales de arquitectura cloud

```text
google-generativeai
openai
anthropic
azure-openai
pinecone-client
GOOGLE_API_KEY
OPENAI_API_KEY
ANTHROPIC_API_KEY
PINECONE_API_KEY
```

### Señales de arquitectura self-hosted

```text
vllm
ollama
text-generation-inference
transformers
huggingface-hub
pymilvus
chromadb
qdrant-client
sentence-transformers
CUDA
GPU
tensor_parallel_size
gpu_memory_utilization
```

### Interpretación rápida

| Arquitectura | Superficie de ataque |
|---|---|
| Cloud-based | API keys, proveedores externos, secretos, egress, dependencia de terceros |
| Self-hosted | Servicios internos, puertos expuestos, auth local, GPU, vector DB, hardening |
| Híbrida | Riesgos combinados: secretos cloud + servicios internos |

---

## 7.3 Configuración RAG

### Buscar ficheros RAG

```bash
find . -type f | grep -Ei "rag|retriev|vector|embedding|chunk|rerank|milvus|pinecone|chroma|qdrant|faiss"
```

### Leer configuraciones comunes

```bash
cat support-assistant/config/rag.yaml
```

```bash
cat code-reviewer/config/rag.yaml
```

### Guardar evidencias

```bash
cat support-assistant/config/rag.yaml | tee ai-recon/repos/aurora-rag.yaml
```

```bash
cat code-reviewer/config/rag.yaml | tee ai-recon/repos/phoenix-rag.yaml
```

### Buscar parámetros RAG

```bash
grep -RniE "chunk_size|chunk_overlap|top_k|score_threshold|distance_metric|rerank|reranker|embedding|embeddings|vector_store|namespace|collection_name|index_name|nprobe|nlist|dimensions|batch_size" . | tee ai-recon/repos/rag-parameters.txt
```

### Qué extraer

| Parámetro | Qué indica |
|---|---|
| `chunking.strategy` | Texto, AST-aware, markdown, semantic |
| `chunk_size` | Tamaño de fragmento |
| `chunk_overlap` | Solapamiento entre chunks |
| `embeddings.provider` | Proveedor de embeddings |
| `embeddings.model` | Modelo de embeddings |
| `dimensions` | Dimensión vectorial |
| `retrieval.top_k` | Número de resultados recuperados |
| `score_threshold` | Umbral mínimo de similitud |
| `distance_metric` | Cosine, IP, L2 |
| `reranker.enabled` | Reordenación de resultados |
| `vector_store.provider` | Pinecone, Milvus, Chroma, Qdrant |
| `namespace` | Separación lógica por tenant/uso |
| `collection_name` | Colección en vector DB |

### Interpretación rápida

| Hallazgo | Hipótesis |
|---|---|
| `namespace: customer-docs` | Revisar aislamiento por namespace |
| `top_k: 10` | Puede recuperar bastante contexto |
| `score_threshold` bajo | Riesgo de recuperación amplia |
| `chunk_size` grande | Más contexto sensible por chunk |
| `ast_aware` | RAG orientado a código |
| `reranker.enabled: true` | Pipeline RAG más complejo |
| `Milvus` self-hosted | Revisar exposición/autenticación de Milvus |
| `Pinecone` cloud | Revisar API keys y namespaces |

---

## 7.4 Definiciones de herramientas y agentes

### Buscar tools y schemas

```bash
find . -type f | grep -Ei "tool|tools|function|functions|schema|schemas|agent|agents"
```

### Buscar patrones de herramientas

```bash
grep -RniE "@tool|def .*tool|functions|function_schemas|tools|inputSchema|parameters|description|permissions|read-only|create only|readonly|dangerous|execute|run_|post_|delete_|update_" . | tee ai-recon/repos/tools-and-functions.txt
```

### Ejemplos a revisar

```bash
cat support-assistant/src/agents/tools.py
```

```bash
cat code-reviewer/prompts/function_schemas.json
```

### Guardar evidencias

```bash
cat support-assistant/src/agents/tools.py | tee ai-recon/repos/aurora-tools.py
```

```bash
cat code-reviewer/prompts/function_schemas.json | tee ai-recon/repos/phoenix-function-schemas.json
```

### Qué extraer

| Elemento | Qué indica |
|---|---|
| Nombre de herramienta | Acción disponible |
| Descripción | Propósito y límites |
| Parámetros | Inputs controlables |
| Tipo de retorno | Datos que puede devolver |
| Permisos | Read-only, create-only, admin, etc. |
| Framework | CrewAI, AutoGen, LangChain, MCP |
| Acciones sensibles | Email, ticket, repo, scan, DB, file, HTTP |

### Herramientas sensibles

```text
send_email
post_review_comment
escalate_ticket
ticket_lookup
search_codebase
run_security_scan
query_database
read_file
write_file
delete_file
fetch_url
execute_command
create_user
update_user
```

### Hipótesis útiles

| Tool encontrada | Prueba posterior |
|---|---|
| `knowledge_search` | Revisar extracción RAG |
| `ticket_lookup` | Probar autorización por ticket |
| `escalate_ticket` | Probar acciones create-only |
| `post_review_comment` | Probar autorización en repos/MR |
| `run_security_scan` | Confirmar si ejecuta o solo analiza |
| `fetch_url` | Revisar SSRF vía agente |
| `query_database` | Revisar permisos y filtros |

---

## 7.5 Prompts del sistema

### Buscar prompts

```bash
find . -type f | grep -Ei "prompt|prompts|system|instructions|developer"
```

### Leer prompts comunes

```bash
cat support-assistant/prompts/system.txt
```

```bash
cat code-reviewer/prompts/system.txt
```

### Guardar evidencias

```bash
cat support-assistant/prompts/system.txt | tee ai-recon/repos/aurora-system-prompt.txt
```

```bash
cat code-reviewer/prompts/system.txt | tee ai-recon/repos/phoenix-system-prompt.txt
```

### Buscar restricciones

```bash
grep -RniE "DO NOT|NEVER|Restrictions|Critical|Security Priorities|allowed|allowlist|deny|block|forbidden|must not|human approval|static analysis|read-only|internal|vulnerabilities|pricing|competitor" . | tee ai-recon/repos/prompt-restrictions.txt
```

### Qué extraer

| Elemento | Utilidad |
|---|---|
| Identidad del asistente | Nombre, rol, ámbito |
| Tareas permitidas | Qué debería poder hacer |
| Restricciones | Qué temas/acciones bloquea |
| Datos sensibles | Qué no debe revelar |
| Reglas de herramientas | Cuándo puede llamar funciones |
| Reglas de aprobación humana | Límites operativos |
| Allowlist | Recursos permitidos |
| Temas bloqueados | Áreas sensibles |

### Interpretación

| Restricción | Hipótesis posterior |
|---|---|
| No hablar de vulnerabilidades | Probar filtros de seguridad |
| No aprobar PRs | Probar tool abuse en revisión |
| Static analysis only | Probar si ejecuta código |
| No acceder fuera de allowlist | Probar límites de repos |
| No compartir documentación interna | Probar RAG leakage |
| No negociar precios | Probar policy bypass |

---

## 7.6 Guardrails y safety config

### Buscar configuraciones de seguridad

```bash
find . -type f | grep -Ei "safety|guardrail|policy|moderation|filter|validator|parser|security"
```

### Leer ejemplos

```bash
cat support-assistant/config/safety.yaml
```

```bash
cat code-reviewer/config/safety.yaml
```

### Guardar evidencias

```bash
cat support-assistant/config/safety.yaml | tee ai-recon/repos/aurora-safety.yaml
```

```bash
cat code-reviewer/config/safety.yaml | tee ai-recon/repos/phoenix-safety.yaml
```

### Buscar patrones de bloqueo

```bash
grep -RniE "blocked_topics|block_patterns|HARM_CATEGORY|validator|regex|output_parser|moderation|pii|secret|password|api_key|eval|approved|LGTM|ship it|looks good" . | tee ai-recon/repos/safety-patterns.txt
```

### Qué extraer

| Configuración | Qué revela |
|---|---|
| `blocked_topics` | Temas sensibles |
| `HARM_CATEGORY_*` | Filtros del proveedor |
| `output_parsers` | Validadores de salida |
| `block_patterns` | Regex de bloqueo |
| `security_rules` | Reglas de detección |
| `ENABLE_PII_DETECTION` | Detección PII |
| `moderation` | Uso de moderación externa |

### Interpretación

| Tipo de guardrail | Implicación |
|---|---|
| Proveedor cloud | Seguridad delegada al proveedor |
| Regex local | Posibles bypasses por variantes |
| Output parser | Revisar formato y evasión |
| Temas bloqueados | Indican temas sensibles |
| Reglas SAST | Puede revelar prioridades defensivas |

---

## 7.7 Configuración de despliegue y cadena de suministro

### Buscar ficheros de despliegue

```bash
find . -type f | grep -Ei "\.env|env.example|docker|compose|kubernetes|helm|values|models|deployment|config|settings"
```

### Leer `.env.example`

```bash
cat support-assistant/.env.example
```

### Leer configuración de modelo

```bash
cat code-reviewer/config/models.yaml
```

### Guardar evidencias

```bash
cat support-assistant/.env.example | tee ai-recon/repos/aurora-env-example.txt
```

```bash
cat code-reviewer/config/models.yaml | tee ai-recon/repos/phoenix-models.yaml
```

### Buscar variables sensibles

```bash
grep -RniE "OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY|PINECONE_API_KEY|MILVUS_HOST|MILVUS_PORT|VLLM_HOST|VLLM_PORT|SLACK_WEBHOOK|WEBHOOK|TOKEN|SECRET|API_KEY|PROJECT_ID|REGION|MODEL_ID|MAX_MODEL_LEN|GPU|CUDA|A100|QUANTIZATION|AWQ" . | tee ai-recon/repos/deployment-and-supply-chain.txt
```

### Qué extraer

| Elemento | Qué indica |
|---|---|
| API keys en `.env.example` | Servicios externos necesarios |
| `GOOGLE_REGION` | Región cloud |
| `PINECONE_INDEX_NAME` | Índice vectorial |
| `SLACK_WEBHOOK_URL` | Integración externa |
| `MILVUS_HOST` | Vector DB self-hosted |
| `VLLM_HOST` | Servidor de inferencia interno |
| `max_model_len` | Context window configurada |
| `gpu_memory_utilization` | Uso GPU |
| `tensor_parallel_size` | Cluster/inferencia distribuida |
| `model_id` | Modelo HuggingFace |
| `quantization` | AWQ, bits, rendimiento |

---

## 7.8 Resumen de extracción rápida

### Ejecutar barrido completo de repositorio

```bash
mkdir -p ai-recon/repos && grep -RniE "openai|anthropic|google-generativeai|gemini|azure|langchain|langgraph|crewai|autogen|vllm|ollama|tgi|transformers|huggingface|chroma|pinecone|weaviate|qdrant|faiss|milvus|embedding|reranker|mcp|a2a|prompt|system|tool|function|guardrail|safety|moderation|api_key|secret|token|webhook|gpu|cuda|quantization|AWQ" . | tee ai-recon/repos/full-ai-recon-grep.txt
```

### Listar archivos relevantes

```bash
find . -type f | grep -Ei "requirements|pyproject|package.json|rag|model|prompt|system|tool|schema|safety|guardrail|\.env|docker|compose|config|settings" | tee ai-recon/repos/interesting-files.txt
```

### Crear resumen manual

```text
Proyecto:
Arquitectura: cloud / self-hosted / híbrida
Proveedor LLM:
Servidor inferencia:
Framework agentes:
Vector DB:
Embedding model:
RAG config:
Tools:
System prompt:
Guardrails:
Secrets/config:
Modelo:
Infraestructura:
Riesgos:
Siguientes pruebas:
```

---

## 7.9 Qué debes recordar para examen

```text
requirements.txt revela stack.
rag.yaml revela chunking, embeddings, retrieval y vector DB.
tools.py / function_schemas.json revela capacidades del agente.
prompts/system.txt revela identidad, límites y temas sensibles.
safety.yaml revela guardrails y patrones de bloqueo.
.env.example revela proveedores, claves esperadas e integraciones.
models.yaml revela servidor de inferencia, modelo, contexto, GPU y cuantización.
```

---

## 7.10 Siguientes pruebas según hallazgo

| Hallazgo en repo | Siguiente prueba |
|---|---|
| `mcp_enabled` / MCP libs | Enumerar `/mcp` y `tools/list` |
| `pinecone-client` | Revisar namespaces, API keys y separación |
| `pymilvus` | Revisar exposición de Milvus y auth |
| `chunk_size` grande | Probar RAG data extraction |
| `top_k` alto | Probar recuperación excesiva |
| `system.txt` restrictivo | Probar prompt injection controlada |
| Tools con acciones | Probar tool abuse |
| `fetch_url` | Probar SSRF vía agente |
| `.env.example` con webhooks | Revisar integraciones externas |
| `vllm` / `VLLM_HOST` | Revisar endpoints de inferencia |
| `model_id` HuggingFace | Investigar capacidades y límites del modelo |

---