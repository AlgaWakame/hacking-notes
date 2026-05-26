# Cracking Offline

> Técnica: validar fortaleza de passphrases WPA/WPA2 mediante cracking offline autorizado.

!!! warning "Uso autorizado"
    Ejecutar únicamente sobre hashes o capturas propias, de laboratorio o auditorías autorizadas.  
    No publicar contraseñas recuperadas.

---

## Cuándo usar

- Ya tienes handshake o PMKID válido.
- Quieres medir fortaleza de contraseña.
- El alcance permite cracking offline.
- Tienes diccionarios o reglas acordadas.
- Necesitas evidenciar passphrase débil.

---

## Variables

```bash
export HASH_FILE="evidence/handshake.hc22000"
export WORDLIST="/usr/share/wordlists/rockyou.txt"
```

---

## Hashcat WPA/WPA2

```bash
hashcat -m 22000 "$HASH_FILE" "$WORDLIST"
```

Mostrar resultado:

```bash
hashcat -m 22000 "$HASH_FILE" --show
```

---

## Reglas

```bash
hashcat -m 22000 "$HASH_FILE" "$WORDLIST" \
  -r /usr/share/hashcat/rules/best64.rule
```

---

## Máscara simple

Ejemplo de laboratorio:

```bash
hashcat -m 22000 "$HASH_FILE" -a 3 '?l?l?l?l?d?d?d?d'
```

---

## Información de GPU

```bash
hashcat -I
```

Benchmark:

```bash
hashcat -b -m 22000
```

---

## Ver estado

```bash
hashcat --status
```

Pausar/reanudar durante ejecución:

```text
p    pause
r    resume
q    quit
```

---

## Crear wordlist de laboratorio

```bash
cat > lab-wordlist.txt << 'EOF'
password
password123
labwifi2026
empresa2026
Winter2026!
EOF
```

```bash
hashcat -m 22000 "$HASH_FILE" lab-wordlist.txt
```

---

## Qué buscar

| Señal | Interpretación |
|---|---|
| Password recuperada rápido | Contraseña débil |
| No recuperada | No implica seguridad absoluta |
| Hash inválido | Captura incorrecta |
| Bajo rendimiento GPU | Revisar drivers |
| SSID común | Puede favorecer ataques precalculados |

---

## Evidencia mínima

```text
Hash type:
Fichero:
Modo hashcat:
Wordlist/regla:
Tiempo:
Resultado:
Password recuperada: <redacted>
Impacto:
```

---

## Sanitización

No publicar:

```text
hash completo
contraseña
SSID/BSSID reales
capturas .cap/.hc22000
```

Publicar:

```text
Hash type: WPA/WPA2 22000
Result: passphrase recovered using authorized lab wordlist
Password: <redacted>
```

---

## Falsos positivos / errores comunes

- No crackear no significa contraseña segura.
- Wordlist demasiado pobre.
- Hash incorrecto.
- Captura de otra red.
- Se confunde rendimiento bajo con protección.
- Se reporta sin indicar condiciones del cracking.

---

## Mitigación

- Usar passphrases largas y aleatorias.
- Evitar palabras de diccionario.
- Evitar patrones de empresa + año.
- Usar WPA3-SAE si es posible.
- Deshabilitar WPS.
- Rotar contraseñas compartidas.