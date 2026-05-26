# JWT

> Notas rápidas para revisar JSON Web Tokens.

## Estructura

```text
header.payload.signature
```

Decodificar sin verificar:

```bash
python3 - << 'PY'
import base64, json, os
token=os.environ["TOKEN"]
for part in token.split(".")[:2]:
    part += "=" * (-len(part) % 4)
    print(json.dumps(json.loads(base64.urlsafe_b64decode(part)), indent=2))
PY
```

## Qué revisar

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT",
  "kid": "key1"
}
```

Campos interesantes:

```text
alg
kid
jku
x5u
typ
```

### Payload

```json
{
  "sub": "123",
  "role": "user",
  "tenant": "acme",
  "iat": 1710000000,
  "exp": 1710003600
}
```

Campos interesantes:

```text
sub
userId
role
roles
admin
tenant
scope
permissions
iat
exp
nbf
aud
iss
```

## Pruebas rápidas

### Cambiar role en payload

Modificar token con herramienta tipo Burp JWT Editor y comprobar si el backend valida firma.

### Token expirado

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $EXPIRED_TOKEN"
```

### Sin firma / token malformado

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer invalid.token.value"
```

### Reutilización tras logout

```text
1. Login.
2. Guardar JWT.
3. Logout.
4. Reusar JWT en request.
```

## Qué buscar

| Señal | Riesgo |
|---|---|
| Token sin exp | Sesión indefinida |
| Role en JWT aceptado sin server-side check | Escalada |
| Logout no invalida token | Reutilización |
| `alg: none` aceptado | Crítico |
| `kid` manipulable | Key confusion / path traversal |
| Datos sensibles en payload | Information disclosure |

## Falsos positivos

- Cambiar payload rompe firma y backend rechaza.
- El role del token no se usa para autorización real.
- Token largo no implica vulnerabilidad.
- JWT en localStorage es riesgo contextual, no hallazgo automático.

## Evidencia mínima

```text
Endpoint:
Claim manipulado:
Request:
Response:
Validación de firma:
Impacto:
```