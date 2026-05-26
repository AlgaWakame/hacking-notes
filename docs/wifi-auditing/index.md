# WiFi Auditing

> Guía rápida para refrescar técnicas, herramientas y comandos de auditoría inalámbrica.

Esta sección está orientada a consulta práctica durante laboratorios, CTFs, entornos propios o auditorías autorizadas.

No pretende explicar desde cero todos los conceptos de redes WiFi. La parte teórica queda separada en `Theory`.

!!! warning "Uso autorizado"
    Ejecutar estas técnicas únicamente sobre redes propias, laboratorios o auditorías con autorización explícita.

---

## Acceso rápido

<div class="grid cards" markdown>

-   ⚡ **Quick Reference**

    ---

    Comandos rápidos para preparar interfaz, modo monitor, descubrimiento, captura y evidencias.

    [Abrir →](quick-reference.md)

-   🛠️ **Airgeddon**

    ---

    Uso práctico de Airgeddon como herramienta principal para auditoría WiFi en Linux.

    [Abrir →](tools/airgeddon.md)

-   🧪 **Techniques**

    ---

    Reconocimiento, handshake capture, PMKID, WPS, Evil Twin y cracking en laboratorio.

    [Abrir →](techniques/reconnaissance.md)

-   🧠 **Theory**

    ---

    Conceptos mínimos: 802.11, WPA/WPA2/WPA3, adaptadores, modo monitor y chipsets.

    [Abrir →](theory/80211-basics.md)

</div>

---

## Flujo práctico

```text
Adaptador → Modo monitor → Reconocimiento → Objetivo → Captura → Validación → Cracking → Evidencia
```

---

## Técnicas principales

| Técnica | Ir a |
|---|---|
| Reconocimiento WiFi | [Reconnaissance](techniques/reconnaissance.md) |
| Captura de handshake WPA/WPA2 | [Handshake Capture](techniques/handshake-capture.md) |
| PMKID | [PMKID](techniques/pmkid.md) |
| WPS | [WPS](techniques/wps.md) |
| Evil Twin | [Evil Twin](techniques/evil-twin.md) |
| Cracking offline | [Cracking](techniques/cracking.md) |
| Airgeddon | [Airgeddon](tools/airgeddon.md) |

---

## Variables base

```bash
export IFACE="wlan0"
export MON_IFACE="wlan0mon"
export ESSID="LAB_WIFI"
export BSSID="AA:BB:CC:DD:EE:FF"
export CHANNEL="6"
export OUTDIR="$PWD/evidence"
mkdir -p "$OUTDIR"
```

---

## Evidencia mínima

```text
SSID:
BSSID:
Canal:
Cifrado:
Herramienta:
Técnica:
Comando / menú usado:
Fichero generado:
Resultado:
Impacto:
```

---

## Sanitización

No publicar:

```text
BSSID real
SSID de cliente
capturas .cap reales
hashes completos
contraseñas recuperadas
ubicaciones reales
capturas con datos de terceros
```

Usar ejemplos:

```text
SSID: LAB_WIFI
BSSID: AA:BB:CC:DD:EE:FF
Password: <redacted>
Capture: handshake.cap <private>
```