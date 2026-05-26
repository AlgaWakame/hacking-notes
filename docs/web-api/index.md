# Web & API Security

> Guía rápida para refrescar técnicas, comandos y pruebas de seguridad Web/API.

Esta sección está orientada a consulta práctica. La persona que llega aquí normalmente ya sabe qué quiere probar y necesita localizar rápido:

- comandos;
- payloads;
- técnicas;
- señales de vulnerabilidad;
- evidencias mínimas;
- falsos positivos;
- notas por tecnología.

---

## Acceso rápido

<div class="grid cards" markdown>

-   ⚡ **Quick Reference**

    ---

    Snippets rápidos de `curl`, `ffuf`, `jq`, Burp, métodos HTTP, headers, JSON y evidencias.

    [Abrir →](quick-reference.md)

-   🧪 **Techniques**

    ---

    Guías prácticas para probar IDOR, authentication, mass assignment, SSPP, business logic, uploads, CORS y más.

    [Abrir →](techniques/api-testing.md)

-   🧠 **Technologies**

    ---

    Notas concretas sobre REST, GraphQL, JWT, OAuth/OIDC, WebSockets y SOAP/XML.

    [Abrir →](technologies/rest-api.md)

</div>

---

## Técnicas principales

| Técnica | Ir a |
|---|---|
| API Testing general | [API Testing](techniques/api-testing.md) |
| Enumeración Web/API | [Enumeration](techniques/enumeration.md) |
| Login, sesiones, MFA, JWT | [Authentication](techniques/authentication.md) |
| IDOR / Broken Object Level Authorization | [Authorization & IDOR](techniques/authorization-idor.md) |
| Campos ocultos / Mass Assignment | [Mass Assignment](techniques/mass-assignment.md) |
| Server-side Parameter Pollution | [SSPP](techniques/server-side-parameter-pollution.md) |
| Lógica de negocio | [Business Logic](techniques/business-logic.md) |
| Validación de entradas | [Input Validation](techniques/input-validation.md) |
| Rate limiting | [Rate Limiting](techniques/rate-limiting.md) |
| Information Disclosure | [Information Disclosure](techniques/information-disclosure.md) |
| File Upload | [File Upload](techniques/file-upload.md) |
| CORS | [CORS](techniques/cors.md) |

---

## Flujo mínimo de prueba

```text
Endpoint → Método → Auth → Parámetros → Autorización → Validación → Impacto → Evidencia
```

---

## Variables base

```bash
export BASE_URL="https://example.com"
export API_URL="https://example.com/api"
export TOKEN="eyJhbGciOi..."
export USER_A_TOKEN="token-a"
export USER_B_TOKEN="token-b"
export ENDPOINT="$API_URL/users/123"
```

---

## Evidencia mínima

```text
Endpoint:
Método:
Usuario/Rol:
Request original:
Request modificada:
Response:
Impacto:
Conclusión:
```