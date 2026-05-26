# GraphQL

> Notas rápidas para identificar y probar APIs GraphQL.

## Endpoints comunes

```text
/graphql
/api/graphql
/gql
/query
```

## Detección

```bash
curl -i "$BASE_URL/graphql"
```

```bash
curl -i -X POST "$BASE_URL/graphql" \
  -H "Content-Type: application/json" \
  --data '{"query":"{ __typename }"}'
```

## Introspection

```bash
curl -s -X POST "$BASE_URL/graphql" \
  -H "Content-Type: application/json" \
  --data '{"query":"{__schema{types{name}}}"}' | jq
```

## Query básica

```bash
curl -i -X POST "$BASE_URL/graphql" \
  -H "Content-Type: application/json" \
  --data '{"query":"query { me { id email role } }"}'
```

## Con Authorization

```bash
curl -i -X POST "$BASE_URL/graphql" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"query":"query { me { id email role } }"}'
```

## IDOR/BOLA

```json
{
  "query": "query($id: ID!) { user(id: $id) { id email role } }",
  "variables": {
    "id": "VICTIM_ID"
  }
}
```

```bash
curl -i -X POST "$BASE_URL/graphql" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"query":"query($id: ID!) { user(id: $id) { id email role } }","variables":{"id":"VICTIM_ID"}}'
```

## Qué revisar

- Introspection habilitada.
- Queries no autorizadas.
- Mutations sensibles.
- BOLA en resolvers.
- Campos sensibles en objetos.
- Rate limiting.
- Query depth.
- Batching.
- Errores verbosos.

## Batching

```json
[
  {"query":"{ me { id } }"},
  {"query":"{ users { id email } }"}
]
```

## Evidence

```text
Endpoint:
Query:
Variables:
Usuario:
Response:
Campo sensible:
Impacto:
```