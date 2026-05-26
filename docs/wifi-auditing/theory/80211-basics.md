# 802.11 Basics

> Conceptos mínimos para entender auditorías WiFi.

## Qué necesito recordar

```text
SSID identifica la red.
BSSID identifica el punto de acceso.
El canal determina dónde escuchar.
El cliente es la estación asociada.
El modo monitor permite capturar tramas 802.11.
```

---

## Componentes

| Término | Significado |
|---|---|
| SSID | Nombre de la red WiFi |
| BSSID | MAC del punto de acceso |
| ESSID | Nombre lógico de la red |
| STA | Cliente WiFi |
| AP | Punto de acceso |
| Channel | Frecuencia usada |
| Beacon | Trama que anuncia la red |
| Probe Request | Cliente buscando redes |
| Probe Response | AP respondiendo a búsqueda |
| Deauthentication | Trama para desconectar cliente |

---

## Modo managed vs monitor

### Managed

Uso normal para conectarse a una red.

```text
Cliente → AP → Red
```

### Monitor

Permite capturar tramas inalámbricas sin estar asociado.

```text
Adaptador escucha tráfico 802.11 en el aire
```

Activar:

```bash
sudo airmon-ng start wlan0
```

---

## Canales

Para capturar bien, el adaptador debe estar en el canal correcto:

```bash
sudo iwconfig wlan0mon channel 6
```

Si el canal es incorrecto, puedes perder:

- beacons;
- handshakes;
- clientes;
- PMKID;
- tráfico relevante.

---

## Tramas útiles

| Trama | Relevancia |
|---|---|
| Beacon | Identifica AP y capacidades |
| Probe Request | Redes buscadas por cliente |
| Authentication | Inicio de autenticación |
| Association | Asociación cliente-AP |
| EAPOL | Parte del handshake WPA/WPA2 |
| Deauthentication | Desconexión cliente |

---

## Señales en airodump-ng

```text
BSSID              PWR  Beacons  #Data  CH  ENC   CIPHER  AUTH  ESSID
AA:BB:CC:DD:EE:FF  -42  100      500    6   WPA2  CCMP    PSK   LAB_WIFI
```

Interpretación:

| Campo | Significado |
|---|---|
| PWR | Potencia |
| Beacons | Anuncios del AP |
| #Data | Tráfico observado |
| CH | Canal |
| ENC | Cifrado |
| CIPHER | Algoritmo |
| AUTH | Tipo de autenticación |
| ESSID | Nombre |

---

## Nota rápida

```text
Antes de cualquier técnica WiFi, confirma BSSID, canal, cifrado y clientes. La mayoría de errores vienen de capturar el objetivo incorrecto o el canal equivocado.
```