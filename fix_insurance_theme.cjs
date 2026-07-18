const fs = require('fs');

const files = [
  'src/routes/crm.insurance.tsx',
  'src/components/insurance/RenewalsView.tsx',
  'src/components/insurance/InsuranceDashboard.tsx',
  'src/components/insurance/InsuranceTable.tsx',
  'src/components/insurance/InsuranceForm.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Backgrounds
  content = content.replace(/bg-slate-50\/50/g, 'bg-muted/30');
  content = content.replace(/bg-slate-200\/50/g, 'bg-muted/50');
  content = content.replace(/bg-slate-50/g, 'bg-muted');
  content = content.replace(/bg-slate-100/g, 'bg-muted');
  content = content.replace(/bg-slate-200/g, 'bg-muted/80');
  content = content.replace(/bg-white/g, 'bg-card');
  
  // Specific pill toggles / buttons
  content = content.replace(/bg-blue-100 text-blue-600/g, 'bg-primary/10 text-primary');
  content = content.replace(/bg-blue-50/g, 'bg-blue-500/10');
  content = content.replace(/border-blue-100/g, 'border-blue-500/20');
  content = content.replace(/text-blue-700/g, 'text-blue-500');

  // Status badges
  content = content.replace(/bg-rose-100 text-rose-700/g, 'bg-rose-500/10 text-rose-500 border-rose-500/20 border');
  content = content.replace(/bg-rose-50 border-rose-100/g, 'bg-rose-500/10 border-rose-500/20');
  content = content.replace(/bg-rose-50/g, 'bg-rose-500/10');
  content = content.replace(/text-rose-700/g, 'text-rose-500');

  content = content.replace(/bg-amber-100 text-amber-700/g, 'bg-amber-500/10 text-amber-500 border-amber-500/20 border');
  content = content.replace(/bg-amber-50/g, 'bg-amber-500/10');
  content = content.replace(/text-amber-700/g, 'text-amber-500');
  
  content = content.replace(/bg-yellow-50/g, 'bg-yellow-500/10');
  content = content.replace(/text-yellow-700/g, 'text-yellow-500');

  content = content.replace(/bg-emerald-100 text-emerald-700/g, 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border');
  content = content.replace(/bg-emerald-50 border-emerald-100/g, 'bg-emerald-500/10 border-emerald-500/20');
  content = content.replace(/bg-emerald-50/g, 'bg-emerald-500/10');

  content = content.replace(/text-slate-700/g, 'text-foreground');
  
  // Table row hovers
  content = content.replace(/hover:bg-slate-50\/50/g, 'hover:bg-muted/50');
  content = content.replace(/hover:bg-slate-50/g, 'hover:bg-muted');
  content = content.replace(/hover:bg-slate-200/g, 'hover:bg-muted');

  fs.writeFileSync(file, content);
}
console.log('Fixed insurance themes');
