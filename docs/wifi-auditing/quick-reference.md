# WiFi Quick Reference

> Snippets rápidos para preparar entorno, listar interfaces, activar modo monitor y guardar evidencias.

!!! warning "Uso autorizado"
    Ejecutar únicamente sobre redes propias, laboratorios o auditorías autorizadas.

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

## Identificar adaptadores

```bash
ip link
```

```bash
iw dev
```

```bash
iwconfig
```

---

## Procesos que pueden interferir

```bash
sudo airmon-ng check
```

```bash
sudo airmon-ng check kill
```

---

## Activar modo monitor

```bash
sudo airmon-ng start "$IFACE"
```

Comprobar:

```bash
iw dev
```

---

## Parar modo monitor

```bash
sudo airmon-ng stop "$MON_IFACE"
sudo systemctl restart NetworkManager
```

---

## Reconocimiento rápido

```bash
sudo airodump-ng "$MON_IFACE"
```

Fijar canal y BSSID:

```bash
sudo airodump-ng \
  --bssid "$BSSID" \
  --channel "$CHANNEL" \
  --write "$OUTDIR/capture" \
  "$MON_IFACE"
```

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

## Airgeddon

Clonar:

```bash
git clone https://github.com/v1s1t0r1sh3r3/airgeddon.git
cd airgeddon
```

Ejecutar:

```bash
sudo bash airgeddon.sh
```

---

## Hashcat WPA/WPA2

Ejemplo con hash WPA convertido:

```bash
hashcat -m 22000 hash.hc22000 wordlist.txt
```

Ver resultado:

```bash
hashcat -m 22000 hash.hc22000 --show
```
