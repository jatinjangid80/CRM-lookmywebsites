const fs = require('fs');

let content = fs.readFileSync('src/routes/crm.accounts.tsx', 'utf8');

// Replace standard colors for badges and buttons
const replacements = [
  { from: /bg-emerald-100 text-emerald-700/g, to: 'bg-emerald-500/10 text-emerald-500' },
  { from: /border-emerald-200/g, to: 'border-emerald-500/20' },
  { from: /bg-emerald-100 text-emerald-600/g, to: 'bg-emerald-500/10 text-emerald-500' },
  { from: /text-emerald-600/g, to: 'text-emerald-500' },
  { from: /bg-emerald-100/g, to: 'bg-emerald-500/10' },
  
  { from: /bg-rose-100 text-rose-700/g, to: 'bg-rose-500/10 text-rose-500' },
  { from: /border-rose-200/g, to: 'border-rose-500/20' },
  { from: /text-rose-600/g, to: 'text-rose-500' },
  { from: /bg-rose-100/g, to: 'bg-rose-500/10' },

  { from: /bg-blue-100 text-blue-700/g, to: 'bg-blue-500/10 text-blue-500' },
  { from: /bg-blue-100 text-blue-600/g, to: 'bg-blue-500/10 text-blue-500' },
  { from: /border-blue-200/g, to: 'border-blue-500/20' },
  
  { from: /bg-amber-100 text-amber-700/g, to: 'bg-amber-500/10 text-amber-500' },

  { from: /bg-gray-100 text-gray-600/g, to: 'bg-muted text-muted-foreground' },
  { from: /border-gray-200/g, to: 'border-border' },
  { from: /bg-gray-900 text-white/g, to: 'bg-foreground text-background' },
];

replacements.forEach(r => {
  content = content.replace(r.from, r.to);
});

fs.writeFileSync('src/routes/crm.accounts.tsx', content);
console.log("Updated crm.accounts.tsx");
