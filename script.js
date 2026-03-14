const input = document.getElementById('passwordInput');
const toggleBtn = document.getElementById('toggleBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const tipsList = document.getElementById('tipsList');

// --- Toggle show/hide password ---
toggleBtn.addEventListener('click', () => {
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
});

// --- Score a password 0-100 ---
function scorePassword(pw) {
  let score = 0;

  if (pw.length >= 8)  score += 10;
  if (pw.length >= 12) score += 15;
  if (pw.length >= 16) score += 15;

  if (/[a-z]/.test(pw)) score += 10;
  if (/[A-Z]/.test(pw)) score += 10;
  if (/[0-9]/.test(pw)) score += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 15;

  // Bonus: mix of all four character types
  const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(r => r.test(pw)).length;
  if (types === 4) score += 15;

  return Math.min(score, 100);
}

// --- Build tips list ---
function getTips(pw) {
  return [
    { pass: pw.length >= 8,           text: 'At least 8 characters' },
    { pass: pw.length >= 12,          text: 'At least 12 characters (recommended)' },
    { pass: /[A-Z]/.test(pw),         text: 'Contains uppercase letter' },
    { pass: /[a-z]/.test(pw),         text: 'Contains lowercase letter' },
    { pass: /[0-9]/.test(pw),         text: 'Contains a number' },
    { pass: /[^a-zA-Z0-9]/.test(pw),  text: 'Contains a symbol (!@#$...)' },
    { pass: !/(.)\1{2,}/.test(pw),    text: 'No repeated characters (aaa, 111)' },
    { pass: !/^(password|123456|qwerty)/i.test(pw), text: 'Not a common pattern' },
  ];
}

// --- Map score to label + bar color ---
function getLevel(score) {
  if (score < 30)  return { label: 'Weak',   color: '#e05555', pct: 25  };
  if (score < 55)  return { label: 'Fair',   color: '#e0a555', pct: 50  };
  if (score < 75)  return { label: 'Good',   color: '#5599e0', pct: 75  };
  return              { label: 'Strong', color: '#4caf82', pct: 100 };
}

// --- Main update function ---
input.addEventListener('input', () => {
  const pw = input.value;

  if (!pw) {
    strengthBar.style.width = '0%';
    strengthLabel.textContent = 'Enter a password to begin';
    strengthLabel.style.color = '#888';
    tipsList.innerHTML = '';
    return;
  }

  const score = scorePassword(pw);
  const { label, color, pct } = getLevel(score);

  strengthBar.style.width = pct + '%';
  strengthBar.style.background = color;
  strengthLabel.textContent = `${label} — score ${score}/100`;
  strengthLabel.style.color = color;

  const tips = getTips(pw);
  tipsList.innerHTML = tips.map(t => `
    <li class="${t.pass ? 'tip-pass' : 'tip-fail'}">
      ${t.pass ? '✓' : '✗'} ${t.text}
    </li>
  `).join('');
});

// ============================================
// HIBP BREACH CHECK (k-anonymity method)
// ============================================

const hibpBtn = document.getElementById('hibpBtn');
const hibpResult = document.getElementById('hibpResult');

hibpBtn.addEventListener('click', async () => {
  const pw = input.value;

  if (!pw) {
    hibpResult.textContent = 'Enter a password first.';
    hibpResult.style.color = '#888';
    return;
  }

  hibpResult.textContent = 'Checking...';
  hibpResult.style.color = '#888';

  try {
    // Step 1: SHA-1 hash the password in the browser
    const encoder = new TextEncoder();
    const data = encoder.encode(pw);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);

    // Step 2: Convert hash to HEX string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // Step 3: Send only the FIRST 5 characters (k-anonymity — your full password never leaves your browser)
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();

    // Step 4: Search the returned list for our suffix
    const lines = text.split('\n');
    const match = lines.find(line => line.startsWith(suffix));

    if (match) {
      const count = parseInt(match.split(':')[1].trim(), 10);
      hibpResult.textContent = `⚠️ Found in ${count.toLocaleString()} data breaches! Do not use this password.`;
      hibpResult.style.color = '#e05555';
    } else {
      hibpResult.textContent = '✓ Not found in any known breaches.';
      hibpResult.style.color = '#4caf82';
    }

  } catch (err) {
    hibpResult.textContent = 'Could not connect to HIBP. Check your internet connection.';
    hibpResult.style.color = '#e0a555';
  }
});


// ============================================
// PASSWORD GENERATOR
// ============================================

const generateBtn = document.getElementById('generateBtn');
const generatedOutput = document.getElementById('generatedOutput');
const genLength = document.getElementById('genLength');
const genSymbols = document.getElementById('genSymbols');
const genNumbers = document.getElementById('genNumbers');

generateBtn.addEventListener('click', () => {
  const length = Math.min(Math.max(parseInt(genLength.value) || 16, 8), 64);
  const useSymbols = genSymbols.checked;
  const useNumbers = genNumbers.checked;

  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  // Always include lower + upper; optionally add numbers and symbols
  let charset = lower + upper;
  if (useNumbers) charset += numbers;
  if (useSymbols) charset += symbols;

  // Use crypto.getRandomValues — cryptographically secure, NOT Math.random()
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  const password = Array.from(array)
    .map(val => charset[val % charset.length])
    .join('');

  generatedOutput.textContent = password;

  // Auto-fill the checker so the user can instantly see the score
  input.value = password;
  input.dispatchEvent(new Event('input'));
});

// Click to copy the generated password
generatedOutput.addEventListener('click', () => {
  const pw = generatedOutput.textContent;
  if (!pw) return;
  navigator.clipboard.writeText(pw).then(() => {
    const original = generatedOutput.textContent;
    generatedOutput.textContent = 'Copied!';
    setTimeout(() => generatedOutput.textContent = original, 1200);
  });
});