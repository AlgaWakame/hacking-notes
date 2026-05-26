# Wireless Adapters

> Notas rápidas para elegir y validar adaptadores WiFi en auditorías.

## Qué necesita un adaptador

```text
[ ] Modo monitor
[ ] Packet injection
[ ] Soporte Linux/Kali
[ ] Chipset compatible
[ ] Buena antena
[ ] Estabilidad
[ ] Soporte 2.4 GHz / 5 GHz según objetivo
```

---

## Comprobar interfaces

```bash
ip link
iw dev
iwconfig
```

---

## Modo monitor

```bash
sudo airmon-ng start wlan0
```

Comprobar:

```bash
iw dev
```

Debe aparecer algo como:

```text
type monitor
```

---

## Procesos conflictivos

```bash
sudo airmon-ng check
```

Detener:

```bash
sudo airmon-ng check kill
```

Restaurar después:

```bash
sudo systemctl restart NetworkManager
```

---

## Prueba básica de captura

```bash
sudo airodump-ng wlan0mon
```

Si no aparecen redes:

- revisar canal;
- revisar antena;
- revisar permisos;
- revisar drivers;
- revisar si la interfaz correcta está en monitor;
- revisar distancia al AP.

---

## Prueba de inyección

En laboratorio autorizado:

```bash
sudo aireplay-ng --test wlan0mon
```

---

## Problemas comunes

| Problema | Causa posible |
|---|---|
| No entra en monitor | Driver/chipset no compatible |
| No ve redes | Canal, antena, interfaz incorrecta |
| No captura handshake | Canal equivocado o mala señal |
| Deauth no funciona | Inyección no soportada o PMF |
| Hashcat lento | GPU/driver no configurado |
| NetworkManager falla | Modo monitor no detenido correctamente |

---

## Buenas prácticas

- Usar adaptador USB dedicado.
- No depender de la tarjeta interna del portátil.
- Probar antes de la auditoría.
- Llevar antena adecuada.
- Documentar chipset y driver.
- Verificar 2.4/5 GHz según alcance.
- Reiniciar NetworkManager al terminar.

---

## Evidencia del adaptador

```bash
{
  echo "Date: $(date)"
  ip link
  iw dev
  iwconfig 2>/dev/null
} | tee adapter-info.txt
```

---

## Nota rápida

```text
Si el adaptador falla, la técnica falla. Validar modo monitor e inyección antes de empezar evita perder horas.
```