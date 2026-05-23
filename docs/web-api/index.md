# Web & API Security

## Objetivo

Esta sección recoge notas prácticas sobre seguridad web y APIs para auditorías, laboratorios, CTFs y preparación de certificaciones.

El objetivo no es almacenar writeups completos, sino disponer de una guía rápida para consultar:

- qué revisar;
- cómo enumerar;
- qué hipótesis plantear;
- cómo probar vulnerabilidades;
- qué evidencias guardar;
- cómo reportar los hallazgos.

## Flujo general

```text
Reconocimiento → Enumeración → Autenticación → Autorización → Lógica de negocio → Evidencia → Reporting
```

## Áreas principales

<div class="grid cards" markdown>

-   🔎 **Enumeración**

    ---

    Identificación de tecnologías, rutas, endpoints, parámetros, roles, ficheros JavaScript y documentación expuesta.

    [Abrir →](enumeracion.md)

-   🔐 **Autenticación**

    ---

    Login, logout, registro, recuperación de contraseña, MFA, sesiones, tokens y enumeración de usuarios.

    [Abrir →](autenticacion.md)

-   🧱 **Autorización e IDOR**

    ---

    Acceso horizontal, acceso vertical, modificación de identificadores, control de permisos y endpoints expuestos.

    [Abrir →](autorizacion-idor.md)

-   🔌 **API Testing**

    ---

    Métodos HTTP, validación server-side, mass assignment, errores, versionado, rate limiting y autorización por objeto.

    [Abrir →](api-testing.md)

-   🧠 **Business Logic**

    ---

    Manipulación de flujos, precios, estados, límites, transacciones, condiciones y procesos multi-paso.

    [Abrir →](business-logic.md)

-   📝 **Reporting**

    ---

    Cómo transformar pruebas técnicas en vulnerabilidades claras, reproducibles y con impacto.

    [Abrir →](../reporting/plantilla-vulnerabilidad.md)

</div>

## Checklist rápido

### Antes de probar

- [ ] Confirmar alcance.
- [ ] Identificar dominios y subdominios autorizados.
- [ ] Identificar roles de usuario disponibles.
- [ ] Preparar Burp Suite.
- [ ] Crear usuarios de prueba si aplica.
- [ ] Separar evidencias por funcionalidad.
- [ ] No realizar pruebas destructivas.

### Durante la prueba

- [ ] Guardar requests relevantes.
- [ ] Comparar usuario A contra usuario B.
- [ ] Probar frontend vs backend.
- [ ] Modificar parámetros controlados por cliente.
- [ ] Revisar respuestas de error.
- [ ] Confirmar impacto real.
- [ ] Documentar pasos mínimos reproducibles.

### Al reportar

- [ ] Describir causa raíz.
- [ ] Explicar impacto.
- [ ] Incluir evidencia mínima.
- [ ] Evitar ruido técnico innecesario.
- [ ] Proponer mitigaciones concretas.
- [ ] Indicar severidad y confianza.

## Vulnerabilidades frecuentes

| Vulnerabilidad | Dónde buscar | Evidencia mínima |
|---|---|---|
| Broken Access Control | Endpoints autenticados, objetos de otros usuarios | Request/response comparando usuarios |
| IDOR | Parámetros numéricos, UUIDs, referencias a objetos | Acceso a objeto no autorizado |
| User Enumeration | Login, registro, reset password | Respuestas distintas |
| Mass Assignment | APIs JSON con objetos completos | Campo añadido/modificado aceptado |
| Business Logic Flaw | Flujos multi-paso, pagos, límites | Secuencia reproducible |
| Information Disclosure | Errores, cabeceras, logs, responses | Dato sensible o interno expuesto |
| Rate Limit Missing | Login, OTP, búsqueda, APIs caras | Repetición sin bloqueo |
| Input Validation | Parámetros, formularios, JSON, uploads | Backend acepta valor inválido |

## Principio de trabajo

```text
No asumir vulnerabilidad → Formular hipótesis → Probar de forma controlada → Confirmar impacto → Documentar
```

## Relacionado

- [Metodología](metodologia.md)
- [Enumeración](enumeracion.md)
- [Autorización e IDOR](autorizacion-idor.md)
- [API Testing](api-testing.md)
- [Plantilla de vulnerabilidad](../reporting/plantilla-vulnerabilidad.md)