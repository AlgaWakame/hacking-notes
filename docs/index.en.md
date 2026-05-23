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

Notes on **offensive security**, **pentesting**, **Active Directory**, **Web & API Security**, **AI Red Teaming**, tools and technical reporting.

<div class="quick-actions" markdown>

[Web & API](web-api/index.md){ .md-button .md-button--primary }
[Active Directory](pentesting/active-directory/index.md){ .md-button }
[NetExec](pentesting/active-directory/netexec.md){ .md-button }
[AI Red Teaming](ai-red-teaming/index.md){ .md-button }
[Reporting](reporting/plantilla-vulnerabilidad.md){ .md-button }

</div>

</div>

!!! warning "Public content"
    This website only contains sanitized notes.  
    Do not include flags, credentials, tokens, full hashes, sensitive screenshots, complete lab solutions, proprietary material or exam evidence.

---

## Explore by area

<div class="grid cards" markdown>

-   🕸️ **Web & API Security**

    ---

    Enumeration, authentication, authorization, IDOR, APIs, business logic, input validation and information disclosure.

    [Open →](web-api/index.md)

-   🏢 **Active Directory**

    ---

    AD methodology, enumeration, NetExec, Kerberos, BloodHound, AD CS and Certipy.

    [Open →](pentesting/active-directory/index.md)

-   🧪 **Pentesting**

    ---

    Reconnaissance, enumeration, controlled exploitation, lab post-exploitation and certification preparation.

    [Open →](pentesting/index.md)

-   🧠 **AI Red Teaming**

    ---

    LLMs, RAG, agents, prompt injection, tool abuse, embeddings and AI system security.

    [Open →](ai-red-teaming/index.md)

-   🛠️ **Tools**

    ---

    Burp Suite, Python, Docker, curl, jq, NetExec, Certipy and useful utilities for security assessments.

    [Open →](herramientas/burp-suite.md)

-   📝 **Reporting**

    ---

    Vulnerability templates, impact, severity, evidence, recommendations and professional vulnerability writing.

    [Open →](reporting/plantilla-vulnerabilidad.md)

</div>

---

## Search by need

| I want to... | Go to |
|---|---|
| Start a Web/API assessment | [Web & API Security](web-api/index.md) |
| Review authentication | [Authentication](web-api/autenticacion.md) |
| Test IDOR or broken authorization | [Authorization and IDOR](web-api/autorizacion-idor.md) |
| Look up NetExec commands | [NetExec Quick Reference](pentesting/active-directory/netexec.md) |
| Enumerate Active Directory | [AD Enumeration](pentesting/active-directory/enumeracion.md) |
| Review Kerberos | [Kerberos](pentesting/active-directory/kerberos.md) |
| Review BloodHound | [BloodHound](pentesting/active-directory/bloodhound.md) |
| Review AD CS | [AD CS](pentesting/active-directory/adcs.md) |
| Document a vulnerability | [Vulnerability Template](reporting/plantilla-vulnerabilidad.md) |
| Prepare evidence | [Evidence Checklist](examen/checklist-evidencias.md) |

---

## Main tags

<div class="badge-row" markdown>

`#web-security` `#api-security` `#active-directory` `#netexec` `#kerberos` `#bloodhound` `#adcs` `#pentesting` `#ai-red-team` `#reporting`

</div>

---

## Support the project

If these notes are useful to you, you can support the maintenance of this content.

[☕ Buy me a coffee](https://buymeacoffee.com/algawakame){ .md-button .md-button--primary }

---

<div align="center" markdown>

**Hacking Notes** · Offensive Security · Web/API · Active Directory · AI Red Teaming · Reporting

</div>