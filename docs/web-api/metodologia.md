# Metodología Web & API Security

## Objetivo

Definir un flujo repetible para auditar aplicaciones web y APIs de forma ordenada, evitando saltar directamente a payloads sin entender antes la arquitectura, los roles y las reglas de negocio.

## Flujo base

```text
1. Alcance
2. Reconocimiento
3. Enumeración
4. Autenticación
5. Autorización
6. Validación de entradas
7. Lógica de negocio
8. Evidencia
9. Reporting
```

## 1. Alcance

Antes de probar:

- [ ] Qué dominios están incluidos.
- [ ] Qué APIs están incluidas.
- [ ] Qué usuarios/roles se pueden usar.
- [ ] Qué pruebas están prohibidas.
- [ ] Si se permite fuerza bruta.
- [ ] Si se permite fuzzing.
- [ ] Si se permite explotación controlada.
- [ ] Ventanas horarias.
- [ ] Contacto en caso de incidente.

## 2. Reconocimiento

Buscar:

- tecnologías;
- frameworks;
- servidores;
- endpoints;
- rutas ocultas;
- documentación API;
- ficheros JavaScript;
- subdominios;
- cabeceras HTTP;
- cookies;
- errores.

## 3. Enumeración funcional

Mapear:

| Elemento | Pregunta |
|---|---|
| Usuarios | ¿Qué roles existen? |
| Objetos | ¿Qué recursos maneja la aplicación? |
| Acciones | ¿Qué puede hacer cada rol? |
| Estados | ¿Qué estados puede tener cada objeto? |
| Flujos | ¿Hay pasos que dependan de validación previa? |
| APIs | ¿Qué endpoints procesan acciones críticas? |

## 4. Hipótesis

Cada sospecha debe formularse como hipótesis.

Ejemplo:

```text
H1: Puede existir IDOR si el parámetro accountId identifica cuentas de usuario y el backend no valida la propiedad del recurso.
```

Tabla recomendada:

| ID | Hipótesis | Evidencia inicial | Prueba propuesta | Estado |
|---|---|---|---|---|
| H1 | | | | Pendiente |
| H2 | | | | Pendiente |

## 5. Prueba controlada

Para cada prueba documentar:

- objetivo;
- request original;
- modificación realizada;
- resultado esperado;
- resultado obtenido;
- interpretación;
- evidencia;
- siguiente paso.

## 6. Evidencia

Guardar siempre:

- request completo;
- response completo;
- usuario utilizado;
- rol;
- endpoint;
- timestamp;
- captura si aporta contexto;
- diferencia entre comportamiento esperado y obtenido;
- impacto demostrado.

## 7. Reporting

Una vulnerabilidad debe responder a:

```text
Qué falla → Dónde falla → Por qué falla → Qué impacto tiene → Cómo se reproduce → Cómo se corrige
```

## Errores comunes

- Probar payloads sin entender el flujo.
- No comparar roles.
- No probar acceso horizontal.
- No probar acceso vertical.
- Confiar en las restricciones del frontend.
- No revisar APIs llamadas por JavaScript.
- No guardar evidencias del primer resultado válido.
- No demostrar impacto real.

## Checklist final

- [ ] Alcance revisado.
- [ ] Roles identificados.
- [ ] Endpoints críticos identificados.
- [ ] Pruebas de autenticación realizadas.
- [ ] Pruebas de autorización realizadas.
- [ ] Validación server-side comprobada.
- [ ] Lógica de negocio revisada.
- [ ] Evidencias guardadas.
- [ ] Hallazgos redactados.