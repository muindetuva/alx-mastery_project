# Secure Vault Security Audit

## Scope and method

The review covered authentication, authorization, secret handling, note
encryption, logging, cross-origin access, compression, and response headers.
Findings were ranked by exploitability and impact using OWASP API Security
principles. Automated dependency and dynamic penetration tests should augment
this source review before a production release.

## Findings

| Severity | Finding | Risk | Recommended fix |
|---|---|---|---|
| High | The lab uses in-memory users and notes | Data is lost on restart and cannot support safe concurrent workers | Replace dictionaries with a transactional database and enforce unique constraints |
| High | Development secret defaults exist | An unchanged default permits token forgery or note decryption | Fail closed outside development and load rotated secrets from a managed secret store |
| Medium | Login has no rate limit | Password guessing can be automated | Add per-account and per-source throttling with observability and safe recovery |
| Medium | JWT revocation is not implemented | A stolen token works until expiration | Keep expiry short and add token identifiers plus a revocation strategy |
| Low | The API exposes no audit persistence | Security events disappear with process logs | Send structured, redacted events to append-only centralized storage |

## Finding dispositions

| Finding | Disposition | Evidence or justification |
|---|---|---|
| JWT theft exposure window | **Fixed (mitigation applied)** | `auth.py` issues JWTs with an `exp` claim and a 15-minute lifetime, and decoding validates expiry. Full token revocation remains deferred until persistent shared storage is introduced. |
| In-memory users and notes | **Deferred** | Durable database work is outside this runnable security lab. The service is not approved for multi-worker or production deployment until transactional persistence and uniqueness constraints replace the dictionaries. |
| Development secret defaults | **Deferred** | Defaults keep local exercises reproducible. Production deployment is explicitly blocked until unique rotated values are injected from a managed secret store and startup validation rejects development defaults. |
| Missing login rate limit | **Deferred** | A correct distributed limiter needs shared state and an account-recovery policy. Before public deployment, add per-account and per-source throttling, metrics, and alerting. |
| Missing persistent audit trail | **Deferred** | Local structured logs demonstrate redaction, but they are not durable. Production approval requires forwarding security events to append-only centralized storage with controlled retention. |

These dispositions are finding-specific release decisions, not a claim that
the deferred risks are harmless. Every deferred item is a production blocker.

## Why JWT, Not Basic Auth or Sessions

Basic Auth resends a long-lived password with every request and therefore has a
larger credential exposure surface. Server sessions can be appropriate but add
shared session-state requirements across workers. Short-lived signed JWTs let
this API authenticate requests without storing session state; TLS, expiry,
issuer/audience validation, rotation, and a revocation plan remain mandatory.

## Encryption and Secret Management Summary

Passwords are one-way hashed with salted bcrypt, while note content is
reversibly encrypted with Fernet before storage. The JWT signing secret and
Fernet key are read from environment variables and must be supplied by a secret
manager in production, never committed. Fernet key rotation requires retaining
old keys temporarily so existing ciphertext can be re-encrypted safely.

## Verification performed

- Verified successful and failed registration/login flows use the intended
  status codes and do not store raw passwords.
- Verified expired or malformed JWTs produce a Bearer challenge.
- Verified note storage contains ciphertext and another user receives 403.
- Verified sensitive log fields are redacted and application code uses no
  `print` statements.
- Verified request identifiers and defensive response headers coexist with
  CORS and GZip middleware.
