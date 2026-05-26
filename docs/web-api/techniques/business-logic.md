# Business Logic

## Objetivo

Identificar fallos en la lógica de negocio de una aplicación.

A diferencia de una vulnerabilidad puramente técnica, una vulnerabilidad de lógica de negocio aparece cuando la aplicación permite realizar acciones válidas desde el punto de vista técnico, pero incorrectas desde el punto de vista funcional.

## Idea clave

```text
La aplicación funciona, pero permite usar el flujo de forma no prevista.
```

## Dónde buscar

- Procesos de compra.
- Carritos.
- Cupones.
- Descuentos.
- Cambios de estado.
- Reservas.
- Límites de uso.
- Transferencias.
- Puntos o créditos.
- Reembolsos.
- Suscripciones.
- Registro.
- Invitaciones.
- Flujos multi-paso.
- Procesos que dependen de validación previa.

## Preguntas clave

- ¿Puedo saltarme pasos?
- ¿Puedo repetir una acción más veces de las permitidas?
- ¿Puedo modificar importes?
- ¿Puedo usar valores negativos?
- ¿Puedo reutilizar un cupón?
- ¿Puedo cambiar el estado de un objeto manualmente?
- ¿Puedo cancelar después de recibir un beneficio?
- ¿Puedo modificar datos que deberían ser calculados por el servidor?
- ¿Puedo hacer una acción en distinto orden?
- ¿Puedo aprovechar una condición de carrera?

## Flujo de prueba

```text
1. Entender el proceso normal.
2. Identificar reglas de negocio.
3. Capturar requests.
4. Modificar valores relevantes.
5. Cambiar el orden de los pasos.
6. Repetir acciones.
7. Confirmar impacto.
8. Documentar secuencia exacta.
```

## Metodología

### 1. Ejecutar flujo legítimo

Ejemplo:

```text
Añadir producto → Aplicar cupón → Pagar → Recibir confirmación
```

### 2. Identificar valores importantes

- Precio.
- Cantidad.
- Descuento.
- Estado.
- Usuario.
- Límite.
- Tipo de operación.
- Moneda.
- Identificador.
- Fecha.
- Rol.
- Flag booleano.

### 3. Manipular requests

Ejemplo:

```json
{
  "productId": 100,
  "quantity": 1,
  "price": 49.99,
  "discount": 10
}
```

Pruebas:

```json
{
  "productId": 100,
  "quantity": -1,
  "price": 0,
  "discount": 100
}
```

### 4. Cambiar orden

```text
Flujo esperado:
A → B → C → D

Prueba:
A → C → D
A → B → D
B → C → D
```

### 5. Repetir acciones

Probar:

- reutilizar cupones;
- repetir reembolsos;
- reenviar confirmaciones;
- repetir operaciones;
- doble submit;
- múltiples pestañas;
- condiciones de carrera.

## Casos típicos

### Valores negativos

Ejemplo:

```json
{
  "amount": -100
}
```

Impacto posible:

- saldo incrementado;
- descuento incorrecto;
- operación inversa;
- validación de negocio ausente.

### Precio controlado por cliente

Ejemplo:

```json
{
  "productId": 10,
  "price": 1.00
}
```

Impacto:

- compra a precio inferior;
- manipulación de factura;
- abuso de descuentos.

### Reutilización de cupón

```text
1. Aplicar cupón.
2. Completar compra.
3. Repetir compra con mismo cupón.
4. Comprobar si se aplica de nuevo.
```

### Cambio de estado

Ejemplo:

```json
{
  "orderId": 123,
  "status": "approved"
}
```

Impacto:

- aprobación no autorizada;
- omisión de revisión;
- modificación de flujo interno.

### Saltar pasos

```text
1. Iniciar proceso.
2. Capturar request final.
3. Repetir request final sin completar pasos previos.
```

### Condición de carrera

Ejemplo:

```text
Enviar varias veces la misma operación de forma simultánea.
```

Impacto:

- doble gasto;
- doble reembolso;
- múltiples reservas;
- uso repetido de un recurso limitado.

## Evidencia mínima

- Descripción del flujo esperado.
- Secuencia de pasos realizada.
- Request original.
- Request modificada.
- Resultado obtenido.
- Estado antes y después.
- Impacto real.
- Captura si ayuda a entender negocio.

## Falsos positivos

No reportar como lógica de negocio si:

- el comportamiento está permitido por reglas funcionales;
- no hay impacto;
- el cambio no se persiste;
- solo ocurre en frontend;
- se trata de un error visual;
- no se puede reproducir;
- falta entender el flujo legítimo.

## Impacto

Puede permitir:

- fraude;
- manipulación de precios;
- abuso de descuentos;
- alteración de estados;
- uso indebido de recursos;
- bypass de controles;
- acceso a beneficios no autorizados;
- impacto económico directo.

## Recomendaciones

- Validar reglas de negocio en backend.
- No confiar en valores enviados por cliente.
- Calcular precios y descuentos en servidor.
- Validar transiciones de estado.
- Hacer operaciones críticas idempotentes.
- Controlar concurrencia.
- Aplicar límites de uso.
- Registrar acciones sensibles.
- Revisar flujos multi-paso.
- Usar pruebas unitarias y de integración sobre reglas de negocio.

## Plantilla de reporte

```markdown
## Descripción

Se ha identificado un fallo de lógica de negocio en el flujo de `[FLUJO]`, que permite `[ACCIÓN NO PREVISTA]` mediante `[MANIPULACIÓN O SECUENCIA]`.

## Impacto

Un usuario podría abusar del flujo para `[IMPACTO]`, afectando a la integridad del proceso y pudiendo generar consecuencias económicas u operativas.

## Recomendación

Se recomienda validar las reglas de negocio en el backend, impedir que el cliente controle valores críticos y asegurar que las transiciones de estado solo puedan realizarse cuando se cumplan las condiciones esperadas.
```

## Nota rápida

```text
En lógica de negocio, el payload importa menos que entender qué regla funcional se está rompiendo.
```