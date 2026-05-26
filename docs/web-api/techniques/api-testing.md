# API Testing

> Estado: En construcción  
> Categoría: Web Security / API Security  
> Última actualización: 2026-05-23  
> Confianza: Media

## Objetivo

Guía rápida para probar APIs REST/JSON en laboratorios, CTFs y auditorías autorizadas.

El objetivo es identificar superficie de ataque API que no siempre aparece completamente en el frontend:

- documentación expuesta;
- endpoints ocultos;
- métodos HTTP soportados;
- content types aceptados;
- parámetros ocultos;
- mass assignment;
- autorización por objeto;
- validación server-side;
- errores verbosos;
- rate limiting;
- versionado inseguro;
- server-side parameter pollution.

!!! warning "Uso autorizado"
    Ejecutar estas pruebas únicamente en entornos propios, laboratorios, CTFs o auditorías con autorización explícita.

---

## Flujo de trabajo

```text
Documentación → Endpoints → Métodos → Parámetros → Autorización → Validación → Lógica → Evidencia → Reporting
```

## Mapa mental

```text
Frontend
  ↓
JavaScript / Mobile App / Client
  ↓
API Gateway / Backend
  ↓
Endpoints REST / GraphQL / Internal APIs
  ↓
Servicios internos
  ↓
Base de datos / Integraciones / Terceros
```

El frontend solo muestra una parte de la API. La superficie real suele estar en:

- endpoints usados por JavaScript;
- endpoints documentados pero no enlazados;
- endpoints legacy;
- parámetros no visibles;
- métodos HTTP no usados por la UI;
- APIs internas llamadas por el backend.

---

## Preparación

### Variables útiles

```bash
export BASE_URL="https://example.com"
export API_URL="https://example.com/api"
export TOKEN="eyJhbGciOi..."
```

### Carpeta de trabajo

```bash
mkdir -p api-testing/{requests,responses,swagger,burp,evidence,notes}
cd api-testing
```

### Request autenticada base

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN"
```

Guardar evidencia:

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  | tee responses/users-me.txt
```

---

## 1. Descubrimiento de documentación API

Las APIs suelen tener documentación humana o machine-readable. PortSwigger recomienda revisar documentación pública o accesible desde aplicaciones que consumen la API, incluyendo formatos como JSON/YAML, OpenAPI o Swagger. También sugiere buscar rutas comunes como `/api`, `/swagger/index.html` u `/openapi.json`. 

### Rutas comunes

```text
/api
/api/
/api/docs
/api/swagger
/api/swagger.json
/api/swagger.yaml
/api/swagger/v1
/swagger
/swagger/
.swagger
/swagger/index.html
/swagger-ui
/swagger-ui.html
/swagger-ui/index.html
/openapi.json
/openapi.yaml
/v1/swagger.json
/v2/swagger.json
/v3/api-docs
/docs
/docs/api
/redoc
/redocly
```

### Probar rutas con curl

```bash
for path in \
  /api \
  /swagger/index.html \
  /swagger-ui.html \
  /openapi.json \
  /openapi.yaml \
  /v3/api-docs \
  /docs \
  /redoc
do
  echo "== $path =="
  curl -sk -o /dev/null -w "%{http_code} %{content_type} %{url_effective}\n" "$BASE_URL$path"
done | tee evidence/api-docs-discovery.txt
```

### Descargar OpenAPI si existe

```bash
curl -sk "$BASE_URL/openapi.json" -o swagger/openapi.json
```

```bash
curl -sk "$BASE_URL/swagger.json" -o swagger/swagger.json
```

### Revisar endpoints en OpenAPI

```bash
jq '.paths | keys[]' swagger/openapi.json
```

Guardar:

```bash
jq '.paths | keys[]' swagger/openapi.json | tee evidence/openapi-paths.txt
```

---

## 2. Identificación de endpoints

Un endpoint API es una ruta donde la API recibe requests sobre un recurso.

Ejemplos:

```http
GET /api/users/me HTTP/1.1
GET /api/users/123 HTTP/1.1
POST /api/orders HTTP/1.1
PATCH /api/profile HTTP/1.1
DELETE /api/documents/456 HTTP/1.1
```

### Desde Burp

Revisar:

- HTTP history;
- Target sitemap;
- JavaScript;
- requests XHR/fetch;
- endpoints con `/api/`;
- endpoints con `/v1/`, `/v2/`, `/internal/`, `/admin/`.

