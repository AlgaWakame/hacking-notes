# Enumeración Web & API

## Objetivo

Identificar la superficie de ataque de una aplicación web o API antes de probar vulnerabilidades concretas.

## Qué buscar

- Tecnologías.
- Frameworks.
- Endpoints.
- Parámetros.
- Roles.
- Cookies.
- Tokens.
- Ficheros JavaScript.
- Documentación API.
- Mensajes de error.
- Recursos estáticos.
- Versiones.
- Subdominios.

## Checklist web

- [ ] Revisar página principal.
- [ ] Revisar robots.txt.
- [ ] Revisar sitemap.xml.
- [ ] Revisar cabeceras HTTP.
- [ ] Revisar cookies.
- [ ] Revisar tecnologías con navegador/Burp.
- [ ] Revisar formularios.
- [ ] Revisar enlaces.
- [ ] Revisar rutas no autenticadas.
- [ ] Revisar rutas autenticadas.
- [ ] Revisar ficheros JavaScript.
- [ ] Buscar endpoints en JS.
- [ ] Revisar mensajes de error.

## Checklist API

- [ ] Identificar base URL.
- [ ] Identificar versión de API.
- [ ] Identificar endpoints.
- [ ] Identificar métodos HTTP.
- [ ] Revisar parámetros de ruta.
- [ ] Revisar query parameters.
- [ ] Revisar cuerpos JSON.
- [ ] Revisar headers.
- [ ] Revisar tokens.
- [ ] Revisar documentación Swagger/OpenAPI si existe.
- [ ] Revisar diferencias entre roles.
- [ ] Revisar errores.

## Comandos útiles

### Cabeceras

```bash
curl -i https://example.com
```

Buscar:

- servidor;
- tecnologías;
- cookies;
- cabeceras de seguridad;
- redirecciones;
- errores.

### Métodos HTTP

```bash
curl -i -X OPTIONS https://example.com/api/resource
```

### Endpoint básico

```bash
curl -i https://example.com/api/resource
```

### Con cabecera Authorization

```bash
curl -i https://example.com/api/resource \
  -H "Authorization: Bearer TOKEN"
```

## Enumeración desde JavaScript

Buscar en ficheros JS:

```text
/api/
graphql
swagger
openapi
token
authorization
client_id
secret
internal
admin
debug
```

## Tabla de endpoints

| Método | Endpoint | Auth | Rol | Parámetros | Observaciones |
|---|---|---|---|---|---|
| GET | /api/users/me | Sí | user | - | Perfil propio |
| GET | /api/users/{id} | Sí | user | id | Revisar IDOR |
| POST | /api/orders | Sí | user | body JSON | Revisar lógica |

## Señales interesantes

- IDs numéricos.
- UUIDs expuestos.
- Parámetros `userId`, `accountId`, `customerId`.
- Endpoints `/admin`.
- Endpoints antiguos `/v1`.
- Errores 500 con stack trace.
- Diferencias 403/404/200.
- Campos ocultos en JSON.
- Funciones no visibles en frontend.

## Evidencia a guardar

- Lista de endpoints.
- Requests interesantes.
- Responses con errores.
- Parámetros controlables.
- Roles usados.
- Diferencias entre usuarios.

## Nota rápida

```text
La enumeración no termina al encontrar el primer fallo. Muchas vulnerabilidades web/API aparecen al comparar roles, estados y objetos.
```