# Airgeddon

> Herramienta principal para auditoría WiFi en Linux.

Airgeddon es una herramienta en Bash para Linux orientada a auditoría inalámbrica. En esta guía se usa como lanzador práctico para técnicas habituales de laboratorio: reconocimiento, captura, PMKID, WPS, Evil Twin y cracking offline.

!!! warning "Uso autorizado"
    Usar Airgeddon únicamente sobre redes propias, laboratorios o auditorías con permiso explícito.

---

## Instalación

```bash
git clone https://github.com/v1s1t0r1sh3r3/airgeddon.git
cd airgeddon
```

Ejecutar:

```bash
sudo bash airgeddon.sh
```

---

## Requisitos prácticos

Antes de usarlo:

```bash
sudo apt update
sudo apt install aircrack-ng hashcat hcxtools hcxdumptool bully reaver pixiewps -y
```

Comprobar adaptador:

```bash
iw dev
```

Comprobar modo monitor:

```bash
sudo airmon-ng start wlan0
iw dev
```

---

## Flujo recomendado en Airgeddon

```text
1. Seleccionar interfaz WiFi
2. Activar modo monitor
3. Escanear redes
4. Seleccionar objetivo autorizado
5. Elegir técnica
6. Guardar capturas
7. Validar resultado
8. Sanitizar evidencias
```

---

## Técnicas habituales

| Técnica | Uso |
|---|---|
| Reconocimiento | Identificar redes, canales, clientes |
| Handshake capture | Capturar autenticación WPA/WPA2 para cracking offline |
| PMKID | Captura alternativa sin cliente conectado en algunos escenarios |
| WPS | Revisar debilidades de WPS si está activo |
| Evil Twin | Validar exposición a AP falso en laboratorio |
| Cracking | Probar fortaleza de contraseña offline |

---

## Evidencias a guardar

```text
Fecha:
Interfaz:
Modo monitor:
SSID:
BSSID:
Canal:
Técnica:
Fichero generado:
Resultado:
Notas:
```

---

## Buenas prácticas

- Crear carpeta por auditoría.
- No mezclar capturas de varios objetivos.
- No publicar `.cap`, `.hc22000` ni credenciales.
- No probar deauth si no está permitido.
- Validar siempre el BSSID.
- Documentar canal, cifrado y técnica usada.

---

## Sanitización

Ejemplo público:

```text
SSID: LAB_WIFI
BSSID: AA:BB:CC:DD:EE:FF
Channel: 6
Capture: handshake.cap <private>
Result: password recovered in lab <redacted>
```

---

## Troubleshooting

### No aparece interfaz

```bash
ip link
iw dev
```

### Modo monitor falla

```bash
sudo airmon-ng check kill
sudo airmon-ng start wlan0
```

### NetworkManager no vuelve

```bash
sudo systemctl restart NetworkManager
```

### Hashcat no usa GPU

```bash
hashcat -I
```