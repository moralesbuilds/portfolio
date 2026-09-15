# ADR-0002: Custom Domain Email Provider Selection via Zoho Mail

## Status
Accepted (2026-08-31)

## Context
The portfolio project requires a dedicated professional email setup attached to the custom domain to handle inbound inquiries, contact form submissions, and professional communication. I need a reliable email hosting provider that establishes domain authority, supports essential DNS verification mechanisms (SPF, DKIM, DMARC), and provides native IMAP/POP3/SMTP protocol access for seamless client integration without requiring expensive enterprise workspace subscriptions.

## Decision
Adopt **Zoho Mail (Mail Lite Plan)** as the primary email hosting provider for custom domain email management at a low fixed cost ($12/year for 5 GB storage).

## Alternatives evaluated

### 1. Zoho Mail - Mail Lite Plan (Selected)
* **Pros**: Highly cost-effective at $12/year, provides 5 GB storage per user (sufficient for early portfolio operation) or 10 GB storage per user at $15/year, and includes full standard IMAP/POP3/SMTP access for desktop and mobile clients. Guarantees clean domain verification records (SPF, DKIM, DMARC) for reliable deliverability.
* **Cons**: Introduces a small recurring operational cost ($1/month anually)

### 2. Zoho Mail - Mail Free Plan
* **Pros**: Zero recurring cost for 1 domain up to 5 users with 5 GB storage.
* **Cons**: Lacks standard IMAP/POP3/SMTP access (restricting mailbox access exclusively to Zoho's webmail or native apps) and does not supports automated email forwarding.

### 3. Cloudflare Email Routing + Personal Gmail
* **Pros**: Completely free, natively integrated into Cloudflare DNS, and forwards inbound custom domain emails directly to an existing personal inbox.
* **Cons**: Lacks a native outbound SMTP channel under the custom domain out of the box; sending replies requires third-party SMTP relays or exposes personal email addresses, risking inconsistent sender branding.

### 4. Google Workspace / Microsoft 365
* **Pros**: Industry-standard enterprise tools, native IMAP/POP3/SMTP access, and seamless third-party app integration.
* **Cons**: Requires a higher recurring subscription fee ($8.40/month per user or $84/year), creating unnecessary overhead for a single-developer portfolio.

### 5. Self-Hosted Mail Server (e.g., Postfix/Dovecot or Mailcow)
* **Pros**: Complete data ownership, no vender-imposed storage or user limits, and unlimited alias creation.
* **Cons**: Substantial maintenance overhead; requires managing server IP reputation, continuous spam filtering updates, reverse DNS, and port 25 unblocking on cloud providers.

## Consequences
* **Positive**: Secures a professional, branded custom domain email address for a nominal fixed cost. Enables full IMAP/POP3/SMTP integration with preferred email clients and form notification handlers while maintaining strict deliverability records (SPF/DKIM/DMARC).
* **Negative**: Incurs minor ongoing subscription expense and requires managing additional DNS records (MX, TXT, CNAME) in Cloudflare.
