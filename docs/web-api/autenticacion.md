# Autenticación

## Objetivo

Revisar los mecanismos que permiten identificar a un usuario dentro de una aplicación web o API.

La autenticación responde a la pregunta:

```text
¿Quién eres?
```

No debe confundirse con autorización, que responde a:

```text
¿Qué puedes hacer?
```

## Superficie típica

- Login.
- Logout.
- Registro.
- Recuperación de contraseña.
- Cambio de contraseña.
- MFA / OTP.
- Tokens de sesión.
- JWT.
- Cookies.
- Magic links.
- OAuth / SSO.
- APIs móviles.
- Endpoints internos de autenticación.

## Checklist inicial

- [ ] Identificar todos los flujos de autenticación.
- [ ] Revisar login.
- [ ] Revisar logout.
- [ ] Revisar registro.
- [ ] Revisar recuperación de contraseña.
- [ ] Revisar cambio de contraseña.
- [ ] Revisar MFA si existe.
- [ ] Revisar gestión de sesiones.
- [ ] Revisar cookies.
- [ ] Revisar tokens.
- [ ] Revisar mensajes de error.
- [ ] Revisar rate limiting.
- [ ] Revisar diferencias entre usuarios válidos e inválidos.

## Login

### Qué comprobar

- Respuestas distintas para usuario válido e inválido.
- Diferencias de tiempo.
- Diferencias de código HTTP.
- Diferencias de mensaje.
- Falta de rate limiting.
- Bloqueo de cuenta inexistente o débil.
- Errores verbosos.
- Autenticación por API sin protección adicional.

### Ejemplo de respuestas sospechosas

```text
Usuario inexistente → "User not found"
Contraseña incorrecta → "Invalid password"
```

Esto puede permitir enumeración de usuarios.

## Enumeración de usuarios

### Dónde probar

- Login.
- Registro.
- Recuperación de contraseña.
- Validación de email.
- Invitaciones.
- APIs de usuario.
- Mensajes de error.
- Diferencias de estado HTTP.

### Señales

| Caso | Señal |
|---|---|
| Usuario existe | Mensaje diferente |
| Usuario no existe | Código HTTP diferente |
| Email registrado | Tiempo de respuesta mayor |
| Cuenta bloqueada | Mensaje específico |
| Reset password | Respuesta distinta |

### Ejemplo

```http
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "email": "valid@example.com",
  "password": "wrong-password"
}
```

Comparar con:

```http
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "email": "invalid@example.com",
  "password": "wrong-password"
}
```

## Recuperación de contraseña

### Qué comprobar

- Si permite enumerar usuarios.
- Si el token es predecible.
- Si el token caduca correctamente.
- Si el token se puede reutilizar.
- Si el token queda invalidado tras usarlo.
- Si el cambio de contraseña invalida sesiones previas.
- Si hay rate limiting.
- Si el enlace contiene información sensible.
- Si el flujo permite cambiar contraseñas de otros usuarios.

### Preguntas clave

- ¿El token tiene suficiente entropía?
- ¿Caduca?
- ¿Es de un solo uso?
- ¿Está vinculado al usuario correcto?
- ¿Se invalida después de cambiar la contraseña?
- ¿Se invalidan sesiones activas?
- ¿La respuesta permite saber si el email existe?

## Cambio de contraseña

Comprobar:

- Si requiere contraseña actual.
- Si acepta tokens antiguos.
- Si permite cambiar contraseña de otro usuario.
- Si invalida sesiones previas.
- Si notifica al usuario.
- Si aplica política de complejidad.
- Si permite reutilizar contraseñas anteriores.

## Logout

### Qué comprobar

- Si el token queda invalidado.
- Si la cookie se elimina correctamente.
- Si se puede reutilizar el token después del logout.
- Si el logout es server-side o solo client-side.
- Si afecta a todas las sesiones o solo a la actual.

### Prueba básica

```text
1. Iniciar sesión.
2. Capturar request autenticada.
3. Hacer logout.
4. Reenviar la request autenticada.
5. Comprobar si sigue funcionando.
```

