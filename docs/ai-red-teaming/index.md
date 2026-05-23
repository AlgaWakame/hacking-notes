# AI Red Teaming

## Objetivo

Esta sección recoge notas técnicas sobre seguridad ofensiva aplicada a sistemas de inteligencia artificial.

Incluye conceptos, técnicas, vulnerabilidades, payloads educativos y metodología para analizar sistemas basados en:

- LLMs;
- RAG;
- agentes;
- tool calling;
- embeddings;
- vector databases;
- pipelines de datos;
- APIs integradas con IA.

## Flujo general

```text
Arquitectura → Entradas → Contexto → Herramientas → Datos → Prueba controlada → Evidencia → Reporting
```

## Áreas principales

<div class="grid cards" markdown>

-   🧠 **Conceptos**

    ---

    LLMs, RAG, embeddings, agentes, tool calling y componentes habituales en sistemas de IA.

    [Abrir →](cai-red-teaming/conceptos/llm.md)

-   🧪 **Técnicas**

    ---

    Prompt injection, extracción de datos en RAG, abuso de herramientas, excessive agency y SSRF vía agentes.

    [Abrir →](tecnicas/prompt-injection-directa.md)

-   ⚠️ **Vulnerabilidades**

    ---

    Debilidades habituales en aplicaciones LLM y sistemas con agentes o recuperación documental.

    [Abrir →](vulnerabilidades/prompt-injection.md)

-   📌 **Payloads**

    ---

    Prompts y entradas de prueba para laboratorios autorizados.

    [Abrir →](payloads/prompt-injection.md)

</div>

## Mapa mental

```text
Usuario
  ↓
Entrada controlable
  ↓
Aplicación / API
  ↓
LLM
  ↓
Herramientas / RAG / Memoria / Vector DB
  ↓
Respuesta / Acción
```

## Qué revisar

- [ ] Qué entradas controla el usuario.
- [ ] Qué instrucciones recibe el modelo.
- [ ] Qué contexto se añade al prompt.
- [ ] Si hay RAG.
- [ ] Qué documentos puede recuperar.
- [ ] Si hay memoria.
- [ ] Qué herramientas puede usar el agente.
- [ ] Qué permisos tienen esas herramientas.
- [ ] Si hay validación de salida.
- [ ] Si hay controles de autorización server-side.
- [ ] Si hay separación entre usuarios o tenants.
- [ ] Si se guardan logs y evidencias.

## Vulnerabilidades frecuentes

| Categoría | Qué buscar |
|---|---|
| Prompt Injection | Instrucciones maliciosas que alteran el comportamiento del modelo |
| Indirect Prompt Injection | Instrucciones ocultas en documentos, páginas o datos externos |
| Sensitive Information Disclosure | Fuga de contexto, documentos, secretos o datos de otros usuarios |
| Tool Abuse | Uso indebido de herramientas conectadas al agente |
| Excessive Agency | Agente con demasiados permisos o autonomía |
| Insecure Output Handling | Respuestas del modelo procesadas sin validación |
| RAG Poisoning | Manipulación de documentos recuperados |
| Vector/Embedding Weaknesses | Recuperación incorrecta o fuga por embeddings |

## Evidencias recomendadas

- Prompt usado.
- Entrada controlada.
- Contexto del sistema si es visible.
- Request/response.
- Documento recuperado.
- Acción ejecutada por herramienta.
- Resultado observado.
- Diferencia entre comportamiento esperado y obtenido.
- Impacto demostrado.
- Captura si ayuda.

## Relacionado

- [LLM](conceptos/llm.md)
- [RAG](conceptos/rag.md)
- [Prompt Injection Directa](tecnicas/prompt-injection-directa.md)
- [RAG Data Extraction](tecnicas/rag-data-extraction.md)
- [Plantilla de Vulnerabilidad](../reporting/plantilla-vulnerabilidad.md)