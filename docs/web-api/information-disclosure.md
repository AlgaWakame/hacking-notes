# Information Disclosure

## Objetivo

Identificar exposición innecesaria de información sensible, interna o útil para un atacante.

No toda exposición de información tiene la misma severidad. La importancia depende del tipo de dato, contexto, facilidad de explotación e impacto posterior.

## Tipos de información expuesta

- Datos personales.
- Emails.
- Teléfonos.
- Documentos.
- Tokens.
- Credenciales.
- Rutas internas.
- Stack traces.
- Versiones.
- Cabeceras.
- Errores.
- Comentarios en HTML.
- Endpoints internos.
- Datos de otros usuarios.
- Información de infraestructura.
- Ficheros de configuración.
- Backups.
- Logs.

## Dónde buscar

- Respuestas HTTP.
- Errores 500.
- Cabeceras.
- HTML.
- JavaScript.
- APIs.
- Archivos estáticos.
- Documentación.
- Repositorios.
- Buckets.
- Parámetros debug.
- Ficheros temporales.
- Rutas antiguas.
- Formularios.
- Descargas.

## Checklist

- [ ] Revisar cabeceras HTTP.
- [ ] Revisar errores.
- [ ] Revisar responses JSON.
- [ ] Revisar HTML.
- [ ] Revisar comentarios.
- [ ] Revisar JavaScript.
- [ ] Revisar ficheros `.env`, `.bak`, `.old`, `.zip`.
- [ ] Revisar documentación expuesta.
- [ ] Revisar endpoints debug.
- [ ] Revisar datos de otros usuarios.
- [ ] Revisar metadatos en ficheros.
- [ ] Revisar mensajes de validación.
- [ ] Confirmar impacto.

## Cabeceras interesantes

```http
Server: Apache/2.4.49
X-Powered-By: Express
X-AspNet-Version: 4.0.30319
X-Debug-Token: abc123
```

Pueden revelar:

- tecnología;
- versión;
- framework;
- entorno;
- configuración;
- rutas de debug.

## Errores verbosos

Ejemplo:

```text
Traceback (most recent call last):
  File "/app/internal/service.py", line 42
Database connection failed for user app_admin
```

Puede exponer:

- rutas internas;
- nombres de servicios;
- usuarios;
- tecnologías;
- estructura del proyecto;
- queries;
- secretos.

## Respuestas API excesivas

Ejemplo:

```json
{
  "id": 10,
  "name": "Alice",
  "email": "alice@example.com",
  "role": "user",
  "internalNotes": "VIP customer",
  "passwordHash": "$2b$...",
  "mfaSecret": "ABCDEF"
}
```

Preguntas:

- ¿Todos esos campos son necesarios?
- ¿El usuario tiene permiso para verlos?
- ¿Hay datos internos?
- ¿Hay secretos?
- ¿Hay datos de terceros?

## JavaScript

Buscar:

```text
/api/
admin
internal
debug
token
secret
client_id
graphql
swagger
staging
dev
```

Posibles hallazgos:

- endpoints ocultos;
- rutas administrativas;
- claves públicas;
- nombres de servicios;
- URLs internas;
- feature flags.

## Ficheros sensibles

Comprobar, dentro del alcance:

```text
/.env
/config.json
/backup.zip
/db.sql
/.git/config
/swagger.json
/openapi.json
/debug
/logs
```

## Datos personales

Revisar si se exponen:

- nombres;
- apellidos;
- email;
- teléfono;
- dirección;
- identificadores;
- documentos;
- información financiera;
- datos de salud;
- datos de menores;
- información laboral.

## Diferenciar severidad

| Tipo de dato | Severidad orientativa |
|---|---|
| Versión de servidor | Informativa / Baja |
| Ruta interna | Baja |
| Stack trace con rutas | Baja / Media |
| Emails de usuarios | Media |
| Datos personales completos | Media / Alta |
| Tokens o credenciales | Alta / Crítica |
| Datos financieros | Alta |
| Datos de otros usuarios autenticados | Media / Alta |
| Secretos cloud | Crítica |

La severidad depende del contexto y del impacto demostrable.

## Evidencia mínima

- URL o endpoint.
- Request.
- Response.
- Dato expuesto.
- Por qué es sensible.
- Usuario necesario para verlo.
- Impacto potencial.
- Captura si ayuda.
- Redacción sanitizada.

## Cuidado al documentar

No incluir secretos completos en el reporte si no es necesario.

Usar enmascarado:

```text
Token expuesto: eyJhbGciOi...<redacted>
Email: user***@example.com
API Key: sk_live_****abcd
```

## Impacto

Puede permitir:

- reconocimiento avanzado;
- enumeración de usuarios;
- exposición de datos personales;
- compromiso de cuentas;
- acceso a sistemas internos;
- abuso de tokens;
- explotación de versiones vulnerables;
- escalada hacia otros sistemas.

## Recomendaciones

- Eliminar datos innecesarios de responses.
- Aplicar mínimo privilegio.
- Filtrar campos sensibles.
- Desactivar errores verbosos en producción.
- Configurar cabeceras adecuadamente.
- Evitar exposición de documentación interna.
- Proteger endpoints debug.
- Revisar ficheros públicos.
- Rotar secretos expuestos.
- Aplicar controles de acceso.
- Registrar accesos a datos sensibles.

## Plantilla de reporte

```markdown
## Descripción

Se ha identificado exposición de información sensible en `[ENDPOINT/URL]`, donde la aplicación devuelve `[TIPO DE INFORMACIÓN]` que no debería ser accesible para el usuario o contexto actual.

## Impacto

La información expuesta podría facilitar reconocimiento, acceso no autorizado, compromiso de cuentas o exposición de datos personales, dependiendo de la naturaleza del dato.

## Recomendación

Se recomienda limitar la información devuelta por la aplicación, eliminar datos sensibles de responses, desactivar errores verbosos en producción y aplicar controles de acceso adecuados.
```

## Nota rápida

```text
La exposición de información no se valora solo por el dato aislado, sino por lo que permite hacer después.
```