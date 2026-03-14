# Password Strength Checker

A client-side web app that evaluates password strength, checks for known data
breaches, and generates cryptographically secure passwords.

**Live demo:** https://Bharath2907.github.io/password-checker

---

## Features

- Real-time strength scoring (0–100) with animated visual meter
- 8-point rule checklist: length, character variety, common pattern detection
- HaveIBeenPwned breach check using the k-anonymity privacy model
- Cryptographically secure password generator using the Web Crypto API
- Zero dependencies — pure HTML, CSS, and JavaScript

---

## Security concepts demonstrated

### Password entropy scoring
Password strength is calculated by awarding points for length thresholds,
character class variety (lowercase, uppercase, digits, symbols), and
penalising common patterns. This mirrors real-world password policies used
in enterprise authentication systems.

### k-Anonymity (HIBP integration)
When checking a password against the HaveIBeenPwned database, the full
password is never transmitted. Instead:

1. The password is hashed locally using SHA-1 via the Web Crypto API
2. Only the first 5 hex characters of the hash are sent to the HIBP API
3. The API returns ~800 hashes sharing that prefix
4. The browser searches the list locally for a match

This k-anonymity model means your password cannot be intercepted or logged
by the API, the same technique used by Google Chrome's Password Checkup
feature.

### Cryptographically secure random generation
The password generator uses `crypto.getRandomValues()` (Web Crypto API)
rather than `Math.random()`. `Math.random()` is a pseudo-random number
generator that is predictable and unsuitable for security applications.
`crypto.getRandomValues()` draws from the operating system's entropy pool,
the same source used in TLS key generation.

### Client-side only architecture
No data is ever sent to a backend server. All password analysis happens
entirely in the user's browser, eliminating server-side data exposure risk.

---

## Tech stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript   |
| Crypto     | Web Crypto API (built-in browser) |
| Breach API | HaveIBeenPwned v3 Range API       |
| Hosting    | GitHub Pages                      |

---

## How to run locally
```bash
git clone https://github.com/YOUR-USERNAME/password-checker.git
cd password-checker
# Open index.html in your browser, no build step needed
```

---

## What I learned

- How password entropy and scoring systems work in real authentication
- The k-anonymity privacy model and how it protects sensitive data in transit
- The difference between `Math.random()` and cryptographically secure RNG
- Consuming a public security API (HaveIBeenPwned) from a browser client
- Deploying a static site with GitHub Pages
```

---

## Part C — Add it to your resume

Here's exactly how to phrase this project on your resume:
```
Password Strength Checker                               github.com/YOU/password-checker
Cybersecurity Web App | HTML · CSS · JavaScript · Web Crypto API · HaveIBeenPwned API

- Built a client-side password analysis tool implementing entropy-based scoring
  across 8 security criteria including character variety and common pattern detection
- Integrated HaveIBeenPwned breach database using the k-anonymity privacy model —
  the same technique used by Google Chrome's Password Checkup feature
- Implemented cryptographically secure password generation using crypto.getRandomValues()
  (Web Crypto API) instead of Math.random(), demonstrating security-aware coding practices
- Deployed via GitHub Pages with zero backend dependencies, eliminating server-side
  data exposure risk
