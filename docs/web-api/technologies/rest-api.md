# REST API

> Notas rápidas para probar APIs REST/JSON.

## Patrones comunes

```text
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
PATCH  /api/users/{id}
DELETE /api/users/{id}
```

## Qué revisar

- Métodos HTTP.
- Autenticación.
- Autorización por objeto.
- Parámetros ocultos.
- Mass assignment.
- Content-Type.
- Versionado.
- Errores.
- Rate limiting.

## Variables

```bash
export API_URL="https://example.com/api"
export TOKEN="eyJhbGciOi..."
export ID="123"
```

## Métodos

```bash
for method in GET POST PUT PATCH DELETE OPTIONS HEAD
do
  curl -sk -o /dev/null -w "$method -> %{http_code}\n" \
    -X "$method" "$API_URL/users/$ID" \
    -H "Authorization: Bearer $TOKEN"
done
```

## Versiones

```bash
for v in v1 v2 v3 legacy beta internal admin
do
  curl -sk -o /dev/null -w "$v -> %{http_code}\n" \
    "$API_URL/$v/users/me" \
    -H "Authorization: Bearer $TOKEN"
done
```

## Content-Type

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice"}'
```

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/xml" \
  --data '<user><name>alice</name></user>'
```

## Checklist REST

```text
[ ] GET no expone objetos ajenos
[ ] POST no acepta campos sensibles
[ ] PUT/PATCH no permiten mass assignment
[ ] DELETE valida propiedad del recurso
[ ] OPTIONS no revela métodos peligrosos
[ ] Versiones antiguas protegidas
[ ] Errores no revelan stack traces
```