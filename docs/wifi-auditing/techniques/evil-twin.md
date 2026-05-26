# Evil Twin

> Técnica: crear un AP falso en laboratorio para validar exposición de clientes a redes suplantadas.

!!! warning "Uso autorizado"
    Ejecutar únicamente en laboratorio controlado, red propia o auditoría con autorización explícita.  
    No usar para capturar credenciales de terceros.

---

## Cuándo usar

- Evaluación de concienciación o exposición de clientes.
- Laboratorio de ataques de suplantación WiFi.
- Validar si dispositivos se conectan a APs falsos.
- Evaluar protección frente a redes abiertas o SSID duplicados.
- Probar detección defensiva.

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

## Flujo conceptual

```text
1. Identificar SSID autorizado
2. Crear AP falso con mismo ESSID
3. Aislar laboratorio
4. Observar comportamiento de clientes autorizados
5. Registrar conexión / no conexión
6. Validar controles defensivos
```

---

## Usando Airgeddon

Flujo típico:

```text
1. Seleccionar interfaz
2. Activar modo monitor
3. Seleccionar objetivo autorizado
4. Elegir Evil Twin
5. Configurar AP falso en laboratorio
6. Definir si se usará portal de prueba
7. Ejecutar
8. Guardar evidencias
```

!!! danger "Límite"
    No incluir credenciales reales en evidencias públicas.  
    En laboratorios, usar usuarios y contraseñas ficticias.

---

## Señales a observar

| Señal | Interpretación |
|---|---|
| Cliente se conecta al AP falso | Riesgo de suplantación |
| Cliente rechaza AP | Mejor postura defensiva |
| Usuario introduce datos ficticios | Riesgo de phishing WiFi |
| Dispositivo prioriza red conocida | Riesgo si SSID no está protegido |
| Detección del ataque | Control defensivo presente |

---

## Evidencia mínima

```text
SSID:
BSSID original:
Canal:
AP falso:
Cliente de prueba:
Resultado:
Credenciales ficticias: <redacted>
Capturas sanitizadas:
Impacto:
```

---

## Qué NO publicar

```text
Credenciales reales
Capturas de usuarios reales
BSSID real
MACs reales de clientes
Portales clonados de terceros
Datos personales
```

---

## Falsos positivos / errores comunes

- El cliente se conecta porque era un laboratorio sin controles.
- SSID abierto no representa red corporativa real.
- Dispositivo de prueba tenía configuración insegura.
- No se distingue entre conexión automática y conexión manual.
- No se valida si el usuario introduce datos.
- Se reporta como compromiso sin impacto real.

---

## Mitigación

- Usar WPA2/WPA3-Enterprise cuando aplique.
- Deshabilitar auto-join en redes no confiables.
- Educar usuarios sobre portales cautivos.
- Usar certificados en redes corporativas.
- Validar nombre y certificado del servidor RADIUS.
- Monitorizar rogue APs.
- Usar WIDS/WIPS.