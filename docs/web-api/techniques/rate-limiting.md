# Rate Limiting

## Objetivo

Comprobar si la aplicación limita adecuadamente el número de peticiones o acciones que un usuario, IP, sesión o token puede realizar en un periodo de tiempo.

## Dónde revisar

- Login.
- Registro.
- Recuperación de contraseña.
- OTP / MFA.
- Reenvío de emails.
- Búsquedas.
- APIs costosas.
- Generación de informes.
- Subida de archivos.
- Envío de mensajes.
- Comentarios.
- Invitaciones.
- Webhooks.
- Funciones que consumen recursos.

## Riesgos

La ausencia de rate limiting puede permitir:

- fuerza bruta;
- enumeración;
- abuso de recursos;
- denegación de servicio lógica;
- spam;
- consumo económico;
- abuso de APIs de terceros;
- generación masiva de tokens;
- explotación de condiciones de carrera.

## Checklist

- [ ] Identificar endpoints sensibles.
- [ ] Probar múltiples intentos.
- [ ] Revisar si hay bloqueo.
- [ ] Revisar si hay delay progresivo.
- [ ] Revisar si el límite es por IP.
- [ ] Revisar si el límite es por usuario.
- [ ] Revisar si el límite es por token.
- [ ] Revisar si cambia con cabeceras.
- [ ] Revisar si se puede evadir con parámetros.
- [ ] Revisar mensajes de error.
- [ ] Confirmar impacto.

## Endpoints prioritarios

| Endpoint | Riesgo |
|---|---|
| Login | Fuerza bruta y credential stuffing |
| Reset password | Enumeración y spam |
| OTP/MFA | Bypass por fuerza bruta |
| Registro | Creación masiva de cuentas |
| Búsqueda | Scraping o abuso de recursos |
| Upload | Consumo de almacenamiento |
| Generación IA/reportes | Coste económico |
| Invitaciones | Spam o abuso |

## Prueba manual básica

```text
1. Capturar una request válida.
2. Repetirla varias veces.
3. Observar códigos HTTP y tiempos.
4. Comprobar si aparece bloqueo.
5. Comprobar si el bloqueo se mantiene.
```

## Códigos esperados

| Código | Interpretación |
|---|---|
| 200 | Petición aceptada |
| 401 | No autenticado |
| 403 | Prohibido |
| 429 | Too Many Requests |
| 500 | Error interno, posible fallo |
| 503 | Servicio no disponible |

Un endpoint sensible debería devolver algo parecido a:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

## Evasiones a comprobar

### Cambiar IP

Si está permitido en el alcance:

```text
IP A → varios intentos
IP B → varios intentos
```

### Cambiar cabeceras

Comprobar si confía indebidamente en cabeceras manipulables:

```http
X-Forwarded-For: 127.0.0.1
X-Real-IP: 127.0.0.1
Client-IP: 127.0.0.1
```

### Cambiar usuario

```text
Mismo endpoint, distintos usuarios.
```

### Cambiar token

```text
Mismo usuario, nuevo token.
```

### Cambiar parámetros irrelevantes

```text
email=user@example.com&nonce=123
email=user@example.com&nonce=456
```

## Evidencia mínima

- Endpoint probado.
- Número de intentos.
- Ventana temporal aproximada.
- Código HTTP.
- Respuesta obtenida.
- Usuario/IP/token utilizado.
- Captura o logs de Burp.
- Impacto realista.

## Falsos positivos

No reportar como ausencia de rate limiting si:

- hay bloqueo posterior no observado;
- el endpoint no es sensible;
- no hay impacto real;
- el comportamiento está protegido por otro control;
- la prueba no fue suficiente para confirmarlo;
- el alcance no permite probar volumen.

## Impacto

Puede permitir:

- fuerza bruta de credenciales;
- fuerza bruta de OTP;
- enumeración masiva;
- spam;
- consumo de recursos;
- scraping;
- abuso económico;
- denegación de servicio lógica.

## Recomendaciones

- Aplicar rate limiting por IP, usuario, sesión y token.
- Usar límites específicos por endpoint.
- Añadir bloqueo progresivo.
- Usar CAPTCHA donde tenga sentido.
- Registrar intentos fallidos.
- Alertar sobre patrones anómalos.
- No confiar en cabeceras manipulables.
- Devolver respuestas genéricas.
- Usar `Retry-After`.
- Proteger endpoints costosos.

## Plantilla de reporte

```markdown
## Descripción

Se ha identificado ausencia o insuficiencia de rate limiting en `[ENDPOINT]`, permitiendo realizar múltiples solicitudes consecutivas sin bloqueo efectivo.

## Impacto

Un atacante podría abusar de este comportamiento para realizar fuerza bruta, enumeración, spam o consumo excesivo de recursos, dependiendo de la funcionalidad afectada.

## Recomendación

Se recomienda implementar controles de rate limiting por usuario, IP, sesión y token, junto con bloqueo progresivo, monitorización y respuestas adecuadas como `429 Too Many Requests`.
```

## Nota rápida

```text
El rate limiting debe evaluarse según el riesgo del endpoint, no solo contando requests.
```