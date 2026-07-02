const fs = require('fs');
const filePath = 'src/routes/crm.leads.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove expandedNotes state
content = content.replace(/const \[expandedNotes, setExpandedNotes\].*?useState<Set<string>>\(new Set\(\)\);\n/g, '');

// Remove toggleNotes function
content = content.replace(/\s*const toggleNotes = \(id: string\) => \{[\s\S]*?\};\n/g, '');

// Remove the button
content = content.replace(/<button\n\s*onClick=\{\(e\) => \{\n\s*e\.stopPropagation\(\);\n\s*toggleNotes\(l\.id\);\n\s*\}\}\n\s*className="flex items-center gap-1 rounded px-1\.5 py-0\.5 text-\[10px\] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"\n\s*>\n\s*\{expandedNotes\.has\(l\.id\) \? \(\n\s*<><ChevronUp className="h-3 w-3" \/> Hide Notes<\/>\n\s*\) : \(\n\s*<><ChevronDown className="h-3 w-3" \/> Show Notes<\/>\n\s*\)\}\n\s*<\/button>/g, '');

// Remove the expanded row block
content = content.replace(/\s*\{\/\*\s*Notes row\s*\*\/\}[\s\S]*?(?=\s*<\/React\.Fragment>)/, '');

fs.writeFileSync(filePath, content, 'utf8');
