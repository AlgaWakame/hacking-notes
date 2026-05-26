# SOAP & XML

> Notas rápidas para revisar APIs XML/SOAP.

## Cuándo mirar

- Endpoints `.asmx`, `.svc`, `/soap`, `/ws`.
- Content-Type `text/xml` o `application/soap+xml`.
- WSDL expuesto.
- Integraciones legacy.

## Rutas comunes

```text
/service?wsdl
/wsdl
/soap
/api/soap
/service.asmx?WSDL
/service.svc?wsdl
```

## Descubrir WSDL

```bash
curl -i "$BASE_URL/service?wsdl"
```

```bash
curl -s "$BASE_URL/service?wsdl" | xmllint --format -
```

## Request SOAP básica

```bash
curl -i -X POST "$BASE_URL/service" \
  -H "Content-Type: text/xml; charset=utf-8" \
  --data-binary @request.xml
```

## XXE test seguro

Usar solo en entorno autorizado y controlado.

```xml
<?xml version="1.0"?>
<!DOCTYPE test [
  <!ENTITY xxe SYSTEM "file:///etc/hostname">
]>
<root>&xxe;</root>
```

## Entity expansion

```xml
<?xml version="1.0"?>
<!DOCTYPE lolz [
 <!ENTITY lol "lol">
 <!ENTITY lol1 "&lol;&lol;&lol;&lol;">
]>
<root>&lol1;</root>
```

## Qué revisar

- WSDL público.
- Operaciones sensibles.
- Autorización por operación.
- XXE.
- Errores verbosos.
- SOAPAction.
- Tipos XML inesperados.
- Campos opcionales.
- Parámetros duplicados.
- Tamaño de XML.

## SOAPAction

```bash
curl -i -X POST "$BASE_URL/service" \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: \"GetUser\"" \
  --data-binary @request.xml
```

## Evidencia mínima

```text
Endpoint:
WSDL:
Operación:
Request:
Response:
Impacto:
```

## Falsos positivos

- WSDL público sin operaciones sensibles.
- Parser bloquea entidades externas.
- Error XML sin impacto.
- SOAPAction no permite invocar operaciones no autorizadas.

## Mitigación

- Deshabilitar DTD/entidades externas.
- Proteger WSDL si no debe ser público.
- Validar autorización por operación.
- Limitar tamaño XML.
- Usar errores genéricos.
- Validar esquemas.