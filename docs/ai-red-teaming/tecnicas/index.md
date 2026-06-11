# Técnicas de AI Red Teaming

> Guía rápida para consultar técnicas prácticas de reconocimiento, explotación y validación en sistemas integrados con IA.

Esta sección está pensada para consulta durante laboratorios, preparación de examen y auditorías autorizadas.

## Flujo recomendado

```text
Reconocimiento → Superficie IA → RAG → Agentes/Herramientas → Prompt Injection → Evidencia
```

## Técnicas

| Técnica | Uso principal |
|---|---|
| [Reconocimiento](reconocimiento/index.md) | Mapa rápido de reconocimiento IA |
| [Reconocimiento pasivo](reconocimiento/pasivo.md) | Headers, health/status, docs API, repositorios y fuzzing controlado |
| [Reconocimiento activo](reconocimiento/activo.md) | Modelo, OpenAI-compatible API, RAG, MCP/tools, agentes y detección |
| [Prompt Injection Directa](prompt-injection-directa.md) | Probar si el usuario puede alterar el comportamiento del modelo |
| [Prompt Injection Indirecta](prompt-injection-indirecta.md) | Probar instrucciones maliciosas en documentos, páginas o fuentes externas |
| [RAG Data Extraction](rag-data-extraction.md) | Validar fugas de documentos, citas, chunks o datos de otros usuarios |
| [SSRF vía Agente](ssrf-via-agent.md) | Revisar herramientas que procesan URLs controladas por usuario |
| [Tool Abuse](tool-abuse.md) | Validar abuso de herramientas, funciones, conectores o acciones externas |

## Checklist rápida

```text
[ ] Identificar endpoint principal
[ ] Revisar headers
[ ] Revisar health/status
[ ] Confirmar si hay API compatible con OpenAI
[ ] Buscar modelo/proveedor
[ ] Buscar RAG/vector DB
[ ] Buscar MCP/tools/agentes
[ ] Revisar repositorios/configs
[ ] Probar comportamiento activo con prompts controlados
[ ] Guardar request/response
[ ] Separar hechos observados de hipótesis
```

## Evidencia mínima

```text
Target:
Endpoint:
Modelo:
RAG:
Agentes/tools:
Prompt:
Request:
Response:
Impacto:
Siguiente prueba:
```