### Desde JavaScript descargado

Buscar endpoints:

```bash
grep -RhoE '["'\''](/[a-zA-Z0-9_./{}?=&:-]*api[a-zA-Z0-9_./{}?=&:-]*)["'\'']' . \
  | sort -u \
  | tee evidence/js-api-endpoints.txt
```

Buscar palabras clave:

```bash
grep -RniE "api|graphql|swagger|openapi|token|authorization|admin|internal|debug|secret" . \
  | tee evidence/js-interesting-strings.txt
```

### Tabla de endpoints

| Método | Endpoint | Auth | Rol | Parámetros | Observaciones |
|---|---|---|---|---|---|
| GET | `/api/users/me` | Sí | user | - | Perfil propio |
| GET | `/api/users/{id}` | Sí | user | id | Revisar IDOR |
| PATCH | `/api/users/{id}` | Sí | user | body JSON | Revisar mass assignment |
| DELETE | `/api/documents/{id}` | Sí | user | id | Revisar autorización |

---

## 3. Interacción con endpoints

Una vez identificado un endpoint, hay que entender:

- qué método acepta;
- qué parámetros procesa;
- qué content type espera;
- si requiere autenticación;
- si aplica autorización por objeto;
- cómo responde ante errores.

### Request base

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Request con JSON

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice","email":"alice@example.com"}'
```

### Guardar request/response

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice","email":"alice@example.com"}' \
  | tee responses/create-user.txt
```

---

## 4. Métodos HTTP soportados

PortSwigger recomienda probar distintos métodos HTTP porque un mismo endpoint puede exponer funcionalidad adicional según el verbo usado, por ejemplo `GET`, `POST`, `PATCH`, `PUT`, `DELETE` u `OPTIONS`.

!!! danger "Precaución"
    Probar métodos peligrosos como `DELETE`, `PUT` o `PATCH` solo sobre objetos de bajo impacto y dentro del alcance autorizado.

### Probar métodos

```bash
export ENDPOINT="$API_URL/users/123"

for method in GET POST PUT PATCH DELETE OPTIONS HEAD
do
  echo "== $method =="
  curl -sk -o /dev/null -w "$method -> %{http_code} %{size_download}\n" \
    -X "$method" "$ENDPOINT" \
    -H "Authorization: Bearer $TOKEN"
done | tee evidence/http-methods.txt
```

### Interpretación

| Resultado | Posible significado |
|---|---|
| `200` | Método aceptado |
| `201` | Recurso creado |
| `204` | Acción realizada sin body |
| `400` | Request mal formada |
| `401` | Falta autenticación |
| `403` | Sin permisos |
| `404` | Recurso no existe u ocultado |
| `405` | Método no permitido |
| `500` | Error interno; revisar información expuesta |

---

## 5. Content Types

Las APIs pueden comportarse de forma diferente según el `Content-Type`. PortSwigger destaca que cambiar el tipo de contenido puede revelar errores, provocar diferencias de lógica o exponer defensas inconsistentes entre JSON y XML.

### Probar JSON

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice","email":"alice@example.com"}'
```

### Probar XML

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/xml" \
  --data '<user><name>alice</name><email>alice@example.com</email></user>'
```

### Probar form-urlencoded

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data 'name=alice&email=alice@example.com'
```

### Probar text/plain

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: text/plain" \
  --data '{"name":"alice","email":"alice@example.com"}'
```

### Qué buscar

- errores distintos;
- stack traces;
- diferencias de validación;
- bypass de filtros;
- parsing inesperado;
- XML aceptado donde solo se esperaba JSON;
- JSON aceptado sin content type correcto.

---

## 6. Endpoints ocultos

Los endpoints ocultos pueden estar documentados, presentes en JavaScript, expuestos por rutas legacy o seguir patrones de naming comunes.

### Ejemplo

Endpoint conocido:

```text
PUT /api/user/update
```

Posibles variantes:

```text
/api/user/delete
/api/user/add
/api/user/create
/api/user/disable
/api/user/enable
/api/user/export
/api/user/import
/api/user/admin
```

### Fuzzing básico con ffuf

```bash
ffuf -u "$API_URL/user/FUZZ" \
  -w wordlists/api-actions.txt \
  -H "Authorization: Bearer $TOKEN" \
  -mc all \
  -o evidence/ffuf-api-user-actions.json
```

### Wordlist rápida

```bash
cat > wordlists-api-actions.txt << 'EOF'
add
create
update
delete
remove
disable
enable
export
import
admin
search
list
details
info
reset
approve
reject
confirm
cancel
archive
restore
EOF
```

### Fuzzing con wordlist creada

```bash
ffuf -u "$API_URL/user/FUZZ" \
  -w wordlists-api-actions.txt \
  -H "Authorization: Bearer $TOKEN" \
  -mc 200,201,204,301,302,400,401,403,405,500 \
  -o evidence/ffuf-hidden-endpoints.json
```

---

## 7. Parámetros ocultos

PortSwigger recomienda buscar parámetros no documentados, ya que pueden alterar el comportamiento de la aplicación. Estos pueden descubrirse por respuestas API, objetos JSON devueltos, documentación o fuerza bruta controlada.

### Comparar objeto devuelto vs objeto modificable

Respuesta de perfil:

```json
{
  "id": 123,
  "name": "Alice",
  "email": "alice@example.com",
  "isAdmin": false,
  "role": "user",
  "verified": true
}
```

Request normal:

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Parámetros candidatos:

```text
id
isAdmin
role
verified
status
permissions
```

### Probar parámetro oculto

```bash
curl -i -X PATCH "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"Alice","email":"alice@example.com","isAdmin":true}'
```

### Probar valor inválido

```bash
curl -i -X PATCH "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"Alice","email":"alice@example.com","isAdmin":"invalid-test"}'
```

Si el valor inválido produce una respuesta diferente, puede indicar que el backend reconoce y procesa el parámetro.

---

## 8. Mass Assignment

Mass assignment ocurre cuando un framework enlaza automáticamente parámetros de request a propiedades internas de un objeto. Esto puede permitir modificar campos que el desarrollador no pretendía exponer.

### Request legítima

```http
PATCH /api/users/123 HTTP/1.1
Host: example.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

### Request modificada

```http
PATCH /api/users/123 HTTP/1.1
Host: example.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "role": "admin",
  "isAdmin": true,
  "verified": true
}
```

### Confirmar impacto

Después de enviar la request:

```bash
curl -i "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN"
```

Comprobar:

- si el campo cambió;
- si se persiste;
- si aparecen nuevas funciones;
- si cambian permisos;
- si el usuario puede acceder a rutas administrativas.

### Campos sensibles frecuentes

```text
id
userId
accountId
customerId
role
roles
isAdmin
admin
permissions
groups
verified
status
balance
credit
discount
price
approved
owner
tenant
organizationId
```

---

## 9. Autorización por objeto

Uno de los fallos más importantes en APIs es permitir que un usuario acceda a objetos que no le pertenecen.

### Prueba horizontal

```text
Usuario A → recurso A
Usuario B → recurso B
Usuario A → intenta acceder a recurso B
```

### Ejemplo

```bash
export USER_A_TOKEN="token-a"
export USER_B_RESOURCE_ID="456"

curl -i "$API_URL/documents/$USER_B_RESOURCE_ID" \
  -H "Authorization: Bearer $USER_A_TOKEN"
```

### Interpretación

| Respuesta | Interpretación |
|---|---|
| `200` con datos ajenos | Posible IDOR/BOLA |
| `403` | Control correcto |
| `404` | Puede ser control correcto u ocultación |
| `500` | Error gestionado incorrectamente; revisar |
| Datos parciales | Revisar exposición e impacto |

---

## 10. Versionado de APIs

Las APIs antiguas pueden mantener controles más débiles.

### Rutas a revisar

```text
/api/v1/
/api/v2/
/api/v3/
/v1/
/v2/
/legacy/
/internal/
/beta/
/admin/
```

### Probar versiones

```bash
for version in v1 v2 v3 legacy beta internal admin
do
  echo "== $version =="
  curl -sk -o /dev/null -w "%{http_code} %{url_effective}\n" "$BASE_URL/api/$version/users/me" \
    -H "Authorization: Bearer $TOKEN"
