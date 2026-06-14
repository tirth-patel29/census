const fs = require('fs');
const path = require('path');

const iconsDir = path.join('d:/CENSUS/public/icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 512 512">',
    '  <rect width="512" height="512" fill="#000080" rx="80"/>',
    '  <path d="M256 90 L410 210 L410 420 L320 420 L320 300 L192 300 L192 420 L102 420 L102 210 Z" fill="white"/>',
    '  <rect x="210" y="300" width="92" height="120" fill="#000080"/>',
    '  <circle cx="340" cy="340" r="70" fill="#FF9933"/>',
    '  <path d="M310 340 L333 363 L375 313" stroke="white" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    '</svg>'
  ].join('\n');
  fs.writeFileSync(path.join(iconsDir, 'icon-' + size + 'x' + size + '.svg'), svg);
  // Also copy as PNG filename (browser will use SVG)
  fs.writeFileSync(path.join(iconsDir, 'icon-' + size + 'x' + size + '.png.svg'), svg);
});

console.log('Icons created:', sizes.map(s => s + 'x' + s).join(', '));
