const fs = require('fs');
let content = fs.readFileSync('src/routes/crm.tasks.tsx', 'utf8');

// Colors maps
content = content.replace(/bg-red-100 text-red-800 border-red-200/g, 'bg-red-500/10 text-red-500 border-red-500/20');
content = content.replace(/bg-amber-100 text-amber-800 border-amber-200/g, 'bg-amber-500/10 text-amber-500 border-amber-500/20');
content = content.replace(/bg-emerald-100 text-emerald-800 border-emerald-200/g, 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20');
content = content.replace(/bg-slate-100 text-slate-800 border-slate-200/g, 'bg-slate-500/10 text-slate-500 border-slate-500/20');
content = content.replace(/bg-blue-100 text-blue-800 border-blue-200/g, 'bg-blue-500/10 text-blue-500 border-blue-500/20');
content = content.replace(/bg-emerald-50 text-emerald-700 border-emerald-200/g, 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20');
content = content.replace(/bg-red-50 text-red-700 border-red-200/g, 'bg-red-500/10 text-red-500 border-red-500/20');

// Backgrounds
content = content.replace(/bg-slate-50\/50/g, 'bg-muted/30');
content = content.replace(/bg-slate-50\/80/g, 'bg-muted/50');
content = content.replace(/bg-slate-50/g, 'bg-muted');
content = content.replace(/bg-white/g, 'bg-card');
content = content.replace(/bg-slate-100/g, 'bg-muted');
content = content.replace(/bg-slate-200/g, 'bg-muted/80');

// Text colors
content = content.replace(/text-slate-500/g, 'text-muted-foreground');
content = content.replace(/text-slate-600/g, 'text-muted-foreground');
content = content.replace(/text-slate-700/g, 'text-foreground');
content = content.replace(/text-slate-800/g, 'text-foreground');
content = content.replace(/text-slate-900/g, 'text-foreground');
content = content.replace(/text-gray-800/g, 'text-foreground');

// Borders
content = content.replace(/border-slate-200/g, 'border-border');
content = content.replace(/border-slate-300/g, 'border-border/60');
content = content.replace(/border-[#e8dfd5]/g, 'border-border');

// Other specific fixes
// Line 464: <TableRow className="bg-primary hover:bg-primary/90 [&_th]:text-primary-foreground">
// Actually TableHeader is usually bg-muted or transparent. We'll leave it as bg-primary but remove any white text overrides.
// Wait, TableRow hover:
content = content.replace(/className={task.task_type === "Group" \? "bg-slate-50\/50" : ""}/g, 'className={task.task_type === "Group" ? "bg-muted/30" : ""}');

// Save
fs.writeFileSync('src/routes/crm.tasks.tsx', content);
console.log('Fixed themes');
