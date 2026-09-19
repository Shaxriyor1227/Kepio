// scripts/contrast.mjs
// WCAG 2.2 contrast validation for Kepio design tokens

function parseHex(hex) {
  const clean = hex.replace('#', '').trim();
  const num = parseInt(clean, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}

function sRgbLuminance([r, g, b]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(hex1, hex2) {
  const lum1 = sRgbLuminance(parseHex(hex1));
  const lum2 = sRgbLuminance(parseHex(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const tokens = {
  paper: '#fef9ec',
  desk: '#f2eee1',
  rule: '#e7e2d5',
  ink: '#09150e',
  'ink-2': '#1e2a22',
  'ink-soft': '#3d463f',
  'ink-muted': '#5c6259',
  'on-ink': '#fef9ec',
  seal: '#a7382e',
  'sticky-yellow': '#f5ecb4',
  'sticky-green': '#dde8cd',
  'sticky-rose': '#ebd9d0',
};

// Check pairs
const checks = [
  { fg: 'ink', bg: 'paper', required: 4.5, usage: 'Primary text on paper' },
  { fg: 'ink-2', bg: 'paper', required: 4.5, usage: 'Headings / buttons on paper' },
  { fg: 'ink-soft', bg: 'paper', required: 4.5, usage: 'Body copy on paper' },
  { fg: 'ink-muted', bg: 'paper', required: 4.5, usage: 'Mono metadata labels on paper' },
  { fg: 'seal', bg: 'paper', required: 4.5, usage: 'Red stamps & alerts on paper' },
  { fg: 'on-ink', bg: 'ink', required: 4.5, usage: 'White/cream text on ink button' },
  { fg: 'on-ink', bg: 'ink-2', required: 4.5, usage: 'White/cream text on ink-2 container' },
  { fg: 'ink', bg: 'desk', required: 4.5, usage: 'Ink on desk headers/footers' },
  { fg: 'ink-muted', bg: 'desk', required: 4.5, usage: 'Mono metadata on desk' },
  { fg: 'ink', bg: 'sticky-yellow', required: 4.5, usage: 'Text on yellow sticky note' },
  { fg: 'ink', bg: 'sticky-green', required: 4.5, usage: 'Text on green sticky note' },
  { fg: 'ink', bg: 'sticky-rose', required: 4.5, usage: 'Text on rose sticky note' },
  { fg: 'rule', bg: 'paper', required: 1.1, usage: 'Dividers / borders (subtle visual rule)' },
];

console.log('\n=== KEPIO WCAG 2.2 CONTRAST AUDIT ===\n');
let failed = 0;

for (const check of checks) {
  const fgColor = tokens[check.fg];
  const bgColor = tokens[check.bg];
  const ratio = contrastRatio(fgColor, bgColor);
  const pass = ratio >= check.required;
  if (!pass) failed++;

  const status = pass ? '✓ PASS' : '✗ FAIL';
  console.log(
    `${status} [${ratio.toFixed(2)}:1, min ${check.required}:1] ${check.fg.padEnd(12)} (${fgColor}) on ${check.bg.padEnd(13)} (${bgColor}) — ${check.usage}`
  );
}

console.log('\n====================================');
if (failed > 0) {
  console.error(`\nFAILED: ${failed} contrast check(s) did not meet WCAG threshold.`);
  process.exit(1);
} else {
  console.log('\nSUCCESS: All token contrast checks passed WCAG 2.2 AA standards.\n');
}
