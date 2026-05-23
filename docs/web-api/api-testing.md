# API Testing

## Objetivo

Revisar APIs REST/JSON desde una perspectiva ofensiva, prestando atención a autorización, validación de entradas, exposición de información, métodos HTTP, lógica de negocio y control de recursos.

## Superficie típica

- Endpoints REST.
- GraphQL.
- WebSockets.
- APIs internas consumidas por frontend.
- APIs móviles.
- Swagger/OpenAPI.
- Endpoints legacy.
- Versiones antiguas.
- Funciones administrativas ocultas.

## Checklist inicial

- [ ] Identificar base URL.
- [ ] Identificar versión.
- [ ] Enumerar endpoints.
- [ ] Revisar métodos HTTP.
- [ ] Revisar autenticación.
- [ ] Revisar autorización por endpoint.
- [ ] Revisar autorización por objeto.
- [ ] Revisar parámetros.
- [ ] Revisar validación server-side.
- [ ] Revisar rate limiting.
- [ ] Revisar errores.
- [ ] Revisar documentación expuesta.

## Métodos HTTP

Probar si el endpoint acepta métodos no esperados:

```bash
curl -i -X GET https://example.com/api/resource/1
curl -i -X POST https://example.com/api/resource/1
curl -i -X PUT https://example.com/api/resource/1
curl -i -X PATCH https://example.com/api/resource/1
curl -i -X DELETE https://example.com/api/resource/1
```

## Autorización por objeto

Ejemplo:

```http
GET /api/invoices/123 HTTP/1.1
Authorization: Bearer TOKEN_USUARIO_A
```

Modificar:

```http
GET /api/invoices/124 HTTP/1.1
Authorization: Bearer TOKEN_USUARIO_A
```

Preguntas:

- ¿El recurso pertenece al usuario?
- ¿El backend lo comprueba?
- ¿Devuelve 200, 403, 404 o 500?
- ¿La respuesta filtra datos parciales?

## Mass Assignment

Ocurre cuando la API acepta campos que el usuario no debería poder controlar.

Request normal:

```json
{
  "name": "user",
  "email": "user@example.com"
}
```

Prueba:

```json
{
  "name": "user",
  "email": "user@example.com",
  "role": "admin",
  "isAdmin": true,
  "balance": 9999
}
```

Comprobar:

- si el campo se acepta;
- si se persiste;
- si cambia el comportamiento;
- si impacta a permisos o datos.

## Validación server-side

No confiar en el frontend.

Probar:

- valores negativos;
- valores nulos;
- strings largas;
- tipos incorrectos;
- arrays donde se espera string;
- objetos anidados;
- fechas inválidas;
- importes extremos;
- IDs de otros usuarios.

## Errores

Revisar si la API expone:

- stack traces;
- rutas internas;
- nombres de clases;
- consultas SQL;
- errores de validación demasiado detallados;
- versiones;
- servicios internos;
- información de infraestructura.

## Rate limiting

Revisar especialmente:

- login;
- reset password;
- OTP;
- búsqueda;
- generación de recursos;
- endpoints costosos;
- endpoints que llaman a terceros.

## Evidencia recomendada

| Evidencia | Motivo |
|---|---|
| Request original | Muestra comportamiento legítimo |
| Request modificada | Muestra la prueba |
| Response | Confirma resultado |
| Usuario/rol | Contexto de autorización |
| Estado posterior | Confirma persistencia |
| Captura | Ayuda a explicar impacto |

## Errores comunes

- Probar solo desde la UI.
- No revisar endpoints llamados por JavaScript.
- No comparar usuarios.
- No probar métodos HTTP alternativos.
- No probar campos extra en JSON.
- No revisar versiones antiguas.
- No validar si el cambio se persiste.

## Nota rápida

```text
En APIs, el frontend es solo una pista. La seguridad real debe estar en el backend.
```