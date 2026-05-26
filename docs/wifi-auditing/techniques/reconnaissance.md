# Reconnaissance

> Técnica: identificar redes, canales, cifrado, BSSID, clientes conectados y superficie inalámbrica autorizada.

!!! warning "Uso autorizado"
    Ejecutar únicamente sobre redes propias, laboratorios o auditorías con autorización explícita.

---

## Cuándo usar

- Inicio de una auditoría WiFi.
- Necesitas identificar SSID, BSSID, canal y cifrado.
- Necesitas confirmar si hay clientes conectados.
- Quieres preparar captura de handshake, PMKID, WPS o Evil Twin.
- Necesitas evidencias iniciales del entorno.

---

## Variables

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

## Preparar interfaz

### Ver interfaces

```bash
ip link
iw dev
iwconfig
```

### Revisar procesos conflictivos

```bash
sudo airmon-ng check
```

### Detener procesos conflictivos

```bash
sudo airmon-ng check kill
```

### Activar modo monitor

```bash
sudo airmon-ng start "$IFACE"
```

### Comprobar modo monitor

```bash
iw dev
```

---

## Escaneo general

```bash
sudo airodump-ng "$MON_IFACE"
```

Guardar salida:

```bash
sudo airodump-ng "$MON_IFACE" \
  --write "$OUTDIR/recon-general"
```

---

## Escaneo sobre objetivo concreto

```bash
sudo airodump-ng \
  --bssid "$BSSID" \
  --channel "$CHANNEL" \
  --write "$OUTDIR/recon-target" \
  "$MON_IFACE"
```

---

## Qué buscar

| Campo | Uso |
|---|---|
| `BSSID` | Identificador del punto de acceso |
| `ESSID` | Nombre de red |
| `CH` | Canal |
| `ENC` | Cifrado: OPN, WEP, WPA, WPA2, WPA3 |
| `AUTH` | PSK, MGT, SAE |
| `PWR` | Potencia de señal |
| `STATION` | Cliente conectado |
| `Probe` | Redes buscadas por clientes |

---

## Identificar clientes conectados

En `airodump-ng`, revisar la parte inferior:

```text
BSSID              STATION            PWR   Rate    Lost    Frames  Notes
AA:BB:CC:DD:EE:FF  11:22:33:44:55:66  -40   0-1      0       120
```

Un cliente conectado permite técnicas como captura de handshake.

---

## Guardar evidencia de entorno

```bash
{
  echo "Date: $(date)"
  echo "Interface: $IFACE"
  echo "Monitor interface: $MON_IFACE"
  echo "ESSID: $ESSID"
  echo "BSSID: $BSSID"
  echo "Channel: $CHANNEL"
  iw dev
} | tee "$OUTDIR/environment.txt"
```

---

## Usando Airgeddon

```bash
sudo bash airgeddon.sh
```

Flujo recomendado:

```text
1. Seleccionar interfaz
2. Activar modo monitor
3. Escanear objetivos
4. Seleccionar red autorizada
5. Anotar ESSID, BSSID, canal y cifrado
```

---

## Evidencia mínima

```text
SSID:
BSSID:
Canal:
Cifrado:
Clientes conectados:
Herramienta:
Fichero generado:
Fecha:
Notas:
```

---

## Falsos positivos / errores comunes

- Confundir SSID con BSSID.
- Atacar un AP vecino con el mismo nombre.
- No fijar canal antes de capturar.
- No confirmar que el objetivo está dentro del alcance.
- Confundir red WPA2-Personal con WPA2-Enterprise.
- Usar mala antena o adaptador sin monitor mode.

---

## Cierre

Parar modo monitor:

```bash
sudo airmon-ng stop "$MON_IFACE"
sudo systemctl restart NetworkManager
```