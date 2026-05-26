# OAuth & OIDC

> Notas rápidas para revisar flujos OAuth 2.0 / OpenID Connect.

## Parámetros clave

```text
client_id
redirect_uri
response_type
scope
state
nonce
code
code_verifier
code_challenge
grant_type
id_token
access_token
refresh_token
```

## Endpoints comunes

```text
/.well-known/openid-configuration
/oauth/authorize
/oauth/token
/oauth/userinfo
/connect/authorize
/connect/token
/connect/userinfo
```

## Discovery

```bash
curl -s "$BASE_URL/.well-known/openid-configuration" | jq
```

## Qué revisar

- `redirect_uri` abierto o débil.
- Falta de `state`.
- Falta de `nonce` en OIDC.
- Scopes excesivos.
- Token leakage en URL.
- Refresh tokens largos.
- PKCE ausente en clientes públicos.
- Confusión entre `id_token` y `access_token`.
- Validación débil de `aud`, `iss`, `exp`.

## Redirect URI

Probar variaciones:

```text
https://app.example.com/callback
https://app.example.com/callback.evil.com
https://evil.com/callback
https://app.example.com.evil.com/callback
```

## State

Flujo:

```text
1. Iniciar login.
2. Capturar request authorization.
3. Eliminar o cambiar state.
4. Completar login.
5. Comprobar si se acepta.
```

## PKCE

Buscar:

```text
code_challenge
code_challenge_method
code_verifier
```

Si cliente público no usa PKCE, revisarlo.

## Tokens

Decodificar JWT si aplica:

```bash
export TOKEN="eyJhbGciOi..."
python3 - << 'PY'
import os, base64, json
t=os.environ["TOKEN"]
for p in t.split(".")[:2]:
    p += "=" * (-len(p) % 4)
    print(json.dumps(json.loads(base64.urlsafe_b64decode(p)), indent=2))
PY
```

## Evidencia mínima

```text
Flujo:
Parámetro:
Request original:
Request modificada:
Resultado:
Impacto:
```

## Falsos positivos

- Redirect URI parece flexible pero está validado tras normalización.
- Falta de PKCE en cliente confidencial puede ser aceptable.
- Scope amplio pero no concede permisos reales.
- Token en URL solo aparece en flujo legacy controlado.

## Mitigación

- Allowlist exacta de redirect URIs.
- `state` obligatorio y validado.
- `nonce` en OIDC.
- PKCE para clientes públicos.
- Validar `iss`, `aud`, `exp`, `nonce`.
- No exponer tokens en logs ni URLs.