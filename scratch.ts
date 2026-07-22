import fs from 'fs';

// simple regex to extract bookings
const content = fs.readFileSync('/Users/jatinjangid/Desktop/CRM-lookmywebsites-main/src/lib/mock-data.ts', 'utf-8');

// I'll just look at SEED_BOOKINGS
let match = content.match(/export const SEED_BOOKINGS[\s\S]*?];/);
if (match) {
  let code = match[0].replace('export const SEED_BOOKINGS', 'const SEED_BOOKINGS');
  code += `\nconsole.log("Pending:", SEED_BOOKINGS.reduce((sum, b) => sum + ((b.amount || 0) - (b.paid || 0)), 0));`;
  code += `\nconsole.log("Monthly:", SEED_BOOKINGS.reduce((sum, b) => sum + (b.paid || 0), 0));`;
  fs.writeFileSync('test.js', code.replace(/: [a-zA-Z]+/g, ''));
}
