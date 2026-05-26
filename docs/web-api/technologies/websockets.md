# WebSockets

> Notas rápidas para revisar WebSocket security.

## Detección

Buscar en Burp o JavaScript:

```text
ws://
wss://
new WebSocket
/socket
/ws
/realtime
```

## Conectar con websocat

```bash
websocat "wss://example.com/ws"
```

Con token:

```bash
websocat -H "Authorization: Bearer $TOKEN" "wss://example.com/ws"
```

Con cookie:

```bash
websocat -H "Cookie: session=VALUE" "wss://example.com/ws"
```

## Qué revisar

- Autenticación en handshake.
- Autorización por mensaje.
- CSRF-like WebSocket si usa cookies.
- Origin validation.
- IDOR en mensajes.
- Suscripción a canales ajenos.
- Rate limiting.
- Mensajes JSON manipulables.
- Errores verbosos.

## Origin

```bash
websocat -H "Origin: https://attacker.example" "wss://example.com/ws"
```

## Mensajes ejemplo

```json
{"action":"subscribe","channel":"user:123"}
```

Probar IDOR:

```json
{"action":"subscribe","channel":"user:456"}
```

Acción sensible:

```json
{"action":"delete","documentId":"123"}
```

## Evidencia mínima

```text
WebSocket URL:
Auth usada:
Mensaje legítimo:
Mensaje modificado:
Response/evento:
Impacto:
```

## Falsos positivos

- Conecta pero no permite acciones.
- El canal existe pero no devuelve datos.
- Origin no se valida porque no usa cookies ni sesión navegador.
- Mensaje aceptado pero ignorado.

## Mitigación

- Autenticar handshake.
- Validar autorización por mensaje.
- Validar Origin si usa cookies.
- Rate limiting.
- Esquemas estrictos de mensajes.
- No confiar en `channel/userId` enviado por cliente.