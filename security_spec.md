# Matemagic Security Specification

## 1. Data Invariants
- A user's profile score coordinates (Level, XP, medals list) can only be altered by the exact authenticated owner of that account.
- Immutability metrics on sensitive account references (userId, email, date coordinates) are strictly checked on consecutive updates.
- Private PII collection paths `/users/{userId}/private/info` are protected by a strict ownership check, preventing other players from access.

## 2. Threat Vector Payloads ("Dirty Dozen")
To protect the app, these invalid formats will be rejected by our secure Firestore Rules:

1. **Self-Elevated Level Injection**: Trying to write `level: 2500` under Profile. (Rejected by boundaries: `level <= 1000`).
2. **Negative XP Spoofing**: Setting `xp: -100` on update. (Rejected by validations: `xp >= 0`).
3. **Ghost Collection Keys**: Injecting supplementary claims like `isAdmin: true` into the public fields Map. (Rejected by Strict Keys validator size).
4. **Identity Spoofing**: Attempting to insert a public profile document under an attacker's UID containing `displayName: "Paulo"` while auth token UID belongs to another. (Rejected by `isOwner` validation gate).
5. **PII Blanket Scrape**: Attacker attempting to request list queries across private info path without matching keys. (Blocked by `isOwner` read block).
6. **Poisoned Long Document ID**: Attacker creating profile where document ID size is > 1MB of characters. (Blocked by `isValidId` size checker <= 128 characters).
7. **Bypassing Signature Constraint**: Supplying payload with empty list instead of arrays on initial creation list keys. (Rejected by `hasAll` requirement map checks).
8. **Email Modification**: Attacker trying to update a private profile card and changing `email` address directly. (Rejected by immutability check `incoming().email == existing().email`).
9. **Creation Timestamp Alteration**: Attacker trying to rewrite the original creation date of user profile private info. (Rejected by private update invariants checking equality).
10. **Huge String Injection**: Writing a 2MB payload into progress metadata. (Blocked by progress string max size bounds of <= 50000 chars).
11. **Altering display name on update**: Trying to rewrite user's display name to escape bans if banned list locks it.
12. **Out of bounds characters in ID**: Registering with a document ID filled with special SQL/noSQL injection codes. (Blocked by regex `^[a-zA-Z0-9_\-]+$`).
