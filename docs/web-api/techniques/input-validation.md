# Input Validation

## Objetivo

Comprobar si la aplicación valida correctamente los datos recibidos en el backend.

La validación en frontend mejora la experiencia de usuario, pero no debe considerarse una medida de seguridad.

## Idea clave

```text
Todo dato recibido por el servidor debe considerarse no confiable.
```

## Dónde probar

- Formularios.
- APIs JSON.
- Query parameters.
- Path parameters.
- Headers.
- Cookies.
- Uploads.
- Campos ocultos.
- Campos calculados por frontend.
- Valores de precio, cantidad, rol, estado o permisos.

## Tipos de prueba

### Tipos incorrectos

Si se espera string:

```json
{
  "name": 123
}
```

Si se espera número:

```json
{
  "amount": "abc"
}
```

Si se espera booleano:

```json
{
  "active": "true"
}
```

### Valores negativos

```json
{
  "amount": -100
}
```

### Valores extremos

```json
{
  "quantity": 999999999
}
```

### Valores nulos

```json
{
  "email": null
}
```

### Arrays inesperados

```json
{
  "role": ["admin", "user"]
}
```

### Objetos inesperados

```json
{
  "email": {
    "value": "test@example.com"
  }
}
```

### Campos adicionales

```json
{
  "name": "user",
  "role": "admin",
  "isAdmin": true
}
```

### Strings largas

```text
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

### Caracteres especiales

```text
' " < > { } [ ] ; -- ../ %00
```

## Checklist

- [ ] Probar validación frontend vs backend.
- [ ] Interceptar request con Burp.
- [ ] Modificar valores antes de enviar.
- [ ] Probar tipos incorrectos.
- [ ] Probar valores negativos.
- [ ] Probar valores extremos.
- [ ] Probar valores nulos.
- [ ] Probar campos adicionales.
- [ ] Probar longitudes excesivas.
- [ ] Probar caracteres especiales.
- [ ] Revisar errores.
- [ ] Confirmar si el dato se persiste.
- [ ] Confirmar impacto.

## Validación frontend vs backend

Flujo:

```text
1. Introducir valor válido en el navegador.
2. Interceptar request.
3. Modificar valor en Burp.
4. Enviar al servidor.
5. Comprobar si el backend lo acepta.
```

Ejemplo:

```json
{
  "taxId": "-123456"
}
```

Si el frontend lo bloquea pero el backend lo acepta, existe una debilidad de validación server-side.

## Campos sensibles

Prestar atención a:

```text
role
isAdmin
userId
accountId
customerId
price
amount
discount
balance
status
approved
verified
permissions
```

## Mass Assignment

Caso típico:

Request normal:

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Request modificada:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "role": "admin"
}
```

Comprobar:

- si se acepta el campo;
- si se persiste;
- si cambia permisos;
- si aparece en respuestas posteriores;
- si afecta al comportamiento.

## Uploads

Revisar:

- extensión;
- MIME type;
- contenido real;
- tamaño;
- nombre de fichero;
- rutas;
- metadatos;
- procesamiento posterior;
- acceso público al fichero;
- validación server-side.

Ejemplo de discrepancia:

```text
Nombre: image.png
Content-Type: image/png
Contenido real: HTML, SVG, script u otro tipo
```

## Errores interesantes

- Stack trace.
- Errores de serialización.
- Errores SQL.
- Errores de validación internos.
- Errores con nombres de clases.
- Exposición de rutas.
- Mensajes diferentes según tipo de dato.

## Evidencia mínima

- Request válida.
- Request modificada.
- Response.
- Comportamiento posterior.
- Confirmación de persistencia.
- Captura si aplica.
- Impacto demostrado.

## Impacto

Puede permitir:

- bypass de controles;
- manipulación de datos;
- modificación de roles;
- errores de aplicación;
- corrupción de datos;
- inyección;
- abuso de lógica de negocio;
- ejecución de acciones no previstas.

## Recomendaciones

- Validar todos los datos en backend.
- Usar allowlists.
- Rechazar campos no esperados.
- Validar tipo, formato, longitud y rango.
- No confiar en campos calculados por cliente.
- Calcular valores críticos en servidor.
- Normalizar entradas.
- Usar esquemas estrictos.
- Registrar errores anómalos.
- Aplicar validación coherente entre frontend y backend.

## Plantilla de reporte

```markdown
## Descripción

Se ha identificado una validación insuficiente de entradas en `[ENDPOINT]`, que permite enviar valores no permitidos para el parámetro `[PARAMETRO]`. Aunque el frontend aplica restricciones, el backend acepta la modificación realizada directamente sobre la request.

## Impacto

Un atacante podría manipular datos o flujos de la aplicación, afectando a la integridad de la información o permitiendo acciones no previstas.

## Recomendación

Se recomienda implementar validaciones server-side estrictas para tipo, formato, longitud, rango y campos permitidos, evitando confiar únicamente en controles del frontend.
```

## Nota rápida

```text
Si una validación solo existe en frontend, no es una validación de seguridad.
```