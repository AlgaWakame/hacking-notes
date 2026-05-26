# Autorización e IDOR

## Objetivo

Comprobar si la aplicación valida correctamente que un usuario tiene permiso para acceder, modificar o ejecutar acciones sobre un recurso.

## Conceptos clave

### Autenticación

Confirma quién eres.

```text
¿El usuario ha iniciado sesión?
```

### Autorización

Confirma qué puedes hacer.

```text
¿Este usuario puede acceder a este recurso o ejecutar esta acción?
```

### IDOR

Insecure Direct Object Reference ocurre cuando un usuario puede modificar una referencia directa a un objeto y acceder a recursos que no le pertenecen.

Ejemplos de identificadores:

```text
userId
accountId
customerId
orderId
invoiceId
documentId
cardId
requestId
```

## Cuándo sospechar

- Parámetros numéricos.
- IDs incrementales.
- UUIDs visibles.
- Endpoints que reciben identificadores de usuario.
- APIs que devuelven objetos completos.
- Diferencias entre frontend y backend.
- El frontend oculta botones, pero el endpoint existe.
- Respuestas distintas: 200, 403, 404, 500.

## Metodología de prueba

### 1. Crear dos usuarios

```text
Usuario A → recurso A
Usuario B → recurso B
```

### 2. Capturar request legítima

Ejemplo:

```http
GET /api/accounts/1001 HTTP/1.1
Host: example.com
Authorization: Bearer TOKEN_USUARIO_A
```

### 3. Modificar identificador

```http
GET /api/accounts/1002 HTTP/1.1
Host: example.com
Authorization: Bearer TOKEN_USUARIO_A
```

### 4. Interpretar resultado

| Resultado | Interpretación |
|---|---|
| 200 con datos de otro usuario | Vulnerabilidad confirmada |
| 403 | Control de autorización probablemente correcto |
| 404 | Puede ser correcto o intento de ocultar existencia |
| 500 | Posible fallo de control o error no gestionado |
| Respuesta parcial | Revisar impacto |

## Pruebas habituales

### Acceso horizontal

Usuario A accede a recurso de Usuario B.

```text
GET /api/orders/{orderId}
```

### Acceso vertical

Usuario normal accede a función administrativa.

```text
POST /api/admin/users/{id}/disable
```

### Modificación no autorizada

Usuario A modifica datos de Usuario B.

```text
PUT /api/users/{id}
```

### Eliminación no autorizada

```text
DELETE /api/documents/{documentId}
```

## Evidencia mínima

- Request original.
- Request modificada.
- Response obtenida.
- Usuario utilizado.
- Recurso accedido.
- Comparación con usuario propietario.
- Captura si ayuda a entender impacto.

## Impacto

Puede permitir:

- acceso a datos personales;
- modificación de información de otros usuarios;
- descarga de documentos;
- acceso a facturas;
- manipulación de cuentas;
- ejecución de acciones administrativas;
- escalada de privilegios.

## Falsos positivos

No confirmar IDOR si:

- el dato es público;
- el usuario tiene permiso legítimo;
- el endpoint devuelve datos simulados;
- el cambio no se persiste;
- no hay impacto real;
- no se ha comparado con otro usuario.

## Recomendaciones

- Validar autorización en backend.
- No confiar en controles del frontend.
- Comprobar propiedad del recurso.
- Aplicar controles por objeto.
- Usar políticas centralizadas de autorización.
- Registrar intentos no autorizados.
- Usar respuestas consistentes.
- Revisar endpoints antiguos.

## Plantilla de reporte

```markdown
## Descripción

Se ha identificado una ausencia de control de autorización en el endpoint `[ENDPOINT]`, que permite a un usuario autenticado acceder o modificar recursos asociados a otro usuario mediante la modificación del identificador `[PARAMETRO]`.

## Impacto

Un atacante autenticado podría acceder a información o realizar acciones sobre recursos de terceros sin autorización, afectando a la confidencialidad e integridad de los datos.

## Recomendación

Se recomienda implementar validaciones de autorización en el backend para comprobar que el usuario autenticado tiene permisos sobre el recurso solicitado antes de devolver, modificar o eliminar información.
```