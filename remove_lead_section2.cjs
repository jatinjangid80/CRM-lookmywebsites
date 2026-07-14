const fs = require('fs');

let file = '/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.leads.tsx';
let content = fs.readFileSync(file, 'utf-8');

// 1. Remove from trip details
const tripDetailsBlock = `                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground">Section</label>
                      <select
                        value={tripDetails.leadSection}
                        onChange={(e) => setTripDetails({ ...tripDetails, leadSection: e.target.value })}
                        className="flex h-8 mt-1 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="B2C">B2C</option>
                        <option value="B2B">B2B</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>\n`;
content = content.replace(tripDetailsBlock, '');

// 2. Remove summary section 1
const summary1 = `                    {
                      icon: <Globe className="h-4 w-4 text-primary" />,
                      label: "Section",
                      val: lead.leadSection || "—",
                    },\n`;
content = content.replace(summary1, '');
content = content.replace(summary1, ''); // Just in case it's there twice

// 3. Remove CSV export header
content = content.replace(/      "Section",\n/g, '');

// 4. Remove Table Header
content = content.replace(/                    <th className="px-4 py-4 font-medium">Section<\/th>\n/g, '');

// 5. Remove Table Cell
const tableCell = `                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {l.leadSection ? (
                            <div className="inline-flex items-center rounded-full bg-secondary/80 px-3 py-1 text-sm font-semibold text-secondary-foreground shadow-sm">
                              {l.leadSection}
                            </div>
                          ) : (
                            <span className="text-muted-foreground font-medium text-sm">-</span>
                          )}
                        </td>\n`;
content = content.replace(tableCell, '');

fs.writeFileSync(file, content);
console.log("Done");