done | tee evidence/api-versions.txt
```

Qué buscar:

- endpoints antiguos activos;
- ausencia de autorización;
- respuestas más verbosas;
- modelos de datos antiguos;
- métodos peligrosos;
- validación inconsistente.

---

## 11. Server-side Parameter Pollution

Server-side parameter pollution ocurre cuando un atacante manipula parámetros que el frontend envía al backend, y el backend los usa para construir requests hacia APIs internas.

Ejemplo conceptual:

```text
Cliente → Backend público → API interna
```

Request externa:

```http
GET /userSearch?name=alice HTTP/1.1
Host: example.com
```

Request interna construida por el backend:

```http
GET /internal/users/search?name=alice HTTP/1.1
Host: internal-api
```

Pruebas habituales:

```text
name=alice%26role=admin
name=alice%23
name=alice%3Fdebug=true
name=alice&name=bob
```

Ejemplo con curl:

```bash
curl -i "$BASE_URL/userSearch?name=alice%26role=admin"
```

```bash
curl -i "$BASE_URL/userSearch?name=alice%23"
```

```bash
curl -i "$BASE_URL/userSearch?name=alice&name=bob"
```

Qué buscar:

- errores diferentes;
- truncamiento de query;
- override de parámetros;
- comportamiento interno inesperado;
- mensajes de error de API interna.

---

## 12. Errores y respuestas verbosas

Revisar si las respuestas exponen:

- stack traces;
- clases internas;
- rutas de ficheros;
- consultas SQL;
- nombres de servicios;
- endpoints internos;
- formato esperado;
- parámetros válidos;
- versiones;
- errores de serialización.

### Probar JSON malformado

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":'
```

### Probar tipo incorrecto

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":{"nested":"value"},"email":123}'
```

---

## 13. Rate limiting en APIs

Endpoints prioritarios:

- login;
- reset password;
- OTP;
- búsqueda;
- creación de recursos;
- generación de informes;
- endpoints que consumen servicios externos;
- endpoints IA o costosos.

### Prueba controlada

```bash
for i in {1..20}
do
  curl -sk -o /dev/null -w "$i -> %{http_code}\n" "$API_URL/search?q=test" \
    -H "Authorization: Bearer $TOKEN"
done | tee evidence/rate-limit-search.txt
```

Qué buscar:

- `429 Too Many Requests`;
- `Retry-After`;
- bloqueo progresivo;
- respuesta igual tras muchas peticiones;
- diferencias por usuario/IP/token.

---

## 14. Evidencias recomendadas

| Prueba | Evidencia |
|---|---|
| Documentación expuesta | URL y captura/respuesta |
| Endpoint oculto | Ruta, método, respuesta |
| Método peligroso | Request y efecto |
| Content type alternativo | Diferencia de respuesta |
| Parámetro oculto | Request con parámetro y resultado |
| Mass assignment | Campo añadido, persistencia e impacto |
| IDOR/BOLA | Comparación Usuario A vs Usuario B |
| SSPP | Parámetro inyectado y comportamiento |
| Error verboso | Response sanitizada |
| Rate limiting | Número de intentos y resultado |

---

## 15. Plantilla de notas

```markdown
## Endpoint

- Método:
- Ruta:
- Requiere autenticación:
- Rol:
- Parámetros:
- Content-Type:
- Fuente:
  - [ ] Frontend
  - [ ] JavaScript
  - [ ] OpenAPI/Swagger
  - [ ] Burp
  - [ ] Fuzzing

## Pruebas

| Prueba | Resultado | Evidencia | Estado |
|---|---|---|---|
| Métodos HTTP | | | |
| Content-Type | | | |
| Parámetros ocultos | | | |
| Mass assignment | | | |
| Autorización por objeto | | | |
| Rate limiting | | | |

## Conclusión

- Riesgo:
- Impacto:
- Recomendación:
```

---

## 16. Recomendaciones defensivas

- Proteger documentación API si no debe ser pública.
- Mantener documentación actualizada.
- Aplicar allowlist de métodos HTTP permitidos.
- Validar `Content-Type` esperado.
- Usar mensajes de error genéricos.
- Proteger todas las versiones de la API.
- Aplicar autorización por objeto en backend.
- Rechazar campos no permitidos.
- Usar esquemas estrictos de validación.
- Aplicar rate limiting.
- Registrar actividad anómala.
- Evitar que el frontend sea el único control.

---

## Nota rápida

```text
En API testing, el frontend es solo una pista. La superficie real aparece al revisar documentación, JavaScript, métodos, content types, parámetros ocultos y autorización por objeto.
```