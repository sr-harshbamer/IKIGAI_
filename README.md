# SentryCircle

**Real-time scam and impersonation defense that acts before harm happens.**

SentryCircle is an original hackathon prototype for Problem ID IHNG6. It checks a message or request for scam signals, explains the risk in plain language, and demonstrates protective actions: a safety hold, trusted-contact notification, and an incident timeline.

## What the prototype demonstrates

- Contextual risk score for urgency, payment, credential, threat, secrecy, and link signals
- Relationship-aware warning when a claimed contact uses an unusual verification pattern
- Explainable score breakdown instead of a black-box decision
- Safety hold simulation for a risky outgoing action
- Trusted-circle alert and a local incident audit trail
- Responsive interface built with Next.js and TypeScript

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo flow

1. Start with the Family emergency scenario.
2. Select the claimed contact and click **Analyze safely**.
3. Review the plain-language signals and risk score.
4. Click **Hold action** and **Notify my circle**.
5. Watch the incident timeline update.

This project is an educational prototype. Its scoring is deterministic and local; production deployment should add verified identity data, user consent, secure notification delivery, and human-review safeguards.
