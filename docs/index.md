# OSAI Notes

Base de conocimiento personal para la preparación de **OSAI / AI-300** y para consolidar metodología de **AI Red Teaming**.

!!! warning "Contenido público"
    Esta guía debe contener únicamente notas sanitizadas, metodología, conceptos, técnicas genéricas y plantillas.  
    No incluir flags, soluciones completas de laboratorios, credenciales, capturas sensibles ni material propietario.

## Cómo usar esta guía

Esta documentación está pensada para consultar rápidamente:

- conceptos de seguridad en IA;
- técnicas de prueba en laboratorios autorizados;
- payloads educativos;
- metodología de enumeración;
- plantillas de reporting;
- checklists de examen;
- errores recurrentes;
- comandos útiles;
- criterios para documentar evidencias;
- formas de estructurar vulnerabilidades.

## Flujo de trabajo recomendado

```text
Concepto → Técnica → Lab privado → Vulnerabilidad → Reporting → Checklist
```

## Secciones principales

### Metodología

La sección de metodología contiene el flujo general para abordar laboratorios y ejercicios de **AI Red Teaming**.

Incluye:

- enumeración inicial;
- identificación de componentes IA;
- análisis de arquitectura;
- identificación de trust boundaries;
- toma de evidencias;
- documentación de hipótesis;
- validación de impacto.

### Conceptos

La sección de conceptos sirve para repasar los fundamentos técnicos necesarios durante la preparación.

Incluye:

- LLMs;
- RAG;
- embeddings;
- vector databases;
- agentes;
- tool calling;
- memoria;
- pipelines de datos;
- seguridad de modelos.

### Técnicas

La sección de técnicas documenta cómo probar debilidades concretas en entornos autorizados.

Ejemplos:

- prompt injection directa;
- prompt injection indirecta;
- extracción de datos en RAG;
- abuso de herramientas de agentes;
- SSRF mediante agentes;
- fuga de system prompt;
- insecure output handling;
- excessive agency.

Cada técnica debería responder a:

- cuándo sospechar que aplica;
- qué señales buscar;
- cómo probarla;
- qué evidencia guardar;
- cómo evitar falsos positivos;
- cómo reportarla.

### Vulnerabilidades

La sección de vulnerabilidades recoge el formato más cercano a reporting profesional.

Cada vulnerabilidad debería incluir:

- descripción;
- activos afectados;
- causa raíz;
- impacto;
- pasos de reproducción;
- evidencia;
- severidad;
- recomendación;
- relación con OWASP LLM, MITRE ATLAS o CWE si aplica.

### Payloads

La sección de payloads contiene entradas de prueba, prompts y variaciones útiles para laboratorios autorizados.

!!! danger "Importante"
    Los payloads deben usarse únicamente en laboratorios, CTFs, entornos propios o sistemas con autorización explícita.

### Herramientas

La sección de herramientas contiene notas rápidas de uso.

Ejemplos:

- Burp Suite;
- Python;
- Docker;
- curl;
- jq;
- herramientas de testing de LLMs;
- scripts auxiliares.

Cada página debería incluir:

- instalación;
- comandos básicos;
- casos de uso;
- errores comunes;
- ejemplos aplicados;
- notas para examen.

### Reporting

La sección de reporting está pensada para transformar hallazgos técnicos en documentación clara.

Incluye:

- plantilla de vulnerabilidad;
- redacción de impacto;
- recomendaciones;
- severidad;
- evidencias mínimas;
- frases útiles para informes.

### Examen

La sección de examen debe funcionar como una guía de preparación y control.

Incluye:

- checklist previa;
- checklist de evidencias;
- control de tiempo;
- errores a evitar;
- estructura de notas;
- estrategia de documentación.

## Principios de documentación

Al documentar una prueba, separar siempre:

| Tipo | Descripción |
|---|---|
| Hecho observado | Algo confirmado directamente mediante evidencia |
| Hipótesis | Posible explicación pendiente de validar |
| Inferencia | Conclusión razonable basada en varios indicios |
| Pendiente | Acción que todavía debe comprobarse |

## Reglas para publicar contenido

Esta web puede ser pública, por lo que se deben seguir estas reglas:

### Permitido

- Conceptos generales.
- Metodología.
- Técnicas explicadas de forma genérica.
- Payloads educativos.
- Checklists.
- Plantillas.
- Troubleshooting genérico.
- Notas de herramientas.
- Recomendaciones defensivas.
- Referencias públicas.

### No permitido

- Flags.
- Soluciones completas de laboratorios.
- Credenciales.
- Tokens.
- Capturas sensibles.
- Requests con secretos.
- Material propietario de cursos.
- Evidencias de examen.
- Información que incumpla reglas de certificación.
- Datos de terceros sin autorización.

## Convención de etiquetas

Etiquetas recomendadas:

```text
#osai
#ai-red-team
#llm
#rag
#agent
#tool-calling
#prompt-injection
#indirect-prompt-injection
#system-prompt-leakage
#data-leakage
#secret-exposure
#ssrf
#idor
#authz
#output-handling
#embedding
#vector-db
#poisoning
#supply-chain
#exam
#lab
#reporting
#troubleshooting
```

## Plantilla rápida para nuevas páginas

Usar esta estructura mínima cuando se cree una página nueva:

```markdown
# [Título]

> Estado: Borrador  
> Categoría: Concepto / Técnica / Vulnerabilidad / Herramienta / Examen  
> Última actualización: YYYY-MM-DD  
> Confianza: Baja / Media / Alta

## Búsquedas rápidas

Palabras clave:  
`osai`, `ai-red-team`, `llm`, `rag`, `agent`

## Resumen rápido

Pendiente de completar.

## Lo mínimo que debo recordar

- Pendiente.
- Pendiente.
- Pendiente.

## Notas

Pendiente.

## Relacionado

- Pendiente.
```

## Flujo recomendado durante el estudio

Para cada laboratorio o sesión de práctica:

1. Crear notas privadas del laboratorio.
2. Enumerar arquitectura y componentes.
3. Formular hipótesis.
4. Probar una hipótesis cada vez.
5. Guardar evidencias.
6. Confirmar impacto.
7. Extraer una técnica reutilizable.
8. Crear o actualizar una página pública sanitizada.
9. Añadir payloads genéricos si son útiles.
10. Actualizar troubleshooting si hubo errores.
11. Revisar si la técnica aplica a reporting.
12. Actualizar checklist de examen si se aprende algo importante.

## Objetivo final

Esta guía debe servir para:

- estudiar OSAI de forma ordenada;
- consultar conceptos rápidamente;
- recordar técnicas de AI Red Teaming;
- documentar pruebas de forma profesional;
- preparar informes claros;
- construir una metodología propia;
- evitar repetir errores;
- repasar antes de simulacros o examen;
- mantener una base de conocimiento útil a largo plazo.