Si sigue funcionando, puede existir un problema de invalidación de sesión.

## Cookies de sesión

Revisar atributos:

| Atributo | Objetivo |
|---|---|
| HttpOnly | Evita acceso desde JavaScript |
| Secure | Solo envío por HTTPS |
| SameSite | Reduce riesgo CSRF |
| Expiration | Control de duración |
| Domain | Alcance de la cookie |
| Path | Ruta donde aplica |

Ejemplo:

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
```

## JWT

### Qué revisar

- Algoritmo usado.
- Expiración.
- Claims sensibles.
- Firma.
- Uso de `none`.
- Cambio de algoritmo.
- Secret débil.
- Falta de invalidación.
- Claims manipulables.
- Exposición de datos sensibles en payload.

### Claims interesantes

```json
{
  "sub": "123",
  "role": "user",
  "email": "user@example.com",
  "exp": 1710000000
}
```

Preguntas:

- ¿El rol se valida en backend?
- ¿El token caduca?
- ¿El token puede reutilizarse tras logout?
- ¿Contiene datos sensibles?
- ¿Se puede modificar sin invalidar firma?

## MFA / OTP

Comprobar:

- Bypass de MFA.
- Reutilización de códigos.
- Falta de expiración.
- Ausencia de rate limiting.
- Respuestas distintas.
- Códigos demasiado cortos.
- Reenvío ilimitado.
- Cambio de canal sin validación.
- Flujos alternativos sin MFA.

### Prueba de bypass

```text
1. Login con credenciales válidas.
2. Llegar a pantalla MFA.
3. Intentar acceder directamente a recurso autenticado.
4. Probar endpoints internos con token parcial.
```

## Evidencia mínima

- Request original.
- Request modificada.
- Response.
- Código HTTP.
- Mensaje de error.
- Usuario probado.
- Timestamp.
- Captura si aporta contexto.
- Comparación entre caso válido e inválido.

## Vulnerabilidades comunes

| Vulnerabilidad | Descripción |
|---|---|
| User Enumeration | Diferencias permiten identificar usuarios válidos |
| Weak Password Reset | Tokens débiles, reutilizables o no caducados |
| Session Fixation | Sesión no rota tras login |
| Missing Logout Invalidation | Token válido tras cerrar sesión |
| Weak JWT Handling | Firma débil, claims manipulables o expiración incorrecta |
| MFA Bypass | Acceso a recursos sin completar MFA |
| Brute Force | Falta de rate limiting en login u OTP |

## Impacto

Puede permitir:

- enumeración de usuarios;
- acceso no autorizado;
- secuestro de sesión;
- reutilización de tokens;
- bypass de MFA;
- compromiso de cuentas;
- escalada hacia funcionalidades sensibles.

## Recomendaciones

- Usar mensajes de error genéricos.
- Aplicar rate limiting.
- Implementar bloqueo progresivo.
- Invalidar sesiones tras logout y cambio de contraseña.
- Usar tokens aleatorios y con expiración.
- Proteger cookies con `HttpOnly`, `Secure` y `SameSite`.
- Validar JWT correctamente.
- No almacenar datos sensibles en tokens.
- Aplicar MFA en el servidor, no solo en frontend.
- Registrar intentos anómalos.

## Plantilla de reporte

```markdown
## Descripción

Se ha identificado una debilidad en el mecanismo de autenticación de la aplicación que permite [describir comportamiento], debido a [causa raíz].

## Impacto

Un atacante podría [impacto realista], lo que podría derivar en compromiso de cuentas, enumeración de usuarios o reutilización indebida de sesiones.

## Recomendación

Se recomienda reforzar el flujo de autenticación mediante mensajes genéricos, rate limiting, invalidación adecuada de sesiones y validaciones server-side en todos los pasos críticos.
```

## Nota rápida

```text
En autenticación, pequeñas diferencias de respuesta pueden convertirse en señales útiles para enumerar usuarios o abusar del flujo.
```