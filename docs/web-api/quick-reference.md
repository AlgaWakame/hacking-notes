# Web/API Quick Reference

> Snippets rápidos para copiar, adaptar y ejecutar.

!!! warning "Uso autorizado"
    Ejecutar únicamente en laboratorios, CTFs, entornos propios o auditorías autorizadas.

---

## Variables

```bash
export BASE_URL="https://example.com"
export API_URL="https://example.com/api"
export TOKEN="eyJhbGciOi..."
export USER_A_TOKEN="token-a"
export USER_B_TOKEN="token-b"
export ENDPOINT="$API_URL/users/123"
```

---

## curl

### GET básico

```bash
curl -i "$BASE_URL"
```

### GET autenticado

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN"
```

### POST JSON

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice","email":"alice@example.com"}'
```

### PATCH JSON

```bash
curl -i -X PATCH "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice updated"}'
```

### DELETE

```bash
curl -i -X DELETE "$API_URL/documents/123" \
  -H "Authorization: Bearer $TOKEN"
```

### Ver solo código HTTP

```bash
curl -sk -o /dev/null -w "%{http_code}\n" "$ENDPOINT" \
  -H "Authorization: Bearer $TOKEN"
```

### Guardar evidencia

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  | tee evidence-users-me.txt
```

### Proxy por Burp

```bash
curl -i "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  --proxy http://127.0.0.1:8080 \
  -k
```

---

## Métodos HTTP

```bash
for method in GET POST PUT PATCH DELETE OPTIONS HEAD
do
  echo "== $method =="
  curl -sk -o /dev/null -w "$method -> %{http_code} %{size_download}\n" \
    -X "$method" "$ENDPOINT" \
    -H "Authorization: Bearer $TOKEN"
done
```

---

## Content-Type switching

### JSON

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice"}'
```

### XML

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/xml" \
  --data '<user><name>alice</name></user>'
```

### Form URL encoded

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data 'name=alice&email=alice@example.com'
```

---

## IDOR / BOLA rápido

```bash
curl -i "$API_URL/documents/VICTIM_DOCUMENT_ID" \
  -H "Authorization: Bearer $USER_A_TOKEN"
```

Comparar usuario legítimo:

```bash
curl -i "$API_URL/documents/VICTIM_DOCUMENT_ID" \
  -H "Authorization: Bearer $USER_B_TOKEN"
```

---

## Mass Assignment rápido

```bash
curl -i -X PATCH "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"alice","role":"admin","isAdmin":true,"verified":true}'
```

Confirmar persistencia:

```bash
curl -i "$API_URL/users/123" \
  -H "Authorization: Bearer $TOKEN"
```

---

## JSON malformado

```bash
curl -i -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":'
```

---

## Parámetros duplicados

```bash
curl -i "$API_URL/search?user=alice&user=bob" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Server-side Parameter Pollution

```bash
curl -i "$BASE_URL/userSearch?name=alice%26role=admin"
```

```bash
curl -i "$BASE_URL/userSearch?name=alice%23"
```

```bash
curl -i "$BASE_URL/userSearch?name=alice%3Fdebug=true"
```

---

## ffuf

### Fuzzing de rutas

```bash
ffuf -u "$BASE_URL/FUZZ" \
  -w /usr/share/seclists/Discovery/Web-Content/common.txt \
  -mc all
```

### Fuzzing de API

```bash
ffuf -u "$API_URL/FUZZ" \
  -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt \
  -H "Authorization: Bearer $TOKEN" \
  -mc 200,201,204,301,302,400,401,403,405,500
```

### Fuzzing de acciones

```bash
cat > api-actions.txt << 'EOF'
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
reset
approve
reject
confirm
cancel
archive
restore
EOF

ffuf -u "$API_URL/user/FUZZ" \
  -w api-actions.txt \
  -H "Authorization: Bearer $TOKEN" \
  -mc 200,201,204,400,401,403,405,500
```

---

## jq

### Pretty print

```bash
curl -s "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

### Extraer claves

```bash
curl -s "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  | jq 'keys'
```

### Extraer IDs

```bash
curl -s "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.[].id'
```

### Buscar campos sensibles

```bash
curl -s "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.. | objects | keys[]?' \
  | sort -u \
  | grep -Ei "role|admin|token|secret|password|permission|tenant|owner|verified"
```

---

## Headers útiles

```bash
curl -I "$BASE_URL"
```

```bash
curl -i "$BASE_URL" \
  -H "X-Forwarded-For: 127.0.0.1" \
  -H "X-Original-URL: /admin" \
  -H "X-Rewrite-URL: /admin"
```

---

## Rate limiting básico

```bash
for i in {1..20}
do
  curl -sk -o /dev/null -w "$i -> %{http_code}\n" "$API_URL/search?q=test" \
    -H "Authorization: Bearer $TOKEN"
done
```

---

## Checklist express

```text
[ ] Endpoint identificado
[ ] Método probado
[ ] Auth comprobada
[ ] IDOR probado
[ ] Parámetros ocultos probados
[ ] Mass assignment probado
[ ] Content-Type alternativo probado
[ ] Rate limit revisado
[ ] Error handling revisado
[ ] Evidencia guardada
```