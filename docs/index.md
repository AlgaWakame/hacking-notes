<style>
.hero {
  text-align: center;
  padding: 3rem 1rem 2rem 1rem;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, rgba(255, 111, 0, 0.12), rgba(0, 0, 0, 0.04));
  animation: fadeIn 0.8s ease-in-out;
}

.hero h1 {
  font-size: 2.6rem;
  margin-bottom: 0.4rem;
}

.hero p {
  max-width: 760px;
  margin: 0 auto 1.2rem auto;
  font-size: 1.05rem;
  opacity: 0.88;
}

.md-typeset .grid.cards > ul > li {
  border-radius: 1rem;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  animation: fadeIn 0.7s ease-in-out;
}

.md-typeset .grid.cards > ul > li:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.6rem 1.4rem rgba(0, 0, 0, 0.12);
  border-color: var(--md-accent-fg-color);
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  margin-top: 1.2rem;
}

.flow {
  text-align: center;
  font-family: monospace;
  padding: 1rem;
  border-radius: 0.8rem;
  background: var(--md-code-bg-color);
  margin: 1.5rem 0;
}

.badge-row {
  text-align: center;
  margin-top: 1.2rem;
}

.badge-row code {
  margin: 0.15rem;
  display: inline-block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<div class="hero" markdown>

# Hacking Notes

Notas sobre **ciberseguridad ofensiva**, **pentesting**, **Active Directory**, **Web & API Security**, **AI Red Teaming**, herramientas y reporting técnico.

<div class="quick-actions" markdown>

[Web & API](web-api/index.md){ .md-button .md-button--primary }
[Active Directory](pentesting/active-directory/index.md){ .md-button }
[NetExec](pentesting/active-directory/netexec.md){ .md-button }
[AI Red Teaming](ai-red-teaming/index.md){ .md-button }
[Reporting](reporting/plantilla-vulnerabilidad.md){ .md-button }

</div>

</div>

!!! warning "Contenido público"
    Esta web contiene únicamente notas sanitizadas.  
    No incluir flags, credenciales, tokens, hashes completos, capturas sensibles, soluciones completas de laboratorios, material propietario ni evidencias de examen.

---

## Explorar por área

<div class="grid cards" markdown>

-   🕸️ **Web & API Security**

    ---

    Enumeración, autenticación, autorización, IDOR, APIs, lógica de negocio, validación de entradas y exposición de información.

    [Entrar →](web-api/index.md)

-   🏢 **Active Directory**

    ---

    Metodología AD, enumeración, NetExec, Kerberos, BloodHound, AD CS y Certipy.

    [Entrar →](pentesting/active-directory/index.md)

-   🧪 **Pentesting**

    ---

    Reconocimiento, enumeración, explotación controlada, post-explotación en laboratorio y preparación de certificaciones.

    [Entrar →](pentesting/index.md)

-   🧠 **AI Red Teaming**

    ---

    LLMs, RAG, agentes, prompt injection, tool abuse, embeddings y seguridad de sistemas de IA.

    [Entrar →](ai-red-teaming/index.md)

-   🛠️ **Herramientas**

    ---

    Burp Suite, Python, Docker, curl, jq, NetExec, Certipy y utilidades para auditorías.

    [Entrar →](herramientas/burp-suite.md)

-   📝 **Reporting**

    ---

    Plantillas de vulnerabilidad, impacto, severidad, evidencias, recomendaciones y redacción profesional.

    [Entrar →](reporting/plantilla-vulnerabilidad.md)

</div>

---

## Buscar por necesidad

| Quiero... | Ir a |
|---|---|
| Empezar una auditoría web/API | [Web & API Security](web-api/index.md) |
| Revisar autenticación | [Autenticación](web-api/autenticacion.md) |
| Probar IDOR o autorización rota | [Autorización e IDOR](web-api/autorizacion-idor.md) |
| Consultar comandos de NetExec | [NetExec Quick Reference](pentesting/active-directory/netexec.md) |
| Enumerar Active Directory | [Enumeración AD](pentesting/active-directory/enumeracion.md) |
| Revisar Kerberos | [Kerberos](pentesting/active-directory/kerberos.md) |
| Revisar BloodHound | [BloodHound](pentesting/active-directory/bloodhound.md) |
| Revisar AD CS | [AD CS](pentesting/active-directory/adcs.md) |
| Documentar una vulnerabilidad | [Plantilla de Vulnerabilidad](reporting/plantilla-vulnerabilidad.md) |
| Preparar evidencias | [Checklist de Evidencias](examen/checklist-evidencias.md) |

---

## Etiquetas principales

<div class="badge-row" markdown>

`#web-security` `#api-security` `#active-directory` `#netexec` `#kerberos` `#bloodhound` `#adcs` `#pentesting` `#ai-red-team` `#reporting`

</div>

---

## Apoya el proyecto

Si estas notas te resultan útiles, puedes apoyar el mantenimiento del contenido.

[☕ Invitar a un café](https://buymeacoffee.com/algawakame){ .md-button .md-button--primary }

---

<div align="center" markdown>

**Hacking Notes** · Offensive Security · Web/API · Active Directory · AI Red Teaming · Reporting

</div>