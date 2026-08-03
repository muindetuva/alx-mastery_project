# Quote Service Incident Postmortem Template

## How AI Helped

I asked ChatGPT to draft a blameless, evidence-driven template for the complete
failure of a FastAPI service hosted on one VPS. I required sections for impact,
an evidence-anchored timeline, likely infrastructure and process causes, and
preventative actions. I replaced generic "server failed" language with the
specific `/health`, uptime-monitor, disk, memory, and provider signals used by
this deployment, and added an explicit 100% blast-radius statement.

## Anticipated Incident: VPS Down

If the single VPS hosting quote-service goes down, the HTTPS site becomes
unreachable and `/health` stops responding. The uptime monitor alerts after its
configured consecutive failures. Because there is only 1 VPS and no replica,
the blast radius is 100% of traffic: every health request and quote request
fails until the host or a replacement is available.

## Timeline Template

- __:__ UTC -- First evidence of service degradation (Sentry or performance
  monitoring).
- __:__ UTC -- `/health` stops responding (uptime-monitor history).
- __:__ UTC -- Availability alert fires (alerting-system event ID: ______).
- __:__ UTC -- On-call engineer acknowledged the alert (notification history).
- __:__ UTC -- Provider status, disk, memory, and systemd evidence collected
  (provider status page and host logs).
- __:__ UTC -- Recovery or failover action begins (deployment record).
- __:__ UTC -- Resolution completes and `/health` responds (health-check log).
- __:__ UTC -- Traffic, errors, and latency return to baseline (Sentry
  performance dashboard).

## Likely Root Causes

1. The VPS provider has a regional outage or host-level hardware failure.
2. The disk fills because application or Nginx logs are not rotated.
3. The Gunicorn process or kernel runs out of memory during a traffic spike.
4. An operating-system update or configuration change prevents systemd from
   starting the application after reboot.

## Draft Action Items

- Add disk-usage alerts at 70% warning and 85% critical, and verify log rotation
  monthly. Owner: @platform. Tracking: `OPS-201`.
- Document and rehearse a second-region recovery plan that provisions a new VPS,
  restores secrets, installs Nginx and systemd configuration, deploys the last
  known-good commit-SHA image, and switches DNS. Owner: @sre. Tracking:
  `OPS-202`.
- Evaluate a two-instance deployment behind a health-aware load balancer to
  remove the single point of failure. Owner: @architecture. Tracking: `OPS-203`.
