# WPA / WPA2 / WPA3

> Resumen práctico de cifrados y qué técnicas aplican.

## Tabla rápida

| Seguridad | Técnica habitual | Nota |
|---|---|---|
| Open | Rogue AP / sniffing | Sin cifrado |
| WEP | Ataques legacy | Obsoleto |
| WPA/WPA2-PSK | Handshake / PMKID / cracking offline | Depende de passphrase |
| WPA/WPA2-Enterprise | EAP/RADIUS | Depende de configuración y certificados |
| WPA3-SAE | Más resistente a cracking offline | Revisar downgrade/transition mode |
| WPS | PIN / Pixie Dust | Deshabilitar si no se necesita |

---

## WPA/WPA2-Personal

Usa una passphrase compartida.

Técnicas habituales:

- captura de handshake;
- PMKID;
- cracking offline;
- evaluación de WPS;
- Evil Twin en laboratorio.

Riesgo principal:

```text
Contraseña débil o reutilizada.
```

---

## 4-way handshake

```text
Cliente ↔ AP
  ↓
Intercambio EAPOL
  ↓
Material verificable offline si se captura correctamente
```

No contiene la contraseña en claro, pero permite probar candidatos offline.

---

## PMKID

En algunos APs se puede obtener material atacable sin esperar a un cliente conectado.

```text
AP expone PMKID → convertir → cracking offline
```

No aplica siempre.

---

## WPA/WPA2-Enterprise

Usa autenticación 802.1X/EAP normalmente con RADIUS.

Revisar:

- validación de certificado;
- métodos EAP;
- credenciales;
- configuración de clientes;
- posibilidad de Evil Twin en laboratorio;
- exposición de identidades.

---

## WPA3-SAE

Mejora la resistencia frente a ataques offline tradicionales.

Revisar:

- modo transition WPA2/WPA3;
- clientes legacy;
- PMF;
- downgrade;
- configuración real del AP;
- compatibilidad de dispositivos.

---

## WPS

WPS puede debilitar una red aunque WPA2 use buena contraseña.

Riesgo:

```text
PIN débil / Pixie Dust / implementación vulnerable
```

Mitigación:

```text
Deshabilitar WPS.
```

---

## Qué reportar

```text
Cifrado:
Modo:
WPS:
Clientes:
Técnica aplicable:
Resultado:
Riesgo:
```

---

## Nota rápida

```text
En WPA/WPA2-Personal, el punto débil suele ser la passphrase. En WPA-Enterprise, suele ser la validación de certificados y la configuración de EAP.